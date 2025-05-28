// Simple toast hook implementation
import { useState } from 'react'

interface ToastProps {
  title: string
  description: string
  variant?: 'default' | 'destructive'
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = (props: ToastProps) => {
    setToasts((prev) => [...prev, props])
    
    // For now, we'll just log the toast to the console
    console.log(`Toast: ${props.title} - ${props.description}`)
    
    // In a real implementation, we would display a toast notification
    // and remove it after a timeout
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t !== props))
    }, 3000)
  }

  return { toast, toasts }
}
