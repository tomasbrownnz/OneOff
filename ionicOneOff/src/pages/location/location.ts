import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import leaflet from 'leaflet';
import { AngularFireAuth } from '../../../node_modules/angularfire2/auth';
import { AngularFireDatabase } from "angularfire2/database";
import {job} from '../../models/job';
/**
 * Generated class for the LocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-location',
  templateUrl: 'location.html',
})

export class LocationPage {

  @ViewChild('locationPicker') mapContainer: ElementRef;
  map: any;
  job: job;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    public afDatabase: AngularFireDatabase
  ) {
    this.job = navParams.get('job');
  } 

  ionViewDidLoad() {
    this.removeMap();
    this.loadMap();
  }


  loadMap(){
    this.removeMap();
    this.map = leaflet.map('locationPicker').fitWorld();
    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18
    }).addTo(this.map);
    
    if(confirm("Is your current location the location of the job?")){
      console.log("ttttt");
      this.map.locate({
        setView: true,
        maxZoom: 12
      }).on('locationfound', (e) => {
        this.afAuth.authState.take(1).subscribe(auth => {
          this.job.Employer = auth.uid;
          var postReference = this.afDatabase.list(`profile/${auth.uid}/myjobs/`).push(this.job.JobId);
          this.job.JobId = postReference.key;
          this.job.locationLat = e.latitude;
          this.job.locationLong = e.longitude;
          this.afDatabase.database.ref(`jobs/${this.job.JobId}`).set(this.job);
          this.afDatabase.database.ref(`profile/${auth.uid}/myjobs/${this.job.JobId}`).set(
            this.job.JobId    
          );
          this.navCtrl.setRoot('JobsPage', {job: this.job});
        })
      })
      
    }else{
      console.log("yikes");
      alert("Sorry we can only support jobs at your location right now.");
      this.navCtrl.setRoot('JobsPage', {job: this.job});
    }
  }

  removeMap(){
    if (this.map){
      this.map.eachLayer(function(layer){
          layer.remove();
      });
      this.map.remove();
      this.map = null;
  }
  }

}
