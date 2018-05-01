import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-add-goal-todo',
  templateUrl: './add-goal-todo.component.html',
  styleUrls: ['./add-goal-todo.component.css']
})
export class AddGoalTodoComponent implements OnInit {
  user: object
  goalBool: Boolean
  indefinite: Boolean
  todoHasDueDate: Boolean
  goal:Object
  todo:Object

  constructor(private _mainService: MainService, private _router: Router) {
    this.user = { name: '' }
    this.goalBool = true
    this.indefinite = true
    this.todoHasDueDate = true
    this.todo = {title:'', _user:'', duedate:''}
    this.goal = {title:'', startdate:'', enddate:'', sunday:false, monday:false,tuesday:false,wednesday:false, thursday:false, friday:false, saturday:false, weekfreq:'weekly',_user:''}

  }

  ToggleGoal(bool) {
    this.goalBool = bool;
    // console.log('toogle fired')
    console.log(moment("2018-02-03","yyyy-MM-DD").day());
    let z = moment("2018-02-03","yyyy-MM-DD").add(1,'week').weekday(0);
    console.log(z.format("YYYY-MM-DD"));
    console.log(moment("2018-01-31"))
    //console.log(null.isBefore(moment()))

    // this.goal['startdate'] = moment("2018-02-03","yyyy-MM-DD")
    //console.log(typeof(moment("2018-02-03","yyyy-MM-DD")))
    // console.log(this.goal['startdate'])
    // console.log(moment())
    // console.log(Date.now())
  }

  ToggleIndef() {
    this.indefinite = !this.indefinite;
    if(!this.indefinite){this.goal['enddate']=''}
  }

  ScheduleGoal(id){
    if(this.goal['enddate']){
      this.goal['enddate'] = moment(this.goal['enddate'], "YYYY-MM-DD").format("YYYY-MM-DD")
    }
    //this.goal["enddate"] = this.enddateAssesor()

    let finalgoal = {
      title:this.goal['title'],
      startdate: moment(this.goal['startdate'], "YYYY-MM-DD").format("YYYY-MM-DD"),
      enddate: this.goal["enddate"],
      _user: id,
      repeatdays: [this.goal['sunday'],this.goal['monday'],this.goal['tuesday'], this.goal['wednesday'], this.goal['thursday'], this.goal['friday'], this.goal['saturday']],
      repeatweekly: this.goal['weekfreq']
    }
    this._mainService.ScheduleGoal(finalgoal)
  }

  ScheduleTodo(id){
    if(this.todo['duedate']){
      this.todo['duedate'] = moment(this.todo['startdate'], "YYYY-MM-DD").format("YYYY-MM-DD")
    }
    
    this.todo['_user'] = id
    this._mainService.ScheduleTodo(this.todo)
  }

  Toggleduedate(){
    this.todoHasDueDate = !this.todoHasDueDate
  }
  checkSession() {
    this._mainService.checkSession(
      (data) => {
        if (data) {
          //console.log("this works")
          //console.log(data)
          this.user = data
        }
        else {
          this._router.navigate(['/login']);
        }
      })
  }

  enddateAssesor(){
    if(this.goal['enddate']){
      console.log( moment(this.goal['enddate'], "YYYY-MM-DD").format("YYYY-MM-DD"))
      return moment(this.goal['enddate'], "YYYY-MM-DD").format("YYYY-MM-DD")
    }
    else{return null }
  }



  ngOnInit() {
    this.checkSession()
  }

}
