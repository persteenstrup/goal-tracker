import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastchanceComponent } from './lastchance.component';

describe('LastchanceComponent', () => {
  let component: LastchanceComponent;
  let fixture: ComponentFixture<LastchanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastchanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastchanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
