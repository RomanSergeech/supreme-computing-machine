"use client"

import { useEffect, useState } from "react"
import { useAlertStore } from "@/shared/store/alert.store"
import { classNames } from "@/shared/utils"
import ReactDOM from "react-dom"

import c from './alert.module.css'

const Alert = () => {

	const store = useAlertStore()

	const [elClass, setElClass] = useState('')

	useEffect(() => {
		if (store.active && store.active !== null) {
			setElClass('_show')
		} else if (store.active !== null) {
			setElClass('_hide')
		}
	}, [store])

   const buttonHandler = () => {
      store.closeAlert()
      store.onClickAction()
   }

	return ReactDOM.createPortal(

		<div className={classNames(c.alert, elClass)} >

			{store.svg}

      {store.text.map(line => (
        <p key={line} >{line}</p>
      ))}

			{store.textBtn &&
				<button
          onClick={buttonHandler}
        >
          {store.textBtn}
        </button>
			}
      
		</div>

	, document?.body)
}

export { Alert }