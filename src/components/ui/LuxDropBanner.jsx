import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const LuxDropBanner = ({ 
  type = 'boxes', 
  title, 
  description, 
  icon: Icon,
  to = '/',
  buttonText = 'EXPLORAR AGORA'
}) => {
  const bannerClasses = {
    boxes: 'landing-promotions boxesBanner',
    battles: 'landing-promotions battlesBanner', 
    rewards: 'landing-promotions rewardsBanner'
  }

  const iconColors = {
    boxes: 'text-blue-100',
    battles: 'text-yellow-100',
    rewards: 'text-purple-100'
  }

  const buttonStyles = {
    boxes: 'bg-white text-blue-600 hover:bg-blue-50',
    battles: 'bg-white text-yellow-600 hover:bg-yellow-50',
    rewards: 'bg-white text-purple-600 hover:bg-purple-50'
  }

  const arrowBgColors = {
    boxes: 'bg-blue-600',
    battles: 'bg-yellow-600', 
    rewards: 'bg-purple-600'
  }

  return (
    <motion.div 
      className={bannerClasses[type]}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="landing-promotions-content p-6 relative z-10">
        <div className="flex items-center gap-4 mb-4">
          {Icon && (
            <div className="landing-promotions-icon">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Icon className={`w-10 h-10 ${iconColors[type]}`} />
              </div>
            </div>
          )}
          <div>
            <h3 className="landing-promotions-title text-white font-luxdrop font-bold text-2xl md:text-3xl mb-2 uppercase">
              {title}
            </h3>
            <p className="landing-promotions-text text-white/90">
              {description}
            </p>
          </div>
        </div>
        
        <Link 
          to={to} 
          className={`landing-top-banners-item-btn ${buttonStyles[type]} inline-flex items-center gap-3 px-6 py-3 rounded font-medium transition-all hover:transform hover:scale-105`}
        >
          <span className="font-medium">{buttonText}</span>
          <div className={`landing-promotions-arrow-wrapper p-2 rounded-lg ${arrowBgColors[type]}`}>
            <ArrowRight className="w-4 h-4 text-white transform rotate-180" />
          </div>
        </Link>
      </div>
    </motion.div>
  )
}

export default LuxDropBanner