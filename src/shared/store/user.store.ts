import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { TSubscription, TUser, TUserDetails } from '../types/user.types'
import { tryCatch } from '../utils'
import ApiService from '../api/ibronevik.service'
import { TCreatePaymentRequest, TCreateSubscriptionRequest, TEditUserRequest } from '../types/api.types'
import { useAuthStore } from './auth.store'


const DETAILS = [
  {
      "name": [
          "Work"
      ],
      "rule": {
          "type": "regex",
          "regex": "Google Docs|libreoffice|ReText"
      },
      "data": {
          "color": "#0F0",
          "score": 10
      },
      eff_typ: 'productive'
  },
  {
      "name": [
          "Work",
          "Programming"
      ],
      "rule": {
          "type": "regex",
          "regex": "GitHub|Stack Overflow|BitBucket|Gitlab|vim|Spyder|kate|Ghidra|Scite"
      },
      eff_typ: 'productive'
  },
  {
      "name": [
          "Work",
          "Programming",
          "ActivityWatch"
      ],
      "rule": {
          "type": "regex",
          "regex": "ActivityWatch|aw-",
          "ignore_case": true
      },
      eff_typ: 'neutral'
  },
  {
      "name": [
          "Work",
          "Image"
      ],
      "rule": {
          "type": "regex",
          "regex": "GIMP|Inkscape"
      },
      eff_typ: 'productive'
  },
  {
      "name": [
          "Work",
          "Video"
      ],
      "rule": {
          "type": "regex",
          "regex": "Kdenlive"
      },
      eff_typ: 'productive'
  },
  {
      "name": [
          "Work",
          "Audio"
      ],
      "rule": {
          "type": "regex",
          "regex": "Audacity"
      },
      eff_typ: 'productive'
  },
  {
      "name": [
          "Work",
          "3D"
      ],
      "rule": {
          "type": "regex",
          "regex": "Blender"
      },
      eff_typ: 'productive'
  },
  {
      "name": [
          "Media"
      ],
      "rule": {
          "type": "none"
      },
      "data": {
          "color": "#F33"
      },
      eff_typ: 'distracting'
  },
  {
      "name": [
          "Media",
          "Games"
      ],
      "rule": {
          "type": "regex",
          "regex": "Minecraft|RimWorld"
      },
      "data": {
          "color": "#F80"
      },
      eff_typ: 'distracting'
  },
  {
      "name": [
          "Media",
          "Video"
      ],
      "rule": {
          "type": "regex",
          "regex": "YouTube|Plex|VLC"
      },
      "data": {
          "color": "#F33"
      },
      eff_typ: 'distracting'
  },
  {
      "name": [
          "Media",
          "Social Media"
      ],
      "rule": {
          "type": "regex",
          "regex": "reddit|Facebook|Twitter|Instagram|devRant",
          "ignore_case": true
      },
      "data": {
          "color": "#FCC400"
      },
      eff_typ: 'distracting'
  },
  {
      "name": [
          "Comms"
      ],
      "rule": {
          "type": "none"
      },
      "data": {
          "color": "#9FF"
      },
      eff_typ: 'distracting'
  },
  {
      "name": [
          "Comms",
          "IM"
      ],
      "rule": {
          "type": "regex",
          "regex": "Messenger|Telegram|Signal|WhatsApp|Rambox|Slack|Riot|Element|Discord|Nheko|NeoChat|Mattermost"
      },
      eff_typ: 'distracting'
  },
  {
      "name": [
          "Comms",
          "Email"
      ],
      "rule": {
          "type": "regex",
          "regex": "Gmail|Thunderbird|mutt|alpine"
      },
      eff_typ: 'distracting'
  },
  {
      "name": [
          "Uncategorized"
      ],
      "rule": {
          "type": null
      },
      "data": {
          "color": "#CCC"
      },
      eff_typ: 'neutral'
  }
] satisfies TUserDetails[]


interface TState extends TUser {
  subscription: TSubscription[]
}

interface TStore extends TState {
  saveUserData: ( user: TUser ) => void
  getUser: () => Promise<void>
  editUser: ( sendData: Partial<TUser>, u_id?: string ) => Promise<void>
  getUserSubscription: ( subs_id?: string ) => Promise<void>
  createSubscription: ( sendData: TCreateSubscriptionRequest, paymentData: Omit<TCreatePaymentRequest, 'subs_id'> ) => Promise<string>
  createPayment: ( sendData: TCreatePaymentRequest ) => Promise<string>
}

const initialState: TState = {
  u_id: '',
  u_email: '',
  u_name: '',
  u_family: '',
  u_role: '',
  u_phone: '',
  u_photo: '',
  u_city: '',
  subscription: [],
  u_details: null
}

export const useUserStore = create(
  devtools<TStore>((set, get) => ({
    ...initialState,

    saveUserData: ( user ) => {
      set({ ...user })
    },

    getUser: () => tryCatch({
      callback: async () => {

        const { data } = await ApiService.getUser()

        const user: TUser = {
          ...data.auth_user,
          u_details: DETAILS
        }

        console.log(user);

        set({ ...user })
      }
    }),

    editUser: ( sendData, u_id ) => tryCatch({
      callback: async () => {

        await ApiService.editUser(sendData, u_id)

        set({ ...sendData })
      }
    }),

    getUserSubscription: ( subs_id ) => tryCatch({
      callback: async () => {

        const u_id = get().u_id

        const { data } = await ApiService.getUserSubscription(u_id, subs_id)

        await ApiService.getPaymentsList()

        set({ subscription: data.data.subscription })
      }
    }),

    createSubscription: ( sendData, paymentData ) => tryCatch({
      callback: async () => {

        const res = await ApiService.createSubscription(sendData)

        const { data } = await ApiService.createPayment({
          ...paymentData,
          subs_id: res.data.data.subs_id
        })

        // set({ subscription: data.data.subscription })

        return data.data.confirmation_url
      }
    }),

    createPayment: ( sendData ) => tryCatch({
      callback: async () => {

        const { data } = await ApiService.createPayment(sendData)

        // set({ subscription: data.data.subscription })

        return data.data.confirmation_url
      }
    }),

  }))
)
