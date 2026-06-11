export interface Tournament {
  id: string
  name: string
  startDate: string // ISO date
  endDate: string
  hostNations: string[]
}

export interface Group {
  id: string
  name: string // "A" through "L"
  teamIds: string[]
}

export interface Team {
  id: string
  name: string
  nameCn: string
  fifaCode: string // "ARG", "BRA", etc.
  flagUrl: string
  fifaRank: number
  confederation: 'AFC' | 'CAF' | 'CONCACAF' | 'CONMEBOL' | 'OFC' | 'UEFA'
  coach: string
  groupId: string
  stats: TeamStats
  playerIds: string[]
}

export interface TeamStats {
  attack: number // 0-100
  defense: number
  possession: number
  fitness: number
  experience: number
  recentForm: number
}

export interface Player {
  id: string
  name: string
  position: 'GK' | 'DF' | 'MF' | 'FW'
  age: number
  club: string
  number: number
  teamId: string
}

export type MatchStage =
  | 'group'
  | 'round32'
  | 'round16'
  | 'quarter'
  | 'semi'
  | 'third'
  | 'final'

export interface Match {
  id: string
  homeTeamId: string
  awayTeamId: string
  date: string // ISO datetime
  stage: MatchStage
  groupId?: string // only for group stage
  venueId: string
  homeScore?: number
  awayScore?: number
  status: 'scheduled' | 'live' | 'finished'
}

export interface Venue {
  id: string
  name: string
  city: string
  country: string
  capacity: number
  lat: number
  lng: number
  altitude: number // meters
  climate: string
  timezone: string
  imageUrl: string
  description: string
}

export interface H2HRecord {
  team1Id: string
  team2Id: string
  matches: {
    date: string
    tournament: string
    homeTeamId: string
    awayTeamId: string
    homeScore: number
    awayScore: number
  }[]
}

export interface PredictionResult {
  homeWin: number // probability 0-1
  draw: number
  awayWin: number
  confidence: number // 0-1
  factors: {
    name: string
    advantage: 'home' | 'away' | 'neutral'
    weight: number
  }[]
}
