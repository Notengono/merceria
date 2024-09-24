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

  ngOnInit(): void {
    if (this._authService.loggedIn()) {
      this.router.navigate(['/inicio']);
    }
  }

}
