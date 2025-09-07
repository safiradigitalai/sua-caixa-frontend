import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  Eye, 
  Calculator,
  Hash,
  Search,
  TrendingUp,
  Award,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Copy,
  Check,
  BarChart3,
  PieChart
} from 'lucide-react'

// Components
import GamingContainer from '../components/ui/GamingContainer'
import GamingButton from '../components/ui/GamingButton'
import HorizontalLiveFeed from '../components/ui/HorizontalLiveFeed'
import MobileGamingCard from '../components/ui/MobileGamingCard'
import GamingCaseCard from '../components/ui/GamingCaseCard'
import { TransparencyItemCard } from '../components/cards/ItemCard'
import { LoadingSpinner, CaixasGridSkeleton, TransparenciaSkeleton } from '../components/ui/LoadingSkeleton'
import TransparencyModal from '../components/modals/TransparencyModal'
import RaridadeBadge from '../components/ui/RaridadeBadge'

// Hooks
import { useApi } from '../hooks/useApi'
import { useNotifications } from '../stores/useAppStore'
import { useDebounce } from '../hooks/useDebounce'

// Utils
import { formatCurrency, formatPercentage, formatDate, formatTime, triggerHaptic, cn } from '../lib/utils'

const TransparenciaPage = () => {
  const [activeTab, setActiveTab] = useState('global') // global, caixas, verificador
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCaixa, setSelectedCaixa] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [verificationInput, setVerificationInput] = useState({
    serverSeed: '',
    clientSeed: '',
    expectedHash: ''
  })
  const [verificationResult, setVerificationResult] = useState(null)
  const [copiedHash, setCopiedHash] = useState('')
  
  const debouncedSearch = useDebounce(searchTerm, 300)
  const { addNotification } = useNotifications()

  // Buscar dados globais de transparência
  const { data: dadosGlobais, loading: globalLoading } = useApi('/transparencia/global')

  // Buscar caixas para transparência
  const { data: caixasData, loading: caixasLoading } = useApi('/transparencia/caixas', {
    params: { search: debouncedSearch },
    enabled: activeTab === 'caixas'
  })

  const { caixas = [] } = caixasData || {}

  const {
    estatisticasGerais = {},
    ultimasCompras = [],
    distribuicaoRaridades = {},
    caixasMaisAbertas = [],
    verificacoesRecentes = []
  } = dadosGlobais || {}

  const tabs = [
    { id: 'global', label: 'Visão Geral', icon: BarChart3 },
    { id: 'caixas', label: 'Por Caixa', icon: Eye },
    { id: 'verificador', label: 'Verificador', icon: Calculator }
  ]

  // Handlers
  const handleCopyHash = async (hash, type) => {
    try {
      await navigator.clipboard.writeText(hash)
      setCopiedHash(hash)
      triggerHaptic('light')
      
      addNotification({
        type: 'success',
        title: 'Hash copiado!',
        message: `${type} copiado para área de transferência`
      })

      setTimeout(() => setCopiedHash(''), 2000)
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erro ao copiar hash'
      })
    }
  }

  const handleOpenCaixaTransparency = (caixa) => {
    setSelectedCaixa(caixa)
    setShowModal(true)
  }

  const handleVerifySeeds = async () => {
    const { serverSeed, clientSeed, expectedHash } = verificationInput
    
    if (!serverSeed || !clientSeed) {
      addNotification({
        type: 'warning',
        message: 'Preencha os seeds para verificar'
      })
      return
    }

    try {
      // Simular verificação (em produção, seria calculado no cliente)
      const crypto = window.crypto
      const encoder = new TextEncoder()
      const data = encoder.encode(serverSeed + clientSeed)
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

      const result = {
        calculatedHash: hashHex,
        matches: expectedHash ? hashHex === expectedHash.toLowerCase() : null,
        randomValue: parseInt(hashHex.substring(0, 8), 16),
        timestamp: new Date().toISOString()
      }

      setVerificationResult(result)
      
      addNotification({
        type: result.matches === false ? 'error' : 'success',
        title: 'Verificação Concluída',
        message: result.matches === false 
          ? 'Hash não confere - resultado pode ter sido manipulado!'
          : 'Hash verificado com sucesso!'
      })

    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erro na verificação dos seeds'
      })
    }
  }

  const clearVerification = () => {
    setVerificationInput({ serverSeed: '', clientSeed: '', expectedHash: '' })
    setVerificationResult(null)
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
            variant="glass" 
            headerTitle="SISTEMA DE TRANSPARÊNCIA" 
            headerSubtitle="100% Verificável • Provably Fair • Histórico Completo"
            headerIcon={Shield}
            borderStyle="glow"
            className="max-w-6xl mx-auto"
            backgroundPattern={true}
            particles={true}
          >
            <div className="text-center space-y-4">
              <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                Verifique a honestidade de todos os resultados através do nosso sistema 
                <span className="text-green-400 font-bold"> Provably Fair</span>
              </p>
              {/* Trust Indicators */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {[
                  { icon: CheckCircle, value: "100%", label: "Verificável", color: "green" },
                  { icon: Hash, value: "SHA-256", label: "Criptografia", color: "blue" },
                  { icon: Award, value: "Open Source", label: "Código Aberto", color: "purple" }
                ].map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={item.label}
                      className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:border-white/40 transition-all group"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <motion.div 
                        className={`w-12 h-12 mx-auto mb-3 bg-${item.color}-400/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-${item.color}-400/30`}
                        whileHover={{ rotate: 12, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <Icon className={`w-6 h-6 text-${item.color}-400`} />
                      </motion.div>
                      <div className={`text-xl font-luxdrop font-black text-${item.color}-400 mb-1`}>{item.value}</div>
                      <div className={`text-sm text-${item.color}-300 font-medium`}>{item.label}</div>
                      
                      {/* Corner Accents */}
                      <div className="absolute top-2 right-2 w-4 h-4 opacity-30">
                        <div className="w-full h-full border border-white/40 border-l-0 border-b-0 rounded-tr-lg" />
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>
          </GamingContainer>
        </section>

        {/* Navigation Tabs */}
        <section className="px-4 md:px-8">
          <motion.div
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex gap-2 p-2 bg-black/30 backdrop-blur-md rounded-3xl border border-white/20 mb-8">
              {tabs.map((tab, index) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "relative flex items-center gap-3 py-3 px-4 md:px-6 text-sm font-bold uppercase tracking-wide transition-all rounded-2xl flex-1 justify-center overflow-hidden group",
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/25"
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
                    
                    <motion.div
                      whileHover={{ rotate: 12, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Icon className="w-4 h-4" />
                    </motion.div>
                    <span className="hidden sm:block relative z-10">{tab.label}</span>
                    
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

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
              >
              {/* Tab: Visão Geral */}
              {activeTab === 'global' && (
                <div className="space-y-6">
                  {globalLoading ? (
                    <TransparenciaSkeleton />
                  ) : (
                    <>
                      {/* Estatísticas Principais */}
                      <div>
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-blue-400" />
                          Estatísticas Globais
                        </h2>
                        
                        <div className="grid grid-cols-2 gap-6">
                          <div className="bg-dark-50 border border-gray-700 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-white mb-1">
                              {estatisticasGerais.totalCaixasAbertas?.toLocaleString() || 0}
                            </div>
                            <div className="text-xs text-gray-400">Caixas Abertas</div>
                          </div>
                          
                          <div className="bg-dark-50 border border-gray-700 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-green-success mb-1">
                              {formatCurrency(estatisticasGerais.valorTotalDistribuido || 0)}
                            </div>
                            <div className="text-xs text-gray-400">Valor Distribuído</div>
                          </div>
                          
                          <div className="bg-dark-50 border border-gray-700 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-blue-400 mb-1">
                              {estatisticasGerais.usuariosUnicos?.toLocaleString() || 0}
                            </div>
                            <div className="text-xs text-gray-400">Usuários Únicos</div>
                          </div>
                          
                          <div className="bg-dark-50 border border-gray-700 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-gold-primary mb-1">
                              {estatisticasGerais.verificacoesRealizadas?.toLocaleString() || 0}
                            </div>
                            <div className="text-xs text-gray-400">Verificações</div>
                          </div>
                        </div>
                      </div>

                      {/* Distribuição de Raridades */}
                      {Object.keys(distribuicaoRaridades).length > 0 && (
                        <div>
                          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <PieChart className="w-5 h-5 text-purple-400" />
                            Distribuição de Raridades
                          </h2>
                          
                          <div className="space-y-3">
                            {Object.entries(distribuicaoRaridades).map(([raridade, data]) => (
                              <div key={raridade} className="bg-dark-50 border border-gray-700 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <RaridadeBadge raridade={raridade} />
                                  <div className="text-right">
                                    <div className="text-lg font-bold text-white">
                                      {formatPercentage(data.percentage)}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                      {data.quantidade} itens
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full"
                                    style={{ width: `${data.percentage}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Caixas Mais Abertas */}
                      {caixasMaisAbertas.length > 0 && (
                        <div>
                          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Award className="w-5 h-5 text-gold-primary" />
                            Caixas Mais Populares
                          </h2>
                          
                          <div className="space-y-3">
                            {caixasMaisAbertas.slice(0, 5).map((caixa, index) => (
                              <div 
                                key={caixa.id}
                                className="bg-dark-50 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-colors cursor-pointer"
                                onClick={() => handleOpenCaixaTransparency(caixa)}
                              >
                                <div className="flex items-center gap-4">
                                  <div className="bg-gold-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                                    {index + 1}
                                  </div>
                                  
                                  <img
                                    src={caixa.imagemUrl}
                                    alt={caixa.nome}
                                    className="w-12 h-12 object-cover rounded-lg border border-gray-600"
                                  />
                                  
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-white mb-1">
                                      {caixa.nome}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                      <RaridadeBadge raridade={caixa.raridade} size="sm" />
                                      <span className="text-xs text-gray-400">
                                        {formatCurrency(caixa.preco)}
                                      </span>
                                    </div>
                                  </div>
                                  
                                    <div className="text-right">
                                      <div className="text-2xl font-luxdrop font-black text-white mb-1">
                                        {caixa.totalAbertas?.toLocaleString()}
                                      </div>
                                      <div className="text-xs text-white/70 uppercase tracking-wide font-medium">
                                        aberturas
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
                                </div>
                              ))}
                            </div>
                        </div>
                        )}

                      {/* Últimas Verificações */}
                      {verificacoesRecentes.length > 0 && (
                        <div>
                          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-green-success" />
                            Verificações Recentes
                          </h2>
                          
                          <div className="space-y-3">
                            {verificacoesRecentes.slice(0, 3).map((verificacao) => (
                              <div key={verificacao.id} className="bg-dark-50 border border-gray-700 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                    <span className="text-sm font-medium text-white">
                                      Verificação Confirmada
                                    </span>
                                  </div>
                                  <span className="text-xs text-gray-400">
                                    {formatTime(verificacao.timestamp)}
                                  </span>
                                </div>
                                
                                <div className="text-xs text-gray-300 font-mono bg-dark-100 rounded-lg p-2 truncate">
                                  Hash: {verificacao.hash}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

                {/* Tab: Por Caixa */}
                {activeTab === 'caixas' && (
                  <GamingContainer
                    variant="primary"
                    headerTitle="TRANSPARÊNCIA POR CAIXA"
                    headerSubtitle={`${caixas.length} caixas disponíveis para verificação`}
                    headerIcon={Eye}
                    headerActions={
                      <GamingButton
                        variant="outline"
                        size="sm"
                        href="/caixas"
                        arrowAnimation
                      >
                        Ver Loja
                      </GamingButton>
                    }
                    borderStyle="glow"
                    className="max-w-6xl mx-auto"
                  >
                    <div className="space-y-8">
                      {/* Enhanced Search */}
                      <div className="relative max-w-md mx-auto">
                        <motion.div
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400"
                          animate={{ rotate: searchTerm ? 360 : 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Search className="w-5 h-5" />
                        </motion.div>
                        <input
                          type="text"
                          placeholder="Pesquisar caixas para verificar..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full bg-black/30 backdrop-blur-md border-2 border-white/20 hover:border-blue-400/50 focus:border-blue-400 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-white/50 focus:outline-none transition-all font-medium"
                        />
                        {/* Gaming corner accent */}
                        <div className="absolute top-2 right-2 w-4 h-4 opacity-30">
                          <div className="w-full h-full border border-white/40 border-l-0 border-b-0 rounded-tr-lg" />
                        </div>
                      </div>

                      {/* Caixas Grid */}
                      {caixasLoading ? (
                        <CaixasGridSkeleton count={8} />
                      ) : caixas.length > 0 ? (
                        <>
                          {/* Mobile Grid */}
                          <div className="block md:hidden">
                            <div className="grid grid-cols-2 gap-4 justify-items-center">
                              {caixas.slice(0, 6).map((caixa, index) => (
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
                                    rarity={caixa.raridade || "rare"}
                                    title={caixa.nome}
                                    subtitle={formatCurrency(caixa.preco)}
                                    image={caixa.imagemUrl}
                                    level={index + 1}
                                    stats={`${caixa.totalItens || 0} drops`}
                                    onClick={() => handleOpenCaixaTransparency(caixa)}
                                    size="sm"
                                    animated={true}
                                  />
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* Desktop Grid */}
                          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {caixas.map((caixa, index) => (
                              <motion.div
                                key={caixa.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <GamingCaseCard
                                  caixa={caixa}
                                  onOpenCase={() => handleOpenCaixaTransparency(caixa)}
                                  onShowTransparency={() => handleOpenCaixaTransparency(caixa)}
                                  featured={index < 2}
                                  animated={true}
                                  className="w-full"
                                />
                              </motion.div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-16">
                          <motion.div
                            className="w-20 h-20 mx-auto mb-6 bg-blue-400/20 rounded-2xl flex items-center justify-center border border-blue-400/30"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <Search className="w-10 h-10 text-blue-400" />
                          </motion.div>
                          <h3 className="text-2xl font-luxdrop font-black text-white mb-4 uppercase tracking-wide">
                            Nenhuma caixa encontrada
                          </h3>
                          <p className="text-white/70 mb-6">Tente buscar por outro nome ou remova os filtros</p>
                          <GamingButton
                            variant="outline"
                            size="sm"
                            onClick={() => setSearchTerm('')}
                            arrowAnimation
                          >
                            Limpar Busca
                          </GamingButton>
                        </div>
                      )}
                    </div>
                  </GamingContainer>
                )}

                {/* Tab: Verificador */}
                {activeTab === 'verificador' && (
                  <GamingContainer
                    variant="dark"
                    headerTitle="VERIFICADOR PROVABLY FAIR"
                    headerSubtitle="Valide a honestidade de qualquer resultado SHA-256"
                    headerIcon={Calculator}
                    headerActions={
                      <GamingButton
                        variant="ghost"
                        size="sm"
                        onClick={clearVerification}
                        disabled={!verificationInput.serverSeed && !verificationInput.clientSeed}
                      >
                        Limpar
                      </GamingButton>
                    }
                    borderStyle="glow"
                    className="max-w-4xl mx-auto"
                  >
                    <div className="space-y-8">
                      {/* How it Works */}
                      <motion.div
                        className="bg-blue-500/10 backdrop-blur-md border border-blue-400/30 rounded-2xl p-6 relative overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="flex items-start gap-4">
                          <motion.div
                            className="w-12 h-12 bg-blue-400/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-blue-400/30 flex-shrink-0"
                            whileHover={{ rotate: 12, scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <Info className="w-6 h-6 text-blue-400" />
                          </motion.div>
                          <div>
                            <h3 className="font-luxdrop font-black text-blue-400 text-lg uppercase tracking-wide mb-3">
                              Como Funciona o Verificador
                            </h3>
                            <div className="text-sm text-blue-300 space-y-2 font-medium">
                              <p>• Cole o <span className="text-white font-bold">Server Seed</span> e <span className="text-white font-bold">Client Seed</span> da sua compra</p>
                              <p>• Opcionalmente, cole o <span className="text-white font-bold">Hash Esperado</span> para validação</p>
                              <p>• Clique em <span className="text-white font-bold">"Verificar"</span> para calcular o hash SHA-256</p>
                              <p>• Compare o resultado com o hash original da transação</p>
                            </div>
                          </div>
                        </div>
                        {/* Corner Accents */}
                        <div className="absolute top-3 right-3 w-4 h-4 opacity-30">
                          <div className="w-full h-full border border-blue-400/40 border-l-0 border-b-0 rounded-tr-lg" />
                        </div>
                      </motion.div>

                      {/* Verification Form */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Input Form */}
                        <div className="space-y-6">
                          {/* Server Seed */}
                          <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-white mb-3 uppercase tracking-wide">
                              <Hash className="w-4 h-4 text-blue-400" />
                              Server Seed
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Cole o server seed aqui..."
                                value={verificationInput.serverSeed}
                                onChange={(e) => setVerificationInput(prev => ({ ...prev, serverSeed: e.target.value }))}
                                className="w-full bg-black/30 backdrop-blur-md border-2 border-white/20 hover:border-blue-400/50 focus:border-blue-400 rounded-2xl px-4 py-4 text-white placeholder-white/50 focus:outline-none font-mono text-sm transition-all"
                              />
                              {/* Gaming corner accent */}
                              <div className="absolute top-2 right-2 w-4 h-4 opacity-30">
                                <div className="w-full h-full border border-white/40 border-l-0 border-b-0 rounded-tr-lg" />
                              </div>
                            </div>
                          </div>

                          {/* Client Seed */}
                          <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-white mb-3 uppercase tracking-wide">
                              <Users className="w-4 h-4 text-green-400" />
                              Client Seed
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Cole o client seed aqui..."
                                value={verificationInput.clientSeed}
                                onChange={(e) => setVerificationInput(prev => ({ ...prev, clientSeed: e.target.value }))}
                                className="w-full bg-black/30 backdrop-blur-md border-2 border-white/20 hover:border-green-400/50 focus:border-green-400 rounded-2xl px-4 py-4 text-white placeholder-white/50 focus:outline-none font-mono text-sm transition-all"
                              />
                              {/* Gaming corner accent */}
                              <div className="absolute top-2 right-2 w-4 h-4 opacity-30">
                                <div className="w-full h-full border border-white/40 border-l-0 border-b-0 rounded-tr-lg" />
                              </div>
                            </div>
                          </div>

                          {/* Expected Hash (Optional) */}
                          <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-white mb-3 uppercase tracking-wide">
                              <Calculator className="w-4 h-4 text-purple-400" />
                              Hash Esperado (Opcional)
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Cole o hash esperado para comparar..."
                                value={verificationInput.expectedHash}
                                onChange={(e) => setVerificationInput(prev => ({ ...prev, expectedHash: e.target.value }))}
                                className="w-full bg-black/30 backdrop-blur-md border-2 border-white/20 hover:border-purple-400/50 focus:border-purple-400 rounded-2xl px-4 py-4 text-white placeholder-white/50 focus:outline-none font-mono text-sm transition-all"
                              />
                              {/* Gaming corner accent */}
                              <div className="absolute top-2 right-2 w-4 h-4 opacity-30">
                                <div className="w-full h-full border border-white/40 border-l-0 border-b-0 rounded-tr-lg" />
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-4 pt-4">
                            <GamingButton
                              variant="primary"
                              onClick={handleVerifySeeds}
                              disabled={!verificationInput.serverSeed || !verificationInput.clientSeed}
                              className="flex-1"
                              icon={Calculator}
                              glowEffect={true}
                              animated={true}
                            >
                              Verificar Hash
                            </GamingButton>
                            
                            <GamingButton
                              variant="ghost"
                              onClick={clearVerification}
                              disabled={!verificationInput.serverSeed && !verificationInput.clientSeed && !verificationInput.expectedHash}
                              animated={true}
                            >
                              Limpar
                            </GamingButton>
                          </div>
                        </div>

                        {/* Results Panel */}
                        <div className="space-y-6">
                          {!verificationResult ? (
                            <div className="text-center py-12">
                              <motion.div
                                className="w-20 h-20 mx-auto mb-6 bg-gray-400/20 rounded-2xl flex items-center justify-center border border-gray-400/30"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 400 }}
                              >
                                <Calculator className="w-10 h-10 text-gray-400" />
                              </motion.div>
                              <h3 className="text-xl font-luxdrop font-black text-white mb-2 uppercase tracking-wide">
                                Pronto para verificar
                              </h3>
                              <p className="text-white/70">Preencha os campos e clique em "Verificar Hash"</p>
                            </div>
                          ) : null}
                        </div>
                      </div>

                  {/* Verification Result */}
                  {verificationResult && (
                    <motion.div
                      className={cn(
                        "border rounded-2xl p-6",
                        verificationResult.matches === false
                          ? "bg-red-urgency/10 border-red-500/30"
                          : "bg-green-success/10 border-green-400/30"
                      )}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        {verificationResult.matches === false ? (
                          <AlertCircle className="w-6 h-6 text-red-400" />
                        ) : (
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        )}
                        <h3 className={cn(
                          "text-lg font-semibold",
                          verificationResult.matches === false ? "text-red-400" : "text-green-400"
                        )}>
                          {verificationResult.matches === false 
                            ? "Hash Não Confere!" 
                            : verificationResult.matches === true
                            ? "Hash Verificado com Sucesso!"
                            : "Hash Calculado"
                          }
                        </h3>
                      </div>

                      {/* Calculated Hash */}
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-white">Hash Calculado:</span>
                            <button
                              onClick={() => handleCopyHash(verificationResult.calculatedHash, 'Hash calculado')}
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              {copiedHash === verificationResult.calculatedHash ? (
                                <Check className="w-4 h-4 text-green-400" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                          <div className="bg-dark-100 rounded-lg p-3 font-mono text-sm text-white break-all">
                            {verificationResult.calculatedHash}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                          <div>
                            <span className="text-sm text-gray-400">Valor Aleatório:</span>
                            <div className="text-lg font-semibold text-white">
                              {verificationResult.randomValue.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-400">Verificado em:</span>
                            <div className="text-sm text-gray-300">
                              {formatDate(verificationResult.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
                  </GamingContainer>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </section>
        </div>

      {/* Transparency Modal */}
      <TransparencyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        caixaId={selectedCaixa?.id}
        caixaNome={selectedCaixa?.nome}
      />
    </div>
  )
}

export default TransparenciaPage