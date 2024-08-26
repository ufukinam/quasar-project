import { defineStore } from 'pinia'
import { get, put, del, post } from '../utilty/api'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    totalItems: 0,
    page: 0,
    pageSize: 0,
    totalPages: 0
  }),
  actions: {
    async fetchUsers () {
      try {
        this.users = await get('/Users')
      } catch (error) {
        console.error(error)
      }
    },
    async fetchUsersPaginated ({ page, rowsPerPage, sortBy, descending, filter }) {
      try {
        const response = await get('/Users/paginated', { Page: page, RowsPerPage: rowsPerPage, SortBy: sortBy, Descending: descending, strFilter: filter })
        this.users = response.items
        this.totalItems = response.totalItems
        this.page = response.page
        this.pageSize = response.pageSize
        this.totalPages = response.potalPages
      } catch (error) {
        console.error(error)
      }
    },
    async insertUser (userData) {
      try {
        const insertedUser = await post('/Users', userData)
        this.users = [insertedUser, ...this.users]
      } catch (error) {
        console.error(error)
      }
    },
    async updateUser (userId, userData) {
      try {
        if (userData.password === undefined) { userData.password = '' }
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
        this.users.filter(user => user.id !== userId)
      } catch (error) {
        console.error(error)
      }
    }
  }
})
