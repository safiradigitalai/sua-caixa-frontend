import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

/**
 * GamingCard - Sistema de Design baseado nos Gaming Banners
 * Componente reutilizável que mantém a estética core dos banners gaming
 */

const GamingCard = ({ 
  variant = 'primary',
  size = 'default',
  title, 
  subtitle,
  description, 
  icon: Icon,
  badge,
  stats,
  children,
  onClick,
  href,
  className = '',
  animated = true,
  particles = true,
  glowEffect = true,
  cornerAccents = true
}) => {
  
  // Sistema de variantes baseado nos Gaming Banners
  const variants = {
    primary: {
      gradient: 'bg-gradient-to-br from-blue-900/90 via-blue-800/80 to-blue-900/90',
      accentColor: 'text-blue-300',
      glowColor: 'shadow-blue-500/20 hover:shadow-blue-500/40',
      borderGlow: 'border-blue-400/30 hover:border-blue-400/60',
      particles: '#4fb7fb'
    },
    secondary: {
      gradient: 'bg-gradient-to-br from-yellow-900/90 via-yellow-800/80 to-orange-900/90',
      accentColor: 'text-yellow-300', 
      glowColor: 'shadow-yellow-500/20 hover:shadow-yellow-500/40',
      borderGlow: 'border-yellow-400/30 hover:border-yellow-400/60',
      particles: '#fbcd4f'
    },
    accent: {
      gradient: 'bg-gradient-to-br from-purple-900/90 via-purple-800/80 to-purple-900/90',
      accentColor: 'text-purple-300',
      glowColor: 'shadow-purple-500/20 hover:shadow-purple-500/40',
      borderGlow: 'border-purple-400/30 hover:border-purple-400/60', 
      particles: '#a54ffb'
    },
    success: {
      gradient: 'bg-gradient-to-br from-emerald-900/90 via-emerald-800/80 to-emerald-900/90',
      accentColor: 'text-emerald-300',
      glowColor: 'shadow-emerald-500/20 hover:shadow-emerald-500/40',
      borderGlow: 'border-emerald-400/30 hover:border-emerald-400/60',
      particles: '#10d9a0'
    },
    danger: {
      gradient: 'bg-gradient-to-br from-red-900/90 via-red-800/80 to-red-900/90',
      accentColor: 'text-red-300',
      glowColor: 'shadow-red-500/20 hover:shadow-red-500/40',
      borderGlow: 'border-red-400/30 hover:border-red-400/60',
      particles: '#ef4444'
    }
  }

  // Tamanhos responsivos
  const sizes = {
    sm: 'p-4 h-32',
    default: 'p-6 h-48', 
    lg: 'p-8 h-64',
    auto: 'p-6'
  }

  const style = variants[variant]
  const sizeClass = sizes[size]
  
  const CardWrapper = href ? motion.a : motion.div

  const cardProps = href ? { href, target: "_blank", rel: "noopener noreferrer" } : {}
  
  if (onClick) {
    cardProps.onClick = onClick
    cardProps.role = "button"
    cardProps.tabIndex = 0
  }

  return (
    <motion.div className="relative group">
      <CardWrapper
        className={`
          ${style.gradient} relative overflow-hidden cursor-pointer
          rounded-3xl border-2 ${style.borderGlow}
          ${style.glowColor} transition-all duration-300
          ${sizeClass} flex flex-col justify-between
          ${className}
        `}
        whileHover={animated ? { scale: 1.02 } : {}}
        whileTap={animated ? { scale: 0.98 } : {}}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        {...cardProps}
      >
        
        {/* Animated Particles System */}
        {particles && (
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={animated ? {
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.8, 0.3],
                } : {}}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        )}

        {/* Cinematic Light Sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
        
        {/* Header Section */}
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              {/* Gaming Icon Container */}
              {Icon && (
                <motion.div 
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30"
                  whileHover={animated ? { rotate: 12, scale: 1.1 } : {}}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>
              )}
              
              {/* Title & Description */}
              <div className="min-w-0 flex-1">
                {title && (
                  <h3 className="font-luxdrop font-black text-xl text-white uppercase tracking-wide leading-none truncate">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-white/90 text-sm font-bold mt-1 truncate">
                    {subtitle}
                  </p>
                )}
                {description && (
                  <p className="text-white/70 text-sm font-medium mt-1 line-clamp-2">
                    {description}
                  </p>
                )}
              </div>
            </div>

            {/* Gaming Badge/Stats */}
            {(badge || stats) && (
              <div className="bg-black/30 backdrop-blur-sm rounded-xl px-3 py-1 border border-white/20 flex-shrink-0">
                {badge && (
                  <div className="text-xs text-white/70 uppercase font-bold tracking-wide">{badge}</div>
                )}
                {stats && (
                  <div className="text-lg font-luxdrop font-black text-white leading-none">{stats}</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        {children && (
          <div className="relative z-10 flex-1">
            {children}
          </div>
        )}

        {/* Bottom Gaming Elements */}
        <div className="relative z-10 flex items-center justify-between">
          {/* Action Indicator */}
          <div className="flex items-center gap-2 text-white/80">
            <ArrowRight className="w-4 h-4" />
            <span className="text-xs uppercase font-bold tracking-wide">Interagir</span>
          </div>

          {/* Gaming Dots Pattern */}
          <div className="flex items-center gap-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-white rounded-full"
                animate={animated ? {
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                } : {}}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>
        </div>

        {/* Corner Accents - Inspirado nos Gaming Banners */}
        {cornerAccents && (
          <>
            <div className="absolute top-4 right-4 w-8 h-8 opacity-60">
              <div className="w-full h-full border-2 border-white/40 border-l-0 border-b-0 rounded-tr-2xl" />
            </div>
            <div className="absolute bottom-4 left-4 w-8 h-8 opacity-60">
              <div className="w-full h-full border-2 border-white/40 border-r-0 border-t-0 rounded-bl-2xl" />
            </div>
          </>
        )}
      </CardWrapper>

      {/* Outer Glow Effect - Signature Gaming Style */}
      {glowEffect && (
        <div className={`absolute inset-0 ${style.gradient} rounded-3xl blur-xl opacity-30 -z-10 group-hover:opacity-50 transition-opacity duration-300`} />
      )}
    </motion.div>
  )
}

export default GamingCard