import { defineStore } from 'pinia'
import { get, post, put, del } from '../utilty/api'

export const usePagesStore = defineStore('pages', {
  state: () => ({
    pages: []
  }),
  actions: {
    async fetchPages () {
      try {
        this.pages = await get('/Pages')
      } catch (error) {
        console.error(error)
      }
    },
    async insertPage (pageData) {
      try {
        const insertedPage = await post('/Pages', pageData)
        this.pages = [insertedPage, ...this.pages]
      } catch (error) {
        console.error(error)
      }
    },
    async updatePage (pageId, pageData) {
      try {
        const updatedPage = await put(`/Pages/${pageId}`, pageData)
        this.pages = this.pages.map(page =>
          page.id === pageId ? updatedPage : page
        )
      } catch (error) {
        console.error(error)
      }
    },
    async deletePage (pageId) {
      try {
        await del(`/Pages/${pageId}`)
        this.pages = this.pages.filter(page => page.id !== pageId)
      } catch (error) {
        console.error(error)
      }
    }
  }
})
