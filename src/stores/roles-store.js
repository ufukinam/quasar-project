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
        this.roles = await get('/Roles')
      } catch (error) {
        console.error(error)
      }
    },
    async fetchPaginated ({ page, rowsPerPage, sortBy, descending, filter }) {
      try {
        const response = await get('/Roles/paginated', { Page: page, RowsPerPage: rowsPerPage, SortBy: sortBy, Descending: descending, strFilter: filter })
        this.roles = response.items
        this.totalItems = response.totalItems
        this.page = response.page
        this.pageSize = response.pageSize
        this.totalPages = response.potalPages
      } catch (error) {
        notify({ type: 'negative', message: error.message })
      }
    },
    async fetchVisible () {
      try {
        this.roles = await get('/Roles')
      } catch (error) {
        notify({ type: 'negative', message: error.message })
      }
    },
    async insert (roleData) {
      try {
        const insertedRole = await post('/Roles', roleData)
        this.roles = [insertedRole, ...this.users]
      } catch (error) {
        notify({ type: 'negative', message: error.message })
      }
    },
    async update (roleId, roleData) {
      try {
        const updatedRole = await put(`/Roles/${roleId}`, roleData)
        this.roles = this.roles.map(role =>
          role.id === roleId ? updatedRole : role
        )
      } catch (error) {
        notify({ type: 'negative', message: error.message })
      }
    },
    async delete (roleId) {
      try {
        await del(`/Roles/${roleId}`)
        this.roles = this.roles.filter(role => role.id !== roleId)
      } catch (error) {
        notify({ type: 'negative', message: error.message })
      }
    }
  }
})
