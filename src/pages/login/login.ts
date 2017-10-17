import {Component} from '@angular/core';
import {IonicPage, MenuController, NavController, NavParams} from 'ionic-angular';
import {HomePage} from "../home/home";

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public menu: MenuController) {
    menu.enable(false);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  iniciaSesion(){
    //this.navCtrl.
    this.navCtrl.setRoot(HomePage,{token:123456});
  }
}
