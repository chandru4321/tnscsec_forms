import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Formt9 } from './formt9';

describe('Formt9', () => {
  let component: Formt9;
  let fixture: ComponentFixture<Formt9>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Formt9]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Formt9);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
