<!-- eslint-disable vue/multi-word-component-names -->

<template>
  <v-app style="background-color: #333">
    <default-bar />

    <default-view />
  </v-app>
</template>

<script setup>
import DefaultBar from "./AppBar.vue";
import DefaultView from "./View.vue";
</script>
