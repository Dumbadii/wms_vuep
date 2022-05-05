<template>
  <div class="page-barcode-list">
    <div class="columns is-multiline">
      <div class="column is-12">
        <h1 class="title">物品列表</h1>
      </div>
      <div class="column is-12">
        <div class="field is-horizontal">
          <div class="field-body">
            <div class="field is-narrow">
              <div class="control">
                <div class="select is-fullwidth">
                  <select v-model="type1">
                      <option value="">一级分类</option>
                      <option v-for="obj in types1" :key="obj.id" :value="obj">{{ obj.code }}-{{ obj.name }}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="field is-narrow">
              <div class="control">
                <div class="select is-fullwidth">
                  <select v-model="type2">
                      <option value="">二级分类</option>
                      <option v-for="obj in subTypes2" :key="obj.id" :value="obj">{{ obj.code }}-{{ obj.name }}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="field is-narrow">
              <div class="control">
                <div class="select is-fullwidth">
                  <select v-model="item">
                      <option value="">物品</option>
                      <option v-for="obj in subItems" :key="obj.id" :value="obj.code">{{ obj.code }}-{{ obj.name }}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="field is-narrow">
              <div class="control">
                <div class="select is-fullwidth">
                  <select v-model="department">
                      <option value="">位置</option>
                      <option v-for="obj in departments" :key="obj.id" :value="obj.code">{{ obj.code }}-{{ obj.name }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-body">
            <div class="field is-narrow">
              <div class="control">
                <div class="select is-fullwidth">
                  <select v-model="status">
                      <option value="">物品状态</option>
                      <option v-for="obj in statuss" :key="obj.statusId" :value="obj.statusId">{{ obj.statusId }}-{{ obj.statusName }}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="field is-narrow">
              <div class="control">
                <input class="input is-danger" type="text" placeholder="品名" v-model="itemName">
              </div>
            </div>
            <div class="field is-narrow">
              <div class="control">
                <input class="input is-danger" type="text" placeholder="条码" v-model="code">
              </div>
            </div>
            <div class="field is-grouped is-grouped-centered">
              <div class="control">
                <button class="button is-primary" @click="getBarcode(1)">
                  搜索
                </button>
              </div>
              <div class="control">
                <button class="button is-primary" @click="reset">
                  重置
                </button>
              </div>
            </div>
          </div>
        </div>
        <hr>
      </div>
      <div class="column is-12">
        <table class="table is-fullwidth">
          <thead>
              <tr>
                  <th>序号</th>
                  <th>条码</th>
                  <th>一级分类</th>
                  <th>二级分类</th>
                  <th>品名</th>
                  <th>位置</th>
                  <th>数量</th>
                  <th>单位</th>
                  <th>状态</th>
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
                  <td>{{ item.type1 }}</td>
                  <td>{{ item.type2 }}</td>
                  <td>{{ item.item }}</td>
                  <td>{{ item.department }}</td>
                  <td>{{ item.amount }}</td>
                  <td>{{ item.unit }}</td>
                  <td>{{ item.status }}</td>
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
                @click="getBarcode(index)"
              >
                {{ index }}
              </a>
              <a
                v-else-if="index==1 || index==pageTotal || Math.abs(index-currentPage)<pageOffset"
                class="pagination-link"
                aria-label="Goto page {{ index }}"
                @click="getBarcode(index)"
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
  name: 'BarcodeListView',
  data() {
    return {
      page: {
        count: 0,
        next: null,
        previous: null,
        results: [],
      },
      currentPage: 1,
      pageTotal: 0,
      pageSize: 10,
      pageOffset: 2,
      items: [],
      subItems: [],
      types1: [],
      types2: [],
      subTypes2: [],
      type1: '',
      type2: '',
      department: '',
      departments: [],
      status: '',
      statuss: [],
      code: '',
      item: '',
      itemName: '',
    }
  },
  methods: {
    previousPage() {
      this.getBarcode(this.currentPage - 1)
    },
    nextPage() {
      this.getBarcode(this.currentPage + 1)
    },
    getBarcode(p) {
      this.currentPage = p
      axios
        .get(`/api/v1/barcodes/search/`, {
          params: this.axiosParams
        })
        .then(response => {
          this.page = response.data
          this.pageTotal = Math.ceil(this.page.count / this.pageSize)
        })
        .catch(error => {
          console.log(error)
        })
    },
    reset() {
      this.type1 = ''
      this.type2 = ''
      this.item = ''
      this.itemName = ''
      this.status = ''
      this.department = ''
      this.code = ''
    },
    getItems() {
      axios
        .get(`/api/v1/items/`)
        .then(response => {
          this.items = response.data
        })
        .catch(error => {
          console.log(error)  
        })
    },
    getDepartments() {
      axios
        .get(`/api/v1/departments/`)
        .then(response => {
          this.departments = response.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    getStatus() {
      axios
        .get(`/api/v1/status/`)
        .then(response => {
          this.statuss = response.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    getType1() {
      axios
        .get(`/api/v1/type1/`)
        .then(response => {
          this.types1 = response.data
        })
        .catch(error => {
          console.log(error) 
        })
    },
    getType2() {
      axios
        .get(`/api/v1/type2/`)
        .then(response => {
          this.types2 = response.data
        })
        .catch(error => {
          console.log(error) 
        })
    },
  },
  computed: {
        axiosParams() {
          const params = new URLSearchParams();
          params.append('page', this.currentPage);
          if(this.type1!=='')
            params.append('type1', this.type1.code);
          if(this.type2!=='')
            params.append('type2', this.type2.code);
          if(this.item!=='')
            params.append('item', this.item);
          if(this.department!=='')
            params.append('department', this.department);
          if(this.status!=='')
            params.append('status', this.status);
          if(this.code!=='')
            params.append('code', this.code);
          if(this.itemName!=='')
            params.append('itemName', this.itemName);
          return params;
        }
  },
  mounted() {
    document.title = 'Barcode | WMS'
    this.getItems()
    this.getType1()
    this.getType2()
    this.getStatus()
    this.getDepartments()
  },
  watch: {
    type1: function(){
      this.subTypes2 = this.types2.filter(t => t.parent==this.type1.id)
    },
    type2: function(){
      this.subItems = this.items.filter(i => i.type2 == this.type2.id)
    },
  },
}
</script>
