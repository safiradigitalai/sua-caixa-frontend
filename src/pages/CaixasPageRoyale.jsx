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
  List,
  Sparkles,
  Crown,
  Diamond,
  Shuffle
} from 'lucide-react'

// Components
import BoxCardRoyale, { BrutalBoxCard, GlassBoxCard, FeaturedBoxCardRoyale } from '../components/cards/BoxCardRoyale'
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

const CaixasPageRoyale = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRaridade, setSelectedRaridade] = useState('')
  const [selectedFaixaPreco, setSelectedFaixaPreco] = useState('')
  const [sortBy, setSortBy] = useState('popularidade')
  const [viewMode, setViewMode] = useState('grid') // grid, list, brutal
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

  // Opções de filtros com ícones de casino
  const raridadeOptions = [
    { value: '', label: 'Todas as Apostas', icon: Shuffle },
    { value: 'comum', label: 'Bronze', icon: Diamond },
    { value: 'raro', label: 'Prata', icon: Diamond },
    { value: 'epico', label: 'Ouro', icon: Crown },
    { value: 'lendario', label: 'Platina', icon: Crown },
    { value: 'mitico', label: 'Diamante', icon: Sparkles }
  ]

  const faixaPrecoOptions = [
    { value: '', label: 'Todas as Fichas' },
    { value: '0-10', label: 'Iniciante (até R$ 10)' },
    { value: '10-25', label: 'Apostador (R$ 10-25)' },
    { value: '25-50', label: 'Profissional (R$ 25-50)' },
    { value: '50-100', label: 'High Roller (R$ 50-100)' },
    { value: '100+', label: 'VIP (R$ 100+)' }
  ]

  const sortOptions = [
    { value: 'popularidade', label: 'Mais Jogadas', icon: TrendingUp },
    { value: 'preco-asc', label: 'Aposta Baixa', icon: DollarSign },
    { value: 'preco-desc', label: 'Aposta Alta', icon: DollarSign },
    { value: 'recente', label: 'Novas Mesas', icon: Clock }
  ]

  // Processar caixas
  const processedCaixas = useMemo(() => {
    if (!caixas) return []
    return caixas
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
    <div className="min-h-screen bg-casino-noir pb-20 relative">
      {/* Background Casino Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(212, 175, 55, 0.1) 35px, rgba(212, 175, 55, 0.1) 70px),
              repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(255, 16, 240, 0.05) 35px, rgba(255, 16, 240, 0.05) 70px)
            `
          }}
        />
      </div>

      {/* Header Premium Casino */}
      <div className="sticky top-0 z-30 glass-dark border-b border-gold-champagne/20">
        <div className="px-4 py-4">
          {/* Title Section */}
          <div className="mb-4 text-center">
            <motion.h1 
              className="text-4xl font-display uppercase text-metallic-gold tracking-wider mb-1"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              Casino Royale
            </motion.h1>
            <p className="text-sm text-silver-platinum font-serif italic">
              A sorte favorece os ousados
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex gap-3">
            {/* Search Input - Casino Style */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gold-champagne" />
              <input
                type="text"
                placeholder="Buscar mesa..."
                className="w-full pl-10 pr-4 py-3 glass-gold text-white placeholder-gold-champagne/50 font-serif rounded-luxury focus:shadow-gold-glow focus:outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Button - Brutal Style */}
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "p-3 brutal-button rounded-luxury relative",
                showFilters && "shadow-gold-glow"
              )}
              whileTap={{ scale: 0.95 }}
            >
              <SlidersHorizontal className="w-5 h-5 text-casino-noir" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-neon-pink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {activeFiltersCount}
                </span>
              )}
            </motion.button>
          </div>
        </div>

        {/* Filters Panel - Casino Table Style */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gold-champagne/20 casino-table"
            >
              <div className="p-4 space-y-4">
                {/* Raridade Filter */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-gold-shimmer font-display mb-2 block">
                    Nível da Mesa
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {raridadeOptions.slice(0, 4).map((option) => {
                      const Icon = option.icon
                      return (
                        <button
                          key={option.value}
                          onClick={() => setSelectedRaridade(
                            selectedRaridade === option.value ? '' : option.value
                          )}
                          className={cn(
                            "p-2 rounded-luxury border-2 transition-all flex items-center justify-center gap-1",
                            selectedRaridade === option.value
                              ? "glass-gold border-gold-champagne"
                              : "glass-dark border-gold-champagne/20 hover:border-gold-champagne/50"
                          )}
                        >
                          {Icon && <Icon className="w-4 h-4" />}
                          <span className="text-xs font-bold">{option.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-gold-shimmer font-display mb-2 block">
                    Valor da Aposta
                  </label>
                  <select
                    value={selectedFaixaPreco}
                    onChange={(e) => setSelectedFaixaPreco(e.target.value)}
                    className="w-full glass-dark border-2 border-gold-champagne/20 rounded-luxury px-3 py-2 text-white focus:border-gold-champagne focus:outline-none appearance-none cursor-pointer font-serif"
                  >
                    {faixaPrecoOptions.map((option) => (
                      <option key={option.value} value={option.value} className="bg-casino-noir">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Options */}
                <div>
                  <label className="text-xs uppercase tracking-wider text-gold-shimmer font-display mb-2 block">
                    Ordenar Por
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {sortOptions.map((option) => {
                      const Icon = option.icon
                      return (
                        <button
                          key={option.value}
                          onClick={() => setSortBy(option.value)}
                          className={cn(
                            "p-2 rounded-luxury border-2 transition-all flex items-center justify-center gap-1",
                            sortBy === option.value
                              ? "glass-gold border-gold-champagne"
                              : "glass-dark border-gold-champagne/20 hover:border-gold-champagne/50"
                          )}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-xs font-bold">{option.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* View Mode */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "flex-1 py-2 rounded-luxury font-display uppercase tracking-wider",
                      viewMode === 'grid' ? "brutal-button" : "glass-dark border-2 border-gold-champagne/20"
                    )}
                  >
                    <Grid className="w-4 h-4 inline mr-1" />
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('brutal')}
                    className={cn(
                      "flex-1 py-2 rounded-luxury font-display uppercase tracking-wider",
                      viewMode === 'brutal' ? "brutal-button" : "glass-dark border-2 border-gold-champagne/20"
                    )}
                  >
                    <Diamond className="w-4 h-4 inline mr-1" />
                    Brutal
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6">
        {/* Loading State */}
        {loading && (
          <div className="luxury-grid">
            <CaixasGridSkeleton count={6} />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div 
            className="glass-card-neon p-8 rounded-luxury text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-neon-pink text-lg mb-4">Erro ao carregar as mesas</p>
            <button onClick={refetch} className="brutal-button px-6 py-3 rounded-luxury">
              Tentar Novamente
            </button>
          </motion.div>
        )}

        {/* Caixas Grid */}
        {!loading && !error && processedCaixas.length > 0 && (
          <motion.div 
            className={cn(
              viewMode === 'brutal' ? "brutal-grid" : "luxury-grid"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {processedCaixas.map((caixa, index) => {
              const CardComponent = 
                index === 0 ? FeaturedBoxCardRoyale :
                viewMode === 'brutal' ? BrutalBoxCard :
                index % 5 === 0 ? GlassBoxCard :
                BoxCardRoyale

              return (
                <motion.div
                  key={caixa.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <CardComponent
                    caixa={caixa}
                    onTransparency={handleOpenTransparency}
                    onBuy={handleOpenPayment}
                    variant={viewMode === 'brutal' ? 'brutal' : index % 3 === 0 ? 'glass' : 'default'}
                  />
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && processedCaixas.length === 0 && (
          <motion.div 
            className="glass-card p-8 rounded-luxury text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Sparkles className="w-16 h-16 text-gold-champagne mx-auto mb-4" />
            <p className="text-xl font-display uppercase text-gold-gradient mb-2">
              Nenhuma Mesa Disponível
            </p>
            <p className="text-silver-platinum/60 font-serif italic">
              Ajuste os filtros para encontrar sua sorte
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

export default CaixasPageRoyale