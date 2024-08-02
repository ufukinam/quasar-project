<template>
  <q-drawer show-if-above v-model="leftSideBarOpen" side="left" bordered>
    <q-scroll-area class="fit">
      <q-list>
        <template v-for="(menuItem, index) in filteredMenuItems" :key="index">
          <q-item clickable :to="menuItem.url" :active="menuItem.label === 'Outbox'" v-ripple>
            <q-item-section avatar>
              <q-icon :name="menuItem.icon" />
            </q-item-section>
            <q-item-section>
              {{ menuItem.label }}
            </q-item-section>
          </q-item>
          <!-- <q-separator :key="'sep' + index" v-if="menuItem.separator" /> -->
        </template>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { usePageStateStore } from 'src/stores/page-state-store'
import { useUserStore } from 'src/stores/user-store'
const { leftSideBarOpen } = storeToRefs(usePageStateStore())

const userStore = useUserStore()

const filteredMenuItems = computed(() => {
  // Filter menu items based on user roles
  return userStore.menuItems
})

onMounted(() => {
  userStore.fetchUserRoles()
  userStore.fetchMenuItems()
})
</script>
