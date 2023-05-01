import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { promise } from 'selenium-webdriver';
import { ApiService } from '../../api.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';

@Component({
  selector: 'app-transaction-successful',
  templateUrl: './transaction-successful.component.html',
  styleUrls: ['./transaction-successful.component.scss'],
})
export class TransactionSuccessfulComponent implements OnInit {
  transactionId: string;
  description: string;
  schemeTransactionModal: boolean;
  data: any;
  response: any;
  successMessage: string;
  schemeTransactionModal_after: boolean;
  form1=new FormGroup({
    message: new FormControl('',[Validators.required]),
    rating: new FormControl('',[Validators.required])
  })

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {
    
  }

  ngOnInit(): void {
    this.description = sessionStorage.getItem('desc');
    sessionStorage.removeItem('desc');
    sessionStorage.clear();
    if (this.description != null) {
      this.schemeTransactionModal = true;
    }
  }

  hideSchemeTransactionModal() {
    this.schemeTransactionModal = false;
    this.schemeTransactionModal_after=false;

  }
  close() {
    this.schemeTransactionModal = false;
    this.schemeTransactionModal_after=false;

  }

  form = new FormGroup({
    message: new FormControl(''),
    rating: new FormControl(''),
  });

  onsubmit_form() {
    const data = this.form1.value;
    // console.log(data);
    this.api.post(`user/testimonials/add`, data).subscribe((res: any) => {
          this.form.reset();
    this.schemeTransactionModal = false;
    this.schemeTransactionModal_after=true;


      this.response = res;
      console.log('res',this.response);
    });
  }
 
}