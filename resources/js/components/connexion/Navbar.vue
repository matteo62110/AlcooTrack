<template>
    <nav class="main-navbar">
        <div class="logo">
            <router-link to="/">AlcooTrack</router-link>
        </div>
        <div class="nav-links">
            <router-link to="/">Accueil</router-link>
            <router-link v-if="isAuthenticated" to="/consumption">Consommation</router-link>
            <router-link v-if="isAuthenticated" to="/minuteur">Minuteur</router-link>
        </div>
        <div class="auth-links">
            <template v-if="isAuthenticated">
                <router-link to="/profile" class="profile-link">
                    <span class="avatar">{{ initiales }}</span>
                    <span class="username">{{ user?.name }}</span>
                </router-link>
                <button @click="logout" class="logout-btn">Déconnexion</button>
            </template>
            <template v-else>
                <router-link to="/login">Connexion</router-link>
            </template>
        </div>
    </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.user);

const initiales = computed(() => {
    if (!user.value?.name) return '?';
    return user.value.name.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
});

function logout() {
    authStore.logout();
    router.push('/login');
}
</script>
