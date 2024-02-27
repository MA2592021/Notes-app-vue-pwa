<template>
  <router-view />
  <v-dialog v-model="dialog" width="auto">
    <v-card prepend-icon="mdi-download" fullscreen title="Install The App">
      <template v-slot:actions>
        <v-btn class="ms-auto" text="Ok" @click="dialog = false"></v-btn>
      </template>
      <v-card-text class="mt-3">
        <v-row>
          <v-col cols="12">
            <div class="d-flex align-center">
              <v-icon size="x-large">mdi mdi-export-variant</v-icon>
              <h4 class="ml-3">Press on the Options button</h4>
            </div>
          </v-col>
          <v-col cols="12">
            <div class="d-flex align-center">
              <v-icon size="x-large">mdi mdi-plus-box</v-icon>
              <h4 class="ml-3">Press on Add to Home Screen</h4>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";
const dialog = ref(false);
const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
};
// Detects if device is in standalone mode
const isInStandaloneMode = () =>
  "standalone" in window.navigator && window.navigator.standalone;

// Checks if should display install popup notification:
if (isIos() && !isInStandaloneMode()) {
  dialog.value = true;
}
</script>
