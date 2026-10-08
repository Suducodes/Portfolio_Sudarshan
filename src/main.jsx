import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// self-hosted variable fonts — no third-party font CDN on the critical path
import '@fontsource-variable/unbounded'
import '@fontsource-variable/martian-mono'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
