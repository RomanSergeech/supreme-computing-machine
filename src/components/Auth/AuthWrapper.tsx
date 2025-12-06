"use client"

import { usePathname, useRouter } from "next/navigation"
import { ReactNode, useEffect } from "react"
import { useUserStore } from "@/shared/store/user.store"
import { useStaticStore } from "@/shared/store/static.store"

const AuthWrapper = ({ children }: { children: ReactNode }) => {

  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')

    if ( token ) {
      useUserStore.getState().getUser()
        .then(() => {
          if ( pathname === '/' ) {
            router.push('/office')
          }
        })
    } else {
      router.push('/')
    }

    useStaticStore.getState().getSiteStatic()

  }, [router])

  return children
}

export { AuthWrapper }