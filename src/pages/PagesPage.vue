<template>
  <div class="q-pa-md">
    <q-table
      title="Pages"
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
                  {{ editedIndex > -1 ? 'Edit page!' : 'Add new page!' }}
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
                    v-model.number="editedItem.order"
                    type="number"
                    label="Order"
                    style="width: 100%;"
                  />
                </div>
                <div class="row">
                  <q-input
                    v-model="editedItem.url"
                    label="Url"
                    style="width: 100%;"
                  />
                </div>
                <div class="row">
                  <q-input
                    v-model="editedItem.icon"
                    label="Icon"
                    style="width: 100%;"
                  />
                </div>
                <div class="row">
                  <q-input
                    v-model="editedItem.label"
                    label="Label"
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
            key="order"
            :props="props"
          >
            {{ props.row.order }}
          </q-td>
          <q-td
            key="url"
            :props="props"
          >
            {{ props.row.url }}
          </q-td>
          <q-td
            key="icon"
            :props="props"
          >
            {{ props.row.icon }}
          </q-td>
          <q-td
            key="label"
            :props="props"
          >
            {{ props.row.label }}
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
import { usePagesStore } from 'src/stores/pages-store'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const pagesStore = usePagesStore()
const filter = ref('')

const showDialog = ref(false)
const editedIndex = ref(-1)
const editedItem = ref({
  id: '',
  name: '',
  order: 0,
  url: '',
  Icon: '',
  label: ''
})
const defaultItem = {
  name: '',
  order: 0,
  url: '',
  Icon: '',
  label: ''
}

onMounted(() => {
  pagesStore.fetchPages()
})

const rows = computed(() => pagesStore.pages)

const columns = [
  { name: 'id', align: 'center', field: 'id', sortable: false },
  { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true },
  { name: 'order', align: 'left', label: 'Order', field: 'order', sortable: true },
  { name: 'url', align: 'left', label: 'Url', field: 'url', sortable: true },
  { name: 'icon', align: 'left', label: 'Icon', field: 'icon', sortable: true },
  { name: 'label', align: 'left', label: 'Label', field: 'label', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions' }
]

const visibleColumns = ref(['name', 'order', 'url', 'icon', 'label', 'actions'])

function onSaveClick () {
  if (editedIndex.value > -1) {
    pagesStore.updatePage(editedItem.value.id, editedItem.value)
      .then(x => {
        pagesStore.fetchPages()
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Page updated successfully'
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
    pagesStore.insertPage(editedItem.value)
      .then(x => {
        pagesStore.fetchPages()
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Page created successfully'
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
  editedIndex.value = pagesStore.pages.indexOf(item)
  editedItem.value = Object.assign({}, item)
  showDialog.value = true
}
function deleteItem (item) {
  confirm('Are you sure you want to delete this item?') &&
    (pagesStore.deletePage(item.id)
      .then(x => {
        pagesStore.fetchPages()
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Page deleted successfully'
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
