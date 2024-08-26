<template>
  <div>
    <q-table
      :title="title"
      :rows="rows"
      :columns="visibleColumnsList"
      :pagination="pagination"
      :filter="filter"
      :loading="loading"
      @request="onRequest"
    >
      <template #top-left>
        <q-btn
          v-if="actions.some(action => action.type === 'add')"
          color="primary"
          :icon="actions.find(action => action.type === 'add').icon"
          :label="actions.find(action => action.type === 'add').label"
          @click="$emit('action', { type: 'add' })"
        />
      </template>
      <template #top-right>
        <q-input
          v-if="showSearch"
          dense
          debounce="300"
          v-model="filterModel"
          placeholder="Search"
          @update:model-value="onFilterChange"
        >
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template #body-cell-actions="props">
        <q-td
          :props="props"
          class="q-gutter-sm"
        >
          <q-btn
            v-for="action in actions.filter(a => a.type !== 'add')"
            :key="action.type"
            :icon="action.icon"
            :color="action.color || 'primary'"
            dense
            round
            flat
            @click="$emit('action', { type: action.type, item: props.row })"
          >
            <q-tooltip>{{ action.label }}</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const { columns, visibleColumns, showSearch, actions, serverPagination } = defineProps({
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
  showSearch: {
    type: Boolean,
    default: true
  },
  actions: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  serverPagination: {
    type: Object,
    default: () => ({
      page: 1,
      rowsPerPage: 20,
      rowsNumber: 0
    })
  }
})

const emit = defineEmits(['action', 'update:pagination', 'update:filter'])

const pagination = ref({ ...serverPagination })
const filterModel = ref('')
const filter = computed(() => filterModel.value)

const onRequest = (props) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  const filter = props.filter
  emit('update:pagination', { page, rowsPerPage, sortBy, descending })
  emit('update:filter', filter)
}

const onFilterChange = () => {
  pagination.value.page = 1
  onRequest({ pagination: pagination.value, filter: filterModel.value })
}

watch(() => serverPagination, (newVal) => {
  pagination.value = { ...newVal }
}, { deep: true })

const visibleColumnsList = computed(() =>
  columns.filter(c => visibleColumns.includes(c.name))
)
</script>
