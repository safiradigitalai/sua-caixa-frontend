import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

// Hooks
import useAppStore, { usePWA, useNotifications } from './stores/useAppStore'

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

  return (
    <div className="App min-h-screen bg-brutal-black">
      {/* Main Layout */}
      <MobileLayout>
        {/* Animated Routes */}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Home - Vegas/Gaming Style Original */}
            <Route path="/" element={<HomePage />} />
            
            {/* Experimental styles (not in use) */}
            <Route path="/clean" element={<HomePageClean />} />
            <Route path="/gaming" element={<HomePageGaming />} />
            
            {/* Caixas - GAMING é nossa estética oficial */}
            <Route path="/caixas" element={<CaixasPageGaming />} />
            
            {/* Transparência */}
            <Route path="/transparencia" element={<TransparenciaPage />} />
            
            {/* Ganhadores */}
            <Route path="/ganhadores" element={<GanhadoresPage />} />
            
            {/* Login */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Usuário */}
            <Route path="/perfil" element={<PerfilPage />} />
            
            {/* 404 - Redirect to home for demo */}
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