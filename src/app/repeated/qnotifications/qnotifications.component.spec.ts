import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QnotificationsComponent } from './qnotifications.component';

describe('QnotificationsComponent', () => {
  let component: QnotificationsComponent;
  let fixture: ComponentFixture<QnotificationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QnotificationsComponent]
    });
    fixture = TestBed.createComponent(QnotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
