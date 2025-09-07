import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  CreditCard, 
  Copy, 
  Check, 
  Clock, 
  Wallet,
  ArrowRight,
  Shield,
  AlertCircle,
  QrCode
} from 'lucide-react'

// Components
import { LoadingSpinner } from '../ui/LoadingSkeleton'
import RaridadeBadge from '../ui/RaridadeBadge'

// Hooks
import { useNotifications, useUser } from '../../stores/useAppStore'
import { useApi } from '../../hooks/useApi'

// Utils
import { formatCurrency, formatTime, triggerHaptic, cn } from '../../lib/utils'

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  caixa,
  onPaymentSuccess 
}) => {
  const [paymentStep, setPaymentStep] = useState('select') // select, pix, processing, success
  const [copiedPix, setCopiedPix] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(15 * 60) // 15 minutos
  const [paymentData, setPaymentData] = useState(null)
  
  const timerRef = useRef(null)
  const pollRef = useRef(null)
  
  const { addNotification } = useNotifications()
  const { user, updateUser } = useUser()

  // Hooks de pagamento - usar apenas mutate, não usar no useEffect
  const { mutate: criarPagamento, loading: creatingPayment } = useApi('/pagamentos/criar', {
    enabled: false // Importante: não executar automaticamente
  })

  const { mutate: verificarStatus } = useApi('/pagamentos/status', {
    enabled: false // Importante: não executar automaticamente
  })

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [])

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPaymentStep('select')
      setPaymentData(null)
      setCopiedPix(false)
      setTimeRemaining(15 * 60)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [isOpen])

  const startTimer = (expiraEm) => {
    const expirationTime = new Date(expiraEm).getTime()
    
    timerRef.current = setInterval(() => {
      const now = Date.now()
      const remaining = Math.max(0, Math.floor((expirationTime - now) / 1000))
      
      setTimeRemaining(remaining)
      
      if (remaining <= 0) {
        clearInterval(timerRef.current)
        handlePaymentExpired()
      }
    }, 1000)
  }

  const startPolling = (gatewayId) => {
    // Poll a cada 3 segundos para verificar status
    pollRef.current = setInterval(async () => {
      try {
        const result = await verificarStatus({ gatewayId })
        
        if (result.status === 'aprovado') {
          handlePaymentSuccess(result)
        } else if (result.status === 'expirado' || result.status === 'cancelado') {
          handlePaymentFailure(result.status)
        }
      } catch (error) {
        console.error('Erro ao verificar status:', error)
      }
    }, 3000)
  }

  const handleSelectPaymentMethod = async (method) => {
    if (method === 'pix') {
      triggerHaptic('light')
      
      try {
        const result = await criarPagamento({
          caixaId: caixa.id,
          metodo: 'pix',
          valor: caixa.preco
        })
        
        setPaymentData(result)
        setPaymentStep('pix')
        startTimer(result.expiraEm)
        startPolling(result.gatewayId)
        
      } catch (error) {
        console.error('Erro ao criar pagamento:', error)
        addNotification({
          type: 'error',
          title: 'Erro no Pagamento',
          message: error.message || 'Erro ao criar pagamento'
        })
      }
    }
  }

  const handleCopyPix = async () => {
    if (!paymentData?.pixCopiaCola) return
    
    try {
      await navigator.clipboard.writeText(paymentData.pixCopiaCola)
      setCopiedPix(true)
      triggerHaptic('light')
      
      addNotification({
        type: 'success',
        title: 'PIX copiado!',
        message: 'Código PIX copiado para área de transferência'
      })

      setTimeout(() => setCopiedPix(false), 3000)
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erro ao copiar código PIX'
      })
    }
  }

  const handlePaymentSuccess = (data) => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (pollRef.current) clearInterval(pollRef.current)
    
    setPaymentStep('success')
    
    // Atualizar saldo do usuário se fornecido
    if (data.novoSaldo !== undefined) {
      updateUser({ saldo: data.novoSaldo })
    }
    
    triggerHaptic('heavy')
    
    addNotification({
      type: 'success',
      title: '🎉 Pagamento Aprovado!',
      message: 'Sua caixa está pronta para ser aberta!'
    })

    // Chamar callback de sucesso
    setTimeout(() => {
      onPaymentSuccess?.(data)
    }, 2000)
  }

  const handlePaymentFailure = (status) => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (pollRef.current) clearInterval(pollRef.current)
    
    const message = status === 'expirado' 
      ? 'Tempo de pagamento expirado'
      : 'Pagamento cancelado'
    
    addNotification({
      type: 'error',
      title: 'Pagamento não processado',
      message
    })
    
    setPaymentStep('select')
    setPaymentData(null)
  }

  const handlePaymentExpired = () => {
    handlePaymentFailure('expirado')
  }

  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (!isOpen || !caixa) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-gaming z-50 flex items-end justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={paymentStep === 'select' ? onClose : undefined}
      >
        <motion.div
          className="bg-black/90 backdrop-blur-gaming rounded-t-3xl border-t border-white/10 w-full max-w-lg max-h-[90vh] overflow-hidden shadow-gaming"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-black/90 backdrop-blur-gaming border-b border-white/10 z-10">
            <div className="flex items-center justify-between p-4">
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white mb-1">
                  {paymentStep === 'success' ? '🎉 Pagamento Aprovado!' : '💳 Finalizar Compra'}
                </h2>
                <p className="text-sm text-gray-300">
                  {caixa.nome}
                </p>
              </div>
              
              {paymentStep === 'select' && (
                <button
                  onClick={onClose}
                  className="btn-ghost p-2"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </div>

            {/* Timer */}
            {paymentStep === 'pix' && timeRemaining > 0 && (
              <div className="px-4 pb-3">
                <div className="flex items-center gap-2 text-center justify-center">
                  <Clock className="w-4 h-4 text-gold-primary" />
                  <span className="text-sm font-mono text-gold-primary">
                    Expira em {formatTimer(timeRemaining)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1">
            {/* Step: Select Payment Method */}
            {paymentStep === 'select' && (
              <div className="p-6 space-y-6">
                {/* Caixa Info */}
                <div className="bg-black/30 backdrop-blur-gaming rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center gap-4">
                    <img
                      src={caixa.imagemUrl}
                      alt={caixa.nome}
                      className="w-16 h-16 object-cover rounded-xl border border-gray-600"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                    <div className="w-16 h-16 bg-gray-700 rounded-xl border border-gray-600 items-center justify-center hidden">
                      <CreditCard className="w-6 h-6 text-gray-400" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-white mb-1">
                        {caixa.nome}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <RaridadeBadge raridade={caixa.raridade} size="sm" />
                        <span className="text-xs text-gray-400">
                          {caixa.totalItens} itens
                        </span>
                      </div>
                      <div className="text-xl font-bold text-green-success">
                        {formatCurrency(caixa.preco)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <h3 className="text-base font-semibold text-white mb-4">
                    Escolha o método de pagamento
                  </h3>
                  
                  <div className="space-y-3">
                    {/* PIX */}
                    <button
                      onClick={() => handleSelectPaymentMethod('pix')}
                      disabled={creatingPayment}
                      className="w-full bg-black/30 backdrop-blur-gaming hover:bg-black/40 border border-white/10 hover:border-white/20 rounded-2xl p-4 transition-all duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                          <QrCode className="w-6 h-6 text-white" />
                        </div>
                        
                        <div className="flex-1 text-left">
                          <h4 className="text-base font-semibold text-white mb-1">
                            PIX
                          </h4>
                          <p className="text-sm text-gray-300">
                            Pagamento instantâneo • Disponível 24h
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {creatingPayment ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <ArrowRight className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Future payment methods */}
                    <div className="opacity-50 pointer-events-none">
                      <div className="w-full bg-black/30 backdrop-blur-gaming border border-white/10 rounded-2xl p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-gray-400" />
                          </div>
                          
                          <div className="flex-1 text-left">
                            <h4 className="text-base font-semibold text-gray-400 mb-1">
                              Cartão de Crédito
                            </h4>
                            <p className="text-sm text-gray-500">
                              Em breve • Parcelamento disponível
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Info */}
                <div className="bg-blue-trust/10 border border-blue-400/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-blue-400 mb-1">
                        Pagamento Seguro
                      </h4>
                      <p className="text-xs text-blue-300 leading-relaxed">
                        Seus dados são protegidos com criptografia SSL e não armazenamos informações sensíveis.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step: PIX Payment */}
            {paymentStep === 'pix' && paymentData && (
              <div className="p-6 space-y-6">
                {/* QR Code */}
                <div className="text-center">
                  <div className="inline-block bg-white p-4 rounded-2xl mb-4">
                    <img
                      src={paymentData.qrCodeUrl}
                      alt="QR Code PIX"
                      className="w-48 h-48 mx-auto"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'block'
                      }}
                    />
                    <div className="w-48 h-48 bg-gray-200 rounded-lg items-center justify-center text-gray-500 hidden">
                      QR Code indisponível
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-2">
                    Escaneie o QR Code com seu app bancário
                  </p>
                  <p className="text-xs text-gray-400">
                    ou copie e cole o código PIX
                  </p>
                </div>

                {/* PIX Code */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Código PIX Copia e Cola
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={paymentData.pixCopiaCola || ''}
                      readOnly
                      className="w-full bg-black/30 backdrop-blur-gaming border border-white/10 rounded-xl px-4 py-3 pr-12 text-white text-sm font-mono"
                    />
                    <button
                      onClick={handleCopyPix}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors"
                      aria-label="Copiar código PIX"
                    >
                      {copiedPix ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-black/30 backdrop-blur-gaming rounded-2xl p-4 border border-white/10">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Valor</p>
                      <p className="text-base font-bold text-green-success">
                        {formatCurrency(paymentData.valor)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Status</p>
                      <p className="text-base font-semibold text-gold-primary">
                        Aguardando
                      </p>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-trust/10 border border-blue-400/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-blue-400 mb-2">
                        Como pagar:
                      </h4>
                      <ol className="text-xs text-blue-300 space-y-1 list-decimal list-inside">
                        <li>Abra seu app bancário</li>
                        <li>Escolha a opção PIX</li>
                        <li>Escaneie o QR Code ou cole o código</li>
                        <li>Confirme o pagamento</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Processing Indicator */}
                <div className="text-center py-4">
                  <LoadingSpinner size="md" className="mb-2" />
                  <p className="text-sm text-gray-300">
                    Aguardando pagamento...
                  </p>
                </div>
              </div>
            )}

            {/* Step: Success */}
            {paymentStep === 'success' && (
              <div className="p-6 text-center space-y-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-success rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">
                    Pagamento Aprovado!
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Sua caixa está pronta para ser aberta.<br />
                    Prepare-se para descobrir seu prêmio!
                  </p>
                </div>

                <div className="bg-green-success/10 border border-green-400/20 rounded-xl p-4">
                  <p className="text-sm text-green-400 text-center">
                    🎁 Redirecionando para abertura da caixa...
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default PaymentModal