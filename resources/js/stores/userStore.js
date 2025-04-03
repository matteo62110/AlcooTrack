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
        // Dans une vraie application, vous appelleriez votre API ici
        if (authStore.isAuthenticated) {
            console.log('Synchronisation des paramètres avec le serveur');
            // await fetch('/api/user/settings', {...})
        }
    }

    return {
        poids,
        sexe,
        updateSettings,
        syncSettings
    };
});
