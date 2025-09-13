import React, { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

// Hooks
import useAppStore, { usePWA, useNotifications, useUser } from './stores/useAppStore'

// Layouts
import MobileLayout from './components/layout/MobileLayout'

// Pages
import HomePage from './pages/HomePage'
import HomePageClean from './pages/HomePageClean'
import HomePageGaming from './pages/HomePageGaming'
import CaixasPage from './pages/CaixasPage'
import CaixasPageRoyale from './pages/CaixasPageRoyale'
import CaixasPageVegas from './pages/CaixasPageVegas'
import CaixasPageGaming from './pages/CaixasPageGaming'
import TransparenciaPage from './pages/TransparenciaPage'
import GanhadoresPage from './pages/GanhadoresPage'
import PerfilPage from './pages/PerfilPage'
import LoginPage from './pages/LoginPage'


// Components
import PWAInstallBanner from './components/ui/PWAInstallBanner'
import OfflineIndicator from './components/ui/OfflineIndicator'
import NotificationContainer from './components/ui/NotificationContainer'

function App() {
  const location = useLocation()
  const { setOnline, setInstallPrompt } = usePWA()
  const { showInfo, showSuccess } = useNotifications()
  const { initializeUser, isAuthenticated, user } = useUser()
  const [authChecked, setAuthChecked] = useState(false)

  // ==============================================
  // REAL AUTHENTICATION SYSTEM
  // ==============================================
  
  useEffect(() => {
    // Verificar sessão existente do Supabase
    const initializeAuth = async () => {
      const { default: useAppStore } = await import('./stores/useAppStore')
      const { supabase } = await import('./lib/supabase')
      
      try {
        console.log('🔍 Verificando sessão existente...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Erro ao verificar sessão:', error)
          return
        }

        if (session?.user) {
          console.log('✅ Usuário autenticado encontrado:', session.user.id)
          // Inicializar dados do usuário autenticado
          await useAppStore.getState().initializeUser(session.user.id)
        } else {
          console.log('ℹ️ Nenhuma sessão ativa - usuário não autenticado')
        }
        
        setAuthChecked(true)
      } catch (error) {
        console.error('❌ Erro na inicialização de autenticação:', error)
      }
    }

    initializeAuth()
    
    // Escutar mudanças na autenticação
    const setupAuthListener = async () => {
      const { default: useAppStore } = await import('./stores/useAppStore')
      const { supabase } = await import('./lib/supabase')
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('🔄 Mudança de autenticação:', event, session?.user?.id || 'sem usuário')
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Usuário logou - inicializar dados
          await useAppStore.getState().initializeUser(session.user.id)
        } else if (event === 'SIGNED_OUT') {
          // Usuário deslogou - limpar estado
          useAppStore.getState().logout()
        }
      })
      
      return subscription
    }
    
    let authSubscription = null
    setupAuthListener().then(sub => {
      authSubscription = sub
    })

    return () => {
      authSubscription?.unsubscribe()
    }
  }, [])

  // ==============================================
  // PWA SETUP
  // ==============================================
  
  useEffect(() => {
    // Network status listeners
    const handleOnline = () => {
      setOnline(true)
      showSuccess('Conexão restaurada!')
    }
    
    const handleOffline = () => {
      setOnline(false)
      showInfo('Você está offline. Algumas funcionalidades podem estar limitadas.')
    }
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    // PWA install prompt listener
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setInstallPrompt(true)
      console.log('💾 PWA pode ser instalado')
    }
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    
    // PWA installed listener
    const handleAppInstalled = () => {
      setInstallPrompt(false)
      showSuccess('Sua Caixa instalado com sucesso! 🎉')
      console.log('✅ PWA instalado')
    }
    
    window.addEventListener('appinstalled', handleAppInstalled)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [setOnline, setInstallPrompt, showInfo, showSuccess])

  // ==============================================
  // SCROLL RESTORATION
  // ==============================================
  
  useEffect(() => {
    // Scroll to top on route change (mobile behavior)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  // ==============================================
  // PERFORMANCE MONITORING
  // ==============================================
  
  useEffect(() => {
    // Report performance metrics
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Measure and report performance
        const navigation = performance.getEntriesByType('navigation')[0]
        if (navigation) {
          const loadTime = navigation.loadEventEnd - navigation.fetchStart
          console.log(`📊 Page load time: ${Math.round(loadTime)}ms`)
        }
      })
    }
  }, [location.pathname])

  // Mostrar loading durante verificação de autenticação
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-brutal-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-purple border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg font-semibold">Carregando...</p>
        </div>
      </div>
    )
  }

  // Páginas que requerem autenticação
  const protectedRoutes = ['/perfil']
  const requiresAuth = protectedRoutes.includes(location.pathname)
  
  // Se não estiver autenticado e tentar acessar página protegida, redirecionar
  if (!isAuthenticated && requiresAuth) {
    return <LoginPage />
  }

  return (
    <div className="App min-h-screen bg-brutal-black">
      {/* Main Layout */}
      <MobileLayout>
        {/* Animated Routes */}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Rotas públicas - acessíveis sem login */}
            <Route path="/" element={<HomePage />} />
            <Route path="/clean" element={<HomePageClean />} />
            <Route path="/gaming" element={<HomePageGaming />} />
            <Route path="/caixas" element={<CaixasPageGaming />} />
            <Route path="/transparencia" element={<TransparenciaPage />} />
            <Route path="/ganhadores" element={<GanhadoresPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Rotas protegidas - só acessíveis se autenticado */}
            <Route path="/perfil" element={isAuthenticated ? <PerfilPage /> : <LoginPage />} />
            
            {/* Fallback */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </AnimatePresence>
      </MobileLayout>
      
      {/* PWA Components */}
      <PWAInstallBanner />
      <OfflineIndicator />
      <NotificationContainer />
    </div>
  )
}

export default App