import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useUserStore } from './userStore';

export const useBoissonStore = defineStore('boisson', () => {
    const userStore = useUserStore();

    const minuteurRef = ref(null);

    // Liste des boissons standards et personnalisées
    const boissons = ref([
        {
            id: 1,
            nom: "Bière (25cl)",
            degre: 5,
            volume: 25,
            quantite: 0,
            get equivalentAlcool() { return (this.volume * this.degre * 0.8 / 100).toFixed(1); },
            prix: 0
        },
        {
            id: 2,
            nom: "Vin (12cl)",
            degre: 12,
            volume: 12,
            quantite: 0,
            get equivalentAlcool() { return (this.volume * this.degre * 0.8 / 100).toFixed(1); },
            prix: 0
        },
        {
            id: 3,
            nom: "Whisky (4cl)",
            degre: 40,
            volume: 4,
            quantite: 0,
            get equivalentAlcool() { return (this.volume * this.degre * 0.8 / 100).toFixed(1); },
            prix: 0
        },
        {
            id: 4,
            nom: "Vodka (4cl)",
            degre: 40,
            volume: 4,
            quantite: 0,
            get equivalentAlcool() { return (this.volume * this.degre * 0.8 / 100).toFixed(1); },
            prix: 0
        },
        {
            id: 5,
            nom: "Champagne (10cl)",
            degre: 12.5,
            volume: 10,
            quantite: 0,
            get equivalentAlcool() { return (this.volume * this.degre * 0.8 / 100).toFixed(1); },
            prix: 0
        },
        {
            id: 6,
            nom: "Rhum (4cl)",
            degre: 40,
            volume: 4,
            quantite: 0,
            get equivalentAlcool() { return (this.volume * this.degre * 0.8 / 100).toFixed(1); },
            prix: 0
        }
    ]);

    // Fonction pour définir la référence au minuteur
    function setMinuteurRef(ref) {
        minuteurRef.value = ref;
    }

    // Calcul du coût total
    const coutTotal = computed(() => {
        return boissons.value.reduce((total, b) => {
            return total + (b.quantite || 0) * (parseFloat(b.prix) || 0);
        }, 0).toFixed(2);
    });

    function chargerDonneesUtilisateur() {
        console.log('Chargement des données utilisateur depuis le store local');
    }

    // Fonction pour ajouter une boisson personnalisée
    function ajouterBoissonPerso(boisson) {
        const maxId = boissons.value.reduce((max, b) => Math.max(max, b.id), 0);

        const nouvelleBoisson = {
            id: maxId + 1,
            nom: `${boisson.nom} (${boisson.volume}cl)`,
            degre: boisson.degre,
            volume: boisson.volume,
            quantite: 1,
            prix: boisson.prix || 0,
            get equivalentAlcool() { return (this.volume * this.degre * 0.8 / 100).toFixed(1); }
        };

        boissons.value.push(nouvelleBoisson);
    }

    // Modifier quantités et prix
    const minuteurActif = ref(false);

    function increment(id) {
        console.log("Incrémentation de la boisson ID:", id);
        const boisson = boissons.value.find(b => b.id === id);
        if (boisson) {
            console.log("Avant:", boisson.nom, boisson.quantite);
            boisson.quantite = (boisson.quantite || 0) + 1;
            console.log("Après:", boisson.nom, boisson.quantite);

            // Ne pas utiliser minuteurActif.value comme indicateur mais plutôt
            // demander au minuteur de gérer son propre état
            if (minuteurRef.value && typeof minuteurRef.value.nouvelleConsommation === 'function') {
                minuteurRef.value.nouvelleConsommation();
            }
        }
    }

    function decrement(boissonId) {
        const boisson = boissons.value.find(b => b.id === boissonId);
        if (boisson && boisson.quantite > 0) boisson.quantite -= 1;
    }

    function updatePrix(boissonId, prix) {
        const boisson = boissons.value.find(b => b.id === boissonId);
        if (boisson) boisson.prix = parseFloat(prix) || 0;
    }

    // Calcul d'alcoolémie et messages
    const calculerAlcoolemie = computed(() => {
        const coeff = userStore.sexe === 'homme' ? 0.68 : 0.55;
        const facteurCorrection = 10;

        const grammesAlcool = boissons.value.reduce((total, b) => {
            return total + (b.quantite || 0) * b.volume * (b.degre / 100) * 0.8;
        }, 0);

        const alcoolemie = (grammesAlcool / (userStore.poids * coeff)) * facteurCorrection;
        return alcoolemie.toFixed(2);
    });

    function messageAlcoolemie() {
        const taux = parseFloat(calculerAlcoolemie.value);
        if (taux >= 0.8) return "Attention! Taux d'alcool élevé - Ne conduisez pas!";
        if (taux >= 0.5) return "Au-dessus de la limite légale pour conduire";
        if (taux > 0.2) return "Consommation modérée - Prudence recommandée";
        return "Consommation légère";
    }

    function getMessageClass() {
        const taux = parseFloat(calculerAlcoolemie.value);
        if (taux >= 0.8) return "message-danger";
        if (taux >= 0.5) return "message-warning";
        return "message-safe";
    }

    function calculerTempsElimination() {
        const taux = parseFloat(calculerAlcoolemie.value);
        const tempsTotal = taux / 0.15;

        const heures = Math.floor(tempsTotal);
        const minutes = Math.round((tempsTotal - heures) * 60);

        if (minutes === 60) return `${heures + 1}h`;
        if (minutes === 0) return `${heures}h`;
        return `${heures}h${minutes}`;
    }

    // Historique
    const historique = ref(JSON.parse(localStorage.getItem('historiqueConsommation') || '[]'));

    function sauvegarderSession() {
        if (parseFloat(calculerAlcoolemie.value) <= 0) return;

        const boissonsConsommees = boissons.value
            .filter(b => b.quantite > 0)
            .map(b => ({
                id: b.id,
                nom: b.nom,
                quantite: b.quantite,
                prix: parseFloat(b.prix) || 0,
                equivalentAlcool: b.equivalentAlcool
            }));

        if (boissonsConsommees.length === 0) return;

        const session = {
            date: new Date().toISOString(),
            tauxAlcoolemie: parseFloat(calculerAlcoolemie.value),
            tempsElimination: calculerTempsElimination(),
            coutTotal: parseFloat(coutTotal.value),
            boissons: boissonsConsommees
        };

        historique.value.unshift(session);
        if (historique.value.length > 100) {
            historique.value = historique.value.slice(0, 100);
        }

        localStorage.setItem('historiqueConsommation', JSON.stringify(historique.value));
        return true;
    }

    function supprimerSession(index) {
        historique.value.splice(index, 1);
        localStorage.setItem('historiqueConsommation', JSON.stringify(historique.value));
    }

    return {
        boissons,
        coutTotal,
        ajouterBoissonPerso,
        increment,
        decrement,
        updatePrix,
        calculerAlcoolemie,
        messageAlcoolemie,
        getMessageClass,
        calculerTempsElimination,
        historique,
        sauvegarderSession,
        supprimerSession,
        setMinuteurRef,
        minuteurRef,
        chargerDonneesUtilisateur,
    };
});
