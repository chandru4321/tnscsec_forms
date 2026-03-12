import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Form5b } from './form5b';

describe('Form5b', () => {
  let component: Form5b;
  let fixture: ComponentFixture<Form5b>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Form5b]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Form5b);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
