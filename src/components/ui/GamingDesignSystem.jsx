import React from 'react'
import { Crown, Trophy, Zap, Shield, Gift, Users, Star } from 'lucide-react'
import GamingCard from './GamingCard'
import GamingContainer from './GamingContainer'
import GamingButton from './GamingButton'

/**
 * GamingDesignSystem - Showcase do DNA visual dos Gaming Banners
 * Demonstra a aplicação consistente da estética gaming
 */

const GamingDesignSystem = () => {
  return (
    <div className="space-y-12 p-8 bg-luxdrop-background min-h-screen">
      
      {/* System Overview */}
      <GamingContainer
        variant="dark"
        headerTitle="Gaming Design System"
        headerSubtitle="DNA visual baseado nos Gaming Banners"
        headerIcon={Crown}
        borderStyle="glow"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Paleta de Cores */}
          <GamingCard
            variant="primary"
            title="Primary Blue"
            subtitle="Boxes & Tech"
            description="Usado para elementos principais como caixas e tecnologia"
            icon={Crown}
            badge="COR PRIMÁRIA"
            size="auto"
          />
          
          <GamingCard
            variant="secondary"
            title="Secondary Gold"
            subtitle="Battles & Action"
            description="Elementos de ação, battles e destaque premium"
            icon={Zap}
            badge="COR SECUNDÁRIA"
            size="auto"
          />
          
          <GamingCard
            variant="accent"
            title="Accent Purple"
            subtitle="Rewards & Premium"
            description="Recompensas, elementos premium e destaque especial"
            icon={Trophy}
            badge="COR DE DESTAQUE"
            size="auto"
          />
          
        </div>
      </GamingContainer>

      {/* Component Showcase */}
      <GamingContainer
        variant="glass"
        headerTitle="Component Library"
        headerSubtitle="Componentes com estética gaming consistente"
        headerIcon={Star}
      >
        
        {/* Gaming Cards Variants */}
        <div className="space-y-8">
          
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Gaming Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <GamingCard
                variant="success"
                title="Win Rate"
                subtitle="87% Success"
                icon={Shield}
                stats="4.8/5"
                size="sm"
              />
              
              <GamingCard
                variant="danger" 
                title="Alert Status"
                subtitle="Attention Required"
                icon={Trophy}
                badge="URGENTE"
                size="sm"
              />
              
              <GamingCard
                variant="primary"
                title="Interactive"
                subtitle="Click to interact"
                icon={Gift}
                onClick={() => alert('Gaming Card clicked!')}
                size="sm"
              />
              
              <GamingCard
                variant="accent"
                title="Link Card"
                subtitle="External link"
                icon={Users}
                href="https://suacaixa.app"
                size="sm"
              />
              
            </div>
          </div>

          {/* Gaming Buttons */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Gaming Buttons</h3>
            <div className="flex flex-wrap gap-4">
              
              <GamingButton variant="primary" size="default" arrowAnimation>
                ABRIR CAIXA
              </GamingButton>
              
              <GamingButton variant="secondary" icon={Trophy} iconPosition="left">
                VER PRÊMIOS
              </GamingButton>
              
              <GamingButton variant="accent" size="lg">
                BATTLE ROYALE
              </GamingButton>
              
              <GamingButton variant="success" icon={Shield}>
                VERIFICAR
              </GamingButton>
              
              <GamingButton variant="ghost" size="sm">
                CANCELAR
              </GamingButton>
              
              <GamingButton variant="outline" loading>
                CARREGANDO...
              </GamingButton>
              
            </div>
          </div>

          {/* Gaming Containers */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Gaming Containers</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <GamingContainer variant="primary" borderStyle="thick">
                <div className="text-center py-8">
                  <Crown className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h4 className="text-white font-bold text-xl mb-2">Container Primário</h4>
                  <p className="text-white/70">Estética baseada nos Gaming Banners com partículas e efeitos</p>
                </div>
              </GamingContainer>
              
              <GamingContainer 
                variant="secondary" 
                headerTitle="Stats Container"
                headerIcon={Trophy}
                headerActions={
                  <GamingButton variant="ghost" size="sm">
                    Ver Mais
                  </GamingButton>
                }
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Vitórias</span>
                    <span className="text-yellow-400 font-bold">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Taxa de Sucesso</span>
                    <span className="text-yellow-400 font-bold">87%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Ranking</span>
                    <span className="text-yellow-400 font-bold">#42</span>
                  </div>
                </div>
              </GamingContainer>
              
            </div>
          </div>
        </div>
        
      </GamingContainer>

      {/* Design Principles */}
      <GamingContainer
        variant="accent"
        headerTitle="Design Principles"
        headerSubtitle="Fundamentos da estética gaming"
        headerIcon={Shield}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg">🎯 Elementos Core</h4>
            <ul className="space-y-2 text-white/80">
              <li>• <strong>Bordas Arredondadas:</strong> rounded-3xl para suavidade</li>
              <li>• <strong>Gradientes Profundos:</strong> Múltiplas camadas de cor</li>
              <li>• <strong>Particles System:</strong> Pontos animados para vida</li>
              <li>• <strong>Light Sweep:</strong> Efeito cinematográfico no hover</li>
              <li>• <strong>Corner Accents:</strong> Cantos decorativos em L</li>
              <li>• <strong>Glassmorphism:</strong> backdrop-blur para profundidade</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg">⚡ Animações</h4>
            <ul className="space-y-2 text-white/80">
              <li>• <strong>Spring Physics:</strong> stiffness: 300-400</li>
              <li>• <strong>Micro Interactions:</strong> Scale 1.02 no hover</li>
              <li>• <strong>Sequenced Delays:</strong> Cascata temporal</li>
              <li>• <strong>Breathing Effect:</strong> Pulsação suave</li>
              <li>• <strong>Icon Rotation:</strong> 12° para dinamismo</li>
              <li>• <strong>Glow Transitions:</strong> Shadow intensity</li>
            </ul>
          </div>
          
        </div>
      </GamingContainer>

      {/* Usage Examples */}
      <GamingContainer
        variant="glass"
        headerTitle="Exemplos Práticos"
        headerSubtitle="Como aplicar o design system"
        borderStyle="minimal"
      >
        
        {/* Dashboard Example */}
        <div className="space-y-6">
          <h4 className="text-white font-bold text-lg">Dashboard Gaming</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <GamingCard
              variant="primary"
              title="Caixas"
              subtitle="Disponíveis"
              icon={Gift}
              stats="24"
              size="sm"
            />
            
            <GamingCard
              variant="secondary"
              title="Battles"
              subtitle="Online"
              icon={Zap}
              stats="127"
              size="sm"
            />
            
            <GamingCard
              variant="success"
              title="Win Rate"
              subtitle="Taxa Sucesso"
              icon={Trophy}
              stats="87%"
              size="sm"
            />
            
            <GamingCard
              variant="accent"
              title="Rewards"
              subtitle="Total"
              icon={Crown}
              stats="R$89K"
              size="sm"
            />
          </div>
          
          <div className="flex gap-4 justify-center">
            <GamingButton variant="primary" size="lg" arrowAnimation>
              ABRIR CAIXA PREMIUM
            </GamingButton>
            <GamingButton variant="outline">
              Ver Transparência
            </GamingButton>
          </div>
        </div>
        
      </GamingContainer>

    </div>
  )
}

export default GamingDesignSystem