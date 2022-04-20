<template>
  <div class="page-stockout">
    <div class="columns is-multiline">
      <div class="column is-11">
        <h1 class="title">Stockout</h1>
      </div>

      <div class="column is-1">
        <router-link exact-active-class="is-active" :to="{ name: 'stockout_list' }">
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
            <tr v-for="detail in stockout.details" :key="detail.id">
              <td>{{ detail.barcode.code }}</td>
              <td>{{ detail.barcode.item.name }}</td>
              <td>{{ detail.barcode.amount }}</td>
              <td>{{ detail.item.unit.name }}</td>
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
            <tr>
                <td colspan="2">
                    <div class="control">
                        <input class="input" type="text" placeholder="Barcode input" value="">
                    </div>
                </td>
                <td colspan="3">
                </td>
            </tr>
            <tr>
              <td>
                    <div class="control">
                    <select v-model="type1">
                        <option v-for="obj in types1" :key="obj.id" :value="obj">{{ obj.code }}-{{ obj.name }}</option>
                    </select>
                    </div>
              </td>
              <td>
                    <div class="control">
                    <select v-model="type2">
                        <option v-for="obj in subTypes2" :key="obj.id" :value="obj">{{ obj.code }}-{{ obj.name }}</option>
                    </select>
                </div>
              </td>
              <td>
                    <div class="control">
                    <select v-model="item">
                        <option v-for="obj in subItems" :key="obj.id" :value="obj">{{ obj.code }}-{{ obj.name }}</option>
                    </select>
                    </div>
              </td>
              <td>
                    <div class="control">
                    <select v-model="barcode">
                        <option v-for="obj in barcodes.filter(b=>b.item==item)" :key="obj.id" :value="obj">{{ obj.code }}-{{ obj.name }}</option>
                    </select>
                    </div>
              </td>
              <td> 
                <a @click="addLine">
                <span class="icon-text">
                    <span class="icon">
                    <i class="fas fa-plus-circle"></i>
                    </span>
                    <span>Add line</span>
                </span>
                </a>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="column is-12 box">
        <h2 class="subtitle">Stockout details</h2>
        <p class="has-text-grey mb-4">* All fields are required</p>
        <div class="columns is-multiline">
        <div class="field column is-6">
            <label>Stockout code*</label>
            <div class="control">
            <input type="text" class="input" v-model="stockout.code">
            </div>
        </div>
        <div class="field column is-6">
            <label>Employee*</label>
            <div class="control">
            <select v-model="newItem">
                <option v-for="obj in items" :key="obj.id" :value="obj">{{ obj.code }}-{{ obj.name }}</option>
            </select>
            </div>
        </div>
        <div class="field column is-6">
            <label>Desciption*</label>
            <div class="control">
            <input type="text" class="input" v-model="stockout.memo">
            </div>
        </div>
        <div class="field column is-6">
            <label>Department*</label>
            <div class="control">
            <select v-model="newItem">
                <option v-for="obj in items" :key="obj.id" :value="obj">{{ obj.code }}-{{ obj.name }}</option>
            </select>
            </div>
        </div>
        </div>

          <div class="notification is-danger mt-4" v-if="errors.length">
            <p v-for="error in errors" :key="error"> {{ error }} </p>
          </div>

          <div>
            <hr>
            <div class="buttons">
              <button class="button is-dark" @click="submitForm" v-if="!stockout.confirmed">Save</button>
              <button class="button is-dark" @click="confirmStockout" v-if="parseInt(stockout.id)>0 && !stockout.confirmed">Confirm</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script>
  import axios from 'axios'
  import { toast } from 'bulma-toast'

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
          vendor: '',
          create_date: '',
          memo: '',
          confirmed: false,
          details: [],
        },
        newItem: Object,
        items: [],
        subItems: [],
        types1: [],
        types2: [],
        subTypes2: [],
        barcodes: [],
        subBarcodes: [],
        type1: Object,
        type2: Object,
        item: Object,
        errors: [],
      }
    },
    components: {
    },
    mounted() {
      document.title = 'Stockout | WMS'
      this.getItems()
      this.getType1()
      this.getType2()
      //if (this.id) {
      //  this.getStockout()
      //}
    },
    watch: {
      type1: function(){
          console.log(this.type1)
          this.subTypes2 = this.types2.filter(t => t.parent==this.type1.id)
      },
      type2: function(){
          this.subItems = this.items.filter(i => i.type2 == this.type2.id)
      },
    },
    methods: {
      listBarcodes(detail){
        console.log(`id${detail}`)
        axios
          .get(`/api/v1/barcodes/${detail}/`)
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
        const codes = this.stockout.details.map(d=>d.item.code)
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
            console.log(this.stockout)
        })
        .catch(error => {
          console.log(error)
        })
    },
    getItems() {
      axios
        .get(`/api/v1/allitems/`)
        .then(response => {
          this.items = response.data
          console.log(this.items)
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
      if (this.stockout.code === '') {
          this.errors.push('The code field is missing!')
      }
      if (this.stockout.vendor === '') {
          this.errors.push('The vendor field is missing!')
      }

      let post_stockout = {
        vendor: this.stockout.vendor,
        memo: this.stockout.memo,
        details: []
      }
      let bid = parseInt(this.stockout.id)
      post_stockout['id'] =bid

      for(const d of this.stockout.details) {
        const obj={
          id: d.id,
          price: d.price,
          amount: d.amount,
          barcode_count: d.barcode_count,
          item: d.item.id
        }
        post_stockout.details.push(obj)
      }
      if (!this.errors.length) {
        axios
          .post('/api/v1/stockout/create/', post_stockout)
          .then(() => {
            console.log('success')

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
            console.log(error)
          })
      }
    },
    confirmStockout() {
      axios
        .post(`/api/v1/stockout/confirm/${this.id}/`)
        .then(() => {
          console.log('success')
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
          console.log('error')
        })
    }
  },
  computed: {
  }
}
</script>