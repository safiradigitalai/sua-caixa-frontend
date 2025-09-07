import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Gift, Sparkles, User, Clock } from 'lucide-react'
import { formatCurrency, formatTime } from '../../lib/utils'

// Mock data para demonstração
const mockWins = [
  { usuario: 'João***', caixa: 'Caixa Eletrônicos Premium', item: 'iPhone 15 Pro', valor: 4999, tempo: new Date() },
  { usuario: 'Maria***', caixa: 'Caixa Gamer Elite', item: 'RTX 4080', valor: 3299, tempo: new Date(Date.now() - 30000) },
  { usuario: 'Pedro***', caixa: 'Viagem dos Sonhos', item: 'Pacote Dubai 7 dias', valor: 2800, tempo: new Date(Date.now() - 90000) },
  { usuario: 'Ana***', caixa: 'Caixa Tech Acessórios', item: 'AirPods Pro', valor: 899, tempo: new Date(Date.now() - 150000) },
  { usuario: 'Carlos***', caixa: 'Caixa Iniciante', item: 'JBL Speaker', valor: 399, tempo: new Date(Date.now() - 210000) },
]

const LiveFeed = ({ className = '', maxItems = 10 }) => {
  const [wins, setWins] = useState(mockWins)
  const [isVisible, setIsVisible] = useState(true)

  // Simular novas vitórias
  useEffect(() => {
    const interval = setInterval(() => {
      const names = ['Lucas***', 'Fernanda***', 'Gabriel***', 'Juliana***', 'Bruno***', 'Carla***', 'Rafael***', 'Sophia***']
      const caixas = ['Caixa Eletrônicos Premium', 'Caixa Gamer Elite', 'Viagem dos Sonhos', 'Caixa Tech Acessórios']
      const items = ['iPhone 15', 'MacBook Air', 'PlayStation 5', 'Smart TV 55"', 'Notebook Gamer', 'Fone Premium']
      
      const newWin = {
        usuario: names[Math.floor(Math.random() * names.length)],
        caixa: caixas[Math.floor(Math.random() * caixas.length)],
        item: items[Math.floor(Math.random() * items.length)],
        valor: Math.floor(Math.random() * 3000) + 200,
        tempo: new Date(),
        id: Date.now()
      }

      setWins(prev => [newWin, ...prev.slice(0, maxItems - 1)])
    }, Math.random() * 15000 + 10000) // Entre 10-25 segundos

    return () => clearInterval(interval)
  }, [maxItems])

  if (!isVisible) return null

  return (
    <motion.div
      className={`bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-4 ${className}`}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg">
            <Trophy className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">Live Drops</h3>
            <p className="text-green-400 text-xs font-medium">Vitórias em tempo real</p>
          </div>
        </div>
        
        <motion.button
          onClick={() => setIsVisible(false)}
          className="text-white/50 hover:text-white/80 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ×
        </motion.button>
      </div>

      {/* Live Feed List */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {wins.map((win, index) => (
            <motion.div
              key={win.id || index}
              className="flex items-start gap-3 p-3 bg-gradient-to-r from-white/5 to-transparent rounded-xl border border-white/5 hover:border-white/10 transition-all group"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: { delay: index * 0.1 }
              }}
              exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
              layout
            >
              {/* Win Icon */}
              <motion.div 
                className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center flex-shrink-0"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity }
                }}
              >
                <Gift className="w-5 h-5 text-white" />
              </motion.div>

              {/* Win Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3 text-blue-400" />
                    <span className="text-white font-semibold text-sm truncate">
                      {win.usuario}
                    </span>
                  </div>
                  <div className="text-gray-400 text-xs">ganhou</div>
                </div>

                <div className="text-emerald-400 font-bold text-sm mb-1 truncate">
                  {win.item}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 truncate">{win.caixa}</span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-yellow-400 font-bold">
                      {formatCurrency(win.valor)}
                    </span>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(win.tempo)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sparkle Animation */}
              {index === 0 && (
                <motion.div
                  className="absolute -top-1 -right-1"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1.2, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 2, repeat: 3 }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer Stats */}
      <motion.div 
        className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-emerald-400 font-semibold">
          🎁 {wins.length} vitórias hoje
        </span>
        <span className="text-gray-500">
          Total: {formatCurrency(wins.reduce((sum, win) => sum + win.valor, 0))}
        </span>
      </motion.div>
    </motion.div>
  )
}

export default LiveFeed