import React from 'react'
import { cn } from '../../lib/utils'

// Sistema de thumbnails padrão para caixas baseado em preço/raridade
// Cada thumbnail tem um design único e temático

const BaseThumbnail = ({ children, className = "", variant = "default" }) => (
  <div className={cn(
    "w-full h-full relative overflow-hidden flex items-center justify-center",
    "bg-gradient-to-br from-gray-800 to-gray-900",
    variant === "pink" && "from-pink-900 to-red-900",
    variant === "lime" && "from-green-900 to-emerald-900", 
    variant === "cyan" && "from-cyan-900 to-blue-900",
    variant === "gold" && "from-yellow-900 to-orange-900",
    variant === "purple" && "from-purple-900 to-indigo-900",
    className
  )}>
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-10">
      <div 
        className="w-full h-full"
        style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, currentColor 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />
    </div>
    
    {/* Content */}
    <div className="relative z-10 flex flex-col items-center justify-center p-4">
      {children}
    </div>
  </div>
)

// Thumbnail para caixas comuns (R$ 5-25)
export const CommonBoxThumbnail = ({ nome, preco, className = "" }) => (
  <BaseThumbnail variant="default" className={className}>
    {/* Simple Box Icon */}
    <svg viewBox="0 0 64 64" className="w-16 h-16 text-gray-300 mb-2">
      <rect x="8" y="16" width="48" height="32" rx="4" fill="currentColor" stroke="white" strokeWidth="2"/>
      <path d="M8 24h48M16 16v8M48 16v8" stroke="white" strokeWidth="2"/>
      <circle cx="32" cy="32" r="4" fill="white"/>
    </svg>
    
    <div className="text-center">
      <p className="text-white font-bold text-sm mb-1 truncate w-full">{nome}</p>
      <p className="text-gray-300 text-xs font-mono">{preco}</p>
    </div>
  </BaseThumbnail>
)

// Thumbnail para caixas raras (R$ 25-50)
export const RareBoxThumbnail = ({ nome, preco, className = "" }) => (
  <BaseThumbnail variant="cyan" className={className}>
    {/* Treasure Chest */}
    <svg viewBox="0 0 64 64" className="w-16 h-16 text-cyan-300 mb-2">
      <path d="M8 24h48v28a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V24z" fill="currentColor"/>
      <path d="M8 24V20a8 8 0 0 1 8-8h32a8 8 0 0 1 8 8v4" stroke="white" strokeWidth="3" fill="none"/>
      <rect x="26" y="30" width="12" height="4" fill="white" rx="2"/>
      <circle cx="32" cy="38" r="2" fill="white"/>
      
      {/* Glow effect */}
      <circle cx="32" cy="32" r="20" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
    </svg>
    
    <div className="text-center">
      <p className="text-white font-bold text-sm mb-1 truncate w-full">{nome}</p>
      <p className="text-cyan-300 text-xs font-mono">{preco}</p>
      <div className="flex items-center justify-center gap-1 mt-1">
        <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"/>
        <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}/>
        <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}/>
      </div>
    </div>
  </BaseThumbnail>
)

