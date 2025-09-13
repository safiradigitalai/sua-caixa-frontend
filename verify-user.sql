-- Script para verificar o usuário e habilitar saques
-- Execute este script diretamente no Supabase SQL Editor

UPDATE usuarios 
SET 
  verificado = true,
  atualizado_em = now()
WHERE telefone = '84999194580'
RETURNING id, nome, telefone, saldo, verificado, status;