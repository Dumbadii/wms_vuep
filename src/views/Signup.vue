<template>
  <div class="page-sign-up">
    <div class="columns">
      <div class="column is-4 is-offset-4">
        <h1 class="title">Sign up</h1>
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

          <div class="field">
            <label>Repeat password</label>
            <div class="control">
              <input type="text" class="input" v-model="password2">
            </div>
          </div>

          <div class="notification is-danger" v-if="errors.length">
            <p v-for="error in errors" :key="error">{{ error }}</p>
          </div>

          <div class="field">
            <div class="control">
              <button class="button is-dark">Sign up</button>
            </div>
          </div>

          <hr>
          Or <router-link to="/log-in">click here</router-link> to login in!
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { toast } from 'bulma-toast'

export default {
  name: 'SignupView',
  data() {
    return {
      username: '',
      password: '',
      password2: '',
      errors: []
    }
  },
  methods: {
    submitForm() {
      this.errors = []

      if(this.username === '') {
        this.errors.push('The username is missing')
      }
      if(this.password === '') {
        this.erros.push('The password is too short')
      }
      if(this.password2 !== this.password) {
        this.errors.push('The passwords doesn\'t mathc')
      }

      if(!this.errors.length) {
        let data = new FormData()
        data.append('username', this.username)
        data.append('password', this.password)

        axios
          .post("/api/v1/user/register/", data)
          .then(response => {
            toast({
              message: 'Account created, please long in!',
              type: 'is-success',
              dismisskble: true,
              pauseOnHover: true,
              duration: 2000,
              position: 'bottom-right',
            })
            console.log(response)
            this.$router.push('/login')
          })
          .catch(error => {
            if(error.response) {
              for (const property in error.response.data) {
                this.errors.push(`${property}: ${error.response.data[property]}`)
              }
              console.log(JSON.stringfy(error.response.data))
            } else if (error.message) {
              this.errors.push('something went wrong. Please try again')
              console.log(JSON.stringfy(error))
            }
          })
      }
    }
  }

}
</script>
