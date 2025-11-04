"use client"

import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from "react"
import { useUserStore } from "@/shared/store/user.store"

interface PrivateRouteProps {
  children: ReactNode
}
const PrivateRoute = ({ children }: PrivateRouteProps) => {

  const user = useUserStore(state => state)

  const router = useRouter()

  useEffect(() => {
    if ( user.u_id === '' ) {
      router.push('/')
    }
  }, [user])

  if ( !user.u_id ) {
    return <></>
  }

  return (
    <>
      {children}
    </>
  )
}

export { PrivateRoute }