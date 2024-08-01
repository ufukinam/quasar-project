import { defineStore } from 'pinia'
import { get, put, del } from '../utilty/api'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: []
  }),
  actions: {
    async fetchUsers () {
      try {
        this.users = await get('/Users')
      } catch (error) {
        console.error(error)
      }
    },
    async updateUser (userId, userData) {
      try {
        const updatedUser = await put(`/Users/${userId}`, userData)
        this.users = this.users.map(user =>
          user.id === userId ? updatedUser : user
        )
      } catch (error) {
        console.error(error)
      }
    },
    async deleteUser (userId) {
      try {
        await del(`/Users/${userId}`)
        this.users = this.users.filter(user => user.id !== userId)
      } catch (error) {
        console.error(error)
      }
    }
  }
})
