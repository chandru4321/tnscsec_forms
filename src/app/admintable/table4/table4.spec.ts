import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Table4 } from './table4';

describe('Table4', () => {
  let component: Table4;
  let fixture: ComponentFixture<Table4>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Table4]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Table4);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
