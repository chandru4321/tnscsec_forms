import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Formt5 } from './formt5';

describe('Formt5', () => {
  let component: Formt5;
  let fixture: ComponentFixture<Formt5>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Formt5]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Formt5);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
