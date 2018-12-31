import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffEfficiencyDisplayComponent } from './staff-efficiency-display.component';

describe('StaffEfficiencyDisplayComponent', () => {
  let component: StaffEfficiencyDisplayComponent;
  let fixture: ComponentFixture<StaffEfficiencyDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffEfficiencyDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffEfficiencyDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
