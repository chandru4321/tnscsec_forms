import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Table7 } from './table7';

describe('Table7', () => {
  let component: Table7;
  let fixture: ComponentFixture<Table7>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Table7]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Table7);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
