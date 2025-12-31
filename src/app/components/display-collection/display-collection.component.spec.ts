import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayCollectionComponent } from './display-collection.component';

describe('DisplayCollectionComponent', () => {
  let component: DisplayCollectionComponent;
  let fixture: ComponentFixture<DisplayCollectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayCollectionComponent]
    });
    fixture = TestBed.createComponent(DisplayCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
