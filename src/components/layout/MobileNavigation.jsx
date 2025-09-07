import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Package, TrendingUp, Trophy, User, Sparkles } from 'lucide-react'

// Hooks
import { useUser } from '../../stores/useAppStore'
import { triggerHaptic, cn } from '../../lib/utils'

const navigationItems = [
  {
    path: '/',
    label: 'Início',
    icon: Home,
    requireAuth: false
  },
  {
    path: '/caixas',
    label: 'Caixas',
    icon: Package,
    requireAuth: false
  },
  {
    path: '/transparencia',
    label: 'Dados',
    icon: TrendingUp,
    requireAuth: false
  },
  {
    path: '/ganhadores',
    label: 'Ganhadores',
    icon: Trophy,
    requireAuth: false
  }
]

const MobileNavigation = () => {
  const location = useLocation()
  const { isAuthenticated } = useUser()

  // Filtrar itens baseado na autenticação
  const visibleItems = navigationItems.filter(item => 
    !item.requireAuth || (item.requireAuth && isAuthenticated)
  )

  const handleNavClick = () => {
    triggerHaptic('light')
  }

  // Componente para item de menu
  const MenuItem = ({ item, index }) => {
    const isActive = location.pathname === item.path
    const Icon = item.icon

    const getColors = () => {
      switch(item.path) {
        case '/': return { 
          text: 'text-white drop-shadow-lg', 
          bg: 'bg-gradient-to-br from-blue-400 to-blue-700', 
          bgHover: 'hover:from-blue-300 hover:to-blue-600',
          shadow: 'shadow-blue-500/50' 
        }
        case '/caixas': return { 
          text: 'text-white drop-shadow-lg', 
          bg: 'bg-gradient-to-br from-purple-400 to-purple-700', 
          bgHover: 'hover:from-purple-300 hover:to-purple-600',
          shadow: 'shadow-purple-500/50' 
        }
        case '/transparencia': return { 
          text: 'text-white drop-shadow-lg', 
          bg: 'bg-gradient-to-br from-emerald-400 to-emerald-700', 
          bgHover: 'hover:from-emerald-300 hover:to-emerald-600',
          shadow: 'shadow-emerald-500/50' 
        }
        case '/ganhadores': return { 
          text: 'text-white drop-shadow-lg', 
          bg: 'bg-gradient-to-br from-yellow-400 to-red-600', 
          bgHover: 'hover:from-yellow-300 hover:to-red-500',
          shadow: 'shadow-yellow-500/50' 
        }
        default: return { 
          text: 'text-white drop-shadow-lg', 
          bg: 'bg-gradient-to-br from-blue-400 to-blue-700', 
          bgHover: 'hover:from-blue-300 hover:to-blue-600',
          shadow: 'shadow-blue-500/50' 
        }
      }
    }
    
    const colors = getColors()

    return (
      <Link
        key={item.path}
        to={item.path}
        onClick={handleNavClick}
        className="group relative"
        aria-label={item.label}
      >
        <motion.div
          className={cn(
            "relative overflow-hidden transition-all duration-300",
            "flex flex-col items-center justify-center gap-1 px-3 py-2 h-16 w-20",
            "hover:scale-105 active:scale-95",
            isActive 
              ? `${colors.bg} ${colors.bgHover} ${colors.text} ${colors.shadow} shadow-xl` 
              : "bg-black/50 text-gray-300 hover:text-white hover:bg-black/60"
          )}
          whileHover={{ 
            y: isActive ? 0 : -3,
            scale: 1.05,
            boxShadow: isActive ? "0 15px 35px rgba(0,0,0,0.4)" : "0 8px 20px rgba(0,0,0,0.3)"
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Gaming Background Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: 'radial-gradient(circle at 25% 25%, currentColor 1px, transparent 1px)',
                backgroundSize: '15px 15px'
              }}
            />
          </div>

          {/* Gaming Particles */}
          {isActive && (
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-current rounded-full"
                  style={{
                    left: `${20 + i * 30}%`,
                    top: `${20 + i * 30}%`,
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.8, 0.3],
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 2 + Math.random(),
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>
          )}

          {/* Icon Container */}
          <motion.div 
            className={cn(
              "relative z-10 p-2 rounded-xl transition-all duration-200",
              isActive && "bg-white/10 backdrop-blur-sm"
            )}
            whileHover={{ rotate: isActive ? 5 : 0 }}
          >
            <Icon className="w-5 h-5" />
          </motion.div>

          {/* Label */}
          <span className="relative z-10 text-[9px] font-black uppercase tracking-wide text-center leading-none drop-shadow-lg">
            {item.label}
          </span>

          {/* Cinematic Light Sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
        </motion.div>
      </Link>
    )
  }

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/90 via-black/80 to-black/60 backdrop-blur-xl border-t-2 border-blue-400/30 safe-area-bottom shadow-2xl shadow-blue-500/20"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
    >
      {/* Gaming Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, #22b5ff 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}
        />
      </div>
      
      <div className="relative flex items-center justify-between px-4 py-2 h-20">
        {/* Logo - Canto Esquerdo */}
        <Link 
          to="/"
          onClick={handleNavClick}
          className="flex items-center gap-2 group"
        >
          <motion.div 
            className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-2xl border-2 border-white/30 shadow-lg shadow-blue-500/30"
            whileHover={{ 
              scale: 1.15,
              rotate: [0, -8, 8, 0],
              boxShadow: "0 0 30px rgba(59, 130, 246, 0.6)"
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {/* Gaming Particles */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${15 + i * 15}%`,
                    top: `${15 + i * 15}%`,
                  }}
                  animate={{
                    scale: [1, 2, 1],
                    opacity: [0.3, 1, 0.3],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
            
            <Sparkles className="w-7 h-7 text-white relative z-10" />
          </motion.div>
          
          {/* Nome completo no desktop, só ícone no mobile */}
          <motion.div 
            className="text-base font-black text-white uppercase tracking-wide hidden md:block"
            animate={{
              textShadow: [
                "0 0 10px rgba(59, 130, 246, 0.8)",
                "0 0 20px rgba(147, 51, 234, 0.8)",
                "0 0 10px rgba(59, 130, 246, 0.8)"
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            SUA CAIXA
          </motion.div>
        </Link>

        {/* Menu Items - Canto Direito */}
        <div className="flex items-center gap-0 h-16">
          {visibleItems.map((item, index) => (
            <MenuItem key={item.path} item={item} index={index} />
          ))}
        </div>
      </div>
    </motion.nav>
  )
}

export default MobileNavigation