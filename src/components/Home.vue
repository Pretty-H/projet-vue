<template>
  <div class="background"></div>

  <div class="header">
    <!-- <h1 class="welcome-title">Bienvenue</h1> -->
  </div>

  <div class="logo-wrapper">
    <img src="@/assets/icon/logo1.png" alt="Logo Solvi" class="logo-img" />
  </div>

  <div class="titre-wrapper">
    <label class="titre">Accueil</label>
    <div class="titre-barre"></div>
  </div>

  <div class="container-horizontal">
    <router-link to="/ajout" class="router">
      <div class="menu-container">
        <img src="@/assets/icon/add2.png" class="menu-icon" />
        <div class="menu-button">Ajouter un prêt</div>
      </div>
    </router-link>

    <router-link to="/liste" class="router">
      <div class="menu-container">
        <img src="@/assets/icon/listage1.png" class="menu-icon" />
        <div class="menu-button">Lister les prêt</div>
      </div>
    </router-link>

    <router-link to="/bilan" class="router">
      <div class="menu-container">
        <img src="@/assets/icon/stat1.png" class="menu-icon" />
        <div class="menu-button">Bilan des prêt</div>
      </div>
    </router-link>
  </div>
</template>
