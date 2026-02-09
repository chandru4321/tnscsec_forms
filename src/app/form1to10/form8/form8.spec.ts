import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Form8 } from './form8';

describe('Form8', () => {
  let component: Form8;
  let fixture: ComponentFixture<Form8>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Form8]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Form8);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
