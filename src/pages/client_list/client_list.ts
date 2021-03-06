import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from "@angular/http";

import { LoadingController } from "ionic-angular";
import { ToastController } from 'ionic-angular';
import "rxjs/add/operator/map";
import {Events} from 'ionic-angular';

import{AddClientPage} from './add_client/add_client';
import{SingleClientPage} from './single_client/single_client';

import {ApiValuesProvider} from '../../providers/api-values/api-values';

@Component({
  selector: 'client_list',
  templateUrl: 'client_list.html'
})


export class ClientListPage
{

	clients:any;
	c_case_type:string;
	c_case_year:string;
	c_case_category:string;
	c_search:string;

	constructor(public events:Events,public apiValue:ApiValuesProvider,public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,public toastCtrl: ToastController,  private http: Http,  public loading: LoadingController)
	{
		this.fetchData();
        
    }

    addClient()
    {
    	console.log('addClient() clicked');
    	this.navCtrl.push(AddClientPage);
    }

    searchClient()
	{
		this.events.publish('mainSearch','ds'); //This event is defined in app.component.ts file
	}

   fetchData()
	{
	
	   var headers = new Headers();
	   this.clients=[];

       headers.append("Accept", "application/json");

       headers.append("Content-Type", "application/json" );

       let options = new RequestOptions({ headers: headers });

  

       let data = { //Data to be sent to the server
       				
			    case_type:this.c_case_type,
			    year:this.c_case_year,
			    case_category:this.c_case_category,
			    advocate_id:'',
			    keyword:this.c_search

           
         };

		let loader = this.loading.create({

		   content: "Fetching data please wait…",

		 });

	   loader.present().then(() => 
		{

	   this.http.post(this.apiValue.baseURL+"/client_list.php",data,options) //Http request returns an observable

	   .map(response => response.json()) ////To make it easy to read from observable

	   .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data
				  
			{ 
		   			console.log(serverReply);
		   			loader.dismiss();

		   				if('message' in serverReply || 'code' in serverReply)
		   				{

					   		const toast = this.toastCtrl.create({
										  message: serverReply.message,
										  duration: 3000
										});
										toast.present();
		   				}
		   				else
		   				{
		   					this.clients=serverReply;
		   				}
				 
			      

			   });

  		 });
		

    }

   

    viewClient(c_id)
    {

    	console.log("viewClient() is clicked with id="+c_id);
    	let data={
    		id:c_id
    	};

    	this.navCtrl.push(SingleClientPage,data);
    }

}