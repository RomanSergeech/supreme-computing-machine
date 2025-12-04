import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { tryCatch } from '../utils'
import { GFPSApiService } from '../api/gfps.servise'
import ApiService from '../api/ibronevik.service'
import { TBucket, TEventDocument, TWorker, TWorkerDocument } from '../types/gfps.types'
import { TActivitySummary, TTopApp, TTopSite, TWorkerStats, TWorkerTopApp } from '../types/office.types'
import { useUserStore } from './user.store'
import { TUserDetails } from '../types/user.types'
import { TGetManagerBucketsEventsRequest, TGetManagerBucketsResponse } from '../types/api.types'


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
  workersOnline: number
  users: TWorkerStats[]
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
  workersOnline: 0,
  users: []
}

export const useOfficeStore = create(
  devtools<TStore>((set, get) => ({
    ...initialState,

    getOverviewData: () => tryCatch({
      callback: async () => {

        const workersRes = await GFPSApiService.getManagerWorkers({ team_id: 92 })

        const workersDoc = workersRes.data.data.workers

        let commonTime = 0
        let topApps: TTopApp[] = []
        let topSites: TTopSite[] = []
        const productiveTimes = {
          productive: 0,
          distracting: 0,
          neutral: 0
        }
        let workersOnline: Record<string, 1> = {}
        let users: TWorkerStats[] = []

        await new Promise((resolve) => {

          workersDoc.forEach(async (worker) => {

            const bucketsRes = await GFPSApiService.getManagerBuckets({ users: [worker.id], team_id: 92 })
            const bucketsObj = bucketsRes.data.data.buckets[worker.id]

            const eventsRes = await queryEvents(bucketsObj, get().queryEvents)
            const eventsDoc = eventsRes.data.data.events

            const buckets = getBuckets(bucketsObj)

            const details = useUserStore.getState().user?.u_details || []
            const categorisedApps = getCategorisedApps({ details, buckets, eventsDoc })
            const categorisedSites = getCategorisedSites({ details, buckets, eventsDoc })

            let allEvents: TEventDocument[] = []

            buckets.forEach(el => {
              const events = eventsDoc[el.hash]
              allEvents = [...allEvents, ...events]
              events.forEach(ev => {
                calculateTopApps(ev, topApps, categorisedApps, productiveTimes, worker.id)
                calculateTopSites(ev, topSites, categorisedSites, productiveTimes, worker.id)
                if ( !ev.data.status ) {
                  commonTime += ev.duration
                  calculateUsersStats(users, workersOnline, worker, ev, categorisedApps, categorisedSites)
                }
              })
            })

            users = users.map(user => {
              if ( user.id === worker.id ) {
                const time = calculateActiveTime(allEvents)
                const lastEvents = getLastActiveAppAndSite(allEvents)
                const afk = calculateAfkTimeToday(allEvents)
                const productivityDuration = getTotalDurationForProductivityToday(allEvents, categorisedApps, categorisedSites, afk)
                const weeklyActivityOverview = getWeeklyActivityOverview(allEvents, categorisedApps, categorisedSites, afk)
                const activitySummary = getActivitySummary(allEvents, categorisedApps, categorisedSites, afk)
                const productivityByTimeSlots = getProductivityPercentageByTimeSlots(allEvents, categorisedApps, categorisedSites, afk)
                const topAppsAndSites = getTopAppsAndSites(allEvents, categorisedApps, categorisedSites)
                const totalDurationByProductivityForApps = getTotalDurationByProductivityForApps(allEvents, categorisedApps)
                user.activityToday = time.totalDuration
                user.productivePercent = time.productivityToday
                user.activityByWeek = calculateTotalDurationForWeek(allEvents)
                user.afk = afk
                user.lastActiveApp = lastEvents.lastApp
                user.lastActiveSite = lastEvents.lastSite
                user.productivityDurationToday = productivityDuration
                user.weeklyActivityOverview = weeklyActivityOverview
                user.appsActivity = activitySummary.appsActivity
                user.sitesActivity = activitySummary.sitesActivity
                user.productivityByTimeSlots = productivityByTimeSlots
                user.topApps = topAppsAndSites.topApps
                user.topSites = topAppsAndSites.topSites
                user.totalDurationByProductivityForApps = totalDurationByProductivityForApps
              }
              return user
            })

            let commonActiveTime = 0
            let commonProductiviyTimeAtDay = 0

            users.forEach(user => {
              const totalDuration = user.weeklyActivityOverview?.reduce((sum, day) => sum + day.duration, 0)
              commonActiveTime += user.activeTime
              commonProductiviyTimeAtDay += (totalDuration || 0) / 7
            })

            users = users.map(user => {
              const productiviyTimeAtDay = (user.weeklyActivityOverview?.reduce((sum, day) => sum + day.duration, 0) || 0) / 7
              user.teamProductivityOverview = {
                percent: Math.round(commonActiveTime / user.activeTime * 100),
                duration: Math.round(commonProductiviyTimeAtDay / (productiviyTimeAtDay || 1)),
                top: 0
              }
              return user
            })

            users = users.map(user => {
              if ( user.teamProductivityOverview?.top !== undefined ) {
                user.teamProductivityOverview!.top = users.toSorted((a, b) => (
                  a.teamProductivityOverview!.percent - b.teamProductivityOverview!.percent
                )).findIndex(user => user.id === worker.id) + 1
              }
              return user
            })

            resolve(true)
          })
        })

        console.log(users);

        set({
          commonTime: Math.round(commonTime),
          topApps: topApps.sort((a, b) => b.duration - a.duration),
          topSites: topSites.sort((a, b) => b.duration - a.duration),
          productiveTime: Math.round(productiveTimes.productive),
          averageProductivity: Math.round(productiveTimes.productive / commonTime * 100),
          averageDistracting: Math.round(productiveTimes.distracting / commonTime * 100),
          averageNeutral: Math.floor(productiveTimes.neutral / commonTime * 100),
          workersOnline: Object.keys(workersOnline).length,
          users
        })
      }
    }),

  }))
)

