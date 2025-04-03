<template>
    <div class="alcoolemie-chart">
        <h2>Évolution de l'alcoolémie dans le temps</h2>
        <div class="chart-container">
            <LineChart :chartData="chartData" :options="chartOptions" :plugins="chartPlugins" />
        </div>
        <p class="chart-info">L'alcoolémie diminue d'environ 0.15g/L par heure</p>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useBoissonStore } from '../../stores/boissonStore';
import { LineChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const boissonStore = useBoissonStore();

// Données pour le graphique
const chartData = computed(() => {
    const tauxInitial = parseFloat(boissonStore.calculerAlcoolemie);
    const heures = 24; // Afficher sur 24h

    // Récupération de l'heure actuelle
    const maintenant = new Date();
    const heureActuelle = maintenant.getHours();
    const minuteActuelle = maintenant.getMinutes();

    const labels = [];
    const data = [];

    // Générer les données pour chaque heure à partir de l'heure actuelle
    for (let i = 0; i <= heures; i++) {
        // Calcul de l'heure à afficher (format 24h)
        const heure = (heureActuelle + i) % 24;

        // Format d'affichage
        let label;
        if (i === 0) {
            label = `${heureActuelle}h${minuteActuelle > 0 ? minuteActuelle : ''}`;
        } else {
            label = `${heure}h`;
        }

        labels.push(label);

        // L'alcoolémie ne peut pas être négative
        const tauxHeure = Math.max(0, tauxInitial - (i * 0.15));
        data.push(tauxHeure.toFixed(2));
    }

    return {
        labels,
        datasets: [
            {
                label: 'Alcoolémie (g/L)',
                data,
                borderColor: (context) => getTauxColor(data[context.dataIndex]),
                backgroundColor: (context) => getTauxColor(data[context.dataIndex], 0.1),
                fill: true,
                tension: 0.4
            }
        ]
    };
});

// Options du graphique
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Taux d\'alcoolémie (g/L)'
            },
            grid: {
                color: 'rgba(0, 0, 0, 0.05)'
            }
        },
        x: {
            title: {
                display: true,
                text: 'Heure'
            },
            grid: {
                color: 'rgba(0, 0, 0, 0.05)'
            }
        }
    },
    plugins: {
        tooltip: {
            callbacks: {
                label: function(context) {
                    return `Taux: ${context.formattedValue} g/L`;
                }
            }
        }
    }
};

// Déterminer la couleur en fonction du taux
function getTauxColor(taux, alpha = 1) {
    if (taux >= 0.8) return `rgba(239, 68, 68, ${alpha})`;  // rouge (danger)
    if (taux >= 0.5) return `rgba(249, 115, 22, ${alpha})`;  // orange (warning)
    return `rgba(34, 197, 94, ${alpha})`;  // vert (safe)
}

// Plugin pour ajouter la ligne de limite légale
const chartPlugins = [
    {
        id: 'limiteLine',
        beforeDraw: (chart) => {
            const ctx = chart.ctx;
            const yAxis = chart.scales.y;
            const index = yAxis.getPixelForValue(0.5);

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(chart.chartArea.left, index);
            ctx.lineTo(chart.chartArea.right, index);
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgba(249, 115, 22, 0.7)';
            ctx.setLineDash([5, 5]);
            ctx.stroke();

            // Ajouter le texte "Limite légale"
            ctx.fillStyle = 'rgba(249, 115, 22, 1)';
            ctx.fillText('Limite légale (0.5g/L)', chart.chartArea.left + 10, index - 5);
            ctx.restore();
        }
    }
];
</script>

<style scoped>
.alcoolemie-chart {
    margin-top: 2rem;
    padding: 1.5rem;
    border-radius: var(--radius);
    background-color: #f1f5f9;
}

.chart-container {
    height: 300px;
    margin: 1rem 0;
}

.chart-info {
    font-size: 0.9rem;
    color: var(--text-light);
    text-align: center;
    margin-top: 1rem;
}
</style>
