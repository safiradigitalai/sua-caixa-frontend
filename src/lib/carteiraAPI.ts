import { supabase } from './supabase'
import type { AppUser } from '@/types'

// ==============================================
// API REAL PARA SISTEMA DE CARTEIRA
// ==============================================

interface PagamentoPIXRequest {
  usuarioId: string
  valor: number
  descricao?: string
}

interface PagamentoPIXResponse {
  id: string
  qrCode: string
  qrCodeBase64: string
  copiaCola: string
  valor: number
  expiracaoEm: string
  status: 'pendente' | 'confirmado' | 'expirado' | 'falhou'
}

interface SolicitacaoSaqueRequest {
  usuarioId: string
  valor: number
  pixChave: string
  tipoChave: 'cpf' | 'email' | 'telefone' | 'aleatoria'
}

export class CarteiraAPI {
  
  // ==============================================
  // SALDO E EXTRATO
  // ==============================================
  
  static async buscarSaldo(usuarioId: string) {
    try {
      const { data: usuario, error } = await supabase
        .from('usuarios')
        .select('saldo, total_gasto, total_ganho')
        .eq('id', usuarioId)
        .single()

      if (error || !usuario) {
        throw new Error('Usuário não encontrado')
      }

      return {
        saldoAtual: Number(usuario.saldo),
        totalGasto: Number(usuario.total_gasto),
        totalGanho: Number(usuario.total_ganho)
      }
    } catch (error: any) {
      console.error('Erro ao buscar saldo:', error)
      throw new Error(error.message || 'Erro ao carregar saldo')
    }
  }

