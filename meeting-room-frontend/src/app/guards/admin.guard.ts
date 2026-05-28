import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const group = localStorage.getItem('group');

    if (group == 'Admin') {
      return true;
    }

    this.router.navigate(['/rooms']);

    return false;
  }
}
