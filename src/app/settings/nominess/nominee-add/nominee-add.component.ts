import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../../api.service";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-nominee-add',
  templateUrl: './nominee-add.component.html',
  styleUrls: ['./nominee-add.component.scss']
})
export class NomineeAddComponent implements OnInit {

  submitted: boolean;
  isSubmitting: boolean;
  nomineeDetails = null;

  errorMessage: string;
  successMessage: string;
  errors: object = {};
  name: string;
  states: [] = [];
  countries: [] = [];
  private profileId: string;
  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state_id: new FormControl('', [Validators.required]),
    country_id: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    relation: new FormControl('', [Validators.required]),
    zip: new FormControl('', [Validators.required, Validators.pattern('^[1-9][0-9]{5}$'), Validators.min(6)]),
  });

  constructor(
    private api: ApiService,
    private router: Router,
    private authService: AuthenticationService

    
  ) {
  }

  ngOnInit(): void {
     this.authService.checkAccess();

    this.getProfile();
    this.getStates();
    this.getCountries();
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errors = [];
    this.errorMessage = '';
    this.successMessage = '';
    this.api.post(`user/nominee`, this.form.value)
      .subscribe((res: any) => {
          this.isSubmitting = false;
          this.submitted = false;
          this.form.reset();
          this.successMessage = 'Nominee Added Successfully';
          this.router.navigate(['/settings/nominees']);
        },
        (err: HttpErrorResponse) => {
          this.errors = err.error.errors;
          if (err.error.message.length) {
            this.errorMessage = err.error.message.toString();
          }
          this.isSubmitting = false;
        });

  }

  getProfile(): void {
    this.api.get(`user/profile`)
      .subscribe((res: any) => {
        this.nomineeDetails = res;
      });
  }

  get f() {
    return this.form.controls;
  }

  getStates() {
    this.api.get(`states`)
      .subscribe((res: any) => {
        this.states = res;
      });
  }

  getCountries() {
    this.api.get(`countries`)
      .subscribe((res: any) => {
        this.countries = res;
        this.form.get('country_id').setValue(99);
      });
  }

}
