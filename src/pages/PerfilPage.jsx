import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  Package,
  History,
  CreditCard,
  Plus,
  Minus,
  RefreshCw,
  X,
  QrCode,
  Download
} from 'lucide-react'

// Components
import { CompactItemCard } from '../components/cards/ItemCard'
import { ListLoadingSkeleton, LoadingSpinner } from '../components/ui/LoadingSkeleton'
import TransparencyModal from '../components/modals/TransparencyModal'
import RaridadeBadge from '../components/ui/RaridadeBadge'
import { MysteryBox, CasinoPokerChip, TreasureChest, DiamondBox } from '../components/ui/CasinoIcons'
import GamingButton from '../components/ui/GamingButton'
import HorizontalLiveFeed from '../components/ui/HorizontalLiveFeed'

// Hooks
import { useUser, useNotifications } from '../stores/useAppStore'
import { UserAPI } from '../lib/userAPI'
import { CarteiraAPI } from '../lib/carteiraAPI'

// Utils
import { formatCurrency, formatDate, triggerHaptic, cn } from '../lib/utils'

const PerfilPage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('perfil') // perfil, carteira, itens, historico
  const [showTransparency, setShowTransparency] = useState(false)
  const [selectedCompra, setSelectedCompra] = useState(null)
  const [copiedId, setCopiedId] = useState('')
  
  // Estados para dados reais
  const [perfilData, setPerfilData] = useState(null)
  const [itensGanhos, setItensGanhos] = useState([])
  const [historico, setHistorico] = useState([])
  const [historicoCarteira, setHistoricoCarteira] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Estados para carteira
  const [showDeposito, setShowDeposito] = useState(false)
  const [showSaque, setShowSaque] = useState(false)
  const [valorDeposito, setValorDeposito] = useState('')
  const [valorSaque, setValorSaque] = useState('')
  const [pixChave, setPixChave] = useState('')
  const [tipoChave, setTipoChave] = useState('cpf')
  const [qrCodeData, setQrCodeData] = useState(null)
  const [loadingPagamento, setLoadingPagamento] = useState(false)
  const [saldoAtual, setSaldoAtual] = useState(0)
  
  const { user, logout, isAuthenticated } = useUser()
  const { addNotification } = useNotifications()

  // Proteção: Redirecionar se não autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
  }, [isAuthenticated, navigate])

  // Se não autenticado, não renderizar nada
  if (!isAuthenticated) {
    return null
  }

  // Carregar dados do perfil
  useEffect(() => {
    if (user?.id) {
      carregarDadosPerfil()
      atualizarSaldo()
    }
  }, [user?.id, activeTab])

  // Escutar mudanças de saldo no store Zustand
  useEffect(() => {
    if (user?.saldo !== undefined && user.saldo !== saldoAtual) {
      console.log('💳 Saldo atualizado no store, sincronizando perfil:', {
        saldoStore: user.saldo,
        saldoAtual: saldoAtual
      })
      setSaldoAtual(user.saldo)
    }
  }, [user?.saldo, saldoAtual])

  const carregarDadosPerfil = async () => {
    if (!user?.id) return

    setLoading(true)
    try {
      // Sempre carregar perfil básico
      const dadosPerfil = await UserAPI.buscarPerfil(user.id)
      setPerfilData(dadosPerfil)

      // Carregar dados específicos da aba ativa
      if (activeTab === 'itens') {
        const itens = await UserAPI.buscarItensGanhos(user.id)
        setItensGanhos(itens)
      } else if (activeTab === 'historico') {
        const hist = await UserAPI.buscarHistoricoCompras(user.id)
        setHistorico(hist)
      } else if (activeTab === 'carteira') {
        const histCarteira = await UserAPI.buscarHistoricoCarteira(user.id)
        setHistoricoCarteira(histCarteira)
      }

    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
      addNotification({
        type: 'error',
        title: 'Erro ao carregar dados',
        message: error.message || 'Tente novamente',
        duration: 5000
      })
    } finally {
      setLoading(false)
    }
  }

  const {
    usuario = {},
    estatisticas = {},
    ranking = {}
  } = perfilData || {}

  const nivelInfo = UserAPI.calcularNivel(usuario.pontosXp || 0)

  const handleCopyId = async (id) => {
    try {
      await navigator.clipboard.writeText(id)
      setCopiedId(id)
      triggerHaptic('success')
      addNotification({
        type: 'success',
        title: 'ID copiado!',
        message: 'ID da compra copiado para área de transferência',
        duration: 2000
      })
      setTimeout(() => setCopiedId(''), 2000)
    } catch (error) {
      console.error('Erro ao copiar:', error)
    }
  }

  const handleLogout = async () => {
    triggerHaptic('medium')
    
    try {
      // Fazer logout no Supabase
      const { supabase } = await import('../lib/supabase')
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('❌ Erro ao fazer logout no Supabase:', error)
      }
      
      // Limpar estado local
      logout()
      
      // Redirecionar para login
      navigate('/login', { replace: true })
      
    } catch (error) {
      console.error('❌ Erro durante logout:', error)
      // Mesmo se houver erro, limpar estado local
      logout()
      navigate('/login', { replace: true })
    }
  }

  // Funções da Carteira
  const atualizarSaldo = async () => {
    try {
      const saldoInfo = await CarteiraAPI.buscarSaldo(user.id)
      setSaldoAtual(saldoInfo.saldoAtual)
    } catch (error) {
      console.error('Erro ao atualizar saldo:', error)
    }
  }

  // Função temporária para teste - adicionar R$ 100
  const adicionarSaldeTeste = async () => {
    try {
      // Usar função interna do CarteiraAPI para teste
      await CarteiraAPI.atualizarSaldo(user.id, 100, 'teste_saldo_manual')
      
      addNotification({
        type: 'success',
        title: '💰 Saldo Adicionado!',
        message: 'R$ 100,00 adicionados para teste',
        duration: 3000
      })
      
      // Atualizar interface
      await atualizarSaldo()
      await carregarDadosPerfil()
      
    } catch (error) {
      console.error('Erro ao adicionar saldo:', error)
      addNotification({
        type: 'error',
        title: 'Erro ao adicionar saldo',
        message: error.message || 'Tente novamente',
        duration: 3000
      })
    }
  }

  const handleDeposito = async () => {
    const valor = parseFloat(valorDeposito.replace(',', '.'))
    
    if (!valor || valor < 1) {
      addNotification({
        type: 'error',
        title: 'Valor inválido',
        message: 'Valor mínimo para depósito é R$ 1,00',
        duration: 3000
      })
      return
    }

    if (valor > 5000) {
      addNotification({
        type: 'error',
        title: 'Valor muito alto',
        message: 'Valor máximo para depósito é R$ 5.000,00',
        duration: 3000
      })
      return
    }

    setLoadingPagamento(true)
    triggerHaptic('medium')

    try {
      const resultado = await CarteiraAPI.criarDepositoPIX({
        usuarioId: user.id,
        valor,
        descricao: 'Depósito via PIX'
      })

      setQrCodeData(resultado)
      
      addNotification({
        type: 'success',
        title: 'PIX Gerado!',
        message: 'QR Code criado. Pague para adicionar saldo.',
        duration: 5000
      })

      // Monitorar pagamento
      CarteiraAPI.monitorarPagamento(resultado.id, (status) => {
        if (status.status === 'confirmado') {
          addNotification({
            type: 'success',
            title: '🎉 Pagamento Confirmado!',
            message: `R$ ${valor.toFixed(2)} adicionado ao seu saldo`,
            duration: 5000
          })
          setShowDeposito(false)
          setQrCodeData(null)
          setValorDeposito('')
          atualizarSaldo()
          carregarDadosPerfil()
        } else if (status.status === 'expirado') {
          addNotification({
            type: 'warning',
            title: 'PIX Expirado',
            message: 'Gere um novo PIX para fazer o depósito',
            duration: 5000
          })
          setQrCodeData(null)
        }
      })

    } catch (error) {
      console.error('Erro depósito:', error)
      addNotification({
        type: 'error',
        title: 'Erro no depósito',
        message: error.message || 'Tente novamente',
        duration: 5000
      })
    } finally {
      setLoadingPagamento(false)
    }
  }

  const handleSaque = async () => {
    const valor = parseFloat(valorSaque.replace(',', '.'))
    
    if (!valor || valor < 10) {
      addNotification({
        type: 'error',
        title: 'Valor inválido',
        message: 'Valor mínimo para saque é R$ 10,00',
        duration: 3000
      })
      return
    }

    if (!pixChave.trim()) {
      addNotification({
        type: 'error',
        title: 'Chave PIX obrigatória',
        message: 'Informe sua chave PIX para receber o saque',
        duration: 3000
      })
      return
    }

    setLoadingPagamento(true)
    triggerHaptic('medium')

    try {
      const resultado = await CarteiraAPI.solicitarSaque({
        usuarioId: user.id,
        valor,
        pixChave,
        tipoChave
      })

      addNotification({
        type: 'success',
        title: '💰 Saque Solicitado!',
        message: resultado.mensagem,
        duration: 8000
      })

      setShowSaque(false)
      setValorSaque('')
      setPixChave('')
      atualizarSaldo()
      carregarDadosPerfil()

    } catch (error) {
      console.error('Erro saque:', error)
      addNotification({
        type: 'error',
        title: 'Erro no saque',
        message: error.message || 'Tente novamente',
        duration: 5000
      })
    } finally {
      setLoadingPagamento(false)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    triggerHaptic('light')
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Você precisa fazer login para ver seu perfil</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-luxdrop-hero relative">
      {/* Live Feed Bar */}
      <HorizontalLiveFeed />
      
      {/* Main Content */}
      <div className="relative z-10 p-4 pb-24 pt-20">
        {/* Header do Perfil */}
        <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-gaming-display font-bold text-white mb-1">
                  {usuario.nome || user.nome}
                </h1>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Phone className="w-4 h-4" />
                  <span>{usuario.telefone || user.telefone}</span>
                </div>
              </div>
            </div>
            
            <GamingButton
              variant="outline"
              size="sm"
              onClick={handleLogout}
              icon={LogOut}
            >
              Sair
            </GamingButton>
          </div>

          {/* Estatísticas Rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/30 rounded-xl p-3 text-center">
              <Wallet className="w-6 h-6 text-green-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">
                {formatCurrency(usuario.saldo || user.saldo || 0)}
              </p>
              <p className="text-xs text-gray-400">Saldo</p>
            </div>
            
            <div className="bg-black/30 rounded-xl p-3 text-center">
              <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">{nivelInfo.nivelAtual?.nivel || 1}</p>
              <p className="text-xs text-gray-400">{nivelInfo.nivelAtual?.titulo || 'Novato'}</p>
            </div>
            
            <div className="bg-black/30 rounded-xl p-3 text-center">
              <Package className="w-6 h-6 text-purple-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">{estatisticas.totalCompras || 0}</p>
              <p className="text-xs text-gray-400">Caixas</p>
            </div>
            
            <div className="bg-black/30 rounded-xl p-3 text-center">
              <Gift className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">{estatisticas.itensGanhos || 0}</p>
              <p className="text-xs text-gray-400">Prêmios</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs de Navegação */}
      <div className="mb-6">
        <div className="flex gap-2 bg-black/30 p-2 rounded-xl backdrop-blur-md border border-gray-700">
          {[
            { id: 'perfil', label: 'Perfil', icon: User },
            { id: 'carteira', label: 'Carteira', icon: Wallet },
            { id: 'itens', label: 'Itens', icon: Gift },
            { id: 'historico', label: 'Histórico', icon: History }
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200",
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Conteúdo das Abas */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {loading ? (
            <ListLoadingSkeleton />
          ) : (
            <>
              {/* Aba Perfil */}
              {activeTab === 'perfil' && (
                <div className="space-y-4">
                  {/* Informações Pessoais */}
                  <div className="bg-dark-50 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Informações Pessoais
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-1 block">Nome</label>
                        <p className="text-white font-medium">{usuario.nome}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm text-gray-400 mb-1 block">Telefone</label>
                        <p className="text-white font-medium">{usuario.telefone}</p>
                      </div>
                      
                      {usuario.email && (
                        <div>
                          <label className="text-sm text-gray-400 mb-1 block">Email</label>
                          <p className="text-white font-medium">{usuario.email}</p>
                        </div>
                      )}
                      
                      <div>
                        <label className="text-sm text-gray-400 mb-1 block">Membro desde</label>
                        <p className="text-white font-medium">
                          {usuario.criadoEm ? formatDate(usuario.criadoEm) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progresso de Nível */}
                  <div className="bg-dark-50 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Progresso
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Nível Atual</span>
                        <span className="text-xl font-bold text-yellow-400">
                          {nivelInfo.nivelAtual?.nivel} - {nivelInfo.nivelAtual?.titulo}
                        </span>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                          <span>Progresso para próximo nível</span>
                          <span>{nivelInfo.progressoAtual}%</span>
                        </div>
                        <div className="bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${nivelInfo.progressoAtual}%` }}
                          />
                        </div>
                        {nivelInfo.proximoNivel && (
                          <p className="text-xs text-gray-400 mt-2">
                            {nivelInfo.xpParaProximo} XP para {nivelInfo.proximoNivel.titulo}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Aba Carteira */}
              {activeTab === 'carteira' && (
                <div className="space-y-4">
                  {/* Resumo da Carteira */}
                  <div className="bg-dark-50 border border-gray-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Wallet className="w-5 h-5" />
                        Minha Carteira
                      </h3>
                      <div className="flex gap-2">
                        <GamingButton
                          variant="primary"
                          size="sm"
                          onClick={() => setShowDeposito(true)}
                          icon={Plus}
                          className="px-3"
                        >
                          Depositar
                        </GamingButton>
                        <GamingButton
                          variant="outline"
                          size="sm"
                          onClick={() => setShowSaque(true)}
                          icon={Minus}
                          className="px-3"
                          disabled={!usuario.verificado}
                        >
                          Sacar
                        </GamingButton>
                      </div>
                    </div>
                    
                    {/* Saldo Atual Destaque */}
                    <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-xl p-6 mb-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-300 mb-2">Saldo Disponível</p>
                        <p className="text-4xl font-bold text-white mb-2">
                          {formatCurrency(saldoAtual || usuario.saldo || 0)}
                        </p>
                        <button 
                          onClick={atualizarSaldo}
                          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mx-auto transition-colors"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Atualizar saldo
                        </button>
                      </div>
                      
                      {!usuario.verificado && (
                        <div className="mt-4 pt-4 border-t border-blue-500/20">
                          <p className="text-xs text-yellow-400 text-center flex items-center justify-center gap-1">
                            <Crown className="w-3 h-3" />
                            Verifique sua conta para saques
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                        <TrendingUp className="w-6 h-6 text-green-400 mb-2" />
                        <p className="text-2xl font-bold text-green-400">
                          {formatCurrency(usuario.totalGanho || 0)}
                        </p>
                        <p className="text-sm text-gray-300">Total Ganho</p>
                      </div>
                      
                      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                        <TrendingUp className="w-6 h-6 text-red-400 mb-2 rotate-180" />
                        <p className="text-2xl font-bold text-red-400">
                          {formatCurrency(usuario.totalGasto || 0)}
                        </p>
                        <p className="text-sm text-gray-300">Total Gasto</p>
                      </div>
                      
                      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                        <Wallet className="w-6 h-6 text-blue-400 mb-2" />
                        <p className="text-2xl font-bold text-blue-400">
                          {formatCurrency(((usuario.totalGanho || 0) - (usuario.totalGasto || 0)))}
                        </p>
                        <p className="text-sm text-gray-300">Lucro/Prejuízo</p>
                      </div>
                    </div>
                  </div>

                  {/* Histórico de Transações */}
                  <div className="bg-dark-50 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Histórico de Transações</h3>
                    
                    {historicoCarteira.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">Nenhuma transação encontrada</p>
                    ) : (
                      <div className="space-y-3">
                        {historicoCarteira.map((transacao, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "p-2 rounded-lg",
                                transacao.tipo === 'entrada' ? "bg-green-500/20" : "bg-red-500/20"
                              )}>
                                {transacao.tipo === 'entrada' ? (
                                  <CreditCard className="w-4 h-4 text-green-400" />
                                ) : (
                                  <Package className="w-4 h-4 text-red-400" />
                                )}
                              </div>
                              
                              <div>
                                <p className="text-white font-medium">{transacao.descricao}</p>
                                <p className="text-xs text-gray-400">
                                  {formatDate(transacao.data)}
                                </p>
                              </div>
                            </div>
                            
                            <p className={cn(
                              "font-bold",
                              transacao.tipo === 'entrada' ? "text-green-400" : "text-red-400"
                            )}>
                              {transacao.tipo === 'entrada' ? '+' : '-'}{formatCurrency(transacao.valor)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Aba Itens */}
              {activeTab === 'itens' && (
                <div className="space-y-4">
                  <div className="bg-dark-50 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Seus Prêmios</h3>
                    
                    {itensGanhos.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">Nenhum item ganho ainda</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {itensGanhos.map((item, index) => (
                          <CompactItemCard 
                            key={`${item.id}-${index}`}
                            item={item}
                            showProbability={false}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Aba Histórico */}
              {activeTab === 'historico' && (
                <div className="space-y-4">
                  <div className="bg-dark-50 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Histórico de Compras</h3>
                    
                    {historico.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">Nenhuma compra realizada</p>
                    ) : (
                      <div className="space-y-3">
                        {historico.map((compra) => (
                          <div key={compra.id} className="bg-black/30 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="text-white font-medium">{compra.caixa?.nome}</h4>
                                <p className="text-sm text-gray-400">
                                  {formatDate(compra.criadaEm)}
                                </p>
                              </div>
                              
                              <div className="text-right">
                                <p className="text-red-400 font-bold">
                                  -{formatCurrency(compra.valorPago)}
                                </p>
                                {compra.valorGanho > 0 && (
                                  <p className="text-green-400 font-bold text-sm">
                                    +{formatCurrency(compra.valorGanho)}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            {compra.itemGanho && (
                              <div className="border-t border-gray-600 pt-3 mt-3">
                                <div className="flex items-center gap-3">
                                  <RaridadeBadge raridade={compra.itemGanho.raridade} size="sm" />
                                  <span className="text-white font-medium">{compra.itemGanho.nome}</span>
                                </div>
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
                              <span className={cn(
                                "text-xs px-2 py-1 rounded-full font-medium",
                                compra.status === 'aberta' ? "bg-green-500/20 text-green-400" :
                                compra.status === 'enviada' ? "bg-blue-500/20 text-blue-400" :
                                compra.status === 'entregue' ? "bg-purple-500/20 text-purple-400" :
                                "bg-gray-500/20 text-gray-400"
                              )}>
                                {compra.status === 'aberta' ? 'Aberta' :
                                 compra.status === 'enviada' ? 'Enviada' :
                                 compra.status === 'entregue' ? 'Entregue' :
                                 'Criada'}
                              </span>
                              
                              <button
                                onClick={() => handleCopyId(compra.id)}
                                className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                              >
                                {copiedId === compra.id ? (
                                  <Check className="w-3 h-3" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                                ID: {compra.id.slice(0, 8)}...
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Modal de Transparência */}
      {showTransparency && selectedCompra && (
        <TransparencyModal 
          compra={selectedCompra}
          onClose={() => setShowTransparency(false)}
        />
      )}

      {/* Modal de Depósito PIX */}
      <AnimatePresence>
        {showDeposito && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-dark-100 border border-gray-700 rounded-2xl w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Depositar via PIX
                </h3>
                <button 
                  onClick={() => { setShowDeposito(false); setQrCodeData(null) }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!qrCodeData ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-300 block mb-2">Valor do Depósito</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                      <input
                        type="text"
                        value={valorDeposito}
                        onChange={(e) => setValorDeposito(e.target.value)}
                        placeholder="0,00"
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                        disabled={loadingPagamento}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Mínimo: R$ 1,00 | Máximo: R$ 5.000,00</p>
                  </div>

                  <div className="flex gap-3">
                    <GamingButton
                      variant="outline"
                      size="sm"
                      onClick={() => setValorDeposito('10')}
                      className="flex-1"
                    >
                      R$ 10
                    </GamingButton>
                    <GamingButton
                      variant="outline"
                      size="sm"
                      onClick={() => setValorDeposito('50')}
                      className="flex-1"
                    >
                      R$ 50
                    </GamingButton>
                    <GamingButton
                      variant="outline"
                      size="sm"
                      onClick={() => setValorDeposito('100')}
                      className="flex-1"
                    >
                      R$ 100
                    </GamingButton>
                  </div>

                  <GamingButton
                    variant="primary"
                    size="lg"
                    onClick={handleDeposito}
                    loading={loadingPagamento}
                    disabled={loadingPagamento}
                    icon={QrCode}
                    className="w-full"
                  >
                    Gerar PIX
                  </GamingButton>
                </div>
              ) : (
                <div className="space-y-4 text-center">
                  <div className="bg-white p-4 rounded-xl">
                    <div className="text-6xl leading-none font-mono text-black break-all">
                      {/* QR Code seria renderizado aqui */}
                      QR CODE
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-300 mb-2">PIX Copia e Cola</p>
                    <div className="bg-dark-200 border border-gray-600 rounded-lg p-3 text-xs text-gray-300 font-mono break-all">
                      {qrCodeData.copiaCola}
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText(qrCodeData.copiaCola)}
                      className="text-xs text-blue-400 hover:text-blue-300 mt-2 flex items-center gap-1 mx-auto transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      Copiar código PIX
                    </button>
                  </div>

                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                    <p className="text-yellow-400 text-sm font-medium mb-1">Valor: {formatCurrency(qrCodeData.valor)}</p>
                    <p className="text-xs text-gray-300">PIX expira em 30 minutos</p>
                  </div>

                  <p className="text-xs text-gray-400">
                    O saldo será adicionado automaticamente após confirmação do pagamento.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
        )}
      </AnimatePresence>

      {/* Modal de Saque PIX */}
      <AnimatePresence>
        {showSaque && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-dark-100 border border-gray-700 rounded-2xl w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Minus className="w-5 h-5" />
                  Sacar via PIX
                </h3>
                <button 
                  onClick={() => setShowSaque(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-300 block mb-2">Valor do Saque</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                    <input
                      type="text"
                      value={valorSaque}
                      onChange={(e) => setValorSaque(e.target.value)}
                      placeholder="0,00"
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                      disabled={loadingPagamento}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Mínimo: R$ 10,00 | Disponível: {formatCurrency(saldoAtual || usuario.saldo || 0)}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-300 block mb-2">Tipo da Chave PIX</label>
                  <select
                    value={tipoChave}
                    onChange={(e) => setTipoChave(e.target.value)}
                    className="w-full p-3 bg-white/10 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                    disabled={loadingPagamento}
                  >
                    <option value="cpf">CPF</option>
                    <option value="email">Email</option>
                    <option value="telefone">Telefone</option>
                    <option value="aleatoria">Chave Aleatória</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-300 block mb-2">Chave PIX</label>
                  <input
                    type="text"
                    value={pixChave}
                    onChange={(e) => setPixChave(e.target.value)}
                    placeholder={
                      tipoChave === 'cpf' ? '000.000.000-00' :
                      tipoChave === 'email' ? 'seu@email.com' :
                      tipoChave === 'telefone' ? '(11) 99999-9999' :
                      'chave-aleatoria-uuid'
                    }
                    className="w-full p-3 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    disabled={loadingPagamento}
                  />
                </div>

                {!usuario.verificado && (
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                    <p className="text-yellow-400 text-sm font-medium flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      Conta não verificada
                    </p>
                    <p className="text-xs text-gray-300 mt-1">
                      Para realizar saques, você precisa verificar sua conta primeiro.
                    </p>
                  </div>
                )}

                <GamingButton
                  variant="primary"
                  size="lg"
                  onClick={handleSaque}
                  loading={loadingPagamento}
                  disabled={loadingPagamento || !usuario.verificado}
                  icon={Download}
                  className="w-full"
                >
                  Solicitar Saque
                </GamingButton>

                <p className="text-xs text-gray-400 text-center">
                  Saques são processados em até 2 dias úteis.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
        )}
      </AnimatePresence>
      </div>
    </div>
  )
}

export default PerfilPage