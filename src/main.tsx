import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Note: Using system fonts only to avoid network blocking issues
// Chinese fonts: 'Source Han Serif CN' (Adobe open source) or system fallbacks

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
