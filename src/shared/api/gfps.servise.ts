import axios, { AxiosResponse } from "axios"
import { TGetManagerBucketsEventsRequest, TGetManagerBucketsEventsResponse, TgetManagerBucketsRequest, TGetManagerBucketsResponse, TGetManagerWorkersRequest, TGetManagerWorkersResponse } from "../types/api.types"

const API_URL = 'http://188.225.44.153:5700/api/1'

const $api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  headers: {
    "Content-Type": 'application/x-www-form-urlencoded'
  }
})

export type TError = {
  message: string
  errors: Record<string, string[]>
  status: number
}

const checkError = <T>( res: AxiosResponse<T> ): AxiosResponse<T> => {
  const data = res.data as any
  if ( data?.status === 'error' ) {
    throw data
  }
  return res
}

class ApiService {

  async getManagerWorkers({ team_id }: TGetManagerWorkersRequest) {
    return checkError(await $api.post<TGetManagerWorkersResponse>('/manager/workers', {
      token: localStorage.getItem('token'),
      u_hash: localStorage.getItem('u_hash'),
      data: JSON.stringify({
        team_id
      })
    }))
  }

  async getManagerBuckets({ users, team_id }: TgetManagerBucketsRequest) {
    return checkError(await $api.post<TGetManagerBucketsResponse>('/manager/buckets', {
      token: localStorage.getItem('token'),
      u_hash: localStorage.getItem('u_hash'),
      data: JSON.stringify({
        users,
        team_id
      })
    }))
  }

  async getManagerBucketsEvents({ buckets, start, end, limit }: TGetManagerBucketsEventsRequest) {
    return checkError(await $api.post<TGetManagerBucketsEventsResponse>('/manager/buckets/events', {
      token: localStorage.getItem('token'),
      u_hash: localStorage.getItem('u_hash'),
      data: JSON.stringify({
        buckets,
        start, end, limit
      })
    }))
  }

}

const GFPSApiService = new ApiService()

export { GFPSApiService }