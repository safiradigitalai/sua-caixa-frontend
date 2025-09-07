import React, { useState } from 'react'
import CaixaOpeningModal from '../modals/CaixaOpeningModal'

const BoxAnimationTest = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const testCaixa = {
    id: 'test-caixa',
    nome: 'Caixa de Teste 3D',
    preco: 50.00
  }

  const testCompraId = 'test-compra-123'

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-white mb-4">Teste da Animação 3D</h2>
      <button
        onClick={() => setIsModalOpen(true)}
        className="btn-primary"
      >
        🎁 Testar Animação 3D
      </button>
      
      <CaixaOpeningModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        caixa={testCaixa}
        compraId={testCompraId}
      />
    </div>
  )
}

export default BoxAnimationTest