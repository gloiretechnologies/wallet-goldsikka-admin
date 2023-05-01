import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {ApiService} from '../../api.service';
import {HttpErrorResponse} from '@angular/common/http';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-event-invite-user',
  templateUrl: './event-invite-user.component.html',
  styleUrls: ['./event-invite-user.component.scss']
})
export class EventInviteUserComponent implements OnInit {
  errorMessage: string;
  isSubmitting: boolean;
  submitted: boolean;
  errors: object = {};
  eventInviteForm: FormGroup;

  constructor(private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private notification: NzNotificationService,
              private api: ApiService,
    private authService: AuthenticationService
              ) {

    this.eventInviteForm = this.fb.group({
      event_id: this.route.snapshot.paramMap.get('id'),
      events: this.fb.array([]),
    });
  }

  events(): FormArray {
    return this.eventInviteForm.get('events') as FormArray;
  }

  newEventUserList(): FormGroup {
    return this.fb.group({
      guest_name: ['', Validators.required],
      guest_mobile: ['', Validators.required],
    });
  }

  ngOnInit() {
     this.authService.checkAccess();

    this.addEventUser();
  }

  addEventUser() {
    this.events().push(this.newEventUserList());
  }

  removeEventUser(i: number) {
    if(this.eventInviteForm.get('events').value.length>1){
      this.events().removeAt(i);
    }else{
      alert('you can not delete this row');
    }
  }

  onSubmit() {
    // console.log(JSON.stringify(this.eventInviteForm.get('events').value));
    this.submitted = true;
    const events: any = this.eventInviteForm.get('events').value;
    const guestMobile = events.map(element => element.guest_mobile);
    const guestName = events.map(element => element.guest_name);
    const fd = new FormData();
    fd.append('guest_mobile', guestMobile);
    fd.append('guest_name', guestName);
    fd.append('event_id', this.eventInviteForm.value.event_id);

    if (!this.eventInviteForm.invalid) {
      this.api.post(`user/events/send-invitation`, fd)
        .subscribe((res: any) => {
            this.notification
              .blank(
                'Success',
                '' + res.message,
              )
              .onClick.subscribe(() => {
            });
            this.submitted = false;
            sessionStorage.setItem('desc', res.description);
            this.router.navigate(['/events']);
          },
          (err: HttpErrorResponse) => {
            this.isSubmitting = false;
            this.errorMessage = '';
            this.errors = {};
            if (err.error.errors) {
              this.errors = err.error.errors;
            }

            if (err.error.message.length) {
              this.errorMessage = err.error.message.toString();
            }
          });
    }
  }
}
