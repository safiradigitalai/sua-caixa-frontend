import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  SlidersHorizontal,
  TrendingUp,
  DollarSign,
  Clock,
  Star,
  Crown,
  Zap,
  Users,
  Package,
  Target,
  X,
  Grid,
  List,
  Trophy,
  Eye,
  Shield,
  ArrowRight
} from 'lucide-react'

// Components
import GamingCaseCard from '../components/ui/GamingCaseCard'
import MobileGamingCard from '../components/ui/MobileGamingCard'
import GamingContainer from '../components/ui/GamingContainer'
import GamingButton from '../components/ui/GamingButton'
import HorizontalLiveFeed from '../components/ui/HorizontalLiveFeed'
import { CaixasGridSkeleton } from '../components/ui/LoadingSkeleton'
import TransparencyModal from '../components/modals/TransparencyModal'
import PaymentModal from '../components/modals/PaymentModal'
import CaixaOpeningModal from '../components/modals/CaixaOpeningModal'

// Hooks
import { useApi } from '../hooks/useApi'
import { useNotifications } from '../stores/useAppStore'
import { useDebounce } from '../hooks/useDebounce'

// Utils
import { formatCurrency, cn } from '../lib/utils'

const CaixasPageGaming = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRaridade, setSelectedRaridade] = useState('')
  const [selectedFaixaPreco, setSelectedFaixaPreco] = useState('')
  const [sortBy, setSortBy] = useState('popularidade')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCaixa, setSelectedCaixa] = useState(null)
  const [showTransparency, setShowTransparency] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [showOpening, setShowOpening] = useState(false)
  const [compraId, setCompraId] = useState(null)
  
  const debouncedSearch = useDebounce(searchTerm, 300)
  const { addNotification } = useNotifications()

  // Buscar caixas
  const { data: caixasData, loading, error, refetch } = useApi('/caixas', {
    params: {
      search: debouncedSearch,
      raridade: selectedRaridade,
      faixaPreco: selectedFaixaPreco,
      orderBy: sortBy
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        message: 'Erro ao carregar caixas'
      })
    }
  })

  const { caixas = [], filtros = {} } = caixasData || {}

  // Gaming style options
  const raridadeOptions = [
    { value: '', label: 'All Rarities', icon: Filter, color: 'text-gray-400' },
    { value: 'comum', label: 'Common', icon: Star, color: 'text-slate-400' },
    { value: 'raro', label: 'Rare', icon: Star, color: 'text-blue-400' },
    { value: 'epico', label: 'Epic', icon: Crown, color: 'text-purple-400' },
    { value: 'lendario', label: 'Legendary', icon: Crown, color: 'text-yellow-400' },
    { value: 'mitico', label: 'Mythic', icon: Zap, color: 'text-pink-400' }
  ]

  const faixaPrecoOptions = [
    { value: '', label: 'All Prices', icon: DollarSign },
    { value: '0-25', label: 'Starter (R$ 5-25)', icon: DollarSign },
    { value: '25-50', label: 'Player (R$ 25-50)', icon: DollarSign },
    { value: '50-100', label: 'Pro (R$ 50-100)', icon: DollarSign },
    { value: '100+', label: 'Elite (R$ 100+)', icon: DollarSign }
  ]

  const sortOptions = [
    { value: 'popularidade', label: 'Most Popular', icon: TrendingUp, color: 'text-orange-400' },
    { value: 'preco-asc', label: 'Price: Low to High', icon: DollarSign, color: 'text-green-400' },
    { value: 'preco-desc', label: 'Price: High to Low', icon: DollarSign, color: 'text-red-400' },
    { value: 'recente', label: 'Recently Added', icon: Clock, color: 'text-blue-400' }
  ]

  // Handlers
  const handleOpenTransparency = (caixa) => {
    setSelectedCaixa(caixa)
    setShowTransparency(true)
  }

  const handleOpenPayment = (caixa) => {
    setSelectedCaixa(caixa)
    setShowPayment(true)
  }

  const handlePaymentSuccess = (paymentData) => {
    setCompraId(paymentData.compraId)
    setShowPayment(false)
    setTimeout(() => {
      setShowOpening(true)
    }, 500)
  }

  // Contagem de filtros ativos
  const activeFiltersCount = [selectedRaridade, selectedFaixaPreco]
    .filter(Boolean).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 pb-20 relative overflow-hidden">
      {/* Live Feed Bar */}
      <HorizontalLiveFeed />
      {/* Background Gaming Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Gaming Container Header */}
      <GamingContainer 
        variant="primary" 
        headerTitle="GAMING BOXES" 
        headerSubtitle="Open • Play • Win • Ganhe prêmios épicos!"
        headerIcon={Package}
        className="mx-4 mt-4"
        backgroundPattern={true}
        particles={true}
      >
        <div className="container mx-auto px-0">

          {/* Gaming Search Bar */}
          <div className="flex gap-3 max-w-2xl mx-auto mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type="text"
                placeholder="Search gaming boxes..."
                className="w-full pl-12 pr-4 py-4 bg-black/40 backdrop-blur-xl border-2 border-white/20 hover:border-white/40 focus:border-blue-400/60 rounded-2xl text-white placeholder-white/60 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/30 shadow-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              {/* Gaming Corner Accents */}
              <div className="absolute top-3 right-3 w-6 h-6 opacity-40">
                <div className="w-full h-full border-2 border-white/60 border-l-0 border-b-0 rounded-tr-xl" />
              </div>
            </div>

            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gradient-to-br from-blue-600 to-purple-700 border-2 border-blue-400/40 rounded-2xl px-6 py-4 relative transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30 backdrop-blur-xl"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <SlidersHorizontal className="w-5 h-5 text-white" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs rounded-full w-6 h-6 flex items-center justify-center font-black border-2 border-white/30">
                  {activeFiltersCount}
                </span>
              )}
            </motion.button>
          </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/10 bg-black/20 backdrop-blur-sm"
            >
              <div className="container-gaming py-4 space-y-4">
                {/* Rarity Filter */}
                <div>
                  <label className="text-sm font-semibold text-gray-300 mb-2 block">
                    Rarity Level
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {raridadeOptions.map((option) => {
                      const Icon = option.icon
                      return (
                        <motion.button
                          key={option.value}
                          onClick={() => setSelectedRaridade(
                            selectedRaridade === option.value ? '' : option.value
                          )}
                          className={cn(
                            "p-3 rounded-lg border transition-all duration-200 flex flex-col items-center gap-1 text-xs font-medium",
                            selectedRaridade === option.value
                              ? "bg-blue-500/20 border-blue-400/50 text-blue-300"
                              : "bg-black/20 border-white/10 text-gray-400 hover:bg-black/30 hover:border-white/20"
                          )}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{option.label}</span>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                {/* Price Range & Sort */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-300 mb-2 block">
                      Price Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {faixaPrecoOptions.map((option) => {
                        const Icon = option.icon
                        return (
                          <motion.button
                            key={option.value}
                            onClick={() => setSelectedFaixaPreco(
                              selectedFaixaPreco === option.value ? '' : option.value
                            )}
                            className={cn(
                              "p-2 rounded-lg border transition-all duration-200 flex items-center gap-2 text-xs font-medium",
                              selectedFaixaPreco === option.value
                                ? "bg-green-500/20 border-green-400/50 text-green-300"
                                : "bg-black/20 border-white/10 text-gray-400 hover:bg-black/30 hover:border-white/20"
                            )}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{option.label}</span>
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-300 mb-2 block">
                      Sort By
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {sortOptions.map((option) => {
                        const Icon = option.icon
                        return (
                          <motion.button
                            key={option.value}
                            onClick={() => setSortBy(option.value)}
                            className={cn(
                              "p-2 rounded-lg border transition-all duration-200 flex items-center gap-2 text-xs font-medium",
                              sortBy === option.value
                                ? "bg-purple-500/20 border-purple-400/50 text-purple-300"
                                : "bg-black/20 border-white/10 text-gray-400 hover:bg-black/30 hover:border-white/20"
                            )}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{option.label}</span>
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <div className="container-gaming py-8">
        {/* Loading State */}
        {loading && (
          <div className="grid-responsive-cards">
            <CaixasGridSkeleton count={6} />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div 
            className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center max-w-md mx-auto backdrop-blur-gaming shadow-gaming"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Zap className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-300 mb-2">Connection Error</h3>
            <p className="text-red-200 mb-4">Failed to load boxes</p>
            <motion.button 
              onClick={refetch} 
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-gaming hover:shadow-gaming-hover"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
          </motion.div>
        )}

          {/* Gaming Cards Grid */}
          {!loading && !error && caixas.length > 0 && (
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {caixas.map((caixa, index) => (
                <motion.div
                  key={caixa.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                >
                  {/* Mobile: Cards compactos gaming */}
                  <div className="block md:hidden">
                    <MobileGamingCard
                      rarity={caixa.preco >= 100 ? 'mythic' : caixa.preco >= 50 ? 'legendary' : caixa.preco >= 25 ? 'epic' : 'rare'}
                      title={caixa.nome}
                      subtitle={`R$ ${caixa.preco?.toFixed(2)}`}
                      icon={Crown}
                      level={index < 3 ? "🔥" : "⭐"}
                      stats={index < 3 ? "HOT" : "POPULAR"}
                      onClick={() => handleOpenPayment(caixa)}
                      size="sm"
                      animated={true}
                    />
                  </div>

                  {/* Desktop: Cards grandes gaming */}
                  <div className="hidden md:block">
                    <GamingCaseCard
                      caixa={caixa}
                      onShowTransparency={handleOpenTransparency}
                      onOpenCase={handleOpenPayment}
                      featured={index < 3}
                      className="h-full"
                      animated={true}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

        {/* Empty State */}
        {!loading && !error && caixas.length === 0 && (
          <motion.div 
            className="text-center py-16 max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center backdrop-blur-gaming">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-300 mb-2">No Boxes Found</h3>
            <p className="text-gray-400">
              Try adjusting your filters to find more boxes
            </p>
          </motion.div>
        )}
        </div>
      </GamingContainer>

      {/* Modals */}
      <AnimatePresence>
        {showTransparency && (
          <TransparencyModal
            isOpen={showTransparency}
            onClose={() => setShowTransparency(false)}
            caixa={selectedCaixa}
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
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default CaixasPageGaming