import React from 'react'

const HomePageDebug = () => {
  return (
    <div className="min-h-screen bg-luxdrop-hero p-8">
      <h1 className="text-4xl font-luxdrop text-luxdrop-lavender text-center">
        SUA CAIXA DEBUG
      </h1>
      
      <p className="text-center mt-4 text-luxdrop-lavenderGrey">
        Se você vê esta página, os imports básicos estão funcionando.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <div className="bg-luxdrop-boxes p-6 rounded-lg">
          <h2 className="text-white font-bold">Boxes</h2>
          <p className="text-white/80">Gradiente funcionando</p>
        </div>
        
        <div className="bg-luxdrop-battles p-6 rounded-lg">
          <h2 className="text-white font-bold">Battles</h2>
          <p className="text-white/80">Gradiente funcionando</p>
        </div>
        
        <div className="bg-luxdrop-rewards p-6 rounded-lg">
          <h2 className="text-white font-bold">Rewards</h2>
          <p className="text-white/80">Gradiente funcionando</p>
        </div>
      </div>
    </div>
  )
}

export default HomePageDebug