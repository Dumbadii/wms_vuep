<template>
  <div class="page-stockback-list">
    <div class="columns is-multiline">
      <div class="column is-11">
        <h1 class="title">回收单列表</h1>
      </div>
      <div class="column is-1">
        <router-link exact-active-class="is-active" :to="{ name: 'stockback', params: {id: 0} }">
          <span class="icon">
            <i class="fas fa-plus"></i>
          </span>
        </router-link>
      </div>
      <div class="column is-12">
        <table class="table is-fullwidth">
          <thead>
              <tr>
                  <th>序号</th>
                  <th>单号</th>
                  <th>经办人</th>
                  <th>部门</th>
                  <th>日期</th>
                  <th>确认</th>
              </tr>
          </thead>

          <tbody>
              <tr
                  v-for="(item, index) in page.results"
                  :key="item.id"
              >
                  <td>{{ pageSize*(currentPage-1)+index+1 }}</td>
                  <td>
                    <router-link :to="{ name: 'stockback', params: {id: item.id} }">
                    {{ item.code }}
                    </router-link>
                  </td>
                  <td>{{ item.employee }}</td>
                  <td>{{ item.department }}</td>
                  <td>{{ formatDate(item.create_date) }}</td>
                  <td><i class="fas fa-check" v-if="item.confirmed"></i></td>
              </tr>
          </tbody>
        </table>
      </div>

      <div class="column is-11">
        <nav class="pagination" role="navigation" aria-label="pagination">
          <a class="pagination-previous" v-if="page.previous" @click="previousPage">上一页</a>
          <a class="pagination-next" v-if="page.next" @click="nextPage">下一页</a>
          <ul class="pagination-list">
            <li v-for="index in pageTotal" :key="index">
              <a
                v-if="index==currentPage"
                class="pagination-link is-current"
                aria-label="Goto page {{ index }}"
                @click="getStockbackList(index)"
              >
                {{ index }}
              </a>
              <a
                v-else-if="index==1 || index==pageTotal || Math.abs(index-currentPage)<pageOffset"
                class="pagination-link"
                aria-label="Goto page {{ index }}"
                @click="getStockbackList(index)"
              >
                {{ index }}
              </a>
              <span
                v-else-if="index==currentPage-pageOffset || index==currentPage+pageOffset"
                class="pagination-ellipsis"
              >&hellip;
              </span>
              <span v-else></span>
            </li>
          </ul>
        </nav>
      </div>
      <div class="column is-1">

      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
  name: 'StokbackListView',
  data() {
    return {
      page: {
        count: 0,
        next: null,
        previous: null,
        results: [],
      },
      currentPage: 0,
      pageTotal: 0,
      pageSize: 10,
      pageOffset: 2,
    }
  },
  methods: {
    previousPage() {
      this.getStockbackList(this.currentPage - 1)
    },
    nextPage() {
      this.getStockbackList(this.currentPage + 1)
    },
    getStockbackList(p) {
      this.currentPage = p
      axios
        .get(`/api/v1/stockback/list/?page=${p}`)
        .then(response => {
          this.page = response.data
          console.log(this.page.results)
          this.pageTotal = Math.ceil(this.page.count / this.pageSize)
        })
        .catch(error => {
          console.log(error)
        })
    },
    formatDate(value) {
      const formatStr = 'YYYY-MM-DD HH:mm:ss'
      return moment(String(value)).format(formatStr)
    },
  },
  mounted() {
    this.getStockbackList(1)
  }
}
</script>
