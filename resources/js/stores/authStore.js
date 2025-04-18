import { defineStore } from 'pinia';
import {ref} from "vue";

export const useAuthStore = defineStore('auth', () => {
    // Fonction qui permet de savoir qu'on est toujours authentifié
    const isInitialized = ref(true);

    return {
        isInitialized
    };
});
