import { isPlatformServer } from '@angular/common';
import { AfterViewInit, Component, Inject, Injector, PLATFORM_ID, ViewChild } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import Speech from 'speak-tts';

import { AuthService } from '../services/auth.service';
import { AudioService } from './../services/audio.service';

@Component({
  selector: 'app-home',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('loginBtn') loginBtn;

  speech = new Speech();
  voiceWords: [] = [];
  userDetails: any;
  text: any;
  voiceOut: string = '';


  constructor(private authService: AuthService, private spinner: NgxSpinnerService,
    private injector: Injector, private router: Router, private audioService: AudioService,
    private state: TransferState, @Inject(PLATFORM_ID) private platformid: Object,
  ) {

    if (isPlatformServer(this.platformid)) {
      const envJson = this.injector.get('CONFIG') ? this.injector.get('CONFIG') : {};
      this.state.set(configKey, envJson as any);
    }

  }

  async ngAfterViewInit() {
    let isAudioIntialized = await this.audioService.intializeSpeechConfig();

    if (isAudioIntialized) {
      this.speak('Hello! To login, Just Say Command Login');
      this.voiceSearch();
    }
  }

  speak(speechText) {
    this.audioService.speak(speechText);
  }

  // Open Popup to Login with Google Account
  public googleLogin() {
    this.speak('Please wait...')
    this.authService.loginWithGoogle()
      .then(res => {
        return this.router.navigateByUrl('/');
      }, err => {
        console.log(err);
        this.speak('Sorry, Please Try Again...')
      });
  }

  public voiceSearch() {
    if ('webkitSpeechRecognition' in window) {
      const { webkitSpeechRecognition } = (window as any)

      const vSearch = new webkitSpeechRecognition();
      vSearch.continuous = true;
      vSearch.interimresults = false;
      vSearch.lang = 'en-US';
      vSearch.start();
      let loginNewBtn = this.loginBtn.nativeElement;
      vSearch.onresult = function (e) {
        vSearch.stop();

        let voiceString = e.results[0][0].transcript;
        this.voiceWords = voiceString.split(' ');

        if (this.voiceWords.includes('login')) {
          loginNewBtn.click();
        }
      }
      vSearch.onerror = function (e) {
        console.log(e);
        vSearch.stop();
      }
    } else {
      console.log(this.state.get(configKey, undefined as any));
    }
  }

  // Check localStorage is having User Data
  isUserLoggedIn() {
    this.userDetails = this.authService.isUserLoggedIn();
  }

}
