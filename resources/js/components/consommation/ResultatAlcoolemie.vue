<template>
    <div class="alcoolemie-result">
        <h2>Estimation d'alcoolémie</h2>
        <p>Taux: {{ boissonStore.calculerAlcoolemie }} g/L</p>
        <p :class="boissonStore.getMessageClass()">{{ boissonStore.messageAlcoolemie() }}</p>
        <p>Temps d'élimination estimé: {{ boissonStore.calculerTempsElimination() }}</p>
    </div>
</template>

<script setup>
import { useBoissonStore } from '../../stores/boissonStore';

const boissonStore = useBoissonStore();
</script>

<style scoped>
.alcoolemie-result {
    margin-top: 2rem;
    padding: 1.5rem;
    border-radius: var(--radius);
    background-color: #f1f5f9;
}

.alcoolemie-result p:first-of-type {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
}
</style>
