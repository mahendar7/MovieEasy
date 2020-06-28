import { AuthService } from './services/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  volume: string = 'true';

  constructor(private authService: AuthService) {
    let localVolume = localStorage.getItem('volume');

    if (localVolume) {
      this.volume = localVolume
    } else {
      localStorage.setItem('volume', this.volume)
    }
  }

  volumeChange() {
    if (this.volume === 'true') {
      this.volume = 'false';
    } else {
      this.volume = 'true';
    }
    localStorage.setItem('volume', this.volume)

  }

}
