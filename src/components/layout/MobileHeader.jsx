import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Menu, Bell, User, Users, Zap } from 'lucide-react'

// Hooks
import { useUI, useUser, useNotifications } from '../../stores/useAppStore'
import { triggerHaptic } from '../../lib/utils'

const MobileHeader = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { toggleSidebar } = useUI()
  const { isAuthenticated, user } = useUser()
  const { notifications } = useNotifications()

  // Definir título e ações baseado na rota
  const getPageInfo = () => {
    const path = location.pathname
    
    if (path === '/caixas') {
      return { title: 'Mystery Boxes', showBack: false }
    }
    if (path.startsWith('/caixas/')) {
      return { title: 'Detalhes', showBack: true }
    }
    if (path === '/transparencia') {
      return { title: 'Transparência', showBack: false }
    }
    if (path === '/ganhadores') {
      return { title: 'Ganhadores', showBack: false }
    }
    if (path === '/perfil') {
      return { title: 'Perfil', showBack: false }
    }
    if (path === '/compras') {
      return { title: 'Minhas Compras', showBack: false }
    }
    if (path.startsWith('/compras/')) {
      return { title: 'Compra', showBack: true }
    }
    if (path.startsWith('/pagamento/')) {
      return { title: 'Pagamento', showBack: true }
    }
    
    return { title: 'Sua Caixa', showBack: false }
  }

  const { title, showBack } = getPageInfo()
  const hasNotifications = notifications.length > 0

  const handleBack = () => {
    triggerHaptic('light')
    navigate(-1)
  }

  const handleMenuToggle = () => {
    triggerHaptic('light')
    toggleSidebar()
  }

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-r from-blue-900/95 via-purple-900/95 to-indigo-900/95 backdrop-blur-md border-b border-blue-500/30 safe-area-top shadow-lg shadow-blue-500/20 relative overflow-hidden"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Background Glow Effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent"
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <div className="flex items-center justify-between px-4 py-3 min-h-[56px] relative z-10">
        {/* Left Action */}
        <div className="flex items-center">
          {showBack ? (
            <motion.button
              onClick={handleBack}
              className="p-2 -ml-2 min-h-touch-min rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 transition-colors shadow-lg shadow-orange-500/20"
              aria-label="Voltar"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-orange-400" />
            </motion.button>
          ) : (
            <motion.button
              onClick={handleMenuToggle}
              className="p-2 -ml-2 min-h-touch-min rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 transition-colors lg:hidden shadow-lg shadow-blue-500/20"
              aria-label="Menu"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="w-5 h-5 text-blue-400" />
            </motion.button>
          )}
        </div>

        {/* Title & Status */}
        <div className="flex-1 text-center">
          <div className="flex flex-col items-center">
            <h1 className="text-lg font-gaming-display font-black text-white truncate px-4 tracking-wider drop-shadow-lg">
              {title}
            </h1>
            
            {/* Status Bar - Home only */}
            {location.pathname === '/' && (
              <motion.div 
                className="flex items-center gap-2 mt-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                {/* Live Indicator */}
                <div className="flex items-center gap-1 bg-blue-500/20 rounded-full px-2 py-0.5 border border-blue-400/40">
                  <motion.div 
                    className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity
                    }}
                  />
                  <span className="text-blue-300 text-xs font-bold">LIVE</span>
                </div>

                {/* Online Count */}
                <div className="flex items-center gap-1 bg-emerald-500/20 rounded-full px-2 py-0.5 border border-emerald-400/40">
                  <Users className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-300 text-xs font-bold">
                    {Math.floor(Math.random() * 50) + 120}
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          {/* Notifications */}
          {isAuthenticated && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/perfil"
                className="p-2 -mr-2 min-h-touch-min relative rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 transition-colors shadow-lg shadow-purple-500/20"
                aria-label={`Notificações${hasNotifications ? ' (novas)' : ''}`}
              >
                <Bell className="w-5 h-5 text-purple-400" />
                {hasNotifications && (
                  <motion.div 
                    className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full border-2 border-purple-900 shadow-lg shadow-orange-500/50"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.8, 1, 0.8] 
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </Link>
            </motion.div>
          )}

        </div>
      </div>
    </motion.header>
  )
}

export default MobileHeader