import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Gift, 
  Eye,
  ArrowRight,
  Sparkles,
  Crown,
  User,
  Zap,
  Trophy,
  TrendingUp,
  Heart,
  Star
} from 'lucide-react'

// Components
import BoxCardGaming from '../components/cards/BoxCardGaming'
import { CompactItemCard } from '../components/cards/ItemCard'
import { CaixasGridSkeleton, LoadingSpinner } from '../components/ui/LoadingSkeleton'
import TransparencyModal from '../components/modals/TransparencyModal'
import PaymentModal from '../components/modals/PaymentModal'
import CaixaOpeningModal from '../components/modals/CaixaOpeningModal'

// Hooks
import { useApi } from '../hooks/useApi'
import { useUser, useNotifications } from '../stores/useAppStore'

// Utils
import { formatCurrency, formatTime, cn, feedback } from '../lib/utils'

const HomePageClean = () => {
  const [selectedCaixa, setSelectedCaixa] = useState(null)
  const [showTransparency, setShowTransparency] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [showOpening, setShowOpening] = useState(false)
  const [compraId, setCompraId] = useState(null)
  
  const { user } = useUser()
  const { addNotification } = useNotifications()

  // Buscar dados da home
  const { data: homeData, loading, error, refetch } = useApi('/home', {
    onError: (error) => {
      addNotification({
        type: 'error',
        message: 'Erro ao carregar dados da página inicial'
      })
    }
  })

  const {
    caixasDestaque = [],
    caixasPopulares = [],
    ultimosGanhadores = [],
    estatisticas = {}
  } = homeData || {}

  // Handlers
  const handleCaixaClick = (caixa) => {
    setSelectedCaixa(caixa)
    setShowPayment(true)
  }

  const handleQuickDemo = () => {
    const primeiraCaixa = caixasPopulares?.[0] || caixasDestaque?.[0]
    
    if (primeiraCaixa) {
      const demoCompraId = `demo-compra-${Date.now()}`
      
      setSelectedCaixa(primeiraCaixa)
      setCompraId(demoCompraId)
      setShowOpening(true)
      
      feedback.success(`🎁 ${primeiraCaixa.nome} Preparada!`)
    } else {
      const demoCaixa = {
        id: 'demo-caixa-001',
        nome: 'Caixa Demo - Teste',
        preco: 25.00,
        imagemUrl: null
      }
      
      const demoCompraId = `demo-compra-${Date.now()}`
      
      setSelectedCaixa(demoCaixa)
      setCompraId(demoCompraId)
      setShowOpening(true)
      
      feedback.success('🎁 Caixa Demo Preparada!')
    }
  }

  const handlePaymentSuccess = (data) => {
    setShowPayment(false)
    setCompraId(data.compraId)
    setShowOpening(true)
  }

  const handleOpenTransparency = (caixaOrCompraId) => {
    if (typeof caixaOrCompraId === 'string') {
      setCompraId(caixaOrCompraId)
    } else {
      setSelectedCaixa(caixaOrCompraId)
      setCompraId(null)
    }
    setShowTransparency(true)
    setShowOpening(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-clean-white">
        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Header Skeleton */}
          <div className="text-center space-y-4">
            <div className="h-20 w-80 mx-auto bg-clean-lightGray rounded-2xl animate-pulse" />
            <div className="h-6 w-96 mx-auto bg-clean-lightGray rounded-xl animate-pulse" />
          </div>

          {/* Action buttons skeleton */}
          <div className="flex gap-4 justify-center">
            <div className="h-14 w-40 bg-clean-lightGray rounded-2xl animate-pulse" />
            <div className="h-14 w-40 bg-clean-lightGray rounded-2xl animate-pulse" />
          </div>

          {/* Cards skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="h-64 bg-clean-lightGray rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-clean-white">
      {/* Header com Login (mobile-first) */}
      <div className="sticky top-0 z-50 bg-clean-white/80 backdrop-blur-xl border-b border-clean-lightGray">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Clean & Big */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cartoon-bubble rounded-2xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-clean-accent" />
              </div>
              <h1 className="text-2xl font-bold text-clean-darkGray tracking-tight">
                SuaCaixa
              </h1>
            </div>

            {/* Login Button - Clean */}
            {!user && (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 bg-clean-lightGray hover:bg-clean-gray/10 rounded-xl transition-all"
              >
                <User className="w-4 h-4 text-clean-gray" />
                <span className="text-clean-gray font-medium text-sm">Entrar</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-16">
        {/* Hero Section - Clean, Big Typography */}
        <motion.section 
          className="text-center space-y-8 py-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Main Title - BIG TYPOGRAPHY */}
          <div className="space-y-4">
            <motion.h1 
              className="text-hero font-black text-clean-darkGray leading-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Abra Caixas
              <br />
              <span className="bg-gradient-to-r from-clean-accent to-cartoon-grass bg-clip-text text-transparent">
                Ganhe Prêmios
              </span>
            </motion.h1>

            <motion.p 
              className="text-body text-clean-gray max-w-lg mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Sistema transparente e verificável.
              <br />
              Prêmios reais, chances justas.
            </motion.p>
          </div>

          {/* Action Buttons - Clean & Touch-friendly */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center max-w-sm mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={handleQuickDemo}
              className="flex-1 flex items-center justify-center gap-3 bg-clean-accent hover:bg-clean-accent/90 text-clean-white font-semibold py-4 px-6 rounded-2xl transition-all shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Gift className="w-5 h-5" />
              Teste Grátis
            </motion.button>
            
            <motion.button
              onClick={() => handleOpenTransparency(caixasDestaque[0] || caixasPopulares[0])}
              className="flex-1 flex items-center justify-center gap-3 bg-cartoon-mint hover:bg-cartoon-mint/80 text-clean-darkGray font-semibold py-4 px-6 rounded-2xl transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!caixasDestaque[0] && !caixasPopulares[0]}
            >
              <Eye className="w-5 h-5" />
              Ver Como Funciona
            </motion.button>
          </motion.div>

          {/* Stats - Cartoon/Playful Cards */}
          <motion.div 
            className="grid grid-cols-3 gap-4 max-w-md mx-auto mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-cartoon-sunshine/20 rounded-2xl p-4 text-center">
              <div className="text-large font-bold text-clean-darkGray">1.2K+</div>
              <div className="text-small text-clean-gray">Usuários</div>
            </div>
            <div className="bg-cartoon-bubblegum/20 rounded-2xl p-4 text-center">
              <div className="text-large font-bold text-clean-darkGray">5.8K+</div>
              <div className="text-small text-clean-gray">Caixas Abertas</div>
            </div>
            <div className="bg-cartoon-lavender/20 rounded-2xl p-4 text-center">
              <div className="text-large font-bold text-clean-darkGray">R$ 89K</div>
              <div className="text-small text-clean-gray">Em Prêmios</div>
            </div>
          </motion.div>
        </motion.section>

        {/* Featured Cases - Clean Cards */}
        {caixasDestaque.length > 0 && (
          <motion.section 
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-cartoon-sunshine rounded-2xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-clean-darkGray" />
                </div>
                <div>
                  <h2 className="text-heading font-bold text-clean-darkGray">Em Destaque</h2>
                  <p className="text-small text-clean-gray">Caixas mais populares</p>
                </div>
              </div>
              
              <Link 
                to="/caixas" 
                className="flex items-center gap-2 text-clean-accent hover:text-clean-accent/80 font-medium transition-colors"
              >
                <span className="text-body">Ver Todas</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {caixasDestaque.slice(0, 6).map((caixa, index) => (
                <motion.div
                  key={caixa.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="group"
                >
                  <div className="bg-clean-white border-2 border-clean-lightGray hover:border-clean-accent/30 rounded-2xl p-6 transition-all hover:shadow-lg">
                    {/* Caixa Image/Icon */}
                    <div className="w-16 h-16 bg-cartoon-bubble rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Gift className="w-8 h-8 text-clean-accent" />
                    </div>
                    
                    {/* Caixa Info */}
                    <div className="space-y-3">
                      <h3 className="text-subtitle font-bold text-clean-darkGray line-clamp-2">
                        {caixa.nome}
                      </h3>
                      
                      <div className="text-heading font-black text-clean-accent">
                        {formatCurrency(caixa.preco)}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => handleCaixaClick(caixa)}
                          className="flex-1 bg-clean-accent hover:bg-clean-accent/90 text-clean-white font-semibold py-3 px-4 rounded-xl transition-all text-body"
                        >
                          Abrir Caixa
                        </button>
                        
                        <button
                          onClick={() => handleOpenTransparency(caixa)}
                          className="px-4 py-3 bg-clean-lightGray hover:bg-clean-gray/10 text-clean-gray rounded-xl transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Popular Cases - Grid mais compacto */}
        {caixasPopulares.length > 0 && (
          <motion.section 
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-cartoon-grass rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-clean-white" />
                </div>
                <div>
                  <h2 className="text-heading font-bold text-clean-darkGray">Populares</h2>
                  <p className="text-small text-clean-gray">Favoritos da comunidade</p>
                </div>
              </div>
              
              <Link 
                to="/caixas?sort=popular" 
                className="flex items-center gap-2 text-clean-accent hover:text-clean-accent/80 font-medium transition-colors"
              >
                <span className="text-body">Ver Todas</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {caixasPopulares.slice(0, 8).map((caixa, index) => (
                <motion.div
                  key={caixa.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * index }}
                  onClick={() => handleCaixaClick(caixa)}
                  className="bg-clean-white border border-clean-lightGray hover:border-clean-accent/30 rounded-2xl p-4 cursor-pointer transition-all hover:shadow-md group"
                >
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-cartoon-peach rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <Gift className="w-6 h-6 text-clean-white" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-body font-semibold text-clean-darkGray line-clamp-2 leading-tight">
                        {caixa.nome}
                      </div>
                      <div className="text-subtitle font-bold text-clean-accent">
                        {formatCurrency(caixa.preco)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Recent Winners - Cartoon Cards */}
        {ultimosGanhadores.length > 0 && (
          <motion.section 
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-cartoon-coral rounded-2xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-clean-white" />
              </div>
              <div>
                <h2 className="text-heading font-bold text-clean-darkGray">Ganhadores Recentes</h2>
                <p className="text-small text-clean-gray">Últimos sortudos</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {ultimosGanhadores.slice(0, 5).map((ganhador, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-cartoon-cream/50 rounded-2xl p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cartoon-mint rounded-full flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-clean-darkGray" />
                    </div>
                    <div className="flex-1">
                      <div className="text-body font-semibold text-clean-darkGray">
                        {ganhador.usuario}
                      </div>
                      <div className="text-small text-clean-gray">
                        {ganhador.item}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-subtitle font-bold text-clean-accent">
                        {formatCurrency(ganhador.valor)}
                      </div>
                      <div className="text-small text-clean-gray">
                        {formatTime(ganhador.dataHora)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div 
            className="text-center py-16 max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-clean-error/10 rounded-3xl flex items-center justify-center">
              <Zap className="w-10 h-10 text-clean-error" />
            </div>
            <h3 className="text-heading font-bold text-clean-error mb-4">Ops! Algo deu errado</h3>
            <p className="text-body text-clean-gray mb-6">Não foi possível carregar as caixas</p>
            <motion.button 
              onClick={refetch} 
              className="bg-clean-accent hover:bg-clean-accent/90 text-clean-white font-semibold py-4 px-8 rounded-2xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Tentar Novamente
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      {showTransparency && (
        <TransparencyModal
          isOpen={showTransparency}
          onClose={() => setShowTransparency(false)}
          caixa={selectedCaixa}
          compraId={compraId}
        />
      )}
      
      {showPayment && (
        <PaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          caixa={selectedCaixa}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
      
      {showOpening && (
        <CaixaOpeningModal
          isOpen={showOpening}
          onClose={() => setShowOpening(false)}
          compraId={compraId}
          caixa={selectedCaixa}
          onTransparency={handleOpenTransparency}
        />
      )}
    </div>
  )
}

export default HomePageClean