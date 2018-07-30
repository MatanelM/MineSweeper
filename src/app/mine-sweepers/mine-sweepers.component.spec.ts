import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MineSweepersComponent } from './mine-sweepers.component';

describe('MineSweepersComponent', () => {
  let component: MineSweepersComponent;
  let fixture: ComponentFixture<MineSweepersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MineSweepersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MineSweepersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
