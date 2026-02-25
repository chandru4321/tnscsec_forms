import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Table5 } from './table5';

describe('Table5', () => {
  let component: Table5;
  let fixture: ComponentFixture<Table5>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Table5]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Table5);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
