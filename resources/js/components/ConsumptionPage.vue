<template>
    <div>
        <InfoUtilisateur />
        <h1>Ma consommation</h1>
        <FormulaireBoissonPerso />
        <ListeBoissons />
        <MinuteurConsommation ref="minuteurRef" />
        <ResultatAlcoolemie v-if="parseFloat(boissonStore.calculerAlcoolemie) > 0" />
        <GraphiqueEvolution v-if="parseFloat(boissonStore.calculerAlcoolemie) > 0" />
        <ModeSecurite v-if="parseFloat(boissonStore.calculerAlcoolemie) >= 0.5" />
        <HistoriqueConsommation />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useBoissonStore } from '../stores/boissonStore';
import MinuteurConsommation from './consommation/MinuteurConsommation.vue';
import InfoUtilisateur from './consommation/InfoUtilisateur.vue';
import FormulaireBoissonPerso from './consommation/FormulaireBoissonPerso.vue';
import ListeBoissons from './consommation/ListeBoissons.vue';
import ResultatAlcoolemie from './consommation/ResultatAlcoolemie.vue';
import GraphiqueEvolution from './consommation/GraphiqueEvolution.vue';
import ModeSecurite from './consommation/ModeSecurite.vue';
import HistoriqueConsommation from './consommation/HistoriqueConsommation.vue';

const boissonStore = useBoissonStore();
const minuteurRef = ref(null);

// Connecter le minuteur au store lorsque le composant est monté
onMounted(() => {
    if (minuteurRef.value) {
        boissonStore.setMinuteurRef(minuteurRef.value);
    }
});
</script>
