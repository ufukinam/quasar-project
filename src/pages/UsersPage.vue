<template>
  <div class="q-pa-md">
    <DataTable
      title="Users"
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
        title="User"
        :show="showDialog"
        :columns="columns.filter(col => col.name !== 'roles')"
        :edited-item="editedItem"
        :edited-index="editedIndex"
        add-new-title="Add New User"
        update-title="Update User"
        @save-click="onSaveClick"
        @close-click="closeModal"
      />
    </div>
    <q-dialog v-model="showRolesDialog">
      <RolesManagementDialog
        :user="editedItem"
        @save="onSaveRoles"
        @cancel="showRolesDialog = false"
      />
    </q-dialog>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useUsersStore } from 'src/stores/users-store'
import { useRolesStore } from 'src/stores/roles-store'
import { useQuasar } from 'quasar'
import DialogForm from 'src/components/Elements/DialogForm.vue'
import DataTable from 'src/components/Elements/DataTable.vue'
import RolesManagementDialog from 'src/components/Elements/RolesManagementDialog.vue'

const $q = useQuasar()
const usersStore = useUsersStore()
const rolesStore = useRolesStore()

// Use a factory function for defaultItem
const createDefaultItem = () => ({
  id: '',
  name: '',
  surname: '',
  email: '',
  password: '',
  roles: []
})

// Use ref for editedItem and showDialog
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

const showRolesDialog = ref(false)
const filter = ref('')
const loading = ref(false)

// refs end

onMounted(() => {
  fetchData({ pagination: serverPagination.value, filter: filter.value })
  rolesStore.fetchRoles()
})

const rows = computed(() => usersStore.users || [])

const fetchData = async (props) => {
  const { pagination, filter } = props || {}
  loading.value = true
  try {
    await usersStore.fetchUsersPaginated({
      page: pagination?.page || serverPagination.value.page,
      rowsPerPage: pagination?.rowsPerPage || serverPagination.value.rowsPerPage,
      sortBy: pagination?.sortBy || serverPagination.value.sortBy,
      descending: pagination?.descending || serverPagination.value.descending,
      filter: filter || '' // Ensure filter is used
    })
    serverPagination.value = {
      ...serverPagination.value,
      page: usersStore.page,
      rowsPerPage: usersStore.pageSize,
      rowsNumber: usersStore.totalItems,
      sortBy: pagination?.sortBy || serverPagination.value.sortBy,
      descending: pagination?.descending || serverPagination.value.descending
    }
  } catch (error) {
    notify('negative', 'Failed to fetch users')
  } finally {
    loading.value = false
  }
}

const columns = [
  { name: 'id', field: 'id', sortable: true },
  { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true, type: 'text', model: 'input' },
  { name: 'surname', align: 'left', label: 'Surname', field: 'surname', sortable: true, type: 'text', model: 'input' },
  { name: 'email', align: 'left', label: 'E-mail', field: 'email', sortable: true, type: 'text', model: 'input' },
  { name: 'password', align: 'left', label: 'Password', field: 'password', sortable: false, type: 'password', model: 'input' },
  { name: 'roles', align: 'left', label: 'Roles', field: 'roles', sortable: false, type: 'text' },
  { name: 'actions', align: 'right', label: 'Actions', field: 'actions', sortable: false }
]

const visibleColumns = ref(['name', 'surname', 'email', 'roles', 'actions'])

const tableActions = [
  { type: 'manage-roles', icon: 'people', label: 'Manage Roles' },
  { type: 'add', icon: 'add', label: 'Add User' },
  { type: 'edit', icon: 'edit', label: 'Edit User' },
  { type: 'delete', icon: 'delete', label: 'Delete User' }
]

const actionHandlers = {
  add: addItem,
  edit: editItem,
  delete: deleteItem,
  'manage-roles': manageRoles
}

function handleAction ({ type, item }) {
  const handler = actionHandlers[type]
  if (handler) handler(item)
}

function onSaveClick () {
  const isNewUser = editedIndex.value === -1
  const successMessage = `User ${isNewUser ? 'created' : 'updated'} successfully`

  const userToSave = { ...editedItem.value }

  if (isNewUser) {
    delete userToSave.id
  }

  // Remove empty fields to avoid overwriting with empty values
  Object.keys(userToSave).forEach(key => {
    if (userToSave[key] === '' || userToSave[key] === null) {
      delete userToSave[key]
    }
  })

  const savePromise = isNewUser
    ? usersStore.insertUser(userToSave)
    : usersStore.updateUser(userToSave.id, userToSave)

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
  editedIndex.value = usersStore.users.indexOf(item)
  editedItem.value = { ...item }
  showDialog.value = true
}

function deleteItem (item) {
  confirm('Are you sure you want to delete this item?') &&
    (usersStore.deleteUser(item.id)
      .then(() => {
        fetchData({ pagination: serverPagination.value, filter: filter.value })
        notify('positive', 'User deleted successfully')
      })
      .catch((err) => {
        notify('negative', err.message)
      }))
}

function closeModal () {
  showDialog.value = false
  setTimeout(() => {
    editedItem.value = createDefaultItem()
    editedIndex.value = -1
  }, 300)
}

function manageRoles (item) {
  editedItem.value = Object.assign({}, item)
  showRolesDialog.value = true
}

function onSaveRoles (updatedRoles) {
  usersStore.updateUserRoles(editedItem.value.id, updatedRoles)
    .then(() => {
      fetchData({ pagination: serverPagination.value, filter: filter.value })
      notify('positive', 'User roles updated successfully')
    })
    .catch((err) => {
      notify('negative', err.message)
    })
  showRolesDialog.value = false
}

const notify = (type, message) => {
  $q.notify({
    type,
    message
  })
}

</script>
