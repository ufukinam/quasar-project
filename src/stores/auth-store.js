import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    user: JSON.parse(localStorage.getItem('user')),
    returnUrl: null
  }),
  actions: {
    async register (name, email, password) {
      try {
        // await fetchWrapper.post(`${baseUrl}/authenticate`, { username, password })
        axios.post('/authenticate/register', {
          name,
          email,
          password
        }).then(RESPONSE => {
          const token = RESPONSE.data.authorisation.token
          const user = RESPONSE.data.user
          this.user = user
          this.storeLoggedInUser(token, user)
          alert(RESPONSE.data.message)
        }).catch(ERROR => {
          console.log(ERROR)
          alert(ERROR.response.data.message)
        }).then(() => {
          this.submitting = false
        })

        // store user details and jwt in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(this.user))

        // redirect to previous url or default to home page
        // Router.push(this.returnUrl || '/')
      } catch (error) {
        // const alertStore = useAlertStore()
        // alertStore.error(error)
      }
    },
    async login (email, password) {
      try {
        // await fetchWrapper.post(`${baseUrl}/authenticate`, { username, password })
        axios.post('/authenticate/login', {
          email,
          password
        }).then(RESPONSE => {
          const token = RESPONSE.data.authorisation.token
          const user = RESPONSE.data.user
          this.storeLoggedInUser(token, user)
          alert(RESPONSE.data.message)
        }).catch(ERROR => {
          console.log(ERROR)
          alert(ERROR.response.data.message)
        }).then(() => {
          this.submitting = false
        })

        // redirect to previous url or default to home page
        // Router.push(this.returnUrl || '/')
      } catch (error) {
        // const alertStore = useAlertStore()
        // alertStore.error(error)
      }
    },
    logout () {
      this.user = null
      localStorage.removeItem('user')
      // Router.push('/auth/login')
    }
  }
})
