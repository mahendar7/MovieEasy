import { AfterViewInit, Component, ElementRef, Inject, Injector, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { TransferState } from '@angular/platform-browser';

import { NgxSpinnerService } from 'ngx-spinner';
import Speech from 'speak-tts';

import { MovieService } from '../services/movie.service';
import { AudioService } from './../services/audio.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('Trending') Trending;
  @ViewChild('Upcoming') Upcoming;
  @ViewChild('hiddenInput') hiddenInput;
  @ViewChild('searchBox') searchBox: ElementRef;

  speech = new Speech();
  user: any[] = [];
  movies: any;
  searchMoviesList: any;
  isSpeaking: boolean;
  isOldUser: boolean = false;
  trending = true;
  searchInput: string;

  constructor(private movieService: MovieService, private spinner: NgxSpinnerService,
    private injector: Injector, private state: TransferState,
    @Inject(PLATFORM_ID) private platformid: Object,
    private audioService: AudioService) { }

  ngOnInit(): void {
    this.getMovies('trending');
    let isOldUser = localStorage.getItem('isOldUser');
    if (isOldUser) {
      this.isOldUser = true;
    } else {
      localStorage.setItem('isOldUser', 'true');
    }
  }

  async ngAfterViewInit() {
    let isAudioIntialized = await this.audioService.intializeSpeechConfig();

    if (isAudioIntialized) {
      this.user = JSON.parse(localStorage.getItem('user'));
      let firstLoginInstructions = this.isOldUser ? '' :
        `Hello ${this.user['displayName'].split(' ')[0]}!
      To Select Upcoming Movies, Say Command Upcoming.
      To Search a Movie, Say Command Search and Movie Name.
      Example, Search Baahubali`;

      this.speak(firstLoginInstructions);
      this.voiceSearch();
    }
  }

  getMovies(param) {
    this.spinner.show('loading');
    this.movieService.NowPlaying(param).subscribe(
      res => {
        this.movies = res['results'];
        this.speak(param + 'movies is selected')
      },
      error => console.log('Errror', error)
    );
    this.spinner.hide('loading');
  }

  async searchMovies() {
    if (this.searchInput) {
      this.spinner.show('loading');
      await this.movieService.searchMovies(this.searchInput).subscribe(
        res => this.searchMoviesList = res['results'],
        error => console.log('Errror', error)
      );
      this.spinner.hide('loading');
    }
  }

  public voiceSearch() {
    if ('webkitSpeechRecognition' in window) {
      const { webkitSpeechRecognition } = (window as any);

      this.isSpeaking = true;
      this.spinner.show('audioWaves');

      const vSearch = new webkitSpeechRecognition();
      vSearch.continuous = true;
      vSearch.interimresults = false;
      vSearch.lang = 'en-US';
      vSearch.start();

      let trendingBtn = this.Trending.nativeElement;
      let upcomingBtn = this.Upcoming.nativeElement;
      let hiddenBtn = this.hiddenInput.nativeElement;
      let searchBtn = this.searchBox.nativeElement;

      vSearch.onresult = ((e) => {
        vSearch.stop();

        let voiceString = e.results[0][0].transcript;
        let voiceWords = voiceString.split(' ');

        if (voiceWords.includes('trending')) {
          trendingBtn.click();
        } else if (voiceWords.includes('upcoming')) {
          upcomingBtn.click();
        } else if (voiceWords.includes('search')) {
          this.searchInput = voiceWords[1];
          searchBtn.click();
        } else {
          this.speak("Sorry I didn't get you.")
        }

        this.spinner.hide('audioWaves');
        this.isSpeaking = false;
        hiddenBtn.click(); //To Update isSpeaking in Html Manually
      }
      )
      vSearch.onerror = function (e) {
        console.log(e);
        vSearch.stop();
        this.isSpeaking = false;
        hiddenBtn.click(); //To Update isSpeaking in Html Manually
      }
    } else {
      console.log(this.state.get(configKey, undefined as any));
    }
  }

  speak(speechText) {
    this.audioService.speak(speechText);
  }

}
