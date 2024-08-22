<template>
  <q-card style="min-width: 350px">
    <q-card-section>
      <div class="text-h6">
        Manage Roles for {{ user.name }}
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-list>
        <q-item
          v-for="role in roles"
          :key="role.id"
        >
          <q-item-section>
            <q-checkbox
              v-model="selectedRoles"
              :val="role.id"
              :label="role.name"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn
        flat
        label="Cancel"
        color="primary"
        v-close-popup
        @click="$emit('cancel')"
      />
      <q-btn
        flat
        label="Save"
        color="primary"
        @click="saveRoles"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRolesStore } from 'src/stores/roles-store'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['save', 'cancel'])

const rolesStore = useRolesStore()
const roles = ref([])
const selectedRoles = ref([])

onMounted(async () => {
  await rolesStore.fetchRoles()
  roles.value = rolesStore.roles
  selectedRoles.value = props.user.roles.map(role => role.id)
})

function saveRoles () {
  emit('save', selectedRoles.value)
}
</script>
