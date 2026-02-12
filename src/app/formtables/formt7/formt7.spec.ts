import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Formt7 } from './formt7';

describe('Formt7', () => {
  let component: Formt7;
  let fixture: ComponentFixture<Formt7>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Formt7]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Formt7);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
