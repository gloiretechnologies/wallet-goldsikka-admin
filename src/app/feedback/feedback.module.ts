import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedBackCreateComponent } from './feed-back-create/feed-back-create.component';
import { FeedBackListComponent } from './feed-back-list/feed-back-list.component';
import { FeedBackUpdateComponent } from './feed-back-update/feed-back-update.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [FeedBackCreateComponent, FeedBackListComponent, FeedBackUpdateComponent],
  imports: [
    CommonModule,
    NgxPaginationModule,
    RouterModule,
    ReactiveFormsModule
  ]
})
export class FeedbackModule { }
