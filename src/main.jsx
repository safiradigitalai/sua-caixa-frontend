import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

import App from './App.jsx'
import './index.css'

// Configuração React Query otimizada para mobile
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      retry: (failureCount, error) => {
        // Retry apenas para erros de rede
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false // Não retry para erros 4xx
        }
        return failureCount < 2 // Max 2 retries para outros erros
      },
      refetchOnWindowFocus: false, // Evitar refetch constante no mobile
      refetchOnReconnect: true, // Refetch quando voltar online
      networkMode: 'offlineFirst' // PWA friendly
    },
    mutations: {
      retry: 1,
      networkMode: 'offlineFirst'
    }
  }
})

// Toast configurado para mobile
const toastOptions = {
  duration: 3000,
  position: 'bottom-center',
  style: {
    background: '#1a1a1a',
    color: '#ffffff',
    border: '1px solid #374151',
    borderRadius: '12px',
    fontSize: '16px', // Tamanho legível no mobile
    padding: '12px 16px',
    maxWidth: '90vw',
    marginBottom: 'env(safe-area-inset-bottom, 20px)' // Safe area para iPhones
  },
  success: {
    iconTheme: {
      primary: '#22C55E',
      secondary: '#ffffff'
    }
  },
  error: {
    iconTheme: {
      primary: '#EF4444',
      secondary: '#ffffff'
    }
  },
  loading: {
    iconTheme: {
      primary: '#F59E0B',
      secondary: '#ffffff'
    }
  }
}

// Performance monitoring (comentado para debug)
// if (import.meta.env.DEV) {
//   import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
//     getCLS(console.log)
//     getFID(console.log)
//     getFCP(console.log)
//     getLCP(console.log)
//     getTTFB(console.log)
//   }).catch(() => {
//     console.log('Web vitals não disponível')
//   })
// }

// App initialization
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster 
          toastOptions={toastOptions}
          containerStyle={{
            bottom: 'env(safe-area-inset-bottom, 20px)'
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)