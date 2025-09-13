import React from 'react'

// Sistema de ícones temáticos Casino Brutalist
// Usando SVG customizados em vez de emojis para consistência

interface IconProps {
  className?: string
}

interface CasinoChipProps extends IconProps {
  color?: string
}

interface CasinoPokerChipProps extends IconProps {
  value?: string
}

export const CasinoChip: React.FC<CasinoChipProps> = ({ className = "w-6 h-6", color = "currentColor" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill={color} stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2"/>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
  </svg>
)

export const CasinoDice: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3z"/>
    <circle cx="6" cy="6" r="1" fill="white"/>
    <circle cx="18" cy="6" r="1" fill="white"/>
    <circle cx="16" cy="4" r="1" fill="white"/>
    <circle cx="20" cy="8" r="1" fill="white"/>
    <circle cx="4" cy="17" r="1" fill="white"/>
    <circle cx="8" cy="17" r="1" fill="white"/>
    <circle cx="4" cy="21" r="1" fill="white"/>
    <circle cx="8" cy="21" r="1" fill="white"/>
    <circle cx="6" cy="19" r="1" fill="white"/>
  </svg>
)

export const CasinoCards: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="12" height="16" rx="2" fill="currentColor" stroke="white" strokeWidth="2"/>
    <rect x="10" y="2" width="12" height="16" rx="2" fill="currentColor" stroke="white" strokeWidth="2"/>
    <path d="M7 8l2 4-2 4M17 6l2 4-2 4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

export const CasinoRoulette: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="currentColor" stroke="white" strokeWidth="2"/>
    <circle cx="12" cy="12" r="6" fill="none" stroke="white" strokeWidth="1"/>
    <circle cx="12" cy="12" r="2" fill="white"/>
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="white" strokeWidth="2"/>
    <path d="M5.64 5.64l2.83 2.83M15.53 15.53l2.83 2.83M5.64 18.36l2.83-2.83M15.53 8.47l2.83-2.83" stroke="white" strokeWidth="1"/>
  </svg>
)

export const CasinoSlotMachine: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="2" width="16" height="20" rx="3" fill="currentColor" stroke="white" strokeWidth="2"/>
    <rect x="6" y="6" width="12" height="8" rx="1" fill="white"/>
    <rect x="7" y="7" width="3" height="6" rx="1" fill="currentColor"/>
    <rect x="10.5" y="7" width="3" height="6" rx="1" fill="currentColor"/>
    <rect x="14" y="7" width="3" height="6" rx="1" fill="currentColor"/>
    <circle cx="12" cy="18" r="2" fill="white"/>
    <rect x="10" y="20" width="4" height="2" fill="white"/>
  </svg>
)

export const CasinoPokerChip: React.FC<CasinoPokerChipProps> = ({ className = "w-6 h-6", value = "$" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11" fill="currentColor" stroke="white" strokeWidth="2"/>
    <circle cx="12" cy="12" r="8" fill="none" stroke="white" strokeWidth="1" strokeDasharray="3,3"/>
    <text x="12" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">{value}</text>
    <circle cx="12" cy="4" r="1" fill="white"/>
    <circle cx="20" cy="12" r="1" fill="white"/>
    <circle cx="12" cy="20" r="1" fill="white"/>
    <circle cx="4" cy="12" r="1" fill="white"/>
  </svg>
)

export const MysteryBox: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="8" width="18" height="13" rx="2" fill="currentColor" stroke="white" strokeWidth="2"/>
    <path d="M7 8V6a5 5 0 0 1 10 0v2" stroke="white" strokeWidth="2" fill="none"/>
    <circle cx="12" cy="15" r="2" fill="white"/>
    <path d="M12 11v8" stroke="white" strokeWidth="2"/>
    <path d="M9 13l6 4M15 13l-6 4" stroke="white" strokeWidth="1"/>
  </svg>
)

export const TreasureChest: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 10h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10z"/>
    <path d="M4 10V8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" stroke="white" strokeWidth="2" fill="none"/>
    <rect x="10" y="13" width="4" height="2" fill="white" rx="1"/>
    <circle cx="12" cy="16" r="1" fill="white"/>
  </svg>
)

export const GoldenVault: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="6" width="20" height="16" rx="3" fill="currentColor" stroke="white" strokeWidth="2"/>
    <circle cx="16" cy="14" r="4" fill="none" stroke="white" strokeWidth="2"/>
    <circle cx="16" cy="14" r="2" fill="white"/>
    <path d="M16 12v4M14 14h4" stroke="currentColor" strokeWidth="1"/>
    <rect x="4" y="8" width="8" height="2" fill="white" rx="1"/>
    <rect x="4" y="11" width="6" height="2" fill="white" rx="1"/>
    <rect x="4" y="14" width="7" height="2" fill="white" rx="1"/>
  </svg>
)

export const DiamondBox: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l4 6-4 14-4-14z"/>
    <path d="M6 8h12l-6 14z" fill="white" fillOpacity="0.3"/>
    <path d="M8 8l4-6 4 6" stroke="white" strokeWidth="2" fill="none"/>
    <path d="M6 8l6 14 6-14" stroke="white" strokeWidth="1" fill="none"/>
  </svg>
)

// Ícones para raridade sem emojis
export const RarityCommon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="8" stroke="white" strokeWidth="2"/>
    <circle cx="12" cy="12" r="4"/>
  </svg>
)

export const RarityRare: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"/>
    <polygon points="12,4 14,8 18,8 15,11 16,15 12,13 8,15 9,11 6,8 10,8" fill="white"/>
  </svg>
)

