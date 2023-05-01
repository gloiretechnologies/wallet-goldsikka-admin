import { Component, HostListener, OnInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/api.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormBuilder,FormGroup, Validators } from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import { AuthenticationService } from 'src/app/_services/authentication/authentication.service';
@Component({
  selector: 'app-detailss',
  templateUrl: './detailss.component.html',
  styleUrls: ['./detailss.component.scss']
})
export class DetailssComponent implements OnInit {
  response: any;
schemeTransactionModal_after: boolean;
schemeTransactionModal_after1: boolean;

  showUserImageModal:boolean;


  // this functionality for scroll
//   @HostListener('window:scroll', ['$event']) onScroll(event){
//     this.pageYoffset = window.pageYOffset;
//  }
 
  products: any;
  len: any;
  response1: any;
  ids: any;
  myForm1: FormGroup;
  reviews: any;
  myList: number[];
  mains: any;
  mmm: any;
  filteredProducts: any[];
  values: string;
  weightfilter: any;
  finalprice: any;
  finalva: number;
  finalprice2: any;
  sizes: string;
  size2: any;
  final: number;
  finalprice3: any;
  finalva1: number;
  m: number;
 
  constructor(private fb: FormBuilder,private activate:ActivatedRoute,private api:ApiService, private scroll: ViewportScroller, private sanitizer: DomSanitizer ,private http:HttpClient ,
    private authService: AuthenticationService
    ) { 

       this.myForm1 = this.fb.group({
    filterProduct1: new FormControl('',),

       })
    }
producedetails:any;
  ngOnInit(): void {
     this.authService.checkAccess();

    let pids = this.activate.snapshot.paramMap.get('id');
this.magnify("myimage", "myresult", 3);
  
    this.getpriceunder(pids);
    this.getproducts(pids);
    this.getreviews(pids);
  }

 form = new FormGroup({
    
    review: new FormControl('',[Validators.required]),
    rating: new FormControl('',[Validators.required]),
    pid: new FormControl (this.activate.snapshot.paramMap.get('id'))
  });
  onImage(){
    this.showUserImageModal=true;
  }
  hideUserImageModal() {
    this.showUserImageModal = false;
  }

  
movecart(id){
  console.log('size',this.selectedTeam)
   if(this.selectedTeam=='0')
   {
    let size =this.producedetails[0].size;
      let pid=id
   console.log(size)
      const data = {size,pid};
  this.api.post(`ecom/cart`, data)
    .subscribe((res: any) => {

        this.response1=res;
    console.log(this.response1)
    document.getElementById(`cart${id}`).innerHTML = '<span id="favo{{producedetails[0].id}}"style="color: aliceblue"> <i style="color: aliceblue"class="fa fa-shopping-cart"></i>&nbsp;&nbsp; Added in cart </span>';


      });
   }
   else
   {
let size=this.selectedTeam;
   let pid=id
   console.log(size)
      const data = {size,pid};
  this.api.post(`ecom/cart`, data)
    .subscribe((res: any) => {

        this.response1=res;
    console.log(this.response1)
    document.getElementById(`cart${id}`).innerHTML = '<span id="favo{{producedetails[0].id}}"style="color: aliceblue"> <i style="color: aliceblue"class="fa fa-shopping-cart"></i>&nbsp;&nbsp; Added in cart </span>';


      });
   }
    
 
  
       
if(id)
       this.api.delete(`ecom/cart/${id}`, id)
    .subscribe((res: any) => {
        this.response=res;
    console.log('done')
      
 document.getElementById(`cart${id}`).innerHTML = '<span id="favo{{producedetails[0].id}}"style="color: aliceblue">  <i style="color: aliceblue"class="fa fa-shopping-cart"></i>&nbsp;&nbsp; Add to Cart </span>';

      });


  }

  getpriceunder(pids) {
    let id=pids;
  
      this.api.get(`ecom/products/${id}`)
        .subscribe((r: any) => {
          this.mains=r[0].sid;
          this.mmm=r[0].id;
  this.getproducts(this.mains);
  this.getreviews(this.mmm)
          this.producedetails = r;
  this.selectedTeam=this.producedetails[0].size
          console.log('selling',this.producedetails);
  
        });
          
  
    }


  favo(id){
  let size=this.selectedTeam
  if (size==null) {
    let pid=id

    let size=this.producedetails[0].size;

    const data = {size,pid};
    this.api.post(`ecom/favourites`, data)
    .subscribe((res: any) => {
        this.response=res;
    console.log(this.response)
       document.getElementById(`favo${id}`).innerHTML = '<b id="favo{{producedetails[0].id}}">Added in Favourites </b>';


      });
  }
  let pid=id
   const data = {size,pid};
  this.api.post(`ecom/favourites`, data)
    .subscribe((res: any) => {
        this.response=res;
    console.log(this.response)
       document.getElementById(`favo${id}`).innerHTML = '<b id="favo{{producedetails[0].id}}">Added in Favourites </b>';


      });

      if(id)
       this.api.delete(`ecom/favourites/${id}`, id)
    .subscribe((res: any) => {
        this.response=res;
    console.log('done')
       document.getElementById(`favo${id}`).innerHTML = '<b id="favo{{producedetails[0].id}}">Add to Favourites </b>';


      });
  }
 

  
 onsubmit_form(id) {
  console.log(id)
  this.ids=id
  console.log(this.ids)
    const data = this.form.value;
   
    //   fd.push('message', this.form.get('message').value);
    //  fd.push('rating', this.form.get('rating').value);
    //  fd.push('pid', this.ids);
    console.log(data);
    this.api.post(`ecom/ratings`, data)
      .subscribe((res: any) => {
        console.log(res)
        this.schemeTransactionModal_after=true;
        this.form.reset();
 document.getElementById(`sub${id}`).innerHTML = '<span>Submitted</span>';
      },
      (err: HttpErrorResponse) => {
//  document.getElementById(`sub${id}`).innerHTML = '<span> Already Submitted</span>';
 this.form.reset();
 this.schemeTransactionModal_after1=true;
      })
  }
  hideSchemeTransactionModal() {
    this.schemeTransactionModal_after=false;
    this.schemeTransactionModal_after1=false;
  }
  getproducts(mains){
    let id=mains
     console.log(id)
       this.api.get(`ecom/subcategories/${id}/products`)
        .subscribe((r: any) => {
          this.products = r;
          this.len=this.products.length
          console.log('products',this.len);
  
        });
  
    }
  getreviews(mmm){
    let id=mmm
    this.api.get(`ecom/ratings/${id}`)
    .subscribe((a: any) => {
      this.reviews = a;
      console.log('reviews',this.reviews);
    });
  }




