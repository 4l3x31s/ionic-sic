import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalEntregasPage } from './modal-entregas';

@NgModule({
  declarations: [
    ModalEntregasPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalEntregasPage),
  ],
})
export class ModalEntregasPageModule {}
