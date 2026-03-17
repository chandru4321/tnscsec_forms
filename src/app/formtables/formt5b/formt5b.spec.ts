import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Formt5b } from './formt5b';

describe('Formt5b', () => {
  let component: Formt5b;
  let fixture: ComponentFixture<Formt5b>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Formt5b]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Formt5b);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
