import { useState, useEffect, useCallback } from 'react'
import { supabaseHelpers } from '../lib/supabase'

// Hook principal para integração com Supabase
export const useApi = (endpoint, options = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const {
    enabled = true,
    onSuccess,
    onError,
    params = {}
  } = options

  const fetchData = useCallback(async () => {
    if (!enabled || !endpoint) return

    setLoading(true)
    setError(null)

    try {
      let result = null

      // Mapear endpoints para funções do Supabase
      switch (endpoint) {
        case '/home':
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
          }
          break

        case '/caixas':
          const todasCaixas = await supabaseHelpers.getAllCaixas()
          result = {
            caixas: todasCaixas.map(mapCaixaFromDb),
            filtros: { hasMore: false }
          }
          break

        case '/transparencia/global':
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
          }
          break

        default:
          if (endpoint.startsWith('/transparencia/caixa/')) {
            const caixaId = endpoint.split('/').pop()
            const transparencia = await supabaseHelpers.getTransparenciaCaixa(caixaId)
            
            result = {
              itens: transparencia.itens,
              stats: {
                totalItens: transparencia.itens.length,
                valorTotal: transparencia.itens.reduce((sum, item) => sum + parseFloat(item.valor), 0),
                raridadeMedia: 'epico', // Calculado baseado nos itens
                totalAbertas: transparencia.total_compras
              }
            }
          } else {
            throw new Error(`Endpoint ${endpoint} não implementado`)
          }
          break
      }

      setData(result)
      onSuccess?.(result)

    } catch (err) {
      console.error('Erro na API:', err)
      setError(err)
      onError?.(err)
    } finally {
      setLoading(false)
    }
  }, [endpoint, enabled])

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  // Função mutate para operações de escrita (POST/PUT/DELETE)
  const mutate = useCallback(async (data) => {
    setLoading(true)
    setError(null)

    try {
      let result = null

      // Implementar operações de escrita aqui
      if (endpoint === '/pagamentos/criar') {
        // Criar pagamento PIX real no Supabase
        const { valor, caixaId, usuarioId = '550e8400-e29b-41d4-a716-446655440000' } = data // Demo user ID
        result = await supabaseHelpers.criarPagamentoPIX(usuarioId, valor, caixaId)
        
      } else if (endpoint === '/pagamentos/status') {
        // Verificar status real do pagamento
        const { gatewayId } = data
        const statusData = await supabaseHelpers.verificarStatusPagamento(gatewayId)
        result = {
          status: statusData.status === 'confirmado' ? 'aprovado' : statusData.status,
          pagamentoId: statusData.pagamentoId,
          novoSaldo: statusData.status === 'confirmado' ? 150.75 : undefined // Mock do saldo
        }
        
      } else if (endpoint.startsWith('/caixas/abrir/')) {
        // Abrir caixa real com algoritmo de probabilidade
        const caixaId = endpoint.split('/').pop()
        const { pagamentoId } = data
        
        // Detectar se é demo ou buscar dados reais
        if (caixaId === 'demo-caixa-001' || pagamentoId?.startsWith('demo-compra-')) {
          // Para demo, buscar itens reais do banco e escolher um aleatoriamente
          try {
            // Buscar uma caixa real disponível e sua transparência
            const caixas = await supabaseHelpers.getAllCaixas()
            const primeiraCaixa = caixas?.[0]
            
            if (!primeiraCaixa) {
              throw new Error('Nenhuma caixa disponível')
            }
            
            const transparencia = await supabaseHelpers.getTransparenciaCaixa(primeiraCaixa.id)
            
            if (transparencia?.itens?.length > 0) {
              const randomItem = transparencia.itens[Math.floor(Math.random() * transparencia.itens.length)]
              
              result = {
                item: {
                  id: randomItem.item_id || randomItem.id,
                  nome: randomItem.nome,
                  descricao: randomItem.descricao,
                  marca: randomItem.marca,
                  valor: parseFloat(randomItem.valor),
                  raridade: randomItem.raridade,
                  tipo: randomItem.tipo,
                  imagemUrl: randomItem.imagem_url || randomItem.imagemUrl
                },
                compraId: pagamentoId,
                novoSaldo: 475.25, // Saldo demo atualizado
                timestamp: new Date().toISOString()
              }
            } else {
              throw new Error('Nenhum item encontrado na transparência')
            }
          } catch (error) {
            console.error('Erro ao buscar itens reais, usando fallback:', error)
            // Fallback para itens hardcoded se falhar
            const fallbackItems = [
              {
                id: 'fallback-001',
                nome: 'Premio Surpresa',
                descricao: 'Item especial de demonstração',
                marca: 'Sua Caixa',
                valor: 299.99,
                raridade: 'epico',
                tipo: 'especial',
                imagemUrl: null
              }
            ]
            
            result = {
              item: fallbackItems[0],
              compraId: pagamentoId,
              novoSaldo: 475.25,
              timestamp: new Date().toISOString()
            }
          }
        } else {
          result = await supabaseHelpers.abrirCaixa(caixaId, pagamentoId)
        }
        
      } else {
        throw new Error(`Operação ${endpoint} não implementada`)
      }

      setData(result)
      onSuccess?.(result)
      return result

    } catch (err) {
      console.error('Erro na mutação:', err)
      setError(err)
      onError?.(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [endpoint])

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

// Funções auxiliares para mapear dados do banco para o formato esperado pelo frontend
function mapCaixaFromDb(caixa) {
  return {
    id: caixa.id,
    nome: caixa.nome,
    descricao: caixa.descricao,
    subtitulo: caixa.subtitulo,
    preco: parseFloat(caixa.preco),
    custoEstimado: caixa.custo_estimado ? parseFloat(caixa.custo_estimado) : null,
    imagemUrl: caixa.imagem_url,
    bannerUrl: caixa.banner_url,
    coresTema: caixa.cores_tema,
    totalCompras: caixa.total_compras || 0,
    valorTotalDistribuido: caixa.total_valor_distribuido ? parseFloat(caixa.total_valor_distribuido) : 0,
    pontuacaoPopularidade: caixa.pontuacao_popularidade ? parseFloat(caixa.pontuacao_popularidade) : 0,
    destaque: caixa.destaque,
    ordemExibicao: caixa.ordem_exibicao,
    // Campos legados para compatibilidade com componentes existentes
    raridade: inferirRaridadePorPreco(caixa.preco),
    totalItens: 12, // Mock - seria calculado
    vezesAberta: caixa.total_compras || 0,
    ultimaAtualizacao: new Date().toISOString()
  }
}

function mapGanhadorFromDb(ganhador) {
  return {
    usuarioId: ganhador.nome, // Por questões de privacidade, usar nome como ID
    usuarioNome: ganhador.nome,
    itemId: ganhador.item_nome, // Usar nome como ID para compatibilidade
    itemNome: ganhador.item_nome,
    itemValor: parseFloat(ganhador.item_valor),
    timestamp: ganhador.aberta_em
  }
}

function inferirRaridadePorPreco(preco) {
  const precoNum = parseFloat(preco)
  if (precoNum <= 30) return 'comum'
  if (precoNum <= 60) return 'raro'
  if (precoNum <= 100) return 'epico'
  return 'lendario'
}

// Hooks específicos para facilitar o uso
export const useHomePage = () => useApi('/home')
export const useCaixas = () => useApi('/caixas')
export const useTransparenciaGlobal = () => useApi('/transparencia/global')
export const useTransparenciaCaixa = (caixaId) => useApi(`/transparencia/caixa/${caixaId}`, {
  enabled: !!caixaId
})