import React, { memo } from 'react'

interface PunjabLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const PunjabLogo = memo(function PunjabLogo({ size = 'md', className = '' }: PunjabLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center justify-center`}>
      {/* Punjab Government Emblem - Simplified SVG representation */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Circle */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="#FF6B35"
          stroke="#1B365D"
          strokeWidth="2"
        />
        
        {/* Inner Circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="#FFFFFF"
          stroke="#1B365D"
          strokeWidth="1"
        />
        
        {/* Khanda Symbol (Simplified) */}
        {/* Central Sword */}
        <rect
          x="48"
          y="20"
          width="4"
          height="60"
          fill="#1B365D"
          rx="2"
        />
        
        {/* Left Curved Sword */}
        <path
          d="M35 25 Q30 35 35 45 Q40 55 35 65 Q30 75 35 85"
          stroke="#1B365D"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Right Curved Sword */}
        <path
          d="M65 25 Q70 35 65 45 Q60 55 65 65 Q70 75 65 85"
          stroke="#1B365D"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Central Circle */}
        <circle
          cx="50"
          cy="50"
          r="8"
          fill="#FF6B35"
          stroke="#1B365D"
          strokeWidth="2"
        />
        
        {/* Top ornament */}
        <path
          d="M45 15 L50 10 L55 15 Z"
          fill="#1B365D"
        />
        
        {/* Bottom ornament */}
        <path
          d="M45 85 L50 90 L55 85 Z"
          fill="#1B365D"
        />
      </svg>
    </div>
  )
})

export default PunjabLogo

// Alternative text-based logo for fallback
export function PunjabTextLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-sm">ਪੰ</span>
      </div>
      <div className="text-orange-600 font-bold text-sm">
        Punjab Govt
      </div>
    </div>
  )
}
