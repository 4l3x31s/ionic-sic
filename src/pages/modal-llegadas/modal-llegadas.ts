import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  IonicPage, LoadingController, NavController, NavParams, ToastController
} from 'ionic-angular';
import {ArticulosPedidosGet, DatosPedidos, ResponseListPedidos} from "../response/response-list-pedidos";
import {SicServiceProvider} from "../../providers/sic-service/sic-service";
import {GlobalResponse} from "../response/globalResponse";
import {DataShareProvider} from "../../providers/data-share/data-share";
import { Location } from '@angular/common';
import {Subscription} from "rxjs/Subscription";
import {environment} from "../../app/enviroment";

/**
 * Generated class for the ModalLlegadasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-llegadas',
  templateUrl: 'modal-llegadas.html',
})
export class ModalLlegadasPage implements OnDestroy, OnInit {


  listaPedidos: ResponseListPedidos;
  listaPedidosGuardado: ResponseListPedidos;
  listaArticulosPorPedido: ArticulosPedidosGet[];
  listaArticulosPorPedido2: ArticulosPedidosGet[];

  cantidadPedidos: number = 0;
  precioPedidos: number = 0;

  cantidadTotalPedido: number = 0;
  precioTotalPedido: number = 0;
  precioTotalCompra: number = 0;

  idPedido: number = 0;
  tipoPeticion :number;
  titulo: string;
  strDetallePedidos: string;
  url:string = environment.url;
  subscription: Subscription;
  txtBuscaArticulo:string;


  constructor(public navCtrl: NavController, public navParams: NavParams, private sicService: SicServiceProvider,
              public loadingCtrl: LoadingController, public alertCtrl: AlertController, public toastCtrl: ToastController,
              public sharedService: DataShareProvider, public location: Location, public actionSheetCtrl: ActionSheetController) {
    this.listaPedidos = navParams.get('detallePedidos');
    this.tipoPeticion = navParams.get('tipoPeticion');

    if(this.tipoPeticion == 0){
      this.titulo = "Pedidos Por Llegar"
    }else{
      this.titulo = "Llegadas"
    }
    //console.log(this.listaPedidos);
  }

  ionViewDidLoad() {
    this.listaPedidos = this.navParams.get('detallePedidos');
  }

  ngOnInit() {
    this.strDetallePedidos = JSON.stringify(this.listaPedidos.list);
    let pedidosDetalle:ResponseListPedidos;
    this.listaPedidos = this.navParams.get('detallePedidos');
    pedidosDetalle = this.listaPedidos;
    this.listaPedidosGuardado = pedidosDetalle;
    console.log(this.listaPedidosGuardado);
    //this.sharedService.setUtilData(this.listaPedidosGuardado);
    this.detallePedidos();
  }

  public imprimirReporte(id:number){
    console.log("este es el ID: " + id);
    if(this.tipoPeticion == 0){
      window.open(this.url + "/reporte/porllegar_mov/pdf/view/"+id, "_blank")//TODO: aca solo hay que concaternar el ID como tenga que llamarse en el servicio
    } else {
      window.open(this.url + "/reporte/llegada_mov/pdf/view/"+id, "_blank")//TODO: aca solo hay que concaternar el ID como tenga que llamarse en el servicio
    }
  }
  public imprimirExcel(id:number){
    if(this.tipoPeticion == 0){
      window.open(this.url + "/reporte/porllegar_mov/xls/view/"+id, "_blank")//TODO: aca solo hay que concaternar el ID como tenga que llamarse en el servicio
    } else {
      window.open(this.url + "/reporte/llegada_mov/xls/view/"+id, "_blank")//TODO: aca solo hay que concaternar el ID como tenga que llamarse en el servicio
    }
  }
  public filtrarArticulo(){
    if(this.listaArticulosPorPedido != null) {
      let listaArticulos:ArticulosPedidosGet[] = this.listaArticulosPorPedido;
      this.listaArticulosPorPedido =[];
      if(listaArticulos.length>0){
        for(let articulo of listaArticulos){
          if(this.txtBuscaArticulo === articulo.codigoArticulo){
            this.listaArticulosPorPedido.push(articulo);
          }
        }
      }
    }
  }
  public refrescar(){
    this.listaArticulosPorPedido = []
    this.listaArticulosPorPedido = this.listaArticulosPorPedido2;
  }

  public limpiarPedidos(){
    this.listaArticulosPorPedido = null;
    this.listaArticulosPorPedido2 = null;
    this.txtBuscaArticulo = null;
    this.cantidadPedidos= 0;
    this.precioPedidos= 0;
    this.cantidadTotalPedido= 0;
    this.precioTotalPedido= 0;
    this.precioTotalCompra= 0;
    this.idPedido= 0;
  }
  public detallePedidos() {
    for (let lista of this.listaPedidos.list) {
      for (let lisArt of lista.lista) {
        this.cantidadPedidos = (lisArt.cantidad * 1) + this.cantidadPedidos;
        this.precioPedidos = (lisArt.precio * 1) + this.precioPedidos;
        this.precioPedidos = this.round(this.precioPedidos,2);
      }
    }
  }

  public round(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  }

  public listarArticulos(item: ArticulosPedidosGet[], id: number, articuloSolicitado: DatosPedidos) {
    if(this.tipoPeticion == 0){
      this.sharedService.setData(articuloSolicitado);
    }

    this.precioTotalPedido = 0;
    this.cantidadTotalPedido = 0;
    this.idPedido = id;
    this.listaArticulosPorPedido = item;
    this.listaArticulosPorPedido2 = item;
    for (let lista of this.listaArticulosPorPedido) {
      this.precioTotalPedido = (lista.precio * 1) + this.precioTotalPedido;
      this.cantidadTotalPedido = (lista.cantidad * 1) + this.cantidadTotalPedido;
      //TODO: falta para precioTotalCompra;
    }
  }
  public confirmarAccion() {
    let alert = this.alertCtrl.create({
      title: 'Confirmar',
      message: 'Está seguro que quiere realizar la operación?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.guardarPedido();
          }
        }
      ]
    });
    alert.present();
  }
  public guardarPedido() {
    this.sharedService.setData(new DatosPedidos("0","",0,"","","", null));

    if (this.idPedido === 0) {
      let mostrarAlert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Debe seleccionar un pedido.',
        buttons: ['Aceptar']
      });
      mostrarAlert.present();
      return;
    }

    const loading = this.loadingCtrl.create({
      content: 'Obteniendo los datos'
    });
    loading.present();
    var id = this.idPedido + '';
    var url = '/pedido/llegada/confirmar/';
    this.sicService.putGlobal<GlobalResponse>(null, url, id).subscribe(data => {
      loading.dismiss();
      let alert;
      if (data.respuesta) {
        alert = this.alertCtrl.create({
          title: 'Pedidos',
          subTitle: 'Se ha registrado el pedido como Llegada',
          buttons: [{
            text: 'Aceptar',
            handler: () => {
              this.limpiarPedidos();
              this.detallarPedidos();

            }
          }]
        });
        alert.present();
      } else {
        alert = this.alertCtrl.create({
          title: 'Ups',
          subTitle: data.mensaje,
          buttons: ['Aceptar']
        });
        alert.present();
        return;
      }
    });
  }
  public confirmarEliminar() {
    let alert = this.alertCtrl.create({
      title: 'Confirmar',
      message: 'Está seguro que quiere realizar la operación?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.eliminarPedido();
          }
        }
      ]
    });
    alert.present();
  }
  public eliminarPedidoLlegado(){
    let alert = this.alertCtrl.create({
      title: 'Confirmar',
      message: 'Está seguro que quiere realizar la operación?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            if (this.idPedido === 0) {
              let mostrarAlert = this.alertCtrl.create({
                title: 'Error',
                subTitle: 'Debe seleccionar un pedido.',
                buttons: ['Aceptar']
              });
              mostrarAlert.present();
              return;
            }

            const loading = this.loadingCtrl.create({
              content: 'Obteniendo los datos'
            });
            loading.present();
            var id = this.idPedido + '';
            console.log(id);
            var url = '/pedido/llegada/cancelar/';
            this.sicService.putGlobal<GlobalResponse>(null,url,id).subscribe(data => {
              loading.dismiss();
              let alert;
              if (data.respuesta) {

                alert = this.alertCtrl.create({
                  title: 'Pedidos',
                  subTitle: 'El pedido ha sido eliminado correctamente.',
                  buttons: [{
                    text: 'Aceptar',
                    handler: () => {
                      this.limpiarPedidos();
                      this.detalleLlegadas();

                    }
                  }]
                });
                alert.present();

              } else {
                alert = this.alertCtrl.create({
                  title: 'Ups',
                  subTitle: data.mensaje,
                  buttons: ['Aceptar']
                });
                alert.present();
                return;
              }
            });
          }
        }
      ]
    });
    alert.present();
  }
  public eliminarPedido(){
    if (this.idPedido === 0) {
      let mostrarAlert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Debe seleccionar un pedido.',
        buttons: ['Aceptar']
      });
      mostrarAlert.present();
      return;
    }

    const loading = this.loadingCtrl.create({
      content: 'Obteniendo los datos'
    });
    loading.present();
    var id = this.idPedido + '';
    var url = '/pedido/delete/';
    this.sicService.deleteGlobal<GlobalResponse>(id, url).subscribe(data => {
      loading.dismiss();
      let alert;
      if (data.respuesta) {

        alert = this.alertCtrl.create({
          title: 'Pedidos',
          subTitle: 'El pedido ha sido eliminado correctamente.',
          buttons: [{
            text: 'Aceptar',
            handler: () => {
              this.limpiarPedidos();
              this.detallarPedidos();

            }
          }]
        });
        alert.present();

      } else {
        alert = this.alertCtrl.create({
          title: 'Ups',
          subTitle: data.mensaje,
          buttons: ['Aceptar']
        });
        alert.present();
        return;
      }
    });
  }
  public detalleLlegadas() {
    const loading = this.loadingCtrl.create({
      content: 'Listando Productos'
    });
    loading.present();
    var urlListaProveedor = '/pedido/llegada/list';
    this.sicService.getGlobal<ResponseListPedidos>(urlListaProveedor).subscribe(
      data => {
        loading.dismiss();
        if (data.respuesta) {
          this.listaPedidos = data;
          this.navCtrl.push(ModalLlegadasPage, {
            detallePedidos: this.listaPedidos,
            tipoPeticion: 1
          });
        } else {
          this.presentToast('No se pudo recuperar los datos solicitados.');
        }
      });
  }

  public detallarPedidos(){
    const loading = this.loadingCtrl.create({
      content: 'Listando Productos'
    });
    loading.present();
    var urlListaProveedor = '/pedido/list';
    this.sicService.getGlobal<ResponseListPedidos>(urlListaProveedor).subscribe(
      data => {
        loading.dismiss();
        if(data.respuesta) {
          this.listaPedidos = data;
        }else{
          this.presentToast('No se pudo recuperar los datos solicitados.');
        }
      });
  }
  public presentToast(mensaje:string) {
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
  ngOnDestroy(): void {
    console.log("Objeto Destruido");
    //this.subscription.unsubscribe();
  }
  public reportePorLlegar(){

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Reportes',
      buttons: [
        {
          text: 'Por Llegar PDF',
          handler: () => {
            console.log('Destructive clicked');
            window.open(this.url + "/reporte/porllegar/pdf/download", "_blank");
          }
        },
        {
          text: 'Por Llegar Excel',
          handler: () => {
            console.log('Destructive clicked');
            window.open(this.url + "/reporte/porllegar/xls/download", "_blank");
          }
        },
        {
          text: 'Movimientos PDF',
          handler: () => {
            console.log('Archive clicked');
            // /reporte/existencia/{formato}/download
            window.open(this.url + "/reporte/porllegar_mov/pdf/download", "_blank");
          }
        },
        {
          text: 'Movimientos Excel',
          handler: () => {
            console.log('Archive clicked');
            window.open(this.url + "/reporte/porllegar_mov/xls/download", "_blank");
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();

  }
  public reporteLlegadas() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Reportes',
      buttons: [
        {
          text: 'Llegadas PDF',
          handler: () => {
            console.log('Destructive clicked');
            window.open(this.url + "/reporte/llegada/pdf/download", "_blank");
          }
        },
        {
          text: 'Llegadas Excel',
          handler: () => {
            console.log('Destructive clicked');
            window.open(this.url + "/reporte/llegada/xls/download", "_blank");
          }
        },
        {
          text: 'Movimientos PDF',
          handler: () => {
            console.log('Archive clicked');
            // /reporte/existencia/{formato}/download
            window.open(this.url + "/reporte/llegada_mov/pdf/download", "_blank");
          }
        },
        {
          text: 'Movimientos Excel',
          handler: () => {
            console.log('Archive clicked');
            window.open(this.url + "/reporte/llegada_mov/xls/download", "_blank");
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }
  public listarPedidos(){
    console.log(this.listaPedidos.list);
    console.log("****************************************")
    console.log(this.listaPedidosGuardado.list);

    console.log("****************************************")
    this.listaPedidos.list = this.listaPedidosGuardado.list;
    //this.listaPedidos = this.navParams.get('detallePedidos');
    //this.listaPedidosGuardado = this.navParams.get('detallePedidos');
    let datosPedidos:DatosPedidos[] = JSON.parse(this.strDetallePedidos)
    console.log(this.listaPedidos.list);
    this.listaPedidos.list = datosPedidos;
    /*this.subscription = this.sharedService.getUtilData().subscribe(data => {
      this.listaPedidos = data;
    });*/
    this.limpiarPedidos();
    this.detallePedidos();
  }
  public filtrarPorCodigo(datosPedido:string){

    let listaPedidosLocal:DatosPedidos[];
    listaPedidosLocal = this.listaPedidos.list.filter(item => item.codigo == datosPedido);

    this.listaPedidos.list = listaPedidosLocal;
    console.log(this.strDetallePedidos)
    this.limpiarPedidos();
    this.detallePedidos();
  }
  public filtrarPorObservacion(datosPedido:string){


      let alert = this.alertCtrl.create({
        title: 'Observacion',
        subTitle: datosPedido,
        buttons: ['Aceptar']
      });
      alert.present();


    /*let listaPedidosLocal:DatosPedidos[];
    listaPedidosLocal = this.listaPedidos.list.filter(item => item.observacion == datosPedido);

    this.listaPedidos.list = listaPedidosLocal;
    console.log(this.strDetallePedidos)
    this.limpiarPedidos();
    this.detallePedidos();*/
  }

  public onSeleccionado(item) {
    console.log('inrgesando ' + item)
    for (let obj of this.listaPedidos.list) {
      obj.seleccionado = '';
      if(item.id == obj.id) {
        obj.seleccionado = 'row_seleccionado';
      }
    }
    console.log(item.id);
    console.log(item.seleccionado);
  }
}
