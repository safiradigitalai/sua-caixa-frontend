import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aehdsvfszquavfnrvswc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlaGRzdmZzenF1YXZmbnJ2c3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NDk4NDcsImV4cCI6MjA3MDIyNTg0N30.r6xx_DeygAXmLnKkNq8HFG-hVcjUDehwSgr1wtNxEr8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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

// Helper functions for common queries
export const supabaseHelpers = {
  // Buscar caixas ativas com destaque
  async getCaixasDestaque() {
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
    return data
  },

  // Buscar caixas populares (ordenadas por popularidade)
  async getCaixasPopulares() {
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
    return data
  },

  // Feed de ganhadores recentes
  async getFeedGanhadores() {
    const { data, error } = await supabase
      .from('feed_ganhadores')
      .select('*')
      .limit(10)

    if (error) throw error
    return data
  },

  // Transparência de uma caixa específica
  async getTransparenciaCaixa(caixaId) {
    const { data, error } = await supabase
      .from('transparencia_caixas')
      .select('*')
      .eq('caixa_id', caixaId)
      .single()

    if (error) throw error
    return data
  },

  // Buscar todas as caixas ativas
  async getAllCaixas() {
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
    return data
  },

  // Estatísticas gerais do sistema
  async getEstatisticasGerais() {
    const { data: caixas, error: errorCaixas } = await supabase
      .from('caixas')
      .select('total_compras, total_valor_distribuido')
      .eq('ativa', true)

    const { data: usuarios, error: errorUsuarios } = await supabase
      .from('usuarios')
      .select('id', { count: 'exact', head: true })

    if (errorCaixas || errorUsuarios) throw errorCaixas || errorUsuarios

    const totalCaixasAbertas = caixas?.reduce((sum, c) => sum + (c.total_compras || 0), 0) || 0
    const valorTotalDistribuido = caixas?.reduce((sum, c) => sum + (parseFloat(c.total_valor_distribuido) || 0), 0) || 0
    const totalUsuarios = usuarios || 0

    return {
      totalCaixasAbertas,
      valorTotalDistribuido,
      totalUsuarios,
      verificacoesRealizadas: Math.floor(totalCaixasAbertas * 0.85) // Estimativa
    }
  },

  // Criar um usuário demo (para testar sem auth)
  async criarUsuarioDemo(telefone, nome) {
    const { data, error } = await supabase
      .from('usuarios')
      .insert([{
        telefone,
        nome,
        email: null,
        saldo: 500.00, // Saldo inicial para demo
        verificado: false
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Buscar usuário por telefone (para demo sem auth)
  async buscarUsuarioPorTelefone(telefone) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('telefone', telefone)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = not found
    return data
  },

  // Criar pagamento PIX (demo)
  async criarPagamentoPIX(usuarioId, valor, caixaId) {
    const gatewayId = 'pix_demo_' + Date.now()
    const pixCode = '00020126580014BR.GOV.BCB.PIX0136demo' + Math.random().toString(36).substr(2, 20)
    
    const { data, error } = await supabase
      .from('pagamentos')
      .insert([{
        usuario_id: usuarioId,
        valor: parseFloat(valor),
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
      valor: parseFloat(data.valor),
      status: data.status,
      expiraEm: data.expira_em,
      pixCopiaCola: data.gateway_dados.qr_code,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.gateway_dados.qr_code)}`,
      gatewayId: data.gateway_id
    }
  },

  // Verificar status do pagamento
  async verificarStatusPagamento(gatewayId) {
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
      valor: parseFloat(data.valor),
      criadoEm: data.criado_em,
      confirmacoEm: data.confirmado_em
    }
  },

  // Abrir caixa (demo - implementação básica)
  async abrirCaixa(caixaId, pagamentoId) {
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
    let itemSorteado = null
    
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

    // Criar compra no banco
    const { data: compra, error: errorCompra } = await supabase
      .from('compras')
      .insert([{
        usuario_id: (await supabase.from('pagamentos').select('usuario_id').eq('id', pagamentoId).single()).data.usuario_id,
        caixa_id: caixaId,
        pagamento_id: pagamentoId,
        item_ganho_id: itemSorteado.id,
        valor_pago: (await supabase.from('pagamentos').select('valor').eq('id', pagamentoId).single()).data.valor,
        valor_ganho: parseFloat(itemSorteado.valor),
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
        valor: parseFloat(itemSorteado.valor),
        raridade: itemSorteado.raridade,
        tipo: itemSorteado.tipo,
        imagemUrl: itemSorteado.imagem_url
      },
      compraId: compra.id,
      hashVerificacao: compra.hash_resultado
    }
  }
}