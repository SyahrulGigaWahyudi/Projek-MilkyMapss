import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'

// Custom Design System
import './styles/custom.css'

// App
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
