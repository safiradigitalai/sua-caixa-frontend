import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

// Tipos base
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

type LoadingSpinnerSize = 'sm' | 'md' | 'lg' | 'xl'
type ListSkeletonType = 'box' | 'item' | 'ganhador'

// Skeleton base
const Skeleton = ({ className, ...props }: SkeletonProps) => (
  <div
    className={cn("animate-pulse rounded-md bg-gray-700", className)}
    {...props}
  />
)

// Skeleton para BoxCard
interface BoxCardSkeletonProps {
  featured?: boolean
}

export const BoxCardSkeleton = ({ featured = false }: BoxCardSkeletonProps) => (
  <div className={cn(
    "bg-dark-50 border border-gray-700 rounded-2xl overflow-hidden",
    featured && "col-span-2"
  )}>
    {/* Image Skeleton */}
    <Skeleton className="w-full aspect-[4/3]" />
    
    {/* Content */}
    <div className="p-4 space-y-3">
      {/* Title */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      
      {/* Price */}
      <Skeleton className="h-6 w-24" />
      
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-dark-200/30 rounded-lg p-2">
          <Skeleton className="h-3 w-12 mb-1" />
          <Skeleton className="h-4 w-8" />
        </div>
        <div className="bg-dark-200/30 rounded-lg p-2">
          <Skeleton className="h-3 w-16 mb-1" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex gap-2">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 flex-2" />
      </div>
    </div>
  </div>
)

// Skeleton para ItemCard
interface ItemCardSkeletonProps {
  compact?: boolean
}

export const ItemCardSkeleton = ({ compact = false }: ItemCardSkeletonProps) => (
  <div className="bg-dark-50 border border-gray-700 rounded-xl overflow-hidden">
    {/* Image */}
    <Skeleton className={cn(
      "w-full",
      compact ? "aspect-square" : "aspect-[4/3]"
    )} />
    
    {/* Content */}
    <div className={cn("p-3 space-y-2", compact && "p-2")}>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-5 w-20" />
      
      {!compact && (
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-dark-200/30 rounded-lg p-2">
            <Skeleton className="h-3 w-full mb-1" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <div className="bg-dark-200/30 rounded-lg p-2">
            <Skeleton className="h-3 w-full mb-1" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      )}
    </div>
  </div>
)

// Skeleton para lista de ganhadores
export const GanhadorSkeleton = () => (
  <div className="flex items-center gap-3 p-3 bg-dark-50 rounded-lg border border-gray-700">
    <Skeleton className="w-12 h-12 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-48" />
    </div>
    <div className="text-right space-y-1">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-3 w-12" />
    </div>
  </div>
)

// Skeleton para página completa
interface PageSkeletonProps {
  title?: string
  showHeader?: boolean
}

export const PageSkeleton = ({ title, showHeader = true }: PageSkeletonProps) => (
  <div className="min-h-screen bg-dark-100">
    {showHeader && (
      <div className="p-4 border-b border-gray-700">
        <Skeleton className="h-8 w-48 mx-auto" />
      </div>
    )}
    
    <div className="container-mobile py-6 space-y-6">
      {title && <Skeleton className="h-10 w-64" />}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 6 }, (_, i) => (
          <BoxCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
)

// Skeleton para grid de caixas
interface CaixasGridSkeletonProps {
  count?: number
  featured?: number
}

export const CaixasGridSkeleton = ({ count = 6, featured = 1 }: CaixasGridSkeletonProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {Array.from({ length: count }, (_, i) => (
      <BoxCardSkeleton 
        key={i} 
        featured={i < featured}
      />
    ))}
  </div>
)

// Skeleton para transparência
export const TransparenciaSkeleton = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="text-center space-y-2">
      <Skeleton className="h-8 w-48 mx-auto" />
      <Skeleton className="h-4 w-64 mx-auto" />
    </div>
    
    {/* Stats */}
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="bg-dark-50 rounded-lg p-4">
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-6 w-20" />
        </div>
      ))}
    </div>
    
    {/* Items Grid */}
    <div>
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.from({ length: 4 }, (_, i) => (
          <ItemCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
)

// Loading com animação
interface LoadingSpinnerProps {
  size?: LoadingSpinnerSize
  className?: string
}

export const LoadingSpinner = ({ size = 'md', className = '' }: LoadingSpinnerProps) => {
  const sizes: Record<LoadingSpinnerSize, string> = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  return (
    <motion.div
      className={cn(
        "border-2 border-gray-600 border-t-gold-primary rounded-full",
        sizes[size],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  )
}

// Loading state para listas
interface ListLoadingSkeletonProps {
  count?: number
  type?: ListSkeletonType
  className?: string
}

export const ListLoadingSkeleton = ({ 
  count = 5, 
  type = 'box', 
  className = '' 
}: ListLoadingSkeletonProps) => (
  <div className={cn("space-y-4", className)}>
    {Array.from({ length: count }, (_, i) => {
      switch (type) {
        case 'item':
          return <ItemCardSkeleton key={i} />
        case 'ganhador':
          return <GanhadorSkeleton key={i} />
        case 'box':
        default:
          return <BoxCardSkeleton key={i} />
      }
    })}
  </div>
)

// Loading fullscreen
interface FullScreenLoadingProps {
  message?: string
}

export const FullScreenLoading = ({ message = 'Carregando...' }: FullScreenLoadingProps) => (
  <div className="fixed inset-0 bg-dark-100 flex flex-col items-center justify-center z-50">
    <div className="text-center">
      <LoadingSpinner size="xl" className="mb-4" />
      <p className="text-gray-400 text-lg font-medium">{message}</p>
    </div>
  </div>
)

export default Skeleton