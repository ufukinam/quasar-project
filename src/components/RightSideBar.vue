<template>
  <q-drawer
    v-model="rightSideBarOpen"
    side="right"
    overlay
    bordered
  >
    <!-- drawer content -->
  </q-drawer>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { usePageStateStore } from 'src/stores/page-state-store'
const { rightSideBarOpen } = storeToRefs(usePageStateStore())

</script>
