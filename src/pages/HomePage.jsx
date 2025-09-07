import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Crown, 
  Gift, 
  Eye,
  ArrowRight,
  Sparkles,
  Users,
  Clock,
  User,
  Zap,
  Trophy,
  Shield
} from 'lucide-react'

// Components
import BoxCardGaming from '../components/cards/BoxCardGaming'
import LuxDropCaseCard from '../components/cards/LuxDropCaseCard'
import LuxDropCaseCardV2 from '../components/cards/LuxDropCaseCardV2'
import LuxDropBanner from '../components/ui/LuxDropBanner'
import GamingBanner from '../components/ui/GamingBanner'
import HowItWorksLuxDrop from '../components/sections/HowItWorksLuxDrop'
import PaymentMethodsLuxDrop from '../components/sections/PaymentMethodsLuxDrop'
import { CompactItemCard } from '../components/cards/ItemCard'
import { CaixasGridSkeleton, GanhadorSkeleton, LoadingSpinner } from '../components/ui/LoadingSkeleton'
import TransparencyModal from '../components/modals/TransparencyModal'
import PaymentModal from '../components/modals/PaymentModal'
import CaixaOpeningModal from '../components/modals/CaixaOpeningModal'
import HorizontalLiveFeed from '../components/ui/HorizontalLiveFeed'
import GamingContainer from '../components/ui/GamingContainer'
import GamingButton from '../components/ui/GamingButton'
import MobileGamingCard from '../components/ui/MobileGamingCard'
import GamingCaseCard from '../components/ui/GamingCaseCard'

// Hooks
import { useApi } from '../hooks/useApi'
import { useUser, useNotifications } from '../stores/useAppStore'

// Utils
import { formatCurrency, formatTime, cn, feedback } from '../lib/utils'

