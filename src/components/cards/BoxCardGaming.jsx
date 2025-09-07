import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  Eye, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  Star,
  Crown,
  Zap
} from 'lucide-react'

// Components
import { SmartBoxThumbnail } from '../ui/BoxThumbnails'

// Hooks e utilitários
import { formatCurrency, formatCompactNumber, triggerHaptic, cn } from '../../lib/utils'
import { useUI } from '../../stores/useAppStore'

const BoxCardGaming = ({ 
  caixa, 
  showStats = true, 
  showActions = true, 
  featured = false,
  variant = 'default',
  className = '',
  onTransparency,
  onBuy
}) => {
  const { haptic } = useUI()
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
    totalCompras = 0,
    totalValorDistribuido = 0,
    pontuacaoPopularidade = 0,
    destaque = false
  } = caixa

  // Sistema de raridade gaming (inspirado em Fortnite)
  const rarityConfig = useMemo(() => {
    const getRarityFromPrice = (price) => {
      if (price >= 200) return 'mythic'
      if (price >= 100) return 'legendary' 
      if (price >= 50) return 'epic'
      if (price >= 25) return 'rare'
      return 'common'
    }
    
    const level = getRarityFromPrice(preco)
    const configs = {
      common: { 
        name: 'Common',
        gradient: 'from-slate-400/20 via-gray-500/10 to-slate-400/20',
        border: 'border-slate-400/30',
        glow: 'shadow-lg shadow-slate-400/10',
        text: 'text-slate-300',
        accent: 'bg-slate-400',
        icon: Star,
        bgPattern: 'bg-gradient-to-br from-gray-800/40 to-gray-900/60'
      },
      rare: { 
        name: 'Rare',
        gradient: 'from-blue-400/25 via-cyan-500/15 to-blue-400/25',
        border: 'border-blue-400/40',
        glow: 'shadow-lg shadow-blue-400/20',
        text: 'text-blue-300',
        accent: 'bg-blue-400',
        icon: Star,
        bgPattern: 'bg-gradient-to-br from-blue-900/40 to-cyan-900/60'
      },
      epic: { 
        name: 'Epic',
        gradient: 'from-purple-400/25 via-violet-500/15 to-purple-400/25',
        border: 'border-purple-400/40',
        glow: 'shadow-lg shadow-purple-400/20',
        text: 'text-purple-300',
        accent: 'bg-purple-400',
        icon: Crown,
        bgPattern: 'bg-gradient-to-br from-purple-900/40 to-violet-900/60'
      },
      legendary: { 
        name: 'Legendary',
        gradient: 'from-yellow-400/25 via-orange-500/15 to-yellow-400/25',
        border: 'border-yellow-400/40',
        glow: 'shadow-lg shadow-yellow-400/20',
        text: 'text-yellow-300',
        accent: 'bg-yellow-400',
        icon: Crown,
        bgPattern: 'bg-gradient-to-br from-yellow-900/40 to-orange-900/60'
      },
      mythic: { 
        name: 'Mythic',
        gradient: 'from-pink-400/30 via-purple-500/20 to-cyan-400/30',
        border: 'border-pink-400/50',
        glow: 'shadow-xl shadow-pink-400/30',
        text: 'text-pink-300',
        accent: 'bg-gradient-to-r from-pink-400 to-purple-400',
        icon: Zap,
        bgPattern: 'bg-gradient-to-br from-pink-900/50 to-purple-900/70',
        special: true
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

  const RarityIcon = rarityConfig.icon

  return (
    <motion.div
      className={cn(
        "relative group overflow-hidden rounded-2xl backdrop-blur-gaming cursor-pointer",
        "border bg-black/20 card-hover-lift card-aspect-gaming", // Using LuxDrop classes
        rarityConfig.border,
        isHovered ? rarityConfig.glow : "shadow-md shadow-black/20",
        featured && "ring-1 ring-white/20",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
    >
      {/* Gaming Gradient Overlay */}
      <div className={cn(
        "absolute inset-0 opacity-40 transition-opacity duration-300",
        rarityConfig.gradient,
        isHovered ? "opacity-60" : "opacity-40"
      )} />

      {/* Background Pattern */}
      <div className={cn(
        "absolute inset-0 opacity-20",
        rarityConfig.bgPattern
      )} />

      {/* Hot Badge - Gaming Style */}
      {(destaque || featured || pontuacaoPopularidade > 0.7) && (
        <div className="absolute top-3 left-3 z-20">
          <motion.div 
            className="bg-gradient-to-r from-orange-500 to-red-500 px-2 py-1 rounded-md text-xs font-bold text-white shadow-lg"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              HOT
            </div>
          </motion.div>
        </div>
      )}

      {/* Rarity Badge - Gaming Style */}
      <div className="absolute top-3 right-3 z-20">
        <motion.div 
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold text-black shadow-lg",
            rarityConfig.accent
          )}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <RarityIcon className="w-3 h-3" />
          {rarityConfig.name}
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Image Container - 2x Maior */}
        <div className="relative aspect-[3/2] overflow-hidden min-h-[280px]">
          <motion.div
            className="w-full h-full"
            animate={{ 
              scale: isHovered ? 1.05 : 1
            }}
            transition={{ duration: 0.3 }}
          >
            <SmartBoxThumbnail 
              nome={nome}
              preco={formatCurrency(preco)}
              imagemUrl={imagemUrl}
              className="w-full h-full"
            />
          </motion.div>

          {/* Gaming Scan Line Effect */}
          {rarityConfig.special && (
            <motion.div
              className="absolute inset-0 h-1 top-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-60"
              animate={{ 
                y: isHovered ? [0, 250, 0] : 0,
                opacity: isHovered ? [0, 0.8, 0] : 0
              }}
              transition={{ duration: 2, ease: "linear", repeat: isHovered ? Infinity : 0 }}
            />
          )}
        </div>

        {/* Content Section - 2x Maior */}
        <div className="flex-1 p-6 space-y-4 bg-gradient-to-t from-black/20 to-transparent">
          {/* Title */}
          <div>
            <h3 className={cn(
              "font-bold text-2xl mb-2 line-clamp-1",
              rarityConfig.text
            )}>
              {nome}
            </h3>
            {subtitulo && (
              <p className="text-base text-gray-400 opacity-80">
                {subtitulo}
              </p>
            )}
          </div>

          {/* Price Display */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-white">
                {formatCurrency(preco)}
              </div>
              {custoEstimado > 0 && (
                <div className="text-sm text-green-400">
                  Valor médio: {formatCurrency(custoEstimado)}
                </div>
              )}
            </div>
          </div>

          {/* Stats - Gaming Style 2x Maior */}
          {showStats && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-gray-400 font-medium">Players</span>
                </div>
                <p className="text-lg font-bold text-white">
                  {formatCompactNumber(totalCompras)}
                </p>
              </div>
              
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-gray-400 font-medium">Won</span>
                </div>
                <p className="text-lg font-bold text-white">
                  {formatCurrency(totalValorDistribuido, true)}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons - Gaming Style 2x Maior */}
          {showActions && (
            <div className="flex gap-3 pt-3">
              <motion.button
                onClick={handleTransparencyClick}
                className="flex-1 bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/20 hover:border-white/40 rounded-xl py-4 px-4 text-base font-medium text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-gaming"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Eye className="w-5 h-5" />
                Odds
              </motion.button>
              
              <motion.button
                onClick={handleBuyClick}
                className={cn(
                  "flex-[2] rounded-xl py-4 px-6 text-base font-bold text-black transition-all duration-200 flex items-center justify-center gap-2",
                  rarityConfig.accent,
                  "hover:shadow-gaming-hover transform hover:scale-105 shadow-gaming"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart className="w-5 h-5" />
                Open Now
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Special Mythic Effects */}
      {rarityConfig.special && (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute inset-0 border-2 border-pink-400/50 rounded-2xl"
            animate={{ 
              boxShadow: [
                '0 0 20px rgba(244, 114, 182, 0.3)',
                '0 0 40px rgba(147, 51, 234, 0.4)', 
                '0 0 20px rgba(34, 211, 238, 0.3)',
                '0 0 20px rgba(244, 114, 182, 0.3)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}
    </motion.div>
  )
}

// Versões especializadas
export const FeaturedBoxCardGaming = (props) => (
  <BoxCardGaming {...props} featured={true} />
)

export default BoxCardGaming