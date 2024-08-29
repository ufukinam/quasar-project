import { defineStore } from 'pinia'
import { get, post, put, del } from '../utilty/api'
import { notify } from '../utilty/notify'

export const usePagesStore = defineStore('pages', {
  state: () => ({
    pages: [],
    totalItems: 0,
    page: 0,
    pageSize: 0,
    totalPages: 0
  }),
  actions: {
    async fetch () {
      try {
        const response = await get('/Pages')
        if (response.success) {
          this.roles = response.data
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
        const response = await get('/Pages/paginated', { Page: page, RowsPerPage: rowsPerPage, SortBy: sortBy, Descending: descending, strFilter: filter })
        if (response.success) {
          this.pages = response.data.items
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
    async insert (pageData) {
      try {
        const response = await post('/Pages', pageData)
        if (response.success) {
          this.pages = [response.data, ...this.pages]
        } else {
          notify({ type: 'negative', message: response.message })
        }
      } catch (error) {
        notify({ type: 'negative', message: error.message })
      }
    },
    async update (pageId, pageData) {
      try {
        const response = await put(`/Pages/${pageId}`, pageData)
        if (response.success) {
          this.pages = this.pages.map(page =>
            page.id === pageId ? response.data : page
          )
        } else {
          notify({ type: 'negative', message: response.message })
        }
      } catch (error) {
        notify({ type: 'negative', message: error.message })
      }
    },
    async delete (pageId) {
      try {
        const response = await del(`/Pages/${pageId}`)
        if (response.success) {
          this.pages = this.pages.filter(page => page.id !== pageId)
        } else {
          notify({ type: 'negative', message: response.message })
        }
      } catch (error) {
        notify({ type: 'negative', message: error.message })
      }
    }
  }
})
