import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {GoldService} from "../../gold/gold.service";
import {SchemesService} from "../../schemes/schemes.service";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.scss']
})
export class EventInfoComponent implements OnInit {
  errorMessage: string;
  successMessage: string;
  isSubmitting: boolean;
  errors: object = {};
  filedata: any;
  submitted: boolean;
  isOthersType: boolean;
  isMarriageType: boolean;
  events: any = [];

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private goldService: GoldService,
    private schemeService: SchemesService,
    private http: HttpClient,
    private authService: AuthenticationService
    ) {

  }

  ngOnInit(): void {
     this.authService.checkAccess();

    this.getEventsData(this.route.snapshot.paramMap.get('id'));
  }

  getEventsData(id) {
    this.api.get(`user/events/get/` + id)
      .subscribe((res: any) => {
          this.events = res;
          if (res.event_type === 'MRG') {
            this.isMarriageType = true;
          }
          if (res.event_type === 'OTH') {
            this.isOthersType = true;
          }
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
