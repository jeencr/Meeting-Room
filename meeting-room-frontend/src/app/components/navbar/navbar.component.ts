import { Component, OnInit } from '@angular/core';

import { Router, NavigationEnd } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  group: any = '';

  isLoggedIn = false;

  constructor(
    private authService: AuthService,

    private router: Router,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loadNavbar();
      }
    });
  }

  ngOnInit(): void {
    this.loadNavbar();
  }

  loadNavbar() {
    this.group = localStorage.getItem('group');

    this.isLoggedIn = !!localStorage.getItem('user_id');
  }

  logout() {
    this.authService.logout();

    this.router.navigate(['/login']);
  }
}
