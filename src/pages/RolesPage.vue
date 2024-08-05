<template>
  <div class="q-pa-md">
    <q-table
      title="Roles"
      :rows="rows"
      :columns="columns"
      row-key="id"
      :visible-columns="visibleColumns"
      :filter="filter"
    >
      <template #top>
        <q-btn
          flat
          outline
          dense
          color="primary"
          label="Add New Record"
          @click="addItem"
        />
        <q-space />
        <q-input
          v-model="filter"
          borderless
          dense
          debounce="300"
          color="primary"
        >
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
        <div class="q-pa-sm q-gutter-sm">
          <q-dialog v-model="showDialog">
            <q-card style="width: 100%; max-width: 400px;">
              <q-card-section>
                <div class="text-h6">
                  {{ editedIndex > -1 ? 'Edit role!' : 'Add new role!' }}
                </div>
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <q-input
                    v-model="editedItem.name"
                    label="Name"
                    style="width: 100%;"
                  />
                </div>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn
                  v-close-popup
                  flat
                  label="Cancel"
                  color="primary"
                  @click="closeModal"
                />
                <q-btn
                  v-close-popup
                  flat
                  label="OK"
                  color="primary"
                  @click="onSaveClick"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
      </template>
      <template #body="props">
        <q-tr :props="props">
          <q-td
            key="name"
            :props="props"
          >
            {{ props.row.name }}
          </q-td>
          <q-td
            key="actions"
            :props="props"
          >
            <q-btn
              icon="mode_edit"
              color="blue"
              label="update"
              size="sm"
              @click="editItem(props.row)"
            />
            <q-btn
              icon="delete"
              color="red"
              label="delete"
              size="sm"
              @click="deleteItem(props.row)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRolesStore } from 'src/stores/roles-store'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const rolesStore = useRolesStore()
const filter = ref('')

onMounted(() => {
  rolesStore.fetchRoles()
})
const rows = computed(() => {
  return rolesStore.roles
})

const showDialog = ref(false)
const editedIndex = ref(-1)
const editedItem = ref({
  id: '',
  name: ''
})
const defaultItem = {
  name: ''
}

const columns = [
  { name: 'id', align: 'center', field: 'id', sortable: false },
  { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true },
  { name: 'actions', align: 'right', label: 'Actions', field: 'actions', sortable: true }
]

const visibleColumns = ref(['name', 'actions'])

function onSaveClick () {
  console.log('add: ' + editedIndex.value)
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
          icon: 'cloud_done',
          message: err
        })
      })
  } else {
    rolesStore.insertRole(editedItem.value)
      .then(x => {
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
  editedIndex.value = rolesStore.roles.indexOf(item)
  editedItem.value = Object.assign({}, item)
  showDialog.value = true
}
function deleteItem (item) {
  confirm('Are you sure you want to delete this item?') &&
    (rolesStore.deleteRole(item.id)
      .then(x => {
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
