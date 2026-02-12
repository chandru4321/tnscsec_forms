import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Formt8 } from './formt8';

describe('Formt8', () => {
  let component: Formt8;
  let fixture: ComponentFixture<Formt8>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Formt8]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Formt8);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
