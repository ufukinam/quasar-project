<template>
  <q-layout view="hHh LpR lff">

    <Header />

    <LeftSideBar />

    <RightSideBar />

    <q-page-container>
      <router-view />
    </q-page-container>

    <Footer />
  </q-layout>
</template>

<script setup>
import Header from 'src/components/HeaderComponent.vue'
import Footer from 'src/components/FooterComponent.vue'
import LeftSideBar from 'src/components/LeftSideBar.vue'
import RightSideBar from 'src/components/RightSideBar.vue'

defineOptions({
  name: 'MainLayout'
})

</script>
