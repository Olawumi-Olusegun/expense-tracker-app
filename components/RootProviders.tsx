"use client";

import React, { useState } from 'react'
import { ThemeProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import {QueryClient, QueryClientProvider, } from "@tanstack/react-query"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


const RootProviders = ({ children, ...props }: ThemeProviderProps) => {
  const [queryClient] = useState(() => new QueryClient({}))
  return (
    <>
    <QueryClientProvider client={queryClient}>
    <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        {...props}
        >
        {children}
    </ThemeProvider>
    <ReactQueryDevtools />
    </QueryClientProvider>
    </>
  )
}

export default RootProviders