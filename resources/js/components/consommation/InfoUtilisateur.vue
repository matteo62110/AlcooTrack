<template>
    <div class="user-info">
        <h2>Vos informations</h2>
        <div>
            <div>Sexe: {{ userStore.sexe === 'homme' ? 'Homme' : 'Femme' }}</div>
            <div>Poids: {{ userStore.poids }} kg</div>
        </div>
    </div>
</template>

<script setup>
import { useUserStore } from '../../stores/userStore';

const userStore = useUserStore();
</script>
