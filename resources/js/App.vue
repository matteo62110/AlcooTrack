<template>
    <div id="app">
        <Navbar />
        <div class="container">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup>
import Navbar from './components/connexion/Navbar.vue';
</script>
