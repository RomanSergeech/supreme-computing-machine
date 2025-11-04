
export type TTopApp = {
  id: number
  name: string
  title: string
  users: number[]
  duration: number
  productivity: 'productive'|'neutral'|'distracting'
}

export type TTopSite = {
  id: number
  name: string
  title: string
  visits: { [user_id: number]: number }
  duration: number
  productivity: 'productive'|'neutral'|'distracting'
}
