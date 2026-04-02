export interface Edition {
  id: string
  year: number
  name: string
  isCurrent: boolean
  createdAt: string
}

export interface Film {
  id: string
  title: string
  posterUrl: string | null
  year: number
}

export interface Category {
  id: string
  name: string
}

export interface Nomination {
  id: string
  editionId: string
  filmId: string
  categoryId: string
  isWinner: boolean
  film: Film
  category: Category
}

export interface Prediction {
  id: string
  userId: string
  nominationId: string
  createdAt: string
  updatedAt: string
  nomination: Nomination
}

export interface RankEntry {
  rank: number
  userId: string
  name: string
  totalPredictions: number
  correctPredictions: number
  accuracy: number
}
