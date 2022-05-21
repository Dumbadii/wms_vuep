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

          <div class="field">
            <label>First name</label>
            <div class="control">
              <input type="text" class="input" v-model="first_name">
            </div>
          </div>

          <div class="field">
            <label>Last name</label>
            <div class="control">
              <input type="text" class="input" v-model="last_name">
            </div>
          </div>

          <div class="field">
              <label>部门</label>
              <div class="control">
                <select v-model="department" class="bottomline">
                    <option value="">--</option>
                    <option v-for="obj in departments" :key="obj.id" :value="obj.id">{{ obj.code }}-{{ obj.name }}</option>
                </select>
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
      first_name: '',
      last_name: '',
      department: '',
      departments: [],
      errors: []
    }
  },
  mounted() {
    this.getDepartments()
  },
  methods: {
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
    submitForm() {
      this.errors = []

      if(this.username === '') {
        this.errors.push('The username is missing')
      }
      if(this.password === '') {
        this.erros.push('The password is too short')
      }
      if(this.first_name === '') {
        this.errors.push('The first name is missing')
      }
      if(this.department === '') {
        this.errors.push('The department is missing')
      }
      if(this.last_name === '') {
        this.erros.push('The last name is missing')
      }
      if(this.password2 !== this.password) {
        this.errors.push('The passwords doesn\'t mathc')
      }

      if(!this.errors.length) {
        let data = new FormData()
        data.append('username', this.username)
        data.append('password', this.password)
        data.append('last_name', this.last_name)
        data.append('first_name', this.first_name)
        data.append('department', this.department)

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
