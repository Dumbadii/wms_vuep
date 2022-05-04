<template>
  <div class="page-log-in">
    <div class="columns">
      <div class="column is-4 is-offset-4">
        <h1 class="title">Log in</h1>
        
        <form @submit.prevent="submitForm">
          <div class="field">
            <label>Username</label>
            <div class="control">
              <input type="text" class="input" v-model="username">
            </div>
          </div>

          <div class="field">
            <label>Password</label>
            <div class="control">
              <input type="text" class="input" v-model="password">
            </div>
          </div>

          <div class="notification is-danger" v-if="errors.length">
            <p v-for="error in errors" :key="error">{{ error }}</p>
          </div>

          <div class="field">
            <div class="control">
              <button class="button is-dark">Log in</button>
            </div>
          </div>

          <hr>

          Or <router-link to="/signup">click here</router-link> to sign up!
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'LoginView',
  data() {
    return {
      username: '',
      password: '',
      errors: []
    }
  },
  mouted() {
    document.title = 'login | wms'
  },
  methods: {
    async submitForm() {
      axios.defaults.headers.common['Authorization'] = ''
      localStorage.removeItem('token')
      let formData = new FormData()
      formData.append('username', this.username)
      formData.append('password', this.password)

      await axios
        .post('/api/v1/user/token/', formData)
        .then(response => {
          const token = response.data.token
          this.$store.commit('setToken', token)
          axios.defaults.headers.common['Authorization'] = "Token " + token
          localStorage.setItem('token', token)
          // localStorage.setItem('isAuthenticated', True)
          const toPath = this.$route.query.to || '/about'
          this.$router.push(toPath)
        })
        .catch(error => {
          if (error.response) {
            for (const prop in error.response.data) {
              this.errors.push(`${prop}: ${error.response.data[prop]}`)
            } 
          } else {
              this.errors.push('Something went wrong. Please try again')
              console.log(JSON.stringfy(error))
          }
        })
    }
  }

}
</script>