import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-cartpage',
  templateUrl: './cartpage.component.html',
  styleUrls: ['./cartpage.component.scss']
})
export class CartpageComponent implements OnInit {
  cartp: any;
  response: any;
  len: any;
  arr: any;
  respons: any;

  constructor(private api:ApiService,private route:Router,
    private authService: AuthenticationService
    ){ }

  ngOnInit(): void {
     this.authService.checkAccess();

    this.checkwish();
this.getInfo();
  }
    getInfo() {
    this.api.get(`ecom/checkout`)
      .subscribe((r: any) => {
        this.respons = r;
        console.log('response',this.respons)
const myClonedArray  = Object.assign([], this.response);
this.arr=myClonedArray;
console.log(this.arr)
      });

    
  }
   movetofav(id,size){
  
  this.api.post(`ecom/movetofavourites/${id}/${size}`, id,size)
    .subscribe((res: any) => {
        this.response=res;
    console.log(this.response)
this.route.navigate([`ecommerce/favourites`])
      });
      
      this.api.delete(`ecom/cart/${id}`,)
    .subscribe((res: any) => {
        this.response=res;
    
    console.log('done')
this.route.navigate([`ecommerce/favourites`])
      });
   
    

  }
 checkwish(){
  
  this.api.get(`ecom/cart`)
      .subscribe((r: any) => {
        this.cartp = r;
        console.log('cart',this.cartp);

      });
   
  }
  del(id) {
    if (confirm('Are you sure you want to remove?')) {
       this.api.delete(`ecom/cart/${id}`,)
    .subscribe((res: any) => {
        this.response=res;
    console.log('done')
    window.location.reload();

      });
    }
  }
 
}