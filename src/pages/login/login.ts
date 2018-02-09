import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { RegisterPage } from '../register/register';
import { CheckoutPage } from '../checkout/checkout';
import { ScannerPage } from '../scanner/scanner';

import { RestService } from '../../services/rest.service';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  email: string;
  password: string;

  error: string;

  returnPage: any = ScannerPage;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, private storage: Storage, private restService: RestService, public loadingCtrl: LoadingController) {
    //check if current User Exists
    var designatedReturnPage = navParams.get('returnPage');
    if(designatedReturnPage){
      this.returnPage = designatedReturnPage;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login(){
    this.error = undefined;
    let loader = this.loadingCtrl.create({});
    loader.present();
    this.restService.login(this.email, this.password)
      .subscribe(
        data => {
          loader.dismiss();
          this.viewCtrl.dismiss(true);
          // this.navCtrl.push(this.returnPage, this.viewCtrl)
          // .then(()=>{
          //   const index = this.viewCtrl.index;
          //   this.navCtrl.remove(index);
          // });
        },
        error => {
          loader.dismiss();
          this.error = error['_body'].toString();
          this.error = this.error.replace(/"/g,"");
        }
      );
  }

  signUp(){
    this.navCtrl.push(RegisterPage);
  }
}
