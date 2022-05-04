<template>
  <div class="dashboard">
    <section class="hero is-medium is-dark mb-6">
      <div class="hero-body has-text-centered">
        <p class="title mb-6">
        华南师范大学惠阳附属学校
        </p>
        <p class="subtitle">
        仓库管理系统
        </p>
      </div>
    </section>

    <div class="columns is-multiline">
      <div class="column is-12">
        <div class="box">
          <p class="is-size-6 has-text-left">
           共有物品
           <span class="has-text-danger">{{ stat.total }}</span>
           项，库存
           <span class="has-text-danger">{{ stat.inCnt }}</span>
           项,领用
           <span class="has-text-danger">{{ stat.outCnt }}</span>
           项,报废
           <span class="has-text-danger">{{ stat.disableCnt }}</span>
           项<br>
           <span v-for="item in stat.deptStat" :key="item.name" class="mr-2">{{ item.name }}<span class="has-text-danger">{{ item.cnt }}</span>项,</span>
          </p>
            <router-link :to="{ name: 'barcode_list' }" class="button is-light mb-4">
              detail..
            </router-link>
        </div>
      </div>

      <div class="column is-4">
        <div class="box">
          <p class="is-size-4 has-text-grey">
            Latest StockinList
          </p>
          <h3 class="is-size-4"></h3>
          <table class="table is-fullwidth">
            <tr v-for="item in stockinList.slice(0,5)" :key="item.id">
              <td>
                <router-link exact-active-class="is-active" :to="{ name: 'stockin', params: {id: item.id} }">
                {{ item.code }}
                </router-link>
              </td>
              <td>{{ formatDate(item.create_date) }}</td>
            </tr>
          </table>
          <p class="is-size-6 has-text-grey"></p>
          <router-link :to="{ name: 'stockin_list' }" class="button is-light mb-4">
            more..
          </router-link>
        </div>
      </div>

      <div class="column is-4">
        <div class="box">
          <p class="is-size-4 has-text-grey">
            Latest StockoutList
          </p>
          <h3 class="is-size-4"></h3>
          <table class="table is-fullwidth">
            <tr v-for="item in stockoutList.slice(0,5)" :key="item.id">
              <td>
                <router-link exact-active-class="is-active" :to="{ name: 'stockout', params: {id: item.id} }">
                {{ item.code }}
                </router-link>
              </td>
              <td>{{ formatDate(item.create_date) }}</td>
            </tr>
          </table>
          <p class="is-size-6 has-text-grey">
            <router-link :to="{ name: 'stockout_list' }" class="button is-light mb-4">
              more..
            </router-link>
          </p>
        </div>
      </div>

      <div class="column is-4">
        <div class="box">
          <p class="is-size-4 has-text-grey">
            Latest StockbackList
          </p>
          <h3 class="is-size-4"></h3>
          <table class="table is-fullwidth">
            <tr v-for="item in stockbackList.slice(0,5)" :key="item.id">
              <td>
                <router-link exact-active-class="is-active" :to="{ name: 'stockback', params: {id: item.id} }">
                {{ item.code }}
                </router-link>
              </td>
              <td>{{ formatDate(item.create_date) }}</td>
            </tr>
          </table>
          <p class="is-size-6 has-text-grey"></p>
          <router-link :to="{ name: 'stockback_list' }" class="button is-light mb-4">
            more..
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'DashboardView',
  data() {
    return {
      stockinList: [],
      stockbackList: [],
      stockoutList: [],
      stat: Object,
    }
  },
  mounted() {
    this.getStockList()
    this.getStat()
  },
  methods: {
    formatDate(value) {
      const formatStr = 'YYYY-MM-DD HH:mm:ss'
      return moment(String(value)).format(formatStr)
    },
    getStat() {
      axios
        .get(`/api/v1/stat/`)
        .then(response => {
          this.stat = response.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    getStockList() {
      axios
        .get(`/api/v1/stockin/list/?page=1`)
        .then(response => {
          this.stockinList = response.data.results
        })
        .catch(error => {
          console.log(error)
        })
      axios
        .get(`/api/v1/stockout/list/?page=1`)
        .then(response => {
          this.stockoutList = response.data.results
        })
        .catch(error => {
          console.log(error)
        })
      axios
        .get(`/api/v1/stockback/list/?page=1`)
        .then(response => {
          this.stockbackList = response.data.results
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
}
</script>