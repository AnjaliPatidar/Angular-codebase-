import { Injectable } from '@angular/core';
import * as d3 from "d3";
import { findIndex } from 'lodash-es';
import { BehaviorSubject } from 'rxjs';
declare var google;

var listOfCountriesOnClick = [];
var observerSubjectOfCountriesFromMap = new BehaviorSubject("");

var sendListToFilter = function (list) {
  observerSubjectOfCountriesFromMap.next(list);
}
@Injectable({
  providedIn: 'root'
})
export class EntityGraphService {
  constructor() { }
  public bevaviourSubjectOfCountriesFromMap = observerSubjectOfCountriesFromMap.asObservable();

  plotWorldLocationChart(barOptions) {

    var findIndexForEachCountryColor = function (d, options) {
      const index = findIndex(options, function (v: any) {
        var county_Name = v.country_name;
        if ((county_Name && (county_Name.toLowerCase() === "russian federation"))) {
          county_Name = "RUSSIA";
        }
        if ((county_Name && (county_Name.toLowerCase() === "united state"))) {
          county_Name = "united states of america";
        }
        if ((d.properties && d.properties.name && county_Name && (d.properties.name.toLowerCase() == county_Name.toLowerCase()))) {
          return (county_Name.toLowerCase() == d.properties.name.toLowerCase());
        }
        else if ((d.properties && d.properties.name && v.Country && (d.properties.name.toLowerCase() == v.Country.toLowerCase()))) {
          return (d.properties.name.toLowerCase() == v.Country.toLowerCase());
        }
      });
      return index;
    }
    /**
 * Finding index for each country name for report world map
 */
    var findIndexForEachCountryName = function (v, options) {
      const index = findIndex(options, (d: any) => {
        var county_Name = v.country_name;
        if ((county_Name && (county_Name.toLowerCase() === "russian federation"))) {
          county_Name = "RUSSIA";
        }
        if ((county_Name && (county_Name.toLowerCase() === "united state"))) {
          county_Name = "united states of america";
        }
        if ((d.properties && d.properties.name && county_Name && (d.properties.name.toLowerCase() == county_Name.toLowerCase()))) {
          return (county_Name.toLowerCase() == d.properties.name.toLowerCase());
        }
        else if ((d.properties && d.properties.name && v.Country && (d.properties.name.toLowerCase() == v.Country.toLowerCase()))) {
          return (d.properties.name.toLowerCase() == v.Country.toLowerCase());
        }
      });
      return index;
    }
    var default_map_fill_color = "#4E74DF";
    if (barOptions.container) {
      $(barOptions.container).empty();
    }
/*		    //--------------------------Initialize Values-----------------------------
*/		    if (barOptions) {
      barOptions.container = barOptions.container ? barOptions.container : "body"
      barOptions.barColor = barOptions.barColor ? barOptions.barColor : "blue"
      barOptions.readFromFile = (barOptions.readFromFile !== undefined) ? barOptions.readFromFile : false
      barOptions.dataFileLocation = (barOptions.readFromFile !== undefined || barOptions.readFromFile) ? barOptions.dataFileLocation : undefined;
      barOptions.data = (barOptions.data) ? barOptions.data : []
      barOptions.showTicks = barOptions.showTicks ? barOptions.showTicks : true;
      barOptions.ticks = barOptions.ticks ? barOptions.ticks : 'all';
      barOptions.showLegends = (barOptions.showLegends !== undefined) ? barOptions.showLegends : false;
      barOptions.xLabelRotation = barOptions.xLabelRotation ? barOptions.xLabelRotation : 0;
      barOptions.yLabelRotation = barOptions.yLabelRotation ? barOptions.yLabelRotation : 0;
      barOptions.margin = barOptions.margin ? {
        top: barOptions.margin.top ? barOptions.margin.top : 20,
        right: barOptions.margin.right ? barOptions.margin.right : 20,
        bottom: barOptions.margin.bottom ? barOptions.margin.bottom : 30,
        left: barOptions.margin.left ? barOptions.margin.left : 40
      } : { top: 0, right: 5, bottom: 0, left: 5 };
      barOptions.height = barOptions.height ? barOptions.height : 600;
      barOptions.width = barOptions.width ? barOptions.width : $(barOptions.container).width() - 10;
      barOptions.showAxisX = (barOptions.showAxisX !== undefined) ? barOptions.showAxisX : true;
      barOptions.showAxisY = (barOptions.showAxisY !== undefined) ? barOptions.showAxisY : true;
      barOptions.showXaxisTicks = barOptions.showXaxisTicks !== undefined ? barOptions.showXaxisTicks : true;
      barOptions.showYaxisTicks = barOptions.showYaxisTicks !== undefined ? barOptions.showYaxisTicks : true;
      barOptions.groupedStacked = barOptions.groupedStacked ? barOptions.groupedStacked : "grouped";
      barOptions.randomIdString = Math.floor(Math.random() * 10000000000);
      barOptions.ChangeRadius = barOptions.ChangeRadius ? barOptions.ChangeRadius : 'false';

    } else {
      return false;
    }
    var randomSubstring = barOptions.randomIdString;

    var margin = barOptions.margin,
      width = barOptions.width - margin.left - margin.right,
      height = barOptions.height - margin.top - margin.bottom,
      barColor = barOptions.barColor;
    if (height > width) {
      height = width;
      barOptions.height = barOptions.width;
    }
    /*//define tool tip*/
    $(".Bubble_Chart_tooltip").remove();
    $(".Country_Chart_tooltip").remove();
    // var tool_tip = $('body').append('<div class="world_map_tooltip1" style="padding:10px;position: absolute; opacity: 1; pointer-events: none; visibility: visible;display:none; z-index: 1000"><span style=" font-size: 12px; position: absolute; white-space: nowrap;  margin-left: 0px; margin-top: 0px; left: 8px; top: 8px;"><span style="font-size:10px" class="tool_tip_x_val"></span><table><tbody><tr><td style="padding:0"> </td><td style="padding:0"><b>216.4 mm</b></td></tr><tr><td style="color:#434348;padding:0">New York: </td><td style="padding:0"><b>91.2 mm</b></td></tr><tr><td style="color:#90ed7d;padding:0">London: </td><td style="padding:0"><b>52.4 mm</b></td></tr><tr><td style="color:#f7a35c;padding:0">Berlin: </td><td style="padding:0"><b>47.6 mm</b></td></tr></tbody></table></span></div>');
    var tool_tip = $('body').append('<div class="Bubble_Chart_tooltip" style="position: absolute;z-index: 99999;opacity: 1; pointer-events: none; visibility: visible;display:none;text-transform:uppercase;background-color:#0cae96;  padding: 10px;border-radius: 5px; border: 1px solid gray;font-size: 10px;color:black;"><span style=" font-size: 12px; position: absolute; white-space: nowrap;  margin-left: 0px; margin-top: 0px; left: 8px; top: 8px;"><span style="font-size:10px" class="tool_tip_x_val"></span><table><tbody><tr><td style="padding:0"> </td><td style="padding:0"><b>216.4 mm</b></td></tr><tr><td style="color:#434348;padding:0">New York: </td><td style="padding:0"><b>91.2 mm</b></td></tr><tr><td style="color:#90ed7d;padding:0">London: </td><td style="padding:0"><b>52.4 mm</b></td></tr><tr><td style="color:#f7a35c;padding:0">Berlin: </td><td style="padding:0"><b>47.6 mm</b></td></tr></tbody></table></span></div>');
    var tool_tip_source = $('body').append('<div class="Country_Chart_tooltip" style="position: absolute;z-index: 99999;opacity: 1; pointer-events: none; visibility: visible;display:none;text-transform:uppercase;background-color:#424242;  padding: 10px;border-radius: 5px; border: 1px solid #424242;color:#fff;"><span style=" font-size: 12px; position: absolute; white-space: nowrap;  margin-left: 0px; margin-top: 0px; left: 8px; top: 8px;"><span style="font-size:10px" class="tool_tip_x_val"></span><table><tbody><tr><td style="padding:0"> </td><td style="padding:0"><b>216.4 mm</b></td></tr><tr><td style="color:#434348;padding:0">New York: </td><td style="padding:0"><b>91.2 mm</b></td></tr><tr><td style="color:#90ed7d;padding:0">London: </td><td style="padding:0"><b>52.4 mm</b></td></tr><tr><td style="color:#f7a35c;padding:0">Berlin: </td><td style="padding:0"><b>47.6 mm</b></td></tr></tbody></table></span></div>');

    var colorScale: any = d3.scaleThreshold()
      .domain([10000, 100000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000, 500000000, 1500000000])
    // .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)", "rgb(33,113,181)", "rgb(8,81,156)", "rgb(8,48,107)", "rgb(3,19,43)"]);

    var colorScaleForReport = d3.scaleOrdinal()
      .domain(['UHRC', 'High', 'Medium', 'Low'])
      .range(["#ef5350", "#ef5350", "#f7a248", "#b3b2d1"]);

    var colorScaleForCompliance = d3.scaleOrdinal()
      .domain(['UHRC', 'High', 'Medium', 'Low'])
      .range(["#a84778", "#a84778", "#f8ce00", "#839cab"]);

    var colorScaleForSourceMonitoring = d3.scaleOrdinal()
      .domain(['error', 'success_more_than_100', 'success_less_than_50_100', 'success_less_than_50'])
      .range(["#ef5350", "#54931C", "#43a047", "#7dc62c"]);

    var centered;
    var chart_container = barOptions.container;
    var worlddata = barOptions.data[0];
    var populationData = barOptions.data[1];
    var path = d3.geoPath();
    var svg = d3.select(barOptions.container)
      .append("svg")
      .attr('height', barOptions.height)
      .attr('width', barOptions.width)
      .attr('id', 'mainSvg-' + randomSubstring)
      .append('g')
      .attr('class', 'map');
    var mapScale = Math.floor(height / 4);
    if (barOptions.container == '#companyexampleReport') {
      mapScale = Math.floor(height / 5.9);
    }
    if (barOptions.container == '#companyComplianceWorldMap') {
      mapScale = Math.floor(height / 3.6);
    }
    var projection = d3.geoEquirectangular().scale(mapScale).translate([width / 2, height / 2]);
    var path = d3.geoPath().projection(projection);

    var WorldData = barOptions.data;
    if (WorldData) {
      if (WorldData.length)
        drawWorld(worlddata, populationData);
    } else {

    }
    function drawWorld(data, population) {

      var populationById = {};

      population.forEach((d) => {
        populationById[d.id] = +d.population;
      });

/*		        //TODO: Need to add Pins
           //TODO: Need to add onClick behavior for pins to show Information
*/		        var svg_g = svg.append("g")
        .attr("class", "countries");

      svg_g.selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", (d: any): any => {
          if (populationById[d.id]) {
            return "#435DBE";
          } else {
            if (barOptions.container == '#companyexample5' || barOptions.container == '#companyexampleReport' || barOptions.container == '#companyComplianceWorldMap' || barOptions.container == '#mapChart' || barOptions.container == "#mapChartModal") {
              var country_index = findIndexForEachCountryColor(d, barOptions.countryOperations);
              if (country_index >= 0) {
                if (barOptions.container == '#companyexampleReport') {
                  return colorScaleForReport(barOptions.countryOperations[country_index].Risk || barOptions.countryOperations[country_index].CountryRisk);
                }
                else if (barOptions.container == '#mapChart' || barOptions.container == "#mapChartModal") {
                  var countStatus = '';
                  if (barOptions.countryOperations[country_index] && barOptions.countryOperations[country_index].failedCount) {
                    countStatus = 'error';
                  }
                  else if (barOptions.countryOperations[country_index] && barOptions.countryOperations[country_index].succesCount) {
                    if (barOptions.countryOperations[country_index].succesCount > 100) {
                      countStatus = 'success_more_than_100';
                    }
                    else if (barOptions.countryOperations[country_index].succesCount > 50 && barOptions.countryOperations[country_index].succesCount < 100) {
                      countStatus = 'success_less_than_50_100';
                    }
                    else if (barOptions.countryOperations[country_index].succesCount < 50) {
                      countStatus = 'success_less_than_50';
                    }
                  }
                  return colorScaleForSourceMonitoring(countStatus);
                }
                else {
                  return colorScaleForCompliance(barOptions.countryOperations[country_index].Risk || barOptions.countryOperations[country_index].CountryRisk);
                }
              } else {
                if (barOptions.container == '#companyComplianceWorldMap') {
                  return '#444444';
                }
                if (barOptions.container == '#mapChart' || barOptions.container == "#mapChartModal") {
                  return '#5f5f5f';
                }
                else {
                  return '#ced5dd';
                }
              }
            } else {
              return "#44555D";
            }
          }
          return colorScale(populationById[d.id]);
        })
        .style('stroke', 'none')
        .style('stroke-width', 0.5)
        .style("opacity", 0.8)
        .on('click', function (d) {
          if (chart_container === "#mapChart" || barOptions.container == "#mapChartModal") {
            if (listOfCountriesOnClick.length === 0) {
              listOfCountriesOnClick.push(d);
            }
            else {
              listOfCountriesOnClick.map((v) => {
                if (v && v.properties && v.properties.name !== d['properties'].name) {
                  listOfCountriesOnClick.push(d);
                }
              }).filter(v => { return v });
            }

            sendListToFilter(listOfCountriesOnClick);
            /*todo*/
            // window.pushFilters(markerV.locationCode, true, 'location', markerV.name, 'locationMultiple', 'locationMultipleEnd');
            // $(".Bubble_Chart_tooltip").css("display", "none");
          }
        })
        .on("mouseover", (d: any) => {
          //		                    $(this).css("opacity", 1);
          if (chart_container === "#mapChart" || barOptions.container == "#mapChartModal") {
            var country_index = findIndexForEachCountryColor(d, barOptions.countryOperations);
            if (d.properties.name && country_index && barOptions.countryOperations[country_index]) {
              $(".Country_Chart_tooltip").html('<span class="mb-3 pb-1 f-20 d-block">' + d.properties.name + '</span> <span class="mb-3 f-14 d-block">'+barOptions.Error+' : '
                + barOptions.countryOperations[country_index].failedCount + '</span><span class="mb-3 d-block f-14">'+barOptions.Sucess+' : '
                + barOptions.countryOperations[country_index].succesCount + '</span>');
            }
            else if (d.properties.name) {
              $(".Country_Chart_tooltip").html('<span class="mb-3 pb-1 f-20 d-block">' + d.properties.name + '</span><span class="mb-3 f-14 d-block">'+barOptions.Error+' : ' + 0 + '</span><span class="mb-3 d-block f-14">'+barOptions.Sucess+' : '+ 0 + '</span>');
            }
            // else if (markerV.isIncident == true) {
            //   $(".Country_Chart_tooltip").html('<span>' + markerV.name + '</span> ' + '<br>' + '<span>Number of incidents : ' + this.nFormatter(markerV.incidentsCount, markerV.incidentsCount, 2) + '</span>');
            // }
            // else if (barOptions.dontShowAmount) {
            //   $(".Country_Chart_tooltip").html('<span>Location : ' + markerV.name + '</span>');
            // }
            // else if (barOptions.type = "byamount") {
            //   $(".Country_Chart_tooltip").html('<span>Name : ' + markerV.name + '</span> ' + '<br>' + '<span>Amount : $' + markerV.amount + '</span>');

            // }
            // else {
            //   $(".Country_Chart_tooltip").html('<span>Name : ' + markerV.name + '</span> ' + '<br>' + '<span>Amount : ' + markerV.amount + '</span>');
            // }
            return $(".Country_Chart_tooltip").css("display", "block");
          }
        })
        .on("mousemove", function () {
          if (chart_container === "#mapChart" || barOptions.container == "#mapChartModal") {
            var p = $(chart_container)
            var position = p.offset();
            var windowWidth = window.innerWidth;
            var tooltipWidth = $(".Country_Chart_tooltip").width() + 50
            var cursor = d3.event.x;
            if ((position.left < d3.event.pageX) && (cursor > tooltipWidth)) {
              var element = document.getElementsByClassName("Country_Chart_tooltip");
              element[0].classList.remove("tooltip-left");
              element[0].classList.add("tooltip-right");
              $(".Country_Chart_tooltip").css("left", (d3.event.pageX - 15 - $(".Country_Chart_tooltip").width()) + "px");
            } else {
              var element = document.getElementsByClassName("Country_Chart_tooltip");
              if (element && element.length > 0) {
                element[0].classList.remove("tooltip-right");
                element[0].classList.add("tooltip-left");
                $(".Country_Chart_tooltip").css("left", (d3.event.pageX + 10) + "px");
              }
            }
            return $(".Country_Chart_tooltip").css("top", d3.event.pageY + "px")
          }
          //   $(".Country_Chart_tooltip").css("top", (d3.event.pageY - 10) + "px")
          //return  $(".Country_Chart_tooltip").css("left", (d3.event.pageX + 10) + "px");
        })
        .on("mouseout", function () {
          //		                    $(this).css("opacity", 0.4);
          return $(".Country_Chart_tooltip").css("display", "none");
        })
      if (barOptions.container == '#companyexampleReport' || barOptions.container == '#companyComplianceWorldMap') {
        svg_g.selectAll(".countryNames").data(barOptions.countryOperations)
          .enter().append("text")
          .attr("transform", (v) => {
            var country_index = findIndexForEachCountryName(v, data.features);
            if (country_index >= 0) {
              var proj = projection([
                data.features[country_index].properties.longitude,
                data.features[country_index].properties.latitude
              ]);
              return "translate(" + proj + ")";
            }
          })
          .style("fill", function () {
            if (barOptions.container == '#companyexampleReport') { return "#2d2d2d"; }
            else { return "#fff"; }
          })
          .style("font-family", function () {
            if (barOptions.container == '#companyexampleReport') { return "opensans-regular"; }
            else { return "'Roboto Regular',sans-serif"; }
          })
          .style("font-size", "8px")
          .attr("text-anchor", "middle")
          .text((v: any, i) => {
            var country_index = findIndexForEachCountryName(v, data.features);
            if (country_index >= 0) {
              return (v.jurisdiction ? v.jurisdiction : data.features[country_index].id.slice(0, 2));
            }
          });
      }

