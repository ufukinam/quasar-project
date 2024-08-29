import { defineStore } from 'pinia'
import { useUserStore } from './user-store'
import { post } from '../utilty/api'
import { notify } from '../utilty/notify'

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    user: localStorage.getItem('user') || null,
    returnUrl: null
  }),
  actions: {
    async register (rName, rSurname, rEmail, rPassword) {
      try {
        const response = await post('/Auth/register', {
          name: rName,
          surname: rSurname,
          email: rEmail,
          password: rPassword
        })
        if (response.success) {
          const userStore = useUserStore()
          userStore.storeLoggedInUser(response.data.token, response.data.user)
          this.router.push('/')
        } else {
          notify({ type: 'negative', message: response.message })
        }
      } catch (error) {
        notify({ type: 'negative', message: error.message })
      }
    },
    async login (loginMail, loginPassword) {
      try {
        const response = await post('/Auth/login', {
          email: loginMail,
          password: loginPassword
        })
        console.log(JSON.stringify(response))
        if (response.success) {
          const userStore = useUserStore()
          userStore.storeLoggedInUser(response.data.token, response.data.user)
          this.router.push('/')
        } else {
          notify({ type: 'negative', message: response.message })
        }
      } catch (error) {
        notify({ type: 'negative', message: error.message })
      }
    },
    logout () {
      this.user = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      const userStore = useUserStore()
      userStore.token = null
      userStore.menuItems = null
      this.router.push('/auth/login')
    }
  }
})
