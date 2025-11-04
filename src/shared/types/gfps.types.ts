
export type TWorker = {
  id: number
}
export type TWorkerDocument = {
  id: number
  username: string
  uuid: string
  created: string
  data: {
    username: string
    uuid: string
  }
}

export type TBucket = {
  hash: string
  type: string
}
export type TBucketDocument = {
  id: string
  client: string
  hostname: string
  type: string
  data: {}
  created: string
}

export type TEvent = {
  id: number
  app: string
  title: string
  duration: number
}
export type TEventDocument = {
  id: number
  duration: number
  timestamp: string
  data: {
    app?: string
    title: string
    url: string
  }
}
