import { create, type StateCreator } from 'zustand'
import { persist, type PersistOptions } from 'zustand/middleware'
import { storage } from '../lib/utils'
import type {
  AppUser,
  Notificacao,
  PWAState,
  UIState,
  CacheState,
  Caixa,
  FeedGanhador,
  ToastType,
  ToastOptions,
  HapticType
} from '@/types'

// ==============================================
// TIPOS DO STORE
// ==============================================

interface AppState extends PWAState, UIState, CacheState {
  // Dados do usuário
  user: AppUser | null
  isAuthenticated: boolean

  // ==============================================
  // ACTIONS - PWA
  // ==============================================
  setInstalled: (installed: boolean) => void
  setInstallPrompt: (show: boolean) => void
  setOnline: (online: boolean) => void

  // ==============================================
  // ACTIONS - UI
  // ==============================================
  toggleSidebar: () => void
  closeSidebar: () => void
  setLoading: (loading: boolean) => void
  addNotification: (notification: Omit<Notificacao, 'id' | 'createdAt'>) => string
  removeNotification: (id: string) => void
  clearNotifications: () => void

  // ==============================================
  // ACTIONS - AUTH
  // ==============================================
  login: (userData: AppUser, token: string) => void
  logout: () => void
  updateUser: (userData: Partial<AppUser>) => void
  updateUserBalance: (novoSaldo: number) => void
  initializeUser: (userId: string) => Promise<void>

  // ==============================================
  // ACTIONS - CACHE
  // ==============================================
  setCaixasCache: (caixas: Caixa[]) => void
  setGanhadoresCache: (ganhadores: FeedGanhador[]) => void
  isCacheValid: (maxAgeMinutes?: number) => boolean
  clearCache: () => void

  // ==============================================
  // ACTIONS - UTILITIES
  // ==============================================
  showSuccess: (message: string, options?: ToastOptions) => void
  showError: (message: string, options?: ToastOptions) => void
  showInfo: (message: string, options?: ToastOptions) => void
  showWarning: (message: string, options?: ToastOptions) => void
  haptic: (type?: HapticType) => void
  reset: () => void
}

// Estado inicial
const initialState: Pick<AppState, keyof PWAState | keyof UIState | keyof CacheState | 'user' | 'isAuthenticated'> = {
  // PWA e configurações
  isInstalled: false,
  showInstallPrompt: false,
  isOnline: navigator?.onLine ?? true,
  lastSync: null,

  // UI State
  theme: 'dark', // sempre dark no Sua Caixa
  sidebarOpen: false,
  loading: false,
  notifications: [],

  // User data - inicializar vazio para ser preenchido dinamicamente
  user: null,
  isAuthenticated: false,

  // Cache básico
  caixasCache: null,
  ganhadoresCache: null,
  cacheTimestamp: null,
}

// ==============================================
// STORE IMPLEMENTATION
// ==============================================

