import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Form4 } from './form4';

describe('Form4', () => {
  let component: Form4;
  let fixture: ComponentFixture<Form4>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Form4]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Form4);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
