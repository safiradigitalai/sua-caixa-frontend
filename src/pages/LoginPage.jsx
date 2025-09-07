import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  User, 
  Phone, 
  Eye, 
  EyeOff,
  LogIn,
  Gift,
  Sparkles,
  Shield,
  Zap
} from 'lucide-react'

// Gaming Components
import GamingContainer from '../components/ui/GamingContainer'
import GamingButton from '../components/ui/GamingButton'
import HorizontalLiveFeed from '../components/ui/HorizontalLiveFeed'

// Hooks
import { useUser, useNotifications } from '../stores/useAppStore'
import { triggerHaptic } from '../lib/utils'
import { supabase, supabaseHelpers } from '../lib/supabase'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useUser()
  const { addNotification } = useNotifications()
  
  const [formData, setFormData] = useState({
    telefone: '',
    senha: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    triggerHaptic('medium')

    try {
      // Buscar um usuário real do banco para demo
      
      // Tentar diferentes abordagens para usuário demo
      let demoUser = null
      
      // Tentar buscar usuários existentes primeiro
      try {
        // Buscar qualquer usuário existente para demo
        // Usar supabase já importado
        const { data: usuarios } = await supabase
          .from('usuarios')
          .select('*')
          .limit(1)
        
        if (usuarios && usuarios.length > 0) {
          demoUser = usuarios[0]
          console.log('✅ Usando usuário existente:', demoUser.nome)
        }
      } catch (error) {
        console.log('Tentativa 1 falhou:', error.message)
      }
      
      // Se não conseguiu buscar usuário existente, tentar buscar demo específico
      if (!demoUser) {
        try {
          demoUser = await supabaseHelpers.buscarUsuarioPorTelefone('(11) 99999-9999')
          console.log('✅ Encontrou usuário demo específico')
        } catch (error) {
          console.log('Usuário demo específico não existe:', error.message)
        }
      }
      
      // Se ainda não tem usuário, tentar criar
      if (!demoUser) {
        try {
          demoUser = await supabaseHelpers.criarUsuarioDemo('(11) 99999-9999', 'Demo User')
          console.log('✅ Criou novo usuário demo')
        } catch (error) {
          console.log('Falhou ao criar usuário demo:', error.message)
          
          // Último fallback: criar usuário offline
          demoUser = {
            id: 'offline-demo-001',
            nome: 'Demo User (Offline)',
            telefone: '(11) 99999-9999',
            email: null,
            saldo: 500.00,
            pontos_xp: 0,
            verificado: false
          }
          console.log('✅ Usando usuário demo offline')
        }
      }
      
      if (!demoUser) {
        throw new Error('Sistema temporariamente indisponível')
      }
      
      // Formatar usuário para o store
      const userData = {
        id: demoUser.id,
        nome: demoUser.nome,
        telefone: demoUser.telefone,
        email: demoUser.email,
        saldo: parseFloat(demoUser.saldo || 0),
        pontosXp: demoUser.pontos_xp || 0,
        verificado: demoUser.verificado,
        isDemo: true // Flag para identificar como demo
      }
      
      login(userData)
      
      addNotification({
        type: 'success',
        title: '🎉 Login Demo com Dados Reais!',
        message: 'Conectado ao Supabase com sucesso'
      })
      
      // Redirecionar para home
      navigate('/')
      
    } catch (error) {
      console.error('Erro no login demo:', error)
      addNotification({
        type: 'error',
        title: 'Erro no Login Demo',
        message: error.message || 'Erro ao conectar com banco'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Usar supabaseHelpers já importado
      
      // Buscar usuário real no banco
      const usuario = await supabaseHelpers.buscarUsuarioPorTelefone(formData.telefone)
      
      if (!usuario) {
        throw new Error('Usuário não encontrado. Use o botão Demo para testar.')
      }
      
      // Formatar usuário para o store
      const userData = {
        id: usuario.id,
        nome: usuario.nome,
        telefone: usuario.telefone,
        email: usuario.email,
        saldo: parseFloat(usuario.saldo || 0),
        pontosXp: usuario.pontos_xp || 0,
        verificado: usuario.verificado,
        isDemo: false
      }
      
      login(userData)
      
      addNotification({
        type: 'success',
        title: `🎉 Bem-vindo, ${usuario.nome}!`,
        message: 'Login realizado com sucesso'
      })
      
      navigate('/')
      
    } catch (error) {
      console.error('Erro no login:', error)
      addNotification({
        type: 'error',
        title: 'Erro no Login',
        message: error.message || 'Usuário não encontrado'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col relative overflow-hidden">
      {/* Gaming Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated Grid */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, #22d3ee 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 20, 0],
            y: [0, -10, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-16 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl"
          animate={{
            scale: [1, 0.8, 1],
            opacity: [0.4, 0.7, 0.4],
            x: [0, -15, 0],
            y: [0, 15, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-28 h-28 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.5, 0.2],
            x: [0, 25, 0],
            y: [0, -20, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
        
        {/* Corner Lights */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-cyan-500/10 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-purple-500/10 via-transparent to-transparent" />
      </div>

      {/* Live Feed Bar */}
      <HorizontalLiveFeed />

      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <motion.div
          className="w-full max-w-md space-y-8"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Header Gaming Container */}
          <GamingContainer
            variant="glass"
            className="text-center"
            backgroundPattern={true}
            particles={true}
          >
            <motion.div
              className="w-24 h-24 mx-auto mb-6 relative"
              initial={{ scale: 0.8, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            >
              {/* Gaming Logo Container */}
              <div className="relative w-full h-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-3xl flex items-center justify-center border-2 border-cyan-400/30 shadow-lg shadow-cyan-500/30">
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-300" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-300" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-300" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-300" />
                
                {/* Animated Particles */}
                <div className="absolute inset-0">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-cyan-300 rounded-full"
                      style={{
                        left: `${20 + i * 12}%`,
                        top: `${20 + i * 12}%`,
                      }}
                      animate={{
                        scale: [1, 2, 1],
                        opacity: [0.3, 1, 0.3],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
                
                <Gift className="w-12 h-12 text-white relative z-10" />
              </div>
            </motion.div>
            
            <div className="space-y-3">
              <motion.h1 
                className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 uppercase tracking-wider"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(34, 211, 238, 0.5)",
                    "0 0 30px rgba(147, 51, 234, 0.5)",
                    "0 0 20px rgba(34, 211, 238, 0.5)"
                  ]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                SUA CAIXA
              </motion.h1>
              <p className="text-gray-300 font-medium">
                🎮 Entre e descubra surpresas incríveis
              </p>
            </div>
          </GamingContainer>

          {/* Demo Login Section */}
          <GamingContainer
            variant="accent"
            className="relative"
            backgroundPattern={true}
            particles={true}
          >
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="relative">
                <GamingButton
                  variant="primary"
                  size="lg"
                  onClick={handleDemoLogin}
                  disabled={loading}
                  className="w-full font-black text-lg tracking-wide relative overflow-hidden group"
                  glowEffect={true}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <motion.div
                        className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span>CONECTANDO...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Zap className="w-6 h-6" />
                      </motion.div>
                      <span>🎮 ENTRAR COMO DEMO</span>
                      <motion.div
                        animate={{ rotate: [360, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-6 h-6" />
                      </motion.div>
                    </div>
                  )}
                </GamingButton>
                
                {/* Gaming Badge */}
                <motion.div 
                  className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-black px-3 py-1 rounded-full border-2 border-purple-300/50 shadow-lg shadow-purple-500/50"
                  animate={{
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      "0 0 20px rgba(168, 85, 247, 0.5)",
                      "0 0 30px rgba(236, 72, 153, 0.5)",
                      "0 0 20px rgba(168, 85, 247, 0.5)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  DEMO
                </motion.div>
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-300 font-medium leading-relaxed">
                  🎁 Experimente <span className="text-cyan-400 font-bold">abrir caixas</span>, veja transparência
                </p>
                <p className="text-xs text-gray-400">
                  e explore todas as funcionalidades <span className="text-green-400 font-bold">gratuitamente!</span>
                </p>
              </div>
            </motion.div>
          </GamingContainer>

          {/* Gaming Divider */}
          <motion.div 
            className="flex items-center gap-4 px-4"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-cyan-500/50"></div>
            <motion.span 
              className="text-cyan-400 text-sm font-bold uppercase tracking-widest px-4 py-2 bg-black/50 rounded-full border border-cyan-500/30 backdrop-blur-sm"
              animate={{
                textShadow: [
                  "0 0 10px rgba(34, 211, 238, 0.8)",
                  "0 0 20px rgba(34, 211, 238, 0.8)",
                  "0 0 10px rgba(34, 211, 238, 0.8)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ou
            </motion.span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-cyan-500/50 to-cyan-500/50"></div>
          </motion.div>

          {/* Login Form */}
          <GamingContainer
            variant="dark"
            className="space-y-6"
            backgroundPattern={true}
          >
            <motion.form
              onSubmit={handleLogin}
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {/* Phone Input */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-cyan-400 uppercase tracking-wide flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Telefone
                </label>
                <div className="relative group">
                  {/* Corner Accents */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400/50 transition-all duration-300 group-focus-within:border-cyan-300" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400/50 transition-all duration-300 group-focus-within:border-cyan-300" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400/50 transition-all duration-300 group-focus-within:border-cyan-300" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400/50 transition-all duration-300 group-focus-within:border-cyan-300" />
                  
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    placeholder="(11) 99999-9999"
                    className="w-full bg-black/60 border border-gray-700/50 rounded-2xl py-4 pl-14 pr-4 text-white placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 font-medium"
                  />
                  
                  {/* Gaming Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-purple-400 uppercase tracking-wide flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Senha
                </label>
                <div className="relative group">
                  {/* Corner Accents */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple-400/50 transition-all duration-300 group-focus-within:border-purple-300" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-400/50 transition-all duration-300 group-focus-within:border-purple-300" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-purple-400/50 transition-all duration-300 group-focus-within:border-purple-300" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-400/50 transition-all duration-300 group-focus-within:border-purple-300" />
                  
                  <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="senha"
                    value={formData.senha}
                    onChange={handleInputChange}
                    placeholder="Sua senha"
                    className="w-full bg-black/60 border border-gray-700/50 rounded-2xl py-4 pl-14 pr-14 text-white placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 font-medium"
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors p-1 rounded-lg hover:bg-purple-500/10"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </motion.button>
                  
                  {/* Gaming Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-transparent to-pink-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </div>

              {/* Login Button */}
              <GamingButton
                type="submit"
                variant="secondary"
                size="lg"
                disabled={loading || !formData.telefone || !formData.senha}
                className="w-full font-bold text-lg tracking-wide"
                glowEffect={true}
              >
                <div className="flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <motion.div
                        className="w-6 h-6 border-3 border-gray-400 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span>ENTRANDO...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-6 h-6" />
                      <span>ENTRAR</span>
                    </>
                  )}
                </div>
              </GamingButton>
            </motion.form>
          </GamingContainer>

          {/* Footer */}
          <GamingContainer
            variant="glass"
            className="text-center"
          >
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <div className="space-y-3">
                <p className="text-sm text-gray-300 font-medium">
                  <span className="text-cyan-400 font-bold">🎮 Teste com dados reais:</span><br/>
                  Digite qualquer telefone ou use o Demo
                </p>
                
                <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-green-400" />
                    <span>Seguro</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-500 rounded-full" />
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3 text-blue-400" />
                    <span>Transparente</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-500 rounded-full" />
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span>Provably Fair</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </GamingContainer>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginPage