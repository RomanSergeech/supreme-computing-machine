import axios, { AxiosResponse } from "axios"
import { TCreatePaymentRequest, TCreatePaymentResponse, TCreateSubscriptionRequest, TCreateSubscriptionResponse, TEditUserRequest, TEditUserResponse, TGetUserResponse, TGetUserSubscriptionResponse, TLoginRequest, TLoginResponse, TRegisterRequest, TRegisterResponse } from "../types/api.types"
import { TUser } from "../types/user.types"


const $api = axios.create({
  baseURL: 'https://ibronevik.ru/taxi/api/v1',
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

  async register( formData: TRegisterRequest ) {
    return checkError<TRegisterResponse>(await $api.post('/register', formData))
  }

  async login( formData: TLoginRequest ) {
    return checkError<TLoginResponse>(await $api.post('/auth', formData))
  }

  async token( auth_hash: string ) {
    return checkError(await $api.post('/token/authorized', { auth_hash }))
  }

  async getSiteStatic() {
    return checkError(await $api.get('/data'))
  }

  async getUser() {
    return checkError<TGetUserResponse>(await $api.post('/user', {
      token: localStorage.getItem('token'),
      u_hash: localStorage.getItem('u_hash')
    }))
  }

  async editUser( sendData: Partial<TUser>, u_id?: string ) {
    let req = '/user'
    if ( u_id ) req += `/${u_id}`

    return checkError<TEditUserResponse>(await $api.post(req, {
      data: JSON.stringify(sendData),
      token: localStorage.getItem('token'),
      u_hash: localStorage.getItem('u_hash')
    }))
  }

  async getUserSubscription( u_id?: string, subs_id?: string ) {
    const data: any = {
      token: localStorage.getItem('token'),
      u_hash: localStorage.getItem('u_hash')
    }
    if ( u_id ) data.u_id = u_id
    if ( subs_id ) data.subs_id = subs_id
    return checkError(await $api.post<TGetUserSubscriptionResponse>('/subscription/get', data))
  }

  async createSubscription( sendData: TCreateSubscriptionRequest ) {
    return checkError(await $api.post<TCreateSubscriptionResponse>('/subscription/create', {
      data: JSON.stringify(sendData),
      token: localStorage.getItem('token'),
      u_hash: localStorage.getItem('u_hash')
    }))
  }

  async createPayment( sendData: TCreatePaymentRequest ) {
    return checkError(await $api.post<{ data: TCreatePaymentResponse }>('/payment/create', {
      data: JSON.stringify(sendData),
      token: localStorage.getItem('token'),
      u_hash: localStorage.getItem('u_hash')
    }))
  }

  async getPaymentsList() {
    return checkError(await $api.post('/payment/get', {
      token: localStorage.getItem('token'),
      u_hash: localStorage.getItem('u_hash')
    }))
  }

}

export default new ApiService()