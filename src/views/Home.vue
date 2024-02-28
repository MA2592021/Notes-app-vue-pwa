<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <main class="main">
    <v-row>
      <v-col
        cols="12"
        md="6"
        lg="4"
        xl="3"
        v-for="note in notes"
        :key="note.id"
      >
        <v-card max-width="350" variant="elevated" color="#222" class="mx-auto">
          <v-card-title>{{ note.title }}</v-card-title>
          <v-card-subtitle>{{ note.subtitle }}</v-card-subtitle>
          <v-card-text>
            <p class="truncate-text">{{ note.body }}</p>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn
              text="Close"
              variant="plain"
              icon="mdi mdi-eye"
              class="mx-auto"
              @click="viewNote(note)"
            ></v-btn>
            <!-- <v-btn
              text="Close"
              variant="plain"
              icon="mdi mdi-pencil"
              class="mx-auto"
            ></v-btn> -->
            <v-btn
              text="Close"
              variant="plain"
              icon="mdi mdi-delete-circle"
              class="mx-auto"
              @click="openDelete(note)"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <div class="pa-4 text-center">
      <v-dialog id="addDialog" v-model="addDialog" max-width="600">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            class="text-white font-weight-regular"
            icon="mdi-plus"
            variant="tonal"
            v-bind="activatorProps"
          ></v-btn>
        </template>

        <v-card prepend-icon="mdi-plus" title="New Note" color="#333">
          <v-form @submit.prevent="add" ref="formRef">
            <v-card-text>
              <v-row dense>
                <v-col cols="12">
                  <v-text-field
                    v-model="note.title"
                    label="title*"
                    required
                    :rules="[(v) => !!v || 'Title is required']"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="note.subtitle"
                    label="subtitle"
                    hint="example of helper text only on focus"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    :rules="[
                      (v) =>
                        (v && v.length >= 20) ||
                        'Body must be at least 20 characters',
                    ]"
                    v-model="note.body"
                    label="body"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-card-text>
          </v-form>
          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              text="Close"
              variant="plain"
              @click="addDialog = false"
            ></v-btn>

            <v-btn
              color="primary"
              text="Save"
              variant="tonal"
              type="submit"
              @click="add()"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog id="deleteDialog" v-model="deleteDialog" width="auto">
        <v-card
          prepend-icon="mdi-delete-circle"
          fullscreen
          title="Are you Sure Want to Delete Note?"
        >
          <template v-slot:actions>
            <v-btn
              class="ms-auto"
              text="Yes"
              color="error"
              @click="removeNote(noteToDelete.id)"
            ></v-btn>
          </template>
          <v-card-text class="mt-3">
            <v-row>
              <v-col cols="12">
                <div class="d-flex align-center">
                  <h4 class="ml-3">
                    Are you Sure Want To Delete {{ noteToDelete.title }} ??
                  </h4>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog id="viewDialog" v-model="viewDialog" fullscreen>
        <v-card class="mx-auto" color="#333">
          <v-card-title class="d-flex"
            ><h2>{{ noteToView.title }}</h2>
            <v-icon @click="viewDialog = false" class="ml-auto"
              >mdi mdi-close</v-icon
            >
          </v-card-title>
          <v-card-subtitle>{{ noteToView.subtitle }}</v-card-subtitle>
          <v-card-text>
            <p style="word-break: break-all">
              {{ noteToView.body }}
            </p>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <!-- <v-btn
              text="Close"
              variant="plain"
              icon="mdi mdi-pencil"
              class="mx-auto"
            ></v-btn> -->
            <v-btn
              text="Close"
              variant="plain"
              icon="mdi mdi-delete-circle"
              class="mx-auto"
              @click="openDelete(noteToView)"
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
.truncate-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%; /* Set the maximum width based on your layout */
}
</style>
<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  onSnapshot,
  enableIndexedDbPersistence,
  deleteDoc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBf-fNofte2UKpqjzChJx_JvdoGg55tBK8",
  authDomain: "test-pwa-vuetify.firebaseapp.com",
  projectId: "test-pwa-vuetify",
  storageBucket: "test-pwa-vuetify.appspot.com",
  messagingSenderId: "612505955804",
  appId: "1:612505955804:web:0555beaaa2a9babe03b319",
  measurementId: "G-S37S2WKPBK",
};

// Reactive variables
const note = ref({
  body: "",
  title: "",
  subtitle: "",
});

const formRef = ref(null); // Ref for v-form

const notes = ref([]);

const addDialog = ref(false);
const deleteDialog = ref(false);
const viewDialog = ref(false);
const noteToDelete = ref({});
const noteToView = ref({});
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const notesCollection = collection(db, "notes");
// Fetch and listen for real-time changes
onMounted(async () => {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  enableIndexedDbPersistence(db);

  // Initial fetch of data

  // Listen for real-time changes
  const unsubscribe = onSnapshot(notesCollection, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        // Handle added document
        notes.value.push({ id: change.doc.id, ...change.doc.data() });
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

// Function to add a new note
const add = async () => {
  formRef.value.validate().then(async (res) => {
    if (res.valid) {
      try {
        // Add a new document to the "notes" collection
        await addDoc(notesCollection, note.value);
        note.value = { title: "", subtitle: "", body: "" };
        addDialog.value = false;
      } catch (error) {
        console.error("Error adding note:", error);
        addDialog.value = false;
      }
    }
  });
};
const openDelete = (note) => {
  deleteDialog.value = true;
  noteToDelete.value = note;
};
const removeNote = async (id) => {
  deleteDialog.value = false;
  try {
    // Find the note by ID
    const noteDocRef = doc(notesCollection, id);

    // Delete the note
    await deleteDoc(noteDocRef);

    console.log(`Note with ID ${id} removed successfully from the database.`);
  } catch (error) {
    console.error("Error removing note:", error);
  }
};
const viewNote = (note) => {
  noteToView.value = note;
  viewDialog.value = true;
};
</script>
