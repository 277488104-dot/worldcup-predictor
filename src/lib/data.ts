import type { Tournament, Group, Team, Player, Match, Venue, H2HRecord } from '@/types/worldcup'

// tournaments.json is a single Tournament object, NOT an array
import tournamentsData from '@/../public/data/tournaments.json'
import groupsData from '@/../public/data/groups.json'
import teamsData from '@/../public/data/teams.json'
import playersData from '@/../public/data/players.json'
import matchesData from '@/../public/data/matches.json'
import venuesData from '@/../public/data/venues.json'
import h2hData from '@/../public/data/h2h.json'

const tournaments = tournamentsData as Tournament
const groups = groupsData as Group[]
const teams = teamsData as Team[]
const players = playersData as Player[]
const matches = matchesData as Match[]
const venues = venuesData as Venue[]
const h2h = h2hData as H2HRecord[]

export function getTournament(): Tournament {
  return tournaments
}

export function getGroups(): Group[] {
  return groups
}

export function getAllTeams(): Team[] {
  return teams
}

export function getTeamById(id: string): Team | undefined {
  return teams.find(t => t.id === id)
}

export function getPlayersByTeam(teamId: string): Player[] {
  return players.filter(p => p.teamId === teamId)
}

export function getPlayerById(id: string): Player | undefined {
  return players.find(p => p.id === id)
}

export function getAllMatches(): Match[] {
  return matches
}

export function getMatchById(id: string): Match | undefined {
  return matches.find(m => m.id === id)
}

export function getMatchesByStage(stage: string): Match[] {
  return matches.filter(m => m.stage === stage)
}

export function getMatchesByTeam(teamId: string): Match[] {
  return matches.filter(m => m.homeTeamId === teamId || m.awayTeamId === teamId)
}

export function getMatchesByDate(date: string): Match[] {
  return matches.filter(m => m.date.startsWith(date))
}

export function getVenueById(id: string): Venue | undefined {
  return venues.find(v => v.id === id)
}

export function getAllVenues(): Venue[] {
  return venues
}

export function getH2H(team1Id: string, team2Id: string): H2HRecord | undefined {
  return h2h.find(
    r => (r.team1Id === team1Id && r.team2Id === team2Id) ||
         (r.team1Id === team2Id && r.team2Id === team1Id)
  )
}

export function getTeamMatches(teamId: string): Match[] {
  return matches.filter(m => m.homeTeamId === teamId || m.awayTeamId === teamId)
}

export function getTodayMatches(): Match[] {
  const today = new Date().toISOString().slice(0, 10)
  return matches.filter(m => m.date.startsWith(today))
}

export function getGroupByTeamId(teamId: string): Group | undefined {
  return groups.find(g => g.teamIds.includes(teamId))
}

export function getTeamsByGroup(groupId: string): Team[] {
  const group = groups.find(g => g.id === groupId)
  if (!group) return []
  return group.teamIds.map(id => getTeamById(id)).filter(Boolean) as Team[]
}
