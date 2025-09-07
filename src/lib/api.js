import axios from 'axios'
import toast from 'react-hot-toast'

// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Criar instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

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
// CAIXAS
// ==============================================

export const caixasAPI = {
  // Listar caixas ativas (público)
  listar: () => api.get('/caixas'),

  // Detalhes da caixa (público)
  buscarPorId: (id, incluirItens = false) => 
    api.get(`/caixas/${id}`, { params: { incluir_itens: incluirItens } }),

  // Transparência da caixa (público)
  obterTransparencia: (id) => api.get(`/caixas/${id}/transparencia`),

  // Simular abertura (público)
  simular: (id, quantidade = 1) => 
    api.get(`/caixas/${id}/simular`, { params: { quantidade } }),

  // Admin: Criar caixa
  criar: (dados) => api.post('/admin/caixas', dados),

  // Admin: Atualizar caixa
  atualizar: (id, dados) => api.put(`/admin/caixas/${id}`, dados),

  // Admin: Adicionar item à caixa
  adicionarItem: (caixaId, itemId, peso, limites) => 
    api.post(`/admin/caixas/${caixaId}/itens`, { item_id: itemId, peso, limites }),

  // Admin: Remover item da caixa
  removerItem: (caixaId, itemId) => 
    api.delete(`/admin/caixas/${caixaId}/itens/${itemId}`),

  // Admin: Estatísticas
  obterEstatisticas: (periodo = 7) => 
    api.get('/admin/caixas/estatisticas', { params: { periodo } }),
}

// ==============================================
// TRANSPARÊNCIA
// ==============================================

export const transparenciaAPI = {
  // Todas as caixas transparentes
  listarCaixas: () => api.get('/transparencia/caixas'),

  // Transparência detalhada de uma caixa
  obterCaixa: (id, historico = false) => 
    api.get(`/transparencia/caixas/${id}`, { params: { historico } }),

  // Feed de ganhadores
  feedGanhadores: (limite = 50, filtros = {}) => 
    api.get('/transparencia/ganhadores', { params: { limite, ...filtros } }),

  // Estatísticas gerais
  obterEstatisticas: (periodo = 7) => 
    api.get('/transparencia/estatisticas', { params: { periodo } }),

  // Dados de auditoria
  obterAuditoria: (dataInicio, dataFim) => 
    api.get('/transparencia/auditoria', { 
      params: { data_inicio: dataInicio, data_fim: dataFim } 
    }),

  // Análise de probabilidades
  analiseProbabilidades: (caixaId, amostras = 1000) => 
    api.get(`/transparencia/analise-probabilidades/${caixaId}`, { params: { amostras } }),
}

// ==============================================
// PAGAMENTOS
// ==============================================

export const pagamentosAPI = {
  // Criar pagamento PIX
  criarPix: (dados) => api.post('/pagamentos/pix', dados),

  // Status do pagamento
  obterStatus: (id) => api.get(`/pagamentos/${id}`),

  // Histórico do usuário
  listarPorUsuario: (usuarioId, filtros = {}) => 
    api.get(`/pagamentos/usuario/${usuarioId}`, { params: filtros }),

  // Admin: Reprocessar pagamento
  reprocessar: (id, novoStatus, motivo) => 
    api.post(`/admin/pagamentos/${id}/reprocessar`, { novo_status: novoStatus, motivo }),

  // Admin: Estatísticas
  obterEstatisticas: (periodo = 7) => 
    api.get('/admin/pagamentos/estatisticas', { params: { periodo } }),
}

// ==============================================
// COMPRAS
// ==============================================

export const comprasAPI = {
  // Histórico do usuário
  listarPorUsuario: (usuarioId, limite = 50) => 
    api.get(`/compras/usuario/${usuarioId}`, { params: { limite } }),

  // Detalhes da compra
  buscarPorId: (id, incluirVerificacao = false) => 
    api.get(`/compras/${id}`, { params: { verificacao: incluirVerificacao } }),

  // Abrir caixa (ação principal!)
  abrir: (id) => api.post(`/compras/${id}/abrir`),

  // Verificar resultado Provably Fair
  verificar: (id) => api.get(`/compras/${id}/verificar`),

  // Admin: Marcar como enviada
  marcarEnviada: (id, dadosEnvio) => 
    api.put(`/admin/compras/${id}/enviar`, dadosEnvio),

  // Admin: Marcar como entregue
  marcarEntregue: (id) => api.put(`/admin/compras/${id}/entregar`),

  // Admin: Estatísticas
  obterEstatisticas: (periodo = 30) => 
    api.get('/admin/compras/estatisticas', { params: { periodo } }),
}

// ==============================================
// GANHADORES
// ==============================================

export const ganhadoresAPI = {
  // Ganhadores recentes (público)
  recentes: (limite = 50) => 
    api.get('/ganhadores/recentes', { params: { limite } }),
}

// ==============================================
// AUTENTICAÇÃO (TODO)
// ==============================================

export const authAPI = {
  // Registro
  registro: (dados) => api.post('/auth/registro', dados),

  // Login
  login: (dados) => api.post('/auth/login', dados),

  // Logout
  logout: () => api.post('/auth/logout'),

  // Perfil
  perfil: () => api.get('/auth/perfil'),

  // Atualizar perfil
  atualizarPerfil: (dados) => api.put('/auth/perfil', dados),
}

// ==============================================
// WEBHOOKS & UTILITÁRIOS
// ==============================================

// Polling para status de pagamento
export function pollPaymentStatus(pagamentoId, callback, maxAttempts = 30) {
  let attempts = 0
  
  const poll = async () => {
    try {
      attempts++
      const response = await pagamentosAPI.obterStatus(pagamentoId)
      const { status } = response.data.dados
      
      callback(response.data.dados)
      
      // Parar polling se status final ou máximo de tentativas
      if (status === 'confirmado' || status === 'expirado' || status === 'falhou' || attempts >= maxAttempts) {
        return
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
export async function healthCheck() {
  try {
    const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`, { timeout: 5000 })
    return response.data
  } catch (error) {
    throw new Error('API offline')
  }
}

// Export da instância principal
export default api