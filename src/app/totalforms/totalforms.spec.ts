import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Totalforms } from './totalforms';

describe('Totalforms', () => {
  let component: Totalforms;
  let fixture: ComponentFixture<Totalforms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Totalforms]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Totalforms);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
