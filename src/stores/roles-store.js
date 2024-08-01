import { defineStore } from 'pinia'
import { get, post, put, del } from '../utilty/api'

export const useRolesStore = defineStore('roles', {
  state: () => ({
    roles: []
  }),
  actions: {
    async fetchRoles () {
      try {
        this.roles = await get('/Roles')
      } catch (error) {
        console.error(error)
      }
    },
    async insertRole (roleData) {
      try {
        const insertedRole = await post('/Roles', roleData)
        this.roles = this.roles.push(insertedRole)
      } catch (error) {
        console.error(error)
      }
    },
    async updateRole (roleId, roleData) {
      try {
        const updatedRole = await put(`/Roles/${roleId}`, roleData)
        this.roles = this.roles.map(role =>
          role.id === roleId ? updatedRole : role
        )
      } catch (error) {
        console.error(error)
      }
    },
    async deleteRole (roleId) {
      try {
        await del(`/Roles/${roleId}`)
        this.roles = this.roles.filter(role => role.id !== roleId)
      } catch (error) {
        console.error(error)
      }
    }
  }
})
