import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'

import { HelmetProvider } from 'react-helmet-async'
import { GoogleOAuthProvider } from '@react-oauth/google'

const queryClient = new QueryClient()
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </HelmetProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
