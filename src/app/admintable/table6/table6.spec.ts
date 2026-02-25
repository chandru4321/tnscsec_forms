import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Table6 } from './table6';

describe('Table6', () => {
  let component: Table6;
  let fixture: ComponentFixture<Table6>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Table6]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Table6);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
