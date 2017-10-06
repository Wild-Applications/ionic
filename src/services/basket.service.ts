import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';


@Injectable()
export class BasketService {


  basket: any[] = [];
  quantities: any = {};
  subtotal: number = 0;

  basketChange: Subject<any[]> = new Subject();

  constructor( private http: Http ){
  }

  add(product, quantity){
    this.basket[this.basket.length] = product;
    if(this.quantities[product._id]){
      this.quantities[product._id] += quantity;
    }else{
      this.quantities[product._id] = quantity;
    }
    this.subtotal += parseFloat(((product.price * quantity)).toFixed(2));
    this.subtotal = parseFloat(this.subtotal.toFixed(2));
    this.emitBasket();
  }

  emitBasket(){
    var toReturn = [];
    for(var key in this.quantities){
      var nextEntry: any = {};
      nextEntry.quantity = this.quantities[key];
      for(var i=0;i<this.basket.length;i++){
        if(this.basket[i]._id == key){
          nextEntry.product = this.basket[i];
          break;
        }
      }
      toReturn[toReturn.length] = nextEntry;
    }
    var basket: any = {};
    basket.subtotal = this.subtotal;
    basket.contents = toReturn
    this.basketChange.next(basket);
  }


  remove(product){
    for(var i=0;i<this.basket.length;i++){
      if(this.basket[i]._id == product._id){
        this.basket.splice(i,1);
        this.quantities[product._id] -= 1;
        if(this.quantities[product._id] == 0){
          delete this.quantities[product._id];
        }
        break;
      }
    }
    this.emitBasket();
  }

  clear(){
    this.basket = [];
    this.quantities = {};
    this.subtotal = 0;
    this.emitBasket();
  }

  decrementQuantity(product){
    this.quantities[product._id] -= 1;
  }

  getBasket(callback){
    return this.basketChange.subscribe(data => {
      callback(data);
    });
  }
}
