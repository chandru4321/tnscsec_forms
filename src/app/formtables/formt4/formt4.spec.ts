import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Formt4 } from './formt4';

describe('Formt4', () => {
  let component: Formt4;
  let fixture: ComponentFixture<Formt4>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Formt4]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Formt4);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
