import React from 'react'
import { motion } from 'framer-motion'
import { getRaridadeInfo, cn } from '../../lib/utils'

const RaridadeBadge = ({ 
  raridade, 
  size = 'md', 
  showIcon = true, 
  animated = false,
  className = '' 
}) => {
  if (!raridade) return null

  const info = getRaridadeInfo(raridade)
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  const iconSizes = {
    sm: 'text-xs',
    md: 'text-sm', 
    lg: 'text-base'
  }

  const badge = (
    <div className={cn(
      "inline-flex items-center gap-1 font-semibold rounded-full border backdrop-blur-sm",
      info.bgColor,
      info.textColor,
      info.borderColor,
      sizeClasses[size],
      className
    )}>
      {showIcon && (
        <span className={iconSizes[size]} role="img" aria-label={`Raridade ${info.label}`}>
          {info.emoji}
        </span>
      )}
      <span>{info.label}</span>
    </div>
  )

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: 'spring', 
          stiffness: 500, 
          damping: 30,
          delay: 0.1 
        }}
        whileHover={{ scale: 1.05 }}
      >
        {badge}
      </motion.div>
    )
  }

  return badge
}

// Componente especializado para hover tooltip
export const RaridadeTooltip = ({ raridade, children }) => {
  const info = getRaridadeInfo(raridade)
  
  return (
    <div className="group relative">
      {children}
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
        <div className={cn(
          "px-3 py-2 rounded-lg border backdrop-blur-md text-sm font-medium whitespace-nowrap",
          info.bgColor,
          info.textColor,
          info.borderColor
        )}>
          <div className="flex items-center gap-2">
            <span role="img" aria-hidden="true">{info.emoji}</span>
            <span>Raridade {info.label}</span>
          </div>
          
          {/* Arrow */}
          <div className={cn(
            "absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent",
            `border-t-${raridade === 'lendario' ? 'gold-primary' : raridade === 'epico' ? 'blue-500' : raridade === 'raro' ? 'purple-500' : 'green-500'}`
          )} />
        </div>
      </div>
    </div>
  )
}

// Badge com animação de brilho para itens lendários
export const LegendaryBadge = ({ raridade, ...props }) => {
  const isLegendary = raridade === 'lendario'
  
  if (!isLegendary) {
    return <RaridadeBadge raridade={raridade} {...props} />
  }
  
  return (
    <motion.div
      animate={{
        boxShadow: [
          '0 0 20px rgba(245, 158, 11, 0.5)',
          '0 0 30px rgba(245, 158, 11, 0.8)',
          '0 0 20px rgba(245, 158, 11, 0.5)'
        ]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className="rounded-full"
    >
      <RaridadeBadge raridade={raridade} animated={true} {...props} />
    </motion.div>
  )
}

export default RaridadeBadge