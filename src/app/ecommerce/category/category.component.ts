import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  selectedStates: any;
 name = 'Angular';
 showOtpScreen: boolean;
  myForm: FormGroup;
  myForm1: FormGroup;
  filteredProducts = [];
  filteredProducts2 = [];
  pro: any;
  len: any;
  id: string;
 su:any;
 filterTerm: string;

 PriceFilter = [
    {
      "TagId": 20,
      "Type": "Budget",
      "Value": 5,
       "lower": 0,
      "upper": 5,
      "Values": null,
      "DisplayText": "5gms",
      
      "Order": null
    },
    {
      "TagId": 20,
      "Type": "Budget",
      "Value": 15,
       "lower": 5,
      "upper": 15,
      "Values": null,
      "DisplayText": "15gms",
      "Order": null
    },
    {
      "TagId": 20,
      "Type": "Budget",
      "Value": 20,
       "lower": 15,
      "upper": 20,
      "Values": null,
      "DisplayText": "20gms",
      "Order": null
    },
    {
      "TagId": 20,
      "Type": "Budget",
      "Value": 50,
       "lower": 20,
      "upper": 50,
      "Values": null,
      "DisplayText": "50gms",
      "Order": null
    },
   {
      "TagId": 20,
      "Type": "Budget",
      "Value": 5000,
      "lower": 50,
      "upper": "above",
      "Values": null,
      "DisplayText": "Above",
      "Order": null
    }]
  PriceFilter1 = [
    {
      "TagId": 20,
      "Type": "Budget",
      "lower": 0,
      "upper": 10000,
      "Values": null,
      "DisplayText": "10000",
      "Order": null
    },
    {
      "TagId": 20,
      "Type": "Budget",
      "lower": 10000,
      "upper": 20000,
      
      "Values": null,
      "DisplayText": "20000",
      "Order": null

    },
    {
      "TagId": 20,
      "Type": "Budget",
      "lower": 20000,
      "upper": 40000,
      "Values": null,
      "DisplayText": "40000",
      "Order": null
    },
    {
      "TagId": 20,
      "Type": "Budget",
      "lower": 40000,
      "upper": 60000,
      "Values": null,
      "DisplayText": "60000",
      "Order": null
    },
   {
      "TagId": 20,
      "Type": "Budget",
      "Value": 5000,
      "lower": 60000,
      "upper": 50000000,
      "Values": null,
      "DisplayText": "Above",
      "Order": null
    }]
  final: any[];
  final1: any[];
  filteredPro: any[];
  values: any;
 selectedQuantity = "10";
  tabids: any;
  searchValue: any;

 
  constructor(private activate:ActivatedRoute,private api:ApiService,private fb: FormBuilder,
    private authService: AuthenticationService
    ) {
     this.myForm = this.fb.group({
      filterProduct: ['']
       })
     this.myForm1 = this.fb.group({
      filterProduct1: ['']
       })
   }
   getValue(index) {
    if(index === 0)
      return { 
        zeroStroge: this.PriceFilter[0].lower,
        lower: 0, 
        displayText: this.PriceFilter[0].lower + "gms - " + this.PriceFilter[index].DisplayText, 
        upper: this.PriceFilter[index].Value 
      };
    else {
      return { 
        lower: this.PriceFilter[index - 1].Value, 
        upper: this.PriceFilter[index].Value,
        displayText: `${this.PriceFilter[index - 1].DisplayText} - ${this.PriceFilter[index].DisplayText}`

    
      };
    }
  }

   getValue1(index) {
    if(index === 0)
      return { 
        zeroStroge: this.PriceFilter1[0].lower,
        lower: 0, 
        displayText: this.PriceFilter1[0].lower + " - " + this.PriceFilter1[index].DisplayText, 
        upper: this.PriceFilter1[index].Value 
      };
    else {
      return { 
        lower: this.PriceFilter1[index - 1].Value, 
        upper: this.PriceFilter1[index].Value,
        displayText: `${this.PriceFilter1[index - 1].DisplayText} - ${this.PriceFilter1[index].DisplayText}`
      };
    }
  }

  sub:any;
  tabid:any
  products:any;
  weight:'';
  ngOnInit(): void {
     this.authService.checkAccess();

    let cid = this.activate.snapshot.paramMap.get('id');
    this.id = this.activate.snapshot.paramMap.get('id');

    this.getsubcat(cid)
    
  
  }

  getsubcat(cid) {
    this.api.get(`ecom/${cid}/subcategories`)
      .subscribe((r: any) => {
        this.sub = r;
        let sk = r[0].id;
        console.log('sub',this.sub);
         this.getpro(sk)
      });
  }
  onSearch(value: any) {
    this.searchValue = value;
    this.getpro(sk);
    
  }
  getpro(sk){
   let i=sk
   console.log(`first`,i)
     this.api.get(`ecom/subcategories/${i}/products?search=${this.searchValue}`)
      .subscribe((r: any) => {
        this.pro = r;
         this.showOtpScreen = true;
        console.log(this.pro,this.su)
            this.filteredPro = [...r];

    this.myForm.get('filterProduct').valueChanges.subscribe(
      value => {
        this.filteredPro = [...r.filter(product => product.weight >= value.lower && product.weight <= value.upper )]
     
      }


    )

    this.myForm1.get('filterProduct1').valueChanges.subscribe(
      value => {
        console.log('value',value);
        this.filteredPro = [...r.filter(product => product.price >= value.lower && product.price <= value.upper )]
      
      }
      
    )

      });

  }
 
  getproducts(id){
this.showOtpScreen=false;
    console.log(id)
    this.tabids=id
     this.api.get(`ecom/subcategories/${this.tabids}/products`)
      .subscribe((r: any) => {
         this.showOtpScreen = false;
        console.log(this.tabids,r)
        this.products = r;
      this.len=this.products.length
        
      this.filteredProducts = [...r];

    this.myForm.get('filterProduct').valueChanges.subscribe(
      value => {


        this.filteredProducts = [...r.filter(product => product.weight >= value.lower && product.weight <= value.upper )]
      
      }
    )
    this.myForm1.get('filterProduct1').valueChanges.subscribe(
      value => {

        this.filteredProducts = [...r.filter(product => product.price >= value.lower && product.price <= value.upper )]
     this.values=value;
        console.log('value', this.values);
       
      }
    )
      });
  }
  nonelist(id){
    if
    (this.showOtpScreen =false)
       document.getElementById(`${id}`).setAttribute('class', 'd-none');

  }
  doSomething(event) {

  let mySelectedOption: any = event.source.value
  console.log(mySelectedOption)
}
selectedUser: any = "";
selectedStatus: any = "";

onChange(changedDropdown: string) {
  if (changedDropdown === 'user') {
    this.selectedStatus = "";
  } else {
    this.selectedUser = "";
  }
}
}

function sk(sk: any) {
  throw new Error('Function not implemented.');
}

  

