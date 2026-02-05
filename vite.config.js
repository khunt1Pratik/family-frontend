import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,        // change this to any port you like
    strictPort: true,  // fail if port is taken
  },
})
