import React from 'react'
import { cn } from '../../lib/utils'
import type { Raridade } from '../../types'

// Sistema de thumbnails profissionais para itens baseado em raridade e tipo
// Cada thumbnail tem um design único temático casino/brutalist

// Interfaces
interface BaseThumbnailProps {
  children: React.ReactNode
  className?: string
  variant?: string
  rarity: Raridade
}

interface ThumbnailProps {
  nome: string
  raridade?: Raridade
  className?: string
}

interface SmartItemThumbnailProps {
  nome: string
  tipo: string
  raridade?: Raridade
  imagemUrl?: string
  className?: string
}

type ThumbnailComponent = React.FC<ThumbnailProps>

const BaseThumbnail: React.FC<BaseThumbnailProps> = ({ children, className = "", variant = "default", rarity = "comum" }) => {
  const rarityColors = {
    comum: "from-gray-700 to-gray-800",
    raro: "from-cyan-800 to-cyan-900", 
    epico: "from-purple-800 to-purple-900",
    lendario: "from-yellow-800 to-yellow-900",
    mitico: "from-pink-800 to-pink-900"
  }

  return (
    <div className={cn(
      "w-full h-full relative overflow-hidden flex items-center justify-center",
      "bg-gradient-to-br",
      rarityColors[rarity] || rarityColors.comum,
      className
    )}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, currentColor 1px, transparent 1px)',
            backgroundSize: '15px 15px'
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center p-3">
        {children}
      </div>
    </div>
  )
}

// Thumbnail para Eletrônicos
export const EletronicThumbnail: React.FC<ThumbnailProps> = ({ nome, raridade = "comum", className = "" }) => (
  <BaseThumbnail rarity={raridade} className={className}>
    <svg viewBox="0 0 64 64" className="w-12 h-12 text-gray-200 mb-2">
      <rect x="8" y="16" width="48" height="32" rx="4" fill="currentColor" stroke="white" strokeWidth="2"/>
      <rect x="12" y="20" width="40" height="20" rx="2" fill="white" fillOpacity="0.2"/>
      <circle cx="20" cy="42" r="2" fill="white"/>
      <circle cx="44" cy="42" r="2" fill="white"/>
      <path d="M24 30h16M24 34h12" stroke="white" strokeWidth="2"/>
    </svg>
    
    <div className="text-center">
      <p className="text-white font-bold text-xs mb-1 truncate w-full max-w-16">{nome}</p>
      <p className="text-gray-300 text-xs uppercase">{raridade}</p>
    </div>
  </BaseThumbnail>
)

// Thumbnail para Acessórios
export const AccessoryThumbnail: React.FC<ThumbnailProps> = ({ nome, raridade = "comum", className = "" }) => (
  <BaseThumbnail rarity={raridade} className={className}>
    <svg viewBox="0 0 64 64" className="w-12 h-12 text-gray-200 mb-2">
      <circle cx="32" cy="32" r="20" fill="none" stroke="currentColor" strokeWidth="3"/>
      <circle cx="32" cy="32" r="12" fill="currentColor" stroke="white" strokeWidth="2"/>
      <circle cx="32" cy="32" r="6" fill="white"/>
      
      {/* Decorative elements */}
      <circle cx="32" cy="12" r="2" fill="white"/>
      <circle cx="32" cy="52" r="2" fill="white"/>
      <circle cx="12" cy="32" r="2" fill="white"/>
      <circle cx="52" cy="32" r="2" fill="white"/>
    </svg>
    
    <div className="text-center">
      <p className="text-white font-bold text-xs mb-1 truncate w-full max-w-16">{nome}</p>
      <p className="text-gray-300 text-xs uppercase">{raridade}</p>
    </div>
  </BaseThumbnail>
)

