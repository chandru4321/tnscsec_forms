import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Table8 } from './table8';

describe('Table8', () => {
  let component: Table8;
  let fixture: ComponentFixture<Table8>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Table8]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Table8);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
