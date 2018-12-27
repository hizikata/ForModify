import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanSchedulingComponent } from './plan-scheduling.component';

describe('PlanSchedulingComponent', () => {
  let component: PlanSchedulingComponent;
  let fixture: ComponentFixture<PlanSchedulingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanSchedulingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanSchedulingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