// Thumbnail para Vestuário
export const ClothingThumbnail: React.FC<ThumbnailProps> = ({ nome, raridade = "comum", className = "" }) => (
  <BaseThumbnail rarity={raridade} className={className}>
    <svg viewBox="0 0 64 64" className="w-12 h-12 text-gray-200 mb-2">
      <path d="M20 12h24v8l-4 4v32H24V24l-4-4V12z" fill="currentColor" stroke="white" strokeWidth="2"/>
      <path d="M20 12c0-4 4-8 8-8h8c4 0 8 4 8 8" fill="none" stroke="white" strokeWidth="2"/>
      <rect x="24" y="28" width="16" height="2" fill="white"/>
      <rect x="24" y="36" width="16" height="2" fill="white"/>
      <rect x="24" y="44" width="16" height="2" fill="white"/>
    </svg>
    
    <div className="text-center">
      <p className="text-white font-bold text-xs mb-1 truncate w-full max-w-16">{nome}</p>
      <p className="text-gray-300 text-xs uppercase">{raridade}</p>
    </div>
  </BaseThumbnail>
)

// Thumbnail para Casa/Decoração
export const HomeThumbnail: React.FC<ThumbnailProps> = ({ nome, raridade = "comum", className = "" }) => (
  <BaseThumbnail rarity={raridade} className={className}>
    <svg viewBox="0 0 64 64" className="w-12 h-12 text-gray-200 mb-2">
      <path d="M8 32l24-16 24 16v24H40V40H24v16H8V32z" fill="currentColor" stroke="white" strokeWidth="2"/>
      <rect x="28" y="44" width="8" height="12" fill="white"/>
      <rect x="16" y="40" width="6" height="6" fill="white"/>
      <rect x="42" y="40" width="6" height="6" fill="white"/>
      <circle cx="32" cy="20" r="2" fill="white"/>
    </svg>
    
    <div className="text-center">
      <p className="text-white font-bold text-xs mb-1 truncate w-full max-w-16">{nome}</p>
      <p className="text-gray-300 text-xs uppercase">{raridade}</p>
    </div>
  </BaseThumbnail>
)

// Thumbnail para Beleza/Cuidados
export const BeautyThumbnail: React.FC<ThumbnailProps> = ({ nome, raridade = "comum", className = "" }) => (
  <BaseThumbnail rarity={raridade} className={className}>
    <svg viewBox="0 0 64 64" className="w-12 h-12 text-gray-200 mb-2">
      <ellipse cx="32" cy="20" rx="12" ry="8" fill="currentColor" stroke="white" strokeWidth="2"/>
      <rect x="28" y="28" width="8" height="20" fill="currentColor" stroke="white" strokeWidth="2"/>
      <circle cx="32" cy="52" r="6" fill="currentColor" stroke="white" strokeWidth="2"/>
      
      {/* Decorative sparkles */}
      <circle cx="20" cy="15" r="1" fill="white" className="animate-pulse"/>
      <circle cx="44" cy="18" r="1" fill="white" className="animate-pulse" style={{animationDelay: '0.5s'}}/>
      <circle cx="38" cy="10" r="1" fill="white" className="animate-pulse" style={{animationDelay: '1s'}}/>
    </svg>
    
    <div className="text-center">
      <p className="text-white font-bold text-xs mb-1 truncate w-full max-w-16">{nome}</p>
      <p className="text-gray-300 text-xs uppercase">{raridade}</p>
    </div>
  </BaseThumbnail>
)

// Thumbnail para Esportes
export const SportsThumbnail: React.FC<ThumbnailProps> = ({ nome, raridade = "comum", className = "" }) => (
  <BaseThumbnail rarity={raridade} className={className}>
    <svg viewBox="0 0 64 64" className="w-12 h-12 text-gray-200 mb-2">
      <circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" strokeWidth="3"/>
      <path d="M8 32h48M32 8v48" stroke="white" strokeWidth="2"/>
      <path d="M16 16l32 32M48 16L16 48" stroke="white" strokeWidth="1"/>
      <circle cx="32" cy="32" r="4" fill="white"/>
    </svg>
    
    <div className="text-center">
      <p className="text-white font-bold text-xs mb-1 truncate w-full max-w-16">{nome}</p>
      <p className="text-gray-300 text-xs uppercase">{raridade}</p>
    </div>
  </BaseThumbnail>
)

