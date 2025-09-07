import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Clock, X, TrendingUp, Crown, Zap, Star, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useUser } from '../../stores/useAppStore'

/**
 * HorizontalLiveFeed - Ticker LuxDrop style com múltiplos drops rolando
 * Animação contínua horizontal com mini-cards gaming
 */

const HorizontalLiveFeed = () => {
  const [isMinimized, setIsMinimized] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const location = useLocation()
  const { isAuthenticated, user } = useUser()

  // Mock data otimizado para ticker
  const mockWins = [
    { id: 1, user: 'João***', prize: 'iPhone 15 Pro', value: 4999, time: 'agora', rarity: 'legendary', icon: Crown },
    { id: 2, user: 'Maria***', prize: 'RTX 4080', value: 3299, time: '1min', rarity: 'epic', icon: Zap },
    { id: 3, user: 'Pedro***', prize: 'Dubai 7 dias', value: 2800, time: '2min', rarity: 'epic', icon: Star },
    { id: 4, user: 'Ana***', prize: 'AirPods Pro', value: 899, time: '3min', rarity: 'rare', icon: Trophy },
    { id: 5, user: 'Carlos***', prize: 'MacBook Pro', value: 5499, time: '5min', rarity: 'legendary', icon: Crown },
    { id: 6, user: 'Lucia***', prize: 'PS5', value: 2399, time: '7min', rarity: 'epic', icon: Zap }
  ]

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Mobile slider only
  useEffect(() => {
    if (!isMobile) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mockWins.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [isMobile])

  // Duplicar array para loop infinito no desktop
  const infiniteWins = [...mockWins, ...mockWins, ...mockWins]

  const rarityStyles = {
    legendary: {
      bg: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/30',
      border: 'border-yellow-400/60',
      text: 'text-yellow-400',
      glow: 'shadow-yellow-500/20'
    },
    epic: {
      bg: 'bg-gradient-to-r from-purple-500/20 to-pink-500/30',
      border: 'border-purple-400/60',
      text: 'text-purple-400',
      glow: 'shadow-purple-500/20'
    },
    rare: {
      bg: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/30',
      border: 'border-blue-400/60',
      text: 'text-blue-400',
      glow: 'shadow-blue-500/20'
    }
  }

  // Mini Card Component
  const DropCard = ({ win, index }) => {
    const style = rarityStyles[win.rarity]
    const Icon = win.icon

    return (
      <motion.div
        className={`
          ${style.bg} backdrop-blur-sm shadow-lg ${style.glow}
          flex items-center gap-2 md:gap-3 px-2 md:px-4 py-2 
          w-full md:min-w-[280px] md:w-auto
          hover:scale-[1.02] transition-all cursor-pointer
          relative overflow-hidden
        `}
        whileHover={{ scale: 1.02 }}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        {/* Gaming Corner Accent */}
        <div className="absolute top-1 right-1 w-2 h-2 opacity-40">
          <div className={`w-full h-full ${style.bg}`} />
        </div>

        {/* Avatar */}
        <div className={`w-6 h-6 md:w-8 md:h-8 ${style.bg} flex items-center justify-center flex-shrink-0`}>
          <span className="text-white font-bold text-xs md:text-sm">
            {win.user.charAt(0)}
          </span>
        </div>

        {/* Content - Simplificado */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-white font-bold text-xs md:text-sm truncate">
              {win.user}
            </span>
            <span className="text-white/50 text-xs md:text-sm hidden md:inline">ganhou</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`font-black text-xs md:text-sm ${style.text} truncate flex-1 md:max-w-[140px]`}>
              {win.prize}
            </span>
            <span className="text-white font-bold text-xs md:text-sm whitespace-nowrap ml-1 md:ml-2">
              R$ {(win.value / 1000).toFixed(0)}K
            </span>
          </div>
        </div>

        {/* Prize Icon */}
        <div className={`w-6 h-6 ${style.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-3 h-3 ${style.text}`} />
        </div>
      </motion.div>
    )
  }

  if (isMinimized) {
    return (
      <motion.div
        className="fixed top-4 left-4 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <motion.button
          onClick={() => setIsMinimized(false)}
          className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full border border-white/20 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <TrendingUp className="w-5 h-5" />
        </motion.button>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 w-full z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        delay: 0.5
      }}
    >
      <div className="relative overflow-hidden bg-black/40 backdrop-blur-xl shadow-lg">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: 'radial-gradient(circle at 25% 25%, #22b5ff 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        <div className="flex items-center h-16">
          {/* Live Header */}
          <div className="flex items-center gap-2 md:gap-3 px-3 md:px-6 flex-shrink-0">
            <Trophy className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
            <span className="text-white font-bold text-xs md:text-sm uppercase tracking-wider hidden md:inline">
              LIVE DROPS
            </span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>

          {/* Mobile: Single Card Slider | Desktop: Multiple Cards Push */}
          <div className="flex-1 overflow-hidden relative">
            
            {/* Mobile Version - Single Card */}
            <div className="block md:hidden px-4">
              <motion.div
                key={currentIndex}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  duration: 0.5
                }}
                className="w-full"
              >
                <DropCard win={mockWins[currentIndex]} index={currentIndex} />
              </motion.div>
            </div>

            {/* Desktop Version - Continuous Carousel */}
            <div className="hidden md:block">
              {/* Fade gradients */}
              <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-black/40 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-black/40 to-transparent z-10 pointer-events-none" />
              
              <motion.div
                className="flex items-center"
                animate={{ x: ['0%', '-50%'] }}
                transition={{
                  duration: 50,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                {infiniteWins.map((win, index) => (
                  <DropCard key={`${win.id}-${Math.floor(index / mockWins.length)}`} win={win} index={index} />
                ))}
              </motion.div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 md:gap-4 px-3 md:px-6 flex-shrink-0">
            <div className="text-right text-xs hidden sm:block">
              <div className="text-white/60">
                🎁 {mockWins.length} drops
              </div>
              <div className="text-white/80 font-bold">
                R$ {(mockWins.reduce((sum, win) => sum + win.value, 0) / 1000).toFixed(0)}K
              </div>
            </div>
            
            {/* Login/Profile Button - Gaming Block Style */}
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="relative overflow-hidden transition-all duration-300 flex flex-col items-center justify-center gap-1 px-3 py-2 h-12 w-16 bg-gradient-to-br from-gray-400 to-gray-700 hover:from-gray-300 hover:to-gray-600 text-white drop-shadow-lg shadow-gray-500/50 shadow-lg"
                aria-label="Login"
              >
                {/* Gaming Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div 
                    className="w-full h-full"
                    style={{
                      backgroundImage: 'radial-gradient(circle at 25% 25%, currentColor 1px, transparent 1px)',
                      backgroundSize: '8px 8px'
                    }}
                  />
                </div>

                {/* Icon Container */}
                <div className="relative z-10">
                  <User className="w-4 h-4" />
                </div>

                {/* Label */}
                <span className="relative z-10 text-[7px] font-black uppercase tracking-wide text-center leading-none drop-shadow-lg">
                  Login
                </span>

                {/* Cinematic Light Sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 pointer-events-none" />
              </Link>
            ) : (
              <Link
                to="/perfil"
                className="relative overflow-hidden transition-all duration-300 flex flex-col items-center justify-center gap-1 px-3 py-2 h-12 w-16 bg-gradient-to-br from-pink-400 to-pink-700 hover:from-pink-300 hover:to-pink-600 text-white drop-shadow-lg shadow-pink-500/50 shadow-lg"
                aria-label="Perfil"
              >
                {/* Gaming Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div 
                    className="w-full h-full"
                    style={{
                      backgroundImage: 'radial-gradient(circle at 25% 25%, currentColor 1px, transparent 1px)',
                      backgroundSize: '8px 8px'
                    }}
                  />
                </div>

                {/* Avatar ou Icon */}
                <div className="relative z-10">
                  {user?.nome ? (
                    <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-[8px] font-bold">
                        {user.nome.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>

                {/* Label */}
                <span className="relative z-10 text-[7px] font-black uppercase tracking-wide text-center leading-none drop-shadow-lg">
                  Perfil
                </span>

                {/* Cinematic Light Sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 pointer-events-none" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default HorizontalLiveFeed