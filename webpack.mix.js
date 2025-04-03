const mix = require('laravel-mix');

// Compiles les fichiers JS et CSS et génère le mix-manifest.json
mix.js('resources/js/app.js', 'public/js')
    .vue()  // Cette ligne est nécessaire pour gérer les fichiers .vue
    .postCss('resources/css/app.css', 'public/css', [
        require('postcss-import'),
        require('tailwindcss'),
    ]);

// Extraction des bibliothèques tierces (optional)
// mix.extract(['vue', 'axios']);

// Gestion des assets (si nécessaire)
// mix.copy('resources/images', 'public/images');

// Ajout du versionnement en production
if (mix.inProduction()) {
    mix.version();
}

// Désactiver les notifications en cas d'erreurs (optional)
// mix.disableNotifications();
