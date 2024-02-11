import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourCollectionsComponent } from './your-collections.component';

describe('YourCollectionsComponent', () => {
  let component: YourCollectionsComponent;
  let fixture: ComponentFixture<YourCollectionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [YourCollectionsComponent]
    });
    fixture = TestBed.createComponent(YourCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
