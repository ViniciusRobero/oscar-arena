'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const t = useTranslations('auth')
  const locale = useLocale()
  const router = useRouter()
  const { register: registerUser } = useAuth()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser(data.name, data.email, data.password)
      router.push(`/${locale}/dashboard`)
    } catch {
      setError('root', { message: t('registerError') })
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{t('registerTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">{t('name')}</Label>
            <Input id="name" type="text" autoComplete="name" {...register('name')} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">{t('email')}</Label>
            <Input id="email" type="email" autoComplete="email" {...register('email')} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">{t('password')}</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          {errors.root && <p className="text-sm text-destructive">{errors.root.message}</p>}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {t('register')}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {t('haveAccount')}{' '}
            <Link href={`/${locale}/login`} className="underline hover:text-foreground">
              {t('login')}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
