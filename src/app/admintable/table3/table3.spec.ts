import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Table3 } from './table3';

describe('Table3', () => {
  let component: Table3;
  let fixture: ComponentFixture<Table3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Table3]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Table3);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
