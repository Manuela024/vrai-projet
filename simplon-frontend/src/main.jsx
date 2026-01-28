
// // src/main.jsx
// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App'
// import './index.css'


// console.log('🚀 Starting Simplon Frontend...')

// try {
//   const rootElement = document.getElementById('root')
  
//   if (!rootElement) {
//     throw new Error('Root element not found')
//   }

//   ReactDOM.createRoot(rootElement).render(
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>
//   )
  
//   console.log('✅ App rendered successfully')
// } catch (error) {
//   console.error('❌ Fatal error:', error)
//   document.body.innerHTML = `
//     <div style="padding: 20px; font-family: sans-serif;">
//       <h1 style="color: red;">Application Error</h1>
//       <p><strong>Error:</strong> ${error.message}</p>
//       <p>Please check the console for details.</p>
//       <button onclick="location.reload()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px;">
//         Reload Page
//       </button>
//     </div>
//   `
// }



// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Fonction pour appliquer le thème avant le rendu
const applyInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'auto'
  const root = document.documentElement
  
  console.log('🎨 Applying initial theme:', savedTheme)
  
  if (savedTheme === 'dark') {
    root.classList.add('dark')
  } else if (savedTheme === 'light') {
    root.classList.remove('dark')
  } else {
    // Mode auto
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }
}

// Appliquer le thème immédiatement
applyInitialTheme()

console.log('🚀 Starting Simplon Frontend...')

try {
  const rootElement = document.getElementById('root')
  
  if (!rootElement) {
    throw new Error('Root element not found')
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
  
  console.log('✅ App rendered successfully')
} catch (error) {
  console.error('❌ Fatal error:', error)
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif;">
      <h1 style="color: red;">Application Error</h1>
      <p><strong>Error:</strong> ${error.message}</p>
      <p>Please check the console for details.</p>
      <button onclick="location.reload()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px;">
        Reload Page
      </button>
    </div>
  `
}