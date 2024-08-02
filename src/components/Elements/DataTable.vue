<template>
  <div class="q-pa-md">
    <q-table title="Users" :rows="rows" :columns="columns" row-key="rowKey" :visible-columns="visibleColumns"
      :filter="filter" :pagination="pagination">
      <template v-slot:top>
        <!-- <q-btn color="primary" :disable="loading" label="Add New Record" @click="addRow" /> -->
        <q-btn flat outline dense color="primary" label="Add New Record" @click="onAddItem"></q-btn>
        <q-space />
        <q-input borderless dense debounce="300" color="primary" v-model="filter">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <div class="q-pa-sm q-gutter-sm">
          <q-dialog v-model="showDialog">
            <q-card style="width: 100%; max-width: 400px;">
              <q-card-section>
                <div class="text-h6" v-if="editedIndex > -1">Edit user!</div>
                <div class="text-h6" v-else>Add new user!</div>
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <q-input v-model="editedItem.name" label="Name" style="width: 100%;" />
                </div>
                <div class="row">
                  <q-input v-model="editedItem.surname" label="Surname" style="width: 100%;" />
                </div>
                <div class="row">
                  <q-input v-model="editedItem.email" label="Email" style="width: 100%;" />
                </div>
                <div class="row">
                  <q-input v-model="editedItem.password" type="password" label="Password" style="width: 100%;" />
                </div>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="Cancel" color="primary" v-close-popup @click="closeModal" />
                <q-btn flat label="OK" color="primary" v-close-popup @click="onSave"></q-btn>
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in columns" :key="col.name" :props="props">
            <slot :name="col.name" :row="props.row">
              {{ props.row[col.field] }}
            </slot>
          </q-td>
          <q-td v-if="actions.length" key="actions" :props="props">
            <q-btn v-for="action in actions" :key="action.label" :icon="action.icon" :color="action.color"
              @click="() => action.handler(props.row)" size="sm" />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
<script setup>
import { ref } from 'vue'

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  rows: Array,
  columns: Array,
  rowKey: {
    type: String,
    default: 'id'
  },
  actions: {
    type: Array,
    default: () => []
  }
})

const editedIndex = ref(-1)
const showDialog = ref(false)
const emit = defineEmits(['add-item', 'update-item', 'remove-item'])

const filter = ref('')
const pagination = ref({})

function onAddItem () {
  editedIndex.value = -1
  showDialog.value = true
}

function onSave () {
  if (editedIndex.value > -1) {
    emit('update-item')
  } else {
    emit('add-item')
  }
  close()
}

function closeModal () {
  showDialog.value = false
}
</script>
