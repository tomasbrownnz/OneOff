import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFireAuth } from "angularfire2/auth";

import {job} from '../../models/job';

/**
 * Generated class for the EditJobPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-job',
  templateUrl: 'edit-job.html',
})
export class EditJobPage {


job : job;


  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public afAuth: AngularFireAuth,
    private database: AngularFireDatabase, ) {
    this.job = navParams.get('job');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditJobPage');
    
  }
  editJob(){
    this.afAuth.authState.take(1).subscribe(auth => {
      this.job.Employer = auth.uid;
      this.database.database.ref(`jobs/${this.job.JobId}`).set(this.job);
      this.database.database.ref(`profile/${auth.uid}/myjobs/${this.job.JobId}`).set(
        this.job.JobId
      );
    });
    this.navCtrl.setRoot('JobsPage');
  }

}
