<template>
  <div class="background">
    <div class="bilan-container">
      <h2>Bilan des paiements journaliers</h2>

      <div class="totaux">
        <p><strong>Total :</strong> {{ total }} Ar</p>
        <p><strong>Minimum :</strong> {{ minimum }} Ar</p>
        <p><strong>Maximum :</strong> {{ maximum }} Ar</p>
      </div>

      <div class="chart-section">
        <h3>Histogramme</h3>
        <BarChart :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BarChart from '../components/BarChart.vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const prets = ref([])
const total = ref(0)
const minimum = ref(0)
const maximum = ref(0)

const chartData = ref({ labels: [], datasets: [] })
const chartOptions = ref({})

function getTaux(montant) {
  if (montant >= 5000 && montant < 50000) return 10
  if (montant >= 50000 && montant < 200000) return 10
  if (montant >= 200000 && montant < 500000) return 10
  if (montant >= 500000 && montant < 1000000) return 10
  if (montant >= 1000000) return 10
  return 0
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
}

onMounted(async () => {
  try {
    const res = await fetch('http://localhost/api/liste.php')
    const data = await res.json()
    prets.value = data

    const paiements = prets.value.map((pret) => {
      const taux = getTaux(pret.montant)
      const montantAPayer = Math.round(pret.montant * (1 + taux / 100))
      return {
        date: formatDate(pret.date_pret),
        montant: montantAPayer,
      }
    })

    const montants = paiements.map(p => p.montant)
    total.value = montants.reduce((a, b) => a + b, 0)
    minimum.value = Math.min(...montants)
    maximum.value = Math.max(...montants)

    const labels = ['Total', 'Minimum', 'Maximum']
    const values = [total.value, minimum.value, maximum.value]
    const colors = ['#0077B6', '#90E0EF', '#00B4D8']

    chartData.value = {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderColor: '#023E8A',
          borderWidth: 2,
          borderRadius: 10,
          barThickness: 80,
        },
      ],
    }

    chartOptions.value = {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Résumé des paiements : Total, Min, Max',
          color: '#023E8A',
          font: { size: 20 },
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.raw.toLocaleString()
              const nom = context.label.toLowerCase()
              return `Montant ${nom} : ${value} Ar`
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#caf0f8',
            font: { size: 13 },
          },
          grid: {
            color: 'rgba(2, 62, 138, 0.1)',
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: '#caf0f8',
            font: { size: 12 },
            callback: (value) => `${value.toLocaleString()} Ar`,
          },
          grid: {
            color: 'rgba(2, 62, 138, 0.1)',
          },
        },
      },
    }
  } catch (error) {
    console.error('Erreur de chargement :', error)
  }
})
</script>

<style scoped>
h2,
h3 {
  text-align: center;
  color: #ffffff;
  text-shadow: 0px 0px 6px rgba(0, 255, 255, 0.5);
}

.bilan-container {
  background: rgba(255, 255, 255, 0.07);
  border-radius: 25px;
  padding: 10px 40px;
  backdrop-filter: blur(18px);
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.4),
    inset 0 0 10px rgba(0, 200, 255, 0.3);
  border: 2px solid #00acc1;
  width: 640px;
  max-width: 95vw;
  margin: 40px auto;
  color: #ffffff;
  animation: softOceanFloat 5s ease-in-out infinite;
}

@keyframes softOceanFloat {
  0% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-6px) scale(1.01);
  }
  100% {
    transform: translateY(0px) scale(1);
  }
}

.totaux {
  display: flex;
  justify-content: space-around;
  background-color: rgba(255, 255, 255, 0.15);
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 20px;
  color: #ffffff;
}

.totaux p {
  font-size: 1.2em;
  margin: 0;
}

.chart-section {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 15px;
  box-shadow: inset 0 1px 4px rgba(0, 200, 255, 0.2);
}
</style>
