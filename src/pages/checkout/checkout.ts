import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { Stripe } from '@ionic-native/stripe';

import { CacheService } from '../../services/cache.service';
import { RestService } from '../../services/rest.service'
import { LoginPage } from '../login/login';
import { AddPaymentPage } from '../add-payment/add-payment';

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

  storedPaymentMethods: any = {cards:[]};
  selectedPayment: any = 0;
  loading: boolean = true;

  paymentDetails: any = {};
  order: any = {};
  email: string = "";
  publishableKey: string = "pk_test_N2x34swOlQSZGo7zr6b3A9rR";

  minMonth: string = "01";
  minYear: string = "17";
  maxYear: string = "27"
  validExpiry: boolean = true;

  saveForLater: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, private stripe: Stripe, private cache: CacheService, private modalController: ModalController, private restService: RestService, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private basketService: BasketService) {
    this.retrievePaymentMethods();
    this.stripe.setPublishableKey(this.publishableKey);
    this.order = this.cache.get('order');

    var now = new Date();
    this.minMonth = (now.getMonth() + 1).toString();
    this.minYear = now.getFullYear().toString();
    this.maxYear = this.minYear + 10;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');
  }

  private retrievePaymentMethods(){
    this.restService.retrieveStoredPaymentMethods()
      .subscribe(
        data => {
          this.loading = false;
          this.storedPaymentMethods = data;
        },
        error => {
          alert(error);
        }
      );
  }

  addPayment(){
    this.navCtrl.push(AddPaymentPage, {
      callback: this.addPaymentCallback.bind(this)
    });
  }

  addPaymentCallback(paymentDetails){
    return new Promise((resolve, reject) => {
      var cardObj: any = {};
      cardObj.number = paymentDetails.number;
      cardObj.expMonth = paymentDetails.expMonth;
      cardObj.expYear = paymentDetails.expYear;
      cardObj.cvc = paymentDetails.cvc;

      this.stripe.createCardToken(cardObj)
        .then(token => {
          var toDisplay: any = {};
          toDisplay.last4 = token.card.last4;
          toDisplay.exp_month = token.card.exp_month;
          toDisplay.exp_year = token.card.exp_year;
          toDisplay.brand = token.card.brand;
          toDisplay.source = token.id;
          toDisplay.new = true;
          toDisplay.saveForLater = paymentDetails.saveForLater;
          var replaced = false;
          for(var i=0;i<this.storedPaymentMethods.cards.length;i++){
            if(this.storedPaymentMethods.cards[i].new){
              this.storedPaymentMethods.cards[i] = toDisplay;
              replaced = true;
              break;
            }
          }
          if(!replaced){
            this.storedPaymentMethods.cards[this.storedPaymentMethods.cards.length] = toDisplay;
          }
          resolve();
        })
        .catch(error => {
          console.log(error);
          resolve();
        });

   });
  }

  submitOrder() {
    let loader = this.loadingCtrl.create({content:'Placing order...'});
    loader.present();

    this.order.table = this.cache.get("table")._id;
    this.order.premises = this.cache.get("premises")._id;

    this.order.source = this.selectedPayment.source;
    if(this.selectedPayment.saveForLater){
      this.order.storePaymentDetails = true;
    }else{
      this.order.storePaymentDetails = false;
    }

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
