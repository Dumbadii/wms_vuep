<template>
  <div class="page-stockdisable">
    <div class="columns is-multiline">
      <div class="column is-11">
        <h1 class="title">Stockdisable</h1>
      </div>

      <div class="column is-1">
        <router-link exact-active-class="is-active" :to="{ name: 'stockdisable_list' }">
          <span class="icon">
            <i class="fas fa-window-close"></i>
          </span>
        </router-link>
      </div>

      <div class="column is-12 box">
        <table class="table is-fullwidth">
          <thead>
            <tr>
              <th>Barcode</th>
              <th>Item name</th>
              <th>Amount</th>
              <th>Unit</th>
              <th>Op</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="detail in stockdisable.details" :key="detail.id">
              <td>{{ detail.barcode.code }}</td>
              <td>{{ items.filter(i=>i.id==detail.barcode.item)[0].name }}</td>
              <td>{{ detail.barcode.amount }}</td>
              <td>{{ items.filter(i=>i.id==detail.barcode.item)[0].unit.name }}</td>
              <td>
                <a v-if="!stockdisable.confirmed" @click="removeDetail(detail)">
                  <span class="icon-text">
                    <span class="icon">
                      <i class="fas fa-eraser"></i>
                    </span>
                  </span>
                </a>
              </td>
            </tr>
          </tbody>
          <tfoot v-if="!stockdisable.confirmed">
          </tfoot>
        </table>
      </div>
      <div class="column is-12 box" v-if="!stockdisable.confirmed">
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
                <span>Add line</span>
            </span>
            </a>
          </div>
        </div>
      </div>

      <div class="column is-12 box" v-if="!stockdisable.confirmed">
        <h2 class="subtitle">Stockdisable details</h2>
        <p class="has-text-grey mb-4">* All fields are required</p>
        <div class="columns is-multiline">
          <div class="field column is-6">
              <label>Stockdisable code*</label>
              <div class="control">
                <input type="text" class="input" v-model="stockdisable.code" disabled>
              </div>
          </div>
          <div class="field column is-6">
              <label>Cretae date*</label>
              <div class="control">
              <input type="text" class="input" v-model="stockdisable.create_date" disabled>
              </div>
          </div>
          <div class="field column is-6">
              <label>Desciption*</label>
              <div class="control">
              <input type="text" class="input" v-model="stockdisable.memo">
              </div>
          </div>
        </div>
      </div>

      <div class="column is-12 box" v-else>
        <h2 class="subtitle">Stockdisable details</h2>
        <hr>
        <div class="columns is-multiline">
          <div class="field column is-6">
            <p class="is-medium">
              Stockdisable code: {{ stockdisable.code }} 
            </p>
          </div>
          <div class="field column is-6">
            <p class="is-medium">
              Create date: {{ stockdisable.create_date }} 
            </p>
          </div>
          <div class="field column is-6">
            <p class="is-medium">
              Description: {{ stockdisable.memo }}
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
          <button class="button is-dark" @click="submitForm" v-if="!stockdisable.confirmed">Save</button>
          <button class="button is-dark" @click="confirmStockdisable" v-if="parseInt(stockdisable.id)>0 && !stockdisable.confirmed">Confirm</button>
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

  export default {
    name: 'StockdisableView',
    props: {
      id: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        stockdisable: {
          id: 0,
          code: '',
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
        type1: Object,
        type2: Object,
        item: Object,
        errors: [],
      }
    },
    computed: {
    },
    mounted() {
      document.title = 'Stockdisable | WMS'
      this.getItems()
      this.getType1()
      this.getType2()
      this.getBarcodes()
      if (this.id) {
        this.getStockdisable()
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
          const codes = this.stockdisable.details.map(d=>d.barcode.code)
          if(codes.indexOf(this.inputBarcode) == -1) {
            let line = {
              id: 0,
              barcode: newBarcodes[0]
            }
            this.stockdisable.details.push(line);
          }
        }
        this.inputBarcode=''
      },
      addSelectLine() {
        const barcodes = this.stockdisable.details.map(d=>d.barcode.code)
        if(barcodes.indexOf(this.newBarcode.code) != -1) {
          return
        }
        let line = {
          id: 0,
          barcode: this.newBarcode
        }
        this.stockdisable.details.push(line);
      },
      async getStockdisable() {
        if(parseInt(this.id)==0) {
          return
        }
        await axios
          .get(`/api/v1/stockdisable/${this.id}/`)
          .then(response => {
            this.stockdisable = response.data
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
      this.stockdisable.details = this.stockdisable.details.filter(i => i!==detail)
    },
    submitForm() {
      this.errors = []

      let post_stockdisable = {
        memo: this.stockdisable.memo,
        details: []
      }
      let bid = parseInt(this.stockdisable.id)
      post_stockdisable['id'] =bid

      for(const d of this.stockdisable.details) {
        const obj={
          id: d.id,
          barcode: d.barcode.id,
        }
        post_stockdisable.details.push(obj)
      }

      if (!this.errors.length) {
        axios
          .post('/api/v1/stockdisable/create/', post_stockdisable)
          .then(() => {
            toast({
              message: 'stockdisable saved!',
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
    confirmStockdisable() {
      axios
        .post(`/api/v1/stockdisable/confirm/${this.id}/`)
        .then(() => {
          toast({
            message: 'The stockdisable was confirmed',
            type: 'is-success',
            dismissible: true,
            duration: 2000,
            position: 'bottom-right',
          })
          const toPath = this.$route.query.to || '/stockdisable/list'
          this.$router.push(toPath)
        })
        .catch(error => {
          this.errors.push('Something wrong when confirming..')
        })
    }
  },
  computed: {
  }
}
</script>