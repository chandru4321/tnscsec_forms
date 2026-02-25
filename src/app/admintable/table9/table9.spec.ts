import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Table9 } from './table9';

describe('Table9', () => {
  let component: Table9;
  let fixture: ComponentFixture<Table9>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Table9]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Table9);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