  static async buscarExtrato(usuarioId: string, limite: number = 50) {
    try {
      // Buscar pagamentos (depósitos)
      const { data: depositos, error: errorDepositos } = await supabase
        .from('pagamentos')
        .select('*')
        .eq('usuario_id', usuarioId)
        .order('criado_em', { ascending: false })
        .limit(limite / 2)

      if (errorDepositos) {
        console.error('Erro buscar depósitos:', errorDepositos)
      }

      // Buscar compras (gastos)
      const { data: compras, error: errorCompras } = await supabase
        .from('compras')
        .select(`
          *,
          caixa:caixas(nome)
        `)
        .eq('usuario_id', usuarioId)
        .order('criada_em', { ascending: false })
        .limit(limite / 2)

      if (errorCompras) {
        console.error('Erro buscar compras:', errorCompras)
      }

      // Combinar transações
      const transacoes = [
        ...(depositos?.map((dep: any) => ({
          id: dep.id,
          tipo: 'deposito' as const,
          valor: Number(dep.valor),
          descricao: 'Depósito PIX',
          status: dep.status,
          data: dep.confirmado_em || dep.criado_em,
          metadados: dep.gateway_dados || {}
        })) || []),
        ...(compras?.map((comp: any) => ({
          id: comp.id,
          tipo: 'compra' as const,
          valor: -Number(comp.valor_pago),
          descricao: `Compra: ${comp.caixa?.nome || 'Mystery Box'}`,
          status: comp.status,
          data: comp.criada_em,
          metadados: { compraId: comp.id }
        })) || [])
      ]

      // Ordenar por data (mais recente primeiro)
      transacoes.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())

      return transacoes.slice(0, limite)
    } catch (error: any) {
      console.error('Erro ao buscar extrato:', error)
      throw new Error(error.message || 'Erro ao carregar extrato')
    }
  }

  // ==============================================
  // DEPÓSITOS PIX
  // ==============================================
  
  static async criarDepositoPIX(dados: PagamentoPIXRequest): Promise<PagamentoPIXResponse> {
    try {
      // Validar valor mínimo
      if (dados.valor < 1) {
        throw new Error('Valor mínimo para depósito é R$ 1,00')
      }

      // Validar valor máximo
      if (dados.valor > 5000) {
        throw new Error('Valor máximo para depósito é R$ 5.000,00')
      }

      // Simular integração com gateway PIX (MercadoPago, PagSeguro, etc)
      // Em produção, aqui faria a chamada real para o gateway
      const gatewayResponse = await this.simularGatewayPIX(dados.valor)

      // Criar pagamento no banco
      const { data: pagamento, error } = await supabase
        .from('pagamentos')
        .insert({
          usuario_id: dados.usuarioId,
          valor: dados.valor,
          metodo: 'pix',
          gateway_id: gatewayResponse.id,
          gateway_dados: gatewayResponse.dados,
          status: 'pendente',
          expira_em: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutos
        })
        .select()
        .single()

      if (error) {
        console.error('Erro criar pagamento:', error)
        throw new Error('Erro ao criar pagamento PIX')
      }

      return {
        id: pagamento.id,
        qrCode: gatewayResponse.dados.qr_code,
        qrCodeBase64: gatewayResponse.dados.qr_code_base64,
        copiaCola: gatewayResponse.dados.copia_cola,
        valor: dados.valor,
        expiracaoEm: pagamento.expira_em,
        status: 'pendente'
      }

    } catch (error: any) {
      console.error('Erro criar depósito PIX:', error)
      throw new Error(error.message || 'Erro ao criar depósito PIX')
    }
  }

  static async consultarStatusPagamento(pagamentoId: string) {
    try {
      const { data: pagamento, error } = await supabase
        .from('pagamentos')
        .select('*')
        .eq('id', pagamentoId)
        .single()

      if (error || !pagamento) {
        throw new Error('Pagamento não encontrado')
      }

      // Em produção, consultar gateway real
      // Aqui simular algumas confirmações automáticas para demo
      if (pagamento.status === 'pendente' && Math.random() < 0.3) {
        // 30% chance de confirmar automaticamente
        await this.confirmarPagamento(pagamentoId)
        return { 
          ...pagamento, 
          status: 'confirmado',
          confirmado_em: new Date().toISOString()
        }
      }

      return pagamento
    } catch (error: any) {
      console.error('Erro consultar pagamento:', error)
      throw new Error(error.message || 'Erro ao consultar pagamento')
    }
  }

  // ==============================================
  // SAQUES PIX
  // ==============================================
  
  static async solicitarSaque(dados: SolicitacaoSaqueRequest) {
    try {
      // Validar saldo
      const saldoInfo = await this.buscarSaldo(dados.usuarioId)
      
      if (saldoInfo.saldoAtual < dados.valor) {
        throw new Error('Saldo insuficiente')
      }

      // Validar valor mínimo para saque
      if (dados.valor < 10) {
        throw new Error('Valor mínimo para saque é R$ 10,00')
      }

      // Validar se usuário está verificado
      const { data: usuario, error: errorUsuario } = await supabase
        .from('usuarios')
        .select('verificado')
        .eq('id', dados.usuarioId)
        .single()

      if (errorUsuario || !usuario) {
        throw new Error('Usuário não encontrado')
      }

      if (!usuario.verificado) {
        throw new Error('Para saques, você precisa verificar sua conta primeiro')
      }

      // Criar solicitação de saque (em produção, seria uma tabela separada)
      const solicitacao = {
        id: `saque-${Date.now()}`,
        usuarioId: dados.usuarioId,
        valor: dados.valor,
        pixChave: dados.pixChave,
        tipoChave: dados.tipoChave,
        status: 'pendente',
        solicitadoEm: new Date().toISOString()
      }

      // Reservar valor do saldo (decrementar temporariamente)
      await this.atualizarSaldo(dados.usuarioId, -dados.valor, 'saque_solicitado')

      return {
        id: solicitacao.id,
        status: 'pendente',
        prazoProcessamento: '1-2 dias úteis',
        taxas: 0, // Sem taxa por enquanto
        valorLiquido: dados.valor,
        mensagem: 'Solicitação de saque criada com sucesso. Será processada em até 2 dias úteis.'
      }

    } catch (error: any) {
      console.error('Erro solicitar saque:', error)
      throw new Error(error.message || 'Erro ao solicitar saque')
    }
  }

  // ==============================================
  // COMPRAS COM SALDO
  // ==============================================
  
  static async processarCompraComSaldo(usuarioId: string, valor: number, descricao: string = 'Compra na loja') {
    try {
      console.log('🔍 Iniciando processamento de compra com saldo:', {
        usuarioId,
        valor,
        descricao
      })
      
      // Verificar se o usuário tem saldo suficiente
      const saldoInfo = await this.buscarSaldo(usuarioId)
      console.log('💰 Saldo atual do usuário:', saldoInfo)
      
      if (saldoInfo.saldoAtual < valor) {
        throw new Error('Saldo insuficiente')
      }

      // Decrementar saldo
      console.log('⬇️ Decrementando saldo...')
      const resultado = await this.atualizarSaldo(usuarioId, -valor, `compra: ${descricao}`)
      console.log('✅ Saldo decrementado com sucesso:', resultado)
      
      return {
        success: true,
        saldoAnterior: resultado.saldoAnterior,
        novoSaldo: resultado.saldoNovo,
        valorDebitado: valor,
        descricao: descricao
      }
      
    } catch (error: any) {
      console.error('❌ Erro ao processar compra com saldo:', error)
      throw new Error(error.message || 'Erro ao processar compra')
    }
  }

  // ==============================================
  // FUNÇÕES AUXILIARES
  // ==============================================
  
  private static async simularGatewayPIX(valor: number) {
    // Simula resposta de gateway PIX real
    const gatewayId = `pix_${Date.now()}_${Math.random().toString(36).substring(7)}`
    
    // QR Code simulado (em produção seria real)
    const qrCodeData = `00020126580014BR.GOV.BCB.PIX013636ef7c22-b7c0-4b6f-a0db-6e0c7b9e8e5a5204000053039865406${valor.toFixed(2)}5802BR5925SUA CAIXA MYSTERY BOXES6009SAO PAULO62070503***6304`
    
    return {
      id: gatewayId,
      dados: {
        qr_code: qrCodeData,
        qr_code_base64: btoa(qrCodeData), // Base64 do QR
        copia_cola: qrCodeData,
        valor: valor,
        status: 'pendente'
      }
    }
  }

  private static async confirmarPagamento(pagamentoId: string) {
    try {
      // Atualizar status do pagamento
      const { data: pagamento, error: errorUpdate } = await supabase
        .from('pagamentos')
        .update({
          status: 'confirmado',
          confirmado_em: new Date().toISOString()
        })
        .eq('id', pagamentoId)
        .select('usuario_id, valor')
        .single()

      if (errorUpdate || !pagamento) {
        throw new Error('Erro ao confirmar pagamento')
      }

      // Adicionar valor ao saldo do usuário
      await this.atualizarSaldo(
        pagamento.usuario_id, 
        Number(pagamento.valor), 
        'deposito_confirmado'
      )

      return true
    } catch (error: any) {
      console.error('Erro confirmar pagamento:', error)
      throw new Error(error.message || 'Erro ao confirmar pagamento')
    }
  }

  private static async atualizarSaldo(usuarioId: string, valor: number, motivo: string) {
    try {
      const { data: usuario, error: errorSelect } = await supabase
        .from('usuarios')
        .select('saldo, total_ganho')
        .eq('id', usuarioId)
        .single()

      if (errorSelect || !usuario) {
        throw new Error('Usuário não encontrado')
      }

      const novoSaldo = Number(usuario.saldo) + valor
      const novoTotalGanho = valor > 0 ? Number(usuario.total_ganho) + valor : usuario.total_ganho

      const { error: errorUpdate } = await supabase
        .from('usuarios')
        .update({
          saldo: novoSaldo,
          total_ganho: novoTotalGanho,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', usuarioId)

      if (errorUpdate) {
        throw new Error('Erro ao atualizar saldo')
      }

      return {
        saldoAnterior: Number(usuario.saldo),
        saldoNovo: novoSaldo,
        diferenca: valor,
        motivo
      }

    } catch (error: any) {
      console.error('Erro atualizar saldo:', error)
      throw new Error(error.message || 'Erro ao atualizar saldo')
    }
  }

  // ==============================================
  // POLLING PARA STATUS DE PAGAMENTO
  // ==============================================
  
  static async monitorarPagamento(
    pagamentoId: string,
    callback: (status: any) => void,
    maxTentativas: number = 30
  ) {
    let tentativas = 0
    
    const verificar = async () => {
      try {
        tentativas++
        const status = await this.consultarStatusPagamento(pagamentoId)
        
        callback(status)
        
        // Parar se confirmado, expirado ou máximo tentativas
        if (
          status.status === 'confirmado' || 
          status.status === 'expirado' ||
          status.status === 'falhou' ||
          tentativas >= maxTentativas
        ) {
          return
        }
        
        // Continuar verificando a cada 3 segundos
        setTimeout(verificar, 3000)
        
      } catch (error) {
        console.error('Erro monitorar pagamento:', error)
        if (tentativas < maxTentativas) {
          setTimeout(verificar, 5000) // Retry com delay maior
        }
      }
    }
    
    verificar()
  }
}