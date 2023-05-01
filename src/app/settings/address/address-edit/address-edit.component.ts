import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../api.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-address-edit',
  templateUrl: './address-edit.component.html',
  styleUrls: ['./address-edit.component.scss']
})
export class AddressEditComponent implements OnInit {

  submitted: boolean;
  isSubmitting: boolean;
  addressDetails = null;

  states: [] = [];
  errorMessage: string;
  successMessage: string;
  errors: object = {};
  name: string;
  form: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state_id: new FormControl('', [Validators.required]),
    zip: new FormControl('', [Validators.required, Validators.pattern('^[1-9][0-9]{5}$'), Validators.min(6)]),
  });

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService

  ) {
  }

  ngOnInit(): void {
     this.authService.checkAccess();
    
    this.errorMessage = '';
    this.successMessage = '';
    this.getAddressData(this.route.snapshot.paramMap.get('id'));
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
    this.updateAddressData();


  }

  //Get Address
  getAddressData(id): void {
    this.api.get(`user/address/` + id)
      .subscribe((res: any) => {
        this.addressDetails = res;
        this.form.get('address').setValue(res.address);
        this.form.get('city').setValue(res.city);
        this.form.get('zip').setValue(res.zip);
        this.form.get('title').setValue(res.title);
        this.form.get('state_id').setValue(res.state_id);
      });
  }

  //Update Address

  updateAddressData(): void {
    this.api.post(`user/address/` + this.addressDetails.id, this.form.value)
      .subscribe((res: any) => {
          this.errors = [];
          this.isSubmitting = false;
          this.submitted = false;
          this.successMessage = 'Address Updated Successfully';
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


  getStates() {
    this.api.get(`states`)
      .subscribe((res: any) => {
        this.states = res;
      });
  }
}

