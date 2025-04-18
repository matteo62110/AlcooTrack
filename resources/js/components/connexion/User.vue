<template>
    <div class="profile-container">
        <h2>Mon Profil</h2>

        <div class="profile-card">
            <div class="stats-panel">
                <h4>Mes Statistiques</h4>
                <div class="stats-grid">
                    <div class="stat-box">
                        <div class="stat-value">{{ totalSessions }}</div>
                        <div class="stat-label">Sessions</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value">{{ totalConsommations }}</div>
                        <div class="stat-label">Boissons</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value">{{ totalEau }}</div>
                        <div class="stat-label">Verres d'eau</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value">{{ moyenneAlcoolemie }}</div>
                        <div class="stat-label">Alcoolémie moy.</div>
                    </div>
                </div>
            </div>

            <div class="profile-settings">
                <h4>Mes Paramètres</h4>
                <form @submit.prevent="saveSettings">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="poids">Poids (kg)</label>
                            <input
                                type="number"
                                id="poids"
                                v-model="settings.poids"
                                min="40"
                                max="150"
                                required
                            >
                        </div>
                        <div class="form-group">
                            <label for="sexe">Sexe</label>
                            <select id="sexe" v-model="settings.sexe" required>
                                <option value="homme">Homme</option>
                                <option value="femme">Femme</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Enregistrer les modifications</button>
                    </div>
                </form>
            </div>

            <div v-if="successMessage" class="success-message">
                {{ successMessage }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';
import { useBoissonStore } from '../../stores/boissonStore';

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();
const boissonStore = useBoissonStore();
const successMessage = ref('');

// Paramètres utilisateur
const settings = ref({
    poids: userStore.poids,
    sexe: userStore.sexe
});

// Statistiques basées sur l'historique de l'utilisateur connecté
const totalSessions = computed(() => boissonStore.historique.length);
const totalConsommations = computed(() =>
    boissonStore.historique.reduce((total, session) =>
        total + session.boissons.reduce((t, b) => t + b.quantite, 0), 0)
);

// Pour le compteur d'eau, récupérer les données spécifiques à l'utilisateur
const totalEau = computed(() => {
    const prefix = authStore.isInitialized.value ?
        `user_${localStorage.getItem('userId') || 'default'}_` : 'guest_';
    const savedState = localStorage.getItem(`${prefix}minuteurConsommation`);
    return savedState ? JSON.parse(savedState).waterCount || 0 : 0;
});

// Calcul de l'alcoolémie moyenne des sessions
const moyenneAlcoolemie = computed(() => {
    if (boissonStore.historique.length === 0) return '0.00';

    const total = boissonStore.historique.reduce((sum, session) => {
        return sum + parseFloat(session.tauxAlcoolemie || 0);
    }, 0);

    return (total / boissonStore.historique.length).toFixed(2);
});

// Enregistrer les paramètres
function saveSettings() {
    userStore.updateSettings({
        poids: parseInt(settings.value.poids),
        sexe: settings.value.sexe
    });

    successMessage.value = 'Paramètres enregistrés avec succès!';

    setTimeout(() => {
        successMessage.value = '';
    }, 3000);
}

// S'assurer que les données sont chargées correctement
onMounted(() => {
    console.log('Montage du composant User');

    settings.value.poids = userStore.poids;
    settings.value.sexe = userStore.sexe;
});
</script>

<style scoped>
.profile-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 0 1rem;
}

.profile-container h2 {
    text-align: center;
    margin-bottom: 2rem;
    color: var(--primary-color, #4a6da7);
}

.profile-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.profile-header {
    display: flex;
    align-items: center;
    padding: 2rem;
    border-bottom: 1px solid #dee2e6;
    position: relative;
}

.profile-header .avatar {
    width: 80px;
    height: 80px;
    background-color: var(--primary-color, #4a6da7);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.75rem;
    font-weight: 600;
}

.user-info {
    margin-left: 1.5rem;
    flex-grow: 1;
}

.user-info h3 {
    margin-bottom: 0.25rem;
}

.user-info p {
    color: #6c757d;
}

.logout-btn {
    background-color: transparent;
    border: 1px solid #dee2e6;
    color: #6c757d;
    padding: 0.4rem 0.75rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: absolute;
    right: 2rem;
    top: 2rem;
}

.logout-btn:hover {
    background-color: #f5f5f5;
    color: #e74c3c;
    border-color: #e74c3c;
}

.stats-panel {
    padding: 2rem;
    border-bottom: 1px solid #dee2e6;
}

.stats-panel h4 {
    margin-bottom: 1.5rem;
    text-align: center;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1.5rem;
}

.stat-box {
    text-align: center;
    padding: 1rem;
    background-color: #f8f9fa;
    border-radius: 4px;
}

.stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary-color, #4a6da7);
    line-height: 1;
    margin-bottom: 0.5rem;
}

.stat-label {
    font-size: 0.875rem;
    color: #6c757d;
}

.profile-settings {
    padding: 2rem;
}

.profile-settings h4 {
    margin-bottom: 1.5rem;
    text-align: center;
}

.form-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 1.5rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus {
    outline: none;
    border-color: var(--primary-color, #4a6da7);
    box-shadow: 0 0 0 3px rgba(74, 109, 167, 0.1);
}

.form-actions {
    text-align: center;
    margin-top: 2rem;
}

.btn-primary {
    background-color: var(--primary-color, #4a6da7);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: background-color 0.2s ease, transform 0.2s ease;
}

.btn-primary:hover {
    background-color: var(--accent-color, #3498db);
    transform: translateY(-2px);
}

.success-message {
    background-color: #d1fae5;
    color: #065f46;
    padding: 1rem;
    margin: 1rem 2rem 2rem;
    border-radius: 4px;
    text-align: center;
    font-weight: 500;
}

@media (max-width: 768px) {
    .profile-header {
        flex-direction: column;
        text-align: center;
    }

    .user-info {
        margin-left: 0;
        margin-top: 1rem;
    }

    .profile-header .logout-btn {
        position: static;
        margin-top: 1rem;
    }

    .stats-grid {
        grid-template-columns: 1fr 1fr;
    }
}
</style>
