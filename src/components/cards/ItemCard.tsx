import React from 'react'
import { motion } from 'framer-motion'
import { Package, Zap, Info } from 'lucide-react'

// Components
import RaridadeBadge, { RaridadeTooltip } from '../ui/RaridadeBadge'
import { SmartItemThumbnail } from '../ui/ItemThumbnails'

// Utils
import { formatCurrency, formatProbability, getTipoInfo, cn } from '../../lib/utils'
import type { Item } from '../../types'

// Interface para as props do ItemCard
interface ItemCardProps {
  item: Item & {
    probabilidade?: number
    chancesExibir?: string
    vezesGanho?: number
  }
  showProbability?: boolean
  showStats?: boolean
  interactive?: boolean
  compact?: boolean
  className?: string
}

const ItemCard: React.FC<ItemCardProps> = ({ 
  item, 
  showProbability = true, 
  showStats = false, 
  interactive = true,
  compact = false,
  className = '' 
}) => {

  if (!item) return null

  const {
    id,
    nome,
    descricao,
    marca,
    valor,
    raridade,
    tipo,
    imagemUrl,
    probabilidade,
    chancesExibir,
    vezesGanho = 0
  } = item

  const tipoInfo = getTipoInfo(tipo)

  return (
    <motion.div
      className={cn(
        "bg-dark-50 border border-gray-700 rounded-xl overflow-hidden transition-all duration-200",
        interactive && "hover:border-gray-600 hover:shadow-mobile-lg cursor-pointer",
        interactive && "active:scale-[0.98]",
        className
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={interactive ? { y: -2 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {/* Image Container */}
      <div className={cn(
        "relative overflow-hidden bg-gray-800",
        compact ? "aspect-square" : "aspect-[4/3]"
      )}>
        <SmartItemThumbnail 
          nome={nome}
          tipo={tipo}
          raridade={raridade}
          imagemUrl={imagemUrl}
          className="w-full h-full"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <RaridadeBadge raridade={raridade} size="sm" />
          
          {/* Tipo Badge */}
          <div className="bg-dark-100/80 backdrop-blur-sm border border-gray-600 px-2 py-1 rounded-full flex items-center gap-1">
            <span className="text-xs">{tipoInfo.icon}</span>
            <span className="text-xs font-medium text-gray-300">{tipoInfo.label}</span>
          </div>
        </div>

        {/* Probability Badge */}
        {showProbability && probabilidade && (
          <div className="absolute top-2 right-2">
            <RaridadeTooltip raridade={raridade}>
              <div className="bg-dark-100/90 backdrop-blur-sm border border-gold-primary/30 px-2 py-1 rounded-full">
                <span className="text-xs font-semibold text-gold-primary">
                  {chancesExibir || formatProbability(probabilidade)}
                </span>
              </div>
            </RaridadeTooltip>
          </div>
        )}

        {/* Popular Item Indicator */}
        {vezesGanho > 10 && (
          <div className="absolute bottom-2 left-2">
            <div className="bg-red-urgency/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3 text-white" />
              <span className="text-xs font-semibold text-white">Popular</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={cn("p-3", compact && "p-2")}>
        {/* Header */}
        <div className="mb-2">
          <h3 className={cn(
            "font-bold text-white mb-1 line-clamp-1",
            compact ? "text-sm" : "text-base"
          )}>
            {nome}
          </h3>
          
          {marca && (
            <p className="text-xs text-gray-400 mb-1">{marca}</p>
          )}
          
          {!compact && descricao && (
            <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
              {descricao}
            </p>
          )}
        </div>

        {/* Value */}
        <div className="mb-3">
          <div className="flex items-baseline gap-1">
            <span className={cn(
              "font-bold text-green-success",
              compact ? "text-lg" : "text-xl"
            )}>
              {formatCurrency(valor)}
            </span>
            {tipoInfo.entregaImediata && (
              <span className="text-xs text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                Imediato
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        {showStats && !compact && (
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="bg-dark-200/30 rounded-lg p-2">
              <p className="text-xs text-gray-400">Probabilidade</p>
              <p className="text-sm font-semibold text-gold-primary">
                {chancesExibir || formatProbability(probabilidade || 0)}
              </p>
            </div>
            
            <div className="bg-dark-200/30 rounded-lg p-2">
              <p className="text-xs text-gray-400">Já ganho</p>
              <p className="text-sm font-semibold text-white">
                {vezesGanho}x
              </p>
            </div>
          </div>
        )}

        {/* Info Footer */}
        {!compact && (
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Info className="w-3 h-3" />
              <span>{tipoInfo.description}</span>
            </div>
            
            {probabilidade && (
              <span className="font-medium">
                {(probabilidade * 100).toFixed(2)}%
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Versão compacta para listas
interface CompactItemCardProps extends Omit<ItemCardProps, 'compact' | 'showStats'> {}

export const CompactItemCard: React.FC<CompactItemCardProps> = (props) => (
  <ItemCard {...props} compact={true} showStats={false} />
)

// Versão para transparência com todos os detalhes
interface TransparencyItemCardProps extends Omit<ItemCardProps, 'showProbability' | 'showStats' | 'interactive'> {}

export const TransparencyItemCard: React.FC<TransparencyItemCardProps> = (props) => (
  <ItemCard {...props} showProbability={true} showStats={true} interactive={false} />
)

export default ItemCard