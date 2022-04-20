import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/Login.vue'
import AccountView from '../views/Account.vue'
import SignupView from '../views/Signup.vue'
import StockinView from '../views/Stockin.vue'
import StockoutView from '../views/Stockin.vue'
import StockinListView from '../views/StockinList.vue'
import StockoutListView from '../views/StockoutList.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/account',
    name: 'account',
    component: AccountView
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupView
  },
  {
    path: '/stockin/:id',
    name: 'stockin',
    props: true,
    component: StockinView
  },
  {
    path: '/stockin/list',
    name: 'stockin_list',
    component: StockinListView
  },
  {
    path: '/stockout/:id',
    name: 'stockout',
    props: true,
    component: StockoutView
  },
  {
    path: '/stockout/list',
    name: 'stockout_list',
    component: StockoutListView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
