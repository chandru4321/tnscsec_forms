import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Formt3 } from './formt3';

describe('Formt3', () => {
  let component: Formt3;
  let fixture: ComponentFixture<Formt3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Formt3]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Formt3);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
