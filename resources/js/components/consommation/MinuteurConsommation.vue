<template>
    <div class="minuteur-container" :class="{ 'is-active': isRunning }">
        <h2>Minuteur de consommation</h2>

        <div class="minuteur-panel">
            <div class="time-display">
                <div class="time-value">{{ formatTime }}</div>
                <div class="time-label">depuis dernière consommation</div>
            </div>

            <div class="recommendation" :class="recommendationClass">
                <div class="icon">{{ recommendationIcon }}</div>
                <div class="text">{{ recommendation }}</div>
            </div>

            <div class="buttons-container">
                <button @click="boireEau" class="water-button" :disabled="waterIntakeConfirmed">
                    <span class="icon">💧</span>
                    <span class="label">J'ai bu de l'eau</span>
                </button>

                <button @click="nouvelleConsommation" class="drink-button">
                    <span class="icon">🍺</span>
                    <span class="label">Nouvelle consommation</span>
                </button>
            </div>

            <div class="stats-container">
                <div class="stat-item">
                    <div class="stat-value">{{ consommationsCount }}</div>
                    <div class="stat-label">Consommations</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">{{ waterCount }}</div>
                    <div class="stat-label">Verres d'eau</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">{{ rythmeActuel }}</div>
                    <div class="stat-label">Rythme actuel</div>
                </div>
            </div>
        </div>

        <div class="settings">
            <h3>Paramètres</h3>
            <div class="setting-item">
                <label for="tempsRecommande">Temps recommandé entre consommations (min)</label>
                <input type="number" id="tempsRecommande" v-model="tempsRecommande" min="30" max="120" step="5">
            </div>
            <div class="setting-item">
                <label for="rappelEau">Rappel eau (min après consommation)</label>
                <input type="number" id="rappelEau" v-model="rappelEau" min="10" max="60" step="5">
            </div>
            <div class="setting-item">
                <label for="notifications">Notifications</label>
                <div class="toggle">
                    <input type="checkbox" id="notifications" v-model="notificationsEnabled">
                    <label for="notifications" class="toggle-label"></label>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

// État du minuteur
const isRunning = ref(false);
const startTime = ref(null);
const elapsedTime = ref(0);
const lastDrinkTime = ref(null);
const waterIntakeConfirmed = ref(false);
const intervalId = ref(null);
const consommationsCount = ref(0);
const waterCount = ref(0);
const timerID = ref(null); // Pour stocker l'ID des timers de notification

// Paramètres configurables (en minutes)
const tempsRecommande = ref(60); // Une consommation par heure recommandée
const rappelEau = ref(15); // Rappel d'eau 15 minutes après la consommation
const notificationsEnabled = ref(true);

