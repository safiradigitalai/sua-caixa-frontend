import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { storage } from '../lib/utils'

// ==============================================
// STORE GLOBAL DA APLICAÇÃO
// ==============================================

const useAppStore = create(
  persist(
    (set, get) => ({
      // ==============================================
      // ESTADO INICIAL
      // ==============================================
      
      // PWA e configurações
      isInstalled: false,
      showInstallPrompt: false,
      isOnline: navigator.onLine,
      lastSync: null,
      
      // UI State
      theme: 'dark', // sempre dark no Sua Caixa
      sidebarOpen: false,
      loading: false,
      notifications: [],
      
      // User data (usuário demo para demonstração)
      user: {
        id: 'demo-user-1',
        nome: 'Usuário Demo',
        telefone: '+55 11 99999-9999',
        saldo: 127.50,
        totalGasto: 234.90,
        totalGanho: 189.75,
        nivel: 3,
        pontosXp: 285
      },
      isAuthenticated: true,
      
      // Cache básico
      caixasCache: null,
      ganhadoresCache: null,
      cacheTimestamp: null,
      
      // ==============================================
      // ACTIONS - PWA
      // ==============================================
      
      setInstalled: (installed) => set({ isInstalled: installed }),
      
      setInstallPrompt: (show) => set({ showInstallPrompt: show }),
      
      setOnline: (online) => {
        set({ isOnline: online })
        if (online) {
          set({ lastSync: new Date().toISOString() })
        }
      },
      
      // ==============================================
      // ACTIONS - UI
      // ==============================================
      
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      closeSidebar: () => set({ sidebarOpen: false }),
      
      setLoading: (loading) => set({ loading }),
      
      addNotification: (notification) => {
        const id = Date.now().toString()
        const newNotification = { id, ...notification, createdAt: new Date() }
        
        set((state) => ({
          notifications: [newNotification, ...state.notifications].slice(0, 10) // Max 10
        }))
        
        // Auto remove após delay
        const delay = notification.duration || 5000
        setTimeout(() => {
          get().removeNotification(id)
        }, delay)
        
        return id
      },
      
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      
      clearNotifications: () => set({ notifications: [] }),
      
      // ==============================================
      // ACTIONS - AUTH
      // ==============================================
      
      login: (userData, token) => {
        storage.set('auth_token', token)
        set({ 
          user: userData, 
          isAuthenticated: true 
        })
      },
      
      logout: () => {
        storage.remove('auth_token')
        set({ 
          user: null, 
          isAuthenticated: false,
          caixasCache: null,
          ganhadoresCache: null,
          cacheTimestamp: null
        })
      },
      
      updateUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData }
      })),

      updateUserBalance: (novoSaldo) => set((state) => ({
        user: state.user ? { ...state.user, saldo: novoSaldo } : null
      })),
      
      // ==============================================
      // ACTIONS - CACHE
      // ==============================================
      
      setCaixasCache: (caixas) => {
        const timestamp = new Date().toISOString()
        set({ 
          caixasCache: caixas, 
          cacheTimestamp: timestamp 
        })
      },
      
      setGanhadoresCache: (ganhadores) => {
        const timestamp = new Date().toISOString()
        set({ 
          ganhadoresCache: ganhadores, 
          cacheTimestamp: timestamp 
        })
      },
      
      isCacheValid: (maxAgeMinutes = 5) => {
        const state = get()
        if (!state.cacheTimestamp) return false
        
        const cacheTime = new Date(state.cacheTimestamp)
        const now = new Date()
        const diffMinutes = (now - cacheTime) / (1000 * 60)
        
        return diffMinutes < maxAgeMinutes
      },
      
      clearCache: () => set({ 
        caixasCache: null, 
        ganhadoresCache: null, 
        cacheTimestamp: null 
      }),
      
      // ==============================================
      // ACTIONS - UTILITIES
      // ==============================================
      
      showSuccess: (message, options = {}) => {
        get().addNotification({
          type: 'success',
          title: 'Sucesso!',
          message,
          ...options
        })
      },
      
      showError: (message, options = {}) => {
        get().addNotification({
          type: 'error',
          title: 'Erro',
          message,
          ...options
        })
      },
      
      showInfo: (message, options = {}) => {
        get().addNotification({
          type: 'info',
          title: 'Informação',
          message,
          ...options
        })
      },
      
      showWarning: (message, options = {}) => {
        get().addNotification({
          type: 'warning',
          title: 'Atenção',
          message,
          ...options
        })
      },
      
      // Trigger haptic feedback
      haptic: (type = 'light') => {
        if (window.triggerHaptic) {
          window.triggerHaptic(type)
        }
      },
      
      // Reset complete store
      reset: () => set({
        user: null,
        isAuthenticated: false,
        sidebarOpen: false,
        loading: false,
        notifications: [],
        caixasCache: null,
        ganhadoresCache: null,
        cacheTimestamp: null,
      }),
      
    }),
    {
      name: 'sua-caixa-store', // Local storage key
      partialize: (state) => ({
        // Persistir apenas dados importantes
        isInstalled: state.isInstalled,
        theme: state.theme,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        lastSync: state.lastSync,
        // Cache com timestamp para validação
        caixasCache: state.caixasCache,
        ganhadoresCache: state.ganhadoresCache,
        cacheTimestamp: state.cacheTimestamp,
      }),
      onRehydrateStorage: () => (state) => {
        // Após carregar do localStorage
        if (state) {
          // Validar cache ao carregar
          if (!state.isCacheValid(5)) {
            state.clearCache()
          }
          
          // Verificar se token ainda é válido
          const token = storage.get('auth_token')
          if (!token && state.isAuthenticated) {
            state.logout()
          }
        }
      },
    }
  )
)

// ==============================================
// HOOKS ESPECÍFICOS (CONVENIENTES)
// ==============================================

// Hook para dados do usuário
export const useUser = () => useAppStore((state) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
  login: state.login,
  logout: state.logout,
  updateUser: state.updateUser,
}))

// Hook para notificações
export const useNotifications = () => useAppStore((state) => ({
  notifications: state.notifications,
  addNotification: state.addNotification,
  removeNotification: state.removeNotification,
  clearNotifications: state.clearNotifications,
  showSuccess: state.showSuccess,
  showError: state.showError,
  showInfo: state.showInfo,
  showWarning: state.showWarning,
}))

// Hook para estado da UI
export const useUI = () => useAppStore((state) => ({
  loading: state.loading,
  sidebarOpen: state.sidebarOpen,
  setLoading: state.setLoading,
  toggleSidebar: state.toggleSidebar,
  closeSidebar: state.closeSidebar,
  haptic: state.haptic,
}))

// Hook para PWA
export const usePWA = () => useAppStore((state) => ({
  isInstalled: state.isInstalled,
  showInstallPrompt: state.showInstallPrompt,
  isOnline: state.isOnline,
  setInstalled: state.setInstalled,
  setInstallPrompt: state.setInstallPrompt,
  setOnline: state.setOnline,
}))

// Hook para cache
export const useCache = () => useAppStore((state) => ({
  caixasCache: state.caixasCache,
  ganhadoresCache: state.ganhadoresCache,
  cacheTimestamp: state.cacheTimestamp,
  setCaixasCache: state.setCaixasCache,
  setGanhadoresCache: state.setGanhadoresCache,
  isCacheValid: state.isCacheValid,
  clearCache: state.clearCache,
}))

export default useAppStore