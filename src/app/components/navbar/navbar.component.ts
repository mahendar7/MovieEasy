import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() navOptions: boolean;

  userDetails: any;

  selectedVal: string;
  responseMessage: string = '';
  responseMessageType: string = '';

  constructor(public auth: AuthService) { }

  ngOnInit(): void {
    this.userDetails = this.auth.isUserLoggedIn()
  }

  // Comman Method to Show Message and Hide after 2 seconds
  showMessage(type, msg) {
    this.responseMessageType = type;
    this.responseMessage = msg;
    setTimeout(() => {
      this.responseMessage = "";
    }, 2000);
  }

  // SignOut Firebase Session and Clean LocalStorage
  logoutUser() {
    this.auth.logout()
      .then(res => {
        this.userDetails = undefined;
        localStorage.removeItem('user');
      }, err => {
        this.showMessage("danger", err.message);
      });
  }

}
