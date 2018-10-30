import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewMyJobPage } from './view-my-job';

@NgModule({
  declarations: [
    ViewMyJobPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewMyJobPage),
  ],
})
export class ViewMyJobPageModule {}
