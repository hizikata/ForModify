import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CncProgramManagementComponent } from './cnc-program-management.component';

describe('CncProgramManagementComponent', () => {
  let component: CncProgramManagementComponent;
  let fixture: ComponentFixture<CncProgramManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CncProgramManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CncProgramManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
