import { Component, OnInit ,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {HttpClient } from '@angular/common/http';
import { AppConstants } from '@app/app.constant';
import { versionsConstant } from './about.constants';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  // servicesListKeys = ['BE Explorer Front End','BE Explorer Back End','BE Entity'];
  servicesListKeys:any  = [];
  isNoDataFound = false;
  elementVersion = '';
  // versionsDescription:any = {};
  currentProduct:any;
  // staticVersionDescription = "BYOS 1.12 is the program a personal computer's microprocessor uses to get the computer system started after you turn it on. It also manages data flow between the computer's operating system and attached devices such as the hard disk, video adapter, keyboard, mouse and printer.";
  servicesList:any = {
    // 'BE Explorer Front End' : 'DEV',
    // 'BE Explorer Back End' : 'DEV',
    // 'BE Entity' : 'DEV',
  }
  versionsDescription:any = {
    'Explorer':'Service serves as front end and main gateway to Element product from end user perspective',
    'BE-Watchlist':'Service responsible for managing a variety of watchlists repositories.',
    'BE-Sources':'Service managing internal / offline / external web and several other types of information sources. Sources can be present in different format (HTML, CSV, XML etc.) and available through variety of communication protocols (SQL, HTTP/REST, file system).',
    'BE-Entity':'Service responsible for internal data representation and management inside Element product. In particular it is responsible for multisource records reconciliation, Entity Resolution etc.',
    'BE-News':'Processing of unstructured sources, covering the identification of articles, contextual classification, entity extraction, entity resolution and disambiguation, and more.'
  }
  constructor(
    public http: HttpClient,
    public dialogRef: MatDialogRef<AboutComponent>,
    @Inject(MAT_DIALOG_DATA) public data ) { }

  ngOnInit() {
    // this.http.get(AppConstants.Ehub_Rest_API + 'productVersions/latest').toPromise().then((response : any)=>{
    //   if(response  && response.version){
    //     this.servicesList['BE Explorer Front End'] = response.version;
    //     this.servicesList['BE Explorer Back End'] = response.version;
    //   }
    // })
    // .catch(()=>{})
    // let res = this.versionConstant.getVersionDetails()
    if(versionsConstant.servicesListKeys && versionsConstant.servicesList && versionsConstant.servicesListKeys.length){
       this.servicesListKeys = versionsConstant.servicesListKeys;
       this.servicesList = versionsConstant.servicesList;
      //  this.versionsDescription = versionsConstant.versionsDescription;
      this.elementVersion = this.servicesList['Explorer'];
       this.currentProduct = 'Explorer';
    } else {
      this.http.get(AppConstants.Ehub_Rest_API + 'productVersions/releaseVersions').toPromise().then((response : any)=>{
        if(response  && response.length){
          this.isNoDataFound = false;
            response.map((item) => {

                if(item.product && item.version){
                  if(item.product == 'BE_EXPLORER'){
                    this.servicesListKeys.push('Explorer');
                    // this.servicesListKeys.push('Explorer')
                    this.servicesList['Explorer'] = item.version;
                      this.servicesList['Explorer'] = item.version;
                      // this.versionsDescription.push('explorer');
                      // this.versionsDescription['Explorer'] = this.staticVersionDescription;
                      this.currentProduct = 'Explorer';
                      this.elementVersion = item.version;

                  } else {
                    let productName = item.product.replace('_','-');
                    let product = productName.substr(0,4)+productName.substr(4).toLowerCase();
                    this.servicesListKeys.push(product);
                    this.servicesList[product] = item.version;
                    // this.versionsDescription.push(productName)
                    // this.versionsDescription[product] = this.staticVersionDescription;

                  }
                }
              // if(item.product == 'BE_ENTITY'){
              //   this.servicesList['BE Entity'] = item.version;
              // }
            })
            versionsConstant.servicesListKeys = this.servicesListKeys;
            versionsConstant.servicesList = this.servicesList;
            // versionsConstant.versionsDescription = this.versionsDescription;
        } else {
          this.isNoDataFound = true;
        }
      })
      .catch(()=>{this.isNoDataFound = true;})
    }


  }

  showDescription(product){
    this.currentProduct = product;
  }

  close(){
    this.dialogRef.close();
  }


}
