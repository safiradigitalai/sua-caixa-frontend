import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Loader2, LucideIcon } from 'lucide-react'

/**
 * GamingButton - Sistema de botões com DNA dos Gaming Banners
 * Mantém a consistência visual e interativa
 */

// Types
type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'danger' | 'ghost' | 'outline'
type ButtonSize = 'sm' | 'default' | 'lg' | 'xl'
type IconPosition = 'left' | 'right'

interface VariantStyle {
  bg: string
  text: string
  border: string
  glow: string
  particles: string
}

interface GamingButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
  icon?: LucideIcon
  iconPosition?: IconPosition
  loading?: boolean
  disabled?: boolean
  animated?: boolean
  glowEffect?: boolean
  arrowAnimation?: boolean
  onClick?: () => void
  href?: string
  className?: string
  [key: string]: any // Para spread props
}

const GamingButton: React.FC<GamingButtonProps> = ({ 
  variant = 'primary',
  size = 'default',
  children,
  icon: Icon,
  iconPosition = 'right',
  loading = false,
  disabled = false,
  animated = true,
  glowEffect = true,
  arrowAnimation = false,
  onClick,
  href,
  className = '',
  ...props
}) => {
  
  // Sistema de variantes baseado nos Gaming Banners
  const variants: Record<ButtonVariant, VariantStyle> = {
    primary: {
      bg: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500',
      text: 'text-white',
      border: 'border-blue-400/50 hover:border-blue-300/70',
      glow: 'shadow-blue-500/25 hover:shadow-blue-400/40',
      particles: '#4fb7fb'
    },
    secondary: {
      bg: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400',
      text: 'text-white',
      border: 'border-yellow-400/50 hover:border-yellow-300/70',
      glow: 'shadow-yellow-500/25 hover:shadow-yellow-400/40',
      particles: '#fbcd4f'
    },
    accent: {
      bg: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500',
      text: 'text-white',
      border: 'border-purple-400/50 hover:border-purple-300/70',
      glow: 'shadow-purple-500/25 hover:shadow-purple-400/40',
      particles: '#a54ffb'
    },
    success: {
      bg: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500',
      text: 'text-white',
      border: 'border-emerald-400/50 hover:border-emerald-300/70',
      glow: 'shadow-emerald-500/25 hover:shadow-emerald-400/40',
      particles: '#10d9a0'
    },
    danger: {
      bg: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500',
      text: 'text-white',
      border: 'border-red-400/50 hover:border-red-300/70',
      glow: 'shadow-red-500/25 hover:shadow-red-400/40',
      particles: '#ef4444'
    },
    ghost: {
      bg: 'bg-black/20 hover:bg-black/30 backdrop-blur-sm',
      text: 'text-white',
      border: 'border-white/20 hover:border-white/40',
      glow: 'shadow-white/10 hover:shadow-white/20',
      particles: '#ffffff'
    },
    outline: {
      bg: 'bg-transparent hover:bg-white/10',
      text: 'text-white',
      border: 'border-white/40 hover:border-white/60',
      glow: 'shadow-white/10 hover:shadow-white/20',
      particles: '#ffffff'
    }
  }

  const sizes: Record<ButtonSize, string> = {
    sm: 'px-4 py-2 text-sm min-h-[36px]',
    default: 'px-6 py-3 text-base min-h-[44px]',
    lg: 'px-8 py-4 text-lg min-h-[52px]',
    xl: 'px-10 py-5 text-xl min-h-[60px]'
  }

  const style = variants[variant]
  const sizeClass = sizes[size]
  
  const ButtonComponent = href ? motion.a : motion.button
  const buttonProps: any = href ? { href, target: "_blank", rel: "noopener noreferrer" } : {}
  
  if (onClick) {
    buttonProps.onClick = onClick
  }

  const isDisabled = disabled || loading

  return (
    <ButtonComponent
      className={`
        relative overflow-hidden group
        ${style.bg} ${style.text} ${style.border}
        border-2 rounded-2xl font-bold uppercase tracking-wide
        transition-all duration-300 flex items-center justify-center gap-3
        ${sizeClass}
        ${glowEffect ? style.glow : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      whileHover={animated && !isDisabled ? { scale: 1.02 } : {}}
      whileTap={animated && !isDisabled ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      disabled={isDisabled}
      {...buttonProps}
      {...props}
    >
      
      {/* Background Particles */}
      {animated && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 1.5 + Math.random(),
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}

      {/* Cinematic Light Sweep */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
      
      {/* Left Icon */}
      {Icon && iconPosition === 'left' && !loading && (
        <motion.div
          animate={arrowAnimation ? { x: [0, 3, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Icon className="w-5 h-5" />
        </motion.div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-5 h-5" />
        </motion.div>
      )}

      {/* Content */}
      <span className="relative z-10 font-black">
        {children}
      </span>

      {/* Right Icon */}
      {Icon && iconPosition === 'right' && !loading && (
        <motion.div
          animate={arrowAnimation ? { x: [0, 3, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Icon className="w-5 h-5" />
        </motion.div>
      )}

      {/* Arrow Animation (default quando não há ícone) */}
      {!Icon && !loading && arrowAnimation && (
        <motion.div
          animate={{ x: [0, 3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowRight className="w-5 h-5" />
        </motion.div>
      )}

      {/* Gaming Corner Accents */}
      <div className="absolute top-1 right-1 w-4 h-4 opacity-50">
        <div className="w-full h-full border border-white/40 border-l-0 border-b-0 rounded-tr-lg" />
      </div>
      <div className="absolute bottom-1 left-1 w-4 h-4 opacity-50">
        <div className="w-full h-full border border-white/40 border-r-0 border-t-0 rounded-bl-lg" />
      </div>
    </ButtonComponent>
  )
}

export default GamingButton