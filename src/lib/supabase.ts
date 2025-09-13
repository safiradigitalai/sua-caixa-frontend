import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Raridade, TipoItem } from './utils'

// ==============================================
// TIPOS DO BANCO DE DADOS
// ==============================================

export interface Usuario {
  id: string
  telefone: string
  nome: string
  email?: string | null
  data_nascimento?: string | null
  saldo: number
  total_gasto: number
  total_ganho: number
  nivel: number
  pontos_xp: number
  verificado: boolean
  status: string
  criado_em: string
  atualizado_em: string
  ultimo_login_em?: string | null
}

export interface Caixa {
  id: string
  nome: string
  descricao?: string | null
  subtitulo?: string | null
  preco: number
  custo_estimado?: number | null
  imagem_url?: string | null
  banner_url?: string | null
  cores_tema?: Record<string, any> | null
  total_compras: number
  total_valor_distribuido: number
  pontuacao_popularidade: number
  ativa: boolean
  destaque: boolean
  ordem_exibicao: number
  criado_em: string
  atualizado_em: string
}

export interface Item {
  id: string
  nome: string
  descricao?: string | null
  marca?: string | null
  valor: number
  raridade: Raridade
  tipo: TipoItem
  metadados?: Record<string, any> | null
  imagem_url?: string | null
  galeria?: any[] | null
  vezes_ganho: number
  ultimo_ganho_em?: string | null
  ativo: boolean
  criado_em: string
}

export interface Pagamento {
  id: string
  usuario_id: string
  valor: number
  metodo: string
  gateway_id: string
  gateway_dados: Record<string, any>
  status: 'pendente' | 'confirmado' | 'expirado' | 'falhou'
  expira_em: string
  criado_em: string
  confirmado_em?: string | null
  ip_origem?: string | null
  user_agent?: string | null
}

export interface Compra {
  id: string
  usuario_id: string
  caixa_id: string
  pagamento_id: string
  item_ganho_id?: string | null
  valor_pago: number
  valor_ganho?: number | null
  semente_servidor: string
  semente_cliente: string
  nonce: number
  hash_resultado?: string | null
  status: 'criada' | 'aberta' | 'enviada' | 'entregue'
  criada_em: string
  aberta_em?: string | null
  enviada_em?: string | null
  entregue_em?: string | null
}

export interface CaixaItem {
  caixa_id: string
  item_id: string
  peso: number
  probabilidade_calculada?: number | null
  chances_exibir?: string | null
  maximo_por_usuario?: number | null
  maximo_por_dia?: number | null
  ativo: boolean
  criado_em: string
}

// ==============================================
// TIPOS DE RESPOSTA CUSTOMIZADOS
// ==============================================

export interface CaixaDetalhada extends Omit<Caixa, 'cores_tema'> {
  cores_tema?: {
    primary?: string
    secondary?: string
    accent?: string
  } | null
}

export interface ItemDetalhado extends Item {
  probabilidade?: number
}

export interface FeedGanhador {
  id: string
  usuario_nome: string
  item_nome: string
  item_valor: number
  item_raridade: Raridade
  caixa_nome: string
  ganho_em: string
  verificado: boolean
}

export interface EstatisticasGerais {
  totalCaixasAbertas: number
  valorTotalDistribuido: number
  totalUsuarios: number
  verificacoesRealizadas: number
}

export interface PagamentoPIXResponse {
  id: string
  valor: number
  status: string
  expiraEm: string
  pixCopiaCola: string
  qrCodeUrl: string
  gatewayId: string
}

export interface StatusPagamentoResponse {
  status: 'pendente' | 'confirmado' | 'expirado' | 'falhou'
  pagamentoId: string
  valor: number
  criadoEm: string
  confirmacoEm?: string | null
}

export interface ResultadoAbertura {
  item: {
    id: string
    nome: string
    descricao?: string | null
    marca?: string | null
    valor: number
    raridade: Raridade
    tipo: TipoItem
    imagemUrl?: string | null
  }
  compraId: string
  hashVerificacao: string
}

