import React from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

// Components
import MobileHeader from './MobileHeader'
import MobileNavigation from './MobileNavigation'
import MobileSidebar from './MobileSidebar'

// Hooks
import { useUI } from '../../stores/useAppStore'
import { cn } from '../../lib/utils'

const MobileLayout = ({ children }) => {
  const location = useLocation()
  const { sidebarOpen, closeSidebar } = useUI()

  // Páginas que não mostram navigation bottom
  const hideNavigation = ['/pagamento', '/compras'].some(path => 
    location.pathname.startsWith(path)
  )

  // Páginas com header customizado
  const customHeaderPages = ['/']
  
  // Home page precisa de mais espaçamento
  const isHomePage = location.pathname === '/'

  const showDefaultHeader = !customHeaderPages.includes(location.pathname)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 relative overflow-hidden">
      {/* Gaming Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <MobileSidebar />

      {/* Main Layout */}
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        {showDefaultHeader && <MobileHeader />}

        {/* Main Content */}
        <main className={cn(
          "flex-1 relative",
          // Padding para navigation bottom (quando mostrada)
          !hideNavigation && "pb-20 safe-area-bottom",
          // Padding para header - home precisa de mais espaço
          showDefaultHeader && "pt-4 safe-area-top",
          isHomePage && "pt-16 safe-area-top"
        )}>
          {/* Page Content com animação */}
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="min-h-full"
          >
            {children}
          </motion.div>
        </main>

        {/* Bottom Navigation */}
        {!hideNavigation && <MobileNavigation />}
      </div>
    </div>
  )
}

export default MobileLayout