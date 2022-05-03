<template>
<div id="wraper">
  <nav class="navbar is-dark">
    <div class="navbar-brand">
      <router-link class="navbar-item" to="/">
        <strong>Home</strong>
      </router-link>
      <a class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbar-menu" @click="showMobileMenu = !showMobileMenu">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>

    </div>
    <div class="navbar-menu" id="navbar-menu" :class="{'is-active': showMobileMenu}">
      <div class="navbar-start">
        <div class="navbar-item">
          <form method="get" action="/search/">
            <div class="field has-addons">
              <div class="control">
                <input type="text" class="input" placeholder="What are you looking for?" name="query">
              </div>
              <div class="control">
                <button class="button is-succes">
                  <span class="icon">
                    <i class="fas fa-search"></i>
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="navbar-end">
          <!-- <router-link class="navbar-item" to="/products/Summer/">Summer</router-link> -->
          <!-- <router-link class="navbar-item" to="/products/Winter">Winter</router-link> -->
          <div class="navbar-item">
            <div class="buttons">
              <router-link v-if="!$store.state.isAuthenticated" class="button is-light" to="/login">
                Login
              </router-link>
              <router-link v-if="$store.state.isAuthenticated" class="button is-light" to="/account">
                Account
              </router-link>
            </div>
          </div>
      </div>
    </div>
  </nav>

  <section class="main-content columns is-fullheight">
    
    <!-- <aside class="column is-2 is-narrow-mobile is-fullheight section is-hidden-mobile" v-if="$store.state.isAuthenticated"> -->
    <aside class="column is-2 is-narrow-mobile is-fullheight section is-hidden-mobile" v-if="true">
      <p class="menu-label is-hidden-touch">Navigation</p>
      <ul class="menu-list">
        <li>
          <a href="#" class="">
            <!-- <span class="icon"><i class="fas fa-chart-line"></i></span> Home -->
            <span class="icon"><i class="fas fa-tachometer-alt"></i></span> Home
          </a>
        </li>
        <li>
          <a href="#">
            <span class="icon"><i class="fas fa-boxes"></i></span> Inventory
          </a>

          <ul>
            <li>
              <a href="#">
                <span class="icon is-small"><i class="fa fa-link"></i></span> Items
              </a>
            </li>
            <li>
              <a href="#">
                <span class="icon is-small"><i class="fa fa-link"></i></span> Item Groups
              </a>
            </li>
            <li>
              <router-link exact-active-class="is-active" :to="{ name: 'barcode_list' }">
                <span class="icon is-small"><i class="fa fa-link"></i></span> Barcodes
              </router-link>
            </li>
          </ul>
        </li>
        <li>
          <a href="#" class="">
            <span class="icon"><i class="fas fa-dolly-flatbed"></i></span> Daily Job
          </a>

          <ul>
            <li>
              <router-link exact-active-class="is-active" :to="{ name: 'stockin_list' }">
                <span class="icon is-small"><i class="fa fa-link"></i></span> Stock In
              </router-link>
            </li>
            <li>
              <router-link exact-active-class="is-active" :to="{ name: 'stockout_list' }">
                <span class="icon is-small"><i class="fa fa-link"></i></span> Stock Out
              </router-link>
            </li>
            <li>
              <router-link exact-active-class="is-active" :to="{ name: 'stockback_list' }">
                <span class="icon is-small"><i class="fa fa-link"></i></span> Stock Back
              </router-link>
            </li>
            <li>
              <router-link exact-active-class="is-active" :to="{ name: 'stockdisable_list' }">
                <span class="icon is-small"><i class="fa fa-link"></i></span> Stock Disable
              </router-link>
            </li>
          </ul>
        </li>
        <li>
          <a href="http://localhost:8000/admin" class="" target="_blank">
            <span class="icon"><i class="fa fa-user-cog"></i></span> Admin
          </a>
        </li>
      </ul>
    </aside>

    <div class="container column is-full">
      <div class="section">
        <router-view/>
      </div>
    </div>
    
  </section>
  <footer class="footer">
    <p class="has-text-centered">Copyright (c) 2021</p>
  </footer>
</div>
</template>

<style lang="scss">
@import '../node_modules/bulma';
</style>

<script>
export default {
  data() {
    return {
      showMobileMenu: false,
    }
  },
  beforeCreated() {
    this.$store.commit('initializeStore')
  },
  mounted() {
    document.title = 'Home | WMS'
  },
}
</script>