import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTreatmentComponent } from './new-treatment.component';

describe('NewTreatmentComponent', () => {
  let component: NewTreatmentComponent;
  let fixture: ComponentFixture<NewTreatmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTreatmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTreatmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
