import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, AlertController } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, private barcodeScanner: BarcodeScanner, private restService: RestService, private cache: CacheService, public platform: Platform, public loadingCtrl: LoadingController, private alertCtrl: AlertController) {
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
            alert(error.message);
          }
        }
      );
  }

  navToRoot() {
    this.navCtrl.push(MenuPage);
    this.navCtrl.remove(0,1,null);
  }

}
