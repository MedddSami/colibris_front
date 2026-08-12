import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  const baseStyles =
    'font-semibold rounded-md transition-all duration-200 flex items-center justify-center gap-2'

  const variantStyles = {
    primary:
      'bg-primary text-on-primary hover:shadow-[0_0_20px_rgba(0,167,117,0.4)] shadow-soft',

    secondary:
      'border-2 border-secondary text-secondary bg-transparent hover:bg-surface-container-low transition-colors',

    tertiary:
      'text-primary font-bold hover:bg-primary/5 px-4',

    outline:
      'border-2 border-outline-variant/20 text-on-surface hover:bg-surface-container-low',
  }

  const sizeStyles = {
    sm: 'px-4 py-2 text-label-md',
    md: 'px-6 py-3 text-body-lg font-bold',
    lg: 'px-8 py-4 text-title-lg',
  }

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
