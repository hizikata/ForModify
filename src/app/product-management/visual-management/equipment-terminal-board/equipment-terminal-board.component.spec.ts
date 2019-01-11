import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentTerminalBoardComponent } from './equipment-terminal-board.component';

describe('EquipmentTerminalBoardComponent', () => {
  let component: EquipmentTerminalBoardComponent;
  let fixture: ComponentFixture<EquipmentTerminalBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentTerminalBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentTerminalBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
