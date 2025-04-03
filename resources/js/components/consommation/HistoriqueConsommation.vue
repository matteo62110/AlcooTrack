<template>
    <div class="history-section">
        <div class="history-header-container">
            <h2>Historique de consommation</h2>
            <button v-if="parseFloat(boissonStore.calculerAlcoolemie) > 0" @click="sauvegarderSession" class="save-btn">
                <span class="icon">💾</span>
                <span class="label">Sauvegarder session</span>
            </button>
        </div>

        <div v-if="boissonStore.historique.length > 0">
            <div v-for="(session, index) in boissonStore.historique" :key="index" class="history-item">
                <div class="history-header">
                    <div>
                        <h3>Session du {{ formatDate(session.date) }}</h3>
                        <p>Taux d'alcoolémie: {{ session.tauxAlcoolemie }} g/L</p>
                        <p>Temps d'élimination: {{ session.tempsElimination }}</p>
                        <p class="cout-info">Coût total: {{ session.coutTotal ? session.coutTotal.toFixed(2) + ' €' : '0.00 €' }}</p>
                    </div>
                    <button @click="boissonStore.supprimerSession(index)" class="delete-btn">
                        <span class="icon">🗑️</span>
                    </button>
                </div>
                <div class="history-boissons">
                    <div v-for="boisson in session.boissons" :key="boisson.id" class="history-boisson">
                        <span>{{ boisson.nom }}</span>
                        <span>x{{ boisson.quantite }}</span>
                        <span v-if="boisson.prix > 0" class="prix-unite">{{ boisson.prix.toFixed(2) }} €/u</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="empty-history">
            <p>Aucun historique disponible.</p>
            <p class="empty-info">Vos sessions seront sauvegardées ici pour suivre votre consommation dans le temps.</p>
        </div>
    </div>
</template>

<script setup>
import { useBoissonStore } from '../../stores/boissonStore';

const boissonStore = useBoissonStore();

function sauvegarderSession() {
    if (boissonStore.sauvegarderSession()) {
        // Afficher un message de confirmation si nécessaire
    }
}

function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}
</script>

<style scoped>
.history-section {
    margin-top: 2rem;
    padding: 1.5rem;
    border-radius: var(--radius);
    background-color: #f1f5f9;
}

.history-header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.save-btn {
    display: flex;
    align-items: center;
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: var(--radius);
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-weight: 500;
    gap: 0.5rem;
}

.history-item {
    margin-bottom: 1.5rem;
    padding: 1rem;
    background-color: #fff;
    border-radius: var(--radius);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.history-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
}

.history-header h3 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
}

.history-header p {
    margin: 0.2rem 0;
    color: var(--text-light);
}

.cout-info {
    font-weight: 600;
    color: var(--primary) !important;
    margin-top: 0.5rem !important;
}

.delete-btn {
    background: none;
    border: none;
    color: var(--danger);
    cursor: pointer;
    padding: 0.25rem;
    font-size: 1.2rem;
}

.history-boissons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.history-boisson {
    font-size: 0.9rem;
    padding: 0.25rem 0.5rem;
    background-color: #f1f5f9;
    border-radius: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.prix-unite {
    font-size: 0.85rem;
    color: var(--primary);
    font-weight: 600;
}

.empty-history {
    text-align: center;
    padding: 2rem 0;
    color: var(--text-light);
}

.empty-info {
    font-size: 0.9rem;
    margin-top: 0.5rem;
}
</style>
