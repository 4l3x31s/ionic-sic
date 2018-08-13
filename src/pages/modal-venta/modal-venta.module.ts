import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalVentaPage } from './modal-venta';

@NgModule({
  declarations: [
    ModalVentaPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalVentaPage),
  ],
})
export class ModalVentaPageModule {}
