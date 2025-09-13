import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WifiOff, Wifi } from 'lucide-react'

// Hooks
import { usePWA } from '../../stores/useAppStore'

const OfflineIndicator: React.FC = () => {
  const { isOnline } = usePWA()

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          className="fixed top-16 left-4 right-4 z-50 safe-area-top"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="bg-red-urgency/90 backdrop-blur-md border border-red-500/30 rounded-xl p-3 shadow-lg">
            <div className="flex items-center gap-3">
              <WifiOff className="w-5 h-5 text-white shrink-0" />
              <div className="flex-1">
                <p className="text-white font-medium text-sm">
                  Sem conexão
                </p>
                <p className="text-red-100 text-xs">
                  Algumas funcionalidades podem estar limitadas
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Componente para mostrar quando volta online
export const OnlineIndicator: React.FC = () => {
  const { isOnline } = usePWA()
  const [showOnlineMessage, setShowOnlineMessage] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (isOnline) {
      setShowOnlineMessage(true)
      const timer = setTimeout(() => {
        setShowOnlineMessage(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOnline])

  return (
    <AnimatePresence>
      {showOnlineMessage && isOnline && (
        <motion.div
          className="fixed top-16 left-4 right-4 z-50 safe-area-top"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="bg-green-success/90 backdrop-blur-md border border-green-400/30 rounded-xl p-3 shadow-lg">
            <div className="flex items-center gap-3">
              <Wifi className="w-5 h-5 text-white shrink-0" />
              <div className="flex-1">
                <p className="text-white font-medium text-sm">
                  Conexão restaurada
                </p>
                <p className="text-green-100 text-xs">
                  Todas as funcionalidades disponíveis
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default OfflineIndicator