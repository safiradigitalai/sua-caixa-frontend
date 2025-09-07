import React from 'react'
import { motion } from 'framer-motion'

/**
 * GamingContainer - Sistema de containers com estética dos Gaming Banners
 * Aplica o DNA visual consistente para seções e wrappers
 */

const GamingContainer = ({ 
  variant = 'primary',
  children,
  className = '',
  headerTitle,
  headerSubtitle,
  headerIcon: HeaderIcon,
  headerActions,
  fullHeight = false,
  animated = true,
  particles = true,
  backgroundPattern = true,
  borderStyle = 'default' // default, thick, glow, minimal
}) => {
  
  // Sistema de variantes herdado dos Gaming Banners
  const variants = {
    primary: {
      gradient: 'bg-gradient-to-br from-blue-900/20 via-blue-800/10 to-blue-900/20',
      borderColor: 'border-blue-400/30',
      accentColor: 'text-blue-300',
      glowColor: 'shadow-blue-500/10'
    },
    secondary: {
      gradient: 'bg-gradient-to-br from-yellow-900/20 via-yellow-800/10 to-orange-900/20',
      borderColor: 'border-yellow-400/30',
      accentColor: 'text-yellow-300', 
      glowColor: 'shadow-yellow-500/10'
    },
    accent: {
      gradient: 'bg-gradient-to-br from-purple-900/20 via-purple-800/10 to-purple-900/20',
      borderColor: 'border-purple-400/30',
      accentColor: 'text-purple-300',
      glowColor: 'shadow-purple-500/10'
    },
    dark: {
      gradient: 'bg-gradient-to-br from-black/40 via-gray-900/30 to-black/40',
      borderColor: 'border-white/10',
      accentColor: 'text-white',
      glowColor: 'shadow-white/5'
    },
    glass: {
      gradient: 'bg-black/20 backdrop-blur-md',
      borderColor: 'border-white/20',
      accentColor: 'text-white',
      glowColor: 'shadow-white/10'
    }
  }

  const borderStyles = {
    default: 'border-2 rounded-3xl',
    thick: 'border-4 rounded-3xl',
    glow: 'border-2 rounded-3xl ring-1 ring-white/10',
    minimal: 'border border-white/5 rounded-2xl',
    none: 'rounded-3xl'
  }

  const style = variants[variant]
  const borderClass = borderStyles[borderStyle]

  return (
    <motion.div
      className={`
        relative overflow-hidden
        ${style.gradient} ${style.borderColor} ${style.glowColor}
        ${borderClass} ${fullHeight ? 'h-full' : ''}
        transition-all duration-300
        ${className}
      `}
      initial={animated ? { opacity: 0, y: 20 } : {}}
      animate={animated ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      
      {/* Background Pattern - Gaming DNA */}
      {backgroundPattern && (
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: 'radial-gradient(circle at 25% 25%, currentColor 1px, transparent 1px)',
              backgroundSize: '50px 50px',
              color: style.accentColor.includes('blue') ? '#4fb7fb' :
                     style.accentColor.includes('yellow') ? '#fbcd4f' :
                     style.accentColor.includes('purple') ? '#a54ffb' : '#ffffff'
            }}
          />
        </div>
      )}

      {/* Animated Particles */}
      {particles && (
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={animated ? {
                scale: [1, 1.4, 1],
                opacity: [0.3, 0.7, 0.3],
                y: [0, -5, 0],
              } : {}}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>
      )}

      {/* Header Section - Gaming Style */}
      {(headerTitle || headerSubtitle || HeaderIcon || headerActions) && (
        <div className="relative z-10 p-4 md:p-6 pb-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
              {HeaderIcon && (
                <motion.div 
                  className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 flex-shrink-0"
                  whileHover={animated ? { rotate: 12, scale: 1.1 } : {}}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <HeaderIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </motion.div>
              )}
              
              <div className="min-w-0 flex-1">
                {headerTitle && (
                  <h2 className="font-luxdrop font-black text-lg md:text-2xl text-white uppercase tracking-wide leading-none truncate">
                    {headerTitle}
                  </h2>
                )}
                {headerSubtitle && (
                  <p className="text-white/70 text-xs md:text-sm font-medium mt-1 truncate">
                    {headerSubtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Header Actions */}
            {headerActions && (
              <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 ml-2">
                {headerActions}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="relative z-10 p-4 md:p-6">
        {children}
      </div>

      {/* Corner Accents - Gaming DNA */}
      <div className="absolute top-4 right-4 w-8 h-8 opacity-30">
        <div className="w-full h-full border-2 border-white/40 border-l-0 border-b-0 rounded-tr-2xl" />
      </div>
      <div className="absolute bottom-4 left-4 w-8 h-8 opacity-30">
        <div className="w-full h-full border-2 border-white/40 border-r-0 border-t-0 rounded-bl-2xl" />
      </div>
    </motion.div>
  )
}

export default GamingContainer