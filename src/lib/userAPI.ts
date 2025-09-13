import { supabase } from './supabase'
import type { AppUser } from '@/types'

// ==============================================
// API REAL PARA DADOS DO USUÁRIO
// ==============================================

export class UserAPI {
  
  // ==============================================
  // PERFIL DO USUÁRIO
  // ==============================================
  
  static async buscarPerfil(userId: string) {
    try {
      const { data: usuario, error } = await supabase
        .from('usuarios')
        .select(`
          *,
          compras:compras(
            id,
            valor_pago,
            valor_ganho,
            criada_em,
            aberta_em,
            status,
            caixa:caixas(nome),
            item_ganho:itens(nome, valor, raridade)
          )
        `)
        .eq('id', userId)
        .single()

      if (error || !usuario) {
        throw new Error('Usuário não encontrado')
      }

      return {
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          telefone: usuario.telefone,
          email: usuario.email,
          dataNascimento: usuario.data_nascimento,
          saldo: Number(usuario.saldo),
          totalGasto: Number(usuario.total_gasto),
          totalGanho: Number(usuario.total_ganho),
          nivel: usuario.nivel,
          pontosXp: usuario.pontos_xp,
          verificado: usuario.verificado,
          status: usuario.status,
          criadoEm: usuario.criado_em,
          ultimoLogin: usuario.ultimo_login_em
        },
        estatisticas: {
          totalCompras: usuario.compras?.length || 0,
          caixasAbertas: usuario.compras?.filter((c: any) => c.aberta_em)?.length || 0,
          maiorPremio: Math.max(0, ...(usuario.compras?.map((c: any) => Number(c.valor_ganho) || 0) || [0])),
          itensGanhos: usuario.compras?.filter((c: any) => c.item_ganho)?.length || 0
        },
        compras: usuario.compras || []
      }
    } catch (error: any) {
      console.error('Erro ao buscar perfil:', error)
      throw new Error(error.message || 'Erro ao carregar perfil')
    }
  }

  // ==============================================
  // HISTÓRICO DE COMPRAS
  // ==============================================
  
  static async buscarHistoricoCompras(userId: string, limite: number = 20) {
    try {
      const { data: compras, error } = await supabase
        .from('compras')
        .select(`
          id,
          valor_pago,
          valor_ganho,
          status,
          criada_em,
          aberta_em,
          caixa:caixas(
            id,
            nome,
            imagem_url
          ),
          item_ganho:itens(
            id,
            nome,
            valor,
            raridade,
            imagem_url
          )
        `)
        .eq('usuario_id', userId)
        .order('criada_em', { ascending: false })
        .limit(limite)

      if (error) {
        throw new Error('Erro ao buscar histórico')
      }

      return compras?.map((compra: any) => ({
        id: compra.id,
        valorPago: Number(compra.valor_pago),
        valorGanho: Number(compra.valor_ganho) || 0,
        status: compra.status,
        criadaEm: compra.criada_em,
        abertaEm: compra.aberta_em,
        caixa: compra.caixa,
        itemGanho: compra.item_ganho
      })) || []
    } catch (error: any) {
      console.error('Erro ao buscar histórico:', error)
      throw new Error(error.message || 'Erro ao carregar histórico')
    }
  }

  // ==============================================
  // ITENS GANHOS
  // ==============================================
  
  static async buscarItensGanhos(userId: string) {
    try {
      const { data: compras, error } = await supabase
        .from('compras')
        .select(`
          id,
          aberta_em,
          item_ganho:itens(
            id,
            nome,
            descricao,
            marca,
            valor,
            raridade,
            tipo,
            imagem_url
          )
        `)
        .eq('usuario_id', userId)
        .not('item_ganho_id', 'is', null)
        .order('aberta_em', { ascending: false })

      if (error) {
        throw new Error('Erro ao buscar itens')
      }

      return compras?.map((compra: any) => ({
        ...compra.item_ganho,
        ganhoEm: compra.aberta_em,
        compraId: compra.id
      })) || []
    } catch (error: any) {
      console.error('Erro ao buscar itens ganhos:', error)
      throw new Error(error.message || 'Erro ao carregar itens')
    }
  }

  // ==============================================
  // CARTEIRA - HISTÓRICO DE TRANSAÇÕES
  // ==============================================
  
  static async buscarHistoricoCarteira(userId: string, limite: number = 50) {
    try {
      // Buscar pagamentos (entradas)
      const { data: pagamentos, error: errorPagamentos } = await supabase
        .from('pagamentos')
        .select('valor, criado_em, confirmado_em, status')
        .eq('usuario_id', userId)
        .eq('status', 'confirmado')
        .order('confirmado_em', { ascending: false })

      if (errorPagamentos) {
        console.error('Erro pagamentos:', errorPagamentos)
      }

      // Buscar compras (saídas)
      const { data: compras, error: errorCompras } = await supabase
        .from('compras')
        .select(`
          valor_pago,
          criada_em,
          caixa:caixas(nome)
        `)
        .eq('usuario_id', userId)
        .order('criada_em', { ascending: false })

      if (errorCompras) {
        console.error('Erro compras:', errorCompras)
      }

      // Combinar e ordenar transações
      const transacoes = [
        ...(pagamentos?.map((p: any) => ({
          tipo: 'entrada' as const,
          valor: Number(p.valor),
          descricao: 'Depósito PIX',
          data: p.confirmado_em || p.criado_em,
          status: 'confirmado'
        })) || []),
        ...(compras?.map((c: any) => ({
          tipo: 'saida' as const,
          valor: Number(c.valor_pago),
          descricao: `Compra: ${c.caixa?.nome || 'Mystery Box'}`,
          data: c.criada_em,
          status: 'confirmado'
        })) || [])
      ]

      // Ordenar por data (mais recente primeiro)
      transacoes.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())

      return transacoes.slice(0, limite)
    } catch (error: any) {
      console.error('Erro ao buscar histórico da carteira:', error)
      throw new Error(error.message || 'Erro ao carregar histórico da carteira')
    }
  }

  // ==============================================
  // RANKING DO USUÁRIO
  // ==============================================
  
  static async buscarRanking(userId: string) {
    try {
      // Buscar posição do usuário no ranking por total gasto
      const { data: ranking, error } = await supabase
        .rpc('buscar_ranking_usuario', { user_id: userId })

      if (error) {
        console.error('Erro no ranking:', error)
        // Fallback se RPC não existir
        return {
          posicao: null,
          totalUsuarios: null,
          percentil: null
        }
      }

      return ranking || {
        posicao: null,
        totalUsuarios: null,
        percentil: null
      }
    } catch (error: any) {
      console.error('Erro ao buscar ranking:', error)
      return {
        posicao: null,
        totalUsuarios: null,
        percentil: null
      }
    }
  }

  // ==============================================
  // SISTEMA DE NÍVEIS
  // ==============================================
  
  static calcularNivel(pontosXp: number) {
    // Sistema de níveis baseado em XP
    const niveis = [
      { nivel: 1, minXp: 0, maxXp: 99, titulo: 'Novato' },
      { nivel: 2, minXp: 100, maxXp: 299, titulo: 'Explorador' },
      { nivel: 3, minXp: 300, maxXp: 599, titulo: 'Aventureiro' },
      { nivel: 4, minXp: 600, maxXp: 999, titulo: 'Caçador' },
      { nivel: 5, minXp: 1000, maxXp: 1499, titulo: 'Especialista' },
      { nivel: 6, minXp: 1500, maxXp: 2199, titulo: 'Veterano' },
      { nivel: 7, minXp: 2200, maxXp: 2999, titulo: 'Mestre' },
      { nivel: 8, minXp: 3000, maxXp: 4199, titulo: 'Campeão' },
      { nivel: 9, minXp: 4200, maxXp: 5999, titulo: 'Lenda' },
      { nivel: 10, minXp: 6000, maxXp: Infinity, titulo: 'Mítico' }
    ]

    const nivelAtual = niveis.find(n => pontosXp >= n.minXp && pontosXp <= n.maxXp) || niveis[0]
    const proximoNivel = niveis.find(n => n.nivel === nivelAtual.nivel + 1)

    return {
      nivelAtual,
      proximoNivel,
      progressoAtual: proximoNivel 
        ? Math.round(((pontosXp - nivelAtual.minXp) / (proximoNivel.minXp - nivelAtual.minXp)) * 100)
        : 100,
      xpParaProximo: proximoNivel ? proximoNivel.minXp - pontosXp : 0
    }
  }
}