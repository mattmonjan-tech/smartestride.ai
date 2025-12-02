
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    define: {
      // Vital: This replaces process.env.API_KEY in your code with the actual string during build
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      'process.env': {} // Polyfill to prevent "process is not defined" crash
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  }
})
