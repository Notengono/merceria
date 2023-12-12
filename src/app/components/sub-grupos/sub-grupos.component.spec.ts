import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubGruposComponent } from './sub-grupos.component';

describe('SubGruposComponent', () => {
  let component: SubGruposComponent;
  let fixture: ComponentFixture<SubGruposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubGruposComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubGruposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
