import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  BASE_URL = 'https://api.themoviedb.org/3/'
  API_KEY = ''
  constructor(private http: HttpClient) { }

  NowPlaying(param) {
    if (param == 'upcoming') {
      return this.http.get(this.BASE_URL + 'movie/' + param + '?api_key=' + this.API_KEY + '&language=pt-BR')
    } else {
      return this.http.get(this.BASE_URL + 'trending/movie/day?api_key=' + this.API_KEY);
    }
  }

  searchMovies(searchInput) {
    return this.http.get(this.BASE_URL + 'search/movie?api_key=' + this.API_KEY + '&query=' + searchInput);
  }

  getSingleMovie(id) {
    return this.http.get(this.BASE_URL + 'movie/' + id + '?api_key=' + this.API_KEY + '&revenue&append_to_response=credits');
  }
}
