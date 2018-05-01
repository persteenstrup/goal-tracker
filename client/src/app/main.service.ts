import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {BehaviorSubject} from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class MainService {
  user: Object
  userChange: BehaviorSubject<Object>
  constructor(private _http: Http, private _router:Router) {
    this.user = { fname: "", lname: "", email: "", pswd: "",_mygoals:[{pending:[]}], };
    this.userChange = new BehaviorSubject([])
  }

  ///ADD REGISTER FUNCTION
  //
  //

  login(user) {
    //console.log("service live", user)
    this._http.post('/login', user).subscribe(
      (res) => {
        console.log("main_service resp",res.json().user)
        //callback(res.json().user)
        this.user = res.json().user
        this.userChange.next(this.user)
        //Look through user goals to find overdue elements
        for(let i=0;i<this.user['_mygoals'].length;i++){
          // console.log(i)
          // console.log(this.user['_mygoals'].length-1)
          // console.log(this.user['_mygoals'][i]['overdue'].length > 0) 
          if(this.user['_mygoals'][i]['overdue'].length > 0){
            console.log(this.user['_mygoals'])
            return this._router.navigate(['lastchance'])
          }
          if(i==this.user['_mygoals'].length-1){
            return this._router.navigate(['/'])
          }
        }
        return this._router.navigate(['/'])
      })
  }

  checkSession(callback) {
    //console.log("session check service hit");
    this._http.get('/checksession').subscribe(
      //*************
      //Test removing callback and just rerouting from service
      //***********
            (res) => {
        //console.log("main service resp", res.json().user)
        callback(res.json().user)
        // this.user = res.json().user
        // this.userChange.next(this.user)
      })
  }

  ScheduleGoal(goal) {
    this._http.post('/create/goal', goal).subscribe(
      (res) => {
        console.log('create goal back in service', res.json())
        this.user['_mygoals'].push(res.json())
        this.userChange.next(this.user)
        return this._router.navigate['/']      
      }
    )
  }

  ScheduleTodo(todo) {
    this._http.post('/create/todo', todo).subscribe(
      (res) => {
        console.log('create goal back in service', res.json())
      }
    )
  }

  //Single goal action, ie completed walking dog on 4/20, more actions/events may be pending
  //maybe rename for clarity
  CompletedGoal(goal_id,date){
    this._http.post('/goal/update/overdue',{goal_id:goal_id, date:date}).subscribe(
      (res) => {
        console.log('moved overdue to sucess', res.json())
      }
    )
  }

  FailOverdue(goal_id,callback){
    this._http.post('/goal/fail/overdue',{goal_id:goal_id}).subscribe(
      (res) => {
        console.log('fail overdue', res.json())   
        callback(res.json())     
      }
    )
  }

  RemoveCompleted(){
    this._http.get('/user/removecompleted').subscribe(
      (res) => {
        console.log(res.json())
        this.user = res.json()
      }
    )
  }


  getUsers(callback) {
    //console.log("getUsers service hit");
    this._http.get('/users').subscribe(
      (res) => {
        //console.log("main service resp", res.json())
        callback(res.json())
      }
    )
  }
}
