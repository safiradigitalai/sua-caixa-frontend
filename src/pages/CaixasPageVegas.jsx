import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  SlidersHorizontal,
  X,
  TrendingUp,
  DollarSign,
  Clock,
  Grid,
  Zap,
  Sparkles,
  Crown,
  Diamond,
  Shuffle,
  Target,
  Star,
  Dice1,
  Dice6
} from 'lucide-react'

// Import casino icons for professional look
import {
  CasinoChip,
  CasinoDice,
  CasinoRoulette,
  RarityCommon,
  RarityRare,
  RarityEpic,
  RarityLegendary,
  RarityMythic
} from '../components/ui/CasinoIcons'

// Components
import BoxCardVegasRefined, { 
  BoxCardVegasPinkRefined, 
  BoxCardVegasLimeRefined, 
  BoxCardVegasCyanRefined, 
  BoxCardVegasGoldRefined,
  FeaturedBoxCardVegasRefined
} from '../components/cards/BoxCardVegasRefined'
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

const CaixasPageVegas = () => {
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
        message: 'ERRO AO CARREGAR MESAS!'
      })
    }
  })

  const { caixas = [], filtros = {} } = caixasData || {}

  // Opções Vegas style - with professional casino icons
  const raridadeOptions = [
    { value: '', label: 'ALL TABLES', icon: CasinoRoulette, color: 'vegas-white' },
    { value: 'comum', label: 'BRONZE', icon: RarityCommon, color: 'vegas-white' },
    { value: 'raro', label: 'SILVER', icon: RarityRare, color: 'neon-cyan' },
    { value: 'epico', label: 'GOLD', icon: RarityEpic, color: 'neon-purple' },
    { value: 'lendario', label: 'PLATINUM', icon: RarityLegendary, color: 'vegas-gold' },
    { value: 'mitico', label: 'DIAMOND', icon: RarityMythic, color: 'neon-pink' }
  ]

  const faixaPrecoOptions = [
    { value: '', label: 'ALL STAKES', icon: CasinoChip },
    { value: '0-10', label: 'ROOKIE ($5-10)', icon: CasinoChip },
    { value: '10-25', label: 'PLAYER ($10-25)', icon: CasinoChip },
    { value: '25-50', label: 'PRO ($25-50)', icon: CasinoDice },
    { value: '50-100', label: 'HIGH ROLLER ($50-100)', icon: CasinoDice },
    { value: '100+', label: 'VIP ($100+)', icon: CasinoDice }
  ]

  const sortOptions = [
    { value: 'popularidade', label: 'HOT TABLES', icon: TrendingUp, color: 'neon-orange' },
    { value: 'preco-asc', label: 'LOW STAKES', icon: DollarSign, color: 'neon-lime' },
    { value: 'preco-desc', label: 'HIGH STAKES', icon: DollarSign, color: 'neon-pink' },
    { value: 'recente', label: 'NEW GAMES', icon: Clock, color: 'neon-cyan' }
  ]

  // Processar caixas com variants coloridos
  const processedCaixas = useMemo(() => {
    if (!caixas) return []
    return caixas.map((caixa, index) => ({
      ...caixa,
      variant: ['pink', 'lime', 'cyan', 'gold'][index % 4]
    }))
  }, [caixas])

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
    <div className="min-h-screen bg-brutal-black pb-20 relative">
      {/* Header VEGAS BRUTAL */}
      <div className="sticky top-0 z-30 bg-brutal-black border-b-brutal border-neon-pink shadow-neon-pink">
        <div className="px-brutal-3 py-brutal-3">
          {/* Title Section - EXPLOSIVE */}
          <div className="mb-brutal-3 text-center relative">
            <motion.h1 
              className="text-vegas-title mb-brutal-1"
              initial={{ y: -50, opacity: 0, rotate: -5 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              VEGAS BRUTALIST
            </motion.h1>
            <motion.p 
              className="text-vegas-subtitle"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              HIGH STAKES • HIGH REWARDS • HIGH VOLTAGE
            </motion.p>
            
            {/* Decorative Elements */}
            <div className="absolute -top-2 -left-2 w-8 h-8 bg-neon-pink transform rotate-45" />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-neon-lime transform rotate-45" />
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-neon-cyan rotate-45" />
          </div>

          {/* Search and Filter Bar - BRUTAL STYLE */}
          <div className="flex gap-brutal-2">
            <div className="relative flex-1">
              <Search className="absolute left-brutal-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neon-lime" />
              <input
                type="text"
                placeholder="SEARCH TABLE..."
                className="w-full pl-12 pr-brutal-3 py-brutal-2 bg-brutal-black border-brutal border-neon-lime text-neon-lime placeholder-neon-lime/50 font-brutalist text-lg uppercase tracking-wider focus:border-neon-pink focus:text-neon-pink focus:placeholder-neon-pink/50 focus:outline-none focus:shadow-neon-pink transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gradient-brutal-fire border-brutal border-brutal-white px-brutal-3 py-brutal-2 relative overflow-hidden hover:scale-105 active:scale-95 transition-transform"
              whileHover={{ rotate: [0, -5, 5, 0] }}
              whileTap={{ scale: 0.95 }}
            >
              <SlidersHorizontal className="w-6 h-6 text-brutal-white" />
              {activeFiltersCount > 0 && (
                <motion.span 
                  className="absolute -top-2 -right-2 bg-neon-pink text-brutal-black text-sm font-brutalist rounded-full w-6 h-6 flex items-center justify-center border-2 border-brutal-white animate-neon-glow"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  {activeFiltersCount}
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>

        {/* Filters Panel - VEGAS TABLE */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t-brutal border-neon-cyan bg-gradient-brutal-ice"
            >
              <div className="p-brutal-3 space-y-brutal-3">
                {/* Raridade Filter - CHIPS STYLE */}
                <div>
                  <label className="text-lg font-brutalist uppercase text-brutal-black mb-brutal-2 block tracking-wider">
                    TABLE LEVEL
                  </label>
                  <div className="grid grid-cols-3 gap-brutal-2">
                    {raridadeOptions.slice(0, 6).map((option) => {
                      const Icon = option.icon
                      return (
                        <motion.button
                          key={option.value}
                          onClick={() => setSelectedRaridade(
                            selectedRaridade === option.value ? '' : option.value
                          )}
                          className={cn(
                            "p-brutal-2 border-brutal transition-all flex items-center justify-center gap-1 font-brutalist uppercase text-xs",
                            selectedRaridade === option.value
                              ? "bg-gradient-neon-pink border-brutal-white text-brutal-white shadow-neon-pink"
                              : "bg-brutal-black border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-brutal-black"
                          )}
                          whileHover={{ scale: 1.05, rotate: [-1, 1, -1, 0] }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{option.label}</span>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                {/* Price Range - DICE STYLE */}
                <div>
                  <label className="text-lg font-brutalist uppercase text-brutal-black mb-brutal-2 block tracking-wider">
                    BET SIZE
                  </label>
                  <div className="grid grid-cols-2 gap-brutal-2">
                    {faixaPrecoOptions.map((option) => {
                      const Icon = option.icon
                      return (
                        <motion.button
                          key={option.value}
                          onClick={() => setSelectedFaixaPreco(
                            selectedFaixaPreco === option.value ? '' : option.value
                          )}
                          className={cn(
                            "p-brutal-2 border-brutal transition-all flex items-center gap-2 font-brutalist uppercase text-xs",
                            selectedFaixaPreco === option.value
                              ? "bg-gradient-vegas-gold border-brutal-black text-brutal-black shadow-vegas-gold"
                              : "bg-brutal-black border-vegas-gold text-vegas-gold hover:bg-vegas-gold hover:text-brutal-black"
                          )}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-left">{option.label}</span>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                {/* Sort Options - NEON STYLE */}
                <div>
                  <label className="text-lg font-brutalist uppercase text-brutal-black mb-brutal-2 block tracking-wider">
                    SORT BY
                  </label>
                  <div className="grid grid-cols-2 gap-brutal-2">
                    {sortOptions.map((option) => {
                      const Icon = option.icon
                      return (
                        <motion.button
                          key={option.value}
                          onClick={() => setSortBy(option.value)}
                          className={cn(
                            "p-brutal-2 border-brutal transition-all flex items-center justify-center gap-2 font-brutalist uppercase text-xs",
                            sortBy === option.value
                              ? `bg-gradient-neon-cyber border-brutal-white text-brutal-white shadow-neon-purple`
                              : "bg-brutal-black border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-brutal-black"
                          )}
                          whileHover={{ scale: 1.05, rotate: [0, 2, -2, 0] }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{option.label}</span>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <div className="px-brutal-3 py-brutal-4">
        {/* Loading State */}
        {loading && (
          <div className="grid-vegas-brutal">
            <CaixasGridSkeleton count={6} />
          </div>
        )}

        {/* Error State - VEGAS STYLE */}
        {error && !loading && (
          <motion.div 
            className="bg-gradient-brutal-fire p-brutal-4 border-brutal border-neon-red text-center"
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Zap className="w-16 h-16 text-brutal-white mx-auto mb-brutal-2 animate-neon-flicker" />
            <p className="text-vegas-title text-brutal-white mb-brutal-2">SYSTEM ERROR!</p>
            <p className="text-lg font-brutalist text-brutal-white mb-brutal-3 uppercase">FAILED TO LOAD TABLES</p>
            <motion.button 
              onClick={refetch} 
              className="btn-vegas-primary"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Zap className="w-5 h-5" />
              RETRY CONNECTION
            </motion.button>
          </motion.div>
        )}

        {/* Caixas Grid - VEGAS BRUTAL */}
        {!loading && !error && processedCaixas.length > 0 && (
          <motion.div 
            className="grid-vegas-brutal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {processedCaixas.map((caixa, index) => {
              // Escolher componente baseado na posição
              const CardComponent = 
                index === 0 ? FeaturedBoxCardVegasRefined :
                index % 4 === 0 ? BoxCardVegasPinkRefined :
                index % 4 === 1 ? BoxCardVegasLimeRefined :
                index % 4 === 2 ? BoxCardVegasCyanRefined :
                BoxCardVegasGoldRefined

              return (
                <motion.div
                  key={caixa.id}
                  initial={{ opacity: 0, y: 50, rotate: Math.random() * 10 - 5 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ 
                    delay: index * 0.08,
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                >
                  <CardComponent
                    caixa={caixa}
                    onTransparency={handleOpenTransparency}
                    onBuy={handleOpenPayment}
                    variant={caixa.variant}
                  />
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* Empty State - VEGAS STYLE */}
        {!loading && !error && processedCaixas.length === 0 && (
          <motion.div 
            className="bg-gradient-vegas-royal p-brutal-5 border-brutal border-vegas-gold text-center transform rotate-1 hover:rotate-0 transition-transform"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Sparkles className="w-20 h-20 text-vegas-gold mx-auto mb-brutal-3 animate-vegas-spin" />
            <p className="text-vegas-title text-vegas-gold mb-brutal-2">NO TABLES FOUND!</p>
            <p className="text-lg font-brutalist text-vegas-white uppercase tracking-wider">
              ADJUST FILTERS TO FIND YOUR GAME
            </p>
          </motion.div>
        )}
      </div>

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

export default CaixasPageVegas