export const RarityEpic: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="currentColor" stroke="white" strokeWidth="2"/>
    <path d="M12 6l2 4 4 .5-3 3 .5 4-3.5-2-3.5 2 .5-4-3-3 4-.5z" fill="white"/>
  </svg>
)

export const RarityLegendary: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 16L3 6h5.5l1.5 4 1.5-4H17l-2 10-5-2-5 2z"/>
    <path d="M5 16L3 6h5.5l1.5 4 1.5-4H17l-2 10" stroke="white" strokeWidth="2" fill="none"/>
    <circle cx="12" cy="10" r="2" fill="white"/>
    <path d="M7 8h10M8 12h8" stroke="white" strokeWidth="1"/>
  </svg>
)

export const RarityMythic: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l3 6 6 1-4.5 4.5L18 20l-6-3-6 3 1.5-6.5L3 9l6-1z" fill="currentColor" stroke="white" strokeWidth="2"/>
    <path d="M12 4l2 4 4 .7-3 3L16 16l-4-2-4 2 1-4.3-3-3 4-.7z" fill="white"/>
    <circle cx="12" cy="10" r="2" fill="currentColor"/>
    <path d="M10 8l4 0M10 12l4 0" stroke="currentColor" strokeWidth="1"/>
  </svg>
)

// Ícones para ações
export const PlayButton: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <polygon points="5,3 19,12 5,21"/>
  </svg>
)

export const ViewOdds: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="12" r="3" fill="currentColor"/>
    <path d="M12 1v6M12 17v6M23 12h-6M7 12H1" stroke="currentColor" strokeWidth="2"/>
  </svg>
)

export const HotLabel: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5 2C13.5 2 15 4 15 6.5C15 8.5 13.5 10 12 10C10.5 10 9 8.5 9 6.5C9 4 10.5 2 13.5 2Z"/>
    <path d="M12 10C12 10 16 12 16 16C16 20 13 22 12 22C11 22 8 20 8 16C8 12 12 10 12 10Z"/>
  </svg>
)

export const VipBadge: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 3l2 8-2 8h10l-2-8 2-8H7z" fill="currentColor" stroke="white" strokeWidth="2"/>
    <path d="M9 7h6M9 12h6M9 17h6" stroke="white" strokeWidth="1"/>
  </svg>
)

// Additional casino/brutalist themed icons
export const CasinoCrown: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 16L3 6h5.5l1.5 4 1.5-4H17l-2 10H5z"/>
    <path d="M3 16h18v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2z" stroke="white" strokeWidth="2" fill="white"/>
    <circle cx="12" cy="10" r="2" fill="white"/>
  </svg>
)

export const CasinoStar: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l3.09 6.26L22 9l-5 4.87L18.18 21 12 17.77 5.82 21 7 13.87 2 9l6.91-1.74L12 2z"/>
    <path d="M12 4l2 4 4 .7-3 3L16 16l-4-2-4 2 1-4.3-3-3 4-.7z" fill="white"/>
  </svg>
)

export const CasinoLightning: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"/>
    <path d="M13 4l-1 6h6l-8 8 1-6H5l8-8z" fill="white"/>
  </svg>
)

export const CasinoCoin: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="currentColor" stroke="white" strokeWidth="2"/>
    <path d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4" stroke="white" strokeWidth="2" fill="none"/>
    <path d="M12 8v8M10 8h4M10 16h4" stroke="white" strokeWidth="1"/>
  </svg>
)

export const CasinoAce: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="2" width="16" height="20" rx="3" fill="currentColor" stroke="white" strokeWidth="2"/>
    <path d="M12 6l2 6h-4l2-6z" fill="white"/>
    <path d="M8 16h8l-4-4-4 4z" fill="white"/>
    <circle cx="8" cy="8" r="1" fill="white"/>
    <circle cx="16" cy="16" r="1" fill="white"/>
  </svg>
)

export const CasinoLucky: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2c2 0 4 2 4 4 0 4-4 8-4 12 0-4-4-8-4-12 0-2 2-4 4-4z" fill="currentColor" stroke="white" strokeWidth="2"/>
    <ellipse cx="12" cy="18" rx="3" ry="1" fill="white"/>
    <circle cx="12" cy="7" r="1" fill="white"/>
    <path d="M8 12c1-1 2-1 4-1s3 0 4 1" stroke="white" strokeWidth="1" fill="none"/>
  </svg>
)

export const CasinoJackpot: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 8h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z"/>
    <path d="M6 4h12v4H6z" stroke="white" strokeWidth="2" fill="white"/>
    <circle cx="12" cy="14" r="3" fill="white"/>
    <text x="12" y="17" textAnchor="middle" fill="currentColor" fontSize="6" fontWeight="bold">$</text>
    
    {/* Coins falling */}
    <circle cx="8" cy="2" r="1" fill="white" className="animate-bounce"/>
    <circle cx="16" cy="3" r="1" fill="white" className="animate-bounce" style={{animationDelay: '0.2s'}}/>
    <circle cx="12" cy="1" r="1" fill="white" className="animate-bounce" style={{animationDelay: '0.4s'}}/>
  </svg>
)

export const CasinoMagic: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 12l9-9 9 9-9 9-9-9z" fill="currentColor" stroke="white" strokeWidth="2"/>
    <path d="M8 12l4-4 4 4-4 4-4-4z" fill="white"/>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
    
    {/* Magic sparkles */}
    <path d="M6 6l2 2-2 2-2-2 2-2zM18 6l2 2-2 2-2-2 2-2zM6 18l2-2 2 2-2 2-2-2zM18 18l-2-2 2-2 2 2-2 2z" fill="white" opacity="0.7"/>
  </svg>
)