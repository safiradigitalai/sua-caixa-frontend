import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const GamingBanner = ({ 
  type = 'boxes', 
  title, 
  description, 
  icon: Icon,
  to = '/',
  buttonText = 'JOGAR AGORA',
  stats = null
}) => {
  const bannerStyles = {
    boxes: {
      gradient: 'bg-luxdrop-boxes',
      accentColor: 'text-blue-300',
      glowColor: 'shadow-blue-500/20',
      borderGlow: 'border-blue-400/30',
      particles: '#4fb7fb'
    },
    battles: {
      gradient: 'bg-luxdrop-battles', 
      accentColor: 'text-yellow-300',
      glowColor: 'shadow-yellow-500/20',
      borderGlow: 'border-yellow-400/30',
      particles: '#fbcd4f'
    },
    rewards: {
      gradient: 'bg-luxdrop-rewards',
      accentColor: 'text-purple-300', 
      glowColor: 'shadow-purple-500/20',
      borderGlow: 'border-purple-400/30',
      particles: '#a54ffb'
    }
  }

  const style = bannerStyles[type]

  return (
    <motion.div 
      className="relative group"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Gaming card com bordas e efeitos */}
      <div className={`
        ${style.gradient} relative overflow-hidden 
        rounded-3xl border-2 ${style.borderGlow} hover:border-opacity-60
        ${style.glowColor} hover:shadow-2xl transition-all duration-300
        p-6 h-48 flex flex-col justify-between
      `}>
        
        {/* Particles de fundo */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Gaming shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        {/* Header com ícone e título */}
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              {Icon && (
                <motion.div 
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30"
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>
              )}
              
              <div>
                <h3 className="font-luxdrop font-black text-xl text-white uppercase tracking-wide leading-none">
                  {title}
                </h3>
                <p className="text-white/80 text-sm font-medium mt-1">
                  {description}
                </p>
              </div>
            </div>

            {/* Gaming badge/stats */}
            {stats && (
              <div className="bg-black/30 backdrop-blur-sm rounded-xl px-3 py-1 border border-white/20">
                <div className="text-xs text-white/70 uppercase font-bold tracking-wide">{stats.label}</div>
                <div className="text-lg font-luxdrop font-black text-white leading-none">{stats.value}</div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom action area */}
        <div className="relative z-10 flex items-center justify-between">
          <Link 
            to={to} 
            className="group/btn flex items-center gap-2 bg-white/90 hover:bg-white text-black font-bold px-4 py-2 rounded-xl transition-all hover:shadow-lg"
          >
            <span className="text-sm uppercase tracking-wide">{buttonText}</span>
            <motion.div
              className="w-6 h-6 bg-black rounded-lg flex items-center justify-center"
              whileHover={{ rotate: -90 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <ArrowRight className="w-3 h-3 text-white" />
            </motion.div>
          </Link>

          {/* Gaming elements decorativos */}
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 bg-white rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0,
              }}
            />
            <motion.div
              className="w-2 h-2 bg-white rounded-full"
              animate={{
                scale: [1, 1.5, 1], 
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.3,
              }}
            />
            <motion.div
              className="w-2 h-2 bg-white rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.6,
              }}
            />
          </div>
        </div>

        {/* Corner accent */}
        <div className="absolute top-4 right-4 w-8 h-8">
          <div className="w-full h-full border-2 border-white/40 border-l-0 border-b-0 rounded-tr-2xl" />
        </div>
        
        {/* Bottom corner accent */}
        <div className="absolute bottom-4 left-4 w-8 h-8">
          <div className="w-full h-full border-2 border-white/40 border-r-0 border-t-0 rounded-bl-2xl" />
        </div>
      </div>

      {/* Outer glow effect */}
      <div className={`absolute inset-0 ${style.gradient} rounded-3xl blur-xl opacity-30 -z-10 group-hover:opacity-50 transition-opacity`} />
    </motion.div>
  )
}

export default GamingBanner