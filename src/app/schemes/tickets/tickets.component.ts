import {Component, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {GoldService} from "../../gold/gold.service";
import {SchemesService} from "../schemes.service";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {NzNotificationService} from "ng-zorro-antd/notification";
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {
  accountErrorMessage: string;
  errorMessage: string;
  successMessage: string;
  isSubmitting: boolean;
  errors: object = {};
  submitted: boolean;
  quantityInGrams: number;
  currentGoldPricePerGram: number;
  schemeCalculationType: string;
  schemes: any = [];
  gstPercentage: number = environment.gstPercentage;
  schemeValues: any = [];
  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    mobile: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(10), Validators.maxLength(10)]),
    message: new FormControl('', [Validators.required]),
    scheme_id: new FormControl(this.route.snapshot.paramMap.get('id'), [Validators.required]),
  });

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private goldService: GoldService,
    private schemeService: SchemesService,
    private http: HttpClient,
    private notification: NzNotificationService,
    private authService: AuthenticationService

  ) {
  }

  ngOnInit(): void {
     this.authService.checkAccess();

  }

  onSubmit(): void {
    this.errorMessage = '';
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.errors = [];
    this.errorMessage = '';
    this.isSubmitting = true;
    this.api.post(`tickets/add`, this.form.value)
      .subscribe((r: any) => {
          this.isSubmitting = false;
          this.notification
            .blank(
              'Success',
              'Ticket Raised successfully.Please Wait approve the admin Approval'
            )
            .onClick.subscribe(() => {
            console.log('Coupon Code!');
          });
          this.router.navigate(['/schemes']);
        },
        (err: HttpErrorResponse) => {
          this.isSubmitting = false;
          this.errors = err.error.errors;
          this.errorMessage = '';
          this.errors = {};
          if (err.error.errors) {
            this.errors = err.error.errors;
          }
          if (err.error.message && err.error.message.length) {
            this.errorMessage = err.error.message.toString();
          }
          this.isSubmitting = false;
        });
  }

  get f() {
    return this.form.controls;
  }
}
