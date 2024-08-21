<template>
  <div class="q-pa-md">
    <DataTable
      title="Users"
      :rows="rows"
      :columns="columns"
      :visible-columns="visibleColumns"
      :show-actions="true"
      @add-item="addItem"
      @edit-item="editItem"
      @delete-item="deleteItem"
    />
    <div class="q-pa-sm q-gutter-sm">
      <DialogForm
        title="User"
        :show="shStat"
        :columns="columns"
        :edited-item="editedItem"
        :edited-index="editedIndex"
        @save-click="onSaveClick"
        @close-click="closeModal"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useUsersStore } from 'src/stores/users-store'
import { useRolesStore } from 'src/stores/roles-store'
import { useQuasar } from 'quasar'
import DialogForm from 'src/components/Elements/DialogForm.vue'
import DataTable from 'src/components/Elements/DataTable.vue'

const $q = useQuasar()
const usersStore = useUsersStore()
const rolesStore = useRolesStore()

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

onMounted(() => {
  usersStore.fetchUsers()
  rolesStore.fetchRoles()
})

const rows = computed(() => usersStore.users)
const shStat = computed(() => showDialog.value)

const columns = [
  { name: 'id', field: 'id', sortable: false },
  { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true, type: 'text', model: 'input' },
  { name: 'surname', align: 'left', label: 'Surname', field: 'surname', sortable: true, type: 'text', model: 'input' },
  { name: 'email', align: 'left', label: 'E-mail', field: 'email', sortable: true, type: 'text', model: 'input' },
  { name: 'password', align: 'left', label: 'Password', field: 'password', sortable: true, type: 'password', model: 'input' },
  { name: 'actions', align: 'right', label: 'Actions', field: 'actions' }
]

const visibleColumns = ref(['name', 'surname', 'email', 'roles', 'actions'])

function onSaveClick (item) {
  console.log('add: ' + item)
  if (editedIndex.value > -1) {
    usersStore.updateUser(item.id, item)
      .then(x => {
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
      .then(x => {
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
      .then(x => {
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

</script>
