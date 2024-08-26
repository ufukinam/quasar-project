<template>
  <div class="q-pa-md">
    <DataTable
      title="Users"
      :rows="rows"
      :columns="columns"
      :visible-columns="visibleColumns"
      :actions="tableActions"
      @action="handleAction"
      @update:pagination="fetchData"
      @update:filter="fetchData"
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

// refs start
const showDialog = ref(false)
const editedIndex = ref(-1)
const editedItem = ref({
  id: '',
  name: '',
  surname: '',
  email: '',
  password: '',
  roles: ''
})
const defaultItem = {
  name: '',
  surname: '',
  email: '',
  password: '',
  roles: ''
}

const serverPagination = ref({
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 0
})

const showRolesDialog = ref(false)

const currentFilter = ref('')
const loading = ref(false)

// refs end

onMounted(() => {
  usersStore.fetchUsersPaginated(serverPagination.value.page, serverPagination.value.rowsPerPage)
  rolesStore.fetchRoles()
})

const rows = computed(() => usersStore.users)

const fetchData = async (pagination = serverPagination.value, filter = currentFilter.value) => {
  loading.value = true
  try {
    await usersStore.fetchUsersPaginated({
      page: pagination.page,
      rowsPerPage: pagination.rowsPerPage,
      sortBy: pagination.sortBy,
      descending: pagination.descending,
      filter
    })
    serverPagination.value = {
      ...pagination,
      rowsNumber: usersStore.totalUsers
    }
    currentFilter.value = filter
  } catch (error) {
    console.error('Error fetching users:', error)
    $q.notify({
      color: 'negative',
      message: 'Failed to fetch users',
      icon: 'error'
    })
  } finally {
    loading.value = false
  }
}

const columns = [
  { name: 'id', field: 'id', sortable: false },
  { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true, type: 'text', model: 'input' },
  { name: 'surname', align: 'left', label: 'Surname', field: 'surname', sortable: true, type: 'text', model: 'input' },
  { name: 'email', align: 'left', label: 'E-mail', field: 'email', sortable: true, type: 'text', model: 'input' },
  { name: 'password', align: 'left', label: 'Password', field: 'password', sortable: true, type: 'password', model: 'input' },
  { name: 'roles', align: 'left', label: 'Roles', field: 'roles', sortable: true, type: 'text' },
  { name: 'actions', align: 'right', label: 'Actions', field: 'actions' }
]

const visibleColumns = ref(['name', 'surname', 'email', 'roles', 'actions'])

const tableActions = [
  { type: 'manage-roles', icon: 'people', label: 'Manage Roles' },
  { type: 'add', icon: 'add', label: 'Add User' },
  { type: 'edit', icon: 'edit', label: 'Edit User' },
  { type: 'delete', icon: 'delete', label: 'Delete User' }
]

function handleAction ({ type, item }) {
  switch (type) {
    case 'add':
      addItem()
      break
    case 'edit':
      editItem(item)
      break
    case 'delete':
      deleteItem(item)
      break
    case 'manage-roles':
      manageRoles(item)
      break
  }
}

function onSaveClick (item) {
  if (editedIndex.value > -1) {
    usersStore.updateUser(item.id, item)
      .then(() => {
        usersStore.fetchUsers()
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'User updated successfully'
        })
      })
      .catch((err) => {
        $q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: err
        })
      })
  } else {
    usersStore.insertUser(item)
      .then(() => {
        usersStore.fetchUsers()
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'User created successfully'
        })
      })
      .catch((err) => {
        $q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: err.message
        })
      })
  }
  closeModal()
}

function addItem () {
  editedItem.value = Object.assign({}, defaultItem)
  editedIndex.value = -1
  showDialog.value = true
}

function editItem (item) {
  editedIndex.value = usersStore.users.indexOf(item)
  editedItem.value = Object.assign({}, item)
  showDialog.value = true
}
function deleteItem (item) {
  confirm('Are you sure you want to delete this item?') &&
    (usersStore.deleteUser(item.id)
      .then(() => {
        usersStore.fetchUsers()
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'User deleted successfully'
        })
      })
      .catch((err) => {
        $q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: err.message
        })
      }))
}
function closeModal () {
  showDialog.value = false
  setTimeout(() => {
    editedItem.value = Object.assign({}, defaultItem)
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
      usersStore.fetchUsers()
      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'User roles updated successfully'
      })
    })
    .catch((err) => {
      $q.notify({
        color: 'red-4',
        textColor: 'white',
        icon: 'warning',
        message: err.message
      })
    })
  showRolesDialog.value = false
}

</script>
