-- Script para adicionar R$ 100 de saldo para teste
-- Execute este script diretamente no Supabase SQL Editor

UPDATE usuarios 
SET 
  saldo = 100.00,
  total_ganho = 100.00,
  atualizado_em = now()
WHERE telefone = '84999194580'
RETURNING id, nome, telefone, saldo, total_ganho;