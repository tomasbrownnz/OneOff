import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewApplicantsListPage } from './view-applicants-list';

@NgModule({
  declarations: [
    ViewApplicantsListPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewApplicantsListPage),
  ],
})
export class ViewApplicantsListPageModule {}
