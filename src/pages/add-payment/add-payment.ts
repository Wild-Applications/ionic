import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { CacheService } from '../../services/cache.service';
/**
 * Generated class for the AddPaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-payment',
  templateUrl: 'add-payment.html',
})
export class AddPaymentPage {

  paymentDetails: any = {};
  minMonth: string = "01";
  minYear: string = "17";
  maxYear: string = "27"
  validExpiry: boolean = true;

  saveForLater: boolean = true;

  callback: any;
  stripe: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.callback = this.navParams.get('callback');
    this.stripe = this.navParams.get('stripe');
    var now = new Date();
    this.minMonth = (now.getMonth() + 1).toString();
    this.minYear = now.getFullYear().toString();
    this.maxYear = this.minYear + 10;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPaymentPage');
  }

  addPayment(){
    var split = this.paymentDetails.exp.split('-');
    this.paymentDetails.expYear = split[0];
    this.paymentDetails.expMonth = split[1];
    delete this.paymentDetails.exp;
    this.paymentDetails.new = true;
    this.paymentDetails.saveForLater = this.saveForLater;
    this.callback(this.paymentDetails).then(()=>{
       this.navCtrl.pop();
   });
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

}
