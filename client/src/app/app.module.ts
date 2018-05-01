import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { MainService } from './main.service';
import { HomeComponent } from './home/home.component';
import { AddGoalTodoComponent } from './add-goal-todo/add-goal-todo.component';
import { LastchanceComponent } from './lastchance/lastchance.component';
import { MomentModule } from 'angular2-moment';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    AddGoalTodoComponent,
    LastchanceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    FormsModule,
    MomentModule

  ],
  providers: [MainService],
  bootstrap: [AppComponent]
})
export class AppModule { }
