import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  User, 
  Phone, 
  LogIn,
  UserPlus,
  Gift,
  Sparkles,
  Shield,
  Zap,
  Mail,
  CreditCard,
  CheckSquare
} from 'lucide-react'

// Gaming Components
import GamingContainer from '../components/ui/GamingContainer'
import GamingButton from '../components/ui/GamingButton'
import HorizontalLiveFeed from '../components/ui/HorizontalLiveFeed'

// Hooks
import { useUser, useNotifications } from '../stores/useAppStore'
import { triggerHaptic } from '../lib/utils'
import { AuthService } from '../lib/auth'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useUser()
  const { addNotification } = useNotifications()
  
  const [formData, setFormData] = useState({
    telefone: '',
    nome: '',
    email: '',
    cpf: '',
    aceitaTermos: false
  })
  const [isRegistro, setIsRegistro] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const calcularIdade = (dataNascimento) => {
    if (!dataNascimento) return 0
    const hoje = new Date()
    const nascimento = new Date(dataNascimento)
    let idade = hoje.getFullYear() - nascimento.getFullYear()
    const mesAtual = hoje.getMonth()
    const mesNascimento = nascimento.getMonth()
    
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
      idade--
    }
    
    return idade
  }

  const handleSubmit = async () => {
    if (!formData.telefone.trim()) {
      addNotification({
        type: 'error',
        title: 'Campo obrigatório',
        message: 'Informe seu telefone',
        duration: 3000
      })
      return
    }

    if (isRegistro && !formData.nome.trim()) {
      addNotification({
        type: 'error',
        title: 'Campo obrigatório',
        message: 'Informe seu nome',
        duration: 3000
      })
      return
    }

    if (isRegistro && !formData.dataNascimento) {
      addNotification({
        type: 'error',
        title: 'Campo obrigatório',
        message: 'Informe sua data de nascimento',
        duration: 3000
      })
      return
    }

    if (isRegistro && calcularIdade(formData.dataNascimento) < 18) {
      addNotification({
        type: 'error',
        title: 'Idade mínima não atingida',
        message: 'Você deve ter 18 anos ou mais para se cadastrar',
        duration: 5000
      })
      return
    }

    if (isRegistro && !formData.aceitaTermos) {
      addNotification({
        type: 'error',
        title: 'Termos obrigatórios',
        message: 'Você deve aceitar os termos de uso (+18 anos)',
        duration: 5000
      })
      return
    }

    setLoading(true)
    triggerHaptic('medium')

    try {
      let result

      if (isRegistro) {
        // Registro de novo usuário
        result = await AuthService.registro({
          nome: formData.nome,
          telefone: formData.telefone,
          email: formData.email || null,
          dataNascimento: formData.dataNascimento || null
        })
        
        addNotification({
          type: 'success',
          title: '🎉 Conta criada!',
          message: `Bem-vindo, ${result.usuario.nome}!`,
          duration: 3000
        })
      } else {
        // Login de usuário existente
        result = await AuthService.login({
          telefone: formData.telefone
        })
        
        addNotification({
          type: 'success',
          title: '🎮 Login realizado!',
          message: `Bem-vindo de volta, ${result.usuario.nome}!`,
          duration: 3000
        })
      }

      // Fazer login no store
      login(result.usuario, result.token)
      
      // Navegar para home
      setTimeout(() => {
        navigate('/')
      }, 1000)

    } catch (error) {
      console.error('Erro no auth:', error)
      
      // Se erro for "usuário não encontrado" no login, sugerir registro
      if (error.message.includes('não encontrado') && !isRegistro) {
        addNotification({
          type: 'warning',
          title: 'Usuário não encontrado',
          message: 'Que tal se cadastrar? É rápido e grátis!',
          duration: 5000
        })
        setIsRegistro(true)
      } else {
        let errorMessage = 'Tente novamente em alguns instantes'
        
        // Mensagens mais específicas para diferentes tipos de erro
        if (error.message.includes('row-level security')) {
          errorMessage = 'Sistema temporariamente indisponível. Tente novamente mais tarde.'
        } else if (error.message.includes('duplicate key') || error.message.includes('already exists')) {
          errorMessage = 'Este telefone já está cadastrado. Tente fazer login.'
          if (isRegistro) setIsRegistro(false)
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Erro de conexão. Verifique sua internet.'
        }
        
        addNotification({
          type: 'error',
          title: isRegistro ? 'Erro no cadastro' : 'Erro no login',
          message: errorMessage,
          duration: 5000
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsRegistro(!isRegistro)
    setFormData({ 
      telefone: '', 
      nome: '', 
      email: '', 
      dataNascimento: '', 
      aceitaTermos: false 
    })
    triggerHaptic('light')
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

      {/* Main Content */}
      <div className="relative z-10 px-4 py-8 pt-32">
        <motion.div
          className="w-full max-w-md mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          layout
        >
          <motion.div layout>
            <GamingContainer>
            {/* Header */}
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="flex justify-center mb-4">
                <motion.div
                  className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl"
                  whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
              </div>
              
              <h1 className="text-3xl font-gaming-display font-black text-white mb-2 tracking-wider">
                {isRegistro ? 'CRIAR CONTA' : 'ENTRAR'}
              </h1>
              <p className="text-gray-300 text-sm leading-relaxed">
                {isRegistro 
                  ? 'Comece sua jornada nas mystery boxes!' 
                  : 'Acesse sua conta e continue jogando'
                }
              </p>
            </motion.div>

            {/* Form */}
            <div className="space-y-4">
              {/* Campo Nome (apenas no registro) */}
              {isRegistro && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <User className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      placeholder="Seu nome"
                      className="w-full pl-12 pr-4 py-4 bg-dark-200/50 border border-gray-600 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                      disabled={loading}
                    />
                  </div>
                </motion.div>
              )}

              {/* Campo Telefone */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: isRegistro ? 0.1 : 0 }}
              >
                <div className="relative">
                  <Phone className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    placeholder="(11) 99999-9999"
                    className="w-full pl-12 pr-4 py-4 bg-dark-200/50 border border-gray-600 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    disabled={loading}
                  />
                </div>
              </motion.div>

              {/* Campo Email (apenas no registro) */}
              {isRegistro && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="seu@email.com (opcional)"
                      className="w-full pl-12 pr-4 py-4 bg-dark-200/50 border border-gray-600 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                      disabled={loading}
                    />
                  </div>
                </motion.div>
              )}

              {/* Campo Data de Nascimento (apenas no registro) */}
              {isRegistro && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="dataNascimento"
                      value={formData.dataNascimento}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 bg-dark-200/50 border border-gray-600 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                      disabled={loading}
                      max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1 ml-1">Você deve ter 18 anos ou mais</p>
                </motion.div>
              )}

              {/* Checkbox Termos (apenas no registro) */}
              {isRegistro && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="flex items-start gap-3 p-4 bg-dark-200/30 rounded-xl border border-gray-600"
                >
                  <input
                    type="checkbox"
                    name="aceitaTermos"
                    checked={formData.aceitaTermos}
                    onChange={handleInputChange}
                    className="mt-1 w-5 h-5 text-blue-500 bg-white border-2 border-gray-400 rounded focus:ring-blue-500 focus:ring-2 checked:bg-blue-500 checked:border-blue-500"
                    disabled={loading}
                  />
                  <div className="text-sm text-gray-300 leading-relaxed">
                    <p>
                      Declaro que tenho <strong className="text-white">18 anos ou mais</strong> e aceito os{' '}
                      <a href="/termos" target="_blank" className="text-blue-400 hover:text-blue-300 underline">
                        Termos de Uso
                      </a>{' '}
                      e{' '}
                      <a href="/privacidade" target="_blank" className="text-blue-400 hover:text-blue-300 underline">
                        Política de Privacidade
                      </a>
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Botão Principal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="pt-4"
              >
                <GamingButton
                  variant="primary"
                  size="lg"
                  onClick={handleSubmit}
                  loading={loading}
                  disabled={loading}
                  icon={isRegistro ? UserPlus : LogIn}
                  arrowAnimation={true}
                  className="w-full"
                >
                  {isRegistro ? 'Criar Conta' : 'Entrar'}
                </GamingButton>
              </motion.div>

              {/* Toggle Mode */}
              <motion.div
                className="text-center pt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <p className="text-gray-400 text-sm mb-3">
                  {isRegistro ? 'Já tem uma conta?' : 'Novo por aqui?'}
                </p>
                <GamingButton
                  variant="ghost"
                  size="sm"
                  onClick={toggleMode}
                  disabled={loading}
                  className="px-6"
                >
                  {isRegistro ? 'Fazer Login' : 'Criar Conta'}
                </GamingButton>
              </motion.div>
            </div>

            {/* Features */}
            <motion.div
              className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <div className="text-center">
                <Shield className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-xs text-gray-300 font-medium">Seguro</p>
              </div>
              <div className="text-center">
                <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-xs text-gray-300 font-medium">Rápido</p>
              </div>
              <div className="text-center">
                <Gift className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-xs text-gray-300 font-medium">Prêmios</p>
              </div>
            </motion.div>
          </GamingContainer>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginPage