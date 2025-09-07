import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Star, Zap } from 'lucide-react'

/**
 * MobileGamingCard - Inspirado em Fortnite/Clash Royale
 * Estética mobile gaming com cores vibrantes e efeitos 3D
 */

const MobileGamingCard = ({ 
  variant = 'epic',
  rarity = 'common',
  title, 
  subtitle,
  description, 
  icon: Icon,
  badge,
  stats,
  level,
  gems,
  children,
  onClick,
  href,
  className = '',
  animated = true,
  size = 'default'
}) => {
  
  // Sistema de raridade inspirado em card games
  const rarities = {
    common: {
      gradient: 'bg-gradient-to-b from-gray-400 via-gray-500 to-gray-600',
      border: 'border-4 border-gray-300',
      glow: 'shadow-xl shadow-gray-400/30 hover:shadow-gray-300/50',
      shine: 'from-white/30 via-gray-200/20 to-transparent',
      particle: '#9ca3af',
      bgPattern: 'bg-gradient-to-br from-gray-100/10 to-gray-800/20'
    },
    rare: {
      gradient: 'bg-gradient-to-b from-blue-400 via-blue-500 to-blue-700',
      border: 'border-4 border-blue-300',
      glow: 'shadow-xl shadow-blue-400/40 hover:shadow-blue-300/60',
      shine: 'from-white/40 via-blue-200/30 to-transparent',
      particle: '#60a5fa',
      bgPattern: 'bg-gradient-to-br from-blue-100/15 to-blue-900/25'
    },
    epic: {
      gradient: 'bg-gradient-to-b from-purple-400 via-purple-500 to-purple-700',
      border: 'border-4 border-purple-300',
      glow: 'shadow-xl shadow-purple-400/40 hover:shadow-purple-300/60',
      shine: 'from-white/40 via-purple-200/30 to-transparent',
      particle: '#a855f7',
      bgPattern: 'bg-gradient-to-br from-purple-100/15 to-purple-900/25'
    },
    legendary: {
      gradient: 'bg-gradient-to-b from-yellow-400 via-orange-500 to-red-600',
      border: 'border-4 border-yellow-300',
      glow: 'shadow-xl shadow-yellow-400/50 hover:shadow-yellow-300/70',
      shine: 'from-white/50 via-yellow-200/40 to-transparent',
      particle: '#fbbf24',
      bgPattern: 'bg-gradient-to-br from-yellow-100/20 to-red-900/30'
    },
    mythic: {
      gradient: 'bg-gradient-to-b from-pink-400 via-purple-500 to-indigo-700',
      border: 'border-4 border-pink-300',
      glow: 'shadow-xl shadow-pink-400/50 hover:shadow-pink-300/70',
      shine: 'from-white/60 via-pink-200/50 to-transparent',
      particle: '#ec4899',
      bgPattern: 'bg-gradient-to-br from-pink-100/20 to-indigo-900/30'
    }
  }

  const sizes = {
    sm: 'w-36 h-48 p-3',
    default: 'w-40 h-56 p-4', 
    lg: 'w-48 h-64 p-5',
    xl: 'w-56 h-72 p-6'
  }

  const style = rarities[rarity]
  const sizeClass = sizes[size]
  
  const CardWrapper = href ? motion.a : motion.div
  const cardProps = href ? { href, target: "_blank", rel: "noopener noreferrer" } : {}
  
  if (onClick) {
    cardProps.onClick = onClick
    cardProps.role = "button"
    cardProps.tabIndex = 0
  }

  return (
    <motion.div className="relative group perspective-1000">
      <CardWrapper
        className={`
          ${style.gradient} ${style.border} ${style.glow}
          ${sizeClass} relative overflow-hidden cursor-pointer
          rounded-3xl transition-all duration-300 flex flex-col
          transform-gpu hover:scale-105 hover:-translate-y-2
          ${className}
        `}
        whileHover={animated ? { 
          rotateX: 5,
          rotateY: 5,
          scale: 1.05,
          z: 50
        } : {}}
        whileTap={animated ? { 
          scale: 0.95,
          rotateX: 0,
          rotateY: 0
        } : {}}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 25,
          duration: 0.2
        }}
        {...cardProps}
      >
        
        {/* Rarity Background Pattern */}
        <div className={`absolute inset-0 ${style.bgPattern} opacity-60`} />
        
        {/* Mobile Gaming Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: style.particle,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={animated ? {
                scale: [1, 2, 1],
                opacity: [0.4, 1, 0.4],
                rotate: [0, 180, 360],
              } : {}}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Fortnite-style Shine Effect */}
        <div className={`absolute inset-0 bg-gradient-to-tr ${style.shine} -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none`} />
        
        {/* Rarity Badge - Top Left */}
        <div className="absolute top-2 left-2 z-20">
          <motion.div 
            className="bg-black/80 backdrop-blur-sm rounded-full px-2 py-1 border-2 border-white/30"
            animate={animated ? {
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          >
            <span className="text-white text-xs font-black uppercase tracking-wider">
              {rarity}
            </span>
          </motion.div>
        </div>

        {/* Level Badge - Top Right */}
        {level && (
          <div className="absolute top-2 right-2 z-20">
            <motion.div 
              className="w-8 h-8 bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-full border-2 border-yellow-200 flex items-center justify-center"
              whileHover={{ rotate: 360, scale: 1.2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-black text-xs font-black">{level}</span>
            </motion.div>
          </div>
        )}

        {/* Main Icon - Fortnite Style */}
        <div className="relative z-10 flex items-center justify-center mt-6 mb-2">
          {Icon && (
            <motion.div 
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/40 shadow-lg"
              whileHover={animated ? { 
                rotate: [0, -10, 10, 0],
                scale: 1.1 
              } : {}}
              transition={{ 
                type: "spring", 
                stiffness: 400,
                duration: 0.6
              }}
            >
              <Icon className="w-6 h-6 text-white drop-shadow-lg" />
            </motion.div>
          )}
        </div>

        {/* Content Area */}
        <div className="relative z-10 text-center px-2 pb-2 flex-1 flex flex-col justify-center">
          {title && (
            <h3 className="font-black text-white text-xs uppercase tracking-wide leading-tight mb-1 drop-shadow-lg truncate">
              {title}
            </h3>
          )}
          
          {subtitle && (
            <p className="text-white/90 text-xs font-bold mb-2 drop-shadow truncate">
              {subtitle}
            </p>
          )}

          {/* Stats/Gems */}
          {(stats || gems) && (
            <div className="flex items-center justify-center gap-1 mb-1">
              {stats && (
                <div className="bg-black/60 rounded-full px-2 py-0.5 border border-white/30">
                  <span className="text-white text-xs font-bold">{stats}</span>
                </div>
              )}
              {gems && (
                <div className="flex items-center gap-1 bg-gradient-to-r from-purple-500/80 to-pink-500/80 rounded-full px-2 py-0.5 border border-white/30">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                  <span className="text-white text-xs font-bold">{gems}</span>
                </div>
              )}
            </div>
          )}

          {children}
        </div>

        {/* Bottom Shine Bar - Clash Royale Style */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        
        {/* Corner Decorations */}
        <div className="absolute top-3 right-3 w-4 h-4 opacity-60">
          <div className="w-full h-full border-2 border-white/60 border-l-0 border-b-0 rounded-tr-xl" />
        </div>
        <div className="absolute bottom-3 left-3 w-4 h-4 opacity-60">
          <div className="w-full h-full border-2 border-white/60 border-r-0 border-t-0 rounded-bl-xl" />
        </div>

        {/* Hovering Sparkles */}
        {animated && (
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${20 + i * 20}%`,
                  top: `${10 + i * 20}%`,
                }}
                animate={{
                  y: [-5, -15, -5],
                  rotate: [0, 180, 360],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              >
                <Star className="w-3 h-3 text-yellow-300 drop-shadow-lg" />
              </motion.div>
            ))}
          </div>
        )}
      </CardWrapper>

      {/* Mobile Gaming Glow Effect */}
      <div className={`absolute inset-0 ${style.gradient} rounded-3xl blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-300 -z-10`} />
    </motion.div>
  )
}

export default MobileGamingCard