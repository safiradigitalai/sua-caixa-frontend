import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  TrendingUp
} from 'lucide-react'

// Import new casino icons (sem emojis)
import {
  CasinoChip,
  VipBadge,
  HotLabel,
  ViewOdds,
  PlayButton,
  RarityCommon,
  RarityRare,
  RarityEpic,
  RarityLegendary,
  RarityMythic
} from '../ui/CasinoIcons'

// Import thumbnails
import { SmartBoxThumbnail } from '../ui/BoxThumbnails'

// Hooks e utilitários
import { formatCurrency, formatCompactNumber, triggerHaptic, cn } from '../../lib/utils'
import { useUI } from '../../stores/useAppStore'

const BoxCardVegasRefined = ({ 
  caixa, 
  showStats = true, 
  showActions = true, 
  featured = false,
  variant = 'pink', // pink, lime, cyan, gold
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
    coresTema = {},
    totalCompras = 0,
    totalValorDistribuido = 0,
    pontuacaoPopularidade = 0,
    destaque = false
  } = caixa

  // Configurar raridade baseada no preço com ícones profissionais
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
        icon: RarityCommon, 
        color: 'text-vegas-white',
        badge: 'rarity-comum',
        chip: 'chip-white',
        label: 'BRONZE'
      },
      raro: { 
        icon: RarityRare, 
        color: 'text-neon-cyan',
        badge: 'rarity-raro', 
        chip: 'chip-green',
        label: 'PRATA'
      },
      epico: { 
        icon: RarityEpic, 
        color: 'text-neon-purple',
        badge: 'rarity-epico',
        chip: 'chip-purple', 
        label: 'OURO'
      },
      lendario: { 
        icon: RarityLegendary, 
        color: 'text-vegas-gold',
        badge: 'rarity-lendario',
        chip: 'chip-yellow',
        label: 'PLATINA'
      },
      mitico: { 
        icon: RarityMythic, 
        color: 'text-neon-pink',
        badge: 'rarity-mitico',
        chip: 'chip-red',
        label: 'DIAMANTE'
      }
    }
    
    return { level, ...configs[level] }
  }, [preco])

  // Determinar variant baseado na raridade ou props
  const cardVariant = useMemo(() => {
    if (rarityConfig.level === 'mitico') return 'pink'
    if (rarityConfig.level === 'lendario') return 'gold'
    if (rarityConfig.level === 'epico') return 'purple'
    if (rarityConfig.level === 'raro') return 'cyan'
    return variant
  }, [rarityConfig.level, variant])

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
    triggerHaptic('medium')
    onBuy?.(caixa)
  }

  const RarityIcon = rarityConfig.icon

  return (
    <motion.div
      className={cn(
        "card-vegas-brutal relative overflow-hidden cursor-pointer",
        `variant-${cardVariant}`,
        featured && "scale-105 z-10",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ 
        scale: 1.03,
        rotate: 0,
        z: 20
      }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 20, rotate: -0.5 }}
      animate={{ opacity: 1, y: 0, rotate: -0.5 }}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      style={{
        transformOrigin: 'center center'
      }}
    >
      {/* Vegas Glitter Effect */}
      <div className="vegas-glitter absolute inset-0" />

      {/* Hot/Featured Badges - Ícones Profissionais */}
      <div className="absolute top-brutal-2 left-brutal-2 right-brutal-2 z-20 flex justify-between items-start">
        {(destaque || featured) && (
          <motion.div 
            initial={{ x: -100, opacity: 0, rotate: -45 }}
            animate={{ x: 0, opacity: 1, rotate: -15 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-vegas-gold px-brutal-2 py-1 transform rotate-12 border-2 border-brutal-black shadow-brutal-red"
          >
            <div className="flex items-center gap-1">
              <VipBadge className="w-4 h-4 text-brutal-black" />
              <span className="text-xs font-brutalist text-brutal-black uppercase tracking-wider">VIP</span>
            </div>
          </motion.div>
        )}

        {pontuacaoPopularidade > 0.7 && (
          <motion.div 
            initial={{ x: 100, opacity: 0, scale: 0 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-brutal-fire px-brutal-2 py-1 border-2 border-brutal-white shadow-neon-pink animate-neon-flicker"
          >
            <div className="flex items-center gap-1">
              <HotLabel className="w-4 h-4 text-brutal-white animate-pulse" />
              <span className="text-xs font-brutalist text-brutal-white uppercase tracking-wider">HOT</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Rarity Badge - Chip Style com Ícones Profissionais */}
      <div className="absolute top-brutal-2 right-brutal-2 z-20">
        <div className={cn("chip-vegas", rarityConfig.chip)}>
          <RarityIcon className="w-6 h-6" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Image Container - Smart Thumbnail System */}
        <div className="relative aspect-[4/3] overflow-hidden bg-brutal-black border-b-brutal border-current">
          <motion.div
            className="w-full h-full"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ 
              scale: isHovered ? 1.1 : 1.05, 
              opacity: 1
            }}
            transition={{ duration: 0.5 }}
          >
            <SmartBoxThumbnail 
              nome={nome}
              preco={formatCurrency(preco)}
              imagemUrl={imagemUrl}
              className="w-full h-full"
            />
          </motion.div>

          {/* Vegas Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-brutal-black via-transparent to-transparent opacity-80" />
          
          {/* Neon Scan Line */}
          <motion.div
            className={cn("absolute inset-0 h-1 top-0 opacity-80")}
            style={{
              background: `var(--neon-${cardVariant})`,
              boxShadow: `0 0 20px var(--neon-${cardVariant})`
            }}
            animate={{ 
              y: isHovered ? [0, 200, 0] : 0,
              opacity: isHovered ? [0, 1, 0] : 0
            }}
            transition={{ duration: 1.5, ease: "linear" }}
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 p-brutal-3 space-y-brutal-2 bg-brutal-black">
          {/* Title - Vegas Style */}
          <div>
            <h3 className="text-vegas-subtitle mb-1">
              {nome}
            </h3>
            {subtitulo && (
              <p className="text-xs text-vegas-gold font-cyber opacity-80 uppercase tracking-wider">
                {subtitulo}
              </p>
            )}
          </div>

          {/* Price Display - Chip Stack */}
          <div className="flex items-center justify-between">
            <div className="relative">
              <div className="text-brutal-price">
                {formatCurrency(preco)}
              </div>
              {custoEstimado > 0 && (
                <div className="text-xs text-neon-lime font-cyber">
                  AVG: {formatCurrency(custoEstimado)}
                </div>
              )}
            </div>
            
            {/* Rarity Badge */}
            <div className={cn("badge-rarity", rarityConfig.badge)}>
              {rarityConfig.label}
            </div>
          </div>

          {/* Stats - Com Ícones Profissionais */}
          {showStats && (
            <div className="grid grid-cols-2 gap-brutal-2">
              <div className="bg-gradient-brutal-ice p-brutal-2 border-2 border-neon-cyan transform rotate-1 hover:rotate-0 transition-transform">
                <div className="flex items-center gap-1 mb-1">
                  <Users className="w-3 h-3 text-brutal-black" />
                  <span className="text-xs text-brutal-black font-brutalist uppercase">Plays</span>
                </div>
                <p className="text-lg font-brutalist text-brutal-black">
                  {formatCompactNumber(totalCompras)}
                </p>
              </div>
              
              <div className="bg-gradient-vegas-red p-brutal-2 border-2 border-vegas-white transform -rotate-1 hover:rotate-0 transition-transform">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp className="w-3 h-3 text-vegas-white" />
                  <span className="text-xs text-vegas-white font-brutalist uppercase">Won</span>
                </div>
                <p className="text-lg font-brutalist text-vegas-white">
                  {formatCurrency(totalValorDistribuido, true)}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons - Ícones Profissionais */}
          {showActions && (
            <div className="flex gap-brutal-2 pt-brutal-1">
              <button
                onClick={handleTransparencyClick}
                className="btn-vegas-secondary flex-1 flex items-center justify-center gap-2"
              >
                <ViewOdds className="w-4 h-4" />
                <span>ODDS</span>
              </button>
              
              <button
                onClick={handleBuyClick}
                className="btn-vegas-primary flex-[2] flex items-center justify-center gap-2"
              >
                <PlayButton className="w-4 h-4" />
                <span>PLAY NOW</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Special Effects for Mythic - Sem Emojis */}
      {rarityConfig.level === 'mitico' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-neon-cyber opacity-20 animate-rainbow-flow" />
          <motion.div
            className="absolute inset-0 border-4 border-neon-pink"
            animate={{ 
              boxShadow: [
                '0 0 20px var(--neon-pink), inset 0 0 20px var(--neon-pink)',
                '0 0 40px var(--neon-cyan), inset 0 0 40px var(--neon-cyan)', 
                '0 0 20px var(--neon-lime), inset 0 0 20px var(--neon-lime)',
                '0 0 20px var(--neon-pink), inset 0 0 20px var(--neon-pink)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}
    </motion.div>
  )
}

// Versões especializadas com variants predefinidos
export const BoxCardVegasPinkRefined = (props) => (
  <BoxCardVegasRefined {...props} variant="pink" />
)

export const BoxCardVegasLimeRefined = (props) => (
  <BoxCardVegasRefined {...props} variant="lime" />
)

export const BoxCardVegasCyanRefined = (props) => (
  <BoxCardVegasRefined {...props} variant="cyan" />
)

export const BoxCardVegasGoldRefined = (props) => (
  <BoxCardVegasRefined {...props} variant="gold" />
)

export const FeaturedBoxCardVegasRefined = (props) => (
  <BoxCardVegasRefined {...props} featured={true} className="col-span-2" />
)

export default BoxCardVegasRefined