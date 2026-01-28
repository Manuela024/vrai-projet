
// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
// import './index.css'

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )

// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

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