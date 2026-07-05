import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Table5b } from './table5b';

describe('Table5b', () => {
  let component: Table5b;
  let fixture: ComponentFixture<Table5b>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Table5b]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Table5b);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
