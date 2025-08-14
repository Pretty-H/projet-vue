<template>
  <div class="login-background">
    <div class="login-card">
      <h2>Connexion</h2>
      <form @submit.prevent="seConnecter">
        <input type="text" v-model="username" placeholder="Nom d'utilisateur" required />
        <input type="password" v-model="password" placeholder="Mot de passe" required />
        <button type="submit">Se connecter</button>
        <p class="error" v-if="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      error: '',
    }
  },
  methods: {
    async seConnecter() {
      try {
        const response = await fetch('http://localhost/api/login.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        })

        const result = await response.json()
        if (result.success) {
          sessionStorage.setItem('username', result.username)
          this.$router.push('/home')
        } else {
          this.error = result.message
        }
      } catch (err) {
        this.error = '❌ Erreur de connexion au serveur.'
      }
    },
  },
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-background {
  /* position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #004d60, #00796b);
  font-family: 'Segoe UI', sans-serif; */
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background-image: url('/src/assets/fond1.png');
  background-size: cover;
  background-position: center;
  z-index: -1;
}

.login-card {
  backdrop-filter: blur(12px);
  background-color: rgba(0, 50, 70, 0.85);
  border-radius: 25px;
  padding: 60px 45px;
  box-shadow:
    0 0 25px rgba(0, 230, 255, 0.25),
    0 0 35px rgba(0, 180, 220, 0.2),
    0 0 45px rgba(0, 150, 199, 0.2);
  color: white;
  width: 400px;
  text-align: center;
}

.login-card h2 {
  margin-bottom: 25px;
  font-size: 30px;
}

.login-card input {
  display: block;
  width: 100%;
  padding: 16px;
  margin: 16px 0;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 17px;
}

.login-card input::placeholder {
  color: #ccc;
}

.login-card button {
  margin-top: 20px;
  padding: 14px;
  width: 100%;
  background-color: #0095bb;
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: bold;
  font-size: 17px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.login-card button:hover {
  background-color: #00b0dd;
}

.error {
  margin-top: 20px;
  color: #ff8a8a;
  font-size: 18px;
}
</style>
