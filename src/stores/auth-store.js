import { defineStore } from 'pinia'
import axios from 'axios'
import { useUserStore } from './user-store'

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    user: localStorage.getItem('user') || null,
    returnUrl: null
  }),
  actions: {
    async register (rName, rSurname, rEmail, rPassword) {
      const userStore = useUserStore()
      try {
        // await fetchWrapper.post(`${baseUrl}/authenticate`, { username, password })
        axios.post('http://localhost:5264/api/auth/register', {
          name: rName,
          surname: rSurname,
          email: rEmail,
          password: rPassword
        }).then(RESPONSE => {
          const token = RESPONSE.data.token
          const user = RESPONSE.data.user
          this.user = user
          userStore.storeLoggedInUser(token, user)
          // alert(RESPONSE.data.message)
        }).catch(ERROR => {
          console.log(ERROR)
          alert(ERROR.message)
        }).finally(() => {
          this.submitting = false
        })

        // store user details and jwt in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(this.user))
      } catch (error) {
      }
    },
    async login (loginMail, loginPassword) {
      const userStore = useUserStore()
      try {
        axios.post('http://localhost:5264/api/Auth/login', {
          email: loginMail,
          password: loginPassword
        }).then(RESPONSE => {
          console.log(RESPONSE)
          const token = RESPONSE.data.token
          const user = RESPONSE.data.user
          userStore.storeLoggedInUser(token, user)
        }).catch(ERROR => {
          // console.log(ERROR)
          alert(ERROR.message)
        }).finally(() => {
          this.submitting = false
        })
        console.log(userStore.token)
        // redirect to previous url or default to home page
        // Router.push(this.returnUrl || '/')
      } catch (error) {
        // const alertStore = useAlertStore()
        console.log(error)
      }
    },
    logout () {
      this.user = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      // Router.push('/auth/login')
    }
  }
})
