import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Formt2 } from './formt2';

describe('Formt2', () => {
  let component: Formt2;
  let fixture: ComponentFixture<Formt2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Formt2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Formt2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
