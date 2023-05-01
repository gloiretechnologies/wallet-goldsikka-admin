import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {ApiService} from '../../api.service';


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
wishlist:any;
  response: any;
pidslist:any;
pids:any;

resultArray:any;
  isClicked: boolean;
  wishlistid: any;
  categoryid:any;
  params1: any;
  categorycall: any=[];
  wishid:any;
  devices:any;
  count:any;
  wishlistbtnvalue = "Add to Wishlist";
  wishlistCount:any;
catname:any;
  constructor(
    private ActivatedRoute: ActivatedRoute,
    private api: ApiService) { }

  ngOnInit(): void {
    let pid = this.ActivatedRoute.snapshot.paramMap.get('id');

    // console.log("catid: "+catid)
  
  
    this.api.get(`Jewellery/product/${pid}`)
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
     this.alreadylist(this.wishlist)
  }

  changevisual(id){
    console.log("check ",id)
  }


  

alreadylist(wishlist)
{
  // console.log(this.wishlist)
   
   this.api.get(`Jewellery/wishlist`)
      .subscribe(
    (data) => {
      this.devices = data;
      this.pidslist = this.devices.map(function(a) {return a["pids"];});
  // console.log("array",this.pidslist);

    },
    

  );
  
//  for (let i = 0; i <wishlist.length; i++) {
//       let pids =wishlist[i]['pids'];
//   this.pidslist.push(pids);
  
//     }
    console.log("my pids",this.pidslist)
  }
 checkwish(id){
    let pid = this.ActivatedRoute.snapshot.paramMap.get('id');

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
  

    if( document.getElementById(`addedlist${id}`).innerHTML == '<span style=" background-color:#28A746;padding:10px;border-radius:3px;color:white;"><i class="fas fa-cart-plus mr-2" style="color:white;"></i>Added in Wishlist</span>'){
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
       document.getElementById(`addedlist${id}`).innerHTML = '<span style=" background-color:#28A746;padding:10px;border-radius:3px;color:white;"><i class="fas fa-cart-plus mr-2" style="color:white;"></i>Added in Wishlist</span>';
      });
    }
  }
   
}



