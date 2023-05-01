import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {NgxPaginationModule} from 'ngx-pagination';
import {NzNotificationModule} from 'ng-zorro-antd/notification';
import { UserDonateOrganizationComponent } from './user-donate-organization/user-donate-organization.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { OrganizationViewComponent } from './organization-view/organization-view.component';
import { UserOrganizationListComponent } from './user-organization-list/user-organization-list.component';



@NgModule({
  declarations: [UserDonateOrganizationComponent, OrganizationViewComponent, UserOrganizationListComponent],
  imports: [
      CommonModule,
      BrowserModule,
      RouterModule,
      NgxPaginationModule,
      NzNotificationModule,
      ReactiveFormsModule,

  ]
})
export class OrganizationModule { }
