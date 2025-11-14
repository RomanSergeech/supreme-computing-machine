
export type TTopApp = {
  id: number
  name: string
  title: string
  users: number[]
  duration: number
  productivity: 'productive'|'neutral'|'distracting'
}

export type TTopSite = {
  id: number
  name: string
  title: string
  visits: { [user_id: number]: number }
  duration: number
  productivity: 'productive'|'neutral'|'distracting'
}

export type TWorkerStats = {
  id: number
  name: string
  status: string
  activeTime: number
  productivity: number
  lastActivityTime: Date
  productiveTimes: {
    productive: number
    distracting: number
    neutral: number
  }
} & Partial<{
  email: string
  productivePercent: number
  activityToday: number
  activityByWeek: number
  sessions: number
  afk: number
  lastActiveApp: string
  lastActiveSite: string
  productivityDurationToday: {
    productive: { duration: number, percent: number }
    neutral: { duration: number, percent: number }
    distracting: { duration: number, percent: number }
    afk: { duration: number, percent: number }
  }
  currentActivity: {
    id: string
    name: string
    lastActivity: number
    duration: number
    productivity: 'productive'|'neutral'|'distracting'
  }[]
  topApps: TWorkerTopApp[]
  topSites: TWorkerTopApp[]
  totalDurationByProductivityForApps: {
    productive: number;
    neutral: number;
    distracting: number;
  }
  appsActivity: TActivitySummary[]
  sitesActivity: TActivitySummary[]
  topInCompany: {
    [user_id: string]: {
      
    }
  }
  weeklyActivityOverview: Array<{
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
  }>
  productivityByTimeSlots: {
    timeSlot: string;
    productivity: {
        productive: number;
        neutral: number;
        distracting: number;
        afk: number;
    };
  }[]
  teamProductivityOverview: {
    percent: number
    duration: number
    top: number
  }
}>

export type TWorkerTopApp = { name: string, duration: number, productivity: 'productive'|'neutral'|'distracting' }

export type TActivitySummary = {
  id: string;
  name: string;
  duration: number;
  productivity: 'productive' | 'neutral' | 'distracting' | null;
  usagePercent: number;
  sessions: number;
  start: Date;
  end: Date;
}