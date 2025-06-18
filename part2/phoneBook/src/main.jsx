import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

const persons =[{ name: 'Arto Hellas' }]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App persons = {persons} />
  </StrictMode>,
)
