<template>
  <div class="page-stockout-list">
    <div class="columns is-multiline">
      <div class="column is-11">
        <h1 class="title">Stockout List</h1>
      </div>
      <div class="column is-1">
        <router-link exact-active-class="is-active" :to="{ name: 'stockout', params: {id: 0} }">
          <span class="icon">
            <i class="fas fa-plus"></i>
          </span>
        </router-link>
      </div>
      <div class="column is-12">
        <table class="table is-fullwidth">
          <thead>
              <tr>
                  <th>Code</th>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>CreateDate</th>
                  <th>Confirmed</th>
              </tr>
          </thead>

          <tbody>
              <tr
                  v-for="item in page.results"
                  :key="item.id"
              >
                  <td>
                    <router-link :to="{ name: 'stockout', params: {id: item.id} }">
                    {{ item.code }}
                    </router-link>
                  </td>
                  <td>{{ item.employee }}</td>
                  <td>{{ item.department }}</td>
                  <td>{{ item.create_date }}</td>
                  <td>{{ item.confirmed }}</td>
              </tr>
          </tbody>
        </table>
      </div>

      <div class="column is-11">
        <nav class="pagination" role="navigation" aria-label="pagination">
          <a class="pagination-previous" v-if="page.previous" @click="previousPage">Previous</a>
          <a class="pagination-next" v-if="page.next" @click="nextPage">Next</a>
          <ul class="pagination-list">
            <li v-for="index in pageTotal" :key="index">
              <a
                v-if="index==currentPage"
                class="pagination-link is-current"
                aria-label="Goto page {{ index }}"
                @click="getStockoutList(index)"
              >
                {{ index }}
              </a>
              <a
                v-else-if="index==1 || index==pageTotal || Math.abs(index-currentPage)<pageOffset"
                class="pagination-link"
                aria-label="Goto page {{ index }}"
                @click="getStockoutList(index)"
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
export default {
  name: 'StokoutListView',
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
      this.getStockoutList(this.currentPage - 1)
    },
    nextPage() {
      this.getStockoutList(this.currentPage + 1)
    },
    getStockoutList(p) {
      this.currentPage = p
      axios
        .get(`/api/v1/stockout/list/?page=${p}`)
        .then(response => {
          this.page = response.data
          console.log(this.page.results)
          this.pageTotal = Math.ceil(this.page.count / this.pageSize)
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  mounted() {
    this.getStockoutList(1)
  }
}
</script>
