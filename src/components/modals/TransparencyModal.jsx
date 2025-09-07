import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Shield, 
  Eye, 
  Copy, 
  Check, 
  RotateCcw,
  Calculator,
  Hash,
  Clock
} from 'lucide-react'

// Components
import { TransparencyItemCard } from '../cards/ItemCard'
import { LoadingSpinner } from '../ui/LoadingSkeleton'
import RaridadeBadge from '../ui/RaridadeBadge'

// Hooks
import { useNotifications } from '../../stores/useAppStore'
import { useApi } from '../../hooks/useApi'

// Utils
import { formatCurrency, formatPercentage, triggerHaptic, cn } from '../../lib/utils'

const TransparencyModal = ({ 
  isOpen, 
  onClose, 
  caixaId, 
  caixaNome,
  compraId = null // Se fornecido, mostra resultado específico
}) => {
  const [activeTab, setActiveTab] = useState('itens')
  const [copiedHash, setCopiedHash] = useState('')
  const [showProof, setShowProof] = useState(false)
  
  const { addNotification } = useNotifications()
  
  // Buscar dados de transparência
  const { 
    data: transparencia, 
    loading, 
    error,
    refetch 
  } = useApi(`/transparencia/caixa/${caixaId}${compraId ? `?compraId=${compraId}` : ''}`)

  const {
    data: proofData,
    loading: proofLoading
  } = useApi(
    compraId ? `/transparencia/prova/${compraId}` : null,
    { enabled: showProof && compraId }
  )

  useEffect(() => {
    if (isOpen && caixaId) {
      refetch()
    }
  }, [isOpen, caixaId, refetch])

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

  const handleShowProof = () => {
    setShowProof(true)
    triggerHaptic('medium')
  }

  if (!isOpen) return null

  const tabs = [
    { id: 'itens', label: 'Itens', icon: Eye },
    { id: 'estatisticas', label: 'Stats', icon: Calculator },
    ...(compraId ? [{ id: 'prova', label: 'Prova Fair', icon: Shield }] : [])
  ]

  return (
    <AnimatePresence>
      <motion.div
        className="modal-gaming-backdrop flex items-end justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-gaming-content rounded-t-3xl border-t border-white/10 w-full max-w-lg h-[90vh] flex flex-col"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 modal-gaming-content border-b border-white/10 z-10">
            <div className="flex items-center justify-between p-4">
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white mb-1">
                  Sistema de Transparência
                </h2>
                <p className="text-sm text-gray-300">
                  {caixaNome}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => refetch()}
                  className="btn-ghost p-2"
                  disabled={loading}
                  aria-label="Atualizar dados"
                >
                  <RotateCcw className={cn(
                    "w-4 h-4 text-gray-400",
                    loading && "animate-spin"
                  )} />
                </button>
                
                <button
                  onClick={onClose}
                  className="btn-ghost p-2"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors",
                      activeTab === tab.id
                        ? "text-blue-400 border-b-2 border-blue-400"
                        : "text-gray-400 hover:text-gray-300"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <LoadingSpinner size="lg" className="mb-4" />
                  <p className="text-gray-400">Carregando dados...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-red-400 mb-4">Erro ao carregar dados</p>
                  <button
                    onClick={() => refetch()}
                    className="btn-secondary"
                  >
                    Tentar novamente
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Tab: Itens */}
                {activeTab === 'itens' && (
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-4 space-y-4">
                    {transparencia?.itens?.length > 0 ? (
                      <>
                        <div className="text-center mb-6">
                          <div className="inline-flex items-center gap-2 bg-green-success/10 border border-green-400/20 rounded-full px-4 py-2">
                            <Shield className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-medium text-green-400">
                              Sistema Provably Fair Ativo
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {transparencia.itens.map((item, index) => (
                            <TransparencyItemCard key={item.item_id || item.id || index} item={{
                              id: item.item_id || item.id,
                              nome: item.nome,
                              descricao: item.descricao,
                              marca: item.marca,
                              valor: item.valor,
                              raridade: item.raridade,
                              tipo: item.tipo,
                              imagemUrl: item.imagem_url || item.imagemUrl,
                              probabilidade: item.probabilidade,
                              chancesExibir: item.chances || item.chancesExibir,
                              vezesGanho: item.vezes_ganho || item.vezesGanho || 0
                            }} />
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <Eye className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400">Nenhum item encontrado</p>
                      </div>
                    )}
                    </div>
                  </div>
                )}

                {/* Tab: Estatísticas */}
                {activeTab === 'estatisticas' && transparencia?.stats && (
                  <div className="p-4 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="card-gaming-base rounded-xl p-4 text-center">
                        <p className="text-xs text-gray-400 mb-1">Total de Itens</p>
                        <p className="text-2xl font-bold text-white">
                          {transparencia.stats.totalItens}
                        </p>
                      </div>
                      
                      <div className="card-gaming-base rounded-xl p-4 text-center">
                        <p className="text-xs text-gray-400 mb-1">Valor Total</p>
                        <p className="text-2xl font-bold text-green-success">
                          {formatCurrency(transparencia.stats.valorTotal)}
                        </p>
                      </div>
                      
                      <div className="card-gaming-base rounded-xl p-4 text-center">
                        <p className="text-xs text-gray-400 mb-1">Raridade Média</p>
                        <div className="flex justify-center">
                          <RaridadeBadge raridade={transparencia.stats.raridadeMedia} />
                        </div>
                      </div>
                      
                      <div className="card-gaming-base rounded-xl p-4 text-center">
                        <p className="text-xs text-gray-400 mb-1">Caixas Abertas</p>
                        <p className="text-2xl font-bold text-blue-400">
                          {transparencia.stats.totalAbertas || 0}
                        </p>
                      </div>
                    </div>

                    {/* Distribuição por Raridade */}
                    {transparencia.stats.distribuicaoRaridade && (
                      <div>
                        <h3 className="text-base font-semibold text-white mb-4">
                          Distribuição por Raridade
                        </h3>
                        <div className="space-y-3">
                          {Object.entries(transparencia.stats.distribuicaoRaridade).map(([raridade, data]) => (
                            <div key={raridade} className="card-gaming-base rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <RaridadeBadge raridade={raridade} />
                                <span className="text-sm font-semibold text-white">
                                  {formatPercentage(data.percentage)}
                                </span>
                              </div>
                              <div className="text-xs text-gray-400">
                                {data.quantidade} itens • Média: {formatCurrency(data.valorMedio)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab: Prova Provably Fair */}
                {activeTab === 'prova' && compraId && (
                  <div className="p-4 space-y-6">
                    {!showProof ? (
                      <div className="text-center py-8">
                        <Shield className="w-16 h-16 text-gold-primary mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">
                          Verificação Provably Fair
                        </h3>
                        <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                          Verifique matematicamente que o resultado da sua caixa foi justo e aleatório
                        </p>
                        <button
                          onClick={handleShowProof}
                          className="btn-primary"
                          disabled={proofLoading}
                        >
                          {proofLoading ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <>
                              <Calculator className="w-4 h-4" />
                              Gerar Prova
                            </>
                          )}
                        </button>
                      </div>
                    ) : proofData ? (
                      <div className="space-y-4">
                        {/* Resultado */}
                        <div className="bg-green-success/10 border border-green-400/20 rounded-xl p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                              <Check className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-green-400">
                                Resultado Verificado
                              </h3>
                              <p className="text-sm text-green-300">
                                Sua caixa foi aberta de forma justa
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Dados da Prova */}
                        <div className="space-y-4">
                          {/* Server Seed */}
                          <div className="card-gaming-base rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Hash className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-white">Server Seed</span>
                              </div>
                              <button
                                onClick={() => handleCopyHash(proofData.serverSeed, 'Server Seed')}
                                className="btn-ghost p-1"
                              >
                                {copiedHash === proofData.serverSeed ? (
                                  <Check className="w-4 h-4 text-green-400" />
                                ) : (
                                  <Copy className="w-4 h-4 text-gray-400" />
                                )}
                              </button>
                            </div>
                            <p className="text-xs text-gray-300 font-mono break-all">
                              {proofData.serverSeed}
                            </p>
                          </div>

                          {/* Client Seed */}
                          <div className="card-gaming-base rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Hash className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-white">Client Seed</span>
                              </div>
                              <button
                                onClick={() => handleCopyHash(proofData.clientSeed, 'Client Seed')}
                                className="btn-ghost p-1"
                              >
                                {copiedHash === proofData.clientSeed ? (
                                  <Check className="w-4 h-4 text-green-400" />
                                ) : (
                                  <Copy className="w-4 h-4 text-gray-400" />
                                )}
                              </button>
                            </div>
                            <p className="text-xs text-gray-300 font-mono break-all">
                              {proofData.clientSeed}
                            </p>
                          </div>

                          {/* Hash Resultado */}
                          <div className="card-gaming-base rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Hash className="w-4 h-4 text-gold-primary" />
                                <span className="text-sm font-medium text-white">Hash Final</span>
                              </div>
                              <button
                                onClick={() => handleCopyHash(proofData.resultHash, 'Hash Final')}
                                className="btn-ghost p-1"
                              >
                                {copiedHash === proofData.resultHash ? (
                                  <Check className="w-4 h-4 text-green-400" />
                                ) : (
                                  <Copy className="w-4 h-4 text-gray-400" />
                                )}
                              </button>
                            </div>
                            <p className="text-xs text-gray-300 font-mono break-all">
                              {proofData.resultHash}
                            </p>
                          </div>

                          {/* Timestamp */}
                          <div className="card-gaming-base rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-medium text-white">Timestamp</span>
                            </div>
                            <p className="text-xs text-gray-300">
                              {new Date(proofData.timestamp).toLocaleString('pt-BR')}
                            </p>
                          </div>
                        </div>

                        {/* Como Verificar */}
                        <div className="bg-blue-trust/10 border border-blue-400/20 rounded-xl p-4">
                          <h4 className="font-semibold text-blue-400 mb-2">
                            Como verificar manualmente:
                          </h4>
                          <ol className="text-xs text-blue-300 space-y-1 list-decimal list-inside">
                            <li>Copie o Server Seed e Client Seed</li>
                            <li>Use SHA-256 para criar hash: SHA256(serverSeed + clientSeed)</li>
                            <li>Compare com o Hash Final apresentado</li>
                            <li>Use os primeiros 8 caracteres do hash como número decimal</li>
                          </ol>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <LoadingSpinner size="lg" className="mb-4" />
                        <p className="text-gray-400">Gerando prova...</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default TransparencyModal