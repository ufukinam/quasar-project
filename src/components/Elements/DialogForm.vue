<template>
  <q-dialog v-model="showStatus">
    <q-card style="width: 100%; max-width: 400px;">
      <q-card-section>
        <div class="text-h6">
          {{ props.editedIndex > -1 ? props.updateTitle : props.addNewTitle }}
        </div>
      </q-card-section>
      <q-card-section>
        <div
          v-for="(col) in columns.filter(x=>x.name!='id' && x.name!='actions')"
          class="row"
          :key="col.name"
        >
          <q-input
            v-if="col.model=='input'"
            v-model="item[col.name]"
            :label="col.label"
            style="width: 100%;"
            :type="col.type"
          />
          <q-select
            v-else-if="col.model=='select'"
            v-model="item[col.name]"
            multiple
            :options="col.data"
            :label="col.label"
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
          @click="emit('close-click')"
        />
        <q-btn
          flat
          label="OK"
          color="primary"
          v-close-popup
          @click="emit('save-click', item)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, onMounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  show: {
    type: Boolean,
    default: false
  },
  editedItem: {
    type: Object,
    default: () => ({})
  },
  editedIndex: {
    type: Number,
    default: -1
  },
  columns: {
    type: Array,
    default: () => []
  },
  addNewTitle: {
    type: String,
    default: 'Add new record'
  },
  updateTitle: {
    type: String,
    default: 'Edit record'
  }
})

onMounted(() => {
  console.log('dialog component mounted')
})

const emit = defineEmits(['save-click', 'close-click'])

const item = computed(() => props.editedItem)
const showStatus = computed(() => props.show)
</script>
