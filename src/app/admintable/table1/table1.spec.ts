import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Table1 } from './table1';

describe('Table1', () => {
  let component: Table1;
  let fixture: ComponentFixture<Table1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Table1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Table1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
