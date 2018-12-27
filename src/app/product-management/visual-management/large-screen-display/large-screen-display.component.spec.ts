import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LargeScreenDisplayComponent } from './large-screen-display.component';

describe('LargeScreenDisplayComponent', () => {
  let component: LargeScreenDisplayComponent;
  let fixture: ComponentFixture<LargeScreenDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LargeScreenDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LargeScreenDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
