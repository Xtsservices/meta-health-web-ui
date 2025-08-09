// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import path from 'path';

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'), // Alias for 'src'
//     },
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Alias for 'src'
    },
  },
  server: {
    host: '0.0.0.0', // Allow access from external devices
    port: 5174,      // Port to run the dev server
  },
});
