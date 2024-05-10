import { Logo } from '@/components/Logo';
import React, { ReactNode } from 'react'

type Props = {
    children: ReactNode;
}

export default function AuthLayout({children}: Props) {
  return (
    <div className='relative flex min-h-screen flex-col items-center justify-center'>
        <div className='mt-12'>
          <Logo />
            {children}
        </div>
    </div>
  )
}