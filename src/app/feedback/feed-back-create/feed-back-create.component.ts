import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {GoldService} from '../../gold/gold.service';
import {SchemesService} from '../../schemes/schemes.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {NzNotificationService} from "ng-zorro-antd/notification";
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-feed-back-create',
  templateUrl: './feed-back-create.component.html',
  styleUrls: ['./feed-back-create.component.scss']
})
export class FeedBackCreateComponent implements OnInit {

  errorMessage: string;
  successMessage: string;
  isSubmitting: boolean;
  errors: object = {};
  submitted: boolean;
  profileDetails: any = [];
  ratingRequired:boolean;
  form: FormGroup = new FormGroup({
    message: new FormControl('', [Validators.required]),
    rating: new FormControl('', [Validators.required, Validators.min(0.5)]),
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

  }

  /**
   *
   */
  onSubmit(): void {
    this.submitted = true;
this.ratingRequired=true;
    if (this.form.invalid) {
      return;
    }
    this.isSubmitting = true;
    this.api.post(`user/testimonials/add`, this.form.value)
      .subscribe((r: any) => {
          this.isSubmitting = false;

          this.submitted = false;
          this.form.reset();
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
  get f() {
    return this.form.controls;
  }

  rating(e) {
     console.log(e.target.value);
    // if(e.target.valu==0) {
    //   this.form.controls["rating"].setValidators([Validators.required]);
    // }
  }
}
