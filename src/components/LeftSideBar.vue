<template>
  <q-drawer show-if-above v-model="leftSideBarOpen" side="left" bordered>
    <q-scroll-area class="fit">
      <q-list>
        <template v-for="(menuItem, index) in menuList" :key="index">
          <q-item clickable :active="menuItem.label === 'Outbox'" v-ripple>
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
import { storeToRefs } from 'pinia'
import { usePageStateStore } from 'src/stores/page-state-store'
import { usePagesStore } from 'src/stores/pages-store'
const { leftSideBarOpen } = storeToRefs(usePageStateStore())
const { fetchPages, menuPages } = usePagesStore()

if (menuPages == null) fetchPages()

console.log(menuPages)
const menuList = menuPages

</script>
