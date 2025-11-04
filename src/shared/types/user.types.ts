
export type TUser = {
  u_id: string
  u_email: string
  u_name: string
  u_family: string | null
  u_role: string
  u_phone: string | null
  u_photo: string | null
  u_city: string | null
  u_details: TUserDetails[] | null
}

export type TUserDetails = {
  name: string[]
  rule: {
    type: 'regex'|'none'|null
    regex?: string
    ignore_case?: boolean
  }
  data?: {
    color: string
    score?: number
  }
  eff_typ: 'productive'|'neutral'|'distracting'
}

export type TSubscription = {
  u_id: string
  auto_renew: string
  cancellation_date: string
  end_date: string
  p_id: string | null
  paid: boolean
  start_date: string
  subs_id: string
  subs_status: string | null
  tariff: string
}