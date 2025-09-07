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
  Package,
  Trophy,
  Zap,
  Target,
  Star,
  Crown
} from 'lucide-react'

// Components
// import BoxCard from '../components/cards/BoxCard'
import GamingCaseCard from '../components/ui/GamingCaseCard'
import { CaixasGridSkeleton } from '../components/ui/LoadingSkeleton'
import TransparencyModal from '../components/modals/TransparencyModal'
import PaymentModal from '../components/modals/PaymentModal'
import CaixaOpeningModal from '../components/modals/CaixaOpeningModal'
import RaridadeBadge from '../components/ui/RaridadeBadge'
import GamingContainer from '../components/ui/GamingContainer'
import GamingButton from '../components/ui/GamingButton'

// Hooks
import { useApi } from '../hooks/useApi'
import { useNotifications } from '../stores/useAppStore'
import { useDebounce } from '../hooks/useDebounce'

// Utils
import { formatCurrency, cn } from '../lib/utils'

const CaixasPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRaridade, setSelectedRaridade] = useState('')
  const [selectedFaixaPreco, setSelectedFaixaPreco] = useState('')
  const [sortBy, setSortBy] = useState('popularidade') // popularidade, preco-asc, preco-desc, recente
  const [viewMode, setViewMode] = useState('grid') // grid, list
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

  // Opções de filtros
  const raridadeOptions = [
    { value: '', label: 'Todas as raridades' },
    { value: 'comum', label: 'Comum' },
    { value: 'raro', label: 'Raro' },
    { value: 'epico', label: 'Épico' },
    { value: 'lendario', label: 'Lendário' },
    { value: 'mitico', label: 'Mítico' }
  ]

  const faixaPrecoOptions = [
    { value: '', label: 'Todos os preços' },
    { value: '0-10', label: 'Até R$ 10' },
    { value: '10-25', label: 'R$ 10 - R$ 25' },
    { value: '25-50', label: 'R$ 25 - R$ 50' },
    { value: '50-100', label: 'R$ 50 - R$ 100' },
    { value: '100+', label: 'Acima de R$ 100' }
  ]

  const sortOptions = [
    { value: 'popularidade', label: 'Mais Populares', icon: TrendingUp },
    { value: 'preco-asc', label: 'Menor Preço', icon: DollarSign },
    { value: 'preco-desc', label: 'Maior Preço', icon: DollarSign },
    { value: 'recente', label: 'Mais Recentes', icon: Clock }
  ]

  // Caixas filtradas e ordenadas (client-side como fallback)
  const processedCaixas = useMemo(() => {
    if (!caixas) return []
    
    let filtered = [...caixas]
    
    // Filtro de busca (se não foi feito no servidor)
    if (searchTerm && !debouncedSearch) {
      filtered = filtered.filter(caixa => 
        caixa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caixa.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    return filtered
  }, [caixas, searchTerm, debouncedSearch])

  // Handlers
  const handleCaixaClick = (caixa) => {
    setSelectedCaixa(caixa)
    setShowPayment(true)
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

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedRaridade('')
    setSelectedFaixaPreco('')
    setSortBy('popularidade')
  }

  const activeFiltersCount = [selectedRaridade, selectedFaixaPreco, searchTerm].filter(Boolean).length

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gaming Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, #22b5ff 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Gaming Header Section */}
        <GamingContainer 
          variant="primary" 
          headerTitle="GAMING BOXES" 
          headerSubtitle={`${processedCaixas.length} caixas épicas disponíveis • Open • Play • Win • UPDATED!`}
          headerIcon={Package}
          className="mx-4 mt-4"
          backgroundPattern={true}
          particles={true}
        >
          {/* Gaming Stats Row */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Total Boxes */}
            <motion.div
              className="bg-gradient-to-br from-blue-500/20 to-blue-700/30 border-2 border-blue-400/60 rounded-2xl p-4 text-center shadow-lg shadow-blue-500/20"
              whileHover={{ scale: 1.05 }}
            >
              <Package className="w-6 h-6 text-blue-300 mx-auto mb-2" />
              <div className="text-lg font-black text-white">{processedCaixas.length}</div>
              <div className="text-xs text-blue-200 uppercase tracking-wide">CAIXAS</div>
            </motion.div>

            {/* Active Players */}
            <motion.div
              className="bg-gradient-to-br from-emerald-500/20 to-emerald-700/30 border-2 border-emerald-400/60 rounded-2xl p-4 text-center shadow-lg shadow-emerald-500/20"
              whileHover={{ scale: 1.05 }}
            >
              <Trophy className="w-6 h-6 text-emerald-300 mx-auto mb-2" />
              <div className="text-lg font-black text-white">2.4K</div>
              <div className="text-xs text-emerald-200 uppercase tracking-wide">PLAYERS</div>
            </motion.div>

            {/* Win Rate */}
            <motion.div
              className="bg-gradient-to-br from-yellow-500/20 to-orange-600/30 border-2 border-yellow-400/60 rounded-2xl p-4 text-center shadow-lg shadow-yellow-500/20"
              whileHover={{ scale: 1.05 }}
            >
              <Target className="w-6 h-6 text-yellow-300 mx-auto mb-2" />
              <div className="text-lg font-black text-white">87%</div>
              <div className="text-xs text-yellow-200 uppercase tracking-wide">WIN RATE</div>
            </motion.div>

            {/* Drops Today */}
            <motion.div
              className="bg-gradient-to-br from-purple-500/20 to-purple-700/30 border-2 border-purple-400/60 rounded-2xl p-4 text-center shadow-lg shadow-purple-500/20"
              whileHover={{ scale: 1.05 }}
            >
              <Zap className="w-6 h-6 text-purple-300 mx-auto mb-2" />
              <div className="text-lg font-black text-white">156</div>
              <div className="text-xs text-purple-200 uppercase tracking-wide">DROPS</div>
            </motion.div>
          </motion.div>

          {/* Gaming Search & Controls */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Gaming Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
              <input
                type="text"
                placeholder="Search gaming boxes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 border-2 border-blue-400/30 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-blue-200/60 font-medium focus:border-blue-400 focus:outline-none transition-all duration-300 backdrop-blur-sm shadow-lg shadow-blue-500/10"
              />
              {/* Gaming Input Accent */}
              <div className="absolute top-2 right-2 w-8 h-8 opacity-30">
                <div className="w-full h-full border-2 border-blue-300/60 border-l-0 border-b-0 rounded-tr-xl" />
              </div>
            </div>

            {/* Gaming Controls Row */}
            <div className="flex items-center justify-between gap-4">
              {/* Gaming Filters Button */}
              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "relative overflow-hidden flex items-center gap-3 px-6 py-3 rounded-2xl border-2 transition-all duration-300 font-black uppercase tracking-wide text-sm",
                  showFilters 
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 border-yellow-400/60 text-white shadow-lg shadow-yellow-500/20"
                    : "bg-black/40 border-white/20 text-white hover:border-white/40 backdrop-blur-sm"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Filter className="w-4 h-4" />
                FILTROS
                {activeFiltersCount > 0 && (
                  <span className="bg-white text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-black">
                    {activeFiltersCount}
                  </span>
                )}
                {/* Gaming Light Sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
              </motion.button>

              {/* Gaming View & Sort Controls */}
              <div className="flex items-center gap-3">
                {/* Gaming View Mode Toggle */}
                <div className="flex bg-black/40 border-2 border-white/20 rounded-2xl overflow-hidden backdrop-blur-sm">
                  <motion.button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "p-3 transition-all duration-300",
                      viewMode === 'grid'
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Grid className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "p-3 transition-all duration-300",
                      viewMode === 'list'
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <List className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Gaming Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-black/40 border-2 border-white/20 rounded-2xl px-4 py-3 text-white text-sm font-medium focus:border-blue-400 focus:outline-none appearance-none cursor-pointer backdrop-blur-sm shadow-lg"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-gray-900">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

        </GamingContainer>

        {/* Gaming Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="mx-4 mb-8"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            >
              <div className="relative bg-gradient-to-br from-purple-900/80 to-blue-900/80 backdrop-blur-xl border-2 border-purple-400/30 rounded-3xl p-6 shadow-2xl shadow-purple-500/20 overflow-hidden">
                {/* Gaming Background Pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                  <div 
                    className="w-full h-full"
                    style={{
                      backgroundImage: 'radial-gradient(circle at 25% 25%, #a855f7 1px, transparent 1px)',
                      backgroundSize: '30px 30px'
                    }}
                  />
                </div>

                <div className="relative z-10 space-y-6">
                  {/* Gaming Filters Header */}
                  <div className="flex items-center justify-between">
                    <motion.div 
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-2xl border border-white/20 shadow-lg">
                        <SlidersHorizontal className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-black text-white uppercase tracking-wide">FILTROS GAMING</h3>
                    </motion.div>

                    {activeFiltersCount > 0 && (
                      <motion.button
                        onClick={clearFilters}
                        className="flex items-center gap-2 bg-red-500/20 text-red-300 px-4 py-2 rounded-2xl border border-red-400/40 font-black uppercase text-sm tracking-wide hover:bg-red-500/30 transition-all duration-300 shadow-lg shadow-red-500/20"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <X className="w-4 h-4" />
                        LIMPAR ({activeFiltersCount})
                      </motion.button>
                    )}
                  </div>

                  {/* Gaming Raridade Filters */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h4 className="text-white font-black uppercase tracking-wide text-sm mb-4 flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      RARIDADE
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                      {raridadeOptions.map((option, index) => (
                        <motion.button
                          key={option.value}
                          onClick={() => setSelectedRaridade(option.value)}
                          className={cn(
                            "relative overflow-hidden p-3 text-xs rounded-2xl border-2 transition-all duration-300 text-center font-black uppercase tracking-wide group",
                            selectedRaridade === option.value
                              ? "bg-gradient-to-br from-yellow-500 to-orange-500 border-yellow-400/60 text-white shadow-lg shadow-yellow-500/30"
                              : "bg-black/40 border-white/20 text-white hover:border-white/40 hover:bg-white/10 backdrop-blur-sm"
                          )}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + index * 0.05, type: "spring", stiffness: 400 }}
                        >
                          {option.value ? (
                            <RaridadeBadge raridade={option.value} size="sm" />
                          ) : (
                            option.label
                          )}
                          
                          {/* Gaming Light Sweep */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Gaming Price Range Filters */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h4 className="text-white font-black uppercase tracking-wide text-sm mb-4 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      PREÇO
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                      {faixaPrecoOptions.map((option, index) => (
                        <motion.button
                          key={option.value}
                          onClick={() => setSelectedFaixaPreco(option.value)}
                          className={cn(
                            "relative overflow-hidden p-3 text-xs rounded-2xl border-2 transition-all duration-300 font-black uppercase tracking-wide group",
                            selectedFaixaPreco === option.value
                              ? "bg-gradient-to-br from-emerald-500 to-teal-500 border-emerald-400/60 text-white shadow-lg shadow-emerald-500/30"
                              : "bg-black/40 border-white/20 text-white hover:border-white/40 hover:bg-white/10 backdrop-blur-sm"
                          )}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.05, type: "spring", stiffness: 400 }}
                        >
                          {option.label}
                          
                          {/* Gaming Light Sweep */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Gaming Corner Accents */}
                <div className="absolute top-4 right-4 w-8 h-8 opacity-40">
                  <div className="w-full h-full border-2 border-purple-300/60 border-l-0 border-b-0 rounded-tr-2xl" />
                </div>
                <div className="absolute bottom-4 left-4 w-8 h-8 opacity-40">
                  <div className="w-full h-full border-2 border-purple-300/60 border-r-0 border-t-0 rounded-bl-2xl" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gaming Caixas Grid */}
        <div className="mx-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {loading ? (
              <CaixasGridSkeleton count={6} />
            ) : error ? (
              <div className="text-center py-12">
                <div className="bg-gradient-to-br from-red-900/50 to-red-800/50 border-2 border-red-400/30 rounded-3xl p-8 backdrop-blur-xl shadow-2xl shadow-red-500/20 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-400/30">
                    <X className="w-8 h-8 text-red-400" />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-wide mb-3">ERROR</h3>
                  <p className="text-red-300 mb-6 font-medium">Falha ao carregar caixas gaming</p>
                  <GamingButton
                    onClick={() => refetch()}
                    variant="danger"
                    icon={Target}
                    className="text-sm px-6 py-3"
                  >
                    TENTAR NOVAMENTE
                  </GamingButton>
                </div>
              </div>
            ) : processedCaixas.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gradient-to-br from-gray-900/50 to-blue-900/50 border-2 border-blue-400/30 rounded-3xl p-8 backdrop-blur-xl shadow-2xl shadow-blue-500/20 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-400/30">
                    <Search className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-wide mb-3">NO RESULTS</h3>
                  <p className="text-blue-300 mb-6 font-medium">Nenhuma caixa encontrada com esses filtros</p>
                  {activeFiltersCount > 0 && (
                    <GamingButton
                      onClick={clearFilters}
                      variant="secondary"
                      icon={X}
                      className="text-sm px-6 py-3"
                    >
                      LIMPAR FILTROS
                    </GamingButton>
                  )}
                </div>
              </div>
            ) : (
              <div className={cn(
                "grid gap-6",
                viewMode === 'grid' 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1 max-w-4xl mx-auto"
              )}>
                {processedCaixas.map((caixa, index) => (
                  <motion.div
                    key={caixa.id}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 300,
                      damping: 25 
                    }}
                    whileHover={{ y: -5 }}
                  >
                    <GamingCaseCard
                      caixa={caixa}
                      onOpenCase={() => handleCaixaClick(caixa)}
                      onShowTransparency={() => handleOpenTransparency(caixa)}
                      featured={index < 3}
                      className="h-full"
                      animated={true}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Gaming Load More */}
          {processedCaixas.length > 0 && filtros?.hasMore && (
            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GamingButton
                variant="secondary"
                size="lg"
                icon={Crown}
                className="px-12 py-4 text-lg"
              >
                CARREGAR MAIS CAIXAS
              </GamingButton>
            </motion.div>
          )}
        </div>
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

export default CaixasPage