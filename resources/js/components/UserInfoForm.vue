<template>
    <div>
        <h1>Vos informations</h1>

        <form @submit.prevent="submitForm">
            <div>
                <label>Sexe</label>
                <div>
                    <label>
                        <input type="radio" v-model="userInfo.sexe" value="homme">
                        Homme
                    </label>
                    <label>
                        <input type="radio" v-model="userInfo.sexe" value="femme">
                        Femme
                    </label>
                </div>
            </div>

            <div>
                <label>Poids (kg)</label>
                <input type="number" v-model="userInfo.poids" required min="30" max="200">
            </div>

            <button type="submit">Continuer</button>
        </form>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';

const router = useRouter();
const userStore = useUserStore();

const userInfo = reactive({
    sexe: 'homme',
    poids: 70
});

function submitForm() {
    userStore.setUserInfo(userInfo);
    router.push('/consommation');
}
</script>
