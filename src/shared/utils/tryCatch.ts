import { AxiosError } from "axios"
import { TError } from "../api/ibronevik.service"

type TProps<T> = {
  callback: () => Promise<T>
  onError?: ( err: TError ) => void
  onFinally?: () => void
}

export const tryCatch = async <T = void>({ callback, onError, onFinally }: TProps<T>) => {
  try {
    return await callback()
  }
  catch (err) {

    console.log(err);

    const msg = err instanceof AxiosError
    ? err.response?.data
    : err

    onError?.(msg)

    throw msg
  }
  finally {
    onFinally?.()
  }
}