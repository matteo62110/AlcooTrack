import { createRouter, createWebHistory } from 'vue-router';

// Pages principales
import Dashboard from '../components/connexion/Dashboard.vue';
import ConsumptionPage from '../components/ConsumptionPage.vue';
import NotFound from '../components/connexion/NotFound.vue';
import Minuteur from '../components/consommation/MinuteurConsommation.vue';

import User from '../components/connexion/User.vue';

const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: Dashboard
    },
    {
        path: '/consumption',
        name: 'Consumption',
        component: ConsumptionPage
    },
    {
        path: '/minuteur',
        name: 'Minuteur',
        component: Minuteur
    },
    {
        path: '/profile',
        name: 'Profile',
        component: User
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
