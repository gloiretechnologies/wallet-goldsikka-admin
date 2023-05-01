import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOrganizationListComponent } from './user-organization-list.component';

describe('UserOrganizationListComponent', () => {
  let component: UserOrganizationListComponent;
  let fixture: ComponentFixture<UserOrganizationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserOrganizationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOrganizationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
