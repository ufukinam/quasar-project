<template>
  <q-table
    :title="title"
    :rows="rows"
    :columns="columns"
    row-key="id"
    :visible-columns="visibleColumns"
    :filter="filter"
    v-model:pagination="pagination"
    :rows-per-page-options="[10,20,50,100]"
  >
    <template #top>
      <q-btn
        flat
        outline
        dense
        color="primary"
        :label="addButtonLabel"
        @click="$emit('add-item')"
      />
      <q-space />
      <q-input
        borderless
        dense
        debounce="300"
        color="primary"
        v-model="filterModel"
      >
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <template #header="props">
      <q-tr :props="props">
        <q-th
          v-for="col in visibleColumnsList"
          :key="col.name"
          :props="props"
          :class="col.align ? `text-${col.align}` : ''"
        >
          {{ col.label }}
        </q-th>
        <q-th
          v-if="showActions"
          key="actions"
          :props="props"
          class="text-right"
        >
          Actions
        </q-th>
      </q-tr>
    </template>
    <template #body="props">
      <q-tr :props="props">
        <q-td
          v-for="col in visibleColumnsList"
          :key="col.name"
          :props="props"
          :class="col.align ? `text-${col.align}` : ''"
        >
          {{ props.row[col.field] }}
        </q-td>
        <q-td
          v-if="showActions"
          key="actions"
          :props="props"
          class="text-right"
        >
          <q-btn
            icon="mode_edit"
            color="blue"
            label="update"
            @click="$emit('edit-item', props.row)"
            size="sm"
          />
          <q-btn
            icon="delete"
            color="red"
            label="delete"
            @click="$emit('delete-item', props.row)"
            size="sm"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup>
import { ref, computed } from 'vue'

const { columns, visibleColumns } = defineProps({
  title: {
    type: String,
    default: ''
  },
  rows: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array,
    default: () => []
  },
  visibleColumns: {
    type: Array,
    default: () => []
  },
  addButtonLabel: {
    type: String,
    default: 'Add New Record'
  },
  showActions: {
    type: Boolean,
    default: true
  }
})

const pagination = ref({
  rowsPerPage: 20,
  page: 1
})

const filterModel = ref('')
const filter = computed(() => filterModel.value)

const visibleColumnsList = computed(() =>
  columns.filter(c => visibleColumns.includes(c.name) && c.name !== 'actions')
)

defineEmits(['add-item', 'edit-item', 'delete-item'])
</script>