      svg_g.selectAll(".mark")
        .data(barOptions.markers);
      var geocoder = new google.maps.Geocoder();
      barOptions.markers.forEach((markerV, markerK) => {
        if (markerV.lat !== '' && markerV.lat && markerV.long !== '' && markerV.long) {
          addLocation(markerV);
        } else {
          setTimeout(function () {
            addLocation(markerV);
          }, 1000 * markerK);
        }
      })

      function addLocation(markerV) {
        if (markerV.lat !== '' && markerV.lat && markerV.long !== '' && markerV.long) {
          addCircle(markerV, [markerV.long, markerV.lat]);
        } else {
          var latitude, longitude;
          geocoder.geocode({ 'address': markerV.name }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              markerV.lat = results[0].geometry.location.lat();
              markerV.long = results[0].geometry.location.lng();

              var projectedValue = projection([markerV.long, markerV.lat])

              addCircle(markerV, projectedValue);
            }
          });
        }
        function addCircle(markerV, projectedValue) {
          var domainX = barOptions['domain'] ? barOptions['domain']['x'] : 10;
          var domainY = barOptions['domain'] ? barOptions['domain']['y'] : 5000;
          var sizeScale = d3.scaleLinear().domain([domainX, domainY]).range([5, 15]);

          if (barOptions.container != '#companyexampleReport') {
            var circle = svg_g.append("circle")
              //					    .attr('class','mark')
              .attr('class', function (d) {
                if (markerV.isIncident == true) {
                  return 'mark c-pointer';
                } else {
                  return 'mark';
                }
              })

              .on("contextmenu", function () {
                // todo
                // if (location.hash == "#!/alertDashboard") {
                //   alert();
                //   window.transSelectedFilter.data = markerV
                //   window.transSelectedFilter.id = chart_container;
                //   window.transSelectedFilter.chartType = "world";
                // }
                // todo
              })
              .on("mouseover", (d: any) => {

                //		                    $(this).css("opacity", 1);
                if (markerV.txt) {
                  $(".Bubble_Chart_tooltip").html('<span>' + markerV.txt + '</span> ');
                }
                else if (markerV.isIncident == true) {
                  $(".Bubble_Chart_tooltip").html('<span>' + markerV.name + '</span> ' + '<br>' + '<span>Number of incidents : ' + this.nFormatter(markerV.incidentsCount, markerV.incidentsCount, 2) + '</span>');
                }
                else if (barOptions.dontShowAmount) {
                  $(".Bubble_Chart_tooltip").html('<span>Location : ' + markerV.name + '</span>');
                }
                else if (barOptions.type = "byamount") {
                  $(".Bubble_Chart_tooltip").html('<span>Name : ' + markerV.name + '</span> ' + '<br>' + '<span>Amount : $' + markerV.amount + '</span>');

                }
                else {
                  $(".Bubble_Chart_tooltip").html('<span>Name : ' + markerV.name + '</span> ' + '<br>' + '<span>Amount : ' + markerV.amount + '</span>');
                }
                if (chart_container === "#mapCaseDashBoardChart") {
                  $(".Bubble_Chart_tooltip").html('<span class="flag-icon flag-icon-squared mb-2 flag-icon-'+ markerV.jurisdictionName +'"></span><span class="ml-1 pt-2 mb-2">' + markerV.name + '</span> ' + '<br>' + '<span class="pb-2 pt-2 mb-2">' + markerV.count + ' cases</span>');
                }
                return $(".Bubble_Chart_tooltip").css("display", "block");
              })
              .on('click', function () {
                if (chart_container === "#threatWorldMap") {
                  /*todo*/
                  // window.pushFilters(markerV.locationCode, true, 'location', markerV.name, 'locationMultiple', 'locationMultipleEnd');
                  // $(".Bubble_Chart_tooltip").css("display", "none");
                }
              })
              .on("mousemove", function () {
                var p = $(chart_container)
                var position = p.offset();
                var windowWidth = window.innerWidth;
                var tooltipWidth = $(".Bubble_Chart_tooltip").width() + 50
                var cursor = d3.event.x;
                if ((position.left < d3.event.pageX) && (cursor > tooltipWidth)) {
                  var element = document.getElementsByClassName("Bubble_Chart_tooltip");
                  element[0].classList.remove("tooltip-left");
                  element[0].classList.add("tooltip-right");
                  $(".Bubble_Chart_tooltip").css("left", (d3.event.pageX - 15 - $(".Bubble_Chart_tooltip").width()) + "px");
                } else {
                  var element = document.getElementsByClassName("Bubble_Chart_tooltip");
                  if (element && element.length > 0) {
                    element[0].classList.remove("tooltip-right");
                    element[0].classList.add("tooltip-left");
                    $(".Bubble_Chart_tooltip").css("left", (d3.event.pageX + 10) + "px");
                  }
                }
                return $(".Bubble_Chart_tooltip").css("top", d3.event.pageY + "px")

                //   $(".Bubble_Chart_tooltip").css("top", (d3.event.pageY - 10) + "px")
                //return  $(".Bubble_Chart_tooltip").css("left", (d3.event.pageX + 10) + "px");
              })
              .on("mouseout", function () {
                //		                    $(this).css("opacity", 0.4);
                //hide tool-tip
                return $(".Bubble_Chart_tooltip").css("display", "none");
              })

              .attr("fill", function (d) {
                if (markerV.fillColor) {
                  return markerV.fillColor;
                }
                if (barOptions.fillColor) {
                  return barOptions.fillColor;
                } else {
                  return default_map_fill_color;
                }
              })
              .style("opacity", barOptions.opacity ? barOptions.opacity : 1)
              .attr("transform", function (d) { return "translate(" + projection([markerV.long, markerV.lat]) + ")"; });
            if (barOptions.ChangeRadius == 'true') {
              circle.attr('r', function (d) {
                return sizeScale(parseInt(markerV.amount))
              })
            } else {
              circle.attr('r', 4)
            }
          }
        }
      }
      /*todo*/
      // svg_g.append("path")
      //   .datum(topojson.mesh(data.features, function (a, b) {
      //     return a.id !== b.id;
      //   }))
      //   .attr("class", "names")
      //   .attr("d", path);

      var zoom = d3.zoom().on("zoom", function () {
        svg_g.attr("transform", d3.event.transform)
        svg_g.selectAll("path")
          .attr("d", path.projection(projection));
      });
      svg_g.call(zoom);
    }
  };

  nFormatter(num, digits) {
    var si = [
      { value: 1E18, symbol: "E" },
      { value: 1E15, symbol: "P" },
      { value: 1E12, symbol: "T" },
      { value: 1E9, symbol: "G" },
      { value: 1E6, symbol: "M" },
      { value: 1E3, symbol: "k" }
    ], rx = /\.0+$|(\.[0-9]*[1-9])0+$/, i;
    for (i = 0; i < si.length; i++) {
      if (num >= si[i].value) {
        return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
      }
    }
    return num.toFixed(digits).replace(rx, "$1");
  }
  //code for number formatting
  formatAmt(obj, decPlaces, thouSeparator, decSeparator) {
    var n = obj,
      decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
      decSeparator = decSeparator == undefined ? "." : decSeparator,
      thouSeparator = thouSeparator == undefined ? "," : thouSeparator,
      sign = n < 0 ? "-" : "",
      i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "",
      j = (j = i.length) > 3 ? j % 3 : 0;
    return sign + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - parseInt(i)).toFixed(decPlaces).slice(2) : "");
  };

}
