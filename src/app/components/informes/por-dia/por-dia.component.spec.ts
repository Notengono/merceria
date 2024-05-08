import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PorDiaComponent } from './por-dia.component';

describe('PorDiaComponent', () => {
  let component: PorDiaComponent;
  let fixture: ComponentFixture<PorDiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PorDiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PorDiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
