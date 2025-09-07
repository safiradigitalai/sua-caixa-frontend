/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 🎨 2025 CLEAN, BIG, CARTOON SYSTEM + LUXDROP
      colors: {
        // 2025 GAMING PALETTE - Inspired by Fortnite & Clash Royale
        gaming: {
          // Core Gaming Colors (Clash Royale inspired)
          primary: '#4A90E2',         // Bright gaming blue
          secondary: '#FFD700',       // Gold/yellow for important elements  
          success: '#7ED321',         // Bright green for success
          danger: '#FF3B30',          // Red for danger/rare items
          warning: '#FF9500',         // Orange for warnings
          
          // Card Rarities (Gaming standard)
          common: '#95A5A6',          // Gray for common
          uncommon: '#7ED321',        // Green for uncommon
          rare: '#4A90E2',            // Blue for rare
          epic: '#9B59B6',            // Purple for epic
          legendary: '#F39C12',       // Orange for legendary
          mythic: '#E74C3C',          // Red for mythic
          
          // Background System
          bg: '#0F1419',              // Dark gaming background
          surface: '#1A202C',         // Card/surface background
          elevated: '#2D3748',        // Elevated elements
          border: '#4A5568',          // Borders
          
          // Text System
          textPrimary: '#FFFFFF',     // Primary white text
          textSecondary: '#CBD5E0',   // Secondary light gray
          textMuted: '#A0AEC0',       // Muted text
          
          // Accent Colors (Fortnite inspired)
          accent1: '#00D4AA',         // Teal accent
          accent2: '#FF6B6B',         // Coral accent  
          accent3: '#4ECDC4',         // Mint accent
          accent4: '#45B7D1',         // Sky blue accent
          accent5: '#96CEB4',         // Sage green accent
        },
        // LUXDROP CORE COLORS - Sistema principal
        luxdrop: {
          lavender: '#e3e3fa',      // Textos principais
          lavenderGrey: '#a9abca',  // Textos secundários
          darkNight: '#16161b',     // Background escuro
          primaryBlue: '#22b5ff',   // Azul principal
          successGreen: '#65d83e',  // Verde sucesso
          boxesBlue: '#4fb7fb',     // Boxes gradient start
          boxesBlueEnd: '#1c67d7',  // Boxes gradient end
          battlesYellow: '#fbcd4f', // Battles gradient start
          battlesYellowEnd: '#c57f1e', // Battles gradient end
          rewardsPurple: '#a54ffb', // Rewards gradient start
          rewardsPurpleEnd: '#4c00b6', // Rewards gradient end
          background: '#21252e',    // Base background
          cardBg: '#1a1a20',       // Card background
          borderGrey: '#2e2f35',   // Border color
        },
        
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
      
      // TIPOGRAFIA GAMING - Inspired by Fortnite/Clash Royale
      fontFamily: {
        'gaming': ['Nunito', 'Inter', 'sans-serif'],           // Primary gaming font (similar to Clash Royale)
        'gaming-display': ['Fredoka One', 'Impact', 'cursive'], // Display font (similar to Fortnite headers)
        'gaming-ui': ['Roboto', 'system-ui', 'sans-serif'],    // UI elements font
        'gaming-mono': ['JetBrains Mono', 'monospace'],        // Monospace for stats
        
        // Legacy fonts
        'luxdrop': ['Heavitas', 'Impact', 'sans-serif'],      
        'luxdrop-display': ['Luckiest Guy', 'Impact', 'cursive'], 
        'brutalist': ['Impact', 'Arial Black', 'sans-serif'],
        'vegas': ['Times New Roman', 'serif'],
        'cyber': ['Courier New', 'monospace'],
        'display': ['Anton', 'Impact', 'sans-serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      
      fontSize: {
        // 2025 BIG TYPOGRAPHY SYSTEM - Clean & Impactful
        'hero': ['clamp(56px, 18vw, 160px)', { lineHeight: '0.75', letterSpacing: '-0.03em', fontWeight: '900' }],
        'big': ['clamp(40px, 12vw, 96px)', { lineHeight: '0.85', letterSpacing: '-0.02em', fontWeight: '800' }],
        'large': ['clamp(32px, 8vw, 72px)', { lineHeight: '0.9', letterSpacing: '-0.015em', fontWeight: '700' }],
        'display': ['clamp(28px, 7vw, 56px)', { lineHeight: '1.0', letterSpacing: '-0.01em', fontWeight: '600' }],
        'heading': ['clamp(24px, 6vw, 40px)', { lineHeight: '1.1', letterSpacing: '0em', fontWeight: '600' }],
        'subtitle': ['clamp(20px, 5vw, 32px)', { lineHeight: '1.2', letterSpacing: '0.01em', fontWeight: '500' }],
        'body': ['clamp(16px, 4vw, 20px)', { lineHeight: '1.4', letterSpacing: '0em', fontWeight: '400' }],
        'small': ['clamp(14px, 3.5vw, 16px)', { lineHeight: '1.3', letterSpacing: '0.005em', fontWeight: '400' }],
        
        // LEGACY SIZES - Manter compatibilidade
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
        // 2025 GAMING GRADIENTS - Fortnite & Clash Royale Inspired
        'gaming-primary': 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
        'gaming-secondary': 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        'gaming-success': 'linear-gradient(135deg, #7ED321 0%, #56C13C 100%)',
        'gaming-danger': 'linear-gradient(135deg, #FF3B30 0%, #DC2626 100%)',
        
        // Card Rarity Gradients (Gaming standard)
        'rarity-common': 'linear-gradient(135deg, #95A5A6 0%, #7F8C8D 100%)',
        'rarity-uncommon': 'linear-gradient(135deg, #7ED321 0%, #5CB85C 100%)', 
        'rarity-rare': 'linear-gradient(135deg, #4A90E2 0%, #2980B9 100%)',
        'rarity-epic': 'linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%)',
        'rarity-legendary': 'linear-gradient(135deg, #F39C12 0%, #E67E22 100%)',
        'rarity-mythic': 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)',
        
        // Gaming Accent Gradients (Fortnite style)
        'gaming-accent1': 'linear-gradient(135deg, #00D4AA 0%, #00BCD4 100%)',
        'gaming-accent2': 'linear-gradient(135deg, #FF6B6B 0%, #FF5722 100%)',
        'gaming-accent3': 'linear-gradient(135deg, #4ECDC4 0%, #26A69A 100%)',
        'gaming-accent4': 'linear-gradient(135deg, #45B7D1 0%, #2196F3 100%)',
        'gaming-accent5': 'linear-gradient(135deg, #96CEB4 0%, #4CAF50 100%)',
        
        // Gaming Background Gradients
        'gaming-bg': 'linear-gradient(135deg, #0F1419 0%, #1A202C 50%, #2D3748 100%)',
        'gaming-surface': 'linear-gradient(135deg, #1A202C 0%, #2D3748 100%)',
        
        // LUXDROP GRADIENTS - Sistema exato do clone
        'luxdrop-boxes': 'linear-gradient(284deg, #4fb7fb 0.8%, #1c67d7 102.01%)',
        'luxdrop-battles': 'linear-gradient(257deg, #fbcd4f -14.67%, #c57f1e 99.26%)',
        'luxdrop-rewards': 'linear-gradient(284deg, #a54ffb 0.8%, #4c00b6 102.01%)',
        'luxdrop-hero': 'linear-gradient(135deg, #1f2937 0%, #0f172a 50%, #1f2937 100%)',
        
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