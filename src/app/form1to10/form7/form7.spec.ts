import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Form7 } from './form7';

describe('Form7', () => {
  let component: Form7;
  let fixture: ComponentFixture<Form7>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Form7]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Form7);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
