import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Formt6 } from './formt6';

describe('Formt6', () => {
  let component: Formt6;
  let fixture: ComponentFixture<Formt6>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Formt6]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Formt6);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