// Thumbnail para caixas épicas (R$ 50-100)
export const EpicBoxThumbnail = ({ nome, preco, className = "" }) => (
  <BaseThumbnail variant="purple" className={className}>
    {/* Magic Crystal Box */}
    <svg viewBox="0 0 64 64" className="w-16 h-16 text-purple-300 mb-2">
      <polygon points="32,8 48,20 48,44 32,56 16,44 16,20" fill="currentColor" stroke="white" strokeWidth="2"/>
      <polygon points="32,12 44,20 44,40 32,48 20,40 20,20" fill="white" fillOpacity="0.3"/>
      <polygon points="32,8 32,32 16,20" stroke="white" strokeWidth="1" fill="none"/>
      <polygon points="32,8 32,32 48,20" stroke="white" strokeWidth="1" fill="none"/>
      <circle cx="32" cy="28" r="3" fill="white"/>
      
      {/* Energy lines */}
      <path d="M32 8L32 56M16 20L48 44M48 20L16 44" stroke="white" strokeWidth="0.5" opacity="0.5"/>
    </svg>
    
    <div className="text-center">
      <p className="text-white font-bold text-sm mb-1 truncate w-full">{nome}</p>
      <p className="text-purple-300 text-xs font-mono">{preco}</p>
      <div className="flex items-center justify-center gap-0.5 mt-1">
        <div className="w-2 h-0.5 bg-purple-400 animate-pulse"/>
        <div className="w-1 h-1 bg-purple-400 animate-pulse" style={{animationDelay: '0.3s'}}/>
        <div className="w-2 h-0.5 bg-purple-400 animate-pulse" style={{animationDelay: '0.6s'}}/>
      </div>
    </div>
  </BaseThumbnail>
)

// Thumbnail para caixas lendárias (R$ 100-200)
export const LegendaryBoxThumbnail = ({ nome, preco, className = "" }) => (
  <BaseThumbnail variant="gold" className={className}>
    {/* Golden Vault */}
    <svg viewBox="0 0 64 64" className="w-16 h-16 text-yellow-300 mb-2">
      <rect x="4" y="16" width="56" height="40" rx="6" fill="currentColor" stroke="white" strokeWidth="2"/>
      <circle cx="48" cy="36" r="8" fill="none" stroke="white" strokeWidth="2"/>
      <circle cx="48" cy="36" r="4" fill="white"/>
      <path d="M48 32v8M44 36h8" stroke="currentColor" strokeWidth="2"/>
      
      {/* Gold bars */}
      <rect x="8" y="20" width="24" height="4" fill="white" rx="2"/>
      <rect x="8" y="26" width="20" height="4" fill="white" rx="2" opacity="0.8"/>
      <rect x="8" y="32" width="22" height="4" fill="white" rx="2" opacity="0.6"/>
      
      {/* Sparkles */}
      <circle cx="16" cy="44" r="1" fill="white" className="animate-pulse"/>
      <circle cx="28" cy="48" r="1" fill="white" className="animate-pulse" style={{animationDelay: '0.5s'}}/>
      <circle cx="20" cy="50" r="1" fill="white" className="animate-pulse" style={{animationDelay: '1s'}}/>
    </svg>
    
    <div className="text-center">
      <p className="text-white font-bold text-sm mb-1 truncate w-full">{nome}</p>
      <p className="text-yellow-300 text-xs font-mono font-bold">{preco}</p>
      <div className="flex items-center justify-center gap-1 mt-1">
        <div className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce"/>
        <div className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}/>
        <div className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}/>
        <div className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.6s'}}/>
      </div>
    </div>
  </BaseThumbnail>
)

