// ==============================================
// TIPOS BÁSICOS REUTILIZÁVEIS
// ==============================================

export type Raridade = 'comum' | 'raro' | 'epico' | 'lendario' | 'mitico'
export type TipoItem = 'fisico' | 'digital' | 'credito'
export type StatusPagamento = 'pendente' | 'confirmado' | 'expirado' | 'falhou'
export type StatusCompra = 'criada' | 'aberta' | 'enviada' | 'entregue'
export type StatusUsuario = 'ativo' | 'inativo' | 'banido'
export type MetodoPagamento = 'pix' | 'cartao' | 'boleto'

// ==============================================
// INTERFACES PRINCIPAIS (RE-EXPORT DO SUPABASE)
// ==============================================

export type {
  Usuario,
  Caixa,
  Item,
  Pagamento,
  Compra,
  CaixaItem,
  CaixaDetalhada,
  ItemDetalhado,
  FeedGanhador,
  EstatisticasGerais,
  PagamentoPIXResponse,
  StatusPagamentoResponse,
  ResultadoAbertura,
  TransparenciaCaixa,
  Database
} from '../lib/supabase'

// ==============================================
// TIPOS DE UI E COMPONENTES
// ==============================================

export type ToastType = 'success' | 'error' | 'warning' | 'info'
export type ToastPosition = 'top' | 'bottom'
export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'notification' | 'impact' | 'selection' | 'tick' | 'double'

export interface ToastOptions {
  type?: ToastType
  duration?: number
  position?: ToastPosition
  haptic?: boolean
  emoji?: string | null
}

export interface RaridadeInfo {
  label: string
  color: string
  emoji: string
  bgColor: string
  textColor: string
  borderColor: string
}

export interface TipoInfo {
  label: string
  icon: string
  description: string
  entregaImediata: boolean
}

// ==============================================
// TIPOS DE ESTADO DA APLICAÇÃO
// ==============================================

export interface AppUser {
  id: string
  nome: string
  telefone: string
  email?: string | null
  saldo: number
  totalGasto: number
  totalGanho: number
  nivel: number
  pontosXp: number
  verificado: boolean
  status: StatusUsuario
}

export interface Notificacao {
  id: string
  type: ToastType
  title: string
  message: string
  duration?: number
  createdAt: Date
  action?: {
    label: string
    handler: () => void
  }
}

export interface PWAState {
  isInstalled: boolean
  showInstallPrompt: boolean
  isOnline: boolean
  lastSync: string | null
}

export interface UIState {
  theme: 'dark' | 'light'
  sidebarOpen: boolean
  loading: boolean
  notifications: Notificacao[]
}

export interface CacheState {
  caixasCache: Caixa[] | null
  ganhadoresCache: FeedGanhador[] | null
  cacheTimestamp: string | null
}

// ==============================================
// TIPOS DE FORMULÁRIOS
// ==============================================

export interface LoginFormData {
  telefone: string
  nome?: string
}

export interface PerfilFormData {
  nome: string
  email?: string
  telefone: string
  dataNascimento?: string
}

export interface PagamentoFormData {
  caixaId: string
  usuarioId: string
  valor: number
  metodo: MetodoPagamento
}

// ==============================================
// TIPOS DE API E REQUESTS
// ==============================================

export interface ApiResponse<T = any> {
  sucesso: boolean
  dados?: T
  mensagem?: string
  erro?: string
}

export interface ApiError {
  status: number
  message: string
  code?: string
  details?: any
}

export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}

export interface FilterParams {
  search?: string
  categoria?: string
  raridade?: Raridade
  precoMin?: number
  precoMax?: number
  ativo?: boolean
}

// ==============================================
// TIPOS DE EVENTOS E CALLBACKS
// ==============================================

export type EventCallback<T = any> = (data: T) => void
export type AsyncEventCallback<T = any> = (data: T) => Promise<void>

