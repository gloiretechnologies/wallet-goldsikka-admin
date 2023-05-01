import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {GoldService} from "../../gold/gold.service";
import {SchemesService} from "../../schemes/schemes.service";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {NzNotificationService} from "ng-zorro-antd/notification";
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-feed-back-update',
  templateUrl: './feed-back-update.component.html',
  styleUrls: ['./feed-back-update.component.scss']
})
export class FeedBackUpdateComponent implements OnInit {

  errorMessage: string;
  successMessage: string;
  isSubmitting: boolean;
  errors: object = {};
  submitted: boolean;
  testiMonialDetails: any = [];
  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    mobile_no: new FormControl('', [Validators.required, Validators.min(10)]),
    message: new FormControl('', [Validators.required]),
  });

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private goldService: GoldService,
    private schemeService: SchemesService,
    private http: HttpClient,
    private notification: NzNotificationService,
    private authService: AuthenticationService,

  ) {
  }

  ngOnInit(): void {
     this.authService.checkAccess();

    this.getTestmonials();
  }

  /**
   *
   */
  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';
    if (this.form.invalid) {
      return;
    }
    this.isSubmitting = true;
    this.api.post(`user/testimonials/` + this.route.snapshot.paramMap.get('id'), this.form.value)
      .subscribe((r: any) => {
          this.isSubmitting = false;
          this.submitted = false;
          this.getTestmonials();
          this.notification
            .blank(
              'Success',
              '' + r.message
            )
            .onClick.subscribe(() => {
          });
          this.router.navigate(['/feedback']);
        },
        (err: HttpErrorResponse) => {
          this.errors = err.error.errors;
          if (err.error.message.length) {
            this.errorMessage = err.error.message.toString();
          }
          this.isSubmitting = false;
        });
  }

  getTestmonials(): void {
    this.api.get(`user/testimonials/` + this.route.snapshot.paramMap.get('id'))
      .subscribe((res: any) => {
        this.testiMonialDetails = res;
        this.form.get('name').setValue(res.name);
        this.form.get('email').setValue(res.email);
        this.form.get('mobile_no').setValue(res.mobile_no);
        this.form.get('message').setValue(res.message);
      });
  }

  get f() {
    return this.form.controls;
  }
}
