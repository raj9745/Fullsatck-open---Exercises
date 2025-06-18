import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

const persons =[{ name: 'Arto Hellas',number: '040-1234567' }]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App persons = {persons} />
  </StrictMode>,
)
