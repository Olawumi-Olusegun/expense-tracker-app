"use server"

import { Button } from '@/components/ui/button';
import prismaDb from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'
import CreateTransactionDialog from './_components/CreateTransactionDialog';

type Props = {}

async function page({}: Props) {
  const user = await currentUser();
  
  if(!user){
    return redirect("/sign-in")
  }

  const userSettings = await prismaDb.userSetings.findUnique({
    where: { userId: user.id }
  });

  if(!userSettings) {
    return redirect("/wizard");
  }

  return (
    <div className='h-full bg-background'>
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-6">
          <p className="text-2xl font-bold">
            Hello, {user.firstName}
          </p>
          
          <div className="flex items-center gap-3">
            <CreateTransactionDialog type='income' trigger={
              <Button variant="outline" className='border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white ' >
                New Income
              </Button>
            } />
            
            <CreateTransactionDialog type='expense' trigger={
              <Button variant="outline" className='border-rose-500 bg-rose-950 text-white hover:bg-rose-700 hover:text-white ' >
                New Expense
              </Button>
            } />

          </div>
        </div>
      </div>
    </div>
  )
}

export default page