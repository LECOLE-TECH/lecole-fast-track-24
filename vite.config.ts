import path from "path"
import { reactRouter } from "@react-router/dev/vite"
import autoprefixer from "autoprefixer"
import tailwindcss from "tailwindcss"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"
import mkcert from "vite-plugin-mkcert"
import crossOriginIsolation from "vite-plugin-cross-origin-isolation"

export default defineConfig({
  css: {
    devSourcemap: true,
    postcss: {
      plugins: [tailwindcss, autoprefixer]
    }
  },

  server: {
    https: {},
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      "Cross-Origin-Embedder-Policy": "require-corp"
    },
    proxy: {}
  },

  plugins: [reactRouter(), tsconfigPaths(), mkcert(), crossOriginIsolation()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./app")
    }
  },

  optimizeDeps: {
    exclude: ["@sqlite.org/sqlite-wasm"]
  }
})
