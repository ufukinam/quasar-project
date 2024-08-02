<template>
  <div class="q-pa-md">
    <q-table title="Roles" :rows="rows" :columns="columns" row-key="id" :visible-columns="visibleColumns"
      :filter="filter">
      <template v-slot:top>
        <q-btn color="primary" label="Add New Record" @click="addRow" />
        <q-space />
        <q-input borderless dense debounce="300" color="primary" v-model="filter">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRolesStore } from 'src/stores/roles-store'

const rolesStore = useRolesStore()
const filter = ref('')

onMounted(() => {
  rolesStore.fetchRoles()
})
const rows = computed(() => {
  // Filter menu items based on user roles
  return rolesStore.roles
})

const columns = [
  { name: 'id', align: 'center', field: 'id', sortable: false },
  { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true }
]
function addRow () {
}
const visibleColumns = ref(['name'])

/* const initialPagination = {
  sortBy: 'desc',
  descending: false,
  page: 2,
  rowsPerPage: 3
  // rowsNumber: xx if getting data from a server
} */

</script>
