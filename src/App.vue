<!-- <template>
  <div id="app">
    <Header v-if="$route.name !== 'Login' && $route.name !== 'Home'" />
    <router-view />
  </div>
</template>

<script>
import Header from './views/Header.vue'

export default {
  name: 'App',
  components: {
    Header
  }
}
</script> -->

<template>
  <div id="app">
    <Header v-if="$route.name !== 'Login' && $route.name !== 'Home'" />
    <router-view />
  </div>
</template>

<script>
import Header from './views/Header.vue'

export default {
  name: 'App',
  components: {
    Header
  },
  computed: {
    showHeader() {
      // Asiana condition mazava tsara
      const noHeaderRoutes = ['Login']
      return !noHeaderRoutes.includes(this.$route.name)
    }
  },
created() {
  const isLoggedIn = !!sessionStorage.getItem('username') // ✅
  const currentPath = this.$route.path
  if (!isLoggedIn && currentPath !== '/login') {
    this.$router.push('/login')
  }
}

}
</script>