// Thumbnail para caixas míticas (R$ 200+)
export const MythicBoxThumbnail = ({ nome, preco, className = "" }) => (
  <BaseThumbnail variant="pink" className={className}>
    {/* Cosmic Diamond */}
    <svg viewBox="0 0 64 64" className="w-16 h-16 text-pink-300 mb-2">
      <polygon points="32,4 48,16 32,28 16,16" fill="currentColor" stroke="white" strokeWidth="2"/>
      <polygon points="16,16 32,28 32,60 16,48" fill="currentColor" stroke="white" strokeWidth="2" opacity="0.8"/>
      <polygon points="48,16 32,28 32,60 48,48" fill="currentColor" stroke="white" strokeWidth="2" opacity="0.6"/>
      
      {/* Inner light */}
      <polygon points="32,8 44,16 32,24 20,16" fill="white" opacity="0.7"/>
      <polygon points="32,16 40,20 32,24 24,20" fill="white"/>
      
      {/* Energy rays */}
      <path d="M32 4L32 60M16 16L48 48M48 16L16 48M8 32L56 32" stroke="white" strokeWidth="0.5" opacity="0.8"/>
      
      {/* Floating particles */}
      <circle cx="12" cy="12" r="1" fill="white" className="animate-ping"/>
      <circle cx="52" cy="12" r="1" fill="white" className="animate-ping" style={{animationDelay: '0.5s'}}/>
      <circle cx="12" cy="52" r="1" fill="white" className="animate-ping" style={{animationDelay: '1s'}}/>
      <circle cx="52" cy="52" r="1" fill="white" className="animate-ping" style={{animationDelay: '1.5s'}}/>
    </svg>
    
    <div className="text-center">
      <p className="text-white font-bold text-sm mb-1 truncate w-full">{nome}</p>
      <p className="text-pink-300 text-xs font-mono font-bold">{preco}</p>
      <div className="flex items-center justify-center gap-0.5 mt-1">
        <div className="w-1 h-3 bg-gradient-to-t from-pink-500 to-purple-400 animate-pulse"/>
        <div className="w-1 h-4 bg-gradient-to-t from-purple-500 to-cyan-400 animate-pulse" style={{animationDelay: '0.2s'}}/>
        <div className="w-1 h-3 bg-gradient-to-t from-cyan-500 to-pink-400 animate-pulse" style={{animationDelay: '0.4s'}}/>
        <div className="w-1 h-4 bg-gradient-to-t from-pink-500 to-yellow-400 animate-pulse" style={{animationDelay: '0.6s'}}/>
        <div className="w-1 h-3 bg-gradient-to-t from-yellow-500 to-pink-400 animate-pulse" style={{animationDelay: '0.8s'}}/>
      </div>
    </div>
  </BaseThumbnail>
)

// Thumbnail genérico para fallback
export const DefaultBoxThumbnail = ({ nome, preco, className = "" }) => (
  <BaseThumbnail className={className}>
    {/* Mystery Question Mark */}
    <svg viewBox="0 0 64 64" className="w-16 h-16 text-gray-300 mb-2">
      <circle cx="32" cy="32" r="28" fill="currentColor" stroke="white" strokeWidth="2"/>
      <circle cx="32" cy="32" r="20" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4,4"/>
      
      {/* Question mark */}
      <path d="M26 20c0-4 4-8 6-8s6 4 6 8c0 4-6 6-6 8" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <circle cx="32" cy="44" r="2" fill="white"/>
      
      {/* Animated dots */}
      <circle cx="20" cy="20" r="1" fill="white" className="animate-pulse"/>
      <circle cx="44" cy="20" r="1" fill="white" className="animate-pulse" style={{animationDelay: '0.5s'}}/>
      <circle cx="20" cy="44" r="1" fill="white" className="animate-pulse" style={{animationDelay: '1s'}}/>
      <circle cx="44" cy="44" r="1" fill="white" className="animate-pulse" style={{animationDelay: '1.5s'}}/>
    </svg>
    
    <div className="text-center">
      <p className="text-white font-bold text-sm mb-1 truncate w-full">{nome}</p>
      <p className="text-gray-300 text-xs font-mono">{preco}</p>
    </div>
  </BaseThumbnail>
)

// Função para selecionar o thumbnail baseado no preço
export const getThumbnailByPrice = (preco) => {
  const price = parseFloat(preco) || 0
  
  if (price >= 200) return MythicBoxThumbnail
  if (price >= 100) return LegendaryBoxThumbnail  
  if (price >= 50) return EpicBoxThumbnail
  if (price >= 25) return RareBoxThumbnail
  return CommonBoxThumbnail
}

// Componente principal que sempre usa thumbnails padrão (sem imagens)
export const SmartBoxThumbnail = ({ nome, preco, imagemUrl, className = "" }) => {
  // Seleciona thumbnail baseado no preço - sempre ignora imagemUrl
  const ThumbnailComponent = getThumbnailByPrice(preco)
  
  // Sempre retorna o thumbnail padrão baseado no preço
  return <ThumbnailComponent nome={nome} preco={preco} className={className} />
}