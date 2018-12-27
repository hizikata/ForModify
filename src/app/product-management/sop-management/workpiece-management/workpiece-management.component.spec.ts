import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkpieceManagementComponent } from './workpiece-management.component';

describe('WorkpieceManagementComponent', () => {
  let component: WorkpieceManagementComponent;
  let fixture: ComponentFixture<WorkpieceManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkpieceManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkpieceManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
