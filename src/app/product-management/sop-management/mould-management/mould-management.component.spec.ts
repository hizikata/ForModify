import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouldManagementComponent } from './mould-management.component';

describe('MouldManagementComponent', () => {
  let component: MouldManagementComponent;
  let fixture: ComponentFixture<MouldManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouldManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouldManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
