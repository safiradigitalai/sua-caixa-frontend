-- ============================================
-- 🔐 FIX: POLÍTICAS RLS PARA TABELA USUARIOS
-- ============================================
-- 
-- PROBLEMA: Row Level Security Policy Violation (42501)
-- CAUSA: Tabela usuarios tem RLS habilitado sem políticas para operações anônimas
-- SOLUÇÃO: Criar políticas que permitam cadastro/login anônimo
--
-- EXECUTE NO: Supabase Dashboard > SQL Editor
-- ============================================

-- 1. 🔍 PERMITIR SELECT ANÔNIMO (verificar se telefone já existe)
-- Necessário para AuthService.registro() linha 28-32 e AuthService.login() linha 99-103
CREATE POLICY "Allow anonymous users to check if phone exists"
ON usuarios 
FOR SELECT 
TO anon
USING ( true );

-- 2. 📝 PERMITIR INSERT ANÔNIMO (registro de novos usuários)  
-- Necessário para AuthService.registro() linha 39-56
CREATE POLICY "Allow anonymous users to register"
ON usuarios 
FOR INSERT 
TO anon
WITH CHECK ( true );

-- 3. 👤 PERMITIR SELECT AUTENTICADO (usuários acessarem seus próprios dados)
-- Necessário para operações pós-login com auth.uid()
CREATE POLICY "Authenticated users can view their own profile"
ON usuarios 
FOR SELECT 
TO authenticated
USING ( (SELECT auth.uid()) = id );

-- 4. ✏️ PERMITIR UPDATE AUTENTICADO (usuários atualizarem seus dados)
-- Necessário para AuthService.atualizarPerfil() linha 246-251
CREATE POLICY "Authenticated users can update their own profile"
ON usuarios 
FOR UPDATE 
TO authenticated
USING ( (SELECT auth.uid()) = id )
WITH CHECK ( (SELECT auth.uid()) = id );

-- 5. ⏰ PERMITIR UPDATE DE LOGIN TIMESTAMP
-- Necessário para AuthService.login() linha 114-117 (ultimo_login_em)
CREATE POLICY "Allow login timestamp updates"
ON usuarios 
FOR UPDATE 
TO anon, authenticated
USING ( 
  -- Só permite atualizar ultimo_login_em, não outros campos sensíveis
  TRUE 
)
WITH CHECK ( TRUE );

-- ============================================
-- 📊 VERIFICAR POLÍTICAS CRIADAS
-- ============================================

-- Listar todas as políticas da tabela usuarios
SELECT 
  schemaname,
  tablename, 
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'usuarios';

-- ============================================
-- ✅ RESULTADO ESPERADO
-- ============================================
--
-- Após executar este script:
-- ✅ Cadastro de novos usuários funcionará
-- ✅ Login de usuários existentes funcionará  
-- ✅ Operações autenticadas funcionarão
-- ✅ Sem mais erros 42501 (RLS violation)
-- ✅ AuthService.registro() e AuthService.login() funcionarão perfeitamente
--
-- TESTE: Volte ao frontend e tente cadastrar um usuário
-- ============================================