const queryEvents = async (
  bucketsObj: TGetManagerBucketsResponse['data']['buckets'][number],
  queryEvents: TState['queryEvents']
) => {

  const query: TGetManagerBucketsEventsRequest = {
    buckets: Object.keys(bucketsObj)
  }

  if ( queryEvents.start && queryEvents.end ) {
    query.start = queryEvents.start
    query.end = queryEvents.end
    query.limit = -1
  }

  return GFPSApiService.getManagerBucketsEvents(query)
}

const getBuckets = ( bucketsObj: TGetManagerBucketsResponse['data']['buckets'][number] ) => {
  const buckets: TBucket[] = []

  for ( const key in bucketsObj ) {
    const bucketEl = bucketsObj[key]
    if ( bucketEl.type !== 'afkstatus' ) {
      buckets.push({
        type: bucketEl.type,
        hash: key
      })
    }
  }

  return buckets
}

const calculateTopApps = (
  ev: TEventDocument,
  topApps: TTopApp[],
  categorisedApps: { name: string, productivity: TUserDetails["eff_typ"] }[],
  productiveTimes: { productive: number, distracting: number, neutral: number },
  worker_id: number
) => {
  if ( ev.data.app ) {
    const appName = ev.data.title ? ev.data.app+' - '+ev.data.title : ev.data.app
    let productivity = categorisedApps.find(el => el.name === appName)
    if ( !productivity ) productivity = categorisedApps.find(el => el.name === ev.data.app)
    const topAppIndex = topApps.findIndex(el => el.name === (productivity?.name || ev.data.app))
    if ( productivity ) {
      productiveTimes[productivity.productivity] += ev.duration
    } else {
      productiveTimes.neutral += ev.duration
    }
    if ( topAppIndex === -1 ) {
      topApps.push({
        id: ev.id,
        name: productivity?.name || ev.data.app,
        title: ev.data.title,
        users: [worker_id],
        duration: Math.round(ev.duration),
        productivity: productivity?.productivity || "neutral"
      })
    } else {
      const topApp = topApps[topAppIndex]
      topApps[topAppIndex] = {
        ...topApp,
        duration: Math.round(topApp.duration + ev.duration),
        users: topApp.users.includes(worker_id) ? topApp.users : [...topApp.users, worker_id]
      }
    }
  }
}

