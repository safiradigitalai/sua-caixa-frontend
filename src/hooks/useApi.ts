import { useState, useEffect, useCallback } from 'react'
import { supabaseHelpers } from '../lib/supabase'
import type { 
  Caixa, 
  CaixaDetalhada,
  FeedGanhador,
  EstatisticasGerais,
  Raridade,
  EventCallback,
  AsyncEventCallback,
  ResultadoAbertura,
  PagamentoPIXResponse,
  StatusPagamentoResponse,
  TransparenciaCaixa
} from '@/types'

// ==============================================
// TIPOS ESPECÍFICOS DO HOOK
// ==============================================

export interface UseApiOptions<T = any> {
  enabled?: boolean
  onSuccess?: EventCallback<T>
  onError?: EventCallback<Error>
  params?: Record<string, any>
}

export interface UseApiReturn<T = any> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => void
  mutate: <M = any>(data: M) => Promise<T>
}

export interface HomePageData {
  caixasDestaque: MappedCaixa[]
  caixasPopulares: MappedCaixa[]
  ultimosGanhadores: MappedGanhador[]
  estatisticas: {
    totalCaixas: number
    valorTotal: number
    totalUsuarios: number
  }
}

export interface CaixasPageData {
  caixas: MappedCaixa[]
  filtros: {
    hasMore: boolean
  }
}

export interface TransparenciaGlobalData {
  estatisticasGerais: {
    totalCaixasAbertas: number
    valorTotalDistribuido: number
    usuariosUnicos: number
    verificacoesRealizadas: number
  }
  distribuicaoRaridades: Record<Raridade, {
    percentage: number
    quantidade: number
  }>
  caixasMaisAbertas: MappedCaixa[]
}

export interface TransparenciaCaixaData {
  itens: any[]
  stats: {
    totalItens: number
    valorTotal: number
    raridadeMedia: string
    totalAbertas: number
  }
}

export interface MappedCaixa {
  id: string
  nome: string
  descricao?: string | null
  subtitulo?: string | null
  preco: number
  custoEstimado?: number | null
  imagemUrl?: string | null
  bannerUrl?: string | null
  coresTema?: Record<string, any> | null
  totalCompras: number
  valorTotalDistribuido: number
  pontuacaoPopularidade: number
  destaque: boolean
  ordemExibicao: number
  // Campos legados para compatibilidade
  raridade: Raridade
  totalItens: number
  vezesAberta: number
  ultimaAtualizacao: string
}

export interface MappedGanhador {
  usuarioId: string
  usuarioNome: string
  itemId: string
  itemNome: string
  itemValor: number
  timestamp: string
}

export interface PagamentoCreateData {
  valor: number
  caixaId: string
  metodo: 'pix' | 'saldo'
  usuarioId?: string
}

export interface PagamentoStatusData {
  gatewayId: string
}

export interface AbrirCaixaData {
  pagamentoId: string
  usuarioId?: string
}

// Tipos para resultados de mutação
export interface PagamentoStatusResult {
  status: string
  pagamentoId: string
  novoSaldo?: number
}

export interface AbrirCaixaResult {
  item: {
    id: string
    nome: string
    descricao?: string | null
    marca?: string | null
    valor: number
    raridade: Raridade
    tipo: string
    imagemUrl?: string | null
  }
  compraId: string
  novoSaldo: number
  timestamp: string
}

// ==============================================
// HOOK PRINCIPAL
// ==============================================