const HomePage = () => {
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

  const closeAllModals = () => {
    setShowTransparency(false)
    setShowPayment(false)
    setShowOpening(false)
    setSelectedCaixa(null)
    setCompraId(null)
  }

  if (loading) {
    return (
      <div className="landing min-h-screen">
        <div className="space-y-8">
          {/* Header Skeleton */}
          <div className="text-center space-y-4">
            <div className="skeleton h-12 w-64 mx-auto" />
            <div className="skeleton h-6 w-96 mx-auto" />
          </div>

          {/* Banners Skeleton */}
          <div className="flex gap-4 overflow-x-auto">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="min-w-[343px] h-[170px] skeleton rounded-lg" />
            ))}
          </div>

          {/* Caixas Skeleton */}
          <CaixasGridSkeleton count={8} />
        </div>
      </div>
    )
  }

  return (
    <div className="landing min-h-screen bg-luxdrop-hero relative">
      {/* LuxDrop Background Pattern */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, #22b5ff 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="relative z-10 space-y-16">

        {/* Gaming Banners - Melhorado com grid responsivo */}
        <section className="space-y-8 px-4 md:px-8">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Caixas Gaming Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GamingBanner
                type="boxes"
                title="LOOT BOXES"
                description="Equipamentos e itens épicos"
                icon={Crown}
                to="/caixas"
                buttonText="ABRIR CAIXAS"
                stats={{ label: "DISPONÍVEL", value: `${caixasDestaque.length + caixasPopulares.length}+` }}
              />
            </motion.div>

            {/* Battles Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GamingBanner
                type="battles"
                title="ARENA PVP"
                description="Batalhe contra outros players"
                icon={Zap}
                to="/battles"
                buttonText="ENTRAR BATTLE"
                stats={{ label: "ONLINE", value: "127" }}
              />
            </motion.div>

            {/* Rewards Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="md:col-span-2 lg:col-span-1"
            >
              <GamingBanner
                type="rewards"
                title="INVENTORY"
                description="Seus prêmios e conquistas"
                icon={Trophy}
                to="/rewards"
                buttonText="VER ITENS"
                stats={{ label: "TOTAL", value: "R$ 89K" }}
              />
            </motion.div>
          </motion.div>
        </section>
        {/* Featured Cases - Gaming Design System */}
        {caixasDestaque.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <GamingContainer
              variant="secondary"
              headerTitle="CAIXAS EM DESTAQUE"
              headerSubtitle={`${caixasDestaque.length} caixas premium disponíveis`}
              headerIcon={Crown}
              headerActions={
                <GamingButton
                  variant="outline"
                  size="sm"
                  href="/caixas"
                  arrowAnimation
                >
                  Ver Todas
                </GamingButton>
              }
              borderStyle="glow"
              className="mx-4 md:mx-8"
            >
              {/* Mobile: Cards estilo populares melhorado */}
              <div className="block md:hidden">
                <div className="grid grid-cols-2 gap-4 justify-items-center px-2">
                  {caixasDestaque.slice(0, 4).map((caixa, index) => {
                    const getRarity = (idx) => {
                      if (idx === 0) return "mythic" // Featured sempre mythic
                      if (idx === 1) return "legendary" 
                      return "epic"
                    }

                    return (
                      <motion.div
                        key={`featured-mobile-${caixa.id}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          delay: index * 0.08,
                          type: "spring",
                          stiffness: 300
                        }}
                      >
                        <MobileGamingCard
                          rarity={getRarity(index)}
                          title={caixa.nome}
                          subtitle={`R$ ${caixa.preco?.toFixed(2)}`}
                          icon={Crown}
                          level={index === 0 ? "⭐" : "🔥"}
                          stats={index === 0 ? "PREMIUM" : "FEATURED"}
                          onClick={() => handleCaixaClick(caixa)}
                          size="sm"
                          animated={true}
                        />
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Desktop: Cards grandes */}
              <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-8">
                {caixasDestaque.map((caixa, index) => (
                  <GamingCaseCard
                    key={caixa.id}
                    caixa={caixa}
                    onOpenCase={handleCaixaClick}
                    onShowTransparency={handleOpenTransparency}
                    featured={index === 0}
                    animated={true}
                  />
                ))}
              </div>
            </GamingContainer>
          </motion.section>
        )}

        {/* Popular Cases - Gaming Design System */}
        {caixasPopulares.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <GamingContainer
              variant="accent"
              headerTitle="MAIS POPULARES"
              headerSubtitle={`Top ${caixasPopulares.length} caixas mais abertas da comunidade`}
              headerIcon={TrendingUp}
              headerActions={
                <GamingButton
                  variant="outline"
                  size="sm"
                  href="/caixas?sort=popular"
                  arrowAnimation
                >
                  Ver Todas
                </GamingButton>
              }
              borderStyle="glow"
              className="mx-4 md:mx-8"
            >
              {/* Mobile: Cards pequenos */}
              <div className="block md:hidden">
                <div className="grid grid-cols-2 gap-4 justify-items-center">
                  {caixasPopulares.slice(0, 6).map((caixa, index) => {
                    const getRarity = (idx) => {
                      if (idx < 2) return "mythic"
                      if (idx < 4) return "legendary" 
                      return "epic"
                    }

                    return (
                      <motion.div
                        key={caixa.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          delay: index * 0.08,
                          type: "spring",
                          stiffness: 300
                        }}
                      >
                        <MobileGamingCard
                          rarity={getRarity(index)}
                          title={caixa.nome}
                          subtitle={`R$ ${caixa.preco.toFixed(2)}`}
                          icon={Trophy}
                          level={Math.floor(Math.random() * 15) + 5}
                          stats={`#${index + 1}`}
                          onClick={() => handleCaixaClick(caixa)}
                          size="sm"
                          animated={true}
                        />
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Desktop: Cards grandes com thumbs */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {caixasPopulares.slice(0, 8).map((caixa, index) => (
                  <GamingCaseCard
                    key={caixa.id}
                    caixa={caixa}
                    onOpenCase={handleCaixaClick}
                    onShowTransparency={handleOpenTransparency}
                    featured={index < 2} // Top 2 são featured
                    animated={true}
                    className="w-full"
                  />
                ))}
              </div>
              
              {/* Popular Stats */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-purple-300">
                    <Users className="w-4 h-4" />
                    <span className="font-semibold">Comunidade ativa: <span className="text-white font-bold">2.4K+ players</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-300">
                    <Trophy className="w-4 h-4" />
                    <span className="font-semibold">Taxa de satisfação: <span className="text-white font-bold">94%</span></span>
                  </div>
                </div>
              </div>
            </GamingContainer>
          </motion.section>
        )}

        {/* Recent Winners Section */}
        {ultimosGanhadores.length > 0 && (
          <motion.section 
            className="landing-featured-cases"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="landing-title flex items-center gap-3">
                <div className="landing-title-icon">
                  <div className="p-2 bg-green-400/20 rounded-lg">
                    <Trophy className="w-6 h-6 text-green-400" />
                  </div>
                </div>
                <span className="text-2xl font-bold text-white tracking-wide">
                  ÚLTIMOS GANHADORES
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ultimosGanhadores.slice(0, 6).map((ganhador, index) => (
                <motion.div
                  key={index}
                  className="bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white">{ganhador.usuario}</div>
                      <div className="text-sm text-gray-400">{ganhador.item}</div>
                      <div className="text-green-400 font-bold">{formatCurrency(ganhador.valor)}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatTime(ganhador.dataHora)}
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
            <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-2xl flex items-center justify-center">
              <Zap className="w-10 h-10 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-red-300 mb-4">Erro de Conexão</h3>
            <p className="text-red-200 mb-6">Não foi possível carregar as caixas</p>
            <motion.button 
              onClick={refetch} 
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowRight className="w-5 h-5" />
              TENTAR NOVAMENTE
            </motion.button>
          </motion.div>
        )}

        {/* How It Works Section */}
        <HowItWorksLuxDrop />

        {/* Payment Methods Section */}
        <PaymentMethodsLuxDrop />
      </div>

      {/* Horizontal Live Feed - Header Sticky */}
      <HorizontalLiveFeed />

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

export default HomePage