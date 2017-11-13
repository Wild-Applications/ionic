import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { RestService } from '../../services/rest.service';

/**
 * Generated class for the OrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {

  orders: any[] = [];

  loading: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private restService: RestService, private loadingCtrl: LoadingController) {
    this.loading = true;
    this.restService.getOrders()
      .subscribe((data) => {
        this.orders = data.orders;
        this.loading = false;
      }, error => {
        console.log(error);
        this.loading = false;
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
  }

}
