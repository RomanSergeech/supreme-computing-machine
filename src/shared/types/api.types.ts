import { TBucketDocument, TEventDocument, TWorkerDocument } from "./gfps.types"
import { TUser } from "./user.types"

export type TRegisterRequest = FormData
export type TRegisterResponse = {
  u_id: number
  'email status': boolean
}

export type TLoginRequest = FormData
export type TLoginResponse = {
  auth_hash: string
  auth_user: TUser
}

export type TGetUserRequest = {
  token: string
  u_hash: string
}
export type TGetUserResponse = {
  auth_user: TUser
}

export type TEditUserRequest = Partial<TUser> & {
  token: string
  u_hash: string
}
export type TEditUserResponse = {
  
}

export type TGetUserSubscriptionResponse = {
  data: {
    subscription: any[]
  }
}

export type TCreateSubscriptionRequest = {
  tariff: string
}
export type TCreateSubscriptionResponse = {
  data: {
    subs_id: string
  }
}

export type TCreatePaymentRequest = {
  subs_id: string
  sum: string
  currency?: string
  payment_service?: string
}
export type TCreatePaymentResponse = {
  confirmation_url: string
  p_id: number
}

export type TGetManagerWorkersRequest = {
  team_id: number
}
export type TGetManagerWorkersResponse = {
  data: {
    workers: TWorkerDocument[]
  }
}

export type TgetManagerBucketsRequest = {
  users: number[]
  team_id: number
}
export type TGetManagerBucketsResponse = {
  data: {
    buckets: Record<number, {
      [hash: string]: TBucketDocument
    }>
  }
}

export type TGetManagerBucketsEventsRequest = {
  buckets: string[]
  limit?: number
  start?: Date
  end?: Date
}
export type TGetManagerBucketsEventsResponse = {
  data: {
    events: {
      [hash: string]: TEventDocument[]
    }
  }
}
