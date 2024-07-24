import { defineStore } from 'pinia'

export const usePageStateStore = defineStore({
  id: 'pageState',
  state: () => ({
    leftSideBarOpen: true,
    rightSideBarOpen: false
  }),

  actions: {
    toggleLeft () {
      this.leftSideBarOpen = !this.leftSideBarOpen
    },
    toggleRight () {
      this.rightSideBarOpen = !this.rightSideBarOpen
    }
  }
})
