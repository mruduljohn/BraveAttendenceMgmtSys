import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Expose server on all network interfaces
    port: 5173,       // Make sure this port matches what you are using
  },
  resolve:{
    alias:{
      "@": path.resolve(__dirname, "./src"),
    }
  }
})
