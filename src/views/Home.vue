<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <main class="main">
    <v-row>
      <v-col cols="12">
        <v-card
          max-width="350"
          variant="elevated"
          color="#222"
          v-for="note in notes"
          :key="note.id"
          class="mx-auto ma-2"
        >
          <v-card-title>{{ note.title }}</v-card-title>
          <v-card-subtitle>{{ note.subtitle }}</v-card-subtitle>
          <v-card-text>
            {{ note.body }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <div class="pa-4 text-center">
      <v-dialog v-model="dialog" max-width="600">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            class="text-white font-weight-regular"
            icon="mdi-plus"
            variant="tonal"
            v-bind="activatorProps"
          ></v-btn>
        </template>

        <v-card prepend-icon="mdi-plus" title="New Note" color="#333">
          <v-card-text>
            <v-row dense>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="note.title"
                  label="First name*"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="note.subtitle"
                  label="Middle name"
                  hint="example of helper text only on focus"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-textarea v-model="note.body" label="Label"></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text="Close" variant="plain" @click="dialog = false"></v-btn>

            <v-btn
              color="primary"
              text="Save"
              variant="tonal"
              @click="add()"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </main>
</template>
<style>
.main {
  background-color: #333;
  min-height: calc(100vh - 64px);
}
</style>
<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  enableIndexedDbPersistence,
} from "firebase/firestore";

import "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBf-fNofte2UKpqjzChJx_JvdoGg55tBK8",
  authDomain: "test-pwa-vuetify.firebaseapp.com",
  projectId: "test-pwa-vuetify",
  storageBucket: "test-pwa-vuetify.appspot.com",
  messagingSenderId: "612505955804",
  appId: "1:612505955804:web:0555beaaa2a9babe03b319",
  measurementId: "G-S37S2WKPBK",
};

const note = ref({
  body: "",
  title: "",
  subtitle: "",
});
const notes = ref([]);
onMounted(async () => {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  enableIndexedDbPersistence(db);
  const notesCollection = collection(db, "notes");

  // Initial fetch of data

  // Listen for real-time changes
  const unsubscribe = onSnapshot(notesCollection, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        // Handle added document
        notes.value.push({ id: change.doc.id, ...change.doc.data() });
        console.log(notes.value);
      }
      if (change.type === "modified") {
        // Handle modified document
        const modifiedNote = change.doc.data();
        const index = notes.value.findIndex(
          (note) => note.id === change.doc.id
        );
        if (index !== -1) {
          notes.value[index] = { id: change.doc.id, ...modifiedNote };
        }
      }
      if (change.type === "removed") {
        // Handle removed document
        const index = notes.value.findIndex(
          (note) => note.id === change.doc.id
        );
        if (index !== -1) {
          notes.value.splice(index, 1);
        }
      }
    });
  });

  // Remember to unsubscribe when the component is unmounted
  onUnmounted(unsubscribe);
});

const dialog = ref(false);
const add = async () => {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  try {
    // Add a new document to the "notes" collection
    await addDoc(collection(db, "notes"), note.value);
    note.value = { title: "", subtitle: "", body: "" };
    dialog.value = false;
  } catch (error) {
    console.error("Error adding note:", error);
    dialog.value = false;
  }
};
</script>