// Calcul du temps formaté
const formatTime = computed(() => {
    const minutes = Math.floor(elapsedTime.value / 60);
    const seconds = elapsedTime.value % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

// Calcul du rythme actuel de consommation
const rythmeActuel = computed(() => {
    if (consommationsCount.value <= 1) return 'N/A';

    const tempsTotal = Math.floor((Date.now() - startTime.value) / 1000 / 60);

    if (tempsTotal < 1) return 'N/A';

    const consommationsParHeure = (consommationsCount.value / tempsTotal * 60).toFixed(1);
    return `${consommationsParHeure}/h`;
});

// Message de recommandation
const recommendation = computed(() => {
    if (!isRunning.value) return "Démarrez le minuteur avec votre première consommation";

    const timeInMinutes = Math.floor(elapsedTime.value / 60);

    if (timeInMinutes < rappelEau.value && !waterIntakeConfirmed.value) {
        return `Pensez à boire de l'eau dans ${rappelEau.value - timeInMinutes} minutes`;
    } else if (timeInMinutes < rappelEau.value && waterIntakeConfirmed.value) {
        return "Bien ! Continuez à vous hydrater régulièrement";
    } else if (timeInMinutes < tempsRecommande.value && waterIntakeConfirmed.value) {
        return `Attendre encore ${tempsRecommande.value - timeInMinutes} minutes avant de consommer`;
    } else if (timeInMinutes < tempsRecommande.value && !waterIntakeConfirmed.value) {
        return "N'oubliez pas de boire un verre d'eau !";
    } else {
        return "Vous pouvez consommer à nouveau si vous le souhaitez";
    }
});

// Classe CSS pour les recommandations
const recommendationClass = computed(() => {
    if (!isRunning.value) return 'neutral';

    const timeInMinutes = Math.floor(elapsedTime.value / 60);

    if (timeInMinutes >= tempsRecommande.value && waterIntakeConfirmed.value) {
        return 'good';
    } else if (timeInMinutes < tempsRecommande.value && waterIntakeConfirmed.value) {
        return 'neutral';
    } else {
        return 'warning';
    }
});

// Icône pour les recommandations
const recommendationIcon = computed(() => {
    if (!isRunning.value) return '🔄';

    const timeInMinutes = Math.floor(elapsedTime.value / 60);

    if (timeInMinutes >= tempsRecommande.value && waterIntakeConfirmed.value) {
        return '✅';
    } else if (timeInMinutes < rappelEau.value && !waterIntakeConfirmed.value) {
        return '💧';
    } else if (timeInMinutes < tempsRecommande.value) {
        return '⏱️';
    } else {
        return '🍺';
    }
});

// Fonctions de contrôle du minuteur
function startTimer() {
    const now = Date.now();
    if (!startTime.value) startTime.value = now;
    lastDrinkTime.value = now;
    elapsedTime.value = 0;
    waterIntakeConfirmed.value = false;

    if (!isRunning.value) {
        isRunning.value = true;
        intervalId.value = setInterval(updateTimer, 1000);
    }
}

const notificationsSent = ref({
    water: false,
    timeUp: false
});

function updateTimer() {
    elapsedTime.value = Math.floor((Date.now() - lastDrinkTime.value) / 1000);

    // Vérifier si nous devons envoyer une notification pour l'eau
    const timeInMinutes = Math.floor(elapsedTime.value / 60);

    // Notification pour l'eau : seulement si elle n'a pas déjà été envoyée
    if (notificationsEnabled.value &&
        timeInMinutes === rappelEau.value &&
        !waterIntakeConfirmed.value &&
        !notificationsSent.value.water) {

        sendNotification("Pensez à boire de l'eau !", "Hydratez-vous pour diminuer les effets de l'alcool.");
        notificationsSent.value.water = true;
    }

    // Notification quand l'attente recommandée est atteinte
    if (notificationsEnabled.value &&
        timeInMinutes === tempsRecommande.value &&
        waterIntakeConfirmed.value &&
        !notificationsSent.value.timeUp) {

        sendNotification("Temps d'attente terminé", "Vous pouvez consommer une nouvelle boisson si vous le souhaitez.");
        notificationsSent.value.timeUp = true;
    }
}

function nouvelleConsommation() {
    // Réinitialiser le suivi des notifications envoyées
    notificationsSent.value.water = false;
    notificationsSent.value.timeUp = false;

    if (isRunning.value) {
        consommationsCount.value++;
    }
    startTimer();
}

function boireEau() {
    waterIntakeConfirmed.value = true;
    waterCount.value++;

    if (notificationsEnabled.value) {
        sendNotification("Bien joué !", "Continuer à vous hydrater régulièrement aide à réduire les effets de l'alcool.");
    }
}

function sendNotification(title, body) {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
        new Notification(title, { body, icon: '/logo.png' });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification(title, { body, icon: '/logo.png' });
            }
        });
    }
}

// Gestion du cycle de vie du composant
onMounted(() => {
    // Demander la permission pour les notifications
    if ("Notification" in window && notificationsEnabled.value) {
        Notification.requestPermission();
    }

    // Restaurer les données sauvegardées si elles existent
    const savedData = localStorage.getItem('minuteurConsommation');
    if (savedData) {
        const data = JSON.parse(savedData);
        if (data.isRunning && data.lastDrinkTime) {
            startTime.value = data.startTime;
            lastDrinkTime.value = data.lastDrinkTime;
            waterIntakeConfirmed.value = data.waterIntakeConfirmed;
            consommationsCount.value = data.consommationsCount;
            waterCount.value = data.waterCount;
            isRunning.value = true;
            elapsedTime.value = Math.floor((Date.now() - data.lastDrinkTime) / 1000);
            intervalId.value = setInterval(updateTimer, 1000);
        }

        // Restaurer les paramètres si disponibles
        if (data.tempsRecommande) tempsRecommande.value = data.tempsRecommande;
        if (data.rappelEau) rappelEau.value = data.rappelEau;
        if (data.notificationsEnabled !== undefined) notificationsEnabled.value = data.notificationsEnabled;
    }
});

onUnmounted(() => {
    if (intervalId.value) clearInterval(intervalId.value);
    if (timerID.value) clearTimeout(timerID.value);
});

