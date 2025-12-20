import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Form1edit } from './form1edit';

describe('Form1edit', () => {
  let component: Form1edit;
  let fixture: ComponentFixture<Form1edit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Form1edit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Form1edit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
