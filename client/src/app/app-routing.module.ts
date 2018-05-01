import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AddGoalTodoComponent } from './add-goal-todo/add-goal-todo.component';
import { LastchanceComponent } from './lastchance/lastchance.component';

const routes: Routes = [
  {path:'login', component: LoginComponent},
  {path:'', component: HomeComponent},
  {path:'setgoal', component:AddGoalTodoComponent},
  {path:'lastchance', component:LastchanceComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
