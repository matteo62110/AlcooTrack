<template>
    <div class="profile-container">
        <h2>Mon profil</h2>

        <div class="profile-card">
            <div class="profile-header">
                <div class="avatar">{{ initiales }}</div>
                <div class="user-info">
                    <h3>{{ user.name }}</h3>
                    <p>{{ user.email }}</p>
                </div>
                <button @click="logout" class="logout-btn">
                    <span class="icon">🚪</span> Déconnexion
                </button>
            </div>

            <div class="stats-panel">
                <h4>Mes statistiques</h4>
                <div class="stats-grid">
                    <div class="stat-box">
                        <div class="stat-value">{{ totalSessions }}</div>
                        <div class="stat-label">Sessions enregistrées</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value">{{ totalConsommations }}</div>
                        <div class="stat-label">Consommations</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value">{{ totalEau }}</div>
                        <div class="stat-label">Verres d'eau</div>
                    </div>
                </div>
            </div>

            <div class="profile-settings">
                <h4>Paramètres personnels</h4>
                <form @submit.prevent="saveSettings">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="poids">Poids (kg)</label>
                            <input type="number" id="poids" v-model="userSettings.poids" min="40" max="150">
                        </div>
                        <div class="form-group">
                            <label for="sexe">Sexe</label>
                            <select id="sexe" v-model="userSettings.sexe">
                                <option value="homme">Homme</option>
                                <option value="femme">Femme</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Enregistrer</button>
                    </div>
                </form>
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

const user = computed(() => authStore.user);
const userSettings = ref({
    poids: userStore.poids,
    sexe: userStore.sexe
});

const initiales = computed(() => {
    if (!user.value?.name) return '?';
    return user.value.name.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
});

// Statistiques basées sur l'historique
const totalSessions = computed(() => boissonStore.historique.length);
const totalConsommations = computed(() =>
    boissonStore.historique.reduce((total, session) =>
        total + session.boissons.reduce((t, b) => t + b.quantite, 0), 0)
);
const totalEau = computed(() =>
    JSON.parse(localStorage.getItem('minuteurConsommation'))?.waterCount || 0
);

function saveSettings() {
    userStore.updateSettings(userSettings.value);
}

function logout() {
    authStore.logout();
    router.push('/login');
}

onMounted(() => {
    if (!authStore.isAuthenticated) {
        router.push('/login');
    }
});
</script>
