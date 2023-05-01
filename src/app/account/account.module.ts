import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from './dashboard/dashboard.component';
import {PassbookComponent} from './passbook/passbook.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {NgxPaginationModule} from 'ngx-pagination';
import {NzNotificationModule} from 'ng-zorro-antd/notification';
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [DashboardComponent, PassbookComponent],
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule,
        NgxPaginationModule,
        NzNotificationModule,
        ReactiveFormsModule
    ]
})
export class AccountModule {
}
