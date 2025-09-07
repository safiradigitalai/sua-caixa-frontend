import React from 'react'
import { motion } from 'framer-motion'
import { Package, Truck, ThumbsUp, CreditCard, Shield, Zap } from 'lucide-react'
import GamingContainer from '../ui/GamingContainer'
import GamingButton from '../ui/GamingButton'

const HowItWorksLuxDrop = () => {
  const steps = [
    {
      icon: Package,
      title: "Escolha Sua Caixa",
      description: "Selecione entre nossas mystery boxes premium com prêmios reais e transparência total",
      gradient: "bg-gradient-to-br from-blue-500 to-blue-700",
      borderColor: "border-blue-400/60",
      textColor: "text-blue-300",
      glowColor: "shadow-blue-500/30"
    },
    {
      icon: CreditCard,
      title: "Pagamento Seguro",
      description: "PIX instantâneo com 5% de bônus! Pagamentos seguros e verificados em tempo real",
      gradient: "bg-gradient-to-br from-emerald-500 to-emerald-700", 
      borderColor: "border-emerald-400/60",
      textColor: "text-emerald-300",
      glowColor: "shadow-emerald-500/30"
    },
    {
      icon: Zap,
      title: "Abertura Transparente",
      description: "Sistema provably fair com algoritmo verificável. Veja exatamente como seu prêmio foi sorteado!",
      gradient: "bg-gradient-to-br from-purple-500 to-purple-700",
      borderColor: "border-purple-400/60",
      textColor: "text-purple-300",
      glowColor: "shadow-purple-500/30"
    },
    {
      icon: Truck,
      title: "Envio Expresso",
      description: "Prêmios físicos entregues na sua casa com frete grátis. Créditos disponíveis na hora!",
      gradient: "bg-gradient-to-br from-orange-500 to-red-600",
      borderColor: "border-orange-400/60",
      textColor: "text-orange-300",
      glowColor: "shadow-orange-500/30"
    },
    {
      icon: ThumbsUp,
      title: "Produtos Autênticos",
      description: "Receba produtos premium originais com garantia de autenticidade e procedência",
      gradient: "bg-gradient-to-br from-yellow-500 to-yellow-700",
      borderColor: "border-yellow-400/60",
      textColor: "text-yellow-300",
      glowColor: "shadow-yellow-500/30"
    },
    {
      icon: Shield,
      title: "100% Transparente",
      description: "Todas as probabilidades públicas. Histórico completo de ganhadores e comprovantes",
      gradient: "bg-gradient-to-br from-cyan-500 to-cyan-700",
      borderColor: "border-cyan-400/60",
      textColor: "text-cyan-300",
      glowColor: "shadow-cyan-500/30"
    }
  ]

  return (
    <section className="mt-16 relative overflow-hidden">
      <GamingContainer 
        variant="primary" 
        headerTitle="COMO FUNCIONA" 
        headerSubtitle="Seis passos para ganhar seus prêmios dos sonhos com total transparência"
        headerIcon={Zap}
        className="mx-4"
        backgroundPattern={true}
        particles={true}
      >
        <div className="container mx-auto px-0">
          {/* Gaming Header Badge */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-2xl text-sm font-black uppercase tracking-wider border border-blue-400/30 shadow-lg shadow-blue-500/20"
              whileHover={{ scale: 1.05 }}
            >
              <Zap className="w-4 h-4" />
              PROCESSO GAMING
            </motion.div>
          </motion.div>

          {/* Gaming Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Gaming Step Number */}
                <motion.div
                  className={`absolute -top-3 -left-3 w-12 h-12 rounded-2xl ${step.gradient} flex items-center justify-center text-white font-black text-xl ${step.glowColor} shadow-xl z-20 border-2 border-white/30`}
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {index + 1}
                </motion.div>

                {/* Gaming Card Block */}
                <motion.div
                  className={`
                    relative overflow-hidden transition-all duration-300
                    ${step.gradient} ${step.borderColor} ${step.glowColor}
                    border-2 rounded-3xl p-6 lg:p-8 h-full
                    hover:scale-[1.02] hover:shadow-2xl
                    group-hover:border-white/40
                  `}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  {/* Gaming Background Pattern */}
                  <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <div 
                      className="w-full h-full"
                      style={{
                        backgroundImage: 'radial-gradient(circle at 25% 25%, currentColor 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                      }}
                    />
                  </div>

                  {/* Gaming Particles */}
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none">
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1.5 h-1.5 bg-white rounded-full"
                        style={{
                          left: `${20 + i * 25}%`,
                          top: `${20 + i * 25}%`,
                        }}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.3, 0.8, 0.3],
                          rotate: [0, 360]
                        }}
                        transition={{
                          duration: 2 + Math.random(),
                          repeat: Infinity,
                          delay: i * 0.3,
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Gaming Icon Container */}
                  <motion.div
                    className="w-16 h-16 lg:w-20 lg:h-20 bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-6 relative z-10 border border-white/30"
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <step.icon className="w-full h-full text-white drop-shadow-lg" />
                  </motion.div>

                  {/* Gaming Content */}
                  <div className="relative z-10">
                    <h3 className="text-xl lg:text-2xl font-black text-white uppercase tracking-wide mb-3 drop-shadow-lg">
                      {step.title}
                    </h3>
                    
                    <p className="text-white/90 leading-relaxed font-medium drop-shadow">
                      {step.description}
                    </p>
                  </div>

                  {/* Gaming Corner Accents */}
                  <div className="absolute top-4 right-4 w-8 h-8 opacity-40">
                    <div className="w-full h-full border-2 border-white/60 border-l-0 border-b-0 rounded-tr-2xl" />
                  </div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 opacity-40">
                    <div className="w-full h-full border-2 border-white/60 border-r-0 border-t-0 rounded-bl-2xl" />
                  </div>

                  {/* Cinematic Light Sweep */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

          {/* Gaming CTA Layout */}
          <motion.div
            className="flex flex-col lg:flex-row items-center justify-between gap-6 mt-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {/* Button - Left Side */}
            <div className="flex-shrink-0">
              <GamingButton
                variant="primary"
                size="lg"
                icon={Package}
                arrowAnimation={true}
                className="text-xl px-12 py-6"
              >
                COMEÇAR AGORA
              </GamingButton>
            </div>
            
            {/* Gaming Features Badges - Right Side */}
            <motion.div 
              className="flex flex-wrap justify-center lg:justify-end gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              {/* Pagamento Seguro */}
              <motion.div
                className="flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-2 rounded-xl border border-emerald-400/40 shadow-lg shadow-emerald-500/20"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wide">PAGAMENTO SEGURO</span>
              </motion.div>

              {/* Entrega Garantida */}
              <motion.div
                className="flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3 py-2 rounded-xl border border-blue-400/40 shadow-lg shadow-blue-500/20"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wide">ENTREGA GARANTIDA</span>
              </motion.div>

              {/* Suporte 24/7 */}
              <motion.div
                className="flex items-center gap-2 bg-purple-500/20 text-purple-300 px-3 py-2 rounded-xl border border-purple-400/40 shadow-lg shadow-purple-500/20"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wide">SUPORTE 24/7</span>
              </motion.div>
            </motion.div>
          </motion.div>
      </GamingContainer>
    </section>
  )
}

export default HowItWorksLuxDrop