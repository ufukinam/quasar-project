<template>
  <q-footer elevated class="bg-grey-8 text-white">
    <q-toolbar>
      <q-toolbar-title>
        <div><q-btn dense flat round icon="menu" @click="toggleLeft" />Title</div>
      </q-toolbar-title>
    </q-toolbar>
  </q-footer>
</template>

<script setup>
import { usePageStateStore } from 'src/stores/page-state-store'
const { toggleLeft } = usePageStateStore()
</script>
