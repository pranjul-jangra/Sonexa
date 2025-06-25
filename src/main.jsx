import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { UserProvider } from './context/UserContext.jsx'
import { MusicProvider } from './context/MusicContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MusicProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </MusicProvider>
  </StrictMode>,
)
