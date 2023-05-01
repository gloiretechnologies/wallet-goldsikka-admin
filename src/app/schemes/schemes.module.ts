import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {SchemesListComponent} from './schemes-list/schemes-list.component';
import {RouterModule} from '@angular/router';
import {SchemeUserListComponent} from './scheme-user-list/scheme-user-list.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {SchemeSubscribeComponent} from './scheme-subscribe/scheme-subscribe.component';
import {MyGoldFormComponent} from './forms/my-gold-form/my-gold-form.component';
import {JewelleryFormComponent} from './forms/jewellery-form/jewellery-form.component';
import { UserSchemeInfoComponent } from './user-scheme-info/user-scheme-info.component';
import { TicketsComponent } from './tickets/tickets.component';
import { TicketsListComponent } from './tickets-list/tickets-list.component';
import {NzModalModule} from "ng-zorro-antd/modal";
import { CouponModule } from '../coupon/coupon.module';


@NgModule({
  declarations: [SchemesListComponent, SchemeUserListComponent, SchemeSubscribeComponent, MyGoldFormComponent, JewelleryFormComponent, UserSchemeInfoComponent, TicketsComponent, TicketsListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NgxPaginationModule,
    NzModalModule,
    CouponModule
  ]
})
export class SchemesModule {
}
