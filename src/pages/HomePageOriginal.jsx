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
  User
} from 'lucide-react'

// Components
import BoxCardGaming from '../components/cards/BoxCardGaming'
import { CompactItemCard } from '../components/cards/ItemCard'
import { CaixasGridSkeleton, GanhadorSkeleton, LoadingSpinner } from '../components/ui/LoadingSkeleton'
import TransparencyModal from '../components/modals/TransparencyModal'
import PaymentModal from '../components/modals/PaymentModal'
import CaixaOpeningModal from '../components/modals/CaixaOpeningModal'

// Hooks
import { useApi } from '../hooks/useApi'
import { useUser, useNotifications } from '../stores/useAppStore'

// Utils
import { formatCurrency, formatTime, cn } from '../lib/utils'

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
    // Usar primeira caixa real disponível ou criar demo
    const primeiraCaixa = caixasPopulares?.[0] || caixasDestaque?.[0]
    
    if (primeiraCaixa) {
      // Usar caixa real do banco
      const demoCompraId = `demo-compra-${Date.now()}`
      
      setSelectedCaixa(primeiraCaixa)
      setCompraId(demoCompraId)
      setShowOpening(true)
      
      addNotification({
        type: 'success',
        title: `🎁 ${primeiraCaixa.nome} Preparada!`,
        message: 'Dados reais do Supabase - Clique em "Abrir Caixa"'
      })
    } else {
      // Fallback se não houver caixas
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
      
      addNotification({
        type: 'info',
        title: '🎁 Caixa Demo Preparada!',
        message: 'Usando dados de fallback'
      })
    }
  }

  const handlePaymentSuccess = (data) => {
    setShowPayment(false)
    setCompraId(data.compraId)
    setShowOpening(true)
  }

  const handleOpenTransparency = (caixaOrCompraId) => {
    if (typeof caixaOrCompraId === 'string') {
      // É um compraId
      setCompraId(caixaOrCompraId)
    } else {
      // É uma caixa
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
      <div className="min-h-screen">
        <div className="container-gaming py-8 space-y-8">
          {/* Header Skeleton */}
          <div className="text-center space-y-4">
            <div className="skeleton h-8 w-48 mx-auto" />
            <div className="skeleton h-4 w-64 mx-auto" />
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="bg-black/20 backdrop-blur-gaming rounded-2xl p-4 text-center border border-white/10">
                <div className="skeleton h-6 w-12 mx-auto mb-2" />
                <div className="skeleton h-4 w-16 mx-auto" />
              </div>
            ))}
          </div>

          {/* Caixas Skeleton */}
          <CaixasGridSkeleton count={6} featured={2} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container-gaming py-8 space-y-8">
        {/* Hero Section */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header com botão de login */}
          <div className="relative">
            {!user && (
              <div className="absolute top-0 right-0">
                <Link
                  to="/login"
                  className="bg-slate-800/60 hover:bg-slate-700/80 border border-slate-600/50 hover:border-slate-500 backdrop-blur-sm p-2 rounded-lg flex items-center gap-2 text-sm transition-all"
                  aria-label="Fazer Login"
                >
                  <User className="w-4 h-4 text-slate-300" />
                  <span className="text-slate-300 font-medium">Login</span>
                </Link>
              </div>
            )}
            
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">
                Sua Caixa
              </h1>
              <Sparkles className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          
          <p className="text-gray-300 text-base leading-relaxed max-w-sm mx-auto">
            Descubra prêmios incríveis em nossas caixas misteriosas.
            <br />
            <span className="text-blue-400 font-medium">100% transparente</span> e 
            <span className="text-green-400 font-medium"> verificável</span>!
          </p>

          {user && (
            <motion.div
              className="inline-flex items-center gap-2 card-gaming-base rounded-full px-6 py-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-sm text-gray-300">Saldo:</span>
              <span className="text-lg font-bold text-blue-400">
                {formatCurrency(user.saldo || 0)}
              </span>
            </motion.div>
          )}

          {/* Call to Action Clean para usuários não logados */}
          {!user && (
            <motion.div
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-semibold text-lg py-3 px-6 rounded-xl border border-cyan-500/30 shadow-lg transition-all"
              >
                <User className="w-5 h-5" />
                Faça Login e Ganhe Prêmios
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Demo Quick Action - Only if logged in */}
        {user?.isDemo && (
          <motion.section
            className="card-gaming-base rounded-2xl p-6 text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-2 right-2 text-blue-400/30 text-6xl">🎁</div>
              <div className="absolute bottom-2 left-2 text-purple-400/20 text-4xl">✨</div>
            </div>
            
            <div className="relative z-10">
              <motion.div
                className="flex items-center justify-center gap-2 mb-3"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Gift className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold text-blue-400">
                  Modo Demonstração
                </h3>
                <Gift className="w-6 h-6 text-blue-400" />
              </motion.div>
              <p className="text-gray-300 text-sm mb-6">
                Experimente nossa plataforma com uma caixa de demonstração gratuita!
              </p>
              <motion.button
                onClick={() => handleQuickDemo()}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-black text-xl py-4 rounded-2xl uppercase tracking-wider border-4 border-purple-400 shadow-lg transition-all relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <div className="relative flex items-center justify-center gap-3">
                  <Gift className="w-6 h-6" />
                  TESTAR CAIXA DEMO
                </div>
              </motion.button>
            </div>
          </motion.section>
        )}

        {/* Estatísticas */}
        {estatisticas && Object.keys(estatisticas).length > 0 && (
          <motion.div
            className="grid grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-black/20 backdrop-blur-gaming rounded-2xl p-4 text-center border border-white/10 shadow-gaming hover:shadow-gaming-hover transition-all duration-200">
              <div className="text-xl font-bold text-gradient-gaming mb-1">
                {estatisticas.totalCaixas || 0}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                Caixas Ativas
              </div>
            </div>
            
            <div className="bg-black/20 backdrop-blur-gaming rounded-2xl p-4 text-center border border-white/10 shadow-gaming hover:shadow-gaming-hover transition-all duration-200">
              <div className="text-xl font-bold text-green-400 mb-1">
                {formatCurrency(estatisticas.valorTotal || 0)}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                em Prêmios
              </div>
            </div>
            
            <div className="bg-black/20 backdrop-blur-gaming rounded-2xl p-4 text-center border border-white/10 shadow-gaming hover:shadow-gaming-hover transition-all duration-200">
              <div className="text-xl font-bold text-blue-400 mb-1">
                {estatisticas.totalUsuarios || 0}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                Usuários Ativos
              </div>
            </div>
          </motion.div>
        )}

        {/* Caixas em Destaque */}
        {caixasDestaque.length > 0 && (
          <motion.section
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-bold text-white">
                  Caixas em Destaque
                </h2>
              </div>
            </div>

            {/* Scroll horizontal para mobile, grid para desktop */}
            <div className="scroll-horizontal md:grid-responsive-cards">
              {caixasDestaque.map((caixa, index) => (
                <BoxCardGaming
                  key={caixa.id}
                  caixa={caixa}
                  featured={index < 2}
                  onBuy={() => handleCaixaClick(caixa)}
                  onTransparency={() => handleOpenTransparency(caixa)}
                  className="md:flex-shrink-1" // Para desktop grid funcionar
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Caixas Populares */}
        {caixasPopulares.length > 0 && (
          <motion.section
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-bold text-white">
                  Mais Populares
                </h2>
              </div>
              
              <motion.button 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold py-2 px-4 rounded-xl uppercase tracking-wider border-2 border-blue-400 transition-all flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ver todas
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Scroll horizontal para mobile, grid para desktop */}
            <div className="scroll-horizontal md:grid-responsive-cards">
              {caixasPopulares.map((caixa) => (
                <BoxCardGaming
                  key={caixa.id}
                  caixa={caixa}
                  onBuy={() => handleCaixaClick(caixa)}
                  onTransparency={() => handleOpenTransparency(caixa)}
                  className="md:flex-shrink-1" // Para desktop grid funcionar
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Últimos Ganhadores */}
        {ultimosGanhadores.length > 0 && (
          <motion.section
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-green-success" />
              <h2 className="text-lg font-bold text-white">
                Últimos Ganhadores
              </h2>
            </div>

            <div className="space-y-3">
              {ultimosGanhadores.slice(0, 5).map((ganhador) => (
                <motion.div
                  key={`${ganhador.usuarioId}-${ganhador.itemId}-${ganhador.timestamp}`}
                  className="flex items-center gap-3 p-3 bg-black/20 backdrop-blur-gaming rounded-xl border border-white/10 shadow-gaming"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-white">
                      {ganhador.usuarioNome?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {ganhador.usuarioNome || 'Usuário'}
                    </p>
                    <p className="text-xs text-gray-300 truncate">
                      ganhou <span className="font-medium">{ganhador.itemNome}</span>
                    </p>
                  </div>

                  {/* Value & Time */}
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-green-400">
                      {formatCurrency(ganhador.itemValor)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatTime(ganhador.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Call to Action */}
        <motion.div
          className="card-gaming-base rounded-2xl p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Eye className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white">
              Sistema Provably Fair
            </h3>
          </div>
          
          <p className="text-sm text-gray-300 mb-4 leading-relaxed">
            Cada caixa pode ser verificada matematicamente.<br />
            Transparência total, resultados 100% justos.
          </p>
          
          <motion.button 
            onClick={() => handleOpenTransparency(caixasDestaque[0] || caixasPopulares[0])}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-3 px-6 rounded-xl uppercase tracking-wider border-2 border-green-400 transition-all flex items-center justify-center gap-2"
            disabled={!caixasDestaque[0] && !caixasPopulares[0]}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Eye className="w-5 h-5" />
            VER TRANSPARÊNCIA
          </motion.button>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-red-400 mb-4">
              Erro ao carregar dados da página inicial
            </p>
            <motion.button
              onClick={() => refetch()}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-bold py-3 px-6 rounded-xl uppercase tracking-wider border-2 border-red-400 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              TENTAR NOVAMENTE
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <TransparencyModal
        isOpen={showTransparency}
        onClose={closeAllModals}
        caixaId={selectedCaixa?.id}
        caixaNome={selectedCaixa?.nome}
        compraId={compraId}
      />

      <PaymentModal
        isOpen={showPayment}
        onClose={closeAllModals}
        caixa={selectedCaixa}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <CaixaOpeningModal
        isOpen={showOpening}
        onClose={closeAllModals}
        caixa={selectedCaixa}
        compraId={compraId}
        onOpenTransparency={handleOpenTransparency}
      />
    </div>
  )
}

export default HomePage