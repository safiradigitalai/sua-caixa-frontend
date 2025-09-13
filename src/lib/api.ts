import axios, type { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios'
import toast from 'react-hot-toast'
import type {
  ApiResponse,
  ApiError,
  Caixa,
  CaixaDetalhada,
  FeedGanhador,
  EstatisticasGerais,
  PagamentoPIXResponse,
  StatusPagamentoResponse,
  ResultadoAbertura,
  TransparenciaCaixa,
  PaginationParams,
  FilterParams
} from '@/types'

// Interfaces para autenticação
interface RegistroRequest {
  nome: string
  telefone: string
  email?: string
  dataNascimento?: string
}

interface LoginRequest {
  telefone: string
}

interface AtualizarPerfilRequest {
  nome?: string
  email?: string
  dataNascimento?: string
}

// ==============================================
// CONFIGURAÇÃO BASE DA API
// ==============================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Criar instância do axios com tipos
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// ==============================================
// INTERCEPTORS
// ==============================================

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Adicionar token de auth se existir
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log da requisição em desenvolvimento
    if (import.meta.env.DEV) {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data)
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log da resposta em desenvolvimento
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data)
    }

    return response
  },
  (error) => {
    // Log de erro
    if (import.meta.env.DEV) {
      console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data)
    }

    // Tratamento de erros comum
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          // Token expirado ou inválido
          localStorage.removeItem('auth_token')
          toast.error('Sessão expirada. Faça login novamente.')
          // Redirecionar para login se necessário
          break

        case 403:
          toast.error('Acesso negado')
          break

        case 404:
          toast.error('Recurso não encontrado')
          break

        case 429:
          toast.error('Muitas tentativas. Aguarde um pouco.')
          break

        case 500:
          toast.error('Erro interno do servidor')
          break

        default:
          // Mostrar mensagem de erro da API se disponível
          const message = data?.erro || data?.message || 'Erro inesperado'
          toast.error(message)
      }
    } else if (error.request) {
      // Erro de rede
      toast.error('Sem conexão com a internet')
    } else {
      toast.error('Erro inesperado')
    }

    return Promise.reject(error)
  }
)

// ==============================================
// TIPOS ESPECÍFICOS DA API
// ==============================================

interface CriarCaixaRequest {
  nome: string
  descricao?: string
  subtitulo?: string
  preco: number
  custo_estimado?: number
  imagem_url?: string
  banner_url?: string
  cores_tema?: Record<string, string>
  destaque?: boolean
  ordem_exibicao?: number
}

interface AtualizarCaixaRequest extends Partial<CriarCaixaRequest> {
  ativa?: boolean
}

interface AdicionarItemRequest {
  item_id: string
  peso: number
  limites?: {
    maximo_por_usuario?: number
    maximo_por_dia?: number
  }
}

interface CriarPagamentoRequest {
  usuario_id: string
  caixa_id: string
  valor: number
  metodo?: 'pix'
}

interface RegistroRequest {
  nome: string
  telefone: string
  email?: string
  data_nascimento?: string
}

interface LoginRequest {
  telefone: string
  senha?: string
}

interface AtualizarPerfilRequest {
  nome?: string
  email?: string
  data_nascimento?: string
}

// ==============================================
// CAIXAS API
// ==============================================

export const caixasAPI = {
  // Listar caixas ativas (público)
  listar: (): Promise<AxiosResponse<ApiResponse<CaixaDetalhada[]>>> =>
    api.get('/caixas'),

  // Detalhes da caixa (público)
  buscarPorId: (
    id: string, 
    incluirItens: boolean = false
  ): Promise<AxiosResponse<ApiResponse<CaixaDetalhada>>> => 
    api.get(`/caixas/${id}`, { params: { incluir_itens: incluirItens } }),

  // Transparência da caixa (público)
  obterTransparencia: (id: string): Promise<AxiosResponse<ApiResponse<TransparenciaCaixa>>> => 
    api.get(`/caixas/${id}/transparencia`),

  // Simular abertura (público)
  simular: (
    id: string, 
    quantidade: number = 1
  ): Promise<AxiosResponse<ApiResponse<ResultadoAbertura[]>>> => 
    api.get(`/caixas/${id}/simular`, { params: { quantidade } }),

  // Admin: Criar caixa
  criar: (dados: CriarCaixaRequest): Promise<AxiosResponse<ApiResponse<CaixaDetalhada>>> => 
    api.post('/admin/caixas', dados),

  // Admin: Atualizar caixa
  atualizar: (
    id: string, 
    dados: AtualizarCaixaRequest
  ): Promise<AxiosResponse<ApiResponse<CaixaDetalhada>>> => 
    api.put(`/admin/caixas/${id}`, dados),

  // Admin: Adicionar item à caixa
  adicionarItem: (
    caixaId: string, 
    itemId: string, 
    peso: number, 
    limites?: AdicionarItemRequest['limites']
  ): Promise<AxiosResponse<ApiResponse<{ success: boolean }>>> => 
    api.post(`/admin/caixas/${caixaId}/itens`, { 
      item_id: itemId, 
      peso, 
      limites 
    }),

  // Admin: Remover item da caixa
  removerItem: (
    caixaId: string, 
    itemId: string
  ): Promise<AxiosResponse<ApiResponse<{ success: boolean }>>> => 
    api.delete(`/admin/caixas/${caixaId}/itens/${itemId}`),

  // Admin: Estatísticas
  obterEstatisticas: (
    periodo: number = 7
  ): Promise<AxiosResponse<ApiResponse<EstatisticasGerais>>> => 
    api.get('/admin/caixas/estatisticas', { params: { periodo } }),
}

