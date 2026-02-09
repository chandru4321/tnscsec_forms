import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Form10 } from './form10';

describe('Form10', () => {
  let component: Form10;
  let fixture: ComponentFixture<Form10>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Form10]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Form10);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
