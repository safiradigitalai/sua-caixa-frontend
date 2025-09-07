import React from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Smartphone, Zap, Gift, Plus, Shield, Lock, Trophy } from 'lucide-react'
import GamingContainer from '../ui/GamingContainer'
import GamingButton from '../ui/GamingButton'

const PaymentMethodsLuxDrop = () => {
  const paymentMethods = [
    {
      name: "PIX",
      description: "Instantâneo",
      bonus: "5% BÔNUS",
      gradient: "bg-gradient-to-br from-emerald-500 to-emerald-700",
      borderColor: "border-emerald-400/60",
      textColor: "text-emerald-300",
      glowColor: "shadow-emerald-500/30",
      popular: true,
      iconComponent: Smartphone
    },
    {
      name: "Cartão", 
      description: "Visa & Master",
      bonus: "Parcelado",
      gradient: "bg-gradient-to-br from-blue-500 to-blue-700",
      borderColor: "border-blue-400/60",
      textColor: "text-blue-300",
      glowColor: "shadow-blue-500/30",
      iconComponent: CreditCard
    },
    {
      name: "Apple Pay",
      description: "Touch/Face ID",
      bonus: "Rápido",
      gradient: "bg-gradient-to-br from-gray-500 to-gray-800",
      borderColor: "border-gray-400/60",
      textColor: "text-gray-300",
      glowColor: "shadow-gray-500/30",
      iconComponent: Smartphone
    },
    {
      name: "Bitcoin",
      description: "Criptomoeda",
      bonus: "Anônimo",
      gradient: "bg-gradient-to-br from-orange-500 to-red-600",
      borderColor: "border-orange-400/60",
      textColor: "text-orange-300",
      glowColor: "shadow-orange-500/30",
      symbol: "₿"
    },
    {
      name: "Ethereum", 
      description: "ETH",
      bonus: "Seguro",
      gradient: "bg-gradient-to-br from-purple-500 to-purple-700",
      borderColor: "border-purple-400/60",
      textColor: "text-purple-300",
      glowColor: "shadow-purple-500/30",
      symbol: "Ξ"
    },
    {
      name: "USDT",
      description: "Stablecoin",
      bonus: "Estável", 
      gradient: "bg-gradient-to-br from-teal-500 to-teal-700",
      borderColor: "border-teal-400/60",
      textColor: "text-teal-300",
      glowColor: "shadow-teal-500/30",
      symbol: "₮"
    }
  ]

  return (
    <section className="mt-16 relative overflow-hidden">
      <GamingContainer 
        variant="secondary" 
        headerTitle="PAGAMENTO GAMING" 
        headerSubtitle="Escolha seu método preferido e faça seu depósito com 5% de Bônus!"
        headerIcon={Shield}
        className="mx-4"
        backgroundPattern={true}
        particles={true}
      >
        <div className="container mx-auto px-0">
          {/* Gaming Payment Badge */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-2xl text-sm font-black uppercase tracking-wider border border-emerald-400/30 shadow-lg shadow-emerald-500/20"
              whileHover={{ scale: 1.05 }}
            >
              <Trophy className="w-4 h-4" />
              10+ MÉTODOS ACEITOS
            </motion.div>
          </motion.div>

          {/* Gaming Payment Methods Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6 mb-12">
            {paymentMethods.map((method, index) => (
              <motion.div
                key={method.name}
                className="relative group cursor-pointer"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.05 }}
              >
                {/* Gaming Popular Badge */}
                {method.popular && (
                  <motion.div
                    className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-black px-3 py-1 rounded-2xl shadow-xl z-20 border-2 border-white/30"
                    initial={{ scale: 0, rotate: 12 }}
                    animate={{ scale: 1, rotate: 12 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 500 }}
                  >
                    🔥 HOT
                  </motion.div>
                )}

                {/* Gaming Payment Card */}
                <motion.div
                  className={`
                    relative overflow-hidden transition-all duration-300
                    ${method.gradient} ${method.borderColor} ${method.glowColor}
                    border-2 rounded-3xl p-4 lg:p-6 text-center h-full
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
                        backgroundSize: '30px 30px'
                      }}
                    />
                  </div>

                  {/* Gaming Particles */}
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                          left: `${20 + i * 30}%`,
                          top: `${20 + i * 30}%`,
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
                    className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-3 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center relative z-10 border border-white/30"
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {/* Icon or Symbol */}
                    {method.iconComponent ? (
                      <method.iconComponent className="w-6 h-6 lg:w-8 lg:h-8 text-white drop-shadow-lg" />
                    ) : (
                      <span className="text-xl lg:text-3xl font-black text-white drop-shadow-lg">
                        {method.symbol}
                      </span>
                    )}
                  </motion.div>

                  {/* Gaming Method Content */}
                  <div className="relative z-10">
                    <h3 className="font-black text-white text-sm lg:text-base mb-1 uppercase tracking-wide drop-shadow-lg">
                      {method.name}
                    </h3>
                    
                    <p className="text-xs text-white/80 mb-2 font-medium drop-shadow">
                      {method.description}
                    </p>
                    
                    {/* Gaming Bonus Badge */}
                    <motion.div
                      className="inline-block bg-white/20 text-white px-2 py-1 rounded-xl text-xs font-black border border-white/30 shadow-lg"
                      whileHover={{ scale: 1.05 }}
                    >
                      {method.bonus}
                    </motion.div>
                  </div>

                  {/* Gaming Corner Accents */}
                  <div className="absolute top-3 right-3 w-6 h-6 opacity-40">
                    <div className="w-full h-full border-2 border-white/60 border-l-0 border-b-0 rounded-tr-xl" />
                  </div>
                  <div className="absolute bottom-3 left-3 w-6 h-6 opacity-40">
                    <div className="w-full h-full border-2 border-white/60 border-r-0 border-t-0 rounded-bl-xl" />
                  </div>

                  {/* Cinematic Light Sweep */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

          {/* Gaming Deposit CTA */}
          <motion.div
            className="flex flex-col lg:flex-row items-center justify-between gap-6 mt-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {/* Gaming Deposit Button - Left Side */}
            <div className="flex-shrink-0">
              <GamingButton
                variant="success"
                size="xl"
                icon={Gift}
                arrowAnimation={true}
                className="text-2xl px-16 py-6"
              >
                DEPOSITAR AGORA
              </GamingButton>
              
              <motion.p 
                className="text-white/80 text-sm mt-4 flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Zap className="w-4 h-4 text-emerald-400" />
                Depósitos processados em menos de 30 segundos
              </motion.p>
            </div>

            {/* Gaming Security Features - Right Side */}
            <motion.div
              className="flex flex-wrap justify-center lg:justify-end gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              {/* SSL Security Badge */}
              <motion.div
                className="flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-3 rounded-2xl border border-emerald-400/40 shadow-lg shadow-emerald-500/20"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Lock className="w-5 h-5" />
                <div className="text-center">
                  <div className="text-sm font-black">SSL 256</div>
                  <div className="text-xs opacity-80">Criptografia</div>
                </div>
              </motion.div>

              {/* 24/7 Monitoring Badge */}
              <motion.div
                className="flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-3 rounded-2xl border border-blue-400/40 shadow-lg shadow-blue-500/20"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Shield className="w-5 h-5" />
                <div className="text-center">
                  <div className="text-sm font-black">24/7</div>
                  <div className="text-xs opacity-80">Anti-Fraude</div>
                </div>
              </motion.div>

              {/* PCI DSS Badge */}
              <motion.div
                className="flex items-center gap-2 bg-purple-500/20 text-purple-300 px-4 py-3 rounded-2xl border border-purple-400/40 shadow-lg shadow-purple-500/20"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Trophy className="w-5 h-5" />
                <div className="text-center">
                  <div className="text-sm font-black">PCI DSS</div>
                  <div className="text-xs opacity-80">Certificado</div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
      </GamingContainer>
    </section>
  )
}

export default PaymentMethodsLuxDrop