// ==============================================
// TRANSPARÊNCIA API
// ==============================================

export const transparenciaAPI = {
  // Todas as caixas transparentes
  listarCaixas: (): Promise<AxiosResponse<ApiResponse<CaixaDetalhada[]>>> => 
    api.get('/transparencia/caixas'),

  // Transparência detalhada de uma caixa
  obterCaixa: (
    id: string, 
    historico: boolean = false
  ): Promise<AxiosResponse<ApiResponse<TransparenciaCaixa>>> => 
    api.get(`/transparencia/caixas/${id}`, { params: { historico } }),

  // Feed de ganhadores
  feedGanhadores: (
    limite: number = 50, 
    filtros: FilterParams = {}
  ): Promise<AxiosResponse<ApiResponse<FeedGanhador[]>>> => 
    api.get('/transparencia/ganhadores', { params: { limite, ...filtros } }),

  // Estatísticas gerais
  obterEstatisticas: (
    periodo: number = 7
  ): Promise<AxiosResponse<ApiResponse<EstatisticasGerais>>> => 
    api.get('/transparencia/estatisticas', { params: { periodo } }),

  // Dados de auditoria
  obterAuditoria: (
    dataInicio: string, 
    dataFim: string
  ): Promise<AxiosResponse<ApiResponse<any>>> => 
    api.get('/transparencia/auditoria', { 
      params: { data_inicio: dataInicio, data_fim: dataFim } 
    }),

  // Análise de probabilidades
  analiseProbabilidades: (
    caixaId: string, 
    amostras: number = 1000
  ): Promise<AxiosResponse<ApiResponse<any>>> => 
    api.get(`/transparencia/analise-probabilidades/${caixaId}`, { params: { amostras } }),
}

// ==============================================
// PAGAMENTOS API
// ==============================================

export const pagamentosAPI = {
  // Criar pagamento PIX
  criarPix: (dados: CriarPagamentoRequest): Promise<AxiosResponse<ApiResponse<PagamentoPIXResponse>>> => 
    api.post('/pagamentos/pix', dados),

  // Status do pagamento
  obterStatus: (id: string): Promise<AxiosResponse<ApiResponse<StatusPagamentoResponse>>> => 
    api.get(`/pagamentos/${id}`),

  // Histórico do usuário
  listarPorUsuario: (
    usuarioId: string, 
    filtros: FilterParams & PaginationParams = {}
  ): Promise<AxiosResponse<ApiResponse<StatusPagamentoResponse[]>>> => 
    api.get(`/pagamentos/usuario/${usuarioId}`, { params: filtros }),

  // Admin: Reprocessar pagamento
  reprocessar: (
    id: string, 
    novoStatus: string, 
    motivo: string
  ): Promise<AxiosResponse<ApiResponse<{ success: boolean }>>> => 
    api.post(`/admin/pagamentos/${id}/reprocessar`, { 
      novo_status: novoStatus, 
      motivo 
    }),

  // Admin: Estatísticas
  obterEstatisticas: (
    periodo: number = 7
  ): Promise<AxiosResponse<ApiResponse<EstatisticasGerais>>> => 
    api.get('/admin/pagamentos/estatisticas', { params: { periodo } }),
}

// ==============================================
// COMPRAS API
// ==============================================

export const comprasAPI = {
  // Histórico do usuário
  listarPorUsuario: (
    usuarioId: string, 
    limite: number = 50
  ): Promise<AxiosResponse<ApiResponse<ResultadoAbertura[]>>> => 
    api.get(`/compras/usuario/${usuarioId}`, { params: { limite } }),

  // Detalhes da compra
  buscarPorId: (
    id: string, 
    incluirVerificacao: boolean = false
  ): Promise<AxiosResponse<ApiResponse<ResultadoAbertura>>> => 
    api.get(`/compras/${id}`, { params: { verificacao: incluirVerificacao } }),

  // Abrir caixa (ação principal!)
  abrir: (id: string): Promise<AxiosResponse<ApiResponse<ResultadoAbertura>>> => 
    api.post(`/compras/${id}/abrir`),

  // Verificar resultado Provably Fair
  verificar: (id: string): Promise<AxiosResponse<ApiResponse<{ valido: boolean; detalhes: any }>>> => 
    api.get(`/compras/${id}/verificar`),

  // Admin: Marcar como enviada
  marcarEnviada: (
    id: string, 
    dadosEnvio: { codigo_rastreio?: string; transportadora?: string }
  ): Promise<AxiosResponse<ApiResponse<{ success: boolean }>>> => 
    api.put(`/admin/compras/${id}/enviar`, dadosEnvio),

  // Admin: Marcar como entregue
  marcarEntregue: (id: string): Promise<AxiosResponse<ApiResponse<{ success: boolean }>>> => 
    api.put(`/admin/compras/${id}/entregar`),

  // Admin: Estatísticas
  obterEstatisticas: (
    periodo: number = 30
  ): Promise<AxiosResponse<ApiResponse<EstatisticasGerais>>> => 
    api.get('/admin/compras/estatisticas', { params: { periodo } }),
}

