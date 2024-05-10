import React, { ReactNode } from 'react'

type Props = {
    children: ReactNode;
}

function WizardLayout({children}: Props) {
  return (
    <div className='relative flex min-h-screen w-full flex-col items-center justify-center'>
        {children}
    </div>
  )
}

export default WizardLayout