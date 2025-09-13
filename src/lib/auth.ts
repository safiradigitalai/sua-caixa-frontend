import { supabase } from './supabase'
import type { AppUser } from '@/types'

// ==============================================
// SISTEMA DE AUTENTICAÇÃO REAL COM SUPABASE
// ==============================================

interface RegistroData {
  nome: string
  telefone: string
  email?: string
  dataNascimento?: string
}

interface LoginData {
  telefone: string
}

export class AuthService {
  
  // ==============================================
  // REGISTRO DE USUÁRIO
  // ==============================================
  
  static async registro(dados: RegistroData) {
    try {
      // Verificar se telefone já existe
      const { data: existingUser } = await supabase
        .from('usuarios')
        .select('id')
        .eq('telefone', dados.telefone)
        .single()

      if (existingUser) {
        throw new Error('Telefone já cadastrado')
      }

      // Criar novo usuário
      const { data: novoUsuario, error } = await supabase
        .from('usuarios')
        .insert({
          nome: dados.nome,
          telefone: dados.telefone,
          email: dados.email || null,
          data_nascimento: dados.dataNascimento || null,
          saldo: 0,
          total_gasto: 0,
          total_ganho: 0,
          nivel: 1,
          pontos_xp: 0,
          verificado: false,
          status: 'ativo',
          ultimo_login_em: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Erro no registro:', error)
        throw new Error('Erro ao criar usuário')
      }

      // Gerar token simples (ID do usuário + timestamp)
      const token = btoa(`${novoUsuario.id}:${Date.now()}`)
      
      // Converter para formato AppUser
      const appUser: AppUser = {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        telefone: novoUsuario.telefone,
        email: novoUsuario.email,
        saldo: Number(novoUsuario.saldo),
        totalGasto: Number(novoUsuario.total_gasto),
        totalGanho: Number(novoUsuario.total_ganho),
        nivel: novoUsuario.nivel,
        pontosXp: novoUsuario.pontos_xp,
        verificado: novoUsuario.verificado,
        status: novoUsuario.status
      }

      return {
        usuario: appUser,
        token
      }
      
    } catch (error: any) {
      console.error('Erro no registro:', error)
      throw new Error(error.message || 'Erro ao registrar usuário')
    }
  }

  // ==============================================
  // LOGIN DE USUÁRIO
  // ==============================================
  
  static async login(dados: LoginData) {
    try {
      // Buscar usuário pelo telefone
      const { data: usuario, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('telefone', dados.telefone)
        .single()

      if (error || !usuario) {
        throw new Error('Usuário não encontrado')
      }

      if (usuario.status !== 'ativo') {
        throw new Error('Usuário bloqueado ou inativo')
      }

      // Atualizar último login
      await supabase
        .from('usuarios')
        .update({ ultimo_login_em: new Date().toISOString() })
        .eq('id', usuario.id)

      // Gerar token
      const token = btoa(`${usuario.id}:${Date.now()}`)
      
      // Converter para formato AppUser
      const appUser: AppUser = {
        id: usuario.id,
        nome: usuario.nome,
        telefone: usuario.telefone,
        email: usuario.email,
        saldo: Number(usuario.saldo),
        totalGasto: Number(usuario.total_gasto),
        totalGanho: Number(usuario.total_ganho),
        nivel: usuario.nivel,
        pontosXp: usuario.pontos_xp,
        verificado: usuario.verificado,
        status: usuario.status
      }

      return {
        usuario: appUser,
        token
      }
      
    } catch (error: any) {
      console.error('Erro no login:', error)
      throw new Error(error.message || 'Erro ao fazer login')
    }
  }

  // ==============================================
  // VALIDAR TOKEN
  // ==============================================
  
  static async validarToken(token: string): Promise<AppUser | null> {
    try {
      // Decodificar token
      const decoded = atob(token)
      const [userId] = decoded.split(':')

      if (!userId) {
        return null
      }

      // Buscar usuário no banco
      const { data: usuario, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single()

      if (error || !usuario || usuario.status !== 'ativo') {
        return null
      }

      return {
        id: usuario.id,
        nome: usuario.nome,
        telefone: usuario.telefone,
        email: usuario.email,
        saldo: Number(usuario.saldo),
        totalGasto: Number(usuario.total_gasto),
        totalGanho: Number(usuario.total_ganho),
        nivel: usuario.nivel,
        pontosXp: usuario.pontos_xp,
        verificado: usuario.verificado,
        status: usuario.status
      }
      
    } catch (error) {
      console.error('Erro ao validar token:', error)
      return null
    }
  }

  // ==============================================
  // BUSCAR PERFIL
  // ==============================================
  
  static async buscarPerfil(userId: string) {
    try {
      const { data: usuario, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single()

      if (error || !usuario) {
        throw new Error('Usuário não encontrado')
      }

      return {
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
      }
      
    } catch (error: any) {
      console.error('Erro ao buscar perfil:', error)
      throw new Error(error.message || 'Erro ao carregar perfil')
    }
  }

  // ==============================================
  // ATUALIZAR PERFIL
  // ==============================================
  
  static async atualizarPerfil(userId: string, dados: Partial<RegistroData>) {
    try {
      const updateData: any = {}
      
      if (dados.nome) updateData.nome = dados.nome
      if (dados.email !== undefined) updateData.email = dados.email
      if (dados.dataNascimento !== undefined) updateData.data_nascimento = dados.dataNascimento
      
      updateData.atualizado_em = new Date().toISOString()

      const { data: usuario, error } = await supabase
        .from('usuarios')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        throw new Error('Erro ao atualizar perfil')
      }

      return {
        id: usuario.id,
        nome: usuario.nome,
        telefone: usuario.telefone,
        email: usuario.email,
        saldo: Number(usuario.saldo),
        totalGasto: Number(usuario.total_gasto),
        totalGanho: Number(usuario.total_ganho),
        nivel: usuario.nivel,
        pontosXp: usuario.pontos_xp,
        verificado: usuario.verificado,
        status: usuario.status
      }
      
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error)
      throw new Error(error.message || 'Erro ao atualizar perfil')
    }
  }

  // ==============================================
  // SISTEMA DE CARTEIRA
  // ==============================================
  
  static async atualizarSaldo(userId: string, novoSaldo: number, operacao: 'adicionar' | 'subtrair', motivo?: string) {
    try {
      // Buscar saldo atual
      const { data: usuario } = await supabase
        .from('usuarios')
        .select('saldo, total_gasto, total_ganho')
        .eq('id', userId)
        .single()

      if (!usuario) {
        throw new Error('Usuário não encontrado')
      }

      const saldoAtual = Number(usuario.saldo)
      let novoSaldoFinal: number
      let updateData: any = {
        atualizado_em: new Date().toISOString()
      }

      if (operacao === 'adicionar') {
        novoSaldoFinal = saldoAtual + novoSaldo
        updateData.saldo = novoSaldoFinal
        updateData.total_ganho = Number(usuario.total_ganho) + novoSaldo
      } else {
        if (saldoAtual < novoSaldo) {
          throw new Error('Saldo insuficiente')
        }
        novoSaldoFinal = saldoAtual - novoSaldo
        updateData.saldo = novoSaldoFinal
        updateData.total_gasto = Number(usuario.total_gasto) + novoSaldo
      }

      const { error } = await supabase
        .from('usuarios')
        .update(updateData)
        .eq('id', userId)

      if (error) {
        throw new Error('Erro ao atualizar saldo')
      }

      return {
        saldoAnterior: saldoAtual,
        saldoNovo: novoSaldoFinal,
        operacao,
        valor: novoSaldo,
        motivo
      }
      
    } catch (error: any) {
      console.error('Erro ao atualizar saldo:', error)
      throw new Error(error.message || 'Erro ao atualizar carteira')
    }
  }
}