// Sauvegarder l'état quand des changements sont effectués
watch([isRunning, lastDrinkTime, waterIntakeConfirmed, consommationsCount, waterCount, tempsRecommande, rappelEau, notificationsEnabled], () => {
    const dataToSave = {
        isRunning: isRunning.value,
        startTime: startTime.value,
        lastDrinkTime: lastDrinkTime.value,
        waterIntakeConfirmed: waterIntakeConfirmed.value,
        consommationsCount: consommationsCount.value,
        waterCount: waterCount.value,
        tempsRecommande: tempsRecommande.value,
        rappelEau: rappelEau.value,
        notificationsEnabled: notificationsEnabled.value
    };
    localStorage.setItem('minuteurConsommation', JSON.stringify(dataToSave));
}, { deep: true });

// Méthode pour réinitialiser le minuteur
const resetMinuteur = () => {
    nouvelleConsommation();
    console.log("Minuteur réinitialisé - nouvelle consommation enregistrée");
};

// Méthode pour annuler explicitement le minuteur
const annulerMinuteur = () => {
    if (timerID.value) {
        clearTimeout(timerID.value);
        timerID.value = null;
    }
};

// Exposer ces méthodes
defineExpose({ resetMinuteur, nouvelleConsommation, annulerMinuteur });
</script>

<style scoped>
.minuteur-container {
    margin-top: 2rem;
    padding: 1.5rem;
    border-radius: var(--radius);
    background-color: #f0f9ff;
    border: 1px solid #bae6fd;
    transition: all 0.3s ease;
}

.minuteur-container.is-active {
    border: 1px solid var(--primary);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.minuteur-panel {
    margin-top: 1rem;
    background-color: white;
    border-radius: var(--radius);
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.time-display {
    text-align: center;
    margin-bottom: 1.5rem;
}

.time-value {
    font-size: 3rem;
    font-weight: 700;
    color: var(--primary);
    font-family: monospace;
}

.time-label {
    color: var(--text-light);
    font-size: 0.9rem;
    margin-top: -0.5rem;
}

.recommendation {
    background-color: #f3f4f6;
    padding: 1rem;
    border-radius: var(--radius);
    margin: 1.5rem 0;
    display: flex;
    align-items: center;
    text-align: center;
}

.recommendation .icon {
    font-size: 1.5rem;
    margin-right: 1rem;
}

.recommendation .text {
    font-weight: 500;
}

.recommendation.good {
    background-color: #d1fae5;
    color: #065f46;
}

.recommendation.warning {
    background-color: #fef3c7;
    color: #92400e;
}

.recommendation.neutral {
    background-color: #e5e7eb;
    color: #4b5563;
}

.buttons-container {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.buttons-container button {
    flex: 1;
    padding: 0.75rem;
    border: none;
    border-radius: var(--radius);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-weight: 500;
    gap: 0.5rem;
    transition: all 0.2s ease;
}

.buttons-container button:hover {
    transform: translateY(-2px);
}

.water-button {
    background-color: #bfdbfe;
    color: #1e40af;
}

.water-button:disabled {
    background-color: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;
}

.drink-button {
    background-color: var(--primary);
    color: white;
}

.stats-container {
    display: flex;
    justify-content: space-between;
}

.stat-item {
    text-align: center;
    padding: 1rem;
    background-color: #f9fafb;
    border-radius: var(--radius);
    flex: 1;
    margin: 0 0.5rem;
}

.stat-value {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--primary);
}

.stat-label {
    font-size: 0.85rem;
    color: var(--text-light);
    margin-top: 0.25rem;
}

.settings {
    margin-top: 2rem;
    background-color: white;
    border-radius: var(--radius);
    padding: 1.5rem;
}

.settings h3 {
    margin-bottom: 1rem;
    color: var(--text);
    font-size: 1.1rem;
    font-weight: bold;
}

.setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f3f4f6;
}

.setting-item label {
    flex: 3;
    font-size: 0.95rem;
}

.setting-item input[type="number"] {
    width: 80px;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: var(--radius);
    text-align: center;
}

/* Toggle switch for notifications */
.toggle {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 30px;
}

.toggle input {
    opacity: 0;
    width: 0;
    height: 0;
}

.toggle-label {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #e5e7eb;
    transition: .4s;
    border-radius: 34px;
}

.toggle-label:before {
    position: absolute;
    content: "";
    height: 22px;
    width: 22px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

.toggle input:checked + .toggle-label {
    background-color: var(--primary);
}

.toggle input:checked + .toggle-label:before {
    transform: translateX(30px);
}

@media (max-width: 768px) {
    .buttons-container {
        flex-direction: column;
    }

    .stats-container {
        flex-direction: column;
        gap: 0.5rem;
    }

    .stat-item {
        margin: 0.25rem 0;
    }

    .setting-item {
        flex-direction: column;
        align-items: flex-start;
    }

    .setting-item label {
        margin-bottom: 0.5rem;
    }
}
</style>
