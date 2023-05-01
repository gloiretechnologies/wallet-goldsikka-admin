import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../api.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from "@angular/router";
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';
@Component({
  selector: 'app-address-add',
  templateUrl: './address-add.component.html',
  styleUrls: ['./address-add.component.scss']
})
export class AddressAddComponent implements OnInit {

  submitted: boolean;
  isSubmitting: boolean;
  profileDetails = null;

  errorMessage: string;
  successMessage: string;
  errors: object = {};
  name: string;
  states: [] = [];
  private profileId: string;

  form: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state_id: new FormControl('', [Validators.required]),
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
    this.api.post(`user/address`, this.form.value)
      .subscribe((res: any) => {
          this.isSubmitting = false;
          this.submitted = false;
          this.form.reset();
          this.successMessage = 'Address Added Successfully';
          this.router.navigate(['/settings/addresses']);
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
        this.profileDetails = res;
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
}

