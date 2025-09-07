import React from 'react'
import { motion } from 'framer-motion'
import { Eye, Sparkles, TrendingUp } from 'lucide-react'
import { formatCurrency } from '../../lib/utils'

const LuxDropCaseCard = ({ 
  caixa,
  onOpenCase,
  onShowTransparency,
  className = ""
}) => {
  if (!caixa) return null

  const rarityGradients = {
    'normal': 'from-gray-400 to-gray-600',
    'rare': 'from-blue-400 to-blue-600', 
    'epic': 'from-purple-400 to-purple-600',
    'legendary': 'from-yellow-400 to-yellow-600',
    'mythic': 'from-pink-400 to-pink-600'
  }

  const rarityColors = {
    'normal': 'border-gray-500 shadow-gray-500/20',
    'rare': 'border-blue-500 shadow-blue-500/20',
    'epic': 'border-purple-500 shadow-purple-500/20', 
    'legendary': 'border-yellow-500 shadow-yellow-500/20',
    'mythic': 'border-pink-500 shadow-pink-500/20'
  }

  const gradient = rarityGradients[caixa.raridade] || rarityGradients.normal
  const borderColor = rarityColors[caixa.raridade] || rarityColors.normal

  return (
    <motion.div
      className={`
        relative bg-luxdrop-cardBg border ${borderColor} 
        rounded-lg overflow-hidden group cursor-pointer
        hover:shadow-xl transition-all duration-300
        ${className}
      `}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onOpenCase(caixa)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
      
      {/* Header */}
      <div className="relative p-4 border-b border-luxdrop-borderGrey">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-luxdrop font-bold text-luxdrop-lavender text-lg tracking-wide uppercase">
            {caixa.nome}
          </h3>
          <div className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-luxdrop-lavenderGrey capitalize">
              {caixa.raridade}
            </span>
          </div>
        </div>
        
        <p className="text-sm text-luxdrop-lavenderGrey leading-relaxed">
          {caixa.descricao}
        </p>
      </div>

      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-luxdrop-darkNight to-luxdrop-background overflow-hidden">
        {caixa.imagem ? (
          <img 
            src={caixa.imagem} 
            alt={caixa.nome}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-luxdrop-primaryBlue to-purple-500 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
        )}
        
        {/* Overlay com animação */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <motion.div
            className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full"
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
          >
            Clique para abrir
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-2xl font-luxdrop font-bold text-luxdrop-lavender">
              {formatCurrency(caixa.preco)}
            </span>
            {caixa.precoOriginal && caixa.precoOriginal > caixa.preco && (
              <span className="ml-2 text-sm text-luxdrop-lavenderGrey line-through">
                {formatCurrency(caixa.precoOriginal)}
              </span>
            )}
          </div>
          
          {caixa.popularidade && (
            <div className="flex items-center gap-1 text-luxdrop-primaryBlue">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Popular</span>
            </div>
          )}
        </div>

        {/* Stats */}
        {caixa.stats && (
          <div className="flex items-center justify-between text-xs text-luxdrop-lavenderGrey mb-3">
            <span>Valor máx: {formatCurrency(caixa.stats.valorMaximo)}</span>
            <span>{caixa.stats.totalItens} itens</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <motion.button
            className="flex-1 bg-luxdrop-primaryBlue hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation()
              onOpenCase(caixa)
            }}
          >
            ABRIR CAIXA
          </motion.button>
          
          <motion.button
            className="p-2 bg-luxdrop-darkNight hover:bg-gray-700 text-luxdrop-lavender rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation()
              onShowTransparency(caixa)
            }}
          >
            <Eye className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default LuxDropCaseCard