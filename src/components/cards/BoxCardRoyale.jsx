import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  Eye, 
  TrendingUp, 
  ShoppingCart, 
  Zap, 
  Users, 
  Award,
  Sparkles,
  Diamond,
  Crown
} from 'lucide-react'

// Hooks e utilitários
import { formatCurrency, formatCompactNumber, triggerHaptic, cn } from '../../lib/utils'
import { useUI } from '../../stores/useAppStore'

const BoxCardRoyale = ({ 
  caixa, 
  showStats = true, 
  showActions = true, 
  featured = false,
  variant = 'default', // default, brutal, glass
  className = '',
  onTransparency,
  onBuy
}) => {
  const { haptic } = useUI()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  if (!caixa) return null

  const {
    id,
    nome,
    descricao,
    subtitulo,
    preco,
    custoEstimado,
    imagemUrl,
    coresTema = {},
    totalCompras = 0,
    totalValorDistribuido = 0,
    pontuacaoPopularidade = 0,
    destaque = false
  } = caixa

  // Configurar raridade baseada no preço
  const rarityConfig = useMemo(() => {
    const getRarityFromPrice = (price) => {
      if (price >= 500) return 'mitico'
      if (price >= 200) return 'lendario'
      if (price >= 100) return 'epico' 
      if (price >= 50) return 'raro'
      return 'comum'
    }
    
    const level = getRarityFromPrice(preco)
    const configs = {
      comum: { 
        icon: Diamond, 
        color: 'text-silver-mirror',
        badge: 'bg-gradient-silver border-silver-gunmetal',
        glow: '',
        animation: ''
      },
      raro: { 
        icon: Diamond, 
        color: 'text-blue-600',
        badge: 'bg-gradient-to-br from-blue-600 to-blue-800 border-blue-900',
        glow: 'shadow-blue',
        animation: ''
      },
      epico: { 
        icon: Crown, 
        color: 'text-purple-500',
        badge: 'bg-gradient-to-br from-purple-600 to-purple-900 border-purple-900',
        glow: 'shadow-brutal-neon',
        animation: 'animate-pulse-slow'
      },
      lendario: { 
        icon: Crown, 
        color: 'text-gold-champagne',
        badge: 'bg-gradient-champagne border-gold-antique text-metallic-gold',
        glow: 'shadow-gold-glow',
        animation: 'animate-gold-shimmer'
      },
      mitico: { 
        icon: Sparkles, 
        color: 'text-neon-pink',
        badge: 'bg-gradient-neon border-neon-purple',
        glow: 'shadow-neon-glow',
        animation: 'animate-neon-pulse text-neon-glow'
      }
    }
    
    return { level, ...configs[level] }
  }, [preco])

  const handleTransparencyClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    haptic?.('light')
    onTransparency?.(caixa)
  }

  const handleBuyClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    haptic?.('medium')  
    onBuy?.(caixa)
  }

  // Estilos baseados na variante
  const variantStyles = {
    default: "glass-card border border-white/10",
    brutal: "brutal-card bg-casino-noir",
    glass: "glass-card-gold"
  }

  const RarityIcon = rarityConfig.icon

  return (
    <motion.div
      className={cn(
        "relative group overflow-hidden",
        variant === 'brutal' ? "rounded-none" : "rounded-luxury",
        variantStyles[variant],
        rarityConfig.glow,
        featured && "scale-105",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ 
        y: variant === 'brutal' ? 0 : -8,
        rotateY: variant === 'glass' ? 5 : 0,
        rotateX: variant === 'glass' ? -5 : 0,
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {/* Background Pattern for Luxury Feel */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--gold-champagne) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />
      </div>

      {/* Featured/Hot Badges */}
      <div className="absolute top-3 left-3 right-3 z-20 flex justify-between">
        {(destaque || featured) && (
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-1 glass-gold px-3 py-1.5 rounded-pill"
          >
            <Award className="w-3 h-3 text-gold-bright" />
            <span className="text-xs font-bold text-gold-bright uppercase tracking-wider">VIP</span>
          </motion.div>
        )}

        {pontuacaoPopularidade > 0.7 && (
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-1 bg-gradient-to-r from-neon-orange to-neon-pink px-3 py-1.5 rounded-pill"
          >
            <Zap className="w-3 h-3 text-white animate-pulse" />
            <span className="text-xs font-bold text-white">HOT</span>
          </motion.div>
        )}
      </div>

      {/* Rarity Badge */}
      <div className="absolute top-3 right-3 z-20">
        <motion.div 
          className={cn(
            "p-2 rounded-luxury border-2",
            rarityConfig.badge,
            rarityConfig.animation
          )}
          animate={isHovered ? { rotate: [0, 360] } : {}}
          transition={{ duration: 1 }}
        >
          <RarityIcon className={cn("w-5 h-5", rarityConfig.color)} />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Image Container with Casino Table Effect */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-felt">
          {!imageError && imagemUrl && (
            <motion.img
              src={imagemUrl}
              alt={nome}
              className="w-full h-full object-cover"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ 
                scale: imageLoaded ? (isHovered ? 1.05 : 1) : 1.1, 
                opacity: imageLoaded ? 1 : 0 
              }}
              transition={{ duration: 0.5 }}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          )}

          {/* Casino Overlay Effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-casino-noir via-transparent to-transparent opacity-80" />
          
          {/* Shine Effect on Hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-shimmer/20 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: isHovered ? '100%' : '-100%' }}
            transition={{ duration: 0.7 }}
          />

          {/* Loading State */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gradient-shimmer animate-shimmer" />
          )}
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-4">
          {/* Title Section */}
          <div>
            <h3 className={cn(
              "text-xl font-display uppercase tracking-wide mb-1",
              variant === 'brutal' ? "text-brutal-shadow" : "",
              featured ? "text-gold-gradient" : "text-white"
            )}>
              {nome}
            </h3>
            {subtitulo && (
              <p className="text-sm text-silver-platinum/80 line-clamp-1 font-serif italic">
                {subtitulo}
              </p>
            )}
          </div>

          {/* Price Display - Casino Chip Style */}
          <div className="flex items-center justify-between">
            <div className="chip-stack">
              <div className={cn(
                "px-4 py-2 rounded-pill border-brutal",
                "bg-gradient-gold border-casino-noir",
                "flex items-center gap-2"
              )}>
                <span className="text-2xl font-display text-casino-noir">
                  {formatCurrency(preco)}
                </span>
              </div>
            </div>
            
            {custoEstimado > 0 && (
              <div className="text-right">
                <p className="text-xs text-silver-platinum/60 uppercase tracking-wider">Valor Médio</p>
                <p className="text-sm font-bold text-gold-champagne">
                  {formatCurrency(custoEstimado)}
                </p>
              </div>
            )}
          </div>

          {/* Stats Grid - Casino Table Style */}
          {showStats && (
            <div className="grid grid-cols-2 gap-3">
              <motion.div 
                className="casino-table p-3 rounded-soft"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-gold-shimmer" />
                  <span className="text-xs text-gold-shimmer uppercase tracking-wider">Jogadas</span>
                </div>
                <p className="text-lg font-display text-white">
                  {formatCompactNumber(totalCompras)}
                </p>
              </motion.div>
              
              <motion.div 
                className="casino-table p-3 rounded-soft"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-gold-shimmer" />
                  <span className="text-xs text-gold-shimmer uppercase tracking-wider">Pago</span>
                </div>
                <p className="text-lg font-display text-white">
                  {formatCurrency(totalValorDistribuido, true)}
                </p>
              </motion.div>
            </div>
          )}

          {/* Action Buttons - Casino Style */}
          {showActions && (
            <div className="flex gap-3">
              <motion.button
                onClick={handleTransparencyClick}
                className={cn(
                  "flex-1 py-3 px-4",
                  "glass-dark border-2 border-gold-champagne/30",
                  "rounded-luxury font-bold uppercase tracking-wider",
                  "text-gold-champagne hover:border-gold-champagne",
                  "transition-all duration-200",
                  "flex items-center justify-center gap-2"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Eye className="w-4 h-4" />
                <span className="text-xs">Odds</span>
              </motion.button>
              
              <motion.button
                onClick={handleBuyClick}
                className={cn(
                  "flex-[2] py-3 px-6",
                  "brutal-button",
                  "rounded-luxury",
                  "flex items-center justify-center gap-2"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="font-display text-sm">JOGAR</span>
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Holographic Effect for Mythic */}
      {rarityConfig.level === 'mitico' && (
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="w-full h-full holographic" />
        </div>
      )}
    </motion.div>
  )
}

// Versões especializadas
export const FeaturedBoxCardRoyale = (props) => (
  <BoxCardRoyale {...props} featured={true} variant="glass" className="col-span-2" />
)

export const BrutalBoxCard = (props) => (
  <BoxCardRoyale {...props} variant="brutal" />
)

export const GlassBoxCard = (props) => (
  <BoxCardRoyale {...props} variant="glass" />
)

export default BoxCardRoyale