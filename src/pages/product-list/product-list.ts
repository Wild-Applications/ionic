import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, AlertController } from 'ionic-angular';

import { BasketService } from '../../services/basket.service';
/**
 * Generated class for the ProductListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product-list',
  templateUrl: 'product-list.html'
})
export class ProductListPage {

  data: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalController: ModalController, private alertCtrl: AlertController) {
    this.data = this.navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductListPage');
  }

  productClicked(index){
    if(this.data[index].in_stock){
      let productModal = this.modalController.create(ProductModal, {product: this.data[index]}, {showBackdrop: true, cssClass: 'selectProduct'});
      productModal.present();
    }else{
        //product is out of stock
        let alert = this.alertCtrl.create({
          title: 'Out Of Stock',
          subTitle: 'We\'re sorry!\n This product is out of stock!',
          buttons: ['OK']
        });
        alert.present();
    }
  }

}


@Component({
  selector: 'product-modal',
  templateUrl: 'product.modal.html'
})
export class ProductModal {

  product: any = {};
  quantity: number = 1;
  constructor(params: NavParams, private basketService: BasketService, private viewCtrl: ViewController){
    this.product = params.get('product');
    console.log('modal params ' + JSON.stringify(params.get('product')));
  }

  incrementQuantity(){
    if(this.quantity < 10){
      this.quantity += 1;
    }
  }

  decrementQuantity(){
    if(this.quantity > 1){
      this.quantity -= 1;
    }
  }

  cancel(){
    this.viewCtrl.dismiss();
  }

  add(){
    this.basketService.add(this.product, this.quantity);
    this.viewCtrl.dismiss();
  }
}
