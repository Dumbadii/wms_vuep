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
          <!-- <form method="get" action="/search/">
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
          </form> -->
        </div>
      </div>
      <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <router-link v-if="!$store.state.isAuthenticated" class="button is-light" to="/login">
                登录
              </router-link>
              <router-link v-if="$store.state.isAuthenticated" class="button is-light" to="/account">
                退出
              </router-link>
            </div>
          </div>
      </div>
    </div>
  </nav>

  <section class="main-content columns is-fullheight">
    
    <!-- <aside class="column is-2 is-narrow-mobile is-fullheight section is-hidden-mobile" v-if="$store.state.isAuthenticated"> -->
    <aside class="column is-2 is-narrow-mobile is-fullheight section is-hidden-mobile" v-if="true">
      <p class="menu-label is-hidden-touch">导航</p>
      <ul class="menu-list">
        <li>
          <router-link exact-active-class="is-active" :to="{ name: 'home' }">
            <span class="icon"><i class="fas fa-tachometer-alt"></i></span> 主页
          </router-link>
        </li>
        <li>
          <a href="#">
            <span class="icon"><i class="fas fa-boxes"></i></span> 库存
          </a>

          <ul>
            <li>
              <router-link exact-active-class="is-active" :to="{ name: 'barcode_list' }">
                <span class="icon is-small"><i class="fa fa-link"></i></span> 物品信息
              </router-link>
            </li>
          </ul>
        </li>
        <li>
          <a href="#" class="">
            <span class="icon"><i class="fas fa-dolly-flatbed"></i></span> 日常操作
          </a>

          <ul>
            <li>
              <router-link exact-active-class="is-active" :to="{ name: 'stockin_list' }">
                <span class="icon is-small"><i class="fa fa-link"></i></span> 入库
              </router-link>
            </li>
            <li>
              <router-link exact-active-class="is-active" :to="{ name: 'stockout_list' }">
                <span class="icon is-small"><i class="fa fa-link"></i></span> 领用
              </router-link>
            </li>
            <li>
              <router-link exact-active-class="is-active" :to="{ name: 'stockback_list' }">
                <span class="icon is-small"><i class="fa fa-link"></i></span> 回收
              </router-link>
            </li>
            <li>
              <router-link exact-active-class="is-active" :to="{ name: 'stockdisable_list' }">
                <span class="icon is-small"><i class="fa fa-link"></i></span> 作废
              </router-link>
            </li>
          </ul>
        </li>
        <li>
          <a href="https://eachow.site/admin" class="" target="_blank">
            <span class="icon"><i class="fa fa-user-cog"></i></span> 后台管理
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