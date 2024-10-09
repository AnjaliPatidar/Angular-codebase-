import { Component, OnInit } from '@angular/core';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import * as L from 'leaflet';
import { EntityConstants } from '@app/modules/entity/constants/entity-company-constant';
import { EntityCommonTabService } from '@app/modules/entity/services/entity-common-tab.service';
// import "node_modules/leaflet.tilelayer.colorfilter/src/leaflet-tilelayer-colorfilter.js"
declare const require: any;

@AutoUnsubscribe()
@Component({
  selector: 'app-location-hours',
  templateUrl: './location-hours.component.html',
  styleUrls: ['./location-hours.component.scss']
})
export class LocationHoursComponent implements OnInit {
  private map;
  icon = {
    icon: L.icon({
      iconSize: [10, 41],
      iconAnchor: [13, 0],
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png'
    })
  };
  public openingHoursSpecification: any = [];
  private registerAddress: string;
  public pageloader = EntityConstants.basicSharedObject.pageloader;
  showLocationHours = false;
  constructor(public entityCommonTabService: EntityCommonTabService) { }

  ngOnInit() {
    this.entityCommonTabService.sourceTargetDetails.subscribe((data: any) => {
      if (Object.keys(data).length > 0) {
        for (let companies of data.results) {
          if (companies.overview.comapnyInfo.fullAddress && companies.overview.comapnyInfo.OpeningHours) {
            this.registerAddress = companies.overview.comapnyInfo.fullAddress.value
            this.openingHoursSpecification = JSON.parse(companies.overview.comapnyInfo.OpeningHours.value)
          }
        }
        if (this.registerAddress && this.openingHoursSpecification && this.registerAddress !== null && this.registerAddress !== undefined && this.openingHoursSpecification !== null && this.openingHoursSpecification !== undefined) {
          setTimeout(() => {
            this.getSearchData(this.registerAddress);
          }, 500);
        } else {
          this.showLocationHours = true;
        }
      }
    }, err => {
    })
  }

  ngOnDestroy() {
  }

  // method to display location in map frame using address
  getSearchData(registerAddress) {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png")
    });

    this.map = L.map("map1", {
      center: [0, 0],
      zoom: 16,
      attributionControl: false,
      zoomControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png', {
      maxZoom: 20
    }).addTo(this.map);
   
    const queryAddress = registerAddress;
    const provider = new OpenStreetMapProvider()
    const queryParams = provider.search({
      query: queryAddress
    });

    queryParams.then(response => {
      for (let i in response) {
        const xCordinate = response[i].x;
        const yCordinate = response[i].y;
        this.map.setView([yCordinate, xCordinate], 16);
        L.marker([yCordinate, xCordinate]).addTo(this.map)
      };
    });
    this.map.doubleClickZoom.disable();
  }
}
