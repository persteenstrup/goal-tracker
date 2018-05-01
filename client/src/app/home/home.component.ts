import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: Object
  users: Array<Object>
  constructor(private _mainService: MainService, private _router: Router) {
    this.user = { fname: "Per", lname: "Steenstrup", email: "per.steenstrup@gmail.com", pswd: 'CodingDojo87', pswd_conf: 'CodingDojo87' };
  }

  checkSession() {
    this._mainService.checkSession(
      (data) => {
        if (data) {
          // console.log("this works")
          // this.user = data
          // console.log(this.user)
        }
        else {
          this._router.navigate(['/login']);
        }
      })
  }

  getUsers() {
    this._mainService.getUsers(
      (data) => {
        console.log(data);
        this.users = data.users;
      })
  }


  ngOnInit() {
    this._mainService.userChange.subscribe(
      (res) => {this.user = res}
    )
    // this.checkSession()
    
    //this.getUsers()
  }

}
