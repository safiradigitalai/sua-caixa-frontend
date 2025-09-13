import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { 
  X, 
  Gift, 
  Share2, 
  Eye, 
  RefreshCw,
  Volume2,
  VolumeX,
  Sparkles
} from 'lucide-react'

// Components
import RaridadeBadge from '../ui/RaridadeBadge'

// Hooks
import { useNotifications, useUser } from '../../stores/useAppStore'
import { useApi } from '../../hooks/useApi'

// Utils
import { formatCurrency, triggerHaptic, playSound, playRaritySound, cn } from '../../lib/utils'

const CaixaOpeningModal = ({ 
  isOpen, 
  onClose, 
  caixa,
  compraId,
  onOpenTransparency
}) => {
  const [openingState, setOpeningState] = useState('closed') // closed, opening, revealed
  const [revealedItem, setRevealedItem] = useState(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)
  
  const boxControls = useAnimation()
  const itemControls = useAnimation()
  const confettiControls = useAnimation()
  
  const { addNotification } = useNotifications()
  const { user, updateUser } = useUser()
  
  // Hook para abrir caixa
  const { 
    mutate: abrirCaixa,
    loading,
    error: apiError 
  } = useApi(`/caixas/abrir/${caixa?.id || ''}`, {
    enabled: false
  })

  const [uiError, setUiError] = useState(null)

  // Efeitos sonoros
  const playOpenSound = () => {
    if (soundEnabled) {
      playSound('/sounds/box-open.mp3', 0.3)
    }
  }

  const playRevealSound = () => {
    if (soundEnabled && revealedItem) {
      playRaritySound(revealedItem.raridade, 0.6)
    }
  }

  // Reset quando modal abre/fecha
  useEffect(() => {
    if (isOpen) {
      setOpeningState('closed')
      setRevealedItem(null)
      setShowConfetti(false)
      setUiError(null)
    }
    
    return () => {
      boxControls.stop()
      itemControls.stop()
      confettiControls.stop()
    }
  }, [isOpen, boxControls, itemControls, confettiControls])

  // Confetti para itens épicos+
  useEffect(() => {
    if (revealedItem && openingState === 'revealed') {
      if (['epico', 'lendario', 'mitico'].includes(revealedItem.raridade)) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 4000)
      }
    }
  }, [revealedItem, openingState])

  const handleStartOpening = async () => {
    if (!compraId) return
    
    try {
      setOpeningState('opening')
      triggerHaptic('medium')
      playOpenSound()
      
      // Animação cinematográfica da caixa
      await boxControls.start({
        scale: [1, 1.02, 1.05, 1.02],
        y: [0, -2, 0, -1],
        transition: { duration: 2.2, ease: [0.25, 0.46, 0.45, 0.94] }
      })
      
      // Chamar API
      console.log('📡 Abrindo caixa:', compraId, 'para usuário:', user?.id)
      const resultado = await abrirCaixa({ 
        pagamentoId: compraId,
        usuarioId: user?.id 
      })
      console.log('📦 Item recebido:', resultado)
      
      if (!resultado || !resultado.item) {
        throw new Error('Erro ao abrir caixa')
      }
      
      // Definir item revelado
      console.log('🎁 Item recebido para revelação:', resultado.item)
      setRevealedItem(resultado.item)
      setOpeningState('revealed')
      playRevealSound()
      
      // Aguardar um pouco para garantir que o estado foi atualizado
      setTimeout(async () => {
        // Animação de revelação imediata
        await itemControls.start({
          scale: [0, 1.1, 1],
          opacity: [0, 1],
          y: [20, -5, 0],
          transition: { 
            duration: 1.5, 
            ease: [0.25, 0.46, 0.45, 0.94]
          }
        })
      }, 500)
      
      if (resultado.novoSaldo !== undefined) {
        console.log('💳 Atualizando saldo do usuário no store:', {
          saldoAnterior: user?.saldo,
          novoSaldo: resultado.novoSaldo
        })
        updateUser({ saldo: resultado.novoSaldo })
      } else {
        console.warn('⚠️  Novo saldo não retornado na abertura da caixa')
      }
      
    } catch (error) {
      console.error('Erro:', error)
      setUiError(error.message || 'Erro ao abrir caixa')
      addNotification({
        type: 'error',
        title: 'Erro ao Abrir Caixa',
        message: error.message || 'Erro ao abrir caixa'
      })
      setOpeningState('closed')
    }
  }

  const handleShare = async () => {
    if (!revealedItem) return
    
    const shareData = {
      title: 'Sua Caixa - Item Ganho!',
      text: `Acabei de ganhar ${revealedItem.nome} no Sua Caixa! 🎁`,
      url: window.location.origin
    }
    
    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`)
        addNotification({
          type: 'success',
          message: 'Link copiado!'
        })
      }
      triggerHaptic('light')
    } catch (error) {
      console.log('Share cancelled')
    }
  }

  if (!isOpen) return null

  const canStartOpening = openingState === 'closed' && compraId
  const isOpening = openingState === 'opening' || loading
  const isRevealed = openingState === 'revealed'

  // Debug logs
  console.log('🔍 Estado atual:', { 
    openingState, 
    isRevealed, 
    hasRevealedItem: !!revealedItem,
    itemName: revealedItem?.nome 
  })

  // Cores por raridade - mais sutis
  const getRarityColors = (raridade) => {
    switch(raridade) {
      case 'comum': return { 
        bg: 'from-gray-800/90 to-gray-900/90', 
        border: 'border-gray-500/50', 
        text: 'text-gray-200',
        glow: 'shadow-gray-500/30'
      }
      case 'raro': return { 
        bg: 'from-blue-800/90 to-blue-900/90', 
        border: 'border-blue-500/50', 
        text: 'text-blue-200',
        glow: 'shadow-blue-500/30'
      }
      case 'epico': return { 
        bg: 'from-purple-800/90 to-purple-900/90', 
        border: 'border-purple-500/50', 
        text: 'text-purple-200',
        glow: 'shadow-purple-500/30'
      }
      case 'lendario': return { 
        bg: 'from-yellow-800/90 to-yellow-900/90', 
        border: 'border-yellow-500/50', 
        text: 'text-yellow-200',
        glow: 'shadow-yellow-500/30'
      }
      case 'mitico': return { 
        bg: 'from-pink-800/90 to-pink-900/90', 
        border: 'border-pink-500/50', 
        text: 'text-pink-200',
        glow: 'shadow-pink-500/30'
      }
      default: return { 
        bg: 'from-gray-800/90 to-gray-900/90', 
        border: 'border-gray-500/50', 
        text: 'text-gray-200',
        glow: 'shadow-gray-500/30'
      }
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 50%, rgba(15, 23, 42, 0.95) 100%)',
          backdropFilter: 'blur(12px)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose()
          }
        }}
      >
        {/* Subtle Gaming Background */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 20%, #06b6d4 1px, transparent 1px),
                               radial-gradient(circle at 80% 80%, #8b5cf6 1px, transparent 1px)`,
              backgroundSize: '100px 100px, 80px 80px'
            }}
          />
        </div>

        {/* Confetti Gaming Elegante */}
        <AnimatePresence>
          {showConfetti && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${10 + Math.random() * 20}%`,
                  }}
                  animate={{
                    y: [0, window.innerHeight + 100],
                    x: [0, (Math.random() - 0.5) * 150],
                    rotate: [0, Math.random() * 360],
                    opacity: [1, 0.8, 0],
                  }}
                  transition={{
                    duration: 3.5,
                    delay: Math.random() * 1.5,
                    ease: 'easeOut'
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Clean Gaming */}
        <motion.div
          className="relative w-full max-w-md"
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Gaming Card Clean */}
          <div 
            className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            }}
          >
            {/* Header Clean */}
            <div className="relative bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm border-b border-slate-600/30 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">
                    {isRevealed ? '🎉 Prêmio Revelado!' : '🎁 Abertura de Caixa'}
                  </h2>
                  <p className="text-slate-300 text-sm font-medium">
                    {caixa?.nome || 'Caixa Especial'}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-2 bg-slate-800/60 hover:bg-slate-700/60 rounded-xl border border-slate-600/30 transition-colors"
                  >
                    {soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-slate-300" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-slate-300" />
                    )}
                  </button>
                  
                  <button
                    onClick={onClose}
                    className="p-2 bg-slate-800/60 hover:bg-slate-700/60 rounded-xl border border-slate-600/30 transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-300" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-8">
              {/* Status Loading Clean */}
              {isOpening && (
                <motion.div
                  className="text-center mb-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="inline-flex items-center gap-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl px-6 py-3">
                    <motion.div
                      className="w-5 h-5 border-2 border-cyan-400 border-r-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span className="text-cyan-400 font-medium uppercase tracking-wide">
                      Abrindo caixa...
                    </span>
                  </div>
                </motion.div>
              )}
              
              {/* Error State Clean */}
              {uiError && (
                <div className="text-center py-8">
                  <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6">
                    <h3 className="text-red-400 font-bold text-lg mb-2">Erro</h3>
                    <p className="text-red-300/80 text-sm mb-4">{uiError}</p>
                    <button
                      onClick={() => {
                        setUiError(null)
                        onClose()
                      }}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              )}

              {/* Caixa Gaming 2D Cinematográfica */}
              {!uiError && (
                <div className="text-center">
                  <div className="relative mb-8">
                    <motion.div
                      className="relative mx-auto w-48 h-32"
                      animate={boxControls}
                    >
                      {/* Box Container */}
                      <div className="relative w-full h-full">
                        {/* Box Base 2D */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-700 rounded-2xl border-2 border-amber-400/60"
                          style={{
                            boxShadow: '0 15px 35px -10px rgba(245, 158, 11, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)'
                          }}
                        >
                          {/* Box Pattern */}
                          <div className="absolute inset-2 border border-amber-300/40 rounded-xl" />
                          <div className="absolute inset-4 border border-amber-200/30 rounded-lg" />
                          
                          {/* Lock/Keyhole */}
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <motion.div
                              className="w-6 h-6 bg-amber-200/30 rounded-full border border-amber-300/50 flex items-center justify-center"
                              animate={isOpening ? {
                                scale: [1, 1.2, 0],
                                opacity: [1, 0.5, 0]
                              } : {
                                scale: [1, 1.05, 1],
                                opacity: [0.8, 1, 0.8]
                              }}
                              transition={{
                                duration: isOpening ? 0.8 : 2,
                                repeat: isOpening ? 0 : Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              <div className="w-2 h-3 bg-amber-200/60 rounded-sm" />
                            </motion.div>
                          </div>
                        </motion.div>

                        {/* Box Lid - Animada */}
                        <motion.div
                          className="absolute top-0 left-0 w-full h-2/3 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 rounded-t-2xl border-2 border-amber-400/60 border-b-0"
                          animate={isOpening ? {
                            rotateX: [0, -25, -45, -90],
                            y: [0, -2, -8, -16],
                            z: [0, 5, 15, 30],
                            opacity: [1, 0.9, 0.7, 0.3]
                          } : {}}
                          style={{
                            transformOrigin: 'bottom center',
                            transformStyle: 'preserve-3d',
                            boxShadow: '0 10px 25px -8px rgba(245, 158, 11, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.2)'
                          }}
                          transition={{
                            duration: isOpening ? 1.5 : 0,
                            ease: [0.25, 0.46, 0.45, 0.94]
                          }}
                        >
                          {/* Lid Pattern */}
                          <div className="absolute inset-2 border border-amber-300/40 rounded-t-xl" />
                          
                          {/* Ribbon */}
                          <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-2 bg-red-600/80 shadow-lg" />
                          <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-2 bg-red-600/80 shadow-lg" />
                          
                          {/* Bow */}
                          <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                            <div className="text-lg filter drop-shadow-sm">🎀</div>
                          </div>
                        </motion.div>

                        {/* Opening Light Effect */}
                        <AnimatePresence>
                          {isOpening && (
                            <motion.div
                              className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              {/* Golden Light Beam */}
                              <motion.div
                                className="absolute w-32 h-64 bg-gradient-to-t from-transparent via-yellow-300/60 to-transparent"
                                initial={{ scaleY: 0, opacity: 0 }}
                                animate={{ 
                                  scaleY: [0, 1.2, 1], 
                                  opacity: [0, 0.8, 0.6],
                                  rotate: [0, 2, -2, 0]
                                }}
                                transition={{ 
                                  duration: 1.2, 
                                  delay: 0.8,
                                  ease: "easeOut"
                                }}
                                style={{ transformOrigin: 'bottom center' }}
                              />
                              
                              {/* Inner Glow */}
                              <motion.div
                                className="absolute w-20 h-8 bg-yellow-200/40 rounded-full blur-sm"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ 
                                  scale: [0, 1.5, 1.2], 
                                  opacity: [0, 0.8, 0.6]
                                }}
                                transition={{ 
                                  duration: 1,
                                  delay: 0.9,
                                  ease: "easeOut"
                                }}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Magical Particles */}
                        <AnimatePresence>
                          {(isOpening || isRevealed) && (
                            <>
                              {Array.from({ length: 6 }, (_, i) => {
                                const angle = (i * Math.PI * 2) / 6;
                                const radius = 100;
                                const delay = i * 0.3;
                                
                                return (
                                  <motion.div
                                    key={i}
                                    className="absolute pointer-events-none"
                                    style={{
                                      left: '50%',
                                      top: '50%',
                                      transform: `translate(-50%, -50%) translate(${radius * Math.cos(angle)}px, ${radius * Math.sin(angle)}px)`
                                    }}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{
                                      scale: [0, 1, 0.8, 0],
                                      opacity: [0, 1, 0.8, 0],
                                      y: [0, -20, -40, -60],
                                      rotate: [0, 180, 360]
                                    }}
                                    transition={{
                                      duration: 2.5,
                                      delay: isOpening ? delay + 0.5 : delay,
                                      repeat: isOpening ? 0 : Infinity,
                                      repeatDelay: 3,
                                      ease: "easeOut"
                                    }}
                                  >
                                    <div className="w-2 h-2 bg-amber-400 rounded-full shadow-lg" 
                                         style={{ filter: 'drop-shadow(0 0 4px rgba(245, 158, 11, 0.8))' }} />
                                  </motion.div>
                                );
                              })}
                            </>
                          )}
                        </AnimatePresence>

                        {/* Floating Sparkles */}
                        <AnimatePresence>
                          {(isOpening || isRevealed) && (
                            <>
                              {Array.from({ length: 3 }, (_, i) => (
                                <motion.div
                                  key={`sparkle-${i}`}
                                  className="absolute pointer-events-none"
                                  style={{
                                    left: `${30 + i * 20}%`,
                                    top: `${20 + i * 15}%`,
                                  }}
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{
                                    scale: [0, 1, 0],
                                    opacity: [0, 1, 0],
                                    rotate: [0, 180, 360]
                                  }}
                                  transition={{
                                    duration: 1.5,
                                    delay: 0.5 + i * 0.3,
                                    repeat: isOpening ? 1 : Infinity,
                                    repeatDelay: 2,
                                    ease: "easeInOut"
                                  }}
                                >
                                  <Sparkles className="w-3 h-3 text-amber-300" style={{ filter: 'drop-shadow(0 0 2px rgba(252, 211, 77, 0.8))' }} />
                                </motion.div>
                              ))}
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  </div>

                  {/* Item Reveal Clean Style */}
                  <AnimatePresence>
                    {revealedItem && (isRevealed || isOpening) && (
                      <motion.div
                        className="mb-6"
                        animate={itemControls}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      >
                        {(() => {
                          const colors = getRarityColors(revealedItem.raridade);
                          return (
                            <motion.div 
                              className={`relative bg-gradient-to-br ${colors.bg} backdrop-blur-sm rounded-2xl p-6 border ${colors.border}`}
                              initial={{ opacity: 0 }}
                              animate={{
                                opacity: 1,
                                boxShadow: `0 15px 35px -5px ${colors.glow.replace('shadow-', '').replace('/30', '')}50`
                              }}
                              transition={{
                                duration: 0.8,
                                ease: "easeOut"
                              }}
                            >
                              <div className="flex items-center gap-5">
                                {/* Item Image Clean */}
                                <div className="relative">
                                  <motion.div
                                    className="w-20 h-20 relative"
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5, ease: 'easeOut' }}
                                  >
                                    <img
                                      src={revealedItem.imagemUrl}
                                      alt={revealedItem.nome}
                                      className={`w-full h-full object-cover rounded-xl border ${colors.border}`}
                                      onError={(e) => {
                                        e.target.style.display = 'none'
                                        e.target.nextSibling.style.display = 'flex'
                                      }}
                                    />
                                    <div className={`w-full h-full bg-slate-700 rounded-xl border ${colors.border} items-center justify-center hidden`}>
                                      <Gift className="w-6 h-6 text-slate-300" />
                                    </div>
                                  </motion.div>
                                  
                                  {/* Rarity Badge Clean */}
                                  <div className="absolute -top-1 -right-1">
                                    <RaridadeBadge raridade={revealedItem.raridade} size="sm" />
                                  </div>
                                </div>

                                {/* Item Info Clean */}
                                <div className="flex-1 text-left">
                                  <motion.h3 
                                    className={`text-2xl font-bold mb-2 ${colors.text} leading-tight`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ 
                                      opacity: 1, 
                                      x: 0,
                                      textShadow: "0 2px 8px rgba(0,0,0,0.3)"
                                    }}
                                    transition={{ 
                                      duration: 0.6, 
                                      ease: "easeOut",
                                      delay: 0.2
                                    }}
                                  >
                                    {revealedItem?.nome || 'Item Misterioso'}
                                  </motion.h3>
                                  
                                  {revealedItem?.marca && (
                                    <p className="text-slate-300 font-medium text-sm mb-3">
                                      {revealedItem.marca}
                                    </p>
                                  )}
                                  
                                  <motion.div 
                                    className="text-3xl font-bold text-emerald-400 mb-3"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ 
                                      opacity: 1, 
                                      scale: 1
                                    }}
                                    transition={{ 
                                      duration: 0.5, 
                                      ease: "easeOut",
                                      delay: 0.3
                                    }}
                                  >
                                    {formatCurrency(revealedItem?.valor || 0)}
                                  </motion.div>
                                  
                                  {/* Stats Clean */}
                                  <div className="flex items-center gap-3 text-xs text-slate-400">
                                    <div className="flex items-center gap-1">
                                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                                      <span className="font-medium">VERIFICADO</span>
                                    </div>
                                    <div className="w-px h-2 bg-slate-600" />
                                    <div className="flex items-center gap-1">
                                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                                      <span className="font-medium">AUTÊNTICO</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {revealedItem.descricao && (
                                <motion.div
                                  className="mt-4 p-3 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10"
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.5 }}
                                >
                                  <p className="text-slate-300 text-sm leading-relaxed">
                                    {revealedItem.descricao}
                                  </p>
                                </motion.div>
                              )}
                            </motion.div>
                          );
                        })()}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action Buttons Clean Gaming */}
                  <div className="space-y-4">
                    {/* Start Opening Button */}
                    {canStartOpening && (
                      <motion.button
                        onClick={handleStartOpening}
                        className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-semibold text-lg py-4 rounded-2xl border border-cyan-500/30 shadow-lg transition-all relative overflow-hidden"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />
                        <div className="relative flex items-center justify-center gap-2">
                          <Gift className="w-5 h-5" />
                          Abrir Caixa
                        </div>
                      </motion.button>
                    )}

                    {/* Final Actions Clean */}
                    {isRevealed && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-4"
                      >
                        {/* Victory Message Clean */}
                        <div className="text-center py-4 bg-gradient-to-r from-emerald-900/30 to-green-900/30 backdrop-blur-sm rounded-2xl border border-emerald-500/20">
                          <h3 className="text-lg font-bold text-emerald-400 mb-1">
                            🎉 Parabéns!
                          </h3>
                          <p className="text-emerald-300/80 text-sm">
                            Você ganhou: <span className="font-semibold">{revealedItem?.nome || 'um prêmio incrível'}</span>!
                          </p>
                        </div>

                        {/* Action Buttons Grid Clean */}
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={handleShare}
                            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-medium py-3 px-4 rounded-xl border border-purple-500/30 transition-all flex items-center justify-center gap-2"
                          >
                            <Share2 className="w-4 h-4" />
                            Compartilhar
                          </button>
                          
                          <button
                            onClick={() => onOpenTransparency?.(compraId)}
                            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-medium py-3 px-4 rounded-xl border border-indigo-500/30 transition-all flex items-center justify-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Transparência
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={onClose}
                            className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white font-medium py-3 px-4 rounded-xl border border-slate-500/30 transition-all"
                          >
                            Fechar
                          </button>
                          
                          <button
                            onClick={onClose}
                            className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-medium py-3 px-4 rounded-xl border border-cyan-500/30 transition-all flex items-center justify-center gap-2"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Nova Caixa
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default CaixaOpeningModal