import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { tryCatch } from '../utils'
import ApiService from '../api/ibronevik.service'
import { TSubscriptionStatuses, TTariffDurationClasses } from '../types/static.types'

interface TState {
  lang_vls: {
    [text_key: string]: {
      [lang: string]: string
    }
  },
  tariffs: Record<string, {
    price: string
    currency: string
    ru: string
    en: string
    duration_class: string
  }>,
  tariff_duration_classes: TTariffDurationClasses
  subscription_statuses: TSubscriptionStatuses
  payment_services: {
    [text_key: string]: {
      [lang: string]: string
    }
  }
}

interface TStore extends TState {
  getSiteStatic: () => Promise<void>
}

const initialState: TState = {
  lang_vls: {},
  tariffs: {},
  tariff_duration_classes: {},
  subscription_statuses: {},
  payment_services: {}
}

export const useStaticStore = create(
  devtools<TStore>((set) => ({
    ...initialState,

    getSiteStatic: () => tryCatch({
      callback: async () => {

        const { data } = await ApiService.getSiteStatic()

        set({ ...data.data.data })
      }
    }),

  }))
)
