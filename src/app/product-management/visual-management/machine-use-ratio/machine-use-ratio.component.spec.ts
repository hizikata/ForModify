import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineUseRatioComponent } from './machine-use-ratio.component';

describe('MachineUseRatioComponent', () => {
  let component: MachineUseRatioComponent;
  let fixture: ComponentFixture<MachineUseRatioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineUseRatioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineUseRatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