const storeImpl: StateCreator<AppState> = (set, get) => ({
  ...initialState,

  // ==============================================
  // ACTIONS - PWA
  // ==============================================

  setInstalled: (installed: boolean) => set({ isInstalled: installed }),

  setInstallPrompt: (show: boolean) => set({ showInstallPrompt: show }),

  setOnline: (online: boolean) => {
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

  setLoading: (loading: boolean) => set({ loading }),

  addNotification: (notification: Omit<Notificacao, 'id' | 'createdAt'>): string => {
    const id = Date.now().toString()
    const newNotification: Notificacao = { 
      id, 
      ...notification, 
      createdAt: new Date() 
    }

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

  removeNotification: (id: string) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),

  clearNotifications: () => set({ notifications: [] }),

  // ==============================================
  // ACTIONS - AUTH
  // ==============================================

  login: (userData: AppUser, token: string) => {
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

  updateUser: (userData: Partial<AppUser>) => set((state) => ({
    user: state.user ? { ...state.user, ...userData } : null
  })),

  updateUserBalance: (novoSaldo: number) => set((state) => ({
    user: state.user ? { ...state.user, saldo: novoSaldo } : null
  })),

  initializeUser: async (userId: string) => {
    try {
      set({ loading: true })
      
      // Buscar dados do usuário autenticado do Supabase Auth
      const { supabase } = await import('../lib/supabase')
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !authUser) {
        console.error('❌ Usuário não autenticado:', authError)
        throw new Error('Sessão inválida')
      }

      // Verificar se o usuário existe na tabela usuarios
      // Primeiro tenta buscar por email (caso usuário já exista com email igual)
      let { data: usuarioData, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', authUser.email)
        .single()

      // Se não encontrou por email, tenta por ID
      if (error && error.code === 'PGRST116') {
        const { data: usuarioPorId, error: errorId } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', userId)
          .single()
        
        usuarioData = usuarioPorId
        error = errorId
      }

      if (error && error.code === 'PGRST116') {
        // Usuário não existe na tabela - criar com dados do Auth
        console.log('🔄 Criando perfil de usuário na primeira vez...')
        const { data: newUser, error: insertError } = await supabase
          .from('usuarios')
          .insert([{
            id: authUser.id,
            nome: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Usuário',
            cpf: authUser.user_metadata?.cpf || null,
            telefone: authUser.user_metadata?.telefone || null,
            email: authUser.email || null,
            saldo: 0.00, // Saldo inicial zerado - usuários devem depositar
            total_gasto: 0,
            total_ganho: 0,
            nivel: 1,
            pontos_xp: 0,
            verificado: !!authUser.email_confirmed_at,
            status: 'ativo',
            atualizado_em: new Date().toISOString(),
            ultimo_login_em: new Date().toISOString()
          }])
          .select()
          .single()

        if (insertError) {
          console.error('❌ Erro ao criar usuário:', insertError)
          throw insertError
        }
        usuarioData = newUser
      } else if (error) {
        console.error('❌ Erro ao buscar usuário:', error)
        throw error
      }

      // Buscar saldo atualizado usando CarteiraAPI
      try {
        const { CarteiraAPI } = await import('../lib/carteiraAPI')
        const saldoInfo = await CarteiraAPI.buscarSaldo(userId)
        
        // Atualizar saldo na tabela se houver diferença
        if (saldoInfo.saldoAtual !== usuarioData.saldo) {
          await supabase
            .from('usuarios')
            .update({ 
              saldo: saldoInfo.saldoAtual,
              total_gasto: saldoInfo.totalGasto,
              total_ganho: saldoInfo.totalGanho
            })
            .eq('id', userId)
          
          usuarioData.saldo = saldoInfo.saldoAtual
          usuarioData.total_gasto = saldoInfo.totalGasto
          usuarioData.total_ganho = saldoInfo.totalGanho
        }
      } catch (saldoError) {
        console.warn('⚠️ Erro ao atualizar saldo, usando dados da tabela:', saldoError)
      }

      // Criar objeto de usuário com dados reais
      const userData: AppUser = {
        id: usuarioData.id,
        nome: usuarioData.nome,
        telefone: usuarioData.telefone,
        email: usuarioData.email,
        saldo: usuarioData.saldo,
        totalGasto: usuarioData.total_gasto,
        totalGanho: usuarioData.total_ganho,
        nivel: usuarioData.nivel,
        pontosXp: usuarioData.pontos_xp,
        verificado: usuarioData.verificado,
        status: usuarioData.status
      }

      set({
        user: userData,
        isAuthenticated: true,
        loading: false
      })

      console.log('✅ Usuário autenticado inicializado:', {
        id: userData.id,
        nome: userData.nome,
        email: userData.email,
        saldo: userData.saldo
      })
    } catch (error) {
      console.error('❌ Erro ao inicializar usuário autenticado:', error)
      set({ 
        user: null, 
        isAuthenticated: false, 
        loading: false 
      })
      throw error
    }
  },

  // ==============================================
  // ACTIONS - CACHE
  // ==============================================

  setCaixasCache: (caixas: Caixa[]) => {
    const timestamp = new Date().toISOString()
    set({
      caixasCache: caixas,
      cacheTimestamp: timestamp
    })
  },

  setGanhadoresCache: (ganhadores: FeedGanhador[]) => {
    const timestamp = new Date().toISOString()
    set({
      ganhadoresCache: ganhadores,
      cacheTimestamp: timestamp
    })
  },

  isCacheValid: (maxAgeMinutes: number = 5): boolean => {
    const state = get()
    if (!state.cacheTimestamp) return false

    const cacheTime = new Date(state.cacheTimestamp)
    const now = new Date()
    const diffMinutes = (now.getTime() - cacheTime.getTime()) / (1000 * 60)

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

  showSuccess: (message: string, options: ToastOptions = {}) => {
    get().addNotification({
      type: 'success',
      title: 'Sucesso!',
      message,
      ...options
    })
  },

  showError: (message: string, options: ToastOptions = {}) => {
    get().addNotification({
      type: 'error',
      title: 'Erro',
      message,
      ...options
    })
  },

  showInfo: (message: string, options: ToastOptions = {}) => {
    get().addNotification({
      type: 'info',
      title: 'Informação',
      message,
      ...options
    })
  },

  showWarning: (message: string, options: ToastOptions = {}) => {
    get().addNotification({
      type: 'warning',
      title: 'Atenção',
      message,
      ...options
    })
  },

  // Trigger haptic feedback
  haptic: (type: HapticType = 'light') => {
    if ((window as any).triggerHaptic) {
      (window as any).triggerHaptic(type)
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
})

// Configuração do persist
type PersistedState = Pick<AppState, 
  | 'isInstalled' 
  | 'theme' 
  | 'user' 
  | 'isAuthenticated' 
  | 'lastSync' 
  | 'caixasCache' 
  | 'ganhadoresCache' 
  | 'cacheTimestamp'
>

const persistConfig: PersistOptions<AppState, PersistedState> = {
  name: 'sua-caixa-store', // Local storage key
  partialize: (state): PersistedState => ({
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

// Criar o store
const useAppStore = create<AppState>()(
  persist(storeImpl, persistConfig)
)

// ==============================================
// HOOKS ESPECÍFICOS TIPADOS
// ==============================================

// Hook para dados do usuário
export const useUser = () => useAppStore((state) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
  login: state.login,
  logout: state.logout,
  updateUser: state.updateUser,
  initializeUser: state.initializeUser,
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

// ==============================================
// EXPORT PRINCIPAL
// ==============================================

export default useAppStore

export type { AppState }