<template>
  <div class="background">
    <div class="tableau">
      <h2>Liste des prêts bancaires</h2>

      <div class="card-tableau">
        <table>
          <thead>
            <tr>
              <th>Nom Client</th>
              <th>Nom Banque</th>
              <th>Montant</th>
              <th>Date Prêt</th>
              <th>Montant à Payer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(pret, index) in prets" :key="pret.numero_compte" :ref="'ligne_' + index">
              <template v-if="pret.numero_compte !== ligneEnModification">
                <td>{{ pret.nom_client }}</td>
                <td>{{ pret.nom_banque }}</td>
                <td>{{ pret.montant }}</td>
                <td>{{ pret.date_pret }}</td>
                <td>{{ calculerMontantAPayer(pret.montant) }}</td>
                <td>
                  <button @click="confirmerAvant('modifier', index)">Modifier</button>
                  <button @click="confirmerAvant('supprimer', index)">Supprimer</button>
                </td>
              </template>

              <template v-else>
                <td><input v-model="formulaire.nom_client" class="input-inline" /></td>
                <td><input v-model="formulaire.nom_banque" class="input-inline" /></td>
                <td>
                  <input v-model.number="formulaire.montant" type="number" class="input-inline" />
                </td>
                <td><input type="date" v-model="formulaire.date_pret" class="input-inline" /></td>
                <td>{{ calculerMontantAPayer(formulaire.montant) }}</td>
                <td>
                  <button @click="validerModification(index)">Valider</button>
                  <button @click="annulerModification">Annuler</button>
                </td>
              </template>
            </tr>
          </tbody>
        </table>

        <div v-if="message" ref="messageZone" class="message-grandiose">
          {{ message }}
        </div>
      </div>

      <div v-if="modale.active" class="modal-overlay">
        <div class="modal-content">
          <h3>Confirmation</h3>
          <p>
            Voulez-vous vraiment <strong>{{ modale.type }}</strong> ce prêt ?
          </p>
          <div class="modal-buttons">
            <button @click="executerActionConfirmee">Oui</button>
            <button @click="fermerModale">Non</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '../assets/liste.css'

export default {
  name: 'Liste',
  data() {
    return {
      message: '',
      prets: [],
      formulaire: {},
      ligneEnModification: null,
      modale: {
        active: false,
        type: '',
        index: null,
      },
    }
  },

  methods: {
    chargerDonnees() {
      fetch('http://localhost/api/liste.php')
        .then((res) => res.json())
        .then((data) => {
          this.prets = data
        })
        .catch((err) => {
          this.message = 'Erreur de chargement des prêts'
          console.error(err)
        })
    },

    getTaux(montant) {
      if (montant >= 1000000) return 0.1
      if (montant >= 500000) return 0.1
      if (montant >= 200000) return 0.1
      if (montant >= 50000) return 0.1
      if (montant >= 5000) return 0.1
      return 0
    },

    calculerMontantAPayer(montant) {
      const taux = this.getTaux(montant)
      return Math.round(montant * (1 + taux))
    },

    confirmerAvant(action, index) {
      this.modale = { active: true, type: action, index }
    },

    fermerModale() {
      this.modale.active = false
    },

    executerActionConfirmee() {
      if (this.modale.type === 'modifier') {
        this.demarrerModification(this.modale.index)
      } else if (this.modale.type === 'supprimer') {
        this.supprimerPret(this.modale.index)
      }
      this.fermerModale()
    },

    demarrerModification(index) {
      const original = this.prets[index]
      this.ligneEnModification = original.numero_compte
      this.formulaire = {
        nom_client: original.nom_client,
        nom_banque: original.nom_banque,
        montant: original.montant,
        date_pret: original.date_pret,
      }
    },

    validerModification(index) {
      const pretModifie = {
        numero_compte: this.ligneEnModification,
        nom_client: this.formulaire.nom_client,
        nom_banque: this.formulaire.nom_banque,
        montant: this.formulaire.montant,
        date_pret: this.formulaire.date_pret,
        taux: this.getTaux(this.formulaire.montant),
      }

      fetch('http://localhost/api/update.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pretModifie),
      })
        .then((res) => res.json())
        .then((resp) => {
          if (resp.success) {
            this.prets[index] = {
              ...this.prets[index],
              ...pretModifie,
            }
            this.ligneEnModification = null
            this.afficherMessage(resp.message || '✔️ Modification réussie')
          } else {
            this.afficherMessage(resp.error || '❌ Aucune modification effectuée')
          }
        })
        .catch((err) => {
          console.error(err)
          this.afficherMessage('❌ Erreur réseau')
        })
    },

    supprimerPret(index) {
      const numero = this.prets[index].numero_compte

      fetch('http://localhost/api/delete.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numero_compte: numero }),
      })
        .then((res) => res.json())
        .then((resp) => {
          if (resp.success) {
            this.chargerDonnees()
            this.afficherMessage('🗑️ Suppression réussie !')
          } else {
            this.afficherMessage('❌ Erreur suppression')
          }
        })
        .catch((err) => {
          console.error(err)
          this.afficherMessage('❌ Erreur réseau')
        })
    },

    annulerModification() {
      this.ligneEnModification = null
    },

    afficherMessage(texte) {
      this.message = texte
      this.$nextTick(() => {
        const tableau = document.querySelector('.card-tableau')
        if (tableau) tableau.scrollTop = tableau.scrollHeight
      })

      setTimeout(() => {
        this.message = ''
        const oldIndex = this.modale.index
        if (oldIndex !== null && this.$refs['ligne_' + oldIndex]) {
          const ligne = this.$refs['ligne_' + oldIndex][0]
          if (ligne) ligne.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 3000)
    },
  },

  mounted() {
    this.chargerDonnees()
  },
}
</script>
