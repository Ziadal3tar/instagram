import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingBTNComponent } from './loading-btn.component';

describe('LoadingBTNComponent', () => {
  let component: LoadingBTNComponent;
  let fixture: ComponentFixture<LoadingBTNComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingBTNComponent]
    });
    fixture = TestBed.createComponent(LoadingBTNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
