import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatYouSeeComponent } from './what-you-see.component';

describe('WhatYouSeeComponent', () => {
  let component: WhatYouSeeComponent;
  let fixture: ComponentFixture<WhatYouSeeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WhatYouSeeComponent]
    });
    fixture = TestBed.createComponent(WhatYouSeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
