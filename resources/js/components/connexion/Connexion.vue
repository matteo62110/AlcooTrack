<template>
    <div class="auth-container">
        <div class="auth-panel">
            <h2>{{ isLogin ? 'Connexion' : 'Inscription' }}</h2>

            <form @submit.prevent="submitForm">
                <div class="form-group" v-if="!isLogin">
                    <label for="name">Nom</label>
                    <input type="text" id="name" v-model="form.name" required>
                </div>

                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" v-model="form.email" required>
                </div>

                <div class="form-group">
                    <label for="password">Mot de passe</label>
                    <input type="password" id="password" v-model="form.password" required>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn-primary">
                        {{ isLogin ? 'Se connecter' : 'S\'inscrire' }}
                    </button>
                </div>

                <div class="form-toggle">
                    {{ isLogin ? 'Pas encore de compte?' : 'Déjà un compte?' }}
                    <button type="button" class="btn-text" @click="toggleAuthMode">
                        {{ isLogin ? 'S\'inscrire' : 'Se connecter' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();
const isLogin = ref(true);
const error = ref(null);

const form = reactive({
    name: '',
    email: '',
    password: ''
});

function toggleAuthMode() {
    isLogin.value = !isLogin.value;
    error.value = null;
}

async function submitForm() {
    try {
        if (isLogin.value) {
            await authStore.login(form.email, form.password);
        } else {
            await authStore.register(form.name, form.email, form.password);
        }
        router.push('/');
    } catch (err) {
        error.value = err.message || 'Une erreur est survenue';
    }
}
</script>
