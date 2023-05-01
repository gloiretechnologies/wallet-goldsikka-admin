import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../api.service';
import {Router} from '@angular/router';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {

  eventList: any = [];
  page = 1;
  activeEventsList: object = {};

  constructor(
    private api: ApiService,
    private router: Router,
    private authService: AuthenticationService,

  ) {
  }

  ngOnInit(): void {
     this.authService.checkAccess();

    this.getActiveEventList();
  }

  pageChanged(pageNumber) {
    this.page = pageNumber;
    this.getActiveEventList();
  }


  getActiveEventList(): void {
    this.api.get(`user/events/list?page=${this.page}`)
      .subscribe((res: any) => {
        this.activeEventsList = res;
      });
  }

  deleteEvent(id) {
    if (confirm('Are you sure you want to delete this Event?')) {
      this.api.delete(`user/events/delete/` + id)
        .subscribe((res: any) => {
          this.getActiveEventList();
        });
    }
  }
}
