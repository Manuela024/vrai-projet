
// // import { defineConfig } from 'vite'
// // import react from '@vitejs/plugin-react'

// // export default defineConfig({
// //   plugins: [react()],
// //   server: {
// //     port: 3000,
// //   },
// // })

// // import { defineConfig } from 'vite'
// // import react from '@vitejs/plugin-react'

// // export default defineConfig({
// //   plugins: [react()],
// //   server: {
// //     port: 5173, // Port de développement Vite
// //     host: true, // Permet l'accès depuis d'autres appareils
// //     open: true, // Ouvre le navigateur automatiquement
// //     proxy: {
// //       '/api': {
// //         target: 'http://localhost:8000', // Backend Django
// //         changeOrigin: true,
// //         secure: false,
// //       }
// //     }
// //   },
// //   build: {
// //     outDir: 'dist',
// //     sourcemap: true,
// //   },
// //   resolve: {
// //     alias: {
// //       '@': '/src', // Alias pour les imports
// //     }
// //   }
// // })


// // vite.config.js
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss(),
//   ],
// })

// // vite.config.js - Version simplifiée
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5173,
//     proxy: {
//       '/api': {
//         target: 'http://localhost:8000',
//         changeOrigin: true,
//         secure: false,
//       }
//     }
//   }
// })


// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})