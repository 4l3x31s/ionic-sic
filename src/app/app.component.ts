import { Component, ViewChild } from '@angular/core';
import {AlertController, Nav, Platform, ToastController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {NuevoProductoPage} from "../pages/nuevo-producto/nuevo-producto";
import {PedidosPage} from "../pages/pedidos/pedidos";
import {EntregasPage} from "../pages/entregas/entregas";
import {EstadoCuentasPage} from "../pages/estado-cuentas/estado-cuentas";
import {ReportesPage} from "../pages/reportes/reportes";
import {DiscosPage} from "../pages/discos/discos";
import {CierreGestionPage} from "../pages/cierre-gestion/cierre-gestion";
import {LoginPage} from "../pages/login/login";
import {Subscription} from "rxjs/Subscription";
import {TokenProvider} from "../providers/token/token";
import {ResponseLogin} from "../pages/response/response-login";
import {RecibidoPage} from "../pages/recibido/recibido";
import {VentasPage} from "../pages/ventas/ventas";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  nombreSession = "";
  sucursalSession = "";

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any, icon: string}>;
  subscription: Subscription;
  jsonConvert: any;
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
              private toastCtrl:ToastController, private alertCtrl: AlertController,public tokenService: TokenProvider) {
    this.initializeApp();

    // used for an example of ngFor and navigation

    this.subscription = this.tokenService.getData<ResponseLogin>().subscribe(data =>{
      if(data !=null){
        var valor = JSON.stringify(data);
        if(valor != null){
          this.toDatosPedidos(valor);
        }
      }
    })

  }

  public toDatosPedidos(data: string){
    if(data != null){
      var jsonData: any = new Object();
      jsonData = JSON.parse(data);
      this.jsonConvert = jsonData;
      this.obtenerString()
    }
  }
  public obtenerString(){
    this.nombreSession = this.jsonConvert.nombreUsuario;
    this.sucursalSession = this.jsonConvert.nombreAmbiente;
    this.validarMenu(this.jsonConvert.tipo);
  }
  public validarMenu(tipoUsuario:string){
    if(tipoUsuario === 'ALMACEN') {
      this.pages = [
        {title: 'Registrar Producto', component: NuevoProductoPage, icon: 'archive'},
        {title: 'Pedidos', component: PedidosPage, icon: 'boat'},
        {title: 'Entregas', component: EntregasPage, icon: 'aperture'},
        //{title: 'Recibidos', component: RecibidoPage, icon: 'cart'},
        //{title: 'Ventas', component: VentasPage, icon: 'cash'},
        {title: 'Estado Cuentas', component: EstadoCuentasPage, icon: 'briefcase'},
        {title: 'Reportes', component: ReportesPage, icon: 'document'},
        {title: 'Discos', component: DiscosPage, icon: 'disc'},
        {title: 'Cierre Gestión', component: CierreGestionPage, icon: 'hand'},
        {title: 'Salir Sesion', component: LoginPage, icon: 'exit'}

      ];
    }
    else{
      this.pages = [
        //{title: 'Registrar Producto', component: NuevoProductoPage, icon: 'archive'},
        //{title: 'Entregas', component: EntregasPage, icon: 'aperture'},
        {title: 'Recibidos', component: RecibidoPage, icon: 'cart'},
        {title: 'Ventas', component: VentasPage, icon: 'cash'},
        {title: 'Estado Cuentas', component: EstadoCuentasPage, icon: 'briefcase'},
        {title: 'Reportes', component: ReportesPage, icon: 'document'},
        {title: 'Discos', component: DiscosPage, icon: 'disc'},
        {title: 'Cierre Gestión', component: CierreGestionPage, icon: 'hand'},
        {title: 'Salir Sesion', component: LoginPage, icon: 'exit'}
      ];
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.platform.registerBackButtonAction(()=>{
        if(this.nav.canGoBack()){
          this.nav.pop();
        }else{
            this.showAlert();
        }
      });
      this.statusBar.backgroundColorByHexString("#b55736");
      this.splashScreen.hide();
    });
  }
  showAlert() {
    let confirm = this.alertCtrl.create({
      title: 'Salir',
      message: 'Realmente quiere salir de la aplicación?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Disagree clicked');
            return;
          }
        },
        {
          text: 'Salir',
          handler: () => {
            console.log('Agree clicked');
            this.platform.exitApp();
          }
        }
      ]
    });
    confirm.present();
  }
  showToast() {
    let toast = this.toastCtrl.create({
      message: 'Presione otra vez para salir.',
      duration: 2000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