export interface CaixaEventHandlers {
  onAbrir?: EventCallback<ResultadoAbertura>
  onError?: EventCallback<ApiError>
  onLoading?: EventCallback<boolean>
}

export interface PagamentoEventHandlers {
  onSuccess?: EventCallback<PagamentoPIXResponse>
  onStatusChange?: EventCallback<StatusPagamentoResponse>
  onError?: EventCallback<ApiError>
  onExpire?: EventCallback<void>
}

// ==============================================
// TIPOS DE CONFIGURAÇÃO
// ==============================================

export interface AppConfig {
  apiUrl: string
  supabaseUrl: string
  environment: 'development' | 'production' | 'test'
  features: {
    pwa: boolean
    notifications: boolean
    haptics: boolean
    analytics: boolean
  }
  limits: {
    cacheMaxAge: number
    maxRetries: number
    requestTimeout: number
  }
}

export interface ThemeConfig {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
  }
  fonts: {
    heading: string
    body: string
    mono: string
  }
  spacing: Record<string, string>
  breakpoints: Record<string, string>
}

// ==============================================
// TIPOS DE ANIMAÇÃO E MOTION
// ==============================================

export interface AnimationConfig {
  duration: number
  delay?: number
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out'
  iterations?: number | 'infinite'
}

export interface MotionVariants {
  initial: Record<string, any>
  animate: Record<string, any>
  exit?: Record<string, any>
  transition?: Record<string, any>
}

// ==============================================
// TIPOS DE GAMING E GAMIFICAÇÃO
// ==============================================

export interface XPGain {
  amount: number
  reason: string
  timestamp: Date
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  xpReward: number
  unlocked: boolean
  unlockedAt?: Date
}

export interface Level {
  level: number
  minXP: number
  maxXP: number
  title: string
  benefits: string[]
}

// ==============================================
// TIPOS DE ANALYTICS E TRACKING
// ==============================================

export interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp: Date
  userId?: string
  sessionId: string
}

export interface PerformanceMetrics {
  pageLoad: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  firstInputDelay: number
}

// ==============================================
// TIPOS DE STORAGE E CACHE
// ==============================================

export interface StorageInterface {
  get<T = any>(key: string, defaultValue?: T): T | null
  set(key: string, value: any): boolean
  remove(key: string): boolean
  clear(): boolean
}

export interface CacheEntry<T = any> {
  data: T
  timestamp: number
  expiresAt: number
  key: string
}

// ==============================================
// TIPOS DE VALIDAÇÃO
// ==============================================

export interface ValidationRule {
  required?: boolean
  min?: number
  max?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings?: string[]
}

export interface FormValidation {
  [fieldName: string]: ValidationRule[]
}

// ==============================================
// TIPOS DE DEVICE E PWA
// ==============================================

export interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isIOS: boolean
  isAndroid: boolean
  isPWA: boolean
  userAgent: string
  screenSize: {
    width: number
    height: number
  }
}

export interface PWAInstallPrompt {
  show: boolean
  canInstall: boolean
  deferredPrompt: any | null
}

// ==============================================
// TIPOS DE PWA E INSTALAÇÃO
// ==============================================

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

// ==============================================
// TIPOS DE WEBSOCKET E REALTIME
// ==============================================

export interface WebSocketMessage<T = any> {
  type: string
  payload: T
  timestamp: number
  id: string
}

export interface RealtimeSubscription {
  channel: string
  event: string
  callback: EventCallback
  active: boolean
}

// ==============================================
// TIPOS DE ERRO E DEBUG
// ==============================================

export interface ErrorInfo {
  message: string
  stack?: string
  componentStack?: string
  errorBoundary?: string
  timestamp: Date
}

export interface DebugInfo {
  version: string
  environment: string
  features: string[]
  userAgent: string
  timestamp: Date
}

// ==============================================
// UTILITÁRIOS DE TIPO
// ==============================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
export type NonNullable<T> = T extends null | undefined ? never : T
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never
}[keyof T]