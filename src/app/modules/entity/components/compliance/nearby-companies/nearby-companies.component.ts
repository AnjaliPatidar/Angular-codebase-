import { Component, OnInit } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import * as L from 'leaflet';
// import "node_modules/leaflet.tilelayer.colorfilter/src/leaflet-tilelayer-colorfilter.js"
import { EntityCommonTabService } from '@app/modules/entity/services/entity-common-tab.service';
declare const require: any;

@AutoUnsubscribe()
@Component({
  selector: 'app-nearby-companies',
  templateUrl: './nearby-companies.component.html',
  styleUrls: ['./nearby-companies.component.scss']
})

export class NearbyCompaniesComponent implements OnInit {
  private map;
  icon = {
    icon: L.icon({
      iconSize: [25, 41],
      iconAnchor: [13, 0],
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png'
    })
  };
  // private icon;
  nearByCompanies: any;
  constructor(public entityCommonTabService: EntityCommonTabService) { }

  ngOnInit() {
    this.entityCommonTabService.sourceTargetDetails.subscribe((data: any) => {
      if (Object.keys(data).length > 0) {
        for (let companies of data.results) {
          if (companies.overview.comapnyInfo.nearby) {
            this.nearByCompanies = JSON.parse(companies.overview.comapnyInfo.nearby.value);
          }
        }
        if (this.nearByCompanies !== null && this.nearByCompanies !== undefined) {
          setTimeout(() => {
            this.loadMap(this.nearByCompanies);
          }, 500);
        }
      }
    }, err => {
    })
  }

  ngOnDestroy() {
  }

  // method to load map data 
  loadMap(nearByCompanies) {

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png")
    });

    this.map = L.map('map', {
      center: [0, 0],
      zoom: 5,
      attributionControl: false,
      zoomControl: false
    });

    L.control.zoom({
      position: 'bottomright'
    }).addTo(this.map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png', {
      maxZoom: 20
    }).addTo(this.map);

    const customOptions = {
      'className': 'custom-popup'
    }
    for (let data of nearByCompanies) {
      const provider = new OpenStreetMapProvider();
      const queryParams = provider.search({ query: data.address });
      queryParams.then(response => {
        for (let i in response) {
          const xCordinate = response[i].x;
          const yCordinate = response[i].y;
          this.map.setView([yCordinate, xCordinate], 6);
          const marker = new L.marker([yCordinate, xCordinate]);
          for (let index in nearByCompanies) {
            if (this.nearByCompanies[index]) {
              marker.bindPopup(this.makeCapitalPopup(data), customOptions)
                .addTo(this.map);
            }
          }

        };
      });
    }
  }

  // method to open popup when click on map location marker
  makeCapitalPopup(data: any) {
    return `` +
      `<div>
          <div class="map-popover-headding">
            <p class="popup-header" onclick="window.open('${data.SameAs}')">
              ${data.name}
            </p>
          </div>
          <div class="map-popover-body">
            <p class="comp-details d-flex">
              <span class="pop-content">Address<span class="mar-l5">:</span></span>${ data.address}
            </p>
          </div>
      </div>`
  }
}

