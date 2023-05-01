import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventCreateComponent } from './event-create/event-create.component';
import { EventInfoComponent } from './event-info/event-info.component';
import { EventInviteUserComponent } from './event-invite-user/event-invite-user.component';
import { EventInviteUserListComponent } from './event-invite-user-list/event-invite-user-list.component';
import { EventListComponent } from './event-list/event-list.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { InvitedEventPayComponent } from './invited-event-pay/invited-event-pay.component';
import { EventUpdateComponent } from './event-update/event-update.component';
import { InvitationEventListComponent } from './invitation-event-list/invitation-event-list.component';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from "@angular/router";



@NgModule({
  declarations: [EventCreateComponent, EventInfoComponent, EventInviteUserComponent, EventInviteUserListComponent, EventListComponent, InvitedEventPayComponent, EventUpdateComponent, InvitationEventListComponent],
  imports: [
    CommonModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class EventsModule { }
