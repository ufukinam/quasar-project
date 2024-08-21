<template>
  <div class="q-pa-md">
    <DataTable
      title="Page"
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
        title="Page"
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
import { usePagesStore } from 'src/stores/pages-store'
import { useQuasar } from 'quasar'
import DialogForm from 'src/components/Elements/DialogForm.vue'
import DataTable from 'src/components/Elements/DataTable.vue'

const $q = useQuasar()
const pagesStore = usePagesStore()

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
const shStat = computed(() => showDialog.value)

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
