<template>
  <div class="q-pa-md">
    <DataTable
      title="Roles"
      :rows="rows"
      :columns="columns"
      :visible-columns="visibleColumns"
      :actions="tableActions"
      @action="handleAction"
    />
    <div class="q-pa-sm q-gutter-sm">
      <DialogForm
        title="Role"
        :show="showDialog"
        :columns="columns"
        :edited-item="editedItem"
        :edited-index="editedIndex"
        add-new-title="Add New Role"
        update-title="Update Role"
        @save-click="onSaveClick"
        @close-click="closeModal"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRolesStore } from 'src/stores/roles-store'
import { useQuasar } from 'quasar'
import DialogForm from 'src/components/Elements/DialogForm.vue'
import DataTable from 'src/components/Elements/DataTable.vue'

const $q = useQuasar()
const rolesStore = useRolesStore()

const showDialog = ref(false)
const editedIndex = ref(-1)
const editedItem = ref({
  id: '',
  name: ''
})
const defaultItem = {
  name: ''
}

onMounted(() => {
  rolesStore.fetchRoles()
})

const rows = computed(() => rolesStore.roles)

const columns = [
  { name: 'id', align: 'center', field: 'id', sortable: false },
  { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true, type: 'text', model: 'input' },
  { name: 'actions', align: 'right', label: 'Actions', field: 'actions' }
]
const tableActions = [
  { type: 'add', icon: 'add', label: 'Add Role' },
  { type: 'edit', icon: 'edit', label: 'Edit Role' },
  { type: 'delete', icon: 'delete', label: 'Delete Role' }
]

const visibleColumns = ref(['name', 'actions'])

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
  }
}

function onSaveClick (item) {
  if (editedIndex.value > -1) {
    rolesStore.updateRole(editedItem.value.id, editedItem.value)
      .then(x => {
        rolesStore.fetchRoles()
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Role updated successfully'
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
  } else {
    rolesStore.insertRole(item)
      .then(() => {
        rolesStore.fetchRoles()
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Role created successfully'
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
  }
  closeModal()
}
function addItem () {
  editedItem.value = Object.assign({}, defaultItem)
  editedIndex.value = -1
  showDialog.value = true
}

function editItem (item) {
  editedIndex.value = rolesStore.roles.indexOf(item)
  editedItem.value = Object.assign({}, item)
  showDialog.value = true
}

function deleteItem (item) {
  confirm('Are you sure you want to delete this role?') &&
    rolesStore.deleteRole(item.id)
      .then(() => {
        rolesStore.fetchRoles()
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Role deleted successfully'
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
}
function closeModal () {
  showDialog.value = false
  setTimeout(() => {
    editedItem.value = Object.assign({}, defaultItem)
    editedIndex.value = -1
  }, 300)
}
</script>