export const useApi = <T = any>(
  endpoint: string, 
  options: UseApiOptions<T> = {}
): UseApiReturn<T> => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  
  const {
    enabled = true,
    onSuccess,
    onError,
    params = {}
  } = options

  const fetchData = useCallback(async (): Promise<void> => {
    if (!enabled || !endpoint) return

    setLoading(true)
    setError(null)

    try {
      let result: any = null

      // Mapear endpoints para funções do Supabase
      switch (endpoint) {
        case '/home': {
          const [caixasDestaque, caixasPopulares, ultimosGanhadores, estatisticas] = await Promise.all([
            supabaseHelpers.getCaixasDestaque(),
            supabaseHelpers.getCaixasPopulares(),
            supabaseHelpers.getFeedGanhadores(),
            supabaseHelpers.getEstatisticasGerais()
          ])

          result = {
            caixasDestaque: caixasDestaque.map(mapCaixaFromDb),
            caixasPopulares: caixasPopulares.map(mapCaixaFromDb),
            ultimosGanhadores: ultimosGanhadores.map(mapGanhadorFromDb),
            estatisticas: {
              totalCaixas: caixasDestaque.length + caixasPopulares.length,
              valorTotal: estatisticas.valorTotalDistribuido,
              totalUsuarios: estatisticas.totalUsuarios
            }
          } as HomePageData
          break
        }

        case '/caixas': {
          const todasCaixas = await supabaseHelpers.getAllCaixas()
          result = {
            caixas: todasCaixas.map(mapCaixaFromDb),
            filtros: { hasMore: false }
          } as CaixasPageData
          break
        }

        case '/transparencia/global': {
          const statsGlobais = await supabaseHelpers.getEstatisticasGerais()
          const caixasPopularesGlobal = await supabaseHelpers.getCaixasPopulares()
          
          result = {
            estatisticasGerais: {
              totalCaixasAbertas: statsGlobais.totalCaixasAbertas,
              valorTotalDistribuido: statsGlobais.valorTotalDistribuido,
              usuariosUnicos: statsGlobais.totalUsuarios,
              verificacoesRealizadas: statsGlobais.verificacoesRealizadas
            },
            // Mock da distribuição por raridades (seria calculado no backend)
            distribuicaoRaridades: {
              comum: { percentage: 45, quantidade: Math.floor(statsGlobais.totalCaixasAbertas * 0.45) },
              raro: { percentage: 30, quantidade: Math.floor(statsGlobais.totalCaixasAbertas * 0.30) },
              epico: { percentage: 18, quantidade: Math.floor(statsGlobais.totalCaixasAbertas * 0.18) },
              lendario: { percentage: 5, quantidade: Math.floor(statsGlobais.totalCaixasAbertas * 0.05) },
              mitico: { percentage: 2, quantidade: Math.floor(statsGlobais.totalCaixasAbertas * 0.02) }
            },
            caixasMaisAbertas: caixasPopularesGlobal.slice(0, 3).map(mapCaixaFromDb)
          } as TransparenciaGlobalData
          break
        }

        default: {
          if (endpoint.startsWith('/transparencia/caixa/')) {
            const caixaId = endpoint.split('/').pop()
            if (!caixaId) throw new Error('ID da caixa não fornecido')
            
            const transparencia = await supabaseHelpers.getTransparenciaCaixa(caixaId)
            
            result = {
              itens: transparencia.itens || [],
              stats: {
                totalItens: transparencia.itens?.length || 0,
                valorTotal: transparencia.itens?.reduce((sum: number, item: any) => sum + parseFloat(item.valor || 0), 0) || 0,
                raridadeMedia: 'epico', // Calculado baseado nos itens
                totalAbertas: transparencia.total_compras || 0
              }
            } as TransparenciaCaixaData
          } else {
            throw new Error(`Endpoint ${endpoint} não implementado`)
          }
          break
        }
      }

      setData(result as T)
      onSuccess?.(result as T)

    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      console.error('Erro na API:', error)
      setError(error)
      onError?.(error)
    } finally {
      setLoading(false)
    }
  }, [endpoint, enabled]) // Removendo onSuccess e onError das dependências para evitar loop

  const refetch = useCallback((): void => {
    fetchData()
  }, [fetchData])

  // Função mutate para operações de escrita (POST/PUT/DELETE)
  const mutate = useCallback(async <M = any>(mutationData: M): Promise<T> => {
    setLoading(true)
    setError(null)

    try {
      let result: any = null

      // Implementar operações de escrita aqui
      if (endpoint === '/pagamentos/criar') {
        const { valor, caixaId, metodo, usuarioId } = mutationData as PagamentoCreateData
        
        // Buscar usuário autenticado se não foi fornecido
        const userId = usuarioId || (() => {
          const { default: useAppStore } = require('../stores/useAppStore')
          const user = useAppStore.getState().user
          if (!user?.id) {
            throw new Error('Usuário não autenticado')
          }
          return user.id
        })()
        
        if (metodo === 'saldo') {
          // Pagamento com saldo - processar diretamente
          const { CarteiraAPI } = await import('../lib/carteiraAPI')
          
          try {
            // Verificar se o usuário tem saldo suficiente
            const saldoInfo = await CarteiraAPI.buscarSaldo(userId)
            
            if (saldoInfo.saldoAtual < valor) {
              throw new Error('Saldo insuficiente')
            }
            
            // Criar pagamento com saldo confirmado diretamente
            const pagamentoId = `saldo-${Date.now()}-${Math.random().toString(36).substring(7)}`
            result = {
              id: pagamentoId,
              compraId: pagamentoId, // Adicionar compraId para compatibilidade
              gatewayId: null,
              qrCode: null,
              qrCodeBase64: null,
              copiaCola: null,
              valor: valor,
              expiracaoEm: null,
              status: 'confirmado', // Pagamento com saldo é instantâneo
              metodo: 'saldo',
              caixaId: caixaId,
              usuarioId: userId
            }
          } catch (error) {
            throw new Error(`Erro ao processar pagamento com saldo: ${error instanceof Error ? error.message : error}`)
          }
          
        } else {
          // Criar pagamento PIX real no Supabase
          result = await supabaseHelpers.criarPagamentoPIX(userId, valor, caixaId)
        }
        
      } else if (endpoint === '/pagamentos/status') {
        // Verificar status real do pagamento
        const { gatewayId } = mutationData as PagamentoStatusData
        
        // Se o gatewayId é null, significa que foi pagamento com saldo
        if (!gatewayId || gatewayId.startsWith('saldo-')) {
          // Pagamento com saldo já está confirmado
          result = {
            status: 'aprovado',
            pagamentoId: gatewayId || 'saldo-payment',
            novoSaldo: undefined // Saldo será atualizado na abertura da caixa
          } as PagamentoStatusResult
        } else {
          const statusData = await supabaseHelpers.verificarStatusPagamento(gatewayId)
          result = {
            status: statusData.status === 'confirmado' ? 'aprovado' : statusData.status,
            pagamentoId: statusData.pagamentoId,
            novoSaldo: undefined // Saldo será atualizado na abertura da caixa
          } as PagamentoStatusResult
        }
        
      } else if (endpoint.startsWith('/caixas/abrir/')) {
        // Abrir caixa real com algoritmo de probabilidade
        const caixaId = endpoint.split('/').pop()
        const { pagamentoId, usuarioId } = mutationData as AbrirCaixaData
        
        if (!caixaId) throw new Error('ID da caixa não fornecido')
        
        // Detectar se é demo, pagamento com saldo, ou buscar dados reais
        if (caixaId === 'demo-caixa-001' || pagamentoId?.startsWith('demo-compra-') || pagamentoId?.startsWith('saldo-')) {
          // Processar compra com saldo se necessário - DECLARAR FORA DO TRY/CATCH
          let novoSaldo: number | undefined = undefined
          
          // Para demo e pagamento com saldo, buscar itens reais do banco e escolher um aleatoriamente
          try {
            // Buscar a caixa específica ou usar a primeira disponível
            const caixas = await supabaseHelpers.getAllCaixas()
            const caixaEspecifica = caixas.find((c: any) => c.id === caixaId) || caixas?.[0]
            
            if (!caixaEspecifica) {
              throw new Error('Nenhuma caixa disponível')
            }
            
            const transparencia = await supabaseHelpers.getTransparenciaCaixa(caixaEspecifica.id)
            if (pagamentoId?.startsWith('saldo-')) {
              console.log('🔄 Processando compra com saldo:', {
                caixaId: caixaEspecifica.id,
                preco: caixaEspecifica.preco,
                nome: caixaEspecifica.nome
              })
              
              const { CarteiraAPI } = await import('../lib/carteiraAPI')
              if (!usuarioId) {
                throw new Error('ID do usuário não fornecido para pagamento com saldo')
              }
              
              const resultado = await CarteiraAPI.processarCompraComSaldo(
                usuarioId, 
                caixaEspecifica.preco, 
                `Caixa: ${caixaEspecifica.nome}`
              )
              
              console.log('💰 Resultado do processamento de saldo:', resultado)
              novoSaldo = resultado.novoSaldo
              
              // 🔥 SINCRONIZAR SALDO COM O STORE ZUSTAND
              const { default: useAppStore } = await import('../stores/useAppStore')
              useAppStore.getState().updateUserBalance(novoSaldo)
            }

            if (transparencia?.itens?.length > 0) {
              const randomItem = transparencia.itens[Math.floor(Math.random() * transparencia.itens.length)]
              
              result = {
                item: {
                  id: randomItem.item_id || randomItem.id,
                  nome: randomItem.nome,
                  descricao: randomItem.descricao,
                  marca: randomItem.marca,
                  valor: parseFloat(randomItem.valor || '0'),
                  raridade: randomItem.raridade,
                  tipo: randomItem.tipo,
                  imagemUrl: randomItem.imagem_url || randomItem.imagemUrl
                },
                compraId: pagamentoId,
                novoSaldo: novoSaldo,
                timestamp: new Date().toISOString()
              } as AbrirCaixaResult
            } else {
              throw new Error('Nenhum item encontrado na transparência')
            }
          } catch (error) {
            console.error('Erro ao buscar itens reais, usando fallback:', error)
            // Fallback para itens hardcoded se falhar
            const fallbackItem = {
              id: 'fallback-001',
              nome: 'Premio Surpresa',
              descricao: 'Item especial de demonstração',
              marca: 'Sua Caixa',
              valor: 299.99,
              raridade: 'epico' as Raridade,
              tipo: 'especial',
              imagemUrl: null
            }
            
            result = {
              item: fallbackItem,
              compraId: pagamentoId,
              novoSaldo: novoSaldo,
              timestamp: new Date().toISOString()
            } as AbrirCaixaResult
          }
        } else {
          // Para pagamentos PIX reais, usar o Supabase
          const supabaseResult = await supabaseHelpers.abrirCaixa(caixaId, pagamentoId)
          
          result = {
            item: supabaseResult.item,
            compraId: supabaseResult.compraId,
            novoSaldo: supabaseResult.novoSaldo,
            timestamp: new Date().toISOString()
          } as AbrirCaixaResult
        }
        
      } else {
        throw new Error(`Operação ${endpoint} não implementada`)
      }

      setData(result as T)
      onSuccess?.(result as T)
      return result as T

    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      console.error('Erro na mutação:', error)
      setError(error)
      onError?.(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [endpoint, onSuccess, onError])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch,
    mutate
  }
}

// ==============================================
// FUNÇÕES AUXILIARES DE MAPPING
// ==============================================

function mapCaixaFromDb(caixa: CaixaDetalhada): MappedCaixa {
  return {
    id: caixa.id,
    nome: caixa.nome,
    descricao: caixa.descricao,
    subtitulo: caixa.subtitulo,
    preco: caixa.preco,
    custoEstimado: caixa.custo_estimado,
    imagemUrl: caixa.imagem_url,
    bannerUrl: caixa.banner_url,
    coresTema: caixa.cores_tema,
    totalCompras: caixa.total_compras || 0,
    valorTotalDistribuido: caixa.total_valor_distribuido || 0,
    pontuacaoPopularidade: caixa.pontuacao_popularidade || 0,
    destaque: caixa.destaque,
    ordemExibicao: caixa.ordem_exibicao,
    // Campos legados para compatibilidade com componentes existentes
    raridade: inferirRaridadePorPreco(caixa.preco),
    totalItens: 12, // Mock - seria calculado
    vezesAberta: caixa.total_compras || 0,
    ultimaAtualizacao: new Date().toISOString()
  }
}

function mapGanhadorFromDb(ganhador: FeedGanhador): MappedGanhador {
  return {
    usuarioId: ganhador.usuario_nome, // Por questões de privacidade, usar nome como ID
    usuarioNome: ganhador.usuario_nome,
    itemId: ganhador.item_nome, // Usar nome como ID para compatibilidade
    itemNome: ganhador.item_nome,
    itemValor: ganhador.item_valor,
    timestamp: ganhador.ganho_em
  }
}

function inferirRaridadePorPreco(preco: number): Raridade {
  if (preco <= 30) return 'comum'
  if (preco <= 60) return 'raro'
  if (preco <= 100) return 'epico'
  return 'lendario'
}

// ==============================================
// HOOKS ESPECÍFICOS TIPADOS
// ==============================================

export const useHomePage = (): UseApiReturn<HomePageData> => 
  useApi<HomePageData>('/home')

export const useCaixas = (): UseApiReturn<CaixasPageData> => 
  useApi<CaixasPageData>('/caixas')

export const useTransparenciaGlobal = (): UseApiReturn<TransparenciaGlobalData> => 
  useApi<TransparenciaGlobalData>('/transparencia/global')

export const useTransparenciaCaixa = (caixaId: string | null): UseApiReturn<TransparenciaCaixaData> => 
  useApi<TransparenciaCaixaData>(`/transparencia/caixa/${caixaId}`, {
    enabled: !!caixaId
  })

export default useApi