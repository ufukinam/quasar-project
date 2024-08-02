import { defineStore } from 'pinia'
import { get } from '../utilty/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    storedUser: localStorage.getItem('user') || null,
    roles: [],
    menuItems: []
  }),

  getters: {
    user: state => {
      if (state.storedUser) {
        return JSON.parse(state.storedUser)
      }
      return state.storedUser
    },
    userIsAuth: state => !!state.token
  },

  actions: {
    async fetchUserRoles () {
      try {
        const roles = await get('/Auth/roles')
        this.roles = roles
      } catch (error) {
        console.error(error)
      }
    },
    async fetchMenuItems () {
      try {
        const menuItems = await get('/Pages')
        this.menuItems = menuItems
      } catch (error) {
        console.error(error)
      }
    },
    storeLoggedInUser (token, user) {
      const _this = this
      // Save the token to localStorage
      localStorage.setItem('token', token)

      // Save the user to localStorage
      const stringifiedUser = JSON.stringify(user)
      localStorage.setItem('user', stringifiedUser)

      // Save the token and user to the store state
      _this.token = token
      _this.storedUser = stringifiedUser
    }
  }
})
