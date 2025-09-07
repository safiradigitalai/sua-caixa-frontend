import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Smartphone } from 'lucide-react'

// Hooks
import { usePWA } from '../../stores/useAppStore'
import { isPWA, isIOS, triggerHaptic, storage } from '../../lib/utils'

const PWAInstallBanner = () => {
  const { showInstallPrompt, setInstallPrompt } = usePWA()
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showBanner, setShowBanner] = useState(false)
  const [showIOSInstructions, setShowIOSInstructions] = useState(false)

  useEffect(() => {
    // Não mostrar se já está instalado
    if (isPWA()) return

    // Não mostrar se usuário já dispensou recentemente
    const dismissed = storage.get('pwa-install-dismissed')
    const dismissedDate = dismissed ? new Date(dismissed) : null
    const daysSinceDismissed = dismissedDate 
      ? (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24)
      : Infinity

    if (daysSinceDismissed < 7) return // Não mostrar por 7 dias

    // Mostrar banner se prompt estiver disponível
    if (showInstallPrompt) {
      setShowBanner(true)
    }

    // Listener para capturar o prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowBanner(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [showInstallPrompt])

  const handleInstall = async () => {
    triggerHaptic('medium')

    if (isIOS()) {
      // Mostrar instruções para iOS
      setShowIOSInstructions(true)
      return
    }

    if (deferredPrompt) {
      try {
        // Mostrar prompt nativo
        deferredPrompt.prompt()
        
        const { outcome } = await deferredPrompt.userChoice
        
        if (outcome === 'accepted') {
          console.log('✅ PWA instalado pelo usuário')
          setShowBanner(false)
          setInstallPrompt(false)
        }
        
        setDeferredPrompt(null)
      } catch (error) {
        console.error('Erro ao instalar PWA:', error)
      }
    }
  }

  const handleDismiss = () => {
    triggerHaptic('light')
    setShowBanner(false)
    setInstallPrompt(false)
    
    // Salvar data de dismissão
    storage.set('pwa-install-dismissed', new Date().toISOString())
  }

  const handleIOSInstructionsClose = () => {
    setShowIOSInstructions(false)
    handleDismiss()
  }

  if (!showBanner) return null

  return (
    <>
      {/* Install Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            className="fixed bottom-20 left-4 right-4 z-50 safe-area-bottom"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="bg-dark-50 border border-gold-primary/30 rounded-2xl p-4 shadow-gold backdrop-blur-md">
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div className="w-12 h-12 bg-gradient-gold rounded-xl flex items-center justify-center shrink-0">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white mb-1">
                    Instalar Sua Caixa
                  </h3>
                  <p className="text-sm text-gray-300 leading-tight">
                    Acesso rápido, notificações e funciona offline!
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleInstall}
                    className="btn-primary px-4 py-2 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Instalar</span>
                  </button>
                  
                  <button
                    onClick={handleDismiss}
                    className="btn-ghost p-2"
                    aria-label="Fechar"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS Instructions Modal */}
      <AnimatePresence>
        {showIOSInstructions && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-dark-100 border border-gray-700 rounded-2xl p-6 max-w-sm w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-gold rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Instalar no iOS
                </h2>
                <p className="text-gray-300 text-sm">
                  Siga os passos abaixo para adicionar à tela inicial
                </p>
              </div>

              {/* Instructions */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-semibold">
                    1
                  </div>
                  <div>
                    <p className="text-white font-medium">Toque no botão Compartilhar</p>
                    <p className="text-gray-400 text-sm">No Safari, toque no ícone de compartilhar na parte inferior</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-semibold">
                    2
                  </div>
                  <div>
                    <p className="text-white font-medium">Adicionar à Tela de Início</p>
                    <p className="text-gray-400 text-sm">Procure e toque em "Adicionar à Tela de Início"</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-semibold">
                    3
                  </div>
                  <div>
                    <p className="text-white font-medium">Confirmar</p>
                    <p className="text-gray-400 text-sm">Toque em "Adicionar" para confirmar</p>
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={handleIOSInstructionsClose}
                className="btn-primary w-full"
              >
                Entendi
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default PWAInstallBanner