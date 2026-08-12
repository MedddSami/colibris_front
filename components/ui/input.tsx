import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'w-full bg-surface-container-high border-none px-4 py-3 text-body-lg rounded-sm transition-all duration-200 outline-none',
        'placeholder:text-on-surface-variant/50',
        'focus:ring-2 focus:ring-primary/20 focus:border-b-2 focus:border-primary',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
