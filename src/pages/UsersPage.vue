<template>
  <div class="q-pa-md">
    <q-table
      title="Users"
      :rows="rows"
      :columns="columns"
      row-key="id"
      :visible-columns="visibleColumns"
      :filter="filter"
    >
      <template #top>
        <!-- <q-btn color="primary" :disable="loading" label="Add New Record" @click="addRow" /> -->
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
          borderless
          dense
          debounce="300"
          color="primary"
          v-model="filter"
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
                  {{ editedIndex > -1 ? 'Edit user!' : 'Add new user!' }}
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
                <div class="row">
                  <q-input
                    v-model="editedItem.surname"
                    label="Surname"
                    style="width: 100%;"
                  />
                </div>
                <div class="row">
                  <q-input
                    v-model="editedItem.email"
                    label="Email"
                    style="width: 100%;"
                  />
                </div>
                <div class="row">
                  <q-select
                    label="Roles"
                    v-model="model"
                    multiple
                    :options="options"
                    counter
                    hint="Roles"
                    style="width: 100%;"
                  />
                </div>
                <div class="row">
                  <q-input
                    v-model="editedItem.password"
                    type="password"
                    label="Password"
                    style="width: 100%;"
                  />
                </div>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn
                  flat
                  label="Cancel"
                  color="primary"
                  v-close-popup
                  @click="closeModal"
                />
                <q-btn
                  flat
                  label="OK"
                  color="primary"
                  v-close-popup
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
            key="surname"
            :props="props"
          >
            {{ props.row.surname }}
          </q-td>
          <q-td
            key="email"
            :props="props"
          >
            {{ props.row.email }}
          </q-td>
          <q-td
            key="roles"
            :props="props"
          >
            {{ props.row.roles }}
          </q-td>
          <q-td
            key="actions"
            :props="props"
          >
            <q-btn
              icon="mode_edit"
              color="blue"
              label="update"
              @click="editItem(props.row)"
              size="sm"
            />
            <q-btn
              icon="delete"
              color="red"
              label="delete"
              @click="deleteItem(props.row)"
              size="sm"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useUsersStore } from 'src/stores/users-store'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const usersStore = useUsersStore()
const filter = ref('')

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
})

const rows = computed(() => usersStore.users)

const columns = [
  { name: 'id', align: 'center', field: 'id', sortable: false },
  { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true },
  { name: 'surname', align: 'left', label: 'Surname', field: 'surname', sortable: true },
  { name: 'email', align: 'left', label: 'E-mail', field: 'email', sortable: true },
  { name: 'roles', align: 'left', label: 'Roles', field: 'roles', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions' }
]

const visibleColumns = ref(['name', 'surname', 'email', 'roles', 'actions'])

function onSaveClick () {
  console.log('add: ' + editedIndex.value)
  if (editedIndex.value > -1) {
    usersStore.updateUser(editedItem.value.id, editedItem.value)
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
    usersStore.insertUser(editedItem.value)
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
  // const index = usersStore.users.indexOf(item)
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