  magnify(imgID, imgID2, zoom) {

    var img, glass, result, cx, cy;
    img = document.getElementById(imgID);
   // img.src = this.source;
    result = document.getElementById(imgID2);

   
    /create magnifier glass:/
    glass = document.createElement("DIV");
    glass.setAttribute("class", "img-magnifier-glass");

   
    /insert magnifier glass:/
    img.parentElement.insertBefore(glass, img);
  
    glass.style.backgroundImage = "url('" + img.src + "')";
   
    glass.style.backgroundRepeat = "no-repeat";
    glass.style.backgroundSize =
    img.width * zoom + "px " + img.height * zoom + "px";
 

    cx = result.offsetWidth / glass.offsetWidth;
    cy = result.offsetHeight / glass.offsetHeight;
    /* Set background properties for the result DIV */
  
    /execute a function when someone moves the magnifier glass over the image:/
    glass.addEventListener("mousemove", moveMagnifier);
    img.addEventListener("mousemove", moveMagnifier);
    glass.addEventListener("touchmove", moveMagnifier);
    img.addEventListener("touchmove", moveMagnifier);


    glass.addEventListener("mouseenter", mouseenter);
    img.addEventListener("mouseenter", mouseenter);
    glass.addEventListener("touchenter", moveMagnifier);
    img.addEventListener("touchenter", moveMagnifier);


    glass.addEventListener("mouseleave", removeMagnifier);
    img.addEventListener("mouseleave", removeMagnifier);
    glass.addEventListener("touchleave", removeMagnifier);
    img.addEventListener("touchleave", removeMagnifier);


    function mouseenter(e) {
      result.style.backgroundImage = "url('" + img.src + "')";
      result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";
    }

    function removeMagnifier(e) {
      var none = "";
      glass.style.backgroundImage = "url('" + none + "')";
      result.style.backgroundImage = "url('" + none + "')";
    }
    function moveMagnifier(e) {
      var pos, x, y;
      /* Prevent any other actions that may occur when moving over the image */
      e.preventDefault();
      /* Get the cursor's x and y positions: */
      pos = getCursorPos(e);
      /* Calculate the position of the lens: */
      x = pos.x - (glass.offsetWidth / 1);
      y = pos.y - (glass.offsetHeight / 1);
      /* Prevent the lens from being positioned outside the image: */
      if (x > img.width - glass.offsetWidth) { x = img.width - glass.offsetWidth; }
      if (x < 0) { x = 0; }
      if (y > img.height - glass.offsetHeight) { y = img.height - glass.offsetHeight; }
      if (y < 0) { y = 0; }
      /* Set the position of the lens: */
      glass.style.left = x + "px";
      glass.style.top = y + "px";
      /* Display what the lens "sees": */
      result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
    }
    function getCursorPos(e) {
      var a,
        x = 0,
        y = 0;
      e = e || window.event;
      /get the x and y positions of the image:/
      a = img.getBoundingClientRect();
      /calculate the cursor's x and y coordinates, relative to the image:/
      x = e.pageX - a.left;
      y = e.pageY - a.top;
      /consider any page scrolling:/
      x = x - window.pageXOffset;
      y = y - window.pageYOffset;
      return { x: x, y: y };
    }
  }
 
  close() {
  
    this.schemeTransactionModal_after=false;
   

  }
  close_second(){
    this.schemeTransactionModal_after1=false;
  }
selectedTeam = '';
	onSelected(value:string): void {
		this.selectedTeam = value;
    console.log('val',this.selectedTeam)
    this.filteredProducts = [...this.producedetails[0].sizes.filter(product => product.sizes == this.selectedTeam )]
     this.values=value;
        this.weightfilter=this.filteredProducts[0].weight;
        console.log('value', this.filteredProducts);
        // gold price
     this.finalprice=(this.producedetails[0].liveprice)*(this.weightfilter)
        this.finalva=(this.finalprice*this.producedetails[0].va)/100
	this.finalprice2=this.finalprice+this.finalva+((this.producedetails[0].stoneprice)+(this.producedetails[0].gstprice))
   
// silver price
this.final=((this.producedetails[0].liveprice)*(this.weightfilter))/1000
        this.finalva1=((this.final)*(this.producedetails[0].va))/100
        this.m=(this.final+this. finalva1)*((this.producedetails[0].gst)/100)

	this.finalprice3=(this.finalva1)+(this.final)+(this.m)+(this.producedetails[0].stoneprice)

}
  
}

