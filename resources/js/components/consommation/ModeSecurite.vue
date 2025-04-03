<template>
    <div class="security-mode">
        <h2>Mode Sécurité</h2>
        <p class="security-warning">Votre taux d'alcoolémie est au-dessus de la limite légale. Ne prenez pas le volant.</p>

        <!-- Options de transport -->
        <div class="security-options">
            <div class="security-section">
                <h3>Services de transport</h3>
                <div class="transport-buttons">
                    <button @click="appelerTaxi" class="security-button taxi-button">
                        <span class="icon">🚕</span> Taxi
                    </button>
                    <button @click="ouvrirUber" class="security-button uber-button">
                        <span class="icon">🚗</span> Uber
                    </button>
                    <button @click="ouvrirBolt" class="security-button">
                        <span class="icon">🚙</span> Bolt
                    </button>
                </div>
            </div>

            <!-- Contacts d'urgence -->
            <div class="security-section">
                <h3>Contacts d'urgence</h3>

                <!-- Contact SAMU fixe -->
                <div class="contact-item samu-contact">
                    <span>SAMU</span>
                    <button @click="appelerNumero('15')" class="call-button">📞</button>
                </div>

                <!-- Liste des contacts personnalisés -->
                <div v-if="contacts.length === 0" class="no-contacts">
                    <p>Aucun contact personnel enregistré</p>
                </div>

                <div v-else class="contact-list">
                    <div v-for="(contact, index) in contacts" :key="index" class="contact-item">
                        <span>{{ contact.nom }}</span>
                        <div class="contact-actions">
                            <button @click="appelerContact(contact)" class="call-button">📞</button>
                            <button @click="supprimerContact(index)" class="delete-button">🗑️</button>
                        </div>
                    </div>
                </div>

                <button @click="afficherFormContact" class="add-contact-button">
                    Ajouter un contact
                </button>

                <!-- Formulaire d'ajout de contact -->
                <div v-if="afficherFormulaire" class="contact-form">
                    <div class="form-group">
                        <label>Nom</label>
                        <input type="text" v-model="nouveauContact.nom">
                    </div>
                    <div class="form-group">
                        <label>Téléphone</label>
                        <input type="tel" v-model="nouveauContact.telephone">
                    </div>
                    <div class="form-buttons">
                        <button @click="ajouterContact" :disabled="!contactValide">Ajouter</button>
                        <button @click="annulerAjout" class="secondary-button">Annuler</button>
                    </div>
                </div>
            </div>

            <!-- Transports en commun -->
            <div class="security-section">
                <h3>Transports en commun à proximité</h3>
                <div class="transport-map">
                    <p class="map-placeholder">Localisez les transports en commun à proximité</p>
                    <button @click="rechercherTransports" class="map-button">
                        Trouver des transports
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const contacts = ref(JSON.parse(localStorage.getItem('contacts') || '[]'));
const afficherFormulaire = ref(false);
const nouveauContact = ref({ nom: '', telephone: '' });

const contactValide = computed(() => {
    return nouveauContact.value.nom && nouveauContact.value.telephone;
});

function afficherFormContact() {
    afficherFormulaire.value = true;
}

function ajouterContact() {
    if (!contactValide.value) return;

    contacts.value.push({...nouveauContact.value});
    localStorage.setItem('contacts', JSON.stringify(contacts.value));

    // Réinitialiser
    nouveauContact.value = { nom: '', telephone: '' };
    afficherFormulaire.value = false;
}

function supprimerContact(index) {
    contacts.value.splice(index, 1);
    localStorage.setItem('contacts', JSON.stringify(contacts.value));
}

function annulerAjout() {
    nouveauContact.value = { nom: '', telephone: '' };
    afficherFormulaire.value = false;
}

function appelerContact(contact) {
    window.location.href = `tel:${contact.telephone}`;
}

function appelerNumero(numero) {
    window.location.href = `tel:${numero}`;
}

function appelerTaxi() {
    // Numéro générique de taxi
    window.location.href = 'tel:36 07';
}

function ouvrirUber() {
    window.location.href = 'https://m.uber.com/ul/';
}

function ouvrirBolt() {
    window.location.href = 'https://bolt.eu/fr/';
}

function rechercherTransports() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            window.open(`https://www.google.com/maps/search/transports+en+commun/@${lat},${lng},15z`, '_blank');
        }, () => {
            alert('Impossible d\'accéder à votre position. Veuillez autoriser la géolocalisation.');
        });
    } else {
        alert('La géolocalisation n\'est pas supportée par votre navigateur.');
    }
}
</script>

<style scoped>
.security-mode {
    margin-top: 2rem;
    padding: 1.5rem;
    border-radius: var(--radius);
    background-color: #fee2e2;
    border: 2px solid var(--danger);
}

.security-warning {
    color: var(--danger);
    font-weight: bold;
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
}

.security-options {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.security-section {
    margin-bottom: 1rem;
    padding: 1rem;
    background-color: white;
    border-radius: var(--radius);
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.security-section h3 {
    margin-bottom: 1rem;
    color: var(--text);
    font-size: 1.1rem;
    font-weight: bold;
}

.transport-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
}

.security-button {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1 1 30%;
    min-width: 120px;
    padding: 0.75rem;
    background-color: #f3f4f6;
    color: var(--text);
    border-radius: var(--radius);
    border: none;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
}

.security-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.security-button .icon {
    margin-right: 0.5rem;
    font-size: 1.2rem;
}

.taxi-button {
    background-color: #fcd34d;
}

.uber-button {
    background-color: #000000;
    color: white;
}

.contact-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
}

.contact-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background-color: #f9fafb;
    border-radius: var(--radius);
    margin-bottom: 0.75rem;
}

.samu-contact {
    background-color: #fee2e2;
    border-left: 4px solid var(--danger);
    font-weight: 600;
}

.contact-actions {
    display: flex;
    gap: 0.5rem;
}

.call-button {
    width: 40px;
    height: 40px;
    padding: 0;
    background-color: var(--primary);
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    cursor: pointer;
}

.delete-button {
    width: 40px;
    height: 40px;
    padding: 0;
    background-color: var(--danger);
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    cursor: pointer;
}

.no-contacts {
    margin-bottom: 1rem;
    color: var(--text-light);
    text-align: center;
    padding: 0.75rem;
}

.add-contact-button {
    width: 100%;
    margin-top: 0.5rem;
    background-color: var(--secondary);
    padding: 0.75rem;
    border: none;
    border-radius: var(--radius);
    cursor: pointer;
}

.contact-form {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-group label {
    font-weight: 500;
}

.form-group input {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: var(--radius);
}

.form-buttons {
    display: flex;
    gap: 0.75rem;
}

.form-buttons button {
    flex: 1;
    padding: 0.75rem;
    border: none;
    border-radius: var(--radius);
    cursor: pointer;
}

.form-buttons button:first-child {
    background-color: var(--primary);
    color: white;
}

.secondary-button {
    background-color: #e5e7eb !important;
    color: var(--text) !important;
}

.transport-map {
    background-color: #f9fafb;
    padding: 1rem;
    border-radius: var(--radius);
    text-align: center;
}

.map-placeholder {
    margin-bottom: 1rem;
    font-size: 0.9rem;
    color: var(--text-light);
}

.map-button {
    background-color: var(--secondary);
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: var(--radius);
    cursor: pointer;
}

@media (min-width: 768px) {
    .security-options {
        flex-direction: row;
        flex-wrap: wrap;
    }

    .security-section {
        flex: 1 1 calc(50% - 1rem);
        margin-bottom: 0;
    }
}
</style>
