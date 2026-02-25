import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Table10 } from './table10';

describe('Table10', () => {
  let component: Table10;
  let fixture: ComponentFixture<Table10>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Table10]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Table10);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
