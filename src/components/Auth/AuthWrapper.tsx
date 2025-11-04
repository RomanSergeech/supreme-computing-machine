"use client"

import { useRouter } from "next/navigation"
import { ReactNode, useEffect } from "react"
import { useUserStore } from "@/shared/store/user.store"
import { useStaticStore } from "@/shared/store/static.store"

const AuthWrapper = ({ children }: { children: ReactNode }) => {

  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if ( token ) {
      useUserStore.getState().getUser()
        .then(() => {
          router.push('/office')
        })
    }

    useStaticStore.getState().getSiteStatic()

  }, [])

  return children
}

export { AuthWrapper }