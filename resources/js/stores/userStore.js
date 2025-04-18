import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
    const nom = ref(localStorage.getItem('userNom') || '');
    const poids = ref(parseInt(localStorage.getItem('userPoids') || '70'));
    const sexe = ref(localStorage.getItem('userSexe') || 'homme');

    function sauvegarderUtilisateur(userData) {
        console.log('Sauvegarde utilisateur:', userData);
        if (userData.name) {
            nom.value = userData.name;
            localStorage.setItem('userNom', userData.name);
        }
    }

    function updateSettings(settings) {
        if (settings.poids) {
            poids.value = settings.poids;
            localStorage.setItem('userPoids', settings.poids);
        }

        if (settings.sexe) {
            sexe.value = settings.sexe;
            localStorage.setItem('userSexe', settings.sexe);
        }
    }

    return {
        nom,
        poids,
        sexe,
        sauvegarderUtilisateur,
        updateSettings
    };
});
