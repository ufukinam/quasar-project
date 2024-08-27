<template>
  <div>
    <q-table
      :title="title"
      :rows="rows"
      :columns="visibleColumnsList"
      :pagination="paginationModel"
      :filter="filterModel"
      :loading="loading"
      @request="onRequest"
      row-key="id"
      binary-state-sort
      @update:pagination="onPaginationUpdate"
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
        >
          <template #append>
            <q-icon
              name="clear"
              @click="filterModel = ''"
            />
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

      <template #bottom>
        <div class="row items-center justify-between full-width">
          <div class="col-auto">
            <q-select
              v-model="paginationModel.rowsPerPage"
              :options="[5, 10, 20, 50, 100]"
              label="Rows per page"
              style="min-width: 100px"
              dense
              options-dense
              emit-value
              map-options
              @update:model-value="onRowsPerPageChange"
            />
          </div>
          <div class="col-auto">
            <q-pagination
              v-model="paginationModel.page"
              :max="Math.ceil(paginationModel.rowsNumber / paginationModel.rowsPerPage)"
              :max-pages="6"
              boundary-links
              @update:model-value="onPageChange"
            />
          </div>
          <div class="col-auto text-caption q-mr-sm">
            Page {{ paginationModel.page }} of {{ Math.ceil(paginationModel.rowsNumber / paginationModel.rowsPerPage) }} |
            Total: {{ paginationModel.rowsNumber }}
          </div>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { computed, toRefs } from 'vue'

const propsNew = defineProps({
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
  pagination: {
    type: Object,
    default: () => ({
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
      sortBy: 'id',
      descending: false
    })
  },
  filter: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['request', 'action', 'update:pagination', 'update:filter'])

const { pagination: propsPagination, filter: propsFilter } = toRefs(propsNew)

const paginationModel = computed({
  get: () => ({ ...propsPagination.value }),
  set: (newVal) => emit('update:pagination', newVal)
})

const filterModel = computed({
  get: () => propsFilter.value,
  set: (newVal) => {
    paginationModel.value.page = 1
    emit('update:filter', newVal)
    emit('request', { pagination: paginationModel.value, filter: newVal }) // Ensure request is emitted on filter change
  }
})

const onRequest = (propsNew) => {
  console.log('onRequest called:', propsNew)
  const { pagination, filter } = propsNew

  // Update pagination model
  paginationModel.value = { ...pagination }
  // Update filter if it has changed
  if (filter !== undefined && filter !== filterModel.value) {
    emit('update:filter', filter)
  } else {
    paginationModel.value.descending = pagination.descending
    paginationModel.value.sortBy = pagination.sortBy
  }

  // Emit the request event with updated pagination and filter
  emit('request', { pagination: paginationModel.value, filter: filterModel.value })
  // emit('request', propsNew)
}

const onRowsPerPageChange = (val) => {
  paginationModel.value.rowsPerPage = val
  paginationModel.value.page = 1
  emit('request', { pagination: paginationModel.value, filter: filterModel.value })
}

const onPageChange = (val) => {
  paginationModel.value.page = val
  emit('request', { pagination: paginationModel.value, filter: filterModel.value })
}

const visibleColumnsList = computed(() =>
  propsNew.columns.filter(c => propsNew.visibleColumns.includes(c.name))
)

const onPaginationUpdate = (newPagination) => {
  console.log('onPaginationUpdate called:', newPagination)
  paginationModel.value = newPagination
  emit('request', { pagination: paginationModel.value, filter: filterModel.value })
}

</script>
