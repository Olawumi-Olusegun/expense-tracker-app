import Navbar from '@/components/Navbar';
import React, { ReactNode } from 'react'

type Props = {
    children: ReactNode;
}

function DashboardLayout({children}: Props) {
  return (
    <div className='relative flex min-h-screen mb-20 w-full flex-col'>
      <Navbar />
        <div className="w-full">
            {children}
        </div>
    </div>
  )
}

export default DashboardLayout