import {Component, DoCheck, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {
  ActionSheetController, AlertController, FabContainer, IonicPage, LoadingController, ModalController, NavController,
  NavParams, ToastController
} from 'ionic-angular';
import {Ambientes, ResponseExistences} from "../response/response-existences";
import {Subscription} from "rxjs/Subscription";
import {environment} from "../../app/enviroment";
import {ArticulosPedidosGet, DatosPedidos, ResponseListPedidos} from "../response/response-list-pedidos";
import {ArticuloPedido, RequestPedido, ResponsePedido} from "../request/request-pedido";
import {DataShareProvider} from "../../providers/data-share/data-share";
import {SicServiceProvider} from "../../providers/sic-service/sic-service";
import {ModalRecibidoPage} from "../modal-recibido/modal-recibido";
import {TokenProvider} from "../../providers/token/token";

var Mousetrap = require('mousetrap');
var Mousetrap_global = require('mousetrap-global-bind');
var PHE = require("print-html-element");

/**
 * Generated class for the RecibidoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-recibido',
  templateUrl: 'recibido.html',
})
export class RecibidoPage implements OnDestroy, OnInit, OnChanges, DoCheck {


  txtNumMovimiento;
  txtFecha: any;
  txtCodProveedor;
  txtDescripcion;
  txtCodArticulo;
  txtCantidadCompra: number = null;
  txtPrecZonLib: number = null;
  txtNomProveedor;
  txtDescripcion2;
  txtCantidadTotal;
  txtPrecioTotal;
  convertedDate = '';
  txtFechaConvert;
  listadoInPedidos: ArticuloPedido[];
  pedidosGuardados: RequestPedido;
  pedidoInsertado: ResponsePedido;
  idPedidoRecuperado: number = null;
  listaPedidos: ResponseListPedidos;
  listaArticulosPorPedido: ArticulosPedidosGet[];
  cantidadPedidos: number = 0;
  precioPedidos: number = 0;

  cantidadTotalPedido: number = 0;
  precioTotalPedido: number = 0;
  precioTotalCompra: number = 0;

  pedidoBack: DatosPedidos;
  url:string = environment.url;

  message: any;
  subscription: Subscription;
  jsonConvert: any;

  classIncorrecto: boolean = false;
  classIncorrectoPro: boolean = false;
  mostrarExistencias: boolean = false;
  respuestaExistencias:ResponseExistences = new ResponseExistences(null,true,"");
  mdlAmbiente:Ambientes[] = new Array();
  @ViewChild('idCodigoArticulo') idCodigoArticulo;
  @ViewChild('itemCodArt') itemCodArt;
  @ViewChild('cantidadCompra') cantidadCompra;
  @ViewChild('idTxtProveedor') idTxtProveedor;
  @ViewChild('idTxtPrecZonLib') idTxtPrecZonLib;
  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController,
              public loadingCtrl: LoadingController, private sicService: SicServiceProvider, public toastCtrl: ToastController,
              public alertCtrl: AlertController, public modalCtrl: ModalController, public sharedService: DataShareProvider,
              public tokenService:TokenProvider
  ){
    console.log("***********************************")
    console.log(this.tokenService.get());
    this.subscription = this.sharedService.getData().subscribe(data => {
      if (data != null) {
        var valor = JSON.stringify(data);
        if (valor != null) {
          this.toDatosPedidos(valor);
        }
      }
    });
  }
  public toDatosPedidos(data: string) {
    if (data != null) {
      var jsonData: any = new Object();
      //try{
      jsonData = JSON.parse(data);
      this.jsonConvert = jsonData;
      console.log("JSON DATA");

      this.obtenerString();
    }
  }
  public obtenerString() {
    if(this.jsonConvert.id == 0){
      this.iniciarNuevoPedido();
    }else {
      this.idPedidoRecuperado = this.jsonConvert.id;
      this.txtFechaConvert = this.jsonConvert.fechaMovimiento;
      this.txtNumMovimiento = this.jsonConvert.nroMovimiento;
      this.txtCodProveedor = this.jsonConvert.codigo;
      //this.infoProveedor();
      this.txtDescripcion = this.jsonConvert.observacion;
      this.listadoInPedidos = [];
      for (let articulo of this.jsonConvert.lista) {
        this.listadoInPedidos.push(new ArticuloPedido(articulo.id, articulo.codigoArticulo, articulo.cantidad, articulo.precio, articulo.observacion));

        this.txtCantidadTotal = (this.txtCantidadTotal * 1) + (articulo.cantidad * 1);
        this.txtPrecioTotal = (articulo.cantidad * articulo.precio) + (this.txtPrecioTotal * 1);
      }
      this.listadoInPedidos = this.listadoInPedidos.reverse();
    }
  }
  public iniciarNuevoPedido(fab?: FabContainer) {
    if(fab!=null) {
      fab.close();
    }

    //this.BuscarPedido();
    //this.txtNumMovimiento = 12312; //TODO: obtener los valores
    this.txtFecha = new Date();
    if (!this.txtFechaConvert) {
      this.txtFechaConvert = new Date(this.txtFecha).toISOString();
    }
    this.idPedidoRecuperado = null;
    this.txtDescripcion = '';
    this.txtCodProveedor = '';
    this.txtNomProveedor = '';
    this.txtCodArticulo = '';
    this.txtCantidadCompra = null;
    this.txtPrecZonLib = null;
    this.txtDescripcion2 = "";
    this.txtCantidadTotal = 0;
    this.txtPrecioTotal = 0;
    this.listadoInPedidos = [];
    setTimeout(() => {
      this.idTxtProveedor.setFocus();
    },400);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RecibidoPage');
  }
  ionViewDidEnter(){
    Mousetrap.bindGlobal(['command+g', 'ctrl+g'], () => {
      //this.confirmarAccion(null)
    })
    Mousetrap.bindGlobal(['command+n', 'ctrl+n'], () => {
      //this.nuevoPedido()
    })
    Mousetrap.bindGlobal(['command+i', 'ctrl+i'], () => {
      console.log('Imprimiendo reporte...')
      //this.generarReporte()
    })
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngDoCheck(): void {
  }
  public keytab(event) {
    console.log("evento log")
    console.log(event);
  }
  public validaCantidadPermitida(cantidadCompra: number) {
    if(cantidadCompra > 0 )
      this.idTxtPrecZonLib.setFocus();
  }
  public formatInt(event: any) {
    if(event.charCode >= 48 && event.charCode <= 57) {
      return true
    }
    return false;
  }
  public utilFormatNumber(event: any, len:number) {
    var value = event.value + '';
    console.log(value);
    var array = value.split('.');
    if( array.length == 2 ) {
      var decimal = array[1];
      if( decimal.length >= len ) {
        return false;
      }
    }
    return true;
  }
  public openModalWithParams() {
    this.detallePedidos();
  }
  public detallePedidos() {
    const loading = this.loadingCtrl.create({
      content: 'Listando Productos'
    });
    loading.present();
    var urlListaProveedor = '/transferencia/recibir/recibidos/list';
    this.sicService.getGlobal<ResponseListPedidos>(urlListaProveedor).subscribe(
      data => {
        console.log(data);
        loading.dismiss();
        if (data.respuesta) {
          this.listaPedidos = data;
          this.navCtrl.push(ModalRecibidoPage, {
            detallePedidos: this.listaPedidos,
            tipoPeticion: 1
          });
        } else {
          this.presentToast('No se pudo recuperar los datos solicitados.');
        }
      },error=>{
        loading.dismiss();
        this.presentToast("No se pudo obtener los datos");
        //TODO:generar mensaje de error
      });
  }
  public presentToast(mensaje: string) {
    const toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Toas Dimissed');
    });

    toast.present();
  }
  public detalleLlegadas() {
    const loading = this.loadingCtrl.create({
      content: 'Listando Productos'
    });
    loading.present();
    var urlListaProveedor = '/transferencia/envio/list';
    this.sicService.getGlobal<ResponseListPedidos>(urlListaProveedor).subscribe(
      data => {
        console.log(data);
        loading.dismiss();
        if (data.respuesta) {
          this.listaPedidos = data;
          this.navCtrl.push(ModalRecibidoPage, {
            detallePedidos: this.listaPedidos,
            tipoPeticion: 0
          });
        } else {
          this.presentToast('No se pudo recuperar los datos solicitados.');
        }
      });
  }


}
