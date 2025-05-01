import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  activePage: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    // Subscribe to router events to detect active route
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects;
        if (url.includes('/profile')) {
          this.activePage = 'profile';
        } else if (url.includes('/chatbox')) {
          this.activePage = 'chats';
        } else if (url.includes('/groups')) {
          this.activePage = 'groups';
        }
      });

    // Set initial active page based on current URL
    const currentUrl = this.router.url;
    if (currentUrl.includes('/profile')) {
      this.activePage = 'profile';
    } else if (currentUrl.includes('/chatbox')) {
      this.activePage = 'chats';
    } else if (currentUrl.includes('/groups')) {
      this.activePage = 'groups';
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
  logout() {
    localStorage.removeItem('userID');
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('username');
    localStorage.removeItem('avatar');
    this.router.navigate(['/login']);
  }
}
