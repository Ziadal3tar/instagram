import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisionComponent } from './supervision.component';

describe('SupervisionComponent', () => {
  let component: SupervisionComponent;
  let fixture: ComponentFixture<SupervisionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupervisionComponent]
    });
    fixture = TestBed.createComponent(SupervisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
