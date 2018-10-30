import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {job} from '../../models/job';
import { AngularFireAuth } from "angularfire2/auth";
import {AngularFireDatabase} from "angularfire2/database"
import { analyzeFile } from '../../../node_modules/@angular/compiler';

/**
 * Generated class for the NewJobPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-job',
  templateUrl: 'new-job.html',
})
export class NewJobPage {

  job = {} as job;
  
  
  constructor(private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase,public navCtrl: NavController, public navParams: NavParams) {
  }
  

  ionViewDidLoad() {}

  newJob(){
    this.navCtrl.setRoot('LocationPage', {job: this.job});
  }

  showMap(){

  }

}