const calculateTopSites = (
  ev: TEventDocument,
  topSites: TTopSite[],
  categorisedSites: { name: string, productivity: TUserDetails["eff_typ"] }[],
  productiveTimes: { productive: number, distracting: number, neutral: number },
  worker_id: number
) => {
  if ( ev.data.url ) {
    const parsedUrl = new URL(ev.data.url).hostname
    let siteName = ev.data.title ? parsedUrl+' - '+ev.data.title : parsedUrl
    let productivity = categorisedSites.find(el => el.name === siteName)
    if ( !productivity ) productivity = categorisedSites.find(el => el.name === parsedUrl)
    const topSiteIndex = topSites.findIndex(el => el.name === (productivity?.name || parsedUrl))
    if ( productivity ) {
      productiveTimes[productivity.productivity] += ev.duration
    } else {
      productiveTimes.neutral += ev.duration
    }
    if ( topSiteIndex === -1 ) {
      topSites.push({
        id: ev.id,
        name: productivity?.name || parsedUrl,
        title: ev.data.title,
        visits: { [worker_id]: 1 },
        duration: Math.round(ev.duration),
        productivity: productivity?.productivity || "neutral"
      })
    } else {
      const topSite = topSites[topSiteIndex]
      topSite.visits[worker_id] += 1
      topSites[topSiteIndex] = {
        ...topSite,
        duration: Math.round(topSite.duration + ev.duration),
        visits: topSite.visits
      }
    }
  }
}

interface GetCategorisedAppsProps {
  details: TUserDetails[] | null
  buckets: TBucket[]
  eventsDoc: { [hash: string]: TEventDocument[] }
}
function getCategorisedApps({ details, buckets, eventsDoc }: GetCategorisedAppsProps) {

  const categorisedAppsObj = details?.reduce<Record<string, { name: string, productivity: TUserDetails['eff_typ'] }[]>>((acc, detail) => {
    buckets.forEach(el => {
      const events = eventsDoc[el.hash]
      events.forEach(ev => {
        if ( ev.data.app ) {
          const reg = new RegExp(detail.rule.regex?.toLocaleLowerCase() || '""')
          const title = ev.data.title.toLocaleLowerCase()
          const name = ev.data.app!.toLocaleLowerCase()
          let productivity = null
          if ( reg.test(title) || reg.test(name) ) {
            productivity = detail.eff_typ
          }
          const key = detail.name.join('.')
          if ( !acc[key] ) {
            acc[key] = []
          }
          let appName = ev.data.app
          if ( !productivity ) {
            acc[key].push({
              name: appName,
              productivity: 'neutral'
            })
            return acc
          }
          appName = ev.data.title ? ev.data.app+' - '+ev.data.title : ev.data.app
          if ( acc[key].find(el => el.name === appName) ) {
            return acc
          }
          acc[key].push({
            name: appName,
            productivity
          })
        }
      })
    })
    return acc
  }, {})

  return Object.values(categorisedAppsObj || {}).reduce((acc, curr) => acc.concat(curr), [])
}

