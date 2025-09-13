import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Star, Zap, Crown, Shield, Eye } from 'lucide-react'

/**
 * GamingCaseCard - Card grande para caixas com espaço para thumbs/imagens
 * Mantém a estética mobile gaming mas com layout mais limpo e funcional
 */

const GamingCaseCard = ({ 
  caixa,
  onOpenCase,
  onShowTransparency,
  featured = false,
  className = '',
  animated = true
}) => {
  
  // Sistema de raridade baseado no preço ou featured
  const getRarity = () => {
    if (featured) return 'legendary'
    const preco = caixa?.preco || 0
    if (preco >= 100) return 'epic'
    if (preco >= 50) return 'rare'
    return 'common'
  }

  const rarity = getRarity()

  // Configurações por raridade - Gaming DNA
  const rarities = {
    common: {
      gradient: 'bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700',
      border: 'border-slate-400/40',
      glow: 'shadow-xl shadow-slate-500/20 hover:shadow-slate-400/40',
      accent: 'text-slate-300',
      particle: '#94a3b8'
    },
    rare: {
      gradient: 'bg-gradient-to-br from-blue-800 via-blue-600 to-blue-800',
      border: 'border-blue-400/50',
      glow: 'shadow-xl shadow-blue-500/30 hover:shadow-blue-400/50',
      accent: 'text-blue-300',
      particle: '#60a5fa'
    },
    epic: {
      gradient: 'bg-gradient-to-br from-purple-800 via-purple-600 to-purple-800',
      border: 'border-purple-400/50',
      glow: 'shadow-xl shadow-purple-500/30 hover:shadow-purple-400/50',
      accent: 'text-purple-300',
      particle: '#a855f7'
    },
    legendary: {
      gradient: 'bg-gradient-to-br from-yellow-700 via-orange-600 to-red-700',
      border: 'border-yellow-400/60',
      glow: 'shadow-xl shadow-yellow-500/40 hover:shadow-yellow-400/60',
      accent: 'text-yellow-300',
      particle: '#fbbf24'
    }
  }

  const style = rarities[rarity]

  return (
    <motion.div
      className={`relative group ${className}`}
      initial={animated ? { opacity: 0, y: 20 } : {}}
      animate={animated ? { opacity: 1, y: 0 } : {}}
      whileHover={animated ? { 
        scale: 1.02
      } : {}}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25
      }}
      style={{
        willChange: 'transform',
        backfaceVisibility: 'hidden'
      }}
    >
      <div 
        className={`
          relative overflow-hidden rounded-3xl
          ${style.gradient} ${style.border} ${style.glow}
          border-2 transition-transform duration-300
          bg-black/20
        `}
        style={{
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
      >
        
        {/* Background Pattern Gaming */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 80%, currentColor 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              color: style.particle
            }}
          />
        </div>

        {/* Rarity Badge - Top Left */}
        <div className="absolute top-3 left-3 z-20">
          <motion.div 
            className="bg-black/80 backdrop-blur-sm rounded-full px-3 py-1 border border-white/30"
            animate={animated ? {
              scale: [1, 1.05, 1],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <span className={`text-xs font-black uppercase tracking-wider ${style.accent}`}>
              {rarity}
            </span>
          </motion.div>
        </div>

        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-3 right-3 z-20">
            <motion.div 
              className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full px-2 py-1 border border-yellow-300"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Crown className="w-4 h-4 text-white" />
            </motion.div>
          </div>
        )}

        {/* Thumb/Image Area */}
        <div className="relative aspect-[4/3] bg-black/30 overflow-hidden rounded-t-3xl">
          {/* Placeholder for future images */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className={`w-20 h-20 rounded-2xl border-2 ${style.border} ${style.gradient} flex items-center justify-center`}
              whileHover={animated ? { 
                rotate: 12, 
                scale: 1.1 
              } : {}}
            >
              <Crown className="w-10 h-10 text-white drop-shadow-lg" />
            </motion.div>
          </div>

          {/* Gaming Particles on Hover - Otimizado */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  background: style.particle,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={animated ? {
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.8, 0.4],
                } : {}}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>

          {/* Light Sweep Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
        </div>

        {/* Content Area */}
        <div className="p-6">
          {/* Title & Price */}
          <div className="mb-4">
            <h3 className="font-black text-white text-lg leading-tight mb-2 drop-shadow-lg">
              {caixa?.nome}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white">
                R$ {caixa?.preco?.toFixed(2)}
              </span>
              {featured && (
                <div className="flex items-center gap-1 bg-gradient-to-r from-purple-500/80 to-pink-500/80 rounded-full px-2 py-1 border border-white/30">
                  <Sparkles className="w-3 h-3 text-white" />
                  <span className="text-white text-xs font-bold">PREMIUM</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-between mb-4 text-sm">
            <div className="flex items-center gap-1 text-white/70">
              <Zap className="w-4 h-4" />
              <span>Taxa: 87%</span>
            </div>
            <div className="flex items-center gap-1 text-white/70">
              <Shield className="w-4 h-4" />
              <span>Verificado</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <motion.button
              onClick={() => onOpenCase?.(caixa)}
              className={`
                flex-1 ${style.gradient} ${style.border}
                border-2 rounded-2xl px-4 py-3 
                text-white font-bold uppercase tracking-wide text-sm
                transition-all duration-300 flex items-center justify-center gap-2
                hover:scale-[1.02] ${style.glow}
              `}
              whileTap={{ scale: 0.98 }}
            >
              <span>ABRIR</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              onClick={() => onShowTransparency?.(caixa)}
              className="w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-2xl flex items-center justify-center transition-all backdrop-blur-sm"
              whileTap={{ scale: 0.95 }}
            >
              <Eye className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Corner Gaming Accents */}
        <div className="absolute top-4 right-4 w-6 h-6 opacity-60">
          <div className="w-full h-full border-2 border-white/40 border-l-0 border-b-0 rounded-tr-xl" />
        </div>
        <div className="absolute bottom-4 left-4 w-6 h-6 opacity-60">
          <div className="w-full h-full border-2 border-white/40 border-r-0 border-t-0 rounded-bl-xl" />
        </div>

        {/* Floating Stars on Hover - Otimizado */}
        {animated && (
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {[...Array(2)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${30 + i * 40}%`,
                  top: `${15 + i * 20}%`,
                }}
                animate={{
                  y: [-2, -5, -2],
                  scale: [0.9, 1, 0.9],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              >
                <Star className="w-2 h-2 text-yellow-300 drop-shadow-lg" />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Outer Glow Effect */}
      <div className={`absolute inset-0 ${style.gradient} rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10`} />
    </motion.div>
  )
}

export default GamingCaseCard