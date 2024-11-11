import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensualMontosComponent } from './mensual-montos.component';

describe('MensualMontosComponent', () => {
  let component: MensualMontosComponent;
  let fixture: ComponentFixture<MensualMontosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MensualMontosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MensualMontosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
