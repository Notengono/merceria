import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfPresupuestoComponent } from './inf-presupuesto.component';

describe('InfPresupuestoComponent', () => {
  let component: InfPresupuestoComponent;
  let fixture: ComponentFixture<InfPresupuestoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfPresupuestoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfPresupuestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