interface GetCategorisedSitesProps {
  details: TUserDetails[] | null
  buckets: TBucket[]
  eventsDoc: { [hash: string]: TEventDocument[] }
}
function getCategorisedSites({ details, buckets, eventsDoc }: GetCategorisedSitesProps) {

  const categorisedSitesObj = details?.reduce<Record<string, { name: string, productivity: TUserDetails['eff_typ'] }[]>>((acc, detail) => {
    buckets.forEach(el => {
      const events = eventsDoc[el.hash]
      events.forEach(ev => {
        if ( ev.data.app === undefined ) {
          const parsedUrl = new URL(ev.data.url).hostname
          const reg = new RegExp(detail.rule.regex?.toLocaleLowerCase() || '""')
          const title = ev.data.title.toLocaleLowerCase()
          let productivity = null
          if ( reg.test(title) || reg.test(parsedUrl) ) {
            productivity = detail.eff_typ
          }
          const key = detail.name.join('.')
          if ( !acc[key] ) {
            acc[key] = []
          }
          let siteName = parsedUrl
          if ( !productivity ) {
            acc[key].push({
              name: siteName,
              productivity: 'neutral'
            })
            return acc
          }
          siteName = ev.data.title ? parsedUrl+' - '+ev.data.title : parsedUrl
          if ( acc[key].find(el => el.name === siteName) ) {
            return acc
          }
          acc[key].push({
            name: siteName,
            productivity
          })
        }
      })
    })
    return acc
  }, {})

  return Object.values(categorisedSitesObj || {}).reduce((acc, curr) => acc.concat(curr), [])
}

const calculateUsersStats = (
  users: TWorkerStats[],
  workersOnline: Record<string, 1>,
  worker: TWorkerDocument,
  ev: TEventDocument,
  categorisedApps: { name: string, productivity: TUserDetails["eff_typ"] }[],
  categorisedSites: { name: string, productivity: TUserDetails["eff_typ"] }[],
) => {
  const wasInLastMinute = wasEventInLastMinute(ev.timestamp)
  if ( wasInLastMinute ) workersOnline[worker.id] = 1
  const userIndex = users.findIndex(el => el.id === worker.id)
  const u = users[userIndex]

  const lastTime = new Date(ev.timestamp)
  const currentTime = new Date(0)

  if ( !u ) {
    let productiveTimes = {
      productive: 0,
      distracting: 0,
      neutral: 0
    }
    let apps: TTopApp[] = []
    let sites: TTopSite[] = []
    let commonTime = Object.values(productiveTimes).reduce((acc, n) => acc + n, 0)
    let productivity = Math.round(productiveTimes.productive / commonTime * 100)

    calculateTopApps(ev, apps, categorisedApps, productiveTimes, worker.id)
    calculateTopSites(ev, sites, categorisedSites, productiveTimes, worker.id)

    users.push({
      id: worker.id,
      name: worker.username,
      status: 'online',
      activeTime: ev.duration,
      productivity,
      lastActivityTime: currentTime > lastTime ? currentTime : lastTime,
      productiveTimes
    } satisfies TWorkerStats)
    return
  }

  const activeTime = Math.round(u.activeTime + ev.duration)
  const productiveTimes = u.productiveTimes
  const commonTime = Object.values(productiveTimes).reduce((acc, n) => acc + n, 0)
  const productivity = Math.round(productiveTimes.productive / commonTime * 100)

  let apps: TTopApp[] = []
  let sites: TTopSite[] = []

  calculateTopApps(ev, apps, categorisedApps, productiveTimes, worker.id)
  calculateTopSites(ev, sites, categorisedSites, productiveTimes, worker.id)

  users[userIndex] = {
    ...u,
    status: wasInLastMinute ? 'online' : 'offline',
    activeTime,
    productivity,
    lastActivityTime: u.lastActivityTime > lastTime ? u.lastActivityTime : lastTime,
    productiveTimes
  }
}

function wasEventInLastMinute( timestamp: string ) {
  const eventDate = new Date(timestamp) as any
  const now = new Date() as any
  const differenceInMs = now - eventDate;
  const differenceInMinutes = differenceInMs / (1000 * 60);
  return differenceInMinutes <= 1;
}

function calculateActiveTime( events: TEventDocument[] ) {
  const today = new Date()
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  let totalDuration = 0;
  let activityCount = 0;

  events.forEach(event => {
    if ( event.data.status ) return

    const eventTime = new Date(event.timestamp).getTime()

    if (eventTime >= startOfDay) {
      totalDuration += event.duration;
      activityCount++;
    }
  });
  
  const productivityToday = Math.round(activityCount / totalDuration * 100)
  
  return {
    totalDuration: Math.round(totalDuration / 60),
    productivityToday: Number.isNaN(productivityToday) ? 0 : productivityToday
  }
}

