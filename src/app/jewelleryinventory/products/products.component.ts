import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../api.service';
import {Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
pids:any;
wishlist:any;
resultArray:any;
  response: any;
  isClicked: boolean;
  wishlistid: any;
  categoryid:any;
  params1: any;
  categorycall: any=[];
  wishid:any;
  devices:any;
  count:any;
  pidslist: number[]=[];
  wishlistbtnvalue = "Add to Wishlist";
  wishlistCount:any;
catname:any;
            //test;
            p=1;
          collection=[]; 
    constructor(
 
    private router:Router, 
    
    private api: ApiService, 
    private ActivatedRoute: ActivatedRoute) {  }
  
  
    goToPage(pageName:string):void{
      this.router.navigate([`${pageName}`]);


          
    for(let i=1; i<=30;i++){
      let Obje={'Name': `User Name ${i}` , 'id':`UID ${i}`}
      this.collection.push(Obje);
   
    }
  }
  ngOnInit(): void {
    this.getwishlistcount();
 
    let catid = this.ActivatedRoute.snapshot.paramMap.get('id');
    let id=catid
      
    this.api.get(`Jewellery/categories/${id}`)
      .subscribe((r: any) => {
          
        
      console.log(this.catname);
      this.catname=r;
            });
    this.api.get(`Jewellery/productbycats/${catid}`)
        .subscribe((r: any) => {
            this.response = r;
            console.log(this.response)
        });
        this.alreadylist(this.wishlist);


   }
   getwishlistcount() {
    this.api.get(`Jewellery/wishlist`)
    .subscribe((r: any) => {
       this.count = r;
      this.wishlistCount=this.count.length;
      
       console.log(this.count);
       this.alreadylist(this.count);
     });
  }

  changevisual(id){
    console.log("check ",id)
  }


  

alreadylist(wishlist)
{
    for (let i = 0; i < wishlist.length; i++) {
      let pids = wishlist[i]['pids'];
     this.pidslist.push(pids);
  
  //  this.api.get(`Jewellery/wishlist`)
  //     .subscribe(
  //   (data) => {
  //     this.devices = data;
  //     this.resultArray = this.devices.map(function(a) {return a["pids"];});
  // console.log(this.resultArray);

  //   },
    

  // );

  

    }
    console.log("my pids",this.pidslist)
  }
 checkwish(id){
  // console.log(this.pidslist.length)
    for (let index = 0; index < this.pidslist.length; index++) {
      const element = this.pidslist[index];
      if(element===id){
        console.log('sucesses')
        return true;
      }else{
        console.log('failure')


      }
      
    }
  }
   addtowishlist(id){
    console.log("ad to wishlist :"+id);
  this.api.get(`Jewellery/wishlist`)
      .subscribe((r: any) => {
        this.wishlist = r;
        console.log(this.wishlist)
        let list: number[] = [this.wishlist];
  

      });

    //    if (this.wishlist=true) {

    //   document.getElementById(`addedlist${id}`).innerHTML = '<span style="background-color:#dc3545;padding:10px;border-radius:3px;color:white;">Already in Wishlist</span>';
    // }
  

    if( document.getElementById(`addedlist${id}`).innerHTML == '<span class="box-sh" style="background-color: #28a746;padding: 11px 3px;border-radius: 3px;color: white;display: flex">Added in Wishlist</span>'){
      this.api.delete(`Jewellery/wishlist/${id}`, id)
      .subscribe((r:any) => {
        this.response = r;
        console.log(this.response)
       document.getElementById(`addedlist${id}`).innerHTML = '<span style=" background-color:#faf87d;padding:10px;border-radius:3px;color:black;border:1px solid black;"><i class="fas fa-cart-plus mr-2" style="color:black;"></i>Add to Wishlist</span>';

      })
    }else{
    this.api.post(`Jewellery/wishlist?pids=${id}`, id)
    .subscribe((r: any) => {
        this.response = r;
    console.log(this.response)
// window.setTimeout(function(){location.reload()},1000)
       document.getElementById(`addedlist${id}`).innerHTML = '<span  class="box-sh" style="background-color: #28a746;padding: 11px 3px;border-radius: 3px;color: white;display: flex">Added in Wishlist</span>';
      });
    }
  }
   
}


