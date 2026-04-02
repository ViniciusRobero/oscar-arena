import { Injectable } from '@nestjs/common'
import { fetchPosterUrl } from './fetch-poster'

@Injectable()
export class PosterService {
  fetchPosterUrl(title: string, year: number): Promise<string | null> {
    return fetchPosterUrl(title, year)
  }
}
