import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensualProductosComponent } from './mensual-productos.component';

describe('MensualProductosComponent', () => {
  let component: MensualProductosComponent;
  let fixture: ComponentFixture<MensualProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MensualProductosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MensualProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
