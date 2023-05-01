import { Component, OnInit } from '@angular/core';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { ApiService } from '../api.service';
import { FormControl, FormGroup } from "@angular/forms";
import { GoldService } from '../gold/gold.service';



@Component({
  selector: 'app-ecommerce',
  templateUrl: './ecommerce.component.html',
  providers: [
    { provide: CarouselConfig, useValue: { interval: 1500, noPause: true, showIndicators: true } }
  ],
  styleUrls: ['./ecommerce.component.scss']
})



export class EcommerceComponent implements OnInit {

  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  mouseDrag=true;
  pauseOnFocus = true;
  price: any;
  brand: any;
  favo: any;
  len: any;
  lenghts: any;
  searchValue: any = '';
  list: any;
  currentGoldPricePerGram: any;
  filteredsubProducts: any[];
  bul: any[];
  arr5: any;
  respons5: any;
  constructor(private api:ApiService,private goldService:GoldService) { }
  response:any;
  ban:any;
  new:any;
  top:any;
  filterTerm: string;

  ngOnInit(): void {
    this.getInfo();
    this.getbanners();
    this.getnewarrival();
    this. gettopselling();
    this.getpriceunder();
    this.getbrand();
    this.getfavouri();
    this.getcart();
     this.goldService.getCurrent22CarartGoldPrice()
      .subscribe((r: any) => {

        this.currentGoldPricePerGram = r.sell_price_per_gram;
      });
      // this.checkbullion();
  }
  onSearch(value: any) {
    this.searchValue = value;
    this.getInfo();
    this.getnewarrival();
    this. gettopselling()
  }
  getInfo() {
    this.api.get(`ecom/categories?search=${this.searchValue}`)
      .subscribe((r: any) => {
        this.list = r;
        // console.log(this.response)
        console.log ("list",this.list)
        this.filteredsubProducts = [...r.filter(product => product.catname!= "Bullion")]
        console.log('sub',this.filteredsubProducts);
      });

      this.api.get(`ecom/categories?search=${this.searchValue}`)
      .subscribe((r: any) => {
        this.list = r;
        // console.log(this.response)
        console.log ("list",this.list)
        this.bul = [...r.filter(product => product.catname== "Bullion")]
        console.log('sub',this.bul);
      });
  }
  getbanners() {
    this.api.get(`ecom/banners`)
      .subscribe((r: any) => {
        this.ban = r;
      });
  }
  getnewarrival() {
    this.api.get(`ecom/newarrivals?search=${this.searchValue}`)
      .subscribe((r: any) => {
        this.new = r;
      });
  }
  gettopselling() {
    this.api.get(`ecom/topsellingproducts?search=${this.searchValue}`)
      .subscribe((r: any) => {
        this.top = r;
        console.log('selling',this.top);
      });
  }
  getpriceunder() {
    this.api.get(`ecom/priceunderboxes`)
      .subscribe((r: any) => {
        this.price = r;
        console.log('price under',this.price);
      });
  }
  getbrand() {
    this.api.get(`ecom/brands`)
      .subscribe((r: any) => {
        this.brand = r;
        // console.log('price under',this.brand);
      });
  }
  getfavouri() {
    this.api.get(`ecom/favourites`)
      .subscribe((r: any) => {
        this.favo = r;
      this.len=this.favo.length
      console.log('len',this.len);
      });
        console.log('selling',this.favo);
  }
  getcart() {
    this.api.get(`ecom/cart`)
      .subscribe((r: any) => {
      this.favo = r;
      this.lenghts=this.favo.length
      console.log('len',this.lenghts);
      });
      this.api.get(`ecom/checkout`)
      .subscribe((r: any) => {
        this.respons5 = r;
        console.log('response',this.respons5)
const myClonedArray  = Object.assign([], this.response);
this.arr5=myClonedArray.length;
console.log('testig',this.arr5)
      });


      
  }

  // checkbullion(){
   
  //  if(document.getElementById(`Bullion`).innerHTML==='Bullion'){
  //   document.getElementById(`nones`).style.display='none';
  //   console.log('checked')
  //  }
    
  // }
}