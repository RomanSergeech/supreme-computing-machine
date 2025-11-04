import { ReactElement } from "react"
import { create } from "zustand"

export interface TAlert {
  text: string[]
	textBtn?: string,
  svg?: ReactElement | null
	fixed?: boolean
}

interface TState {
  svg: ReactElement | null
	text: string[]
	textBtn: string
	active: boolean | null
  //@ts-ignore
  timer: NodeJS.Timeout | null
	fixed: boolean
  blockSite: boolean
  onClickAction: () => void
}

interface TStore extends TState {
	activateAlert: ({ text, textBtn, fixed }: TAlert) => void
	closeAlert: () => void
}

const initialState: TState = {
  svg: null,
	text: [],
	textBtn: '',
	active: null,
  timer: null,
	fixed: false,
  blockSite: false,
  onClickAction: () => {}
}

export const useAlertStore = create<TStore>(
	(set) => ({
		...initialState,

		activateAlert: ( alertData ) => {
			set({
				...alertData,
				active: true
			})
		},

		closeAlert: () => {
			set({ active: false, fixed: false })
		}

	})
)