export interface TransparenciaCaixa {
  caixa_id: string
  total_apostado: number
  total_distribuido: number
  total_lucro: number
  itens_sorteados: Record<string, number>
  probabilidades_teoricas: Record<string, number>
  probabilidades_reais: Record<string, number>
  ultima_atualizacao: string
}

// ==============================================
// CONFIGURAÇÃO DO CLIENTE
// ==============================================

const supabaseUrl = 'https://aehdsvfszquavfnrvswc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlaGRzdmZzenF1YXZmbnJ2c3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NDk4NDcsImV4cCI6MjA3MDIyNTg0N30.r6xx_DeygAXmLnKkNq8HFG-hVcjUDehwSgr1wtNxEr8'

export interface Database {
  public: {
    Tables: {
      usuarios: {
        Row: Usuario
        Insert: Omit<Usuario, 'id' | 'criado_em' | 'atualizado_em'>
        Update: Partial<Omit<Usuario, 'id' | 'criado_em'>>
      }
      caixas: {
        Row: Caixa
        Insert: Omit<Caixa, 'id' | 'criado_em' | 'atualizado_em'>
        Update: Partial<Omit<Caixa, 'id' | 'criado_em'>>
      }
      itens: {
        Row: Item
        Insert: Omit<Item, 'id' | 'criado_em'>
        Update: Partial<Omit<Item, 'id' | 'criado_em'>>
      }
      pagamentos: {
        Row: Pagamento
        Insert: Omit<Pagamento, 'id' | 'criado_em'>
        Update: Partial<Omit<Pagamento, 'id' | 'criado_em'>>
      }
      compras: {
        Row: Compra
        Insert: Omit<Compra, 'id' | 'criada_em'>
        Update: Partial<Omit<Compra, 'id' | 'criada_em'>>
      }
      caixas_itens: {
        Row: CaixaItem
        Insert: Omit<CaixaItem, 'criado_em'>
        Update: Partial<Omit<CaixaItem, 'criado_em'>>
      }
    }
    Views: {
      feed_ganhadores: {
        Row: FeedGanhador
      }
      transparencia_caixas: {
        Row: TransparenciaCaixa
      }
    }
  }
}

export const supabase: SupabaseClient<Database> = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// ==============================================
// HELPER FUNCTIONS
// ==============================================

