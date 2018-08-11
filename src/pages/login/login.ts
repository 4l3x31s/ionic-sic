import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, MenuController, NavController, NavParams} from 'ionic-angular';
import {HomePage} from "../home/home";
import {SicServiceProvider} from "../../providers/sic-service/sic-service";
import {Device} from '@ionic-native/device';
import {RequestLogin} from "../request/request-login";
import {ResponseLogin} from "../response/response-login";
import {TokenProvider} from "../../providers/token/token";
var Mousetrap = require('mousetrap');
var Mousetrap_global = require('mousetrap-global-bind');
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
  txtUsuario = "";
  txtPassword = "";
  appName = "AppMovil";
  appKey = "12e23o33e488x033o";
  constructor(public navCtrl: NavController, public navParams: NavParams, public menu: MenuController,
              private sicService: SicServiceProvider, public loadingCtrl: LoadingController,
              public alertCtrl: AlertController, private device: Device, public tokenService:TokenProvider) {
    menu.enable(false);

  }

  ionViewDidEnter(){
    Mousetrap.bindGlobal(['command+g', 'ctrl+g'], () => {
      this.iniciaSesion();
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  iniciaSesion(){
    const loading = this.loadingCtrl.create({
      content: 'Iniciando Sessión'
    });
    loading.present();
    let requestPedido:RequestLogin = new RequestLogin(this.txtUsuario, this.txtPassword,this.appName,this.appKey, this.device.platform + " " + this.device.model);
    var url = '/acceso/login';
    this.sicService.postGlobal<ResponseLogin>(requestPedido, url).subscribe( data => {

      loading.dismiss();
      let alert;
      if(data.respuesta){
        this.tokenService.setData(data);
        this.tokenService.set(data);

        this.navCtrl.setRoot(HomePage,{data});
      }else{
        alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: data.mensaje,
          buttons: ['Aceptar']
        });
        alert.present();
        return;
      }
    }, error =>{
      loading.dismiss();
      let alert;
      alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Error al iniciar sessión',
        buttons: ['Aceptar']
      });
      alert.present();
      return;
    });
  }
}
