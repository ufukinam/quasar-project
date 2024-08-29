import { defineStore } from 'pinia'
import { get, put, del, post } from '../utilty/api'
import { notify } from '../utilty/notify'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    totalItems: 0,
    page: 0,
    pageSize: 0,
    totalPages: 0
  }),
  actions: {
    async fetch () {
      try {
        const response = await get('/Users')
        if (response.success) {
          this.users = response.data
          return response.data
        } else {
          notify({ type: 'negative', message: response.message })
        }
      } catch (error) {
        notify({ type: 'negative', message: error.message })
      }
    },
    async fetchPaginated ({ page, rowsPerPage, sortBy, descending, filter }) {
      try {
        const response = await get('/Users/paginated', { Page: page, RowsPerPage: rowsPerPage, SortBy: sortBy, Descending: descending, strFilter: filter })
        if (response.success) {
          this.users = response.data.items
          this.totalItems = response.data.totalItems
          this.page = response.data.page
          this.pageSize = response.data.pageSize
          this.totalPages = response.data.totalPages
          return response.data.items
        } else {
          notify({ type: 'negative', message: response.message })
        }
      } catch (error) {
        notify({ type: 'negative', message: error.message })
      }
    },
    async insert (userData) {
      try {
        const response = await post('/Users', userData)
        if (response.success) {
          this.users = [response.data, ...this.users]
        } else {
          notify({ type: 'negative', message: response.message })
          return response.data
        }
      } catch (error) {
        notify({ type: 'negative', message: error.message })
      }
    },
    async update (userId, userData) {
      try {
        if (userData.password === undefined) { userData.password = '' }
        const response = await put(`/Users/${userId}`, userData)
        if (response.success) {
          this.users = this.users.map(user =>
            user.id === userId ? response.data : user
          )
        } else {
          notify({ type: 'negative', message: response.Message })
        }
      } catch (error) {
        notify({ type: 'negative', message: error.message })
      }
    },
    async delete (userId) {
      try {
        const response = await del(`/Users/${userId}`)
        if (response.success) {
          this.users.filter(user => user.id !== userId)
        } else {
          notify({ type: 'negative', message: response.message })
        }
      } catch (error) {
        notify({ type: 'negative', message: error.message })
      }
    }
  }
})
