import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));
    const token = ref(localStorage.getItem('token'));

    const isAuthenticated = computed(() => !!token.value);

    async function register(name, email, password) {
        // Simuler une requête API pour l'enregistrement
        // Dans une vraie application, vous feriez un appel fetch ou axios
        return new Promise((resolve) => {
            setTimeout(() => {
                const newUser = { id: Date.now(), name, email };
                user.value = newUser;
                token.value = `token_${Date.now()}`;

                localStorage.setItem('user', JSON.stringify(newUser));
                localStorage.setItem('token', token.value);

                resolve(newUser);
            }, 500);
        });
    }

    async function login(email, password) {
        // Simuler une requête API pour la connexion
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simuler un utilisateur existant
                const mockUser = {
                    id: Date.now(),
                    name: 'Utilisateur Test',
                    email
                };

                user.value = mockUser;
                token.value = `token_${Date.now()}`;

                localStorage.setItem('user', JSON.stringify(mockUser));
                localStorage.setItem('token', token.value);

                resolve(mockUser);
            }, 500);
        });
    }

    function logout() {
        user.value = null;
        token.value = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }

    return {
        user,
        token,
        isAuthenticated,
        register,
        login,
        logout
    };
});
