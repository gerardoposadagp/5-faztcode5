"use client"

import { SWRConfig } from "swr"
import type React from "react"

interface SWRProviderProps {
  children: React.ReactNode
}

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={
        {
          // Optional: Configure global SWR options here
          // For example, you can set a default staleTime for all SWR hooks
          // staleTime: 5 * 60 * 1000, // 5 minutes
          // revalidateOnFocus: true,
          // revalidateOnReconnect: true,
          // onError: (err, key) => {
          //   console.error("SWR Error:", err, key);
          // },
        }
      }
    >
      {children}
    </SWRConfig>
  )
}
