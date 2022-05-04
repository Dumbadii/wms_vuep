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
import DashboardView from '../views/Dashboard.vue'
import store from '../store'

const routes = [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomeView
  // },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/',
    name: 'home',
    component: DashboardView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/account',
    name: 'account',
    component: AccountView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupView,
  },
  {
    path: '/stockin/:id',
    name: 'stockin',
    props: true,
    component: StockinView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/stockin/list',
    name: 'stockin_list',
    component: StockinListView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/stockout/:id',
    name: 'stockout',
    props: true,
    component: StockoutView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/stockout/list',
    name: 'stockout_list',
    component: StockoutListView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/stockback/:id',
    name: 'stockback',
    props: true,
    component: StockbackView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/stockback/list',
    name: 'stockback_list',
    component: StockbackListView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/stockdisable/:id',
    name: 'stockdisable',
    props: true,
    component: StockdisableView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/stockdisable/list',
    name: 'stockdisable_list',
    component: StockdisableListView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/barcode/list',
    name: 'barcode_list',
    component: BarcodeListView,
    meta: {
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.isAuthenticated) {
      next({ name: 'login' })
    } else {
      next() // go to wherever I'm going
    }
  } else {
    next() // does not require auth, make sure to always call next()!
  }
})
export default router
