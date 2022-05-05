<template>
  <div class="page-stockin">
    <div class="columns is-multiline">
      <div class="column is-11">
        <h1 class="title">入库</h1>
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
              <th>品名</th>
              <th>编号</th>
              <th>品牌</th>
              <th>单位</th>
              <th>数量</th>
              <th>条码数</th>
              <th>单价</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody v-if="!stockin.confirmed">
            <tr v-for="detail in stockin.details" :key="detail.id">
              <td>{{ detail.item.name }}</td>
              <td>{{ detail.item.code }}</td>
              <td>{{ detail.item.brand }}</td>
              <td>{{ detail.item.unit.name }}</td>
              <td >
                <div class="control">
                  <input type="number" class="input" min="0" v-model="detail.amount" />
                </div>
              </td>
              <td >
                <div class="control">
                  <input type="number" class="input" min="1" v-model="detail.barcode_count" />
                </div>
              </td>
              <td >
                <div class="control">
                  <input type="number" class="input" min="0" v-model="detail.price" />
                </div>
              </td>
              <td>
                <a @click="removeDetail(detail)">
                  <span class="icon-text">
                    <span class="icon">
                      <i class="fas fa-eraser"></i>
                    </span>
                  </span>
                </a>
              </td>
            </tr>
          </tbody>

          <tbody v-else>
            <tr v-for="detail in stockin.details" :key="detail.id">
              <td>{{ detail.item.name }}</td>
              <td>{{ detail.item.code }}</td>
              <td>{{ detail.item.brand }}</td>
              <td>{{ detail.item.unit.name }}</td>
              <td>{{ detail.amount }}</td>
              <td>{{ detail.barcode_count }}</td>
              <td>{{ detail.price }}</td>
              <td>
                <a @click="listBarcodes(detail.id)">
                  <span class="icon-text">
                    <span class="icon">
                      <i class="fas fa-list"></i>
                    </span>
                  </span>
                </a>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr v-if="!stockin.confirmed">
              <td colspan="8">
                <div class="select is-small is-success">
                    <select v-model="newItem">
                      <option v-for="obj in items" :key="obj.id" :value="obj">{{ obj.code }}-{{ obj.name }}</option>
                    </select>
                  </div>
                  <a @click="addLine">
                    <span class="icon-text">
                      <span class="icon">
                        <i class="fas fa-plus-circle"></i>
                      </span>
                      <span>添加</span>
                    </span>
                  </a>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div class="column is-12 box" v-if="!stockin.confirmed">
          <h2 class="subtitle">基本信息</h2>
          <p class="has-text-grey mb-4">* 必填</p>
          <div class="columns is-multiline">
            <div class="field column is-6">
              <label>入库单号</label>
              <div class="control">
                <input type="text" class="input" v-model="stockin.code" placeholder="自动生成" disabled>
              </div>
            </div>
            <div class="field column is-6">
              <label>物品来源*</label>
              <div class="control">
                <input type="text" class="input" v-model="stockin.vendor">
              </div>
            </div>
            <div class="field column is-6">
              <label>入库日期</label>
              <div class="control">
                <input type="text" class="input" v-model="stockin.create_date" placeholder="自动生成" disabled>
              </div>
            </div>
            <div class="field column is-6">
              <label>备注</label>
              <div class="control">
                <input type="text" class="input" v-model="stockin.memo">
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
                入库单号: {{ stockin.code }} 
              </p>
            </div>
            <div class="field column is-6">
              <p class="is-medium">
                入库日期: {{ stockin.create_date }} 
              </p>
            </div>
            <div class="field column is-6">
              <p class="is-medium">
                物品来源: {{ stockin.vendor }}
              </p>
            </div>
            <div class="field column is-6">
              <p class="is-medium">
                备注: {{ stockin.memo }}
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
            <button class="button is-dark" @click="submitForm" v-if="!stockin.confirmed">保存</button>
            <button class="button is-dark" @click="confirmStockin" v-if="parseInt(stockin.id)>0 && !stockin.confirmed">确认</button>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script>
  import axios from 'axios'
  import { toast } from 'bulma-toast'

  export default {
    name: 'StockinView',
    props: {
      id: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        stockin: {
          id: 0,
          code: '',
          vendor: '',
          create_date: '',
          memo: '',
          confirmed: false,
          details: [],
        },
        newItem: Object,
        items: [],
        errors: [],
      }
    },
    components: {
    },
    mounted() {
      document.title = 'Stockin | WMS'
      this.getItems()
      if (this.id) {
        this.getStockin()
      }
    },
    methods: {
      listBarcodes(detail){
        console.log(`id${detail}`)
        axios
          .get(`/api/v1/barcodes/detail/${detail}/`)
          .then(response => {
            const codes = response.data;
            const msg = codes.map(c=>`<li>${c.code}</li>`).join('')
            toast({
              message: `<ul>${msg}</ul>`,
              type: 'is-success',
              position: 'center',
              dismissible: true,
              pauseOnHover: true,
            })
          })
          .catch(error => {
            console.log(error)
          })
      },
      addLine() {
        const codes = this.stockin.details.map(d=>d.item.code)
        if(codes.indexOf(this.newItem.code) != -1) {
          return
        }
        let line = {
          item: this.newItem,
          id: 0,
          amount: 0.0,
          price: 0.0,
          barcode_count: 0,
        }
        this.stockin.details.push(line);

      },
      async getStockin() {
        if(parseInt(this.id)==0) {
          return
        }
        await axios
          .get(`/api/v1/stockin/${this.id}/`)
          .then(response => {
            this.stockin = response.data
            console.log(this.stockin)
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
    removeDetail(detail) {
      this.stockin.details = this.stockin.details.filter(i => i!==detail)
    },
    submitForm() {
      this.errors = []
      if (this.stockin.vendor === '') {
          this.errors.push('The vendor field is missing!')
      }

      let post_stockin = {
        vendor: this.stockin.vendor,
        memo: this.stockin.memo,
        details: []
      }
      let bid = parseInt(this.stockin.id)
      post_stockin['id'] =bid

      for(const d of this.stockin.details) {
        const obj={
          id: d.id,
          price: d.price,
          amount: d.amount,
          barcode_count: d.barcode_count,
          item: d.item.id
        }
        post_stockin.details.push(obj)
      }
      if (!this.errors.length) {
        axios
          .post('/api/v1/stockin/create/', post_stockin)
          .then(() => {
            console.log('success')

            toast({
              message: 'stockin saved!',
              type: 'is-success',
              position: 'center',
              dismissible: true,
              pauseOnHover: true,
            })
          })
          .catch(error => {
            this.errors.push('Something went wrong. Please try again')
            console.log(error)
          })
      }
    },
    confirmStockin() {
      axios
        .post(`/api/v1/stockin/confirm/${this.id}/`)
        .then(() => {
          console.log('success')
        toast({
          message: 'The stockin was confirmed',
          type: 'is-success',
          dismissible: true,
          duration: 2000,
          position: 'bottom-right',
        })
          const toPath = this.$route.query.to || '/stockin/list'
          this.$router.push(toPath)
        })
        .catch(error => {
          this.errors.push('Something wrong when confirming..')
          console.log('error')
        })
    }
  },
  computed: {
  }
}
</script>
