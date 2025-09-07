import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trophy, 
  Crown, 
  Medal, 
  TrendingUp, 
  Calendar,
  Filter,
  Search,
  Eye,
  ArrowRight,
  Sparkles,
  Star,
  Award,
  Users,
  Clock,
  Gift,
  Zap,
  Target,
  BarChart3
} from 'lucide-react'

// Components
import GamingContainer from '../components/ui/GamingContainer'
import GamingButton from '../components/ui/GamingButton'
import HorizontalLiveFeed from '../components/ui/HorizontalLiveFeed'
import MobileGamingCard from '../components/ui/MobileGamingCard'
import RaridadeBadge from '../components/ui/RaridadeBadge'
import { LoadingSpinner, GanhadorSkeleton } from '../components/ui/LoadingSkeleton'

// Hooks
import { useApi } from '../hooks/useApi'
import { useNotifications } from '../stores/useAppStore'

// Utils
import { formatCurrency, formatTime, formatDate, triggerHaptic, cn } from '../lib/utils'

const GanhadoresPage = () => {
  const [activeFilter, setActiveFilter] = useState('todos') // todos, hoje, semana, mes
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('24h')
  
  const { addNotification } = useNotifications()

  // Mock data para demonstração - substituir por API real
  const mockGanhadores = [
    {
      id: 1,
      usuario: 'GamerPro2024',
      item: 'AK-47 Fire Serpent',
      valor: 2500.00,
      raridade: 'mythic',
      caixa: 'Caixa Élite Premium',
      dataHora: new Date(Date.now() - 1000 * 60 * 15), // 15 min atrás
      avatar: null,
      multiplicador: 50.5
    },
    {
      id: 2,
      usuario: 'LuckyPlayer',
      item: 'AWP Dragon Lore',
      valor: 4200.00,
      raridade: 'legendary',
      caixa: 'Caixa Suprema',
      dataHora: new Date(Date.now() - 1000 * 60 * 30), // 30 min atrás
      avatar: null,
      multiplicador: 105.2
    },
    {
      id: 3,
      usuario: 'CaçadorDeItens',
      item: 'Knife Karambit Fade',
      valor: 1800.00,
      raridade: 'legendary',
      caixa: 'Caixa Knives',
      dataHora: new Date(Date.now() - 1000 * 60 * 45), // 45 min atrás
      avatar: null,
      multiplicador: 72.3
    },
    {
      id: 4,
      usuario: 'ProGamer',
      item: 'M4A4 Howl',
      valor: 3200.00,
      raridade: 'mythic',
      caixa: 'Caixa Legendary',
      dataHora: new Date(Date.now() - 1000 * 60 * 60), // 1h atrás
      avatar: null,
      multiplicador: 128.8
    },
    {
      id: 5,
      usuario: 'SkinHunter',
      item: 'Glock-18 Fade',
      valor: 450.00,
      raridade: 'epic',
      caixa: 'Caixa Premium',
      dataHora: new Date(Date.now() - 1000 * 60 * 90), // 1.5h atrás
      avatar: null,
      multiplicador: 18.2
    }
  ]

  // Dados de estatísticas globais
  const estatisticasGerais = {
    totalPremios: 89750.50,
    ganhadoresHoje: 247,
    maiorPremio: 4200.00,
    premioMedio: 385.75,
    caixasAbertasHoje: 1450,
    taxaSucesso: 23.8
  }

  const periods = [
    { value: '1h', label: 'Última Hora' },
    { value: '24h', label: 'Hoje' },
    { value: '7d', label: '7 Dias' },
    { value: '30d', label: '30 Dias' }
  ]

  // Filtros
  const filteredGanhadores = useMemo(() => {
    let filtered = [...mockGanhadores]
    
    if (searchTerm) {
      filtered = filtered.filter(g => 
        g.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.caixa.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    return filtered
  }, [searchTerm])

  const handleUserClick = (usuario) => {
    triggerHaptic('light')
    addNotification({
      type: 'info',
      message: `Perfil de ${usuario} em desenvolvimento`
    })
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

      {/* Live Feed Bar */}
      <HorizontalLiveFeed />
      
      <div className="relative z-10 space-y-16 pt-4">
        {/* Header Section */}
        <section className="px-4 md:px-8">
          <GamingContainer 
            variant="secondary" 
            headerTitle="HALL DA FAMA" 
            headerSubtitle="Os maiores ganhadores da plataforma • Atualizações em tempo real"
            headerIcon={Trophy}
            borderStyle="glow"
            className="max-w-6xl mx-auto"
            backgroundPattern={true}
            particles={true}
          >
            <div className="text-center space-y-6">
              <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                Acompanhe os <span className="text-yellow-400 font-bold">maiores prêmios</span> conquistados pela nossa comunidade. 
                Todos os resultados são <span className="text-green-400 font-bold">100% verificáveis</span>.
              </p>

              {/* Quick Stats */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {[
                  { icon: Trophy, value: formatCurrency(estatisticasGerais.totalPremios), label: 'Prêmios Totais', color: 'yellow' },
                  { icon: Users, value: estatisticasGerais.ganhadoresHoje, label: 'Ganhadores Hoje', color: 'blue' },
                  { icon: Crown, value: formatCurrency(estatisticasGerais.maiorPremio), label: 'Maior Prêmio', color: 'purple' },
                  { icon: Target, value: `${estatisticasGerais.taxaSucesso}%`, label: 'Taxa de Sucesso', color: 'green' }
                ].map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <motion.div
                      key={stat.label}
                      className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center hover:border-white/40 transition-all group"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <motion.div 
                        className={`w-10 h-10 mx-auto mb-3 bg-${stat.color}-400/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-${stat.color}-400/30`}
                        whileHover={{ rotate: 12, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <Icon className={`w-5 h-5 text-${stat.color}-400`} />
                      </motion.div>
                      <div className={`text-lg font-luxdrop font-black text-${stat.color}-400 mb-1`}>{stat.value}</div>
                      <div className={`text-xs text-${stat.color}-300 font-medium uppercase tracking-wide`}>{stat.label}</div>
                      
                      {/* Corner Accents */}
                      <div className="absolute top-2 right-2 w-3 h-3 opacity-30">
                        <div className="w-full h-full border border-white/40 border-l-0 border-b-0 rounded-tr-lg" />
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>
          </GamingContainer>
        </section>

        {/* Filters and Search */}
        <section className="px-4 md:px-8">
          <motion.div
            className="max-w-6xl mx-auto space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Period Filter */}
            <div className="flex gap-2 p-2 bg-black/30 backdrop-blur-md rounded-3xl border border-white/20 max-w-2xl mx-auto">
              {periods.map((period, index) => {
                const isActive = selectedPeriod === period.value
                return (
                  <motion.button
                    key={period.value}
                    onClick={() => setSelectedPeriod(period.value)}
                    className={cn(
                      "relative flex items-center gap-2 py-3 px-4 md:px-6 text-sm font-bold uppercase tracking-wide transition-all rounded-2xl flex-1 justify-center overflow-hidden group",
                      isActive
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-yellow-500/25"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    {/* Background Light Sweep */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                    )}
                    
                    <span className="relative z-10">{period.label}</span>
                    
                    {/* Corner Accents */}
                    {isActive && (
                      <>
                        <div className="absolute top-1 right-1 w-3 h-3 opacity-50">
                          <div className="w-full h-full border border-white/40 border-l-0 border-b-0 rounded-tr-lg" />
                        </div>
                        <div className="absolute bottom-1 left-1 w-3 h-3 opacity-50">
                          <div className="w-full h-full border border-white/40 border-r-0 border-t-0 rounded-bl-lg" />
                        </div>
                      </>
                    )}
                  </motion.button>
                )
              })}
            </div>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <motion.div
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400"
                animate={{ rotate: searchTerm ? 360 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <Search className="w-5 h-5" />
              </motion.div>
              <input
                type="text"
                placeholder="Buscar por usuário, item ou caixa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/30 backdrop-blur-md border-2 border-white/20 hover:border-yellow-400/50 focus:border-yellow-400 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-white/50 focus:outline-none transition-all font-medium"
              />
              {/* Gaming corner accent */}
              <div className="absolute top-2 right-2 w-4 h-4 opacity-30">
                <div className="w-full h-full border border-white/40 border-l-0 border-b-0 rounded-tr-lg" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Winners List */}
        <section className="px-4 md:px-8">
          <GamingContainer
            variant="dark"
            headerTitle="GANHADORES RECENTES"
            headerSubtitle={`${filteredGanhadores.length} prêmios conquistados`}
            headerIcon={Award}
            headerActions={
              <GamingButton
                variant="outline"
                size="sm"
                href="/transparencia"
                arrowAnimation
              >
                Ver Transparência
              </GamingButton>
            }
            borderStyle="glow"
            className="max-w-6xl mx-auto"
          >
            <div className="space-y-4">
              {filteredGanhadores.map((ganhador, index) => (
                <motion.div 
                  key={ganhador.id}
                  className="relative bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:border-white/40 transition-all group overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01, y: -2 }}
                >
                  {/* Ranking Badge */}
                  <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center border-2 border-white/30 z-10">
                    <span className="text-sm font-black text-white">#{index + 1}</span>
                  </div>

                  {/* Background Gradient based on rarity */}
                  <div className={cn(
                    "absolute inset-0 opacity-5 group-hover:opacity-10 transition-all",
                    ganhador.raridade === 'mythic' && 'bg-gradient-to-r from-red-500/20 to-pink-500/20',
                    ganhador.raridade === 'legendary' && 'bg-gradient-to-r from-orange-500/20 to-yellow-500/20',
                    ganhador.raridade === 'epic' && 'bg-gradient-to-r from-purple-500/20 to-blue-500/20'
                  )} />
                  
                  {/* Light Sweep */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* User Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Trophy className="w-6 h-6 text-yellow-400" />
                      </div>
                      
                      {/* Winner Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <button
                            onClick={() => handleUserClick(ganhador.usuario)}
                            className="font-luxdrop font-black text-white text-lg hover:text-yellow-400 transition-colors truncate"
                          >
                            {ganhador.usuario}
                          </button>
                          <RaridadeBadge raridade={ganhador.raridade} size="sm" />
                        </div>
                        
                        <div className="text-white/80 font-medium truncate mb-1">
                          {ganhador.item}
                        </div>
                        
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-white/60">{ganhador.caixa}</span>
                          <span className="text-white/40">•</span>
                          <span className="text-white/60 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(ganhador.dataHora)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Prize Info */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-2xl font-luxdrop font-black text-yellow-400 mb-1">
                        {formatCurrency(ganhador.valor)}
                      </div>
                      <div className="text-sm text-green-400 font-bold">
                        {ganhador.multiplicador}x multiplier
                      </div>
                    </div>
                  </div>
                  
                  {/* Corner Accents */}
                  <div className="absolute top-3 right-3 w-4 h-4 opacity-30">
                    <div className="w-full h-full border border-white/40 border-l-0 border-b-0 rounded-tr-lg" />
                  </div>
                  <div className="absolute bottom-3 left-3 w-4 h-4 opacity-30">
                    <div className="w-full h-full border border-white/40 border-r-0 border-t-0 rounded-bl-lg" />
                  </div>
                </motion.div>
              ))}
              
              {filteredGanhadores.length === 0 && (
                <div className="text-center py-16">
                  <motion.div
                    className="w-20 h-20 mx-auto mb-6 bg-gray-400/20 rounded-2xl flex items-center justify-center border border-gray-400/30"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Search className="w-10 h-10 text-gray-400" />
                  </motion.div>
                  <h3 className="text-2xl font-luxdrop font-black text-white mb-4 uppercase tracking-wide">
                    Nenhum ganhador encontrado
                  </h3>
                  <p className="text-white/70 mb-6">Tente buscar por outros termos ou ajuste o período</p>
                  <GamingButton
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedPeriod('24h')
                    }}
                    arrowAnimation
                  >
                    Limpar Filtros
                  </GamingButton>
                </div>
              )}
            </div>
          </GamingContainer>
        </section>

        {/* Load More */}
        {filteredGanhadores.length > 0 && (
          <section className="px-4 md:px-8 pb-8">
            <div className="text-center">
              <GamingButton
                variant="primary"
                size="lg"
                onClick={() => addNotification({ type: 'info', message: 'Carregando mais ganhadores...' })}
                icon={ArrowRight}
                glowEffect={true}
                animated={true}
              >
                Carregar Mais Ganhadores
              </GamingButton>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default GanhadoresPage