import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'filled' | 'outlined'
  children: React.ReactNode
}

export function Card({
  variant = 'elevated',
  className = '',
  children,
  ...props
}: CardProps) {
  const baseStyles = 'rounded-md p-6'

  const variantStyles = {
    elevated: 'bg-surface-container-lowest shadow-soft',
    filled: 'bg-surface-container-low',
    outlined: 'bg-surface-container-high',
  }

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </div>
  )
}
