import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  @Input('data') data;

  Image_BASE_URL = 'https://image.tmdb.org/t/p/original/';
  constructor() { }

  ngOnInit(): void {
  }

}
