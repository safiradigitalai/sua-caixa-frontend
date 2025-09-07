import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Crown, 
  Zap, 
  Trophy, 
  ArrowRight, 
  Gamepad2, 
  Swords, 
  Gift,
  Users,
  Target,
  Star
} from 'lucide-react'

const GamingBannersV2 = ({ caixasCount = 0 }) => {
  const banners = [
    {
      id: 'boxes',
      title: 'LOOT BOXES',
      subtitle: 'Equipamentos e itens épicos',
      description: 'Abra caixas misteriosas e ganhe prêmios incríveis',
      icon: Crown,
      decorIcon: Gift,
      gradient: 'from-blue-500 via-blue-600 to-indigo-700',
      accentColor: 'text-blue-400',
      borderColor: 'border-blue-500/40',
      shadowColor: 'shadow-blue-500/20',
      bgPattern: 'bg-blue-900/10',
      to: '/caixas',
      buttonText: 'ABRIR CAIXAS',
      stats: {
        label: 'DISPONÍVEL',
        value: `${caixasCount}+`,
        icon: Target
      },
      features: ['Chances Reais', 'Prêmios Verificados', 'Entrega Grátis']
    },
    {
      id: 'battles',
      title: 'ARENA PVP',
      subtitle: 'Batalhe contra outros players',
      description: 'Duelar com outros jogadores e multiplicar ganhos',
      icon: Swords,
      decorIcon: Zap,
      gradient: 'from-orange-500 via-red-500 to-pink-600',
      accentColor: 'text-orange-400',
      borderColor: 'border-orange-500/40',
      shadowColor: 'shadow-orange-500/20',
      bgPattern: 'bg-orange-900/10',
      to: '/battles',
      buttonText: 'ENTRAR BATTLE',
      stats: {
        label: 'ONLINE',
        value: '127',
        icon: Users
      },
      features: ['PvP Real-time', 'Double Rewards', 'Ranking Global']
    },
    {
      id: 'rewards',
      title: 'INVENTORY',
      subtitle: 'Seus prêmios e conquistas',
      description: 'Gerencie seus itens e histórico de vitórias',
      icon: Trophy,
      decorIcon: Star,
      gradient: 'from-purple-500 via-violet-600 to-indigo-700',
      accentColor: 'text-purple-400',
      borderColor: 'border-purple-500/40',
      shadowColor: 'shadow-purple-500/20',
      bgPattern: 'bg-purple-900/10',
      to: '/rewards',
      buttonText: 'VER ITENS',
      stats: {
        label: 'TOTAL',
        value: 'R$ 89K',
        icon: Trophy
      },
      features: ['Histórico Completo', 'Prêmios Físicos', 'Créditos Ativos']
    }
  ]

  return (
    <section className="py-8 lg:py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-8 lg:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 bg-gaming-primary/20 text-gaming-primary px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-4">
            <Gamepad2 className="w-4 h-4" />
            Gaming Hub
          </div>
          <h2 className="text-3xl lg:text-5xl font-gaming-display font-black text-gaming-textPrimary mb-2">
            ESCOLHA SEU JOGO
          </h2>
          <p className="text-gaming-textSecondary text-lg max-w-2xl mx-auto">
            Três modalidades épicas para você conquistar prêmios únicos
          </p>
        </motion.div>

        {/* Gaming Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {banners.map((banner, index) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 300
              }}
              viewport={{ once: true }}
              className="relative group"
            >
              <Link 
                to={banner.to}
                className="block h-full"
              >
                {/* Main Card */}
                <motion.div
                  className={`
                    relative h-full min-h-[280px] lg:min-h-[320px]
                    bg-gradient-to-br ${banner.gradient}
                    rounded-2xl lg:rounded-3xl
                    border-2 ${banner.borderColor}
                    ${banner.shadowColor} hover:shadow-2xl
                    overflow-hidden
                    transition-all duration-300
                    group-hover:scale-[1.02]
                    group-hover:border-opacity-70
                  `}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Background Pattern */}
                  <div className={`absolute inset-0 ${banner.bgPattern} opacity-30`} />
                  
                  {/* Decorative Pattern */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div 
                      className="w-full h-full"
                      style={{
                        backgroundImage: `radial-gradient(circle at 30% 30%, currentColor 1px, transparent 1px)`,
                        backgroundSize: '24px 24px'
                      }}
                    />
                  </div>

                  {/* Light Sweep Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

                  {/* Content Container */}
                  <div className="relative z-10 p-6 lg:p-8 h-full flex flex-col">
                    {/* Header with Icons */}
                    <div className="flex items-start justify-between mb-4">
                      {/* Main Icon */}
                      <motion.div
                        className="relative"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                          <banner.icon className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                        </div>
                        
                        {/* Decorative Icon */}
                        <motion.div
                          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
                          animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 180, 360],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <banner.decorIcon className="w-4 h-4 text-white" />
                        </motion.div>
                      </motion.div>

                      {/* Stats Badge */}
                      <motion.div
                        className="bg-black/30 backdrop-blur-md rounded-xl px-3 py-2 border border-white/20"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="flex items-center gap-2">
                          <banner.stats.icon className="w-4 h-4 text-white/80" />
                          <div>
                            <div className="text-xs text-white/80 uppercase font-bold">
                              {banner.stats.label}
                            </div>
                            <div className="text-sm font-black text-white">
                              {banner.stats.value}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Title & Description */}
                    <div className="flex-1 mb-6">
                      <h3 className="text-2xl lg:text-3xl font-gaming-display font-black text-white mb-2 tracking-wide">
                        {banner.title}
                      </h3>
                      <p className="text-white/90 font-bold text-base lg:text-lg mb-3">
                        {banner.subtitle}
                      </p>
                      <p className="text-white/80 text-sm lg:text-base leading-relaxed">
                        {banner.description}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {banner.features.map((feature, idx) => (
                          <motion.span
                            key={idx}
                            className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-md font-medium border border-white/20"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + (idx * 0.1) }}
                          >
                            {feature}
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <motion.div
                      className="mt-auto"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="group/btn flex items-center justify-between bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl px-4 py-3 border border-white/30 hover:border-white/40 transition-all duration-300">
                        <span className="font-gaming font-bold text-white text-sm lg:text-base uppercase tracking-wider">
                          {banner.buttonText}
                        </span>
                        <ArrowRight className="w-5 h-5 text-white group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Corner Glow Effects */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/20 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-300 rounded-tr-2xl lg:rounded-tr-3xl" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/20 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-300 rounded-bl-2xl lg:rounded-bl-3xl" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-gaming-textMuted text-sm mb-4">
            ✨ Todos os jogos com sistema provably fair
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2 text-gaming-success">
              <div className="w-2 h-2 bg-gaming-success rounded-full animate-pulse" />
              <span className="text-sm font-bold">2.4K+ players ativos</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-gaming-textMuted rounded-full" />
            <div className="flex items-center gap-2 text-gaming-accent1">
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-bold">R$ 450K+ distribuídos</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Gaming Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl opacity-10"
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${15 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8
            }}
          >
            {['🎮', '🎯', '🏆', '⚡', '👑', '💎', '🔥', '⭐'][i]}
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default GamingBannersV2