const calculateTotalDurationForWeek = (events: TEventDocument[]): number => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Начало недели (пн)
  const endOfWeek = new Date(today);
  endOfWeek.setDate(startOfWeek.getDate() + 7); // Конец недели (вс)

  let totalDuration = 0;

  events.forEach(event => {
    if ( event.data.status ) return
    const eventTime = new Date(event.timestamp).getTime()
    if (eventTime >= startOfWeek.getTime() && eventTime < endOfWeek.getTime()) {
      totalDuration += event.duration;
    }
  })

  return Math.round(totalDuration)
}

function calculateAfkTimeToday( events: TEventDocument[] ) {
  const today = new Date()
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  let totalDuration = 0;

  events.forEach(event => {
    if ( !event.data.status ) return

    const eventTime = new Date(event.timestamp).getTime()

    if (eventTime >= startOfDay) {
      totalDuration += event.duration
    }
  });

  return Math.round(totalDuration / 60)
}

const getLastActiveAppAndSite = ( events: TEventDocument[] ): { lastApp: string | undefined; lastSite: string | undefined } => {
  let lastApp: { timestamp: number; app: string|undefined } = { timestamp: 0, app: '' }
  let lastSite: { timestamp: number; url: string|undefined } = { timestamp: 0, url: '' }

  events.forEach(event => {
    const eventTime = new Date(event.timestamp).getTime()
    if ('app' in event.data) {
      if ((lastApp.app === '') || (eventTime > lastApp.timestamp)) {
        lastApp = { timestamp: eventTime, app: event.data.title };
      }
    }
    if (event.data.url) {
      if ((lastSite.url === '') || (eventTime > lastSite.timestamp)) {
        lastSite = { timestamp: eventTime, url: event.data.title };
      }
    }
  });

  return {
      lastApp: lastApp.app,
      lastSite: lastSite.url
  };
}

const getTotalDurationForProductivityToday = (
  events: TEventDocument[],
  categorisedApps: { name: string, productivity: TUserDetails["eff_typ"] }[],
  categorisedSites: { name: string, productivity: TUserDetails["eff_typ"] }[],
  afkDuration: number
) => {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  
  const productivityDuration = {
      productive: 0,
      neutral: 0,
      distracting: 0
  };

  events.forEach(ev => {
      const eventTime = new Date(ev.timestamp).getTime();
      if (eventTime >= startOfDay) {
          let productivityLevel = null;

          if ('app' in ev.data) {
              const appName = ev.data.title ? ev.data.app+' - '+ev.data.title : ev.data.app
              let appInfo = categorisedApps.find(el => el.name === appName)
              if ( !appInfo ) appInfo = categorisedApps.find(el => el.name === ev.data.app)
              if (appInfo) {
                  productivityLevel = appInfo.productivity
              }
          } else if ('url' in ev.data) {
              const parsedUrl = new URL(ev.data.url).hostname
              let siteName = ev.data.title ? parsedUrl+' - '+ev.data.title : parsedUrl
              let siteInfo = categorisedSites.find(el => el.name === siteName)
              if ( !siteInfo ) siteInfo = categorisedSites.find(el => el.name === parsedUrl)
              if (siteInfo) {
                  productivityLevel = siteInfo.productivity;
              }
          }

          if (productivityLevel) {
              productivityDuration[productivityLevel] += ev.duration
          }
      }
  });

  const totalActiveDuration = productivityDuration.productive + productivityDuration.neutral + productivityDuration.distracting + afkDuration

  return {
    productive: {
      duration: productivityDuration.productive,
      percent: (productivityDuration.productive / totalActiveDuration) * 100 || 0
    },
    neutral: {
      duration: productivityDuration.neutral,
        percent: (productivityDuration.neutral / totalActiveDuration) * 100 || 0
    },
    distracting: {
      duration: productivityDuration.distracting,
        percent: (productivityDuration.distracting / totalActiveDuration) * 100 || 0
    },
    afk: {
      duration: afkDuration,
      percent: (afkDuration / totalActiveDuration) * 100 || 0
    }
  }
};

