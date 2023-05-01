import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../api.service";
import {Router} from "@angular/router";
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-invitation-event-list',
  templateUrl: './invitation-event-list.component.html',
  styleUrls: ['./invitation-event-list.component.scss']
})
export class InvitationEventListComponent implements OnInit {
  eventList: any = [];
  page:number = 1;
  activeEventsList: object = {};
  isSubmitting: boolean;
  errorMessage: any;
  errors: any;
  successMessage: string;

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

  getActiveEventList(): void {
    this.api.get(`user/events/invitations?page=${this.page}`)
      .subscribe((res: any) => {
        this.activeEventsList = res;
        console.log(this.activeEventsList)
      });
  }

  deleteEvent(id) {
    this.api.delete(`user/events/delete/` + id)
      .subscribe((res: any) => {
        this.getActiveEventList();
      });
  }

  pageChanged(pageNumber:number) {
    this.page = pageNumber;
    this.getActiveEventList();
  }
getId(event_id){
this.errors = [];
    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitting = true;
  let id =event_id;
  if(id!=null){
 this.api.get(`user/events/validation/${id}`)
      .subscribe((res: any) =>{
        console.log(res)
                      this.router.navigate([`events/${id}/event-pay`]);
                         
                },
                (err) => {

                    this.errors = err.error.errors;
                    this.errorMessage = '';

                    if (err.error.message.length) {
                        this.errorMessage = err.error.message.toString();

                         Swal.fire({
      title: this.errorMessage,
      text: '',
      icon: 'question',
          confirmButtonColor: '#1a2e22',
      showCancelButton: true,
      
    })
                       console.log(this.errorMessage)
                    }
                    else{
                    
                      this.router.navigate([`events/${id}/event-pay`]);
                    }

                    this.isSubmitting = false;
                });

  }
 
}
}
