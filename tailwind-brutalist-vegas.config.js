/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 🎰 BRUTALIST VEGAS - CORES EXPLOSIVAS
      colors: {
        // NEONS BRILHANTES - Vegas Style
        neon: {
          pink: '#FF007F',        // Hot pink 
          lime: '#00FF41',        // Electric lime
          cyan: '#00FFFF',        // Electric cyan
          orange: '#FF4500',      // Red orange
          purple: '#8A2BE2',      // Blue violet
          yellow: '#FFFF00',      // Pure yellow
          red: '#FF0040',         // Electric red
          blue: '#0080FF',        // Electric blue
          green: '#39FF14',       // Neon green
          magenta: '#FF00FF',     // Electric magenta
        },
        
        // VEGAS CASINO - Cores Clássicas Saturadas
        vegas: {
          gold: '#FFD700',        // Pure gold
          red: '#DC143C',         // Crimson red
          black: '#000000',       // Pure black
          white: '#FFFFFF',       // Pure white
          green: '#228B22',       // Forest green
          purple: '#4B0082',      // Indigo
          silver: '#C0C0C0',      // Silver
          bronze: '#CD7F32',      // Bronze
        },
        
        // BRUTALIST - Cores Sólidas e Contrastantes
        brutal: {
          black: '#000000',
          white: '#FFFFFF', 
          red: '#FF0000',
          blue: '#0000FF',
          yellow: '#FFFF00',
          green: '#00FF00',
          purple: '#FF00FF',
          orange: '#FF8000',
          pink: '#FF69B4',
          cyan: '#00FFFF',
        },
        
        // CHIP COLORS - Fichas de Poker Autênticas
        chip: {
          white: '#F8F8FF',       // $1
          red: '#DC143C',         // $5  
          green: '#006400',       // $25
          black: '#2F4F4F',       // $100
          purple: '#800080',      // $500
          yellow: '#FFD700',      // $1000
          orange: '#FF4500',      // $5000
          pink: '#FF1493',        // $10000
        },
        
        // BACKGROUNDS
        bg: {
          void: '#000000',        // Pure black
          dark: '#0A0A0A',        // Almost black
          felt: '#006400',        // Casino green
          velvet: '#800020',      // Deep red
        },
        
        // GLASS EFFECTS com cores
        glass: {
          neon: 'rgba(255, 0, 127, 0.1)',
          gold: 'rgba(255, 215, 0, 0.1)', 
          cyan: 'rgba(0, 255, 255, 0.1)',
          white: 'rgba(255, 255, 255, 0.1)',
        },
      },
      
      // TIPOGRAFIA EXPRESSIVA
      fontFamily: {
        'brutalist': ['Impact', 'Arial Black', 'sans-serif'],
        'vegas': ['Times New Roman', 'serif'],
        'cyber': ['Courier New', 'monospace'],
        'display': ['Anton', 'Impact', 'sans-serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      
      fontSize: {
        'mega': ['clamp(48px, 15vw, 120px)', { lineHeight: '0.8', letterSpacing: '-0.02em' }],
        'brutal': ['clamp(32px, 8vw, 64px)', { lineHeight: '0.9', letterSpacing: '-0.01em' }],
        'vegas': ['clamp(24px, 6vw, 48px)', { lineHeight: '1.1' }],
        'neon': ['clamp(18px, 4vw, 32px)', { lineHeight: '1.2' }],
      },
      
      // SOMBRAS BRUTALIST COLORIDAS
      boxShadow: {
        // Sombras neon
        'neon-pink': '0 0 20px #FF007F, 4px 4px 0 #FF007F',
        'neon-lime': '0 0 20px #00FF41, 4px 4px 0 #00FF41', 
        'neon-cyan': '0 0 20px #00FFFF, 4px 4px 0 #00FFFF',
        'neon-purple': '0 0 20px #8A2BE2, 4px 4px 0 #8A2BE2',
        
        // Sombras brutalist coloridas
        'brutal-red': '6px 6px 0 #FF0000',
        'brutal-blue': '6px 6px 0 #0000FF', 
        'brutal-yellow': '6px 6px 0 #FFFF00',
        'brutal-green': '6px 6px 0 #00FF00',
        'brutal-pink': '6px 6px 0 #FF69B4',
        
        // Sombras múltiplas Vegas
        'vegas-gold': '4px 4px 0 #FFD700, 8px 8px 0 #FF8000',
        'vegas-red': '4px 4px 0 #DC143C, 8px 8px 0 #8B0000',
        'vegas-multi': '4px 4px 0 #FF0000, 8px 8px 0 #00FF00, 12px 12px 0 #0000FF',
        
        // Sombras chip poker
        'chip-red': 'inset 0 4px 8px rgba(220, 20, 60, 0.3), 0 6px 0 #8B0000',
        'chip-green': 'inset 0 4px 8px rgba(0, 100, 0, 0.3), 0 6px 0 #003200',
        'chip-black': 'inset 0 4px 8px rgba(47, 79, 79, 0.3), 0 6px 0 #1C1C1C',
      },
      
      // GRADIENTES VIBRANTES
      backgroundImage: {
        // Gradientes neon
        'gradient-neon-pink': 'linear-gradient(135deg, #FF007F, #FF69B4, #FF1493)',
        'gradient-neon-lime': 'linear-gradient(135deg, #00FF41, #39FF14, #ADFF2F)',
        'gradient-neon-cyber': 'linear-gradient(135deg, #FF007F, #00FFFF, #8A2BE2)',
        
        // Gradientes Vegas
        'gradient-vegas-gold': 'linear-gradient(135deg, #FFD700, #FFA500, #FF8C00)',
        'gradient-vegas-red': 'linear-gradient(135deg, #DC143C, #B22222, #8B0000)',
        'gradient-vegas-royal': 'linear-gradient(135deg, #4B0082, #8A2BE2, #9932CC)',
        
        // Gradientes brutalist
        'gradient-brutal-fire': 'linear-gradient(135deg, #FF0000, #FF8000, #FFFF00)',
        'gradient-brutal-ice': 'linear-gradient(135deg, #00FFFF, #0080FF, #0000FF)',
        'gradient-brutal-toxic': 'linear-gradient(135deg, #00FF00, #39FF14, #ADFF2F)',
        
        // Padrões
        'pattern-chips': 'radial-gradient(circle at 25% 25%, #FFD700 2px, transparent 2px), radial-gradient(circle at 75% 75%, #DC143C 2px, transparent 2px)',
        'pattern-cards': 'repeating-linear-gradient(45deg, #000 0px, #000 10px, #DC143C 10px, #DC143C 20px)',
        'pattern-dice': 'radial-gradient(circle, #FFF 3px, transparent 3px)',
        'pattern-roulette': 'conic-gradient(#000 0deg, #DC143C 18deg, #000 36deg, #DC143C 54deg, #000 72deg, #DC143C 90deg)',
      },
      
      // ANIMAÇÕES BRUTALIST
      animation: {
        'neon-flicker': 'neonFlicker 1.5s infinite alternate',
        'brutal-shake': 'brutalShake 0.5s ease-in-out',
        'vegas-spin': 'vegasSpin 2s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'chip-flip': 'chipFlip 0.8s ease-in-out',
        'card-deal': 'cardDeal 0.6s ease-out',
        'roulette-spin': 'rouletteSpin 3s ease-out',
        'dice-roll': 'diceRoll 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'neon-glow': 'neonGlow 2s ease-in-out infinite alternate',
        'brutal-bounce': 'brutalBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      
      keyframes: {
        neonFlicker: {
          '0%, 100%': { 
            opacity: '1',
            filter: 'brightness(1) blur(0px)',
            textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor'
          },
          '50%': { 
            opacity: '0.8',
            filter: 'brightness(1.2) blur(1px)',
            textShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor'
          },
        },
        brutalShake: {
          '0%, 100%': { transform: 'translate(0)' },
          '10%': { transform: 'translate(-2px, -2px)' },
          '20%': { transform: 'translate(2px, -2px)' },
          '30%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(2px, 2px)' },
          '50%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, -2px)' },
          '70%': { transform: 'translate(-2px, 2px)' },
          '80%': { transform: 'translate(2px, 2px)' },
          '90%': { transform: 'translate(-2px, -2px)' },
        },
        vegasSpin: {
          '0%': { 
            transform: 'rotate(0deg) scale(1)',
            filter: 'hue-rotate(0deg)'
          },
          '50%': { 
            transform: 'rotate(180deg) scale(1.1)',
            filter: 'hue-rotate(180deg)'
          },
          '100%': { 
            transform: 'rotate(360deg) scale(1)',
            filter: 'hue-rotate(360deg)'
          },
        },
        chipFlip: {
          '0%': { transform: 'perspective(1000px) rotateY(0deg)' },
          '50%': { transform: 'perspective(1000px) rotateY(90deg) scale(1.1)' },
          '100%': { transform: 'perspective(1000px) rotateY(180deg)' },
        },
        cardDeal: {
          '0%': { 
            transform: 'translateX(-100vw) rotate(-45deg)',
            opacity: '0'
          },
          '70%': { 
            transform: 'translateX(20px) rotate(5deg)',
            opacity: '1'
          },
          '100%': { 
            transform: 'translateX(0) rotate(0deg)',
            opacity: '1'
          },
        },
        rouletteSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '90%': { transform: 'rotate(1800deg)' },
          '100%': { transform: 'rotate(1845deg)' },
        },
        neonGlow: {
          '0%': { 
            boxShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
            transform: 'scale(1)'
          },
          '100%': { 
            boxShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
            transform: 'scale(1.02)'
          },
        },
        brutalBounce: {
          '0%': { transform: 'translateY(0) scale(1)' },
          '30%': { transform: 'translateY(-10px) scale(1.05)' },
          '50%': { transform: 'translateY(-5px) scale(1.02)' },
          '70%': { transform: 'translateY(-2px) scale(1.01)' },
          '100%': { transform: 'translateY(0) scale(1)' },
        },
      },
      
      // BORDAS BRUTALIST
      borderWidth: {
        'brutal': '4px',
        'mega': '6px',
        'ultra': '8px',
      },
      
      // ESPAÇAMENTOS ASSIMÉTRICOS  
      spacing: {
        'brutal-1': '6px',
        'brutal-2': '14px', 
        'brutal-3': '22px',
        'brutal-4': '34px',
        'brutal-5': '50px',
        'asymmetric-1': '7px',
        'asymmetric-2': '13px',
        'asymmetric-3': '21px',
      }
    },
  },
  plugins: [
    // Utilitários customizados
    function({ addUtilities }) {
      addUtilities({
        // Textos neon
        '.text-neon': {
          animation: 'neonGlow 2s ease-in-out infinite alternate',
        },
        '.text-neon-pink': {
          color: '#FF007F',
          textShadow: '0 0 10px #FF007F, 0 0 20px #FF007F, 0 0 30px #FF007F',
        },
        '.text-neon-lime': {
          color: '#00FF41', 
          textShadow: '0 0 10px #00FF41, 0 0 20px #00FF41, 0 0 30px #00FF41',
        },
        '.text-neon-cyan': {
          color: '#00FFFF',
          textShadow: '0 0 10px #00FFFF, 0 0 20px #00FFFF, 0 0 30px #00FFFF',
        },
        
        // Brutalist effects
        '.brutal-transform': {
          transform: 'rotate(-1deg) skew(-2deg)',
        },
        '.brutal-hover:hover': {
          animation: 'brutalShake 0.5s ease-in-out',
        },
        
        // Chip effects
        '.chip-3d': {
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.3) 0%, transparent 70%)',
          position: 'relative',
        },
        '.chip-3d::before': {
          content: '""',
          position: 'absolute',
          top: '10%',
          left: '10%',
          right: '10%', 
          bottom: '10%',
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.8) 0%, transparent 50%)',
          borderRadius: 'inherit',
        },
        
        // Vegas glow
        '.vegas-glow': {
          filter: 'drop-shadow(0 0 10px currentColor) drop-shadow(0 0 20px currentColor)',
        },
        
        // Glass effects coloridos
        '.glass-neon': {
          background: 'rgba(255, 0, 127, 0.1)',
          backdropFilter: 'blur(10px) saturate(200%)',
          border: '2px solid rgba(255, 0, 127, 0.3)',
        },
        '.glass-gold': {
          background: 'rgba(255, 215, 0, 0.1)',
          backdropFilter: 'blur(10px) saturate(200%)',
          border: '2px solid rgba(255, 215, 0, 0.3)',
        },
      })
    }
  ],
  darkMode: 'class',
}