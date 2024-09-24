import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private http: HttpClient, private _authService: AuthService, private router: Router) { }
  URL = environment.apiURL;

  // async canActivate() {
  canActivate() {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');

    /************************************************
    * Falta controlar si el token expiró contra PHP *
    *************************************************/

    // await this.http.get(`${this.URL}logedIn`, { headers: header }).subscribe(respuesta => {
    //   if (!respuesta) {
    //     localStorage.setItem('token_vademecum', '');
    //     this.router.navigate(['/login']);
    //     return false;
    //   }
    // });

    if (this._authService.loggedIn()) {
      return true
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }


}
