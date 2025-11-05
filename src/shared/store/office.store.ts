import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { tryCatch } from '../utils'
import { GFPSApiService } from '../api/gfps.servise'
import { TBucket, TEvent, TEventDocument } from '../types/gfps.types'
import { TTopApp, TTopSite } from '../types/office.types'
import { useUserStore } from './user.store'
import { TUserDetails } from '../types/user.types'
import { TGetManagerBucketsEventsRequest } from '../types/api.types'


interface TState {
  queryEvents: {
    start: Date | undefined
    end: Date | undefined
  }
  commonTime: number
  topApps: TTopApp[]
  topSites: TTopSite[]
  productiveTime: number
  averageProductivity: number
  averageDistracting: number
  averageNeutral: number
}

interface TStore extends TState {
  getOverviewData: () => Promise<void>
}

const initialState: TState = {
  queryEvents: { start: undefined, end: undefined },
  commonTime: 0,
  topApps: [],
  topSites: [],
  productiveTime: 0,
  averageProductivity: 0,
  averageDistracting: 0,
  averageNeutral: 0,
}

export const useOfficeStore = create(
  devtools<TStore>((set, get) => ({
    ...initialState,

    getOverviewData: () => tryCatch({
      callback: async () => {

        const workersRes = await GFPSApiService.getManagerWorkers({ team_id: 92 })

        // const workersDoc = workersRes.data.data.workers

        // const { commonTime, topApps, topSites, productiveTime, distractingTime, neutralTime } = await new Promise<{ commonTime: number, topApps: TTopApp[], topSites: TTopSite[], productiveTime: number, distractingTime: number, neutralTime: number }>((resolve) => {
        //   let commonTime = 0
        //   let topApps: TTopApp[] = []
        //   let topSites: TTopSite[] = []
        //   let productiveTime = 0
        //   let distractingTime = 0
        //   let neutralTime = 0

        //   workersDoc.forEach(async (worker) => {

        //     const bucketsRes = await GFPSApiService.getManagerBuckets({ users: [worker.id], team_id: 92 })

        //     const query: TGetManagerBucketsEventsRequest = {
        //       buckets: Object.keys(bucketsRes.data.data.buckets[worker.id])
        //     }

        //     const queryEvents = get().queryEvents
        //     if ( queryEvents.start && queryEvents.end ) {
        //       query.start = queryEvents.start
        //       query.end = queryEvents.end
        //       query.limit = -1
        //     }

        //     console.log(query);
        //     const eventsRes = await GFPSApiService.getManagerBucketsEvents(query)

        //     const bucketsDoc = bucketsRes.data.data.buckets
        //     const eventsDoc = eventsRes.data.data.events
    
        //     const bucketsObj = bucketsDoc[worker.id]
        //     const buckets: TBucket[] = []

        //     for ( const key in bucketsObj ) {
        //       const bucketEl = bucketsObj[key]
        //       if ( bucketEl.type !== 'afkstatus' ) {
        //         buckets.push({
        //           type: bucketEl.type,
        //           hash: key
        //         })
        //       }
        //     }

        //     const details = useUserStore.getState().u_details

        //     const categorisedAppsObj = details?.reduce<Record<string, { name: string, productivity: TUserDetails['eff_typ'] }[]>>((acc, detail) => {
        //       buckets.forEach(el => {
        //         const events = eventsDoc[el.hash]
        //         events.forEach(ev => {
        //           if ( ev.data.app ) {
        //             const reg = new RegExp(detail.rule.regex?.toLocaleLowerCase() || '""')
        //             const title = ev.data.title.toLocaleLowerCase()
        //             const name = ev.data.app!.toLocaleLowerCase()
        //             let productivity = null
        //             if ( reg.test(title) || reg.test(name) ) {
        //               productivity = detail.eff_typ
        //             }
        //             const key = detail.name.join('.')
        //             if ( !acc[key] ) {
        //               acc[key] = []
        //             }
        //             let appName = ev.data.app
        //             if ( !productivity ) {
        //               acc[key].push({
        //                 name: appName,
        //                 productivity: 'neutral'
        //               })
        //               return acc
        //             }
        //             appName = ev.data.title ? ev.data.app+' - '+ev.data.title : ev.data.app
        //             if ( acc[key].find(el => el.name === appName) ) {
        //               return acc
        //             }
        //             acc[key].push({
        //               name: appName,
        //               productivity
        //             })
        //           }
        //         })
        //       })
        //       return acc
        //     }, {})
        //     const categorisedApps = Object.values(categorisedAppsObj || {}).reduce((acc, curr) => acc.concat(curr), [])

        //     const categorisedSitesObj = details?.reduce<Record<string, { name: string, productivity: TUserDetails['eff_typ'] }[]>>((acc, detail) => {
        //       buckets.forEach(el => {
        //         const events = eventsDoc[el.hash]
        //         events.forEach(ev => {
        //           if ( ev.data.app === undefined ) {
        //             const parsedUrl = new URL(ev.data.url).hostname
        //             const reg = new RegExp(detail.rule.regex?.toLocaleLowerCase() || '""')
        //             const title = ev.data.title.toLocaleLowerCase()
        //             let productivity = null
        //             if ( reg.test(title) || reg.test(parsedUrl) ) {
        //               productivity = detail.eff_typ
        //             }
        //             const key = detail.name.join('.')
        //             if ( !acc[key] ) {
        //               acc[key] = []
        //             }
        //             let siteName = parsedUrl
        //             if ( !productivity ) {
        //               acc[key].push({
        //                 name: siteName,
        //                 productivity: 'neutral'
        //               })
        //               return acc
        //             }
        //             siteName = ev.data.title ? parsedUrl+' - '+ev.data.title : parsedUrl
        //             if ( acc[key].find(el => el.name === siteName) ) {
        //               return acc
        //             }
        //             acc[key].push({
        //               name: siteName,
        //               productivity
        //             })
        //           }
        //         })
        //       })
        //       return acc
        //     }, {})
        //     const categorisedSites = Object.values(categorisedSitesObj || {}).reduce((acc, curr) => acc.concat(curr), [])

        //     buckets.forEach(el => {
        //       const events = eventsDoc[el.hash]
        //       events.forEach(ev => {
        //         if ( ev.data.app ) {
        //           const appName = ev.data.title ? ev.data.app+' - '+ev.data.title : ev.data.app
        //           let productivity = categorisedApps.find(el => el.name === appName)
        //           if ( !productivity ) categorisedApps.find(el => el.name === ev.data.app)
        //           const topAppIndex = topApps.findIndex(el => el.name === (productivity?.name || ev.data.app))
        //           commonTime += ev.duration
        //           if ( !productivity || (productivity?.productivity === 'neutral') ) {
        //             neutralTime += ev.duration
        //           }
        //           if ( productivity?.productivity === 'productive' ) {
        //             productiveTime += ev.duration
        //           }
        //           if ( productivity?.productivity === 'distracting' ) {
        //             distractingTime += ev.duration
        //           }
        //           if ( topAppIndex === -1 ) {
        //             topApps.push({
        //               id: ev.id,
        //               name: productivity?.name || ev.data.app,
        //               title: ev.data.title,
        //               users: [worker.id],
        //               duration: Math.round(ev.duration),
        //               productivity: productivity?.productivity || "neutral"
        //             })
        //           } else {
        //             const topApp = topApps[topAppIndex]
        //             topApps[topAppIndex] = {
        //               ...topApp,
        //               duration: Math.round(topApp.duration + ev.duration),
        //               users: topApp.users.includes(worker.id) ? topApp.users : [...topApp.users, worker.id]
        //             }
        //           }
        //         } else {
        //           const parsedUrl = new URL(ev.data.url).hostname
        //           let siteName = ev.data.title ? parsedUrl+' - '+ev.data.title : parsedUrl
        //           let productivity = categorisedSites.find(el => el.name === siteName)
        //           if ( !productivity ) categorisedSites.find(el => el.name === parsedUrl)
        //           const topSiteIndex = topSites.findIndex(el => el.name === (productivity?.name || parsedUrl))
        //           commonTime += ev.duration
        //           if ( !productivity || (productivity?.productivity === 'neutral') ) {
        //             neutralTime += ev.duration
        //           }
        //           if ( productivity?.productivity === 'productive' ) {
        //             productiveTime += ev.duration
        //           }
        //           if ( productivity?.productivity === 'distracting' ) {
        //             distractingTime += ev.duration
        //           }
        //           if ( topSiteIndex === -1 ) {
        //             topSites.push({
        //               id: ev.id,
        //               name: productivity?.name || parsedUrl,
        //               title: ev.data.title,
        //               visits: { [worker.id]: 1 },
        //               duration: Math.round(ev.duration),
        //               productivity: productivity?.productivity || "neutral"
        //             })
        //           } else {
        //             const topSite = topSites[topSiteIndex]
        //             topSite.visits[worker.id] += 1
        //             topSites[topSiteIndex] = {
        //               ...topSite,
        //               duration: Math.round(topSite.duration + ev.duration),
        //               visits: topSite.visits
        //             }
        //           }
        //         }
        //       })
        //     })

        //     resolve({
        //       commonTime,
        //       topApps: topApps.sort((a, b) => b.duration - a.duration),
        //       topSites: topSites.sort((a, b) => b.duration - a.duration),
        //       productiveTime,
        //       distractingTime,
        //       neutralTime
        //     })
        //   })
        // })

        // set({
        //   commonTime: Math.round(commonTime),
        //   topApps,
        //   topSites,
        //   productiveTime: Math.round(productiveTime),
        //   averageProductivity: Math.round(productiveTime / commonTime * 100),
        //   averageDistracting: Math.round(distractingTime / commonTime * 100),
        //   averageNeutral: Math.round(neutralTime / commonTime * 100),
        // })
      }
    }),

  }))
)

function getTime( duration: number ) {
  const hours = Math.floor(duration / 3600)
  const minutes = Math.floor((duration % 3600) / 60)
  return `${hours}ч ${minutes}м`
}