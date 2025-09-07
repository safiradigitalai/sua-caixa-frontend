import React from 'react'
import { motion } from 'framer-motion'
import { Eye, Sparkles, TrendingUp, Crown, Zap, Gift } from 'lucide-react'
import { formatCurrency } from '../../lib/utils'

const LuxDropCaseCardV2 = ({ 
  caixa,
  onOpenCase,
  onShowTransparency,
  className = "",
  featured = false
}) => {
  if (!caixa) return null

  // Mapear raridade para gradientes e efeitos
  const rarityConfig = {
    'comum': {
      gradient: 'from-gray-500/20 to-gray-600/20',
      border: 'border-gray-500/30',
      glow: 'shadow-gray-500/10',
      icon: Gift,
      label: 'COMUM'
    },
    'raro': {
      gradient: 'from-blue-500/20 to-blue-600/20',
      border: 'border-blue-500/40', 
      glow: 'shadow-blue-500/20',
      icon: Sparkles,
      label: 'RARO'
    },
    'epico': {
      gradient: 'from-purple-500/20 to-purple-600/20',
      border: 'border-purple-500/40',
      glow: 'shadow-purple-500/20',
      icon: Crown,
      label: 'ÉPICO'
    },
    'lendario': {
      gradient: 'from-yellow-500/20 to-yellow-600/20',
      border: 'border-yellow-500/50',
      glow: 'shadow-yellow-500/30',
      icon: Crown,
      label: 'LENDÁRIO'
    },
    'mitico': {
      gradient: 'from-pink-500/20 to-pink-600/20',
      border: 'border-pink-500/50',
      glow: 'shadow-pink-500/30',
      icon: Zap,
      label: 'MÍTICO'
    }
  }

  // Determinar raridade baseada no preço
  let rarity = 'comum'
  if (caixa.preco >= 500) rarity = 'mitico'
  else if (caixa.preco >= 100) rarity = 'lendario'
  else if (caixa.preco >= 50) rarity = 'epico'
  else if (caixa.preco >= 20) rarity = 'raro'

  const config = rarityConfig[rarity]
  const IconComponent = config.icon

  return (
    <motion.div
      className={`
        relative group cursor-pointer
        bg-gradient-to-br from-luxdrop-darkNight to-luxdrop-background
        rounded-2xl overflow-hidden
        border-2 ${config.border} ${config.glow}
        hover:shadow-2xl hover:shadow-current/20
        transition-all duration-300
        ${featured ? 'lg:col-span-2' : ''}
        ${className}
      `}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onOpenCase(caixa)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, ${config.border.includes('yellow') ? '#fbbf24' : config.border.includes('purple') ? '#a855f7' : config.border.includes('blue') ? '#3b82f6' : '#6b7280'} 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}
        />
      </div>

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-60 group-hover:opacity-80 transition-opacity duration-300`} />
      
      {/* Light Sweep Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

      {/* Header */}
      <div className="relative p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          {/* Featured Badge */}
          {featured && (
            <motion.div
              className="absolute -top-2 -left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-black px-3 py-1 rounded-full shadow-lg z-10"
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: -12 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
            >
              ⭐ DESTAQUE
            </motion.div>
          )}

          {/* Rarity Badge */}
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${config.border} bg-black/30 backdrop-blur-sm`}>
            <IconComponent className="w-4 h-4 text-current" />
            <span className="text-xs font-bold uppercase tracking-wider text-luxdrop-lavender">
              {config.label}
            </span>
          </div>

          {/* Popular Indicator */}
          {caixa.total_compras > 100 && (
            <div className="flex items-center gap-1 text-orange-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-medium">HOT</span>
            </div>
          )}
        </div>
        
        <h3 className="font-luxdrop font-bold text-luxdrop-lavender text-xl lg:text-2xl leading-tight mb-2">
          {caixa.nome}
        </h3>
        
        <p className="text-sm text-luxdrop-lavenderGrey leading-relaxed">
          {caixa.subtitulo || caixa.descricao}
        </p>
      </div>

      {/* Visual Preview */}
      <div className="relative h-48 lg:h-56 overflow-hidden">
        {caixa.imagem_url || caixa.banner_url ? (
          <img 
            src={caixa.imagem_url || caixa.banner_url} 
            alt={caixa.nome}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          // Fallback visual
          <div className="relative w-full h-full bg-gradient-to-br from-current/10 to-current/20 flex items-center justify-center">
            {/* Floating Icons Animation */}
            <div className="relative">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-8 h-8 rounded-full bg-current/20 flex items-center justify-center"
                  style={{
                    left: `${-40 + (i * 15)}px`,
                    top: `${-20 + (i % 2) * 20}px`,
                  }}
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.4, 0.8, 0.4],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2 + i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3
                  }}
                >
                  <IconComponent className="w-4 h-4 text-current" />
                </motion.div>
              ))}
              
              {/* Center Icon */}
              <div className="w-20 h-20 rounded-2xl bg-current/30 flex items-center justify-center backdrop-blur-sm border border-current/20">
                <IconComponent className="w-10 h-10 text-luxdrop-lavender" />
              </div>
            </div>
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <motion.div
            className="bg-luxdrop-primaryBlue/90 backdrop-blur-md text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            whileHover={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            🎁 ABRIR CAIXA
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative p-4 space-y-4">
        {/* Price Display */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl lg:text-4xl font-luxdrop font-black text-luxdrop-lavender">
                {formatCurrency(caixa.preco)}
              </span>
              {caixa.preco_original && caixa.preco_original > caixa.preco && (
                <span className="text-lg text-luxdrop-lavenderGrey line-through">
                  {formatCurrency(caixa.preco_original)}
                </span>
              )}
            </div>
            {caixa.custo_estimado && (
              <div className="text-sm text-emerald-400 font-medium">
                EV: ~{formatCurrency(caixa.custo_estimado)}
              </div>
            )}
          </div>
          
          {/* Stats */}
          {caixa.total_compras > 0 && (
            <div className="text-right">
              <div className="text-luxdrop-lavenderGrey text-sm">
                {caixa.total_compras} aberturas
              </div>
              {caixa.total_valor_distribuido > 0 && (
                <div className="text-emerald-400 text-sm font-medium">
                  {formatCurrency(caixa.total_valor_distribuido)} distribuídos
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <motion.button
            className="flex-1 bg-luxdrop-primaryBlue hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg hover:shadow-blue-500/25"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation()
              onOpenCase(caixa)
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <Gift className="w-5 h-5" />
              <span>ABRIR</span>
            </div>
          </motion.button>
          
          <motion.button
            className="p-3 bg-luxdrop-darkNight hover:bg-gray-700 text-luxdrop-lavender rounded-xl transition-colors border border-white/10 hover:border-white/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation()
              onShowTransparency(caixa)
            }}
            title="Ver transparência"
          >
            <Eye className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Corner Glow Effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-current/20 to-transparent opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-current/20 to-transparent opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none" />
    </motion.div>
  )
}

export default LuxDropCaseCardV2