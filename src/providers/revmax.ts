import { Injectable } from '@angular/core';
import {CustomHttpProvider  } from './configuration/custom-http';
import 'rxjs/add/operator/map';
import { WooApiService } from 'ng2woo';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

/*
  Generated class for the ConfigurationProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class RevmaxProvider {
  searchedCategories: any;
  getDataSubject: Subject<any>; 
  attributeOptions: Array<any> = [];
  allAttributes: Array<any> = [];
  wooCommerceStagingUrl:string="http://revmax.twinspark.co";
  wooCommerceLiveUrl:string="https://revmax.twinspark.co";
  wooCommerceConsumerKey:string="ck_5ecf43a297b5341dfb68c4ba5f7e83db56125b19";
  wooCommerceConsumerSecret:string="cs_6387cb6a55c87e8cd6223fbca39a92324dbfd013";
  wooCommerceVersion:string="wc/v1";
  wooCommerceQueryStringAuth : true;
  // Use false when need test with self-signed certificates, default is true (optional)
 // encoding: 'utf8', // Encode, default is 'utf8' (optional)
  
  products:any = {};
  // productInfo:any = false;
  constructor(  public http: CustomHttpProvider, private woo: WooApiService) {
    this.fetchAttributes();
    this.fetchSearchedCategories();
    this.getDataSubject = new Subject();
  }
  fetchCategoryProducts(catId){
    if(!catId){
      return false;
    }
    console.log('In category products');
    return this.woo.fetchItems('products?category='+catId)
        .then((products) => {
          console.log(products);
          this.products.productCategory = products;
          this.gotData();
        }
      )
        .catch(error => console.log(error));
  }

  /* Subject to return the category product.*/
  gotData(){
    this.getDataSubject.next(this.products);
  }


  fetchProductInfo(productId){
    if(!productId){
      return false;
    }
    console.log('info');
    this.woo.fetchItems('products/'+productId)
    // this.woo.fetchItems('products/attributes/36')
      .then(products => { 
        this.products.productInfo = products;
        this.gotData();
        console.log(this.products.productInfo);
      }
    )
      .catch(error => console.log(error));
  }
  
  
  /* For dashboard page */
  fetchCategories(){
    console.log('In categories');
    this.woo.fetchItems('products/categories?include=[667,303,623,525,390,469,327,617,662]&orderby=include')
    // this.woo.fetchItems('products/categories?per_page=30')
      .then(products => {
        console.log(products);
        this.products.allCategories = products;
        this.gotData();
        console.log(this.products.allCategories);
      }
    )
      .catch(error => console.log(error));
  }
  
  /* For search product categories */
  fetchSearchedCategories() {
    console.log('In categories');
    this.woo.fetchItems('products/categories?per_page=30')
      .then(products => {
        console.log(products);
        this.products.searchedCategories = products;
        this.searchedCategories = products;
        this.gotData();
        console.log(this.products.allCategories);
      }
      )
      .catch(error => console.log(error));
  }
  
  /* Fetch upsell products */
  fetchProducts(upsellIds){  
    console.log('all products');
    this.woo.fetchItems('products?include='+upsellIds)
      .then(products => { 
        this.products.allProducts = products;
        this.gotData();
        console.log(this.products.allProducts);
      }
    )
      .catch(error => console.log(error));
  }

  /* Fetch all attributes for search page*/
  fetchAttributes(){
    console.log('all products attributes');
    this.woo.fetchItems('products/attributes')
      // this.woo.fetchItems('products/attributes/36')
      .then(attributes => {
        this.allAttributes = attributes;
        // this.fetchAttributesOptions();
        this.attributeOptions =[];
        this.allAttributes .forEach(element => {
          this.fetchAttributesOptions(element.id);
        });
        // this.gotData();
        console.log(this.products.allAttributes);
      }
      )
      .catch(error => console.log(error));
  }

  /* Fetch all attribute terms for all attributes for search page*/
  fetchAttributesOptions(id){
    this.woo.fetchItems('products/attributes/' + id +'/terms?per_page=100')
        .then(options => {
          this.attributeOptions[id] = options; 
        }
        )
        .catch(error => console.log(error));
    }

    /* result for search attributes*/
  // searchResult(catId, searchArray) {
  //   let url = 'products?category=' + catId;

  //   var search = '';
  //   if(searchArray.length != 0){
  //     searchArray.forEach(element => {
  //       search = search + ',' + element.replace(/ /g, '');
  //       // url = url + '&search=' + element;  
  //     });
  //   }
  //   url = url + '&search=' + search;
  //   console.log(url);
  //   this.woo.fetchItems(url)
  //     // this.woo.fetchItems('products/categories?per_page=30')
  //     .then(products => {
  //       console.log(products);
  //       this.products.searchResult = products;
  //       console.log("this is the final search result");
  //       console.log(this.products.searchResult);
  //       this.gotData();
  //       // if (this.products.searchResult.length>0 ){
  //       // }
  //     }
  //     )
  //     .catch(error => console.log(error));
  // }


  

}