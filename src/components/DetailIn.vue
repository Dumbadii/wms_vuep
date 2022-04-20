<template>
  <tr>
    <td>
      <div class="select">
        <select v-model="detail.item" @change="onchange()">
          <option v-for="obj in items" :key="obj.id" :value="obj">{{ obj.code }}-{{ obj.name }}</option>
        </select>
      </div>
    </td>
    <td>{{ detail.item.name }}</td>
    <td>{{ detail.item.brand }}</td>
    <td>{{ detail.item.unit.name }}</td>
    <td>
      <div class="control">
        <input type="number" class="input" min="0" v-model="detail.amount" />
      </div>
    </td>
    <td>
      <div class="control">
        <input type="number" class="input" min="0" v-model="detail.price" />
      </div>
    </td>
    <td>
      <div class="control">
        <input type="number" class="input" min="1" v-model="detail.barcode_count" />
      </div>
    </td>
    <td>
      <button class="delete" @click="removeDetail"></button>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'DetailIn',
  props: {
    initialDetail: Object,
    initialItems: []
  },
  data() {
    return {
      detail: this.initialDetail,
      items: this.initialItems
    }
  },
  methods : {
    removeDetail() {
      this.$emit('remove', this.detail)
      console.log('in component')
    },
    onchange() {
      console.log(this.detail)
    }
  }
}
</script>