export const supabaseHelpers = {
  // Buscar caixas ativas com destaque
  async getCaixasDestaque(): Promise<CaixaDetalhada[]> {
    const { data, error } = await supabase
      .from('caixas')
      .select(`
        id,
        nome,
        descricao,
        subtitulo,
        preco,
        imagem_url,
        banner_url,
        cores_tema,
        total_compras,
        total_valor_distribuido,
        pontuacao_popularidade,
        destaque,
        ordem_exibicao
      `)
      .eq('ativa', true)
      .eq('destaque', true)
      .order('ordem_exibicao', { ascending: true })
      .limit(3)

    if (error) throw error
    return data || []
  },

  // Buscar caixas populares (ordenadas por popularidade)
  async getCaixasPopulares(): Promise<Pick<Caixa, 'id' | 'nome' | 'descricao' | 'subtitulo' | 'preco' | 'imagem_url' | 'total_compras' | 'pontuacao_popularidade'>[]> {
    const { data, error } = await supabase
      .from('caixas')
      .select(`
        id,
        nome,
        descricao,
        subtitulo,
        preco,
        imagem_url,
        total_compras,
        pontuacao_popularidade
      `)
      .eq('ativa', true)
      .order('pontuacao_popularidade', { ascending: false })
      .limit(6)

    if (error) throw error
    return data || []
  },

  // Feed de ganhadores recentes (baseado em compras reais)
  async getFeedGanhadores(): Promise<FeedGanhador[]> {
    const { data, error } = await supabase
      .from('compras')
      .select(`
        aberta_em,
        valor_ganho,
        usuario:usuarios(nome),
        item_ganho:itens(nome, valor)
      `)
      .not('item_ganho_id', 'is', null)
      .not('aberta_em', 'is', null)
      .order('aberta_em', { ascending: false })
      .limit(10)

    if (error) throw error
    
    // Mapear para o formato esperado
    return (data || []).map(compra => ({
      usuario_nome: compra.usuario?.nome || 'Usuário Anônimo',
      item_nome: compra.item_ganho?.nome || 'Item Desconhecido',
      item_valor: Number(compra.item_ganho?.valor || compra.valor_ganho || 0),
      ganho_em: compra.aberta_em
    })) as FeedGanhador[]
  },

  // Transparência de uma caixa específica (baseado em caixas_itens)
  async getTransparenciaCaixa(caixaId: string): Promise<TransparenciaCaixa> {
    const { data: caixaItens, error } = await supabase
      .from('caixas_itens')
      .select(`
        peso,
        probabilidade_calculada,
        chances_exibir,
        item:itens(
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
      .eq('caixa_id', caixaId)
      .eq('ativo', true)

    if (error) throw error

    // Buscar informações da caixa
    const { data: caixa } = await supabase
      .from('caixas')
      .select('total_compras')
      .eq('id', caixaId)
      .single()

    return {
      itens: (caixaItens || []).map(ci => ({
        ...ci.item,
        peso: ci.peso,
        probabilidade: ci.probabilidade_calculada,
        chances: ci.chances_exibir
      })),
      total_compras: caixa?.total_compras || 0
    } as TransparenciaCaixa
  },

  // Buscar todas as caixas ativas
  async getAllCaixas(): Promise<CaixaDetalhada[]> {
    const { data, error } = await supabase
      .from('caixas')
      .select(`
        id,
        nome,
        descricao,
        subtitulo,
        preco,
        custo_estimado,
        imagem_url,
        banner_url,
        cores_tema,
        total_compras,
        total_valor_distribuido,
        pontuacao_popularidade,
        destaque,
        ordem_exibicao
      `)
      .eq('ativa', true)
      .order('ordem_exibicao', { ascending: true })

    if (error) throw error
    return data || []
  },

  // Estatísticas gerais do sistema
  async getEstatisticasGerais(): Promise<EstatisticasGerais> {
    const { data: caixas, error: errorCaixas } = await supabase
      .from('caixas')
      .select('total_compras, total_valor_distribuido')
      .eq('ativa', true)

    const { count: usuarios, error: errorUsuarios } = await supabase
      .from('usuarios')
      .select('id', { count: 'exact', head: true })

    if (errorCaixas || errorUsuarios) throw errorCaixas || errorUsuarios

    const totalCaixasAbertas = caixas?.reduce((sum, c) => sum + (c.total_compras || 0), 0) || 0
    const valorTotalDistribuido = caixas?.reduce((sum, c) => sum + (c.total_valor_distribuido || 0), 0) || 0
    const totalUsuarios = usuarios || 0

    return {
      totalCaixasAbertas,
      valorTotalDistribuido,
      totalUsuarios,
      verificacoesRealizadas: Math.floor(totalCaixasAbertas * 0.85) // Estimativa
    }
  },

  // Criar um usuário demo (para testar sem auth)
  async criarUsuarioDemo(telefone: string, nome: string): Promise<Usuario> {
    const { data, error } = await supabase
      .from('usuarios')
      .insert([{
        telefone,
        nome,
        email: null,
        saldo: 500.00, // Saldo inicial para demo
        total_gasto: 0,
        total_ganho: 0,
        nivel: 1,
        pontos_xp: 0,
        verificado: false,
        status: 'ativo',
        atualizado_em: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Buscar usuário por telefone (para demo sem auth)
  async buscarUsuarioPorTelefone(telefone: string): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('telefone', telefone)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = not found
    return data || null
  },

  // Criar pagamento PIX (demo)
  async criarPagamentoPIX(usuarioId: string, valor: number, caixaId: string): Promise<PagamentoPIXResponse> {
    const gatewayId = 'pix_demo_' + Date.now()
    const pixCode = '00020126580014BR.GOV.BCB.PIX0136demo' + Math.random().toString(36).substr(2, 20)
    
    const { data, error } = await supabase
      .from('pagamentos')
      .insert([{
        usuario_id: usuarioId,
        valor: valor,
        metodo: 'pix',
        gateway_id: gatewayId,
        gateway_dados: {
          qr_code: pixCode,
          chave_pix: 'demo@suacaixa.app',
          caixa_id: caixaId
        },
        status: 'pendente',
        expira_em: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutos
        ip_origem: '127.0.0.1',
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'SuaCaixa-PWA/1.0'
      }])
      .select()
      .single()

    if (error) throw error
    
    return {
      id: data.id,
      valor: data.valor,
      status: data.status,
      expiraEm: data.expira_em,
      pixCopiaCola: data.gateway_dados.qr_code,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.gateway_dados.qr_code)}`,
      gatewayId: data.gateway_id
    }
  },

  // Verificar status do pagamento
  async verificarStatusPagamento(gatewayId: string): Promise<StatusPagamentoResponse> {
    const { data, error } = await supabase
      .from('pagamentos')
      .select('*')
      .eq('gateway_id', gatewayId)
      .single()

    if (error) throw error

    // Simular aprovação automática após 30 segundos para demo
    const criado = new Date(data.criado_em).getTime()
    const agora = Date.now()
    const tempoDecorrido = agora - criado

    let novoStatus = data.status
    if (data.status === 'pendente' && tempoDecorrido > 30000) { // 30 segundos
      // Simular aprovação (70% de chance)
      const aprovado = Math.random() > 0.3
      novoStatus = aprovado ? 'confirmado' : 'expirado'
      
      // Atualizar no banco
      await supabase
        .from('pagamentos')
        .update({ 
          status: novoStatus,
          confirmado_em: aprovado ? new Date().toISOString() : null
        })
        .eq('id', data.id)
    }

    return {
      status: novoStatus,
      pagamentoId: data.id,
      valor: data.valor,
      criadoEm: data.criado_em,
      confirmacoEm: data.confirmado_em
    }
  },

  // Abrir caixa (demo - implementação básica)
  async abrirCaixa(caixaId: string, pagamentoId: string): Promise<ResultadoAbertura> {
    // Buscar itens da caixa com suas probabilidades
    const { data: caixaItens, error: errorItens } = await supabase
      .from('caixas_itens')
      .select(`
        item_id,
        peso,
        itens:item_id (
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
      .eq('caixa_id', caixaId)
      .eq('ativo', true)

    if (errorItens) throw errorItens

    // Algoritmo simples de sorteio baseado em peso
    const totalPeso = caixaItens.reduce((sum, ci) => sum + ci.peso, 0)
    const randomNum = Math.random() * totalPeso
    
    let pesoAcumulado = 0
    let itemSorteado: any = null
    
    for (const caixaItem of caixaItens) {
      pesoAcumulado += caixaItem.peso
      if (randomNum <= pesoAcumulado) {
        itemSorteado = caixaItem.itens
        break
      }
    }

    if (!itemSorteado) {
      itemSorteado = caixaItens[0]?.itens // Fallback
    }

    // Buscar dados do usuário do pagamento
    const { data: pagamento } = await supabase
      .from('pagamentos')
      .select('usuario_id, valor')
      .eq('id', pagamentoId)
      .single()

    if (!pagamento) throw new Error('Pagamento não encontrado')

    // Criar compra no banco
    const { data: compra, error: errorCompra } = await supabase
      .from('compras')
      .insert([{
        usuario_id: pagamento.usuario_id,
        caixa_id: caixaId,
        pagamento_id: pagamentoId,
        item_ganho_id: itemSorteado.id,
        valor_pago: pagamento.valor,
        valor_ganho: itemSorteado.valor,
        semente_servidor: 'srv_demo_' + Date.now(),
        semente_cliente: 'cli_demo_' + Date.now(),
        nonce: 1,
        hash_resultado: 'hash_demo_' + Date.now(),
        status: 'aberta',
        aberta_em: new Date().toISOString()
      }])
      .select()
      .single()

    if (errorCompra) throw errorCompra

    return {
      item: {
        id: itemSorteado.id,
        nome: itemSorteado.nome,
        descricao: itemSorteado.descricao,
        marca: itemSorteado.marca,
        valor: itemSorteado.valor,
        raridade: itemSorteado.raridade,
        tipo: itemSorteado.tipo,
        imagemUrl: itemSorteado.imagem_url
      },
      compraId: compra.id,
      hashVerificacao: compra.hash_resultado || 'demo'
    }
  }
}