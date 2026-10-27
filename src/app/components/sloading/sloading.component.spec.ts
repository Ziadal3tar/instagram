import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SLoadingComponent } from './sloading.component';

describe('SLoadingComponent', () => {
  let component: SLoadingComponent;
  let fixture: ComponentFixture<SLoadingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SLoadingComponent]
    });
    fixture = TestBed.createComponent(SLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
