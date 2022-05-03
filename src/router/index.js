import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/Login.vue'
import AccountView from '../views/Account.vue'
import SignupView from '../views/Signup.vue'
import StockinView from '../views/Stockin.vue'
import StockoutView from '../views/Stockout.vue'
import StockinListView from '../views/StockinList.vue'
import StockoutListView from '../views/StockoutList.vue'
import StockbackView from '../views/Stockback.vue'
import StockbackListView from '../views/StockbackList.vue'
import StockdisableView from '../views/Stockdisable.vue'
import StockdisableListView from '../views/StockdisableList.vue'
import BarcodeListView from '../views/BarcodeList.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
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
  },
  {
    path: '/stockback/:id',
    name: 'stockback',
    props: true,
    component: StockbackView
  },
  {
    path: '/stockback/list',
    name: 'stockback_list',
    component: StockbackListView
  },
  {
    path: '/stockdisable/:id',
    name: 'stockdisable',
    props: true,
    component: StockdisableView
  },
  {
    path: '/stockdisable/list',
    name: 'stockdisable_list',
    component: StockdisableListView
  },
  {
    path: '/barcode/list',
    name: 'barocde_list',
    component: BarcodeListView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
