<template>
    <div>
        <h1>Estimation du taux d'alcoolémie</h1>
        <form @submit.prevent="submitForm">
            <div>
                <label for="sexe">Sexe</label>
                <select v-model="sexe" required>
                    <option value="homme">Homme</option>
                    <option value="femme">Femme</option>
                </select>
            </div>

            <div>
                <label for="poids">Poids (en kg)</label>
                <input type="number" v-model="poids" required />
            </div>

            <div>
                <label for="boisson">Boisson choisie</label>
                <select v-model="boisson" required>
                    <option value="biere">Bière</option>
                    <option value="vin">Vin</option>
                    <option value="vodka">Vodka</option>
                </select>
            </div>

            <div>
                <label for="quantite">Quantité (en cl)</label>
                <input type="number" v-model="quantite" required />
            </div>

            <button type="submit">Calculer</button>
        </form>

        <div v-if="resultat !== null">
            <p>Taux d'alcoolémie estimé : {{ resultat }} g/L</p>
            <p>Temps pour être sobre : {{ tempsSobriete }} heures</p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            sexe: 'homme',
            poids: 0,
            boisson: 'biere',
            quantite: 0,
            resultat: null,
            tempsSobriete: null,
        };
    },
    methods: {
        submitForm() {
            // Appeler une méthode pour calculer le taux d'alcoolémie
            this.calculerAlcoolemie();
        },
        calculerAlcoolemie() {
            // Implémenter la formule pour le taux d'alcoolémie ici
            let taux = 0;

            // Exemple de calcul basique (formule de Widmark)
            if (this.sexe === 'homme') {
                taux = (this.quantite * 0.8) / (this.poids * 0.7);
            } else {
                taux = (this.quantite * 0.8) / (this.poids * 0.6);
            }

            this.resultat = taux.toFixed(2); // Arrondi à 2 décimales

            // Estimation du temps pour être sobre (0.15 g/l par heure)
            this.tempsSobriete = (taux / 0.15).toFixed(2);
        },
    },
};
</script>
