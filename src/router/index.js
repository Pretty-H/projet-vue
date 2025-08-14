import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/login.vue'
import Home from '../components/Home.vue'
import Ajout from '../views/ajout.vue'
import Liste from '../views/liste.vue'
import Bilan from '../views/Bilan.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'  // manomboka any login
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/ajout',
    name: 'Ajout',
    component: Ajout,
    meta: { requiresAuth: true }
  },
  {
    path: '/liste',
    name: 'Liste',
    component: Liste,
    meta: { requiresAuth: true }
  },
  {
    path: '/bilan',
    name: 'Bilan',
    component: Bilan,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!sessionStorage.getItem('username')
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && isLoggedIn) {
    next('/home')
  } else {
    next()
  }
})


export default router
