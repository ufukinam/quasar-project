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
        this.pages = await get('/Pages')
      } catch (error) {
        notify({ type: 'negative', message: error.message })
      }
    },
    async fetchPaginated ({ page, rowsPerPage, sortBy, descending, filter }) {
      try {
        const response = await get('/Pages/paginated', { Page: page, RowsPerPage: rowsPerPage, SortBy: sortBy, Descending: descending, strFilter: filter })
        this.pages = response.items
        this.totalItems = response.totalItems
        this.page = response.page
        this.pageSize = response.pageSize
        this.totalPages = response.potalPages
      } catch (error) {
        notify({ type: 'negative', message: error.message })
      }
    },
    async insert (pageData) {
      try {
        const insertedPage = await post('/Pages', pageData)
        this.pages = [insertedPage, ...this.pages]
      } catch (error) {
        notify({ type: 'negative', message: error.message })
      }
    },
    async update (pageId, pageData) {
      try {
        const updatedPage = await put(`/Pages/${pageId}`, pageData)
        this.pages = this.pages.map(page =>
          page.id === pageId ? updatedPage : page
        )
      } catch (error) {
        notify({ type: 'negative', message: error.message })
      }
    },
    async delete (pageId) {
      try {
        await del(`/Pages/${pageId}`)
        this.pages = this.pages.filter(page => page.id !== pageId)
      } catch (error) {
        notify({ type: 'negative', message: error.message })
      }
    }
  }
})
