import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public usuario;
  constructor(public _authService: AuthService, private router: Router) { }
  nivel: number = 0;

  ngOnInit() {
    if (this._authService.loggedIn()) {
      this.router.navigate(['/inicio']);
    }
  }

  ngAfterContentChecked() {
    this.usuario = JSON.parse(localStorage.getItem("currentUser"));
    this.nivel = this.usuario != null ? parseInt(this.usuario.nivel_id) : 0;
  }

  onLogout(): void {
    this._authService.logout();
  }
}
