import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGoalTodoComponent } from './add-goal-todo.component';

describe('AddGoalTodoComponent', () => {
  let component: AddGoalTodoComponent;
  let fixture: ComponentFixture<AddGoalTodoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGoalTodoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGoalTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
