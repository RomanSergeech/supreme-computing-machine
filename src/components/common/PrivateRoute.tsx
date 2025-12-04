"use client"

import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from "react"
import { useUserStore } from "@/shared/store/user.store"

interface PrivateRouteProps {
  children: ReactNode
}
const PrivateRoute = ({ children }: PrivateRouteProps) => {

  const user = useUserStore(state => state.user)

  const router = useRouter()

  useEffect(() => {
    if ( user === null ) {
      router.push('/')
    }
  }, [user, router])

  if ( !user ) {
    return <></>
  }

  return (
    <>
      {children}
    </>
  )
}

export { PrivateRoute }