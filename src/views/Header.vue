<template>
  <header class="glass-header">
    <nav class="nav-links">
      <router-link to="/home" class="nav-btn">Accueil</router-link>
      <router-link to="/ajout" class="nav-btn">Ajouter</router-link>
      <router-link to="/liste" class="nav-btn">Liste</router-link>
      <router-link to="/bilan" class="nav-btn">Bilan</router-link>
    </nav>
  </header>
</template>

<style scoped>
.glass-header {
  max-width: 380px;
  margin: 0 auto 20px auto;
  padding: 10px 20px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 2px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 4px 20px rgba(15, 228, 228, 0.58);
  display: flex;
  justify-content: center;
}

.nav-links {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.nav-btn {
  padding: 8px 20px;
  border-radius: 10px;
  background: rgba(0, 255, 255, 0.08);
  color: #e3f8ff;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease-in-out;
  border: 1px solid rgba(0, 255, 255, 0.15);
  box-shadow: inset 0 0 4px rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(4px);
}

.nav-btn:hover {
  background: rgba(0, 255, 255, 0.2);
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 255, 255, 0.2);
}
</style>
