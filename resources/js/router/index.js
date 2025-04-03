import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

// Pages principales
import Dashboard from '../components/connexion/Dashboard.vue';
import ConsumptionPage from '../components/ConsumptionPage.vue';
import NotFound from '../components/connexion/NotFound.vue';

// Pages d'authentification
import Connexion from '../components/connexion/Connexion.vue';
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
        component: ConsumptionPage,
        meta: { requiresAuth: true }
    },
    {
        path: '/login',
        name: 'Login',
        component: Connexion
    },
    {
        path: '/profile',
        name: 'Profile',
        component: User,
        meta: { requiresAuth: true }
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

// Protection des routes
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login');
    } else {
        next();
    }
});

export default router;
