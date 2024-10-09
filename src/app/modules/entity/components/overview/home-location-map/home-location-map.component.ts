import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import * as L from "leaflet";
// import "node_modules/leaflet.tilelayer.colorfilter/src/leaflet-tilelayer-colorfilter.js"
declare const require: any;

@Component({
  selector: "app-home-location-map",
  encapsulation: ViewEncapsulation.None,
  templateUrl: "./home-location-map.component.html",
  styleUrls: ["./home-location-map.component.scss"],
})
export class HomeLocationMapComponent implements OnInit {
  @Input() homeLocationData: any;
  private map;
  isLightTheme = false;
  constructor() {

    let themeName = JSON.parse(localStorage.getItem("ehubObject")).theme;

    if (themeName === "Light Theme") {
      // light theme

      this.isLightTheme = true;
    }

  }

  ngOnInit() {
    let address = "";
    const data = this.homeLocationData;

    const street_address =
      data &&
      data.value &&
      data.value.length &&
      data.value[0].address.street_address
        ? data.value[0].address.street_address
        : "";
    const locality =
      data && data.value && data.value.length && data.value[0].address.locality
        ? data.value[0].address.locality
        : "";
    const region =
      data && data.value && data.value.length && data.value[0].address.region
        ? data.value[0].address.region
        : "";
    const postal_code =
      data &&
      data.value &&
      data.value.length &&
      data.value[0].address.postal_code
        ? data.value[0].address.postal_code
        : "";
    const country =
      data && data.value && data.value.length && data.value[0].address.country
        ? data.value[0].address.country
        : "";

    if (street_address && street_address.trim()) {
      address = address + street_address + ", ";
    }

    if (locality && locality.trim()) {
      address = address + locality + ", ";
    }

    if (region && region.trim()) {
      address = address + region + ", ";
    }

    if (postal_code && postal_code.trim()) {
      address = address + postal_code + ", ";
    }

    if (country && country.trim()) {
      address = address + country;
    }
    address = address.trim();

    if (address.endsWith(",")) {
      address = address.slice(0, -1);
    }

    setTimeout(() => {
      this.loadMap(address, data);
    }, 500);
  }

