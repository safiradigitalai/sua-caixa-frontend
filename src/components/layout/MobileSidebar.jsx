import React from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Home, Package, TrendingUp, Trophy, User, LogIn, LogOut, Settings, HelpCircle, Shield } from 'lucide-react'

// Hooks
import { useUI, useUser } from '../../stores/useAppStore'
import { triggerHaptic, cn } from '../../lib/utils'

const MobileSidebar = () => {
  const { sidebarOpen, closeSidebar } = useUI()
  const { isAuthenticated, user, logout } = useUser()

  const handleLinkClick = () => {
    triggerHaptic('light')
    closeSidebar()
  }

  const handleLogout = () => {
    triggerHaptic('medium')
    logout()
    closeSidebar()
  }

  const mainMenuItems = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/caixas', label: 'Mystery Boxes', icon: Package },
    { path: '/transparencia', label: 'Transparência', icon: TrendingUp },
    { path: '/ganhadores', label: 'Ganhadores', icon: Trophy },
  ]

  const userMenuItems = isAuthenticated ? [
    { path: '/perfil', label: 'Meu Perfil', icon: User },
    { path: '/compras', label: 'Minhas Compras', icon: Package },
  ] : []

  const bottomMenuItems = [
    { path: '/ajuda', label: 'Ajuda', icon: HelpCircle },
    { path: '/termos', label: 'Termos de Uso', icon: Shield },
  ]

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.aside
          className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-dark-50 border-r border-gray-700 z-50 flex flex-col lg:hidden"
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700 safe-area-top">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="w-8 h-8 bg-gradient-gold rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SC</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Sua Caixa</h2>
                <p className="text-xs text-gray-400">Mystery Boxes</p>
              </div>
            </div>
            
            <button
              onClick={closeSidebar}
              className="btn-ghost p-2 min-h-touch-min"
              aria-label="Fechar menu"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* User Section */}
          {isAuthenticated && user && (
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-gold rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user.nome?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white truncate">{user.nome}</p>
                  <p className="text-sm text-gray-400">Nível {user.nivel || 1}</p>
                </div>
              </div>
              
              {/* User Stats */}
              <div className="flex gap-4 text-xs">
                <div>
                  <p className="text-gray-400">Total Ganho</p>
                  <p className="text-green-success font-medium">
                    R$ {user.totalGanho?.toFixed(2) || '0,00'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">XP</p>
                  <p className="text-gold-primary font-medium">
                    {user.pontosXp || 0}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Main Menu */}
            <div className="py-2">
              <div className="px-4 py-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Principal
                </h3>
              </div>
              {mainMenuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-700/50 transition-colors duration-150 min-h-touch-min"
                  >
                    <Icon className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* User Menu */}
            {userMenuItems.length > 0 && (
              <div className="py-2">
                <div className="px-4 py-2">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Minha Conta
                  </h3>
                </div>
                {userMenuItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-700/50 transition-colors duration-150 min-h-touch-min"
                    >
                      <Icon className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700">
            {/* Bottom Menu */}
            <div className="py-2">
              {bottomMenuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-gray-700/50 transition-colors duration-150 min-h-touch-min"
                  >
                    <Icon className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Auth Actions */}
            <div className="p-4 safe-area-bottom">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors duration-150 min-h-touch-min"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sair</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 w-full px-4 py-3 text-gold-primary hover:bg-gold-primary/10 rounded-lg transition-colors duration-150 min-h-touch-min"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="font-medium">Entrar</span>
                </Link>
              )}
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

export default MobileSidebar