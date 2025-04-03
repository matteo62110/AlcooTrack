<template>
    <div class="formulaire-boisson">
        <h2>Ajouter une boisson personnalisée</h2>
        <form @submit.prevent="ajouterBoisson" class="form-container">
            <div class="form-group">
                <label for="nom">Nom de la boisson</label>
                <input type="text" id="nom" v-model="nouvelleBoisson.nom" required>
            </div>

            <div class="form-group">
                <label for="degre">Degré d'alcool (%)</label>
                <input type="number" id="degre" v-model="nouvelleBoisson.degre" min="0" max="100" step="0.1" required>
            </div>

            <div class="form-group">
                <label for="volume">Volume (cl)</label>
                <input type="number" id="volume" v-model="nouvelleBoisson.volume" min="0" required>
            </div>

            <div class="form-group">
                <label for="prix">Prix (€)</label>
                <input type="number" id="prix" v-model="nouvelleBoisson.prix" min="0" step="0.01">
            </div>

            <button type="submit" class="btn-submit">Ajouter</button>
        </form>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useBoissonStore } from '../../stores/boissonStore';

const boissonStore = useBoissonStore();

const nouvelleBoisson = reactive({
    nom: '',
    degre: 5,
    volume: 25,
    prix: 0
});

function ajouterBoisson() {
    boissonStore.ajouterBoissonPerso({...nouvelleBoisson});

    // Réinitialiser le formulaire
    nouvelleBoisson.nom = '';
    nouvelleBoisson.degre = 5;
    nouvelleBoisson.volume = 25;
    nouvelleBoisson.prix = 0;
}
</script>

<style scoped>
.formulaire-boisson {
    margin: 2rem 0;
    padding: 1.5rem;
    background-color: #f1f5f9;
    border-radius: var(--radius);
}

.form-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

label {
    font-weight: 500;
    font-size: 0.95rem;
}

input {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: var(--radius);
}

.btn-submit {
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: var(--radius);
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-weight: 500;
    grid-column: 1 / -1;
    margin-top: 0.5rem;
}
</style>
