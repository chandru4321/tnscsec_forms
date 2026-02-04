import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Form6 } from './form6';

describe('Form6', () => {
  let component: Form6;
  let fixture: ComponentFixture<Form6>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Form6]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Form6);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
