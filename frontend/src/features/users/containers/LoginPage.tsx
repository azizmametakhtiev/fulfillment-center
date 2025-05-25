import LoginForm from '@/features/users/components/LoginForm.tsx'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks.ts'
import { selectUser } from '@/store/slices/authSlice.ts'
import { useEffect } from 'react'


const images = [
  '/assets/login/illustration-1.jpg',
  '/assets/login/illustration-2.jpg',
  '/assets/login/illustration-3.jpg',
  '/assets/login/illustration-4.jpg',
  '/assets/login/illustration-5.jpg',
]

export default function LoginPage() {
  const randomImage = images[Math.floor(Math.random() * images.length)]
  const user = useAppSelector(selectUser)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      if (user.role === 'stock-worker') {
        navigate('/tasks', { replace: true })
      } else {
        navigate('/admin', { replace: true })
      }
    }
  }, [user, navigate])

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex items-center gap-2 md:justify-start justify-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <img src="/logo-mini.png" alt="logo" className="h-5 w-5 object-contain" />
          </div>
          <div className="flex flex-col leading-none text-xs h-8 justify-center font-semibold space-y-[2px]">
            <span className="font-medium">Izzi Life</span>
            <span className="font-medium">Fulfillment</span>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src={randomImage}
          alt="Login illustration"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
