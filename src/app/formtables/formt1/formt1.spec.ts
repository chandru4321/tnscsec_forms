import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Formt1 } from './formt1';

describe('Formt1', () => {
  let component: Formt1;
  let fixture: ComponentFixture<Formt1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Formt1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Formt1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
