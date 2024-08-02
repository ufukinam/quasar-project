<template>
  <div class="q-pa-md">
    <q-table title="Pages" :rows="rows" :columns="columns" row-key="id" :visible-columns="visibleColumns"
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
import { usePagesStore } from 'src/stores/pages-store'

const pagesStore = usePagesStore()
const filter = ref('')

onMounted(() => {
  pagesStore.fetchPages()
})
const rows = computed(() => {
  // Filter menu items based on user roles
  return pagesStore.pages
})

const columns = [
  { name: 'id', align: 'center', field: 'id', sortable: false },
  { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true },
  { name: 'url', align: 'left', label: 'URL', field: 'url', sortable: true },
  { name: 'icon', align: 'left', label: 'Menu Icon', field: 'icon', sortable: true },
  { name: 'label', align: 'left', label: 'Menu Label', field: 'label', sortable: true },
  { name: 'order', align: 'left', label: 'Order', field: 'order', sortable: true }
]

function addRow () {
}
const visibleColumns = ref(['name', 'url', 'icon', 'label', 'order'])

/* const initialPagination = {
  sortBy: 'desc',
  descending: false,
  page: 2,
  rowsPerPage: 3
  // rowsNumber: xx if getting data from a server
} */

</script>
