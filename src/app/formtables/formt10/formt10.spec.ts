import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Formt10 } from './formt10';

describe('Formt10', () => {
  let component: Formt10;
  let fixture: ComponentFixture<Formt10>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Formt10]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Formt10);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
