import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Phone, 
  Wallet,
  Gift,
  Trophy,
  TrendingUp,
  Calendar,
  Eye,
  Copy,
  Check,
  Settings,
  LogOut,
  Crown,
  Star,
  Package
} from 'lucide-react'

// Components
import { CompactItemCard } from '../components/cards/ItemCard'
import { ListLoadingSkeleton, LoadingSpinner } from '../components/ui/LoadingSkeleton'
import TransparencyModal from '../components/modals/TransparencyModal'
import RaridadeBadge from '../components/ui/RaridadeBadge'
import { MysteryBox, CasinoPokerChip, TreasureChest, DiamondBox } from '../components/ui/CasinoIcons'

// Hooks
import { useApi } from '../hooks/useApi'
import { useUser, useNotifications } from '../stores/useAppStore'

// Utils
import { formatCurrency, formatDate, triggerHaptic, cn } from '../lib/utils'

const PerfilPage = () => {
  const [activeTab, setActiveTab] = useState('itens') // itens, historico, stats
  const [showTransparency, setShowTransparency] = useState(false)
  const [selectedCompra, setSelectedCompra] = useState(null)
  const [copiedId, setCopiedId] = useState('')
  
  const { user, logout } = useUser()
  const { addNotification } = useNotifications()

  // Buscar dados do perfil
  const { data: perfilData, loading } = useApi('/usuario/perfil', {
    enabled: !!user?.id
  })

  const { data: itensGanhos, loading: itensLoading } = useApi('/usuario/itens', {
    enabled: !!user?.id && activeTab === 'itens'
  })

  const { data: historico, loading: historicoLoading } = useApi('/usuario/historico', {
    enabled: !!user?.id && activeTab === 'historico'
  })

  const {
    estatisticas = {},
    nivel = 1,
    proximoNivel = {},
    conquistas = []
  } = perfilData || {}

  // Handlers
  const handleCopyId = async (id, type) => {
    try {
      await navigator.clipboard.writeText(id)
      setCopiedId(id)
      triggerHaptic('light')
      
      addNotification({
        type: 'success',
        message: `${type} copiado para área de transferência`
      })

      setTimeout(() => setCopiedId(''), 2000)
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erro ao copiar ID'
      })
    }
  }

  const handleOpenTransparency = (compra) => {
    setSelectedCompra(compra)
    setShowTransparency(true)
  }

  const handleLogout = () => {
    logout()
    addNotification({
      type: 'info',
      message: 'Você foi desconectado'
    })
  }

  const tabs = [
    { id: 'itens', label: 'Meus Itens', icon: Gift },
    { id: 'historico', label: 'Histórico', icon: Calendar },
    { id: 'stats', label: 'Estatísticas', icon: TrendingUp }
  ]

  const conquistas_mock = [
    { id: 1, nome: 'Primeira Caixa', descricao: 'Abriu sua primeira caixa', conquistado: true, icone: MysteryBox },
    { id: 2, nome: 'Sortudo', descricao: 'Ganhou um item lendário', conquistado: true, icone: DiamondBox },
    { id: 3, nome: 'Colecionador', descricao: 'Possua 10 itens diferentes', conquistado: false, icone: TreasureChest },
    { id: 4, nome: 'High Roller', descricao: 'Gaste R$ 100 em caixas', conquistado: false, icone: CasinoPokerChip }
  ]

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center backdrop-blur-gaming shadow-gaming">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-300 mb-2">Login Required</h3>
          <p className="text-gray-400">Please login to view your profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container-gaming py-8 space-y-6">
        {/* Profile Header Gaming */}
        <motion.div
          className="bg-black/20 backdrop-blur-gaming border border-white/10 rounded-2xl p-6 shadow-gaming"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shrink-0 shadow-gaming">
                <span className="text-2xl font-bold text-white">
                  {user.nome?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
              
              {/* Nível Badge */}
              <div className="absolute -top-2 -right-2 bg-blue-trust text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {nivel}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-white truncate">
                  {user.nome}
                </h1>
                {nivel >= 5 && (
                  <Crown className="w-5 h-5 text-gold-primary" />
                )}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-300 mb-3">
                <Phone className="w-4 h-4" />
                {user.telefone}
              </div>

              {/* Level Progress */}
              {proximoNivel && (
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <span>Nível {nivel}</span>
                    <span>{user.pontosXp || 0} / {proximoNivel.xpNecessario} XP</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(100, ((user.pontosXp || 0) / proximoNivel.xpNecessario) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <button
              onClick={handleLogout}
              className="btn-ghost p-2 text-gray-400 hover:text-red-400"
              aria-label="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="bg-black/20 backdrop-blur-gaming border border-white/10 rounded-xl p-4 text-center shadow-gaming">
            <Wallet className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-green-success">
              {formatCurrency(user.saldo || 0)}
            </div>
            <div className="text-xs text-gray-400">Saldo</div>
          </div>
          
          <div className="bg-black/20 backdrop-blur-gaming border border-white/10 rounded-xl p-4 text-center shadow-gaming">
            <Gift className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">
              {estatisticas.totalItens || 0}
            </div>
            <div className="text-xs text-gray-400">Itens</div>
          </div>
          
          <div className="bg-black/20 backdrop-blur-gaming border border-white/10 rounded-xl p-4 text-center">
            <Package className="w-6 h-6 text-gold-primary mx-auto mb-2" />
            <div className="text-lg font-bold text-white">
              {estatisticas.caixasAbertas || 0}
            </div>
            <div className="text-xs text-gray-400">Caixas</div>
          </div>
          
          <div className="bg-black/20 backdrop-blur-gaming border border-white/10 rounded-xl p-4 text-center">
            <TrendingUp className="w-6 h-6 text-red-urgency mx-auto mb-2" />
            <div className="text-lg font-bold text-white">
              {formatCurrency(user.totalGanho || 0)}
            </div>
            <div className="text-xs text-gray-400">Ganho Total</div>
          </div>
        </motion.div>

        {/* Conquistas */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-gold-primary" />
            Conquistas
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {conquistas_mock.map((conquista) => (
              <div
                key={conquista.id}
                className={cn(
                  "bg-dark-50 border rounded-xl p-4 flex items-center gap-3",
                  conquista.conquistado
                    ? "border-gold-primary/30 bg-gold-primary/5"
                    : "border-gray-700"
                )}
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <conquista.icone className={cn(
                    "w-6 h-6",
                    conquista.conquistado ? "text-gold-primary" : "text-gray-500"
                  )} />
                </div>
                <div className="flex-1">
                  <h3 className={cn(
                    "font-semibold mb-1",
                    conquista.conquistado ? "text-gold-primary" : "text-white"
                  )}>
                    {conquista.nome}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {conquista.descricao}
                  </p>
                </div>
                {conquista.conquistado && (
                  <Check className="w-5 h-5 text-gold-primary" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex border-b border-gray-700 mb-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 py-3 px-4 text-sm font-medium transition-colors border-b-2 -mb-px",
                    activeTab === tab.id
                      ? "text-gold-primary border-gold-primary"
                      : "text-gray-400 border-transparent hover:text-gray-300"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Tab: Meus Itens */}
              {activeTab === 'itens' && (
                <div className="space-y-4">
                  {itensLoading ? (
                    <ListLoadingSkeleton type="item" count={4} />
                  ) : itensGanhos?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {itensGanhos.map((item) => (
                        <CompactItemCard 
                          key={`${item.id}-${item.timestamp}`} 
                          item={item} 
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Gift className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">Você ainda não ganhou nenhum item</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Histórico */}
              {activeTab === 'historico' && (
                <div className="space-y-4">
                  {historicoLoading ? (
                    <ListLoadingSkeleton count={5} />
                  ) : historico?.length > 0 ? (
                    <div className="space-y-3">
                      {historico.map((compra) => (
                        <div
                          key={compra.id}
                          className="bg-black/20 backdrop-blur-gaming border border-white/10 rounded-xl p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-gold rounded-xl flex items-center justify-center">
                                <Package className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-white">
                                  {compra.caixaNome}
                                </h3>
                                <p className="text-xs text-gray-400">
                                  {formatDate(compra.criadoEm)}
                                </p>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-sm font-semibold text-green-success">
                                {formatCurrency(compra.valor)}
                              </div>
                              <div className="text-xs text-gray-400">
                                Status: {compra.status}
                              </div>
                            </div>
                          </div>

                          {compra.itemGanho && (
                            <div className="bg-dark-100 rounded-lg p-3 mb-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={compra.itemGanho.imagemUrl}
                                  alt={compra.itemGanho.nome}
                                  className="w-8 h-8 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-white">
                                    {compra.itemGanho.nome}
                                  </p>
                                  <RaridadeBadge 
                                    raridade={compra.itemGanho.raridade} 
                                    size="sm" 
                                  />
                                </div>
                                <div className="text-sm font-semibold text-green-success">
                                  {formatCurrency(compra.itemGanho.valor)}
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 text-gray-400">
                              <span>ID: {compra.id.slice(0, 8)}...</span>
                              <button
                                onClick={() => handleCopyId(compra.id, 'ID da compra')}
                                className="text-gray-500 hover:text-gray-300"
                              >
                                {copiedId === compra.id ? (
                                  <Check className="w-3 h-3" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                            
                            <button
                              onClick={() => handleOpenTransparency(compra)}
                              className="text-gold-primary hover:text-gold-secondary flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              Ver Transparência
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">Nenhuma compra realizada ainda</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Estatísticas */}
              {activeTab === 'stats' && (
                <div className="space-y-6">
                  {loading ? (
                    <LoadingSpinner size="lg" className="mx-auto" />
                  ) : (
                    <>
                      {/* Estatísticas Gerais */}
                      <div>
                        <h3 className="text-base font-semibold text-white mb-4">
                          Estatísticas Gerais
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-black/20 backdrop-blur-gaming border border-white/10 rounded-xl p-4">
                            <div className="text-2xl font-bold text-white mb-1">
                              {formatCurrency(user.totalGasto || 0)}
                            </div>
                            <div className="text-sm text-gray-400">Total Investido</div>
                          </div>
                          
                          <div className="bg-black/20 backdrop-blur-gaming border border-white/10 rounded-xl p-4">
                            <div className="text-2xl font-bold text-green-success mb-1">
                              {((user.totalGanho || 0) / Math.max(user.totalGasto || 1, 1) * 100).toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-400">Taxa de Retorno</div>
                          </div>
                        </div>
                      </div>

                      {/* Itens por Raridade */}
                      {estatisticas.itensPorRaridade && (
                        <div>
                          <h3 className="text-base font-semibold text-white mb-4">
                            Itens por Raridade
                          </h3>
                          <div className="space-y-3">
                            {Object.entries(estatisticas.itensPorRaridade).map(([raridade, quantidade]) => (
                              <div key={raridade} className="flex items-center justify-between bg-black/20 backdrop-blur-gaming border border-white/10 rounded-lg p-3">
                                <RaridadeBadge raridade={raridade} />
                                <span className="text-white font-semibold">{quantidade}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Transparency Modal */}
      <TransparencyModal
        isOpen={showTransparency}
        onClose={() => setShowTransparency(false)}
        caixaId={selectedCompra?.caixaId}
        caixaNome={selectedCompra?.caixaNome}
        compraId={selectedCompra?.id}
      />
    </div>
  )
}

export default PerfilPage