import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Form5 } from './form5';

describe('Form5', () => {
  let component: Form5;
  let fixture: ComponentFixture<Form5>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Form5]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Form5);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
