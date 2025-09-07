import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

// Hooks
import { useNotifications } from '../../stores/useAppStore'
import { triggerHaptic, cn } from '../../lib/utils'

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications()

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return CheckCircle
      case 'error':
        return AlertCircle
      case 'warning':
        return AlertTriangle
      case 'info':
      default:
        return Info
    }
  }

  const getNotificationStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-success/90',
          border: 'border-green-400/30',
          icon: 'text-green-400'
        }
      case 'error':
        return {
          bg: 'bg-red-urgency/90',
          border: 'border-red-400/30',
          icon: 'text-red-400'
        }
      case 'warning':
        return {
          bg: 'bg-gold-primary/90',
          border: 'border-gold-400/30',
          icon: 'text-gold-400'
        }
      case 'info':
      default:
        return {
          bg: 'bg-blue-trust/90',
          border: 'border-blue-400/30',
          icon: 'text-blue-400'
        }
    }
  }

  const handleDismiss = (id) => {
    triggerHaptic('light')
    removeNotification(id)
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-16 left-4 right-4 z-50 space-y-2 safe-area-top pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => {
          const Icon = getNotificationIcon(notification.type)
          const styles = getNotificationStyles(notification.type)

          return (
            <motion.div
              key={notification.id}
              className="pointer-events-auto"
              initial={{ y: -100, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -100, opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              layout
            >
              <div className={cn(
                "backdrop-blur-md border rounded-xl p-4 shadow-lg",
                styles.bg,
                styles.border
              )}>
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <Icon className={cn("w-5 h-5 shrink-0 mt-0.5", styles.icon)} />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {notification.title && (
                      <h4 className="text-white font-semibold text-sm mb-1">
                        {notification.title}
                      </h4>
                    )}
                    <p className="text-white/90 text-sm leading-relaxed">
                      {notification.message}
                    </p>
                    
                    {notification.action && (
                      <button
                        onClick={notification.action.handler}
                        className="mt-2 text-white/80 hover:text-white text-sm font-medium underline"
                      >
                        {notification.action.label}
                      </button>
                    )}
                  </div>

                  {/* Dismiss Button */}
                  <button
                    onClick={() => handleDismiss(notification.id)}
                    className="shrink-0 p-1 text-white/60 hover:text-white transition-colors duration-150 rounded-lg hover:bg-white/10"
                    aria-label="Fechar notificação"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export default NotificationContainer