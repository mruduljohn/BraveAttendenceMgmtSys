import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      // Expose environment variables in the code
      'process.env.REACT_APP_API_URL': JSON.stringify(env.REACT_APP_API_URL),
    },
    plugins: [react()],
    server: {
      host: '0.0.0.0', // Expose server on all network interfaces
      port: 5173,       // Ensure this port is consistent
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'), // Alias for src directory
      },
    },
  };
});