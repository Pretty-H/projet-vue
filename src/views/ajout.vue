<template>
  <div class="background">
    <div class="container">
      <form @submit.prevent="soumettre" class="glass-card">
        <h2 class="titre">Ajouter un prêt bancaire</h2>

        <div class="input-grid">
          <div class="input-col">
            <input
              v-model="pret.numero_compte"
              type="text"
              placeholder="Numéro de compte"
              class="input"
              required readonly
            />
            <input
              v-model="pret.nom_client"
              type="text"
              placeholder="Nom du client"
              class="input"
              required
            />
            <input
              v-model="pret.nom_banque"
              type="text"
              placeholder="Nom de la banque"
              class="input"
              required
            />
          </div>
          <div class="input-col">
            <input
              v-model.number="pret.montant"
              type="number"
              placeholder="Montant du prêt"
              class="input"
              required
            />
            <input
              v-model="pret.date_pret"
              type="date"
              class="input"
              required
            />
              <input
                v-model.number="pret.taux"
                type="number"
                step="0.01"
                placeholder="Taux d'intérêt (%)"
                class="input"
                required
                readonly
              />
          </div>
        </div>

        <button type="submit" class="btn-ajouter">Ajouter</button>

        <p v-if="message" :class="['message-grandiose', messageType]">
          {{ message }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import '@/assets/ajout.css'

const message = ref('')
const messageType = ref('')

const pret = ref({
  numero_compte: '',
  nom_client: '',
  nom_banque: '',
  montant: '',
  date_pret: '',  
  taux: '',
})

const getTauxAutomatique = (montant) => {
  if (montant >= 5000 && montant < 50000) return 10;
  if (montant >= 50000 && montant < 200000) return 10;
  if (montant >= 200000 && montant < 500000) return 10;
  if (montant >= 500000 && montant < 1000000) return 10;
  if (montant >= 1000000) return 10;
  return 0;
};

watch(() => pret.value.montant, (nouveauMontant) => {
  pret.value.taux = getTauxAutomatique(nouveauMontant)
});

const formaterDateAffichage = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}


const getNumeroCompteAuto = async () => {
  try {
    const res = await fetch('http://localhost/api/generer_numero.php')
    const data = await res.json()

    if (data.numero_compte) {
      pret.value.numero_compte = data.numero_compte
    } else {
      throw new Error('Aucun numéro retourné')
    }
  } catch (err) {
    console.error('Erreur génération numéro :', err)
    message.value = '⚠️ Erreur de génération du numéro'
    messageType.value = 'error'
    setTimeout(() => (message.value = ''), 4000)
  }
}

onMounted(() => {
  getNumeroCompteAuto()
})


const soumettre = async () => {
  try {
    const pretFormate = { ...pret.value }

    const response = await fetch('http://localhost/api/pret.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pretFormate),
    })

    const data = await response.json()

    if (response.ok) {
      message.value = '✔️ Ajout du réussie !'
      messageType.value = 'success'

      pret.value = {
        numero_compte: '',
        nom_client: '',
        nom_banque: '',
        montant: '',
        date_pret: '',
        taux: '',
      }

      await getNumeroCompteAuto()
    } else {
      message.value = data.message || "❌ Échec de l'opération"
      messageType.value = 'error'
    }
  } catch (err) {
    console.error('Erreur de connexion au serveur :', err)
    message.value = '⚠️ Erreur de connexion au serveur'
    messageType.value = 'error'
  }

  setTimeout(() => (message.value = ''), 4000)
}
</script>