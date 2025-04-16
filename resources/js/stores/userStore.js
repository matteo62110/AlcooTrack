import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './authStore';

export const useUserStore = defineStore('user', () => {
    const authStore = useAuthStore();

    // Récupérer depuis localStorage ou utiliser des valeurs par défaut
    const poids = ref(parseInt(localStorage.getItem('userPoids')) || 70);
    const sexe = ref(localStorage.getItem('userSexe') || 'homme');

    // Mise à jour des paramètres
    function updateSettings(settings) {
        if (settings.poids) {
            poids.value = settings.poids;
            localStorage.setItem('userPoids', poids.value.toString());
        }

        if (settings.sexe) {
            sexe.value = settings.sexe;
            localStorage.setItem('userSexe', sexe.value);
        }
    }

    // Synchroniser avec le serveur
    async function syncSettings() {
        if (authStore.isAuthenticated) {
            console.log('Synchronisation des paramètres avec le serveur');
            // Exemple d'appel API (à adapter selon votre backend)
            // await fetch('/api/user/settings', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ poids: poids.value, sexe: sexe.value })
            // });
        }
    }

    // Charger les paramètres utilisateur depuis le serveur
    async function chargerParametresUtilisateur() {
        if (authStore.isAuthenticated) {
            console.log('Chargement des paramètres utilisateur depuis le serveur');
            // Exemple d'appel API (à adapter selon votre backend)
            // const response = await fetch('/api/user/settings');
            // const data = await response.json();
            // updateSettings(data);
        }
    }

    return {
        poids,
        sexe,
        updateSettings,
        syncSettings,
        chargerParametresUtilisateur
    };
});
