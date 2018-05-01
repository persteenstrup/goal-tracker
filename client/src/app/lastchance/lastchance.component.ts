import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-lastchance',
  templateUrl: './lastchance.component.html',
  styleUrls: ['./lastchance.component.css']
})
export class LastchanceComponent implements OnInit, OnDestroy {
  user: Object
  constructor(private _mainService: MainService, private _router: Router) {
    this.user = { fname: "", lname: "", email: "", pswd: "",_mygoals:[{pending:[]}], };
   }

  CompletedGoal(goal_id,date,goal_idx){
    //Index will change as goals/events/actions are completed the specific overdue index must be found each time
    let OverDueIdx = this.FindOverDueIndex(date,goal_idx)
    //remove completed goal THIS SHOULD BE MOVED TO THE SERVICE
    this.user['_mygoals'][goal_idx]['overdue'].splice(OverDueIdx,1)
    this._mainService.CompletedGoal(goal_id,date)
  }

  FindOverDueIndex(date,goal_idx){
    let idx = this.user['_mygoals'][goal_idx]['overdue'].findIndex(function(item)
    {return item == date})
    return idx
  }

  FailOverdue(){
    this.FailHelp(this.user, 
      (i)=> 
      {this._router.navigate(['/'])
      console.log('fail overdue redirect',i)}
    )
  }

  FailHelp(user,callback){
    for(var i=0;i<user['_mygoals'].length;i++){
      console.log(i)
      if(user['_mygoals'][i]['overdue'].length > 0){
        console.log(user['_mygoals'][i]['overdue'])
        this._mainService.FailOverdue(user['_mygoals'][i]['_id'],
        (res) => {
          if(res){console.log('got response')}
          else{i =10000}
          }
        )
      }
    }
    callback(i)
  }
  
  ngOnInit() {
    this._mainService.userChange.subscribe(
      (res) => {this.user = res}
    )
    console.log(this.user)
  }

  ngOnDestroy(){
    console.log('destroying last chance component')
    //this._mainService.userChange.unsubscribe()
    //this._mainService.RemoveCompleted()
  }

}


// findUserIndex(id){
//   let idx = this.users.findIndex(function(item)
//       {return item['_id'] == id})
//  return idx
// }