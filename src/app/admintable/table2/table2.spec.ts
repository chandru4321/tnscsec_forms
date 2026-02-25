import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Table2 } from './table2';

describe('Table2', () => {
  let component: Table2;
  let fixture: ComponentFixture<Table2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Table2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Table2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
