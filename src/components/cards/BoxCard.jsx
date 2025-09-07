import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Eye, TrendingUp, ShoppingCart, Zap, Users, Award } from 'lucide-react'

// Hooks e utilitários
import { formatCurrency, formatCompactNumber, triggerHaptic, cn } from '../../lib/utils'
import { useUI } from '../../stores/useAppStore'

const BoxCard = ({ 
  caixa, 
  showStats = true, 
  showActions = true, 
  featured = false,
  className = '',
  onTransparency,
  onBuy
}) => {
  const { haptic } = useUI()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

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

  // Memoizar calculos custosos
  const stats = useMemo(() => ({
    ticketMedio: totalCompras > 0 ? totalValorDistribuido / totalCompras : 0,
    margemEstimada: preco > 0 && custoEstimado > 0 
      ? ((preco - custoEstimado) / preco * 100).toFixed(1) 
      : 0
  }), [totalCompras, totalValorDistribuido, preco, custoEstimado])

  // Memoizar configuracao de raridade
  const rarityConfig = useMemo(() => {
    const getRarityFromPrice = (price) => {
      if (price >= 199) return 'lendario'
      if (price >= 100) return 'epico' 
      if (price >= 50) return 'raro'
      return 'comum'
    }
    
    const level = getRarityFromPrice(preco)
    const configs = {
      comum: { gradient: 'from-green-500/20 to-green-600/20', border: 'border-green-500/30', glow: 'shadow-green' },
      raro: { gradient: 'from-purple-500/20 to-purple-600/20', border: 'border-purple-500/30', glow: 'shadow-purple' },
      epico: { gradient: 'from-blue-500/20 to-blue-600/20', border: 'border-blue-500/30', glow: 'shadow-blue' },
      lendario: { gradient: 'from-gold-primary/20 to-gold-600/20', border: 'border-gold-primary/30', glow: 'shadow-gold' }
    }
    
    return { level, config: configs[level] }
  }, [preco])

  const handleTransparencyClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // Ver Odds clicado
    haptic?.('medium')
    onTransparency?.(caixa)
  }

  const handleBuyClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // Comprar clicado
    haptic?.('medium')  
    onBuy?.(caixa)
  }

  return (
    <motion.div
      className={cn(
        "relative group overflow-hidden rounded-2xl bg-dark-50",
        "border backdrop-blur-md transition-all duration-300",
        featured 
          ? `${rarityConfig.config.border} ${rarityConfig.config.glow}` 
          : "border-gray-700 hover:border-gray-600",
        featured && "ring-1 ring-gold-primary/20",
        className
      )}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Featured Badge */}
      {(destaque || featured) && (
        <div className="absolute top-3 left-3 z-20">
          <div className="flex items-center gap-1 bg-gold-primary/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <Award className="w-3 h-3 text-white" />
            <span className="text-xs font-semibold text-white">Destaque</span>
          </div>
        </div>
      )}

      {/* Popularity Indicator */}
      {pontuacaoPopularidade > 0.5 && (
        <div className="absolute top-3 right-3 z-20">
          <div className="flex items-center gap-1 bg-red-urgency/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <Zap className="w-3 h-3 text-white" />
            <span className="text-xs font-semibold text-white">Hot</span>
          </div>
        </div>
      )}

      {/* Background Gradient */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-10",
        rarityConfig.config.gradient
      )} />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-800">
          {!imageError && imagemUrl && (
            <img
              src={imagemUrl}
              alt={nome}
              className={cn(
                "w-full h-full object-cover transition-all duration-500",
                imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          )}

          {/* Fallback quando imagem falha */}
          {imageError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-gray-500 mx-auto mb-2" />
              <p className="text-sm text-gray-400">{nome}</p>
            </div>
          )}

          {/* Loading Skeleton */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 skeleton animate-pulse bg-gray-700" />
          )}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Header */}
          <div className="mb-3">
            <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
              {nome}
            </h3>
            {subtitulo && (
              <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
                {subtitulo}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gold-primary">
                {formatCurrency(preco)}
              </span>
              {custoEstimado > 0 && (
                <span className="text-sm text-gray-400">
                  valor médio: {formatCurrency(custoEstimado)}
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          {showStats && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-dark-200/50 rounded-lg p-2">
                <div className="flex items-center gap-1 mb-1">
                  <Users className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-400">Compras</span>
                </div>
                <p className="text-sm font-semibold text-white">
                  {formatCompactNumber(totalCompras)}
                </p>
              </div>
              
              <div className="bg-dark-200/50 rounded-lg p-2">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-400">Distribuído</span>
                </div>
                <p className="text-sm font-semibold text-white">
                  {formatCurrency(totalValorDistribuido)}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex gap-2">
              <button
                onClick={handleTransparencyClick}
                className="btn-secondary flex-1 py-2 px-3 text-sm"
                style={{ cursor: 'pointer' }}
              >
                <Eye className="w-4 h-4" />
                <span>Ver Odds</span>
              </button>
              
              <button
                onClick={handleBuyClick}
                className="btn-primary flex-2 py-2 px-4 text-sm font-semibold"
                style={{ cursor: 'pointer' }}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Comprar</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Shine Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[400%] transition-transform duration-1000" />
      </div>
    </motion.div>
  )
}

// Versões especializadas do BoxCard
export const FeaturedBoxCard = (props) => (
  <BoxCard {...props} featured={true} className="col-span-2" />
)

export const CompactBoxCard = (props) => (
  <BoxCard {...props} showStats={false} className="aspect-square" />
)

export default BoxCard