  // method to load map data
  loadMap(address, data) {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    });

    this.map = L.map("map", {
      center: [0, 0],
      zoom: 5,
      attributionControl: false,
      zoomControl: false,
    });

    L.control
      .zoom({
        position: "bottomright",
      })
      .addTo(this.map);


    if (this.isLightTheme) {
      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 20,
        }
      ).addTo(this.map);

    } else {
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png",
        {
          maxZoom: 20,
        }
      ).addTo(this.map);



    }

    // const tiles = L.tileLayer(
    //   "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    //   {
    //     maxZoom: 19,
    //     attribution:
    //       '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    //   }
    // );
    // tiles.addTo(this.map);

    // L.tileLayer(
    //   "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png",
    //   {
    //     maxZoom: 20,
    //   }
    // ).addTo(this.map);

    // const customOptions = {
    //   className: 'custom-popup',
    // };

    const provider = new OpenStreetMapProvider();
    const queryParams = provider.search({ query: address });
    queryParams.then((response) => {
      for (const i in response) {
        const xCordinate = response[i].x;
        const yCordinate = response[i].y;

        this.map.setView([yCordinate, xCordinate], 6);
        // var popup = L.popup()
        //   .setLatLng([yCordinate, xCordinate])
        //   .setContent("I am a standalone popup.")
        //   .openOn(this.map);
        const marker = new L.marker([yCordinate, xCordinate]);
        const customOptions = { className: "custom-popup" };
        marker
          .bindPopup(
            this.makeCapitalPopup(address, data.value[0].address.country),
            customOptions
          )
          .addTo(this.map);

        // for (const index in nearByCompanies) {
        //   if (this.nearByCompanies[index]) {
        //     marker
        //       .bindPopup(this.makeCapitalPopup(data), customOptions)
        //       .addTo(this.map);
        //   }
        // }
      }

      //  this.buildLedgend();

      // let legend = L.control({ position: 'topright' });

      // let html = "";
      // html= this.getHoverModalTemplate(data);
      // legend.onAdd = function(map,html){
      //    var div = L.DomUtil.create('div', 'legend');
      //   div.innerHTML = html;
      //    return div;
      //  };

      // legend.addTo(this.map);

      // ----------
    });
  }

  buildLedgend() {
    /*Legend specific*/
    var legend = L.control({ position: "topright" });

    legend.onAdd = () => {
      var div = L.DomUtil.create("div", "legend");

      if (
        !this.homeLocationData ||
        ((!this.homeLocationData.primiarySources ||
          this.homeLocationData.primarySourceLength == "undefined" ||
          this.homeLocationData.primiarySources.length == 0) &&
          (!this.homeLocationData.secondarySources ||
            this.homeLocationData.secondarySourceLength == "undefined" ||
            this.homeLocationData.secondarySources.length == 0))
      ) {
        return;
      }

      let html =
        `` +
        `<div>
            <div class="panel panel-default">
              <div class="panel-heading">Sources</div>
              <div class="panel-body"> `;

      // Primary Sources
      if (this.homeLocationData.primiarySources) {
        html =
          html +
          `
               <div class="row p-0 mb-2">
                  <div class="col-8">Primary Sources</div>
                  <div class="col-2"><span class="material-icons mt-n2 f-20 primaryLink light-theme-light-black">insert_link</span></div>
                  <div class="col-2">` +
          this.homeLocationData.primarySourceLength +
          `</div>
                </div>
        `;
        if (
          this.homeLocationData.primiarySources &&
          this.homeLocationData.primarySourceLength > 0
        ) {
          this.homeLocationData.primiarySources.map((d, index) => {
            if (d) {
              let check = ``;
              if (
                d.source == this.homeLocationData.source &&
                !this.homeLocationData.isUserData
              ) {
                check = `<span class="material-icons f-10 light-theme-light-black">check</span>`;
              }
              html =
                html +
                `
                    <div class="row small p-0">
                      <div class="col-6">` +
                d.source +
                ` </div>
                      <div class="col-4">` +
                d.credibility +
                `</div>
                      <div class="col-2">` +
                check +
                ` </div>
                     </div>
                  `;
            }
          });
        } else {
          html =
            html +
            `
                    <div class="row small p-0">
                      <div class="col-12"><span class="text-dark-black" style="word-break: break-word; white-space:pre-wrap">No Sources Available</span></div>
                    </div>
                  `;
        }
      }
      html = html + `<hr />`;
      // Secondary Sources
      if (this.homeLocationData.secondarySources) {
        html =
          html +
          `
                <div class="row p-0 mb-2">
                  <div class="col-8">Secondary Sources</div>
                  <div class="col-2"><span class="material-icons mt-n2 f-20 primaryLink light-theme-light-black">insert_link</span></div>
                  <div class="col-2">` +
          this.homeLocationData.secondarySourceLength +
          `</div>
                </div>
        `;

        if (
          this.homeLocationData.secondarySources &&
          this.homeLocationData.secondarySourceLength > 0
        ) {
          this.homeLocationData.secondarySources.map((d, index) => {
            var check = "";
            if (d) {
              if (
                d.source == this.homeLocationData.source &&
                !this.homeLocationData.isUserData
              ) {
                check = `<span class="material-icons f-10 light-theme-light-black">check</span>`;
              }

              html =
                html +
                `
                    <div class="row small p-0">
                      <div class="col-6">` +
                d.source +
                ` </div>
                      <div class="col-4">` +
                d.credibility +
                `</div>
                      <div class="col-2">` +
                check +
                `</div>
                     </div>
                  `;
            }
          });
        } else {
          html =
            html +
            `
                    <div class="row small p-0">
                      <div class="col-12"><span class="text-dark-black" style="word-break: break-word; white-space:pre-wrap">No Sources Available</span></div>
                    </div>
                  `;
        }
      }

      html =
        html +
        `           </div>
                  </div>
               </div>
                  `;
      div.innerHTML = html;

      return div;
    };

    legend.addTo(this.map);
  }

  // method to open popup when click on map location marker
  makeCapitalPopup(data: any, flag: any) {
    return (
      `` +
      `<div>
          <div class="map-popover-headding">
            <p class="popup-header">Home</p>
          </div>
          <div class="map-popover-body">
            <p>

               <span>Country<span class="mar-l5">:</span></span><span class="flag-icon flag-icon-squared flag-icon-${flag}"></span>${flag}
            </p>
            <p>
              <span>Address<span class="mar-l5">:</span></span>  ${data}
            </p>
          </div>
      </div>`
    );
  }
}
