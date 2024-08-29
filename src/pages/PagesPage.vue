<template>
  <div class="q-pa-md">
    <DataTable
      title="Pages"
      :rows="rows"
      :columns="columns"
      :visible-columns="visibleColumns"
      :actions="tableActions"
      v-model:pagination="serverPagination"
      v-model:filter="filter"
      :loading="loading"
      @request="fetchData"
      @action="handleAction"
    />
    <div class="q-pa-sm q-gutter-sm">
      <DialogForm
        title="Page"
        :show="showDialog"
        :columns="columns"
        :edited-item="editedItem"
        :edited-index="editedIndex"
        add-new-title="Add New Page"
        update-title="Update Page"
        @save-click="onSaveClick"
        @close-click="closeModal"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { usePagesStore } from 'src/stores/pages-store'
import DialogForm from 'src/components/Elements/DialogForm.vue'
import DataTable from 'src/components/Elements/DataTable.vue'
import { useQuasar } from 'quasar'
import { createNotify } from 'src/utilty/notify'

const $q = useQuasar()
const notify = createNotify($q)
const pagesStore = usePagesStore()

// Use a factory function for defaultItem
const createDefaultItem = () => ({
  id: '',
  name: '',
  order: 0,
  url: '',
  icon: '',
  label: ''
})

const showDialog = ref(false)
const editedIndex = ref(-1)
const editedItem = ref(createDefaultItem())

const serverPagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
  sortBy: 'id',
  descending: false
})

const filter = ref('')
const loading = ref(false)

onMounted(() => {
  fetchData({ pagination: serverPagination.value, filter: filter.value })
})

const rows = computed(() => pagesStore.pages || [])

const fetchData = async (props) => {
  const { pagination, filter } = props || {}
  loading.value = true
  try {
    await pagesStore.fetchPaginated({
      page: pagination?.page || serverPagination.value.page,
      rowsPerPage: pagination?.rowsPerPage || serverPagination.value.rowsPerPage,
      sortBy: pagination?.sortBy || serverPagination.value.sortBy,
      descending: pagination?.descending || serverPagination.value.descending,
      filter: filter || '' // Ensure filter is used
    })
    serverPagination.value = {
      ...serverPagination.value,
      page: pagesStore.page,
      rowsPerPage: pagesStore.pageSize,
      rowsNumber: pagesStore.totalItems,
      sortBy: pagination?.sortBy || serverPagination.value.sortBy,
      descending: pagination?.descending || serverPagination.value.descending
    }
  } catch (error) {
    notify('negative', 'Failed to fetch roles')
  } finally {
    loading.value = false
  }
}

const columns = [
  { name: 'id', align: 'center', field: 'id', sortable: false },
  { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true, type: 'text', model: 'input' },
  { name: 'order', align: 'left', label: 'Order', field: 'order', sortable: true, type: 'number', model: 'input' },
  { name: 'url', align: 'left', label: 'Url', field: 'url', sortable: true, type: 'text', model: 'input' },
  { name: 'icon', align: 'left', label: 'Icon', field: 'icon', sortable: true, type: 'text', model: 'input' },
  { name: 'label', align: 'left', label: 'Label', field: 'label', sortable: true, type: 'text', model: 'input' },
  { name: 'actions', align: 'right', label: 'Actions', field: 'actions' }
]

const visibleColumns = ref(['name', 'order', 'url', 'icon', 'label', 'actions'])

const tableActions = [
  { type: 'add', icon: 'add', label: 'Add Page' },
  { type: 'edit', icon: 'edit', label: 'Edit Page' },
  { type: 'delete', icon: 'delete', label: 'Delete Page' }
]

const actionHandlers = {
  add: addItem,
  edit: editItem,
  delete: deleteItem
}

function handleAction ({ type, item }) {
  const handler = actionHandlers[type]
  if (handler) handler(item)
}

function onSaveClick (item) {
  const isNewItem = editedIndex.value === -1
  const successMessage = `Role ${isNewItem ? 'created' : 'updated'} successfully`

  const itemToSave = { ...editedItem.value }

  if (isNewItem) {
    delete itemToSave.id
  }

  // Remove empty fields to avoid overwriting with empty values
  Object.keys(itemToSave).forEach(key => {
    if (itemToSave[key] === '' || itemToSave[key] === null) {
      delete itemToSave[key]
    }
  })

  const savePromise = isNewItem
    ? pagesStore.insert(itemToSave)
    : pagesStore.update(itemToSave.id, itemToSave)

  savePromise
    .then(() => {
      fetchData({ pagination: serverPagination.value, filter: filter.value })
      notify('positive', successMessage)
      closeModal()
    })
    .catch((err) => {
      notify('negative', err.message)
    })
}
function addItem () {
  editedItem.value = createDefaultItem()
  editedIndex.value = -1
  showDialog.value = true
}

function editItem (item) {
  editedIndex.value = pagesStore.roles.indexOf(item)
  editedItem.value = { ...item }
  showDialog.value = true
}

function deleteItem (item) {
  confirm('Are you sure you want to delete this role?') &&
    pagesStore.delete(item.id)
      .then(() => {
        fetchData({ pagination: serverPagination.value, filter: filter.value })
        notify('positive', 'Role deleted successfully')
      })
      .catch((err) => {
        notify('negative', err.message)
      })
}
function closeModal () {
  showDialog.value = false
  setTimeout(() => {
    editedItem.value = createDefaultItem()
    editedIndex.value = -1
  }, 300)
}

</script>
