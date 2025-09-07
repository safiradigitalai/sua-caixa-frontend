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
  Star,
  Gamepad2,
  Target,
  Gem
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

const HomePageGaming = () => {
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
      
      feedback.success(`🎮 ${primeiraCaixa.nome} Desbloqueada!`)
    } else {
      const demoCaixa = {
        id: 'demo-caixa-001',
        nome: 'Starter Pack - Demo',
        preco: 25.00,
        imagemUrl: null
      }
      
      const demoCompraId = `demo-compra-${Date.now()}`
      
      setSelectedCaixa(demoCaixa)
      setCompraId(demoCompraId)
      setShowOpening(true)
      
      feedback.success('🎮 Starter Pack Desbloqueado!')
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
      <div className="min-h-screen bg-gaming-bg">
        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Header Skeleton */}
          <div className="text-center space-y-4">
            <div className="h-20 w-80 mx-auto bg-gaming-surface rounded-2xl animate-pulse" />
            <div className="h-6 w-96 mx-auto bg-gaming-surface rounded-xl animate-pulse" />
          </div>

          {/* Action buttons skeleton */}
          <div className="flex gap-4 justify-center">
            <div className="h-16 w-48 bg-gaming-surface rounded-2xl animate-pulse" />
            <div className="h-16 w-48 bg-gaming-surface rounded-2xl animate-pulse" />
          </div>

          {/* Cards skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="h-80 bg-gaming-surface rounded-3xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gaming-bg">
      {/* Gaming Header - Clash Royale inspired */}
      <div className="sticky top-0 z-50 bg-gaming-bg/90 backdrop-blur-xl border-b-2 border-gaming-primary/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Gaming Style com efeito brilho */}
            <div className="flex items-center gap-4">
              <motion.div 
                className="w-12 h-12 bg-gaming-secondary rounded-2xl flex items-center justify-center relative overflow-hidden"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Sparkles className="w-7 h-7 text-gaming-bg z-10" />
                {/* Brilho gaming effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-pulse" />
              </motion.div>
              
              <div>
                <h1 className="text-2xl font-gaming-display font-black text-gaming-textPrimary tracking-tight">
                  SUA CAIXA
                </h1>
                <div className="text-xs font-gaming text-gaming-textSecondary">
                  Battle • Win • Collect
                </div>
              </div>
            </div>

            {/* User Area - Gaming Style */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3 bg-gaming-surface px-4 py-2 rounded-2xl border border-gaming-border">
                  <div className="w-8 h-8 bg-gaming-primary rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="font-gaming font-semibold text-gaming-textPrimary text-sm">
                    {user.nome}
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-gaming-primary hover:bg-gaming-primary/80 px-6 py-3 rounded-2xl transition-all font-gaming font-bold text-white shadow-lg hover:shadow-xl"
                >
                  <User className="w-4 h-4" />
                  <span>LOGIN</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section - Fortnite Style com Big Typography */}
        <motion.section 
          className="text-center space-y-8 py-12 relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Background gaming effects */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute top-10 left-10 w-32 h-32 bg-gaming-accent1/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-gaming-accent2/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gaming-secondary/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 space-y-6">
            {/* Gaming Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 bg-gaming-surface/80 backdrop-blur-sm px-6 py-3 rounded-full border border-gaming-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Gamepad2 className="w-5 h-5 text-gaming-secondary" />
              <span className="font-gaming font-bold text-gaming-secondary text-sm tracking-wide">
                BATTLE ROYALE BOXES
              </span>
            </motion.div>

            {/* Main Title - Gaming Style */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-gaming-display font-black text-gaming-textPrimary leading-none tracking-tight">
                BATTLE
                <br />
                <span className="bg-gradient-to-r from-gaming-secondary via-gaming-primary to-gaming-accent1 bg-clip-text text-transparent">
                  FOR LOOT
                </span>
              </h1>

              <p className="text-xl text-gaming-textSecondary font-gaming max-w-2xl mx-auto leading-relaxed">
                Abra caixas épicas, colete itens raros e domine o ranking.
                <br />
                <span className="text-gaming-success font-bold">100% Fair Play</span> • 
                <span className="text-gaming-secondary font-bold"> Verified Drops</span> • 
                <span className="text-gaming-accent1 font-bold"> Real Rewards</span>
              </p>
            </motion.div>

            {/* Action Buttons - Gaming Style */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                onClick={handleQuickDemo}
                className="flex-1 flex items-center justify-center gap-3 bg-gaming-secondary hover:bg-gaming-secondary/90 text-gaming-bg font-gaming-display font-black py-5 px-8 rounded-2xl transition-all shadow-lg hover:shadow-2xl text-lg relative overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Gift className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                FREE STARTER
                {/* Gaming shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </motion.button>
              
              <motion.button
                onClick={() => handleOpenTransparency(caixasDestaque[0] || caixasPopulares[0])}
                className="flex-1 flex items-center justify-center gap-3 bg-gaming-surface hover:bg-gaming-elevated text-gaming-textPrimary font-gaming-display font-bold py-5 px-8 rounded-2xl border-2 border-gaming-border hover:border-gaming-primary transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!caixasDestaque[0] && !caixasPopulares[0]}
              >
                <Eye className="w-6 h-6" />
                VIEW ODDS
              </motion.button>
            </motion.div>

            {/* Gaming Stats - Cards inspiradas no Clash Royale */}
            <motion.div 
              className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div 
                className="bg-gaming-surface/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-gaming-border hover:border-gaming-success/50 transition-colors group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 bg-rarity-uncommon rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:rotate-12 transition-transform">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-gaming-display font-black text-gaming-textPrimary">1.2K+</div>
                <div className="text-sm font-gaming text-gaming-textSecondary">Players</div>
              </motion.div>
              
              <motion.div 
                className="bg-gaming-surface/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-gaming-border hover:border-gaming-secondary/50 transition-colors group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 bg-rarity-rare rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:rotate-12 transition-transform">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-gaming-display font-black text-gaming-textPrimary">5.8K+</div>
                <div className="text-sm font-gaming text-gaming-textSecondary">Boxes Opened</div>
              </motion.div>
              
              <motion.div 
                className="bg-gaming-surface/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-gaming-border hover:border-gaming-accent1/50 transition-colors group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 bg-rarity-legendary rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:rotate-12 transition-transform">
                  <Gem className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-gaming-display font-black text-gaming-textPrimary">R$ 89K</div>
                <div className="text-sm font-gaming text-gaming-textSecondary">Total Prizes</div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Featured Cases - Gaming Cards inspiradas no Fortnite */}
        {caixasDestaque.length > 0 && (
          <motion.section 
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-rarity-legendary rounded-3xl flex items-center justify-center relative overflow-hidden">
                  <Crown className="w-8 h-8 text-white z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                </div>
                <div>
                  <h2 className="text-3xl font-gaming-display font-black text-gaming-textPrimary">FEATURED LOOT</h2>
                  <p className="text-gaming-textSecondary font-gaming">Epic boxes with legendary rewards</p>
                </div>
              </div>
              
              <Link 
                to="/caixas" 
                className="flex items-center gap-2 bg-gaming-primary hover:bg-gaming-primary/80 text-white font-gaming font-bold px-6 py-3 rounded-2xl transition-all shadow-lg hover:shadow-xl"
              >
                <span>VIEW ALL</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {caixasDestaque.slice(0, 6).map((caixa, index) => (
                <motion.div
                  key={caixa.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.1 * index, type: "spring", stiffness: 300 }}
                  className="group"
                >
                  {/* Gaming Card - Fortnite/Clash Royale Style */}
                  <div className="bg-gaming-surface border-2 border-gaming-border hover:border-gaming-primary/50 rounded-3xl p-6 transition-all hover:shadow-2xl hover:shadow-gaming-primary/20 relative overflow-hidden group-hover:scale-105 transform-gpu">
                    {/* Rarity indicator */}
                    <div className="absolute top-3 right-3 w-8 h-8 bg-rarity-epic rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    
                    {/* Gaming shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gaming-primary/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    
                    {/* Caixa Icon/Image */}
                    <div className="w-20 h-20 bg-rarity-epic rounded-3xl flex items-center justify-center mb-4 relative overflow-hidden group-hover:scale-110 transition-transform">
                      <Gift className="w-10 h-10 text-white z-10" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                    </div>
                    
                    {/* Caixa Info */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-gaming-display font-bold text-gaming-textPrimary line-clamp-2 leading-tight">
                        {caixa.nome}
                      </h3>
                      
                      <div className="text-2xl font-gaming-display font-black text-gaming-secondary">
                        {formatCurrency(caixa.preco)}
                      </div>
                      
                      {/* Actions - Gaming Style */}
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => handleCaixaClick(caixa)}
                          className="flex-1 bg-gaming-primary hover:bg-gaming-primary/80 text-white font-gaming font-bold py-4 px-6 rounded-2xl transition-all shadow-lg hover:shadow-xl text-center"
                        >
                          OPEN BOX
                        </button>
                        
                        <button
                          onClick={() => handleOpenTransparency(caixa)}
                          className="px-4 py-4 bg-gaming-elevated hover:bg-gaming-border text-gaming-textSecondary hover:text-gaming-textPrimary rounded-2xl transition-all"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Popular Cases - Compact Grid Gaming Style */}
        {caixasPopulares.length > 0 && (
          <motion.section 
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-rarity-rare rounded-3xl flex items-center justify-center relative overflow-hidden">
                  <TrendingUp className="w-8 h-8 text-white z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                </div>
                <div>
                  <h2 className="text-3xl font-gaming-display font-black text-gaming-textPrimary">HOT PICKS</h2>
                  <p className="text-gaming-textSecondary font-gaming">Most popular in the community</p>
                </div>
              </div>
              
              <Link 
                to="/caixas?sort=popular" 
                className="flex items-center gap-2 bg-gaming-surface hover:bg-gaming-elevated text-gaming-textPrimary font-gaming font-bold px-6 py-3 rounded-2xl border border-gaming-border hover:border-gaming-primary transition-all"
              >
                <span>VIEW ALL</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {caixasPopulares.slice(0, 8).map((caixa, index) => (
                <motion.div
                  key={caixa.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * index, type: "spring", stiffness: 300 }}
                  onClick={() => handleCaixaClick(caixa)}
                  className="bg-gaming-surface hover:bg-gaming-elevated border border-gaming-border hover:border-gaming-primary/50 rounded-2xl p-4 cursor-pointer transition-all hover:shadow-xl hover:shadow-gaming-primary/10 group relative overflow-hidden"
                >
                  {/* Gaming shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gaming-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  
                  <div className="text-center space-y-3 relative z-10">
                    <div className="w-16 h-16 bg-rarity-uncommon rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform relative overflow-hidden">
                      <Gift className="w-8 h-8 text-white z-10" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-gaming font-bold text-gaming-textPrimary line-clamp-2 leading-tight">
                        {caixa.nome}
                      </div>
                      <div className="text-lg font-gaming-display font-black text-gaming-secondary">
                        {formatCurrency(caixa.preco)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Recent Winners - Gaming Leaderboard Style */}
        {ultimosGanhadores.length > 0 && (
          <motion.section 
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-rarity-legendary rounded-3xl flex items-center justify-center relative overflow-hidden">
                <Trophy className="w-8 h-8 text-white z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              </div>
              <div>
                <h2 className="text-3xl font-gaming-display font-black text-gaming-textPrimary">WINNERS BOARD</h2>
                <p className="text-gaming-textSecondary font-gaming">Recent champions and their loot</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {ultimosGanhadores.slice(0, 5).map((ganhador, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-gaming-surface/80 backdrop-blur-sm rounded-2xl p-4 border border-gaming-border hover:border-gaming-secondary/30 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    {/* Position badge */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-gaming-display font-black text-white text-lg ${
                      index === 0 ? 'bg-rarity-legendary' :
                      index === 1 ? 'bg-gaming-textSecondary' :
                      index === 2 ? 'bg-rarity-uncommon' :
                      'bg-gaming-border'
                    }`}>
                      {index + 1}
                    </div>
                    
                    <div className="flex-1">
                      <div className="text-lg font-gaming-display font-bold text-gaming-textPrimary">
                        {ganhador.usuario}
                      </div>
                      <div className="text-sm font-gaming text-gaming-textSecondary">
                        Won: {ganhador.item}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-gaming-display font-black text-gaming-secondary">
                        {formatCurrency(ganhador.valor)}
                      </div>
                      <div className="text-xs font-gaming text-gaming-textMuted">
                        {formatTime(ganhador.dataHora)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Error State - Gaming Style */}
        {error && !loading && (
          <motion.div 
            className="text-center py-16 max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gaming-danger/20 rounded-3xl flex items-center justify-center">
              <Zap className="w-12 h-12 text-gaming-danger" />
            </div>
            <h3 className="text-2xl font-gaming-display font-black text-gaming-danger mb-4">CONNECTION LOST</h3>
            <p className="text-gaming-textSecondary font-gaming mb-6">Unable to load the battle arena</p>
            <motion.button 
              onClick={refetch} 
              className="bg-gaming-primary hover:bg-gaming-primary/90 text-white font-gaming-display font-bold py-4 px-8 rounded-2xl transition-all shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              RECONNECT
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

export default HomePageGaming