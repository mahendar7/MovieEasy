import { Injectable } from '@angular/core';

import { Router } from "@angular/router";
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public angularFireAuth: AngularFireAuth,
    public router: Router
  ) {
    this.authCheck();
  }

  authCheck() {
    this.angularFireAuth.authState.subscribe(userResponse => {
      if (userResponse) {
        localStorage.setItem('user', JSON.stringify(userResponse));
      } else {
        localStorage.setItem('user', null);
      }
    })
  }

  async logout() {
    await this.angularFireAuth.signOut();
    localStorage.removeItem('isOldUser');
    localStorage.removeItem('user');
    return this.router.navigate(['/login']);
  }

  isUserLoggedIn() {
    return JSON.parse(localStorage.getItem('user'));
  }

  async loginWithGoogle() {
    await this.angularFireAuth.signInWithPopup(new auth.GoogleAuthProvider()).then(
      (res) => {
        localStorage.setItem('user', JSON.stringify(res.user)),
          this.router.navigate(['/']);
      }
    );
  }

}


