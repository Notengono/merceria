import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public _authService: AuthService, private router: Router) { }
  nombre: string = 'Desconocido'

  ngOnInit(): void {
    if (this._authService.loggedIn()) {
      this.router.navigate(['/inicio']);
    }
  }
  ngAfterContentChecked() {
    this.nombre = this._authService.getUser() ? JSON.parse(<any>this._authService.getUser()).nombre : 'Desconocido'
  }

  onLogout(): void {
    this._authService.logout();
  }
}
