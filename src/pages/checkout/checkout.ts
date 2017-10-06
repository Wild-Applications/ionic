import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { Stripe } from '@ionic-native/stripe';

import { CacheService } from '../../services/cache.service';
import { RestService } from '../../services/rest.service'
import { LoginPage } from '../login/login';

import { BasketService } from '../../services/basket.service';
/**
 * Generated class for the CheckoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {

  paymentDetails: any = {};
  order: any = {};
  email: string = "";
  publishableKey: string = "pk_test_N2x34swOlQSZGo7zr6b3A9rR";

  minMonth: string = "01";
  minYear: string = "17";
  maxYear: string = "27"
  validExpiry: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, private stripe: Stripe, private cache: CacheService, private modalController: ModalController, private restService: RestService, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private basketService: BasketService) {
    this.order = this.cache.get('order');

    var now = new Date();
    this.minMonth = (now.getMonth() + 1).toString();
    this.minYear = now.getFullYear().toString();
    this.maxYear = this.minYear + 10;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');
  }

  validateExpiry(){
    var split = this.paymentDetails.exp.split('-');
    if( parseInt(split[0]) > parseInt(this.minYear) ){
      this.validExpiry = true;
    }else{
      if(parseInt(split[1]) >= parseInt(this.minMonth)){
        //month matches or is greater than current so its valid
        this.validExpiry = true;
      }else{
        this.validExpiry = false;
      }
    }
  }

  submitPayment() {
    let loader = this.loadingCtrl.create({content:'Loading...'});
    loader.present();

    this.stripe.setPublishableKey(this.publishableKey);

    var split = this.paymentDetails.exp.split('-');
    this.paymentDetails.expYear = split[0];
    this.paymentDetails.expMonth = split[1];
    delete this.paymentDetails.exp;

    this.order.table = this.cache.get("table")._id;
    this.order.premises = this.cache.get("premises")._id;

    this.restService.order(this.order)
      .subscribe(
        data => {
          let alert = this.alertCtrl.create({
            title: "Order Placed",
            buttons: [
              {text: 'Ok',
              handler: () => {
                this.basketService.clear();
                loader.dismiss();
                this.navCtrl.pop();
              }}
            ]
          });
          alert.present();
        },
        error => {
          console.log(error);
        }
      );
  }

}
