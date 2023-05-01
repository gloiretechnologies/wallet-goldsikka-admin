import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from '../../api.service';
import {WishlistserviceService} from '../../_services/wishlistservice.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {HttpErrorResponse} from "@angular/common/http";
import {AccountService} from "../../account/account.service";
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ThisReceiver } from '@angular/compiler';
import { threadId } from 'worker_threads';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  public isCollapsed = false;
successMessage: string;
  errorMessage: string;
  isSubmitting: boolean;
  submitted = false;
  wishlistcall :any = [];
  currentBalance:any;
  currentweight:any;
  productname:any;
  pids: any;
 weight:any;
 iids:any;
 sum:any;
 rem:any;
 validerror: any;
 addgold:any;
    gms_bal:any;  
  width:any;
  avaible_balance:any;
  schemeTransactionModal: boolean;
  public response: any;
  totalby:any;
public storepid:any;
  currentbalance:any;
  currentblns:any;

  constructor(
    private modalService: NgbModal,
  private api: ApiService,
   private route:Router,
    private accountService: AccountService,
  ) { }

   form = new FormGroup({
     addgold: new FormControl(''),
    });
  
  get f(){
    return this.form.controls;
  }
  

  ngOnInit(): void {
    this.getInfo();
     this.width= 100;

    this.getAvailableBalance();
  }

  // poststatus(pids)
  // {
  //     let id=pids;
  // console.log(pids)
  //   this.api.put(`Jewellery/wishlist/${id}`)
  //     .subscribe((r: any) => {
  //       this.response = r;
        
  //     }); 
  //   this.schemeTransactionModal = false;

  // }
  
  openVerticallyCentered() {
    
  
this.schemeTransactionModal = true;
    
  }
   hideSchemeTransactionModal(pids) {
      
    //  console.log(pname);
   let currentUrl = this.route.url;
      this.route.routeReuseStrategy.shouldReuseRoute = () => false;
      this.route.onSameUrlNavigation = 'reload';
      this.route.navigate([currentUrl]);
    // window.location.reload();
    this.schemeTransactionModal = false;

     let id=pids;
      console.log(pids)
    this.api.put(`Jewellery/wishlist/${id}`)
      .subscribe((r: any) => {
        this.response = r;
        console.log('status send')
      });
     
  }


 submit(pid, iid, sum, weight, pname): void {

   
   this.validerror=pname;
   this.sum=sum;
   this.iids = iid;
   this.pids=pid;
   this.weight = weight;
this.currentbalance=this.currentBalance;
   this.rem = this.weight-this.sum;

   console.log("remaining: "+this.rem)
   console.log("validerror: "+this.validerror)
   console.log("sum: "+this.sum)
   console.log("goldtransfer: "+this.iids)
   console.log("weight: "+this.weight)
   console.log("balance: "+this.currentbalance)
  
   const data1 = {
     pid: this.pids,
     goldtransfer: this.iids
    
   };
  
    console.log(data1);
   
  if (this.iids>0 && this.iids<=this.rem) {
  this.form.reset();
  
      this.api.post(`Jewellery/passbook`,data1)
            .subscribe((res: any) => {
             
        this.route.navigate([`jewelleryinventory/passbookwishlist/${pid}`])
            },
                (err: HttpErrorResponse) => {
                    this.errorMessage = '';
                    this.errorMessage = err.error.message;
                    document.getElementById(this.validerror).innerHTML = '<span style="color:red;"></i>*Insufficient Balance</span>';
      return;
                });

     

       
       }
 else{
  
    if(this.iids==0)
    {
   document.getElementById(this.validerror).innerHTML = '<span style="color:red;"></i>* Please Enter Grams</span>';
      return;
      
    }
  
     if (this.iids>this.rem) {
   document.getElementById(this.validerror).innerHTML = '<span style="color:red;"></i>* You Cant enter more than  product Weight</span>';
  return;
}


    console.log(`form not valid`);
    
    
 }
      
  

 
   
  }

  validate(){
    const res = JSON.parse(this.currentBalance);
    const keys = Object.keys(res);
for (let i = 0; i < keys.length; i++) {
  const key = keys[i];
  console.log(key, res[key]); 
}
}


 getAvailableBalance() {
    this.accountService.getBalance()
      .subscribe((r: any) => {
        const balance = r['balance'];
        const grams = new Number(balance.inGrams);
        balance.inGrams = grams.toFixed(3);
        this.currentBalance = balance.inGrams;
      
       const res = JSON.parse(this.currentBalance);
    const keys = Object.keys(res);
  for (let i = 0; i < balance.length; i++) {
  const remaining = balance['inGram'];
  console.log(remaining); 
}
        console.log(this.accountService);
      })
  }
  
  getInfo() {

    this.api.get(`Jewellery/wishlist`)
      .subscribe((r: any) => {
        this.response = r;
        this.storepid=r;
        console.log(this.response);

        this.setvisiblevalid(this.response);
        this.setStatusText(this.response);
      });      
  }

  setStatusText(response){
    
  
    for (let i = 0; i < response.length; i++) {
      const sum = response[i]['sum'];
      const pids = response[i]['pids'];
      let weight=response[i]['pweight'];

      console.log("sum  "+sum)
      console.log("pids "+pids)
      console.log("pids "+weight)
      console.log("sum"+sum);
    }}

setlocal(pids){
  console.log(pids);
  localStorage.setItem('catname',pids); 
  this.route.navigate([`/jewelleryinventory/passbookwishlist/${pids}`]);
  }
 deletewishlist(pids) {
    if (confirm('Are you sure to delete ? ')) {
      this.api.delete(`Jewellery/wishlist/${pids}`)
        .subscribe((res: any) => {
            this.errorMessage = '';
            this.successMessage = '';
            this.successMessage = 'wishlist Deleted Successfully';
            this.getInfo();
          },
          (err: HttpErrorResponse) => {
            this.isSubmitting = false;
          });
    }

  }

  setvisiblevalid(response){
   

    const availablebalance = this.currentBalance;
    const availablebalancevalue = availablebalance['balance'];
    console.log("test",availablebalancevalue);

  
    for (let i = 0; i < response.length; i++) {
      const sum = response[i]['sum'];
      const pids = response[i]['pids'];
      const weight=response[i]['pweight'];
      const pname=response[i]['pname'];
     
            if(sum<weight){
        console.log("visible: "+pname);
        
        document.getElementById(`${pname}`).setAttribute('class', ' show');
      }else{
        console.log("invisible")

      }

           
    }
  }

yourClickEvent()
{
  
}
  showMe_2:boolean= false;
  
    Toggle(pids){
       
      if(document.getElementById(`${pids}`).style.display == 'none'){
            document.getElementById(`${pids}`).style.display = 'block';
         
      }else{
            document.getElementById(`${pids}`).style.display = 'none';
           
      } 
              }

     cls(pweight){
       document.getElementById(`${pweight}`);
       console.log(`${pweight}`);
       this.currentweight = (`${pweight}`);
        console.log(this.accountService);
      } 
      name(pname)
      {
         document.getElementById(`${pname}`);
       console.log(`${pname}`);
        this.productname = (`${pname}`);
      }    
      
}