const getWeeklyActivityOverview = (
  events: TEventDocument[],
  categorisedAppsObj: { name: string, productivity: TUserDetails["eff_typ"] }[],
  categorisedSitesObj: { name: string, productivity: TUserDetails["eff_typ"] }[],
  afkDuration: number
): Array<{
  timestamp: Date;
  duration: number;
  topApp: string;
  topSite: string;
  productivity: {
      productive: number;
      neutral: number;
      distracting: number;
      afk: number;
  };
}> => {
  const weeklyActivity = Array(7).fill(null).map((_, index) => ({
      timestamp: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      duration: 0,
      apps: new Map<string, number>(),
      sites: new Map<string, number>(),
      productivityDuration: {
          productive: 0,
          neutral: 0,
          distracting: 0
      }
  }));

  events.forEach(ev => {
      const eventTime = new Date(ev.timestamp).getTime();
      const eventDate = new Date(eventTime);
      const diffInDays = Math.floor((Date.now() - eventTime) / (24 * 60 * 60 * 1000));

      if (diffInDays >= 0 && diffInDays < 7) {
          const currentDay = weeklyActivity[diffInDays];
          currentDay.duration += ev.duration;

          if ('app' in ev.data) {
            const appName = ev.data.title ? ev.data.app+' - '+ev.data.title : ev.data.app
            let appInfo = categorisedAppsObj.find(el => el.name === appName)
            if ( !appInfo ) appInfo = categorisedAppsObj.find(el => el.name === ev.data.app)
              if (appInfo) {
                  currentDay.productivityDuration[appInfo.productivity] += ev.duration;
                  currentDay.apps.set(appInfo.name, (currentDay.apps.get(appInfo.name) || 0) + ev.duration);
              }
          } else if ('url' in ev.data) {
              const parsedUrl = new URL(ev.data.url).hostname
              let siteName = ev.data.title ? parsedUrl+' - '+ev.data.title : parsedUrl
              let siteInfo = categorisedSitesObj.find(el => el.name === siteName)
              if (siteInfo) {
                  currentDay.productivityDuration[siteInfo.productivity] += ev.duration;
                  currentDay.sites.set(siteInfo.name, (currentDay.sites.get(siteInfo.name) || 0) + ev.duration);
              }
          }
      }
  });

  return weeklyActivity.map(day => {
      const topApp = Array.from(day.apps.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';
      const topSite = Array.from(day.sites.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';
      const totalDuration = day.duration + afkDuration;

      return {
          timestamp: new Date(day.timestamp),
          duration: Math.round(day.duration) / 60,
          topApp,
          topSite,
          productivity: {
              productive: (day.productivityDuration.productive / totalDuration) * 100 || 0,
              neutral: (day.productivityDuration.neutral / totalDuration) * 100 || 0,
              distracting: (day.productivityDuration.distracting / totalDuration) * 100 || 0,
              afk: (afkDuration / totalDuration) * 100 || 0
          }
      };
  });
};

const getActivitySummary = (
  events: TEventDocument[],
  categorisedAppsObj: { name: string, productivity: TUserDetails["eff_typ"] }[],
  categorisedSitesObj: { name: string, productivity: TUserDetails["eff_typ"] }[],
  afkDuration: number
): { appsActivity: TActivitySummary[]; sitesActivity: TActivitySummary[] } => {
  const appsActivityMap = new Map<string, TActivitySummary>();
  const sitesActivityMap = new Map<string, TActivitySummary>();

  events.forEach(ev => {
    if ( ev.data.status ) return;
      const eventTime = new Date(ev.timestamp);
      const duration = ev.duration;
      
      let productivityLevel = null
      
      if ('app' in ev.data) {
        const appName = ev.data.title ? ev.data.app+' - '+ev.data.title : ev.data.app
        let appInfo = categorisedAppsObj.find(el => el.name === appName)
        if ( !appInfo ) appInfo = categorisedAppsObj.find(el => el.name === ev.data.app)
        if ( appInfo?.productivity === 'productive' ) console.log(appInfo);
        productivityLevel = appInfo?.productivity || null
      }
      if ('url' in ev.data) {
        const parsedUrl = new URL(ev.data.url || '').hostname
        let siteName = ev.data.title ? parsedUrl+' - '+ev.data.title : parsedUrl
        let siteInfo = categorisedSitesObj.find(el => el.name === siteName)
        productivityLevel = siteInfo?.productivity || null
      }

      const key = ('app' in ev.data) ? ev.data.app : new URL(ev.data.url).hostname;
      const activityMap = ('app' in ev.data) ? appsActivityMap : sitesActivityMap;

      if (activityMap.has(key || '')) {
          const existingActivity = activityMap.get(key || '')!;
          existingActivity.duration += duration;
          existingActivity.sessions += 1;
          existingActivity.end = eventTime;
      } else {
          activityMap.set(key||'', {
              id: key||'',
              name: (('app' in ev.data) ? (ev.data.title||ev.data.app) : new URL(ev.data.url).hostname) || '',
              duration,
              productivity: productivityLevel,
              usagePercent: 0,
              sessions: 1,
              start: eventTime,
              end: eventTime
          });
      }
  });

  const totalAppsDuration = Array.from(appsActivityMap.values())
    .reduce((sum, activity) => sum + activity.duration, 0);

  const totalSitesDuration = Array.from(sitesActivityMap.values())
    .reduce((sum, activity) => sum + activity.duration, 0);

  appsActivityMap.forEach(activity => {
    activity.usagePercent = totalAppsDuration > 0 ? Math.round((activity.duration / totalAppsDuration) * 100) : 0;
  });

  sitesActivityMap.forEach(activity => {
    activity.usagePercent = totalSitesDuration > 0 ? Math.round((activity.duration / totalSitesDuration) * 100) : 0;
  });

  return {
      appsActivity: Array.from(appsActivityMap.values()),
      sitesActivity: Array.from(sitesActivityMap.values())
  };
};

const getProductivityPercentageByTimeSlots = (
  events: TEventDocument[],
  categorisedAppsObj: { name: string, productivity: TUserDetails["eff_typ"] }[],
  categorisedSitesObj: { name: string, productivity: TUserDetails["eff_typ"] }[],
  afkDuration: number
): {
  timeSlot: string;
  productivity: {
      productive: number;
      neutral: number;
      distracting: number;
      afk: number;
  };
}[] => {
  const timeSlots = [
      { name: '09:00 - 12:00', start: 9, end: 12 },
      { name: '12:00 - 15:00', start: 12, end: 15 },
      { name: '15:00 - 18:00', start: 15, end: 18 }
  ];

  const productivityData = timeSlots.map(slot => ({
      timeSlot: slot.name,
      productivity: {
          productive: 0,
          neutral: 0,
          distracting: 0,
          afk: 0
      },
      totalDuration: 0
  }));

  events.forEach(ev => {
      const eventTime = new Date(ev.timestamp);
      const hours = eventTime.getHours();
      const duration = ev.duration;

      timeSlots.forEach((slot, index) => {
          if (hours >= slot.start && hours < slot.end) {
              let productivityLevel = null;

              if ('app' in ev.data) {
                const appName = ev.data.title ? ev.data.app+' - '+ev.data.title : ev.data.app
                let appInfo = categorisedAppsObj.find(el => el.name === appName)
                if ( !appInfo ) appInfo = categorisedAppsObj.find(el => el.name === ev.data.app)
                  if (appInfo) {
                      productivityLevel = appInfo.productivity;
                  }
              } else if ('url' in ev.data) {
                const parsedUrl = new URL(ev.data.url).hostname
                let siteName = ev.data.title ? parsedUrl+' - '+ev.data.title : parsedUrl
                let siteInfo = categorisedSitesObj.find(el => el.name === siteName)
                  if (siteInfo) {
                      productivityLevel = siteInfo.productivity;
                  }
              }

              if (productivityLevel) {
                  productivityData[index].productivity[productivityLevel] += duration;
                  productivityData[index].totalDuration += duration;
              }
          }
      });
  });

  productivityData.forEach(data => {
      const totalDuration = data.totalDuration;
      const totalActiveDuration = totalDuration + afkDuration;

      data.productivity.productive = (data.productivity.productive / totalActiveDuration) * 100 || 0;
      data.productivity.neutral = (data.productivity.neutral / totalActiveDuration) * 100 || 0;
      data.productivity.distracting = (data.productivity.distracting / totalActiveDuration) * 100 || 0;
      data.productivity.afk = (afkDuration / totalActiveDuration) * 100 || 0; 
  });

  return productivityData;
};

const getTopAppsAndSites = (
  events: TEventDocument[],
  categorisedAppsObj: { name: string, productivity: TUserDetails["eff_typ"] }[],
  categorisedSitesObj: { name: string, productivity: TUserDetails["eff_typ"] }[],
): { topApps: TWorkerTopApp[]; topSites: TWorkerTopApp[] } => {
  const appMetrics: Map<string, TWorkerTopApp> = new Map();
  const siteMetrics: Map<string, TWorkerTopApp> = new Map();

  events.forEach(ev => {
      const duration = ev.duration;

      if ('app' in ev.data) {
          const appName = ev.data.title ? ev.data.app+' - '+ev.data.title : ev.data.app
          let appInfo = categorisedAppsObj.find(el => el.name === appName)
          if ( !appInfo ) appInfo = categorisedAppsObj.find(el => el.name === ev.data.app)
          if (appInfo) {
              const key = ev.data.app!;
              if (key && !appMetrics.has(key||'')) {
                appMetrics.set(key, {
                  name: appInfo.name,
                  duration: 0,
                  productivity: appInfo.productivity
                });
              }
              const topApp = appMetrics.get(key)!;
              topApp.duration += duration;
          }
      } else if ('url' in ev.data) {
          const parsedUrl = new URL(ev.data.url).hostname
          let siteName = ev.data.title ? parsedUrl+' - '+ev.data.title : parsedUrl
          let siteInfo = categorisedSitesObj.find(el => el.name === siteName)
          if (siteInfo) {
            const key = new URL(ev.data.url).hostname;
            if (!siteMetrics.has(key)) {
                siteMetrics.set(key, {
                    name: siteInfo.name,
                    duration: 0,
                    productivity: siteInfo.productivity
                });
            }
            const topSite = siteMetrics.get(key)!;
            topSite.duration += duration;
          }
      }
  });

  return {
      topApps: Array.from(appMetrics.values()),
      topSites: Array.from(siteMetrics.values())
  };
};

const getTotalDurationByProductivityForApps = (
  events: TEventDocument[],
  categorisedAppsObj: { name: string, productivity: TUserDetails["eff_typ"] }[],
): {
  productive: number;
  neutral: number;
  distracting: number;
} => {
  const durationByProductivity = {
      productive: 0,
      neutral: 0,
      distracting: 0
  };

  events.forEach(ev => {
      if ('app' in ev.data) {
        const appName = ev.data.title ? ev.data.app+' - '+ev.data.title : ev.data.app
        let appInfo = categorisedAppsObj.find(el => el.name === appName)
        if ( !appInfo ) appInfo = categorisedAppsObj.find(el => el.name === ev.data.app)
          if (appInfo) {
              const duration = ev.duration;
              switch(appInfo.productivity) {
                  case 'productive':
                      durationByProductivity.productive += duration;
                      break;
                  case 'neutral':
                      durationByProductivity.neutral += duration;
                      break;
                  case 'distracting':
                      durationByProductivity.distracting += duration;
                      break;
              }
          }
      }
  });

  return durationByProductivity;
};