import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrecioPorProductoComponent } from './precio-por-producto.component';

describe('PrecioPorProductoComponent', () => {
  let component: PrecioPorProductoComponent;
  let fixture: ComponentFixture<PrecioPorProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrecioPorProductoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrecioPorProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
