<template>
  <div class="page-stockout">
    <div class="columns is-multiline">
      <div class="column is-11">
        <h1 class="title">领用</h1>
      </div>

      <div class="column is-1">
        <span class="icon">
          <i class="fas fa-window-close" @click="$router.back()"></i>
        </span>
      </div>

      <div class="column is-12 box">
        <table class="table is-fullwidth">
          <thead>
            <tr>
              <th>条码</th>
              <th>品名</th>
              <th>数量</th>
              <th>单位</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="detail in stockout.details" :key="detail.id">
              <td>{{ detail.barcode.code }}</td>
              <td>{{ items.filter(i=>i.id==detail.barcode.item)[0].name }}</td>
              <td>{{ detail.barcode.amount }}</td>
              <td>{{ items.filter(i=>i.id==detail.barcode.item)[0].unit.name }}</td>
              <td>
                <a v-if="!stockout.confirmed" @click="removeDetail(detail)">
                  <span class="icon-text">
                    <span class="icon">
                      <i class="fas fa-eraser"></i>
                    </span>
                  </span>
                </a>
              </td>
            </tr>
          </tbody>
          <tfoot v-if="!stockout.confirmed">
          </tfoot>
        </table>
      </div>
      <div class="column is-12 box" v-if="!stockout.confirmed">
        <div class="columns is-multiline">
          <div class="column is-12">
            <input class="bottomline" v-model="inputBarcode" @keyup.enter="addInputLine">
          </div>
          <div class="column is-2">
            <div class="control">
              <select v-model="type1" class="bottomline">
                  <option v-for="obj in types1" :key="obj.id" :value="obj">{{ obj.code }}-{{ obj.name }}</option>
              </select>
            </div>
          </div>
          <div class="column is-2">
            <div class="control">
              <select v-model="type2" class="bottomline">
                  <option v-for="obj in subTypes2" :key="obj.id" :value="obj">{{ obj.code }}-{{ obj.name }}</option>
              </select>
            </div>
          </div>
          <div class="column is-2">
            <div class="control">
              <select v-model="item" class="bottomline">
                  <option v-for="obj in subItems" :key="obj.id" :value="obj">{{ obj.code }}-{{ obj.name }}</option>
              </select>
            </div>
          </div>
          <div class="column is-2">
            <div class="control">
              <select v-model="newBarcode" class="bottomline">
                  <option v-for="obj in subBarcodes" :key="obj.id" :value="obj">{{ obj.code }}</option>
              </select>
            </div>
          </div>
          <div class="column is-2">
            <a @click="addSelectLine">
            <span class="icon-text">
                <span class="icon">
                <i class="fas fa-plus-circle"></i>
                </span>
                <span>添加</span>
            </span>
            </a>
          </div>
        </div>
      </div>

      <div class="column is-12 box" v-if="!stockout.confirmed">
        <h2 class="subtitle">基本信息</h2>
        <p class="has-text-grey mb-4">* 必填项</p>
        <div class="columns is-multiline">
          <div class="field column is-6">
              <label>领用单号</label>
              <div class="control">
                <input type="text" class="input" v-model="stockout.code" placeholder="自动生成" disabled>
              </div>
          </div>
          <div class="field column is-6">
              <label>领用日期</label>
              <div class="control">
              <input type="text" class="input" v-model="stockout.create_date" placeholder="自动生成" disabled>
              </div>
          </div>
          <div class="field column is-6">
              <label>领用部门*</label>
              <div class="control">
              <select v-model="stockout.department" class="bottomline">
                  <option v-for="obj in departments" :key="obj.id" :value="obj.id">{{ obj.code }}-{{ obj.name }}</option>
              </select>
              </div>
          </div>
          <div class="field column is-6">
              <label>领用人员*</label>
              <div class="control">
              <select v-model="stockout.employee" class="bottomline">
                  <option v-for="obj in employees" :key="obj.id" :value="obj.id">{{ obj.user.username }}</option>
              </select>
              </div>
          </div>
          <div class="field column is-6">
              <label>备注</label>
              <div class="control">
              <input type="text" class="input" v-model="stockout.memo">
              </div>
          </div>
        </div>
      </div>

      <div class="column is-12 box" v-else>
        <h2 class="subtitle">基本信息</h2>
        <hr>
        <div class="columns is-multiline">
          <div class="field column is-6">
            <p class="is-medium">
              领用单号: {{ stockout.code }} 
            </p>
          </div>
          <div class="field column is-6">
            <p class="is-medium">
              领用日期: {{ stockout.create_date }} 
            </p>
          </div>
          <div class="field column is-6">
            <p class="is-medium">
              领用部门: {{ departments.filter(d=>d.id==stockout.department)[0].name }} 
            </p>
          </div>
          <div class="field column is-6">
            <p class="is-medium">
              领用人员: {{ employees.filter(e=>e.id==stockout.employee)[0].user.username }} 
            </p>
          </div>
          <div class="field column is-6">
            <p class="is-medium">
              备注: {{ stockout.memo }}
            </p>
          </div>
        </div>
      </div>

      <div class="notification is-danger mt-4" v-if="errors.length">
        <p v-for="error in errors" :key="error"> {{ error }} </p>
      </div>

      <div>
        <hr>
        <div class="buttons">
          <button class="button is-dark" @click="submitForm" v-if="!stockout.confirmed">保存</button>
          <button class="button is-dark" @click="confirmStockout" v-if="parseInt(stockout.id)>0 && !stockout.confirmed">确认</button>
          <button class="button is-dark" @click="getPdf" v-if="stockout.confirmed">打印</button>
        </div>
      </div>
      </div>
    </div>
  </template>
  <style lang="scss">
  .bottomline {
    width: 100%;
    outline: 0;
    border-width: 0 0 2px;
    /* #border-color: blue */
  }
  /* .bottomline:focus { */
    /* #border-color: green */
  /* } */
  
  </style>
  <script>
  import axios from 'axios'
  import { toast } from 'bulma-toast'
  const fileDownload = require('js-file-download')

  export default {
    name: 'StockoutView',
    props: {
      id: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        stockout: {
          id: 0,
          code: '',
          employee: 0,
          department: 0,
          create_date: '',
          memo: '',
          confirmed: false,
          details: [],
        },
        items: [],
        subItems: [],
        types1: [],
        types2: [],
        subTypes2: [],
        barcodes: [],
        subBarcodes: [],
        newBarcode: Object,
        inputBarcode: '',
        employees: [],
        departments: [],
        type1: Object,
        type2: Object,
        item: Object,
        errors: [],
      }
    },
    computed: {
    },
    mounted() {
      document.title = 'Stockout | WMS'
      this.getItems()
      this.getType1()
      this.getType2()
      this.getBarcodes()
      this.getEmployees()
      this.getDepartments()
      if (this.id) {
        this.getStockout()
      }
    },
    watch: {
      type1: function(){
        this.subTypes2 = this.types2.filter(t => t.parent==this.type1.id)
      },
      type2: function(){
        this.subItems = this.items.filter(i => i.type2 == this.type2.id)
      },
      item: function(){
        this.subBarcodes = this.barcodes.filter(b => b.item == this.item.id)
      },
    },
    methods: {
      addInputLine() {
        const newBarcodes = this.barcodes.filter(b=>b.code==this.inputBarcode)
        if(newBarcodes.length) {
          const codes = this.stockout.details.map(d=>d.barcode.code)
          if(codes.indexOf(this.inputBarcode) == -1) {
            let line = {
              id: 0,
              barcode: newBarcodes[0]
            }
            this.stockout.details.push(line);
          }
        }
        this.inputBarcode=''
      },
      addSelectLine() {
        const barcodes = this.stockout.details.map(d=>d.barcode.code)
        if(barcodes.indexOf(this.newBarcode.code) != -1) {
          return
        }
        let line = {
          id: 0,
          barcode: this.newBarcode
        }
        this.stockout.details.push(line);
      },
      async getStockout() {
        if(parseInt(this.id)==0) {
          return
        }
        await axios
          .get(`/api/v1/stockout/${this.id}/`)
          .then(response => {
            this.stockout = response.data
        })
        .catch(error => {
          console.log(error)
        })
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
    getEmployees() {
      axios
        .get(`/api/v1/employees/`)
        .then(response => {
          this.employees = response.data
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
    getBarcodes() {
      axios
        .get(`/api/v1/barcodes/status/1/`)
        .then(response => {
          this.barcodes = response.data
          
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
    removeDetail(detail) {
      this.stockout.details = this.stockout.details.filter(i => i!==detail)
    },
    submitForm() {
      this.errors = []
      if (this.department == 0) {
          this.errors.push('The department field is missing!')
      }

      if (this.employee == 0) {
          this.errors.push('The employee field is missing!')
      }

      let post_stockout = {
        department: this.stockout.department,
        employee: this.stockout.employee,
        memo: this.stockout.memo,
        details: []
      }
      let bid = parseInt(this.stockout.id)
      post_stockout['id'] =bid

      for(const d of this.stockout.details) {
        const obj={
          id: d.id,
          barcode: d.barcode.id,
        }
        post_stockout.details.push(obj)
      }

      if (!this.errors.length) {
        axios
          .post('/api/v1/stockout/create/', post_stockout)
          .then(() => {
            toast({
              message: 'stockout saved!',
              type: 'is-success',
              position: 'center',
              dismissible: true,
              pauseOnHover: true,
            })
          })
          .catch(error => {
            this.errors.push('Something went wrong. Please try again')
            
          })
      }
    },
    confirmStockout() {
      axios
        .post(`/api/v1/stockout/confirm/${this.id}/`)
        .then(() => {
          toast({
            message: 'The stockout was confirmed',
            type: 'is-success',
            dismissible: true,
            duration: 2000,
            position: 'bottom-right',
          })
          const toPath = this.$route.query.to || '/stockout/list'
          this.$router.push(toPath)
        })
        .catch(error => {
          this.errors.push('Something wrong when confirming..')
        })
    },
    getPdf() {
      const pk = this.id
      axios
        .get(`/api/v1/stockout/pdf/${pk}/`, {
            responseType: 'blob',
        }).then(res=> {
          fileDownload(res.data, `stockout${pk}.pdf`);
        }).catch(err=> {
          console.log(err);
        })
    },
  },
  computed: {
  }
}
</script>