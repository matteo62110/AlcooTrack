<template>
    <div class="not-found-container">
        <div class="not-found-content">
            <div class="error-code">404</div>
            <h1>Page non trouvée</h1>
            <p>Nous sommes désolés, mais la page que vous recherchez n'existe pas.</p>
            <router-link to="/" class="btn-primary">Retour à l'accueil</router-link>
        </div>
    </div>
</template>

<style scoped>
.not-found-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    text-align: center;
    padding: 2rem;
}

.not-found-content {
    max-width: 500px;
}

.error-code {
    font-size: 8rem;
    font-weight: bold;
    color: #4a6da7;
    line-height: 1;
    margin-bottom: 1rem;
}

h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
}

p {
    margin-bottom: 2rem;
    color: #666;
}
</style>
