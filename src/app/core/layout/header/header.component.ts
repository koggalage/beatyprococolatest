import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DataService } from '../../services/data.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  companyName = "BeautyPro";
  module: string;
  currentUser: User;

  toggle: boolean = false;

  constructor(
    private data: DataService,
    private router: Router,
    private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    this.data.currentModule.subscribe(module => this.module = module);

    // this.router.events.subscribe((val) => {
    //   if (this.location.path() != '') {
    //     this.module = this.location.path().split('/')[1];
    //   }
    // });
  }

  loggedInUser(): string {
    return this.currentUser.userName;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}
