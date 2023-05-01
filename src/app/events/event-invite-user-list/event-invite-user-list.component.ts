import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../api.service";
import {ActivatedRoute, Router} from "@angular/router";
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-event-invite-user-list',
  templateUrl: './event-invite-user-list.component.html',
  styleUrls: ['./event-invite-user-list.component.scss']
})
export class EventInviteUserListComponent implements OnInit {

  eventList: any = [];
  page: number = 1;
  activeEventsList: object = {};

  constructor(
    private authService: AuthenticationService,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
     this.authService.checkAccess();

    this.getActiveInviteEventList();
  }

  pageChanged(pageNumber) {
    this.page = pageNumber;
    this.getActiveInviteEventList();
  }


  getActiveInviteEventList(): void {
    this.api.get(`user/events/invited-list/` + this.route.snapshot.paramMap.get('id') + `?page=${this.page}`)
      .subscribe((res: any) => {
        this.activeEventsList = res;
        // alert(res.description);
        sessionStorage.setItem('desc', res.description);
      });
  }

  deleteEvent(id) {
    this.api.delete(`user/events/delete/` + id)
      .subscribe((res: any) => {
        this.getActiveInviteEventList();
      });
  }
}
