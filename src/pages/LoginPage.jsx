import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  User, 
  Lock, 
  LogIn,
  UserPlus,
  Gift,
  Sparkles,
  Shield,
  Zap,
  Mail,
  Eye,
  EyeOff,
  CreditCard,
  Phone
} from 'lucide-react'

// Gaming Components
import GamingContainer from '../components/ui/GamingContainer'
import GamingButton from '../components/ui/GamingButton'
import HorizontalLiveFeed from '../components/ui/HorizontalLiveFeed'

// Hooks
import { useUser, useNotifications } from '../stores/useAppStore'
import { triggerHaptic } from '../lib/utils'
import { supabase } from '../lib/supabase'

const LoginPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useUser()
  const { showSuccess, showError } = useNotifications()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    cpf: '',
    telefone: ''
  })
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.email.trim()) {
      showError('Email é obrigatório')
      return false
    }

    if (!formData.email.includes('@')) {
      showError('Email inválido')
      return false
    }

    if (!formData.password.trim()) {
      showError('Senha é obrigatória')
      return false
    }

    if (formData.password.length < 6) {
      showError('Senha deve ter pelo menos 6 caracteres')
      return false
    }

    if (isSignUp) {
      if (!formData.name.trim()) {
        showError('Nome é obrigatório')
        return false
      }

      if (!formData.cpf.trim()) {
        showError('CPF é obrigatório')
        return false
      }

      if (!formData.telefone.trim()) {
        showError('Telefone é obrigatório')
        return false
      }

      if (formData.password !== formData.confirmPassword) {
        showError('Senhas não coincidem')
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    triggerHaptic('medium')

    try {
      if (isSignUp) {
        // Cadastro
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
              cpf: formData.cpf,
              telefone: formData.telefone
            }
          }
        })

        if (error) throw error

        if (data.user && data.user.email_confirmed_at) {
          // Usuário já confirmado
          showSuccess(`Bem-vindo, ${formData.name}! Conta criada com sucesso.`)
        } else {
          // Aguardando confirmação por email
          showSuccess('Conta criada! Verifique seu email para confirmar.')
        }
        
      } else {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        })

        if (error) throw error

        const userName = data.user?.user_metadata?.name || data.user?.email?.split('@')[0] || 'Usuário'
        showSuccess(`Bem-vindo de volta, ${userName}!`)
        
        // A navegação será feita automaticamente pelo useEffect quando isAuthenticated mudar
      }

    } catch (error) {
      console.error('❌ Erro na autenticação:', error)
      
      // Mensagens de erro personalizadas
      if (error.message.includes('Invalid login credentials')) {
        showError('Email ou senha incorretos')
      } else if (error.message.includes('Email not confirmed')) {
        showError('Confirme seu email antes de fazer login')
      } else if (error.message.includes('User already registered')) {
        showError('Este email já está cadastrado')
      } else {
        showError(error.message || 'Erro na autenticação')
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      cpf: '',
      telefone: ''
    })
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  return (
    <div className="min-h-screen bg-brutal-black flex flex-col">
      {/* Live Feed de Ganhadores */}
      <div className="w-full">
        <HorizontalLiveFeed />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <GamingContainer className="w-full max-w-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-neon-purple to-neon-blue rounded-2xl mb-4">
              <Gift className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl font-black text-white mb-2">
              {isSignUp ? 'CRIAR CONTA' : 'ENTRAR'}
            </h1>
            
            <p className="text-gray-300 text-sm">
              {isSignUp 
                ? 'Junte-se a milhares de players!' 
                : 'Bem-vindo de volta, jogador!'
              }
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome (apenas no cadastro) */}
            {isSignUp && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <label className="block text-sm font-semibold text-white mb-2">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-400 focus:border-neon-purple focus:outline-none transition-colors"
                    placeholder="Seu nome completo"
                    disabled={loading}
                  />
                </div>
              </motion.div>
            )}

            {/* CPF (apenas no cadastro) */}
            {isSignUp && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <label className="block text-sm font-semibold text-white mb-2">
                  CPF
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-400 focus:border-neon-purple focus:outline-none transition-colors"
                    placeholder="000.000.000-00"
                    disabled={loading}
                  />
                </div>
              </motion.div>
            )}

            {/* Telefone (apenas no cadastro) */}
            {isSignUp && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <label className="block text-sm font-semibold text-white mb-2">
                  Telefone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-400 focus:border-neon-purple focus:outline-none transition-colors"
                    placeholder="(11) 99999-0000"
                    disabled={loading}
                  />
                </div>
              </motion.div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-400 focus:border-neon-purple focus:outline-none transition-colors"
                  placeholder="seu@email.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-xl pl-11 pr-12 py-3 text-white placeholder-gray-400 focus:border-neon-purple focus:outline-none transition-colors"
                  placeholder="Sua senha"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirmar Senha (apenas no cadastro) */}
            {isSignUp && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <label className="block text-sm font-semibold text-white mb-2">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-xl pl-11 pr-12 py-3 text-white placeholder-gray-400 focus:border-neon-purple focus:outline-none transition-colors"
                    placeholder="Confirme sua senha"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Botão Principal */}
            <GamingButton
              type="submit"
              disabled={loading}
              className="w-full py-4 text-lg font-black"
              variant="primary"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isSignUp ? 'CRIANDO CONTA...' : 'ENTRANDO...'}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  {isSignUp ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                  {isSignUp ? 'CRIAR CONTA' : 'ENTRAR'}
                </div>
              )}
            </GamingButton>

            {/* Toggle entre Login/Cadastro */}
            <div className="text-center pt-4">
              <p className="text-gray-300 text-sm">
                {isSignUp ? 'Já tem uma conta?' : 'Não tem conta ainda?'}
              </p>
              <button
                type="button"
                onClick={toggleMode}
                className="text-neon-purple font-semibold hover:text-neon-blue transition-colors mt-1"
                disabled={loading}
              >
                {isSignUp ? 'Fazer Login' : 'Criar Conta'}
              </button>
            </div>
          </form>

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-green-400/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-xs text-gray-300">Seguro</span>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-400/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-xs text-gray-300">Rápido</span>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-purple-400/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-xs text-gray-300">Épico</span>
              </div>
            </div>
          </div>
        </GamingContainer>
      </div>
    </div>
  )
}

export default LoginPage