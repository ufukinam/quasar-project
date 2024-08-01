import { defineStore } from 'pinia'
import { useUserStore } from './user-store'
import { post } from '../utilty/api'

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
        const data = await post('/Auth/register', {
          name: rName,
          surname: rSurname,
          email: rEmail,
          password: rPassword
        })
        const userStore = useUserStore()
        userStore.storeLoggedInUser(data.token, data.user)
        this.router.push('/')
      } catch (error) {
        console.error(error)
      }
    },
    async login (loginMail, loginPassword) {
      try {
        const data = await post('/Auth/login', {
          email: loginMail,
          password: loginPassword
        })
        const userStore = useUserStore()
        userStore.storeLoggedInUser(data.token, data.user)
        this.router.push('/')
      } catch (error) {
        console.error(error)
      }
    },
    logout () {
      this.user = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      this.router.push('/auth/login')
    }
  }
})
