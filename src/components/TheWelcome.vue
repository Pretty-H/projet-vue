<template>
  <div class="background"></div>

  <div class="header">
    <h1 class="welcome-title">Bienvenue</h1>
  </div>

  <div class="container-horizontal">
    <router-link to="/ajout" class="router">
      <div class="menu-button">
        Ajouter
        <img src="@/assets/icons/arrow-down.svg" class="icon-below" />
      </div>
    </router-link>

    <router-link to="/liste" class="router">
      <div class="menu-button">
        Lister
        <img src="@/assets/icons/arrow-down.svg" class="icon-below" />
      </div>
    </router-link>

    <router-link to="/bilan" class="router">
      <div class="menu-button">
        Bilan
        <img src="@/assets/icons/arrow-down.svg" class="icon-below" />
      </div>
    </router-link>
  </div>
</template>
