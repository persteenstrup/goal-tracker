import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: object;
  userlogin: object;
  constructor(private _mainService:MainService, private _router:Router) {
    this.user = { fname: "Per", lname:"Steenstrup", email:"per.steenstrup@gmail.com", pswd:'CodingDojo87', pswd_conf:'CodingDojo87' };
    this.userlogin = { logEmail:"per.steenstrup@gmail.com", logPswd:"CodingDojo87"}
  }

  login(){
    //console.log("component live")
    this._mainService.login(this.userlogin
    //   , (data)=>{
    //   //console.log("Made it to the front",data)
    //   if(data){
    //     //console.log("found things")
    //     this._router.navigate(['/']);
    //   }
    // }
  )
  }

  register(){
    //FEED ME
  }

  ngOnInit() {
  }

}
