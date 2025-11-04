import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import ApiService from '../api/ibronevik.service'
import { tryCatch } from '../utils/tryCatch'
import { TLoginRequest, TLoginResponse, TRegisterRequest, TRegisterResponse } from '../types/api.types'
import { useUserStore } from './user.store'

interface TState {
  
}

interface TStore extends TState {
  register: ( formData: TRegisterRequest ) => Promise<void>
  login: ( formData: TLoginRequest ) => Promise<void>
  logout: () => void
}

const initialState: TState = {
  
}

export const useAuthStore = create(
  devtools<TStore>((set) => ({
    ...initialState,

    register: ( formData ) => tryCatch({
      callback: async () => {

        const { data } = await ApiService.register(formData)

      }
    }),

    login: ( formData ) => tryCatch({
      callback: async () => {

        const { data } = await ApiService.login(formData)

        const res = await ApiService.token(data.auth_hash)

        useUserStore.getState().saveUserData(data.auth_user)

        localStorage.setItem('token', res.data.data.token)
        localStorage.setItem('u_hash', res.data.data.u_hash)
      }
    }),

    logout: () => {
      localStorage.removeItem('token')
      localStorage.removeItem('u_hash')
      window.location.replace('/');
    },

  }))
)
