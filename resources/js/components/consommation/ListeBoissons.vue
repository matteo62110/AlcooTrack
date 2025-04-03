<template>
    <div class="liste-boissons">
        <h2>Liste des boissons</h2>
        <div class="boissons-container">
            <div v-for="boisson in boissonStore.boissons" :key="boisson.id" class="boisson-item">
                <div class="boisson-info">
                    <h3>{{ boisson.nom }}</h3>
                    <p>{{ boisson.degre }}°, {{ boisson.volume }}cl</p>
                    <div class="prix-input">
                        <label :for="`prix-${boisson.id}`">Prix (€) :</label>
                        <input
                            type="number"
                            :id="`prix-${boisson.id}`"
                            :value="boisson.prix"
                            min="0"
                            step="0.01"
                            @input="updatePrix(boisson.id, $event)"
                        />
                    </div>
                </div>
                <div class="boisson-actions">
                    <button @click="boissonStore.decrement(boisson.id)" class="btn-outline">-</button>
                    <span class="quantite">{{ boisson.quantite }}</span>
                    <button @click="boissonStore.increment(boisson.id)" class="btn-outline">+</button>
                </div>
            </div>
        </div>

        <!-- Affichage du coût total -->
        <div class="cout-total" v-if="parseFloat(boissonStore.coutTotal) > 0">
            <h3>Coût total de la consommation</h3>
            <p>{{ boissonStore.coutTotal }} €</p>
        </div>
    </div>
</template>

<script setup>
import { useBoissonStore } from '../../stores/boissonStore';

const boissonStore = useBoissonStore();

function updatePrix(boissonId, event) {
    const prix = event.target.value;
    boissonStore.updatePrix(boissonId, prix);
}
</script>

<style scoped>
.liste-boissons {
    margin-bottom: 2rem;
}

.boissons-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.boisson-item {
    border: 1px solid #e2e8f0;
    border-radius: var(--radius);
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
}

.boisson-info {
    flex: 1;
}

.boisson-info h3 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
}

.boisson-info p {
    color: var(--text-light);
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
}

.boisson-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.btn-outline {
    background: none;
    border: 1px solid #e2e8f0;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    font-size: 1.2rem;
    line-height: 1;
    cursor: pointer;
    color: var(--primary);
}

.quantite {
    font-weight: 600;
    min-width: 20px;
    text-align: center;
}

.prix-input {
    margin-top: 0.5rem;
    display: flex;
    align-items: center;
}

.prix-input label {
    margin-right: 0.5rem;
    font-size: 0.9rem;
}

.prix-input input {
    width: 70px;
    padding: 4px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.cout-total {
    margin-top: 1.5rem;
    padding: 1rem;
    background-color: #f1f5f9;
    border-radius: var(--radius);
    text-align: center;
}

.cout-total p {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--primary);
    margin-top: 0.5rem;
}
</style>
