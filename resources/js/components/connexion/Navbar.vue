<template>
    <nav class="main-navbar">
        <div class="logo">
            <router-link to="/">AlcooTrack</router-link>
        </div>
        <div class="nav-links">
            <router-link to="/">Accueil</router-link>
            <router-link to="/consumption">Consommation</router-link>
            <router-link to="/minuteur">Minuteur</router-link>
        </div>
        <div class="auth-links">
            <router-link to="/profile" class="profile-link">
                Statistiques
            </router-link>
        </div>
    </nav>
</template>

<script setup>
</script>