// Thumbnail genérico para outros/desconhecidos
export const DefaultItemThumbnail: React.FC<ThumbnailProps> = ({ nome, raridade = "comum", className = "" }) => (
  <BaseThumbnail rarity={raridade} className={className}>
    <svg viewBox="0 0 64 64" className="w-12 h-12 text-gray-200 mb-2">
      <rect x="16" y="16" width="32" height="32" rx="8" fill="currentColor" stroke="white" strokeWidth="2"/>
      <circle cx="32" cy="32" r="8" fill="white" fillOpacity="0.3"/>
      <circle cx="32" cy="32" r="4" fill="white"/>
      
      {/* Question mark pattern */}
      <path d="M28 24c0-2 2-4 4-4s4 2 4 4c0 2-4 3-4 4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <circle cx="32" cy="36" r="1" fill="white"/>
    </svg>
    
    <div className="text-center">
      <p className="text-white font-bold text-xs mb-1 truncate w-full max-w-16">{nome}</p>
      <p className="text-gray-300 text-xs uppercase">{raridade}</p>
    </div>
  </BaseThumbnail>
)

// Função para selecionar thumbnail baseado no tipo do item
export const getThumbnailByType = (tipo: string): ThumbnailComponent => {
  const typeMap: Record<string, ThumbnailComponent> = {
    'eletronicos': EletronicThumbnail,
    'electronic': EletronicThumbnail,
    'smartphone': EletronicThumbnail,
    'laptop': EletronicThumbnail,
    'acessorios': AccessoryThumbnail,
    'accessory': AccessoryThumbnail,
    'relogio': AccessoryThumbnail,
    'watch': AccessoryThumbnail,
    'vestuario': ClothingThumbnail,
    'clothing': ClothingThumbnail,
    'roupa': ClothingThumbnail,
    'casa': HomeThumbnail,
    'home': HomeThumbnail,
    'decoracao': HomeThumbnail,
    'beleza': BeautyThumbnail,
    'beauty': BeautyThumbnail,
    'cuidados': BeautyThumbnail,
    'esportes': SportsThumbnail,
    'sports': SportsThumbnail,
    'fitness': SportsThumbnail
  }
  
  const lowerType = tipo?.toLowerCase() || ''
  return typeMap[lowerType] || DefaultItemThumbnail
}

// Componente principal que seleciona automaticamente com fallback elegante
export const SmartItemThumbnail: React.FC<SmartItemThumbnailProps> = ({ nome, tipo, raridade = "comum", imagemUrl, className = "" }) => {
  const [imageError, setImageError] = React.useState<boolean>(false)
  const [imageLoaded, setImageLoaded] = React.useState<boolean>(false)
  
  // Seleciona thumbnail baseado no tipo
  const ThumbnailComponent = getThumbnailByType(tipo)
  
  // Se tem imagem e não falhou, mostra a imagem
  if (imagemUrl && !imageError) {
    return (
      <div className={cn("w-full h-full relative overflow-hidden", className)}>
        <img 
          src={imagemUrl} 
          alt={nome}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true)
            setImageLoaded(false)
          }}
        />
        
        {/* Loading skeleton while image loads */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse">
            <div className="absolute inset-4 border-2 border-dashed border-gray-500 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 bg-gray-600 rounded-full mx-auto mb-2 animate-pulse"></div>
                <div className="w-12 h-2 bg-gray-600 rounded mx-auto animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Elegant fallback overlay when image fails */}
        {imageError && (
          <div className="absolute inset-0">
            <ThumbnailComponent nome={nome} raridade={raridade} className="w-full h-full" />
          </div>
        )}
      </div>
    )
  }
  
  // Fallback para thumbnail padrão quando não há imagem
  return <ThumbnailComponent nome={nome} raridade={raridade} className={className} />
}