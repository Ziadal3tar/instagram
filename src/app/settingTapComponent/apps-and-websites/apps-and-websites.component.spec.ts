import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppsAndWebsitesComponent } from './apps-and-websites.component';

describe('AppsAndWebsitesComponent', () => {
  let component: AppsAndWebsitesComponent;
  let fixture: ComponentFixture<AppsAndWebsitesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppsAndWebsitesComponent]
    });
    fixture = TestBed.createComponent(AppsAndWebsitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
