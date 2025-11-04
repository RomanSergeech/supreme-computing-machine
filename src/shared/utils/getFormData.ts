
type TFormData<T> = {
  [Key in keyof T]: T[Key]
}

export const getFormData = <T extends Record<string, any>>( elem: HTMLFormElement ): TFormData<T> => {

  const formData = new FormData(elem)

  const data = [...formData]

  return data.reduce<any>((acc, arr) => {
    acc[arr[0]] = arr[1]
    return acc
  }, {})
}