import { defineStore } from 'pinia'
import { get, post, put, del } from '../utilty/api'
import { notify } from '../utilty/notify'

export const useRolesStore = defineStore('roles', {
  state: () => ({
    roles: [],
    totalItems: 0,
    page: 0,
    pageSize: 0,
    totalPages: 0
  }),
  actions: {
    async fetch () {
      try {
        const response = await get('/Roles')
        if (response.success) {
          this.roles = response.data
        } else {
          notify({ type: 'negative', message: response.message })
        }
      } catch (error) {
        notify({ type: 'negative', message: error.message })
      }
    },
    async fetchPaginated ({ page, rowsPerPage, sortBy, descending, filter }) {
      try {
        const response = await get('/Roles/paginated', { Page: page, RowsPerPage: rowsPerPage, SortBy: sortBy, Descending: descending, strFilter: filter })
        if (response.success) {
          this.roles = response.data.items
          this.totalItems = response.data.totalItems
          this.page = response.data.page
          this.pageSize = response.data.pageSize
          this.totalPages = response.data.totalPages
        } else {
          notify({ type: 'negative', message: response.message })
        }
      } catch (error) {
        notify({ type: 'negative', message: error.message })
      }
    },
    async fetchVisible () {
      try {
        const response = await get('/Roles')
        if (response.success) {
          this.roles = response.data
        } else {
          notify({ type: 'negative', message: response.message })
        }
      } catch (error) {
        notify({ type: 'negative', message: error.message })
      }
    },
    async insert (roleData) {
      try {
        const response = await post('/Roles', roleData)
        if (response.success) {
          this.roles = [response.data, ...this.roles]
        } else {
          notify({ type: 'negative', message: response.message })
        }
      } catch (error) {
        notify({ type: 'negative', message: error.message })
      }
    },
    async update (roleId, roleData) {
      try {
        const response = await put(`/Roles/${roleId}`, roleData)
        if (response.success) {
          this.roles = this.roles.map(role =>
            role.id === roleId ? response.data : role
          )
        } else {
          notify({ type: 'negative', message: response.message })
        }
      } catch (error) {
        notify({ type: 'negative', message: error.message })
      }
    },
    async delete (roleId) {
      try {
        const response = await del(`/Roles/${roleId}`)
        if (response.success) {
          this.roles = this.roles.filter(role => role.id !== roleId)
        } else {
          notify({ type: 'negative', message: response.message })
        }
      } catch (error) {
        notify({ type: 'negative', message: error.message })
      }
    }
  }
})
