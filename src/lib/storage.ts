const STORAGE_KEY = 'wc26_predictions'

export interface SavedPrediction {
  matchId: string
  homeTeamId: string
  awayTeamId: string
  homeTeamName: string
  awayTeamName: string
  predictedHomeScore: number
  predictedAwayScore: number
  timestamp: number
}

export function getPredictions(): SavedPrediction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function savePrediction(p: Omit<SavedPrediction, 'timestamp'>): SavedPrediction[] {
  const predictions = getPredictions()
  const idx = predictions.findIndex(x => x.matchId === p.matchId)
  const saved: SavedPrediction = { ...p, timestamp: Date.now() }
  if (idx >= 0) predictions[idx] = saved
  else predictions.push(saved)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(predictions))
  return predictions
}

export function getPredictionForMatch(matchId: string): SavedPrediction | undefined {
  return getPredictions().find(p => p.matchId === matchId)
}

export function deletePrediction(matchId: string): SavedPrediction[] {
  const predictions = getPredictions().filter(p => p.matchId !== matchId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(predictions))
  return predictions
}
