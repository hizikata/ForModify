import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentMalfunctionBoardComponent } from './equipment-malfunction-board.component';

describe('EquipmentMalfunctionBoardComponent', () => {
  let component: EquipmentMalfunctionBoardComponent;
  let fixture: ComponentFixture<EquipmentMalfunctionBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentMalfunctionBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentMalfunctionBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
