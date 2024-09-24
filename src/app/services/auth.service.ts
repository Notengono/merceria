import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
// import { UserInterface } from 'src/app/models/user-interface';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private _router: Router) { }

  URL = environment.apiURL;

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  // setUser(user: UserInterface): void {
  setUser(user: any): void {
    let user_string = JSON.stringify(user);
    localStorage.setItem("currentUser", user_string);
  }

  setToken(token: string): void {
    localStorage.setItem("token_merceria", `Bearer ${token}`);
  }

  getUser() {
    return localStorage.getItem("currentUser");
  }

  getToken() {
    return localStorage.getItem('token_merceria');
  }

  login(user: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.http.post(`${this.URL}login`, user, { headers: header })
  }

  loggedIn() {
    return !!localStorage.getItem('token_merceria')
  }

  logout() {
    localStorage.removeItem('token_merceria')
    localStorage.removeItem('currentUser')
    this._router.navigate(['/login'])
  }
}
