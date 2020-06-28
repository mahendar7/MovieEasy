import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-moviedetail',
  templateUrl: './moviedetail.component.html',
  styleUrls: ['./moviedetail.component.scss']
})
export class MoviedetailComponent implements OnInit {
  id;
  movie;
  Image_BASE_URL = 'https://image.tmdb.org/t/p/original/';

  constructor(private route: ActivatedRoute, private movieService: MovieService,
    private spinner: NgxSpinnerService, private router: Router) {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id) {
      this.getMovieDetail();
    }
  }

  ngOnInit(): void {

  }

  async getMovieDetail() {
    this.spinner.show('loading');
    await this.movieService.getSingleMovie(this.id).subscribe(
      (res) => this.movie = res,
      (err) => console.log(err)
    );
    this.spinner.hide('loading');
  }

  calcDuration(trackDuration) {
    var num = trackDuration;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + "h " + rminutes + "m";
  }

}
