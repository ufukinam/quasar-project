<template>
  <q-header reveal elevated class="bg-primary text-white">
    <q-toolbar>
      <q-btn dense flat round icon="menu" @click="toggleLeft" />

      <q-toolbar-title>
        <q-avatar>
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
        </q-avatar>
        Title
      </q-toolbar-title>

      <q-btn dense flat round icon="menu" @click="toggleRight" />
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { usePageStateStore } from 'src/stores/page-state-store'
const { toggleLeft, toggleRight } = usePageStateStore()

</script>
