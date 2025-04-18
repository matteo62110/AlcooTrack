<template>
    <div class="dashboard">
        <div class="dashboard-header">
            <h1>Bienvenue sur AlcooTrack</h1>
            <p class="subtitle">Votre compagnon pour une consommation responsable</p>
        </div>

        <div class="welcome-user">
            <h2>Bienvenue sur l'application</h2>
            <router-link to="/consumption" class="btn-primary">
                Accéder à mon suivi
            </router-link>
        </div>

        <div class="features">
            <h3>Fonctionnalités principales</h3>
            <div class="feature-grid">
                <div class="feature-card">
                    <div class="feature-icon">📊</div>
                    <h4>Suivi d'alcoolémie</h4>
                    <p>Suivez votre taux d'alcoolémie en temps réel</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">⏱️</div>
                    <h4>Minuteur intelligent</h4>
                    <p>Rappels pour boire de l'eau</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🔒</div>
                    <h4>Mode sécurité</h4>
                    <p>Alertes et conseils personnalisés</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '../../stores/authStore';

const authStore = useAuthStore();
</script>