// ==============================================
// GANHADORES API
// ==============================================

export const ganhadoresAPI = {
  // Ganhadores recentes (público)
  recentes: (limite: number = 50): Promise<AxiosResponse<ApiResponse<FeedGanhador[]>>> => 
    api.get('/ganhadores/recentes', { params: { limite } }),
}

// ==============================================
// AUTENTICAÇÃO API
// ==============================================

export const authAPI = {
  // Registro
  registro: (dados: RegistroRequest): Promise<AxiosResponse<ApiResponse<{ token: string; usuario: any }>>> => 
    api.post('/auth/registro', dados),

  // Login
  login: (dados: LoginRequest): Promise<AxiosResponse<ApiResponse<{ token: string; usuario: any }>>> => 
    api.post('/auth/login', dados),

  // Logout
  logout: (): Promise<AxiosResponse<ApiResponse<{ success: boolean }>>> => 
    api.post('/auth/logout'),

  // Perfil
  perfil: (): Promise<AxiosResponse<ApiResponse<any>>> => 
    api.get('/auth/perfil'),

  // Atualizar perfil
  atualizarPerfil: (dados: AtualizarPerfilRequest): Promise<AxiosResponse<ApiResponse<any>>> => 
    api.put('/auth/perfil', dados),
}

// ==============================================
// WEBHOOKS & UTILITÁRIOS
// ==============================================

// Polling para status de pagamento
export function pollPaymentStatus(
  pagamentoId: string, 
  callback: (status: StatusPagamentoResponse | { erro: string }) => void, 
  maxAttempts: number = 30
): void {
  let attempts = 0
  
  const poll = async (): Promise<void> => {
    try {
      attempts++
      const response = await pagamentosAPI.obterStatus(pagamentoId)
      const status = response.data.dados
      
      if (status) {
        callback(status)
      
        // Parar polling se status final ou máximo de tentativas
        if (
          status.status === 'confirmado' || 
          status.status === 'expirado' || 
          status.status === 'falhou' || 
          attempts >= maxAttempts
        ) {
          return
        }
      }
      
      // Continuar polling a cada 2 segundos
      setTimeout(poll, 2000)
    } catch (error) {
      console.error('Erro no polling:', error)
      if (attempts >= maxAttempts) {
        callback({ erro: 'Timeout no polling' })
      } else {
        setTimeout(poll, 5000) // Retry com delay maior
      }
    }
  }
  
  poll()
}

// Health check da API
export async function healthCheck(): Promise<any> {
  try {
    const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`, { timeout: 5000 })
    return response.data
  } catch (error) {
    throw new Error('API offline')
  }
}

// ==============================================
// UTILITY FUNCTIONS
// ==============================================

// Criar interceptor personalizado
export function createApiInterceptor(config: {
  onRequest?: (config: AxiosRequestConfig) => AxiosRequestConfig
  onResponse?: (response: AxiosResponse) => AxiosResponse
  onError?: (error: any) => any
}): number[] {
  const interceptors: number[] = []
  
  if (config.onRequest) {
    const requestId = api.interceptors.request.use(config.onRequest)
    interceptors.push(requestId)
  }
  
  if (config.onResponse || config.onError) {
    const responseId = api.interceptors.response.use(config.onResponse, config.onError)
    interceptors.push(responseId)
  }
  
  return interceptors
}

// Remover interceptor
export function removeApiInterceptor(interceptorIds: number[]): void {
  interceptorIds.forEach(id => {
    api.interceptors.request.eject(id)
    api.interceptors.response.eject(id)
  })
}

// Fazer request genérico tipado
export async function makeApiRequest<T = any>(
  config: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await api.request<ApiResponse<T>>(config)
    return response.data.dados || response.data
  } catch (error) {
    throw error
  }
}

// Wrapper para GET requests
export async function apiGet<T = any>(
  url: string, 
  params?: Record<string, any>
): Promise<T> {
  return makeApiRequest<T>({ method: 'GET', url, params })
}

// Wrapper para POST requests
export async function apiPost<T = any>(
  url: string, 
  data?: any
): Promise<T> {
  return makeApiRequest<T>({ method: 'POST', url, data })
}

// Wrapper para PUT requests
export async function apiPut<T = any>(
  url: string, 
  data?: any
): Promise<T> {
  return makeApiRequest<T>({ method: 'PUT', url, data })
}

// Wrapper para DELETE requests
export async function apiDelete<T = any>(
  url: string
): Promise<T> {
  return makeApiRequest<T>({ method: 'DELETE', url })
}

// Export da instância principal
export default api