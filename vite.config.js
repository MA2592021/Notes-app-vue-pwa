// Plugins
import vue from "@vitejs/plugin-vue";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import ViteFonts from "unplugin-fonts/vite";
import { VitePWA } from "vite-plugin-pwa";

// Utilities
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      devOptions: {
        enabled: true,
      },
      injectRegister: "auto",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,font/woff2,woff}"],
      },
      manifest: {
        name: "test",
        short_name: "best",
        description: "hi bye",
        theme_color: "#ffffff",
        screenshots: [
          {
            src: "/imgs/screenshots/1.jpg",
            form_factor: "narrow",
            sizes: "1080x1920",
          },
          {
            src: "/imgs/screenshots/2.jpg",
            form_factor: "narrow",
            sizes: "1080x1920",
          },
          {
            src: "/imgs/screenshots/3.jpg",
            form_factor: "narrow",
            sizes: "1080x1920",
          },
          {
            src: "/imgs/screenshots/4.jpg",
            form_factor: "wide",
            sizes: "1080x1920",
          },
          {
            src: "/imgs/screenshots/5.jpg",
            form_factor: "narrow",
            sizes: "1080x1920",
          },
        ],
        icons: [
          {
            src: "/imgs/icons/icon-48x48.png",
            sizes: "48x48",
            type: "image/png",
          },
          {
            src: "/imgs/icons/icon-72x72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "/imgs/icons/icon-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "/imgs/icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "/imgs/icons/icon-144x144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "/imgs/icons/icon-152x152.png",
            sizes: "152x152",
            type: "image/png",
          },
          {
            src: "/imgs/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: ["any", "maskable"],
          },
          {
            src: "/imgs/icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "/imgs/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    vuetify({
      autoImport: true,
      styles: {
        configFile: "src/styles/settings.scss",
      },
    }),
    ViteFonts({
      google: {
        families: [
          {
            name: "Roboto",
            styles: "wght@100;300;400;500;700;900",
          },
        ],
      },
    }),
  ],
  define: { "process.env": {} },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  server: {
    port: 3000,
  },
});
