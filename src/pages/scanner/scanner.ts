import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, AlertController, Events } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';

import { MenuPage } from '../menu/menu';

import { RestService } from '../../services/rest.service';
import { CacheService } from '../../services/cache.service';
/**
 * Generated class for the ScannerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scanner',
  templateUrl: 'scanner.html',
})
export class ScannerPage {

  options: BarcodeScannerOptions;

  constructor(public navCtrl: NavController, public navParams: NavParams, private barcodeScanner: BarcodeScanner, private restService: RestService, private cache: CacheService, public platform: Platform, public loadingCtrl: LoadingController, private alertCtrl: AlertController, public events: Events) {
    this.options = {
      preferFrontCamera: false,
      showFlipCameraButton: false,
      showTorchButton: true,
      torchOn: false,
      prompt: "Find the barcode on your table and scan in!",
      formats: "QR_CODE"
    };

    if(this.cache.get('table') && this.cache.get('menu') && this.cache.get('premises')){
      this.navToRoot();
    }

    events.subscribe('scannedOut', (data)=>{
      console.log(this.navCtrl.getActive().component.name);
      if(this.navCtrl.getActive().component.name == "MenuPage"){
        this.navCtrl.push(ScannerPage);
        this.navCtrl.remove(0,1,null);
      }
    });
  }

  ionViewDidLoad() {

  }

  scan(){

    if(!this.platform.is('cordova')){
      this.scanIn("599ab8e70bbb0b000fffb7e9");
    }else{
      this.barcodeScanner.scan(this.options).then((barcodeData) => {
        this.scanIn(barcodeData.text);
      }, (err) => {
          console.log(err);
      });
    }
  }

  scanIn(tableId){
    let loader = this.loadingCtrl.create({content:'Loading...'});
    loader.present();
    this.restService.scanIn(tableId)
      .subscribe(
        data => {
          this.cache.put('menu',data.menu);
          this.cache.put('table', data.table);
          this.cache.put('premises', data.premises);
          loader.dismiss();
          this.navToRoot();
        },
        error => {
          console.log(error);
          if(error.status === 403){
            loader.dismiss();
            let alert = this.alertCtrl.create({
              title: 'Closed',
              subTitle: 'The premises you\'re trying to scan in to is currently closed! If you want to place an order please reach out to a member of staff',
              buttons: ['OK']
            });
            alert.present();
          }
        }
      );
  }

  navToRoot() {
    this.navCtrl.push(MenuPage);
    this.navCtrl.remove(0,1,null);
  }

}
