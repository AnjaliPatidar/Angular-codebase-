import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EntityConstants } from '../constants/entity-company-constant';
import { EntityGraphService } from '../services/entity-graph.service';
import { uniqBy, find, filter } from 'lodash-es';
declare var $: any
import * as d3 from "d3";
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
declare var parseInt:Function
declare var window:any;

@Injectable({
  providedIn: 'root'
})
export class EntityCommonTabService {

  sourceTargetDetails = new BehaviorSubject<any>({})
  targetSourceRel = this.sourceTargetDetails.asObservable();
  constructor(
    private entityGraphService: EntityGraphService,
    private http: HttpClient
    ) {

  }
  companyAssociatedDocDetailsInfo = new BehaviorSubject<any>(false);
  public companyAssociatedDocDetailsInfoObserver = this.companyAssociatedDocDetailsInfo.asObservable();

  initateGetcorporatePathEvent = new BehaviorSubject<any>(false);
  public iniateOwnershipPath = this.initateGetcorporatePathEvent.asObservable();
  emitOwnershiPath(data: any) {
    this.initateGetcorporatePathEvent.next(data);
  }

  companyInfo = new BehaviorSubject<any>(false);
  public companyInfoObserver = this.companyInfo.asObservable();
  sendTocompanyInfo(data: any) {
    this.companyInfo.next(data);
  }

  getDocs = new BehaviorSubject<any>(false);
  public getDocsObserver = this.getDocs.asObservable();
  sendToGetDocs(data: any) {
    this.getDocs.next(data);
  }

  public toTitleCase(str) {
    if (str) {
      return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    }
  }


  private dataofficer = new BehaviorSubject<any>("");
  officerObservable = this.dataofficer.asObservable();

  setOfficerData(Officerdata) {
    let handledofficerData = {
      has_company_members: [],
      mixed_company_key_executives: [],
    }
    var reversed = Officerdata.slice().reverse();
    if (Officerdata && Officerdata.length > 0) {
      var filteredMembers = reversed.filter(function (val) {
        if (val.status && typeof val.status === 'string' && val.status.toLowerCase() !== "resigned") {
          return val;
        } else {
          return val;
        }
      });
      filteredMembers = uniqBy(filteredMembers, 'name');
      handledofficerData['mixed_company_key_executives'] = handledofficerData['mixed_company_key_executives'].length === 0 ? filteredMembers : handledofficerData['mixed_company_key_executives'].concat(filteredMembers);
      const secetary = filter(filteredMembers, {
        'officer_role': 'Secretary'
      });
      handledofficerData['has_company_members'] = handledofficerData['has_company_members'].length === 0 ? secetary : handledofficerData['has_company_members'].concat(secetary);
      handledofficerData['has_company_members'] = handledofficerData['has_company_members'].concat(handledofficerData['mixed_company_key_executives']);
      handledofficerData['mixed_company_key_executives'] = uniqBy(handledofficerData['mixed_company_key_executives'], 'name');
      handledofficerData['has_company_members'] = uniqBy(handledofficerData['has_company_members'], 'name');

      this.dataofficer.next(handledofficerData);

    }
  }

  /* @purpose: calculate the country risk
		 *
		 * @created:19 sep 2019
		 * @params: type(string)
		 * @returns: risk
		 * @author: Ram Singh */
  calculateCountryRisk(country) {
    var captialCaseCountry = this.toTitleCase(country);
    var risk;
    if (captialCaseCountry) {
      //	d3.json("./constants/countryrisk.json", function (error, root) {
      risk = find(EntityConstants.chartsConst.countryRisk, ['COUNTRY', captialCaseCountry.toUpperCase()]);
      if (risk) {
        return risk["FEC/ESR Risk Level"];
      } else {
        return '';
      }
    }
  }
  /* @purpose: check the Country name
		 *
		 * @created:19 sep 2019
		 * @params: type(string)
		 * @returns: country name
		 * @author: Ram Singh */
  getCountryName = function (countryCode, fromNode = false) {
    if (countryCode.toLowerCase() === 'us') {
      countryname = 'United States Of America';
      if (fromNode) {
        countryname = 'United State';
      }
      return countryname;
    }
    var curObj = EntityConstants.countriesData.find(obj => {
      return obj.jurisdictionName.toLowerCase() === countryCode.toLowerCase();
    });
    if (curObj) {
      var countryname = curObj.jurisdictionOriginalName ? curObj.jurisdictionOriginalName : '';
      return countryname;
    }
  }

	/* @purpose:  Adds graph Icons:- univerversity,user
 *
 * @created: 24 sep 2019
 * @params: type(string)
 * @returns: no
 * @author: Ram Singh */
  AppendOrgGraphIcon(divId) {
    $(divId).children(".orgdiagram").addClass("custom-scroll-wrapper");
    $(divId).find(".orgdiagram").find('.orgChartParentEntity').parent().find("i.fa-university").remove();
    $(divId).find(".orgdiagram").find('.orgChartParentEntity').parent().find("i.fa-user").remove();
    $(divId).find(".orgdiagram").find(".orgChartmainEntity").parent().find("i.fa-university").remove();
    $(divId).find(".orgdiagram").find(".orgChartmainEntity").parent().find("i.fa-user").remove();
    $(divId).find(".orgdiagram").find(".orgChartsubEntity").parent().find("i.fa-university").remove();
    $(divId).find(".orgdiagram").find(".orgChartsubEntity").parent().find("i.fa-user").remove();
    $(divId).find(".orgdiagram").find(".orgChartParentEntity.comapny_icon").parent().prepend('<i class="fa fa-university" style="color:#4c9d20"></i>');
    $(divId).find(".orgdiagram").find(".orgChartParentEntity.person_icon").parent().prepend('<i class="fa fa-user" style="color:#4c9d20"></i>');
    $(divId).find(".orgdiagram").find(".orgChartmainEntity").parent().parent().css({
      'background-color': 'none'
    });
    $($(divId).find(".orgdiagram").find(".orgChartmainEntity.comapny_icon").parent().prepend('<i class="fa fa-university"></i>')).css({
      'background-color': 'none'
    });
    $($(divId).find(".orgdiagram").find(".orgChartmainEntity.person_icon").parent().prepend('<i class="fa fa-user"></i>')).css({
      'background-color': 'none'
    });
    $(divId).find(".orgdiagram").find(".orgChartsubEntity.comapny_icon").parent().prepend('<i class="fa fa-university" style="color:#c7990c"></i>');
    $(divId).find(".orgdiagram").find(".orgChartsubEntity.person_icon").parent().prepend('<i class="fa fa-user" style="color:#c7990c"></i>');
    $(divId).find(".orgdiagram").find(".orgChartsubEntity").prepend('<i class="fa fa-user" style="color:#c7990c"></i>');
  }
  makeUrlSecureToWork(val) {
    if (val && val.split(':')[0] != 'https' && val.split(':')[0] != 'http') {
      val = 'https://' + val;
    }
    return val;
  }
  getSourceInfo(obj) {
    var srcobj = {
      value: (obj && obj.value) ? obj.value : '',
      source: (obj && obj.source) ? obj.source : '',
      sourceUrl: (obj && obj.sourceUrl) ? obj.sourceUrl : '',
      sourceType: (obj && obj.sourceType) ? obj.sourceType : 'link',
      docId: (obj && obj.docId) ? obj.docId : ''
    }
    return srcobj;
  }
  World(options, CountryOperations) {
    this.http.get('assets/json/world-country-detail-list.json').pipe(first()).subscribe(list => {
      options.data = [list, []];
      options.countryOperations = CountryOperations ? CountryOperations : [];
      this.entityGraphService.plotWorldLocationChart(options);
    });
  }
  InitializeandPlotPie(data, id, colorsObj, colorsArr, isQuessionairePie, height, width) {
    data.map(function (d) {
      return d.value = d.doc_count;
    });
    var newData = [];
    var keys = [];
    data.array.forEach((d, i) => {
      if (d.value && (d.key && $.inArray(d.key.toLowerCase().split("-").join(" ").split(" ").join("").trim(), keys) == -1)) {
        newData.push(d);
        keys.push(d.key.toLowerCase().split("-").join(" ").split(" ").join("").trim());
      }
    });

    var maxval: any = d3.max(data, (d: any) => {
      return d.value;
    });
    var sum: any = d3.sum(data, (d: any) => {
      return d.value;
    });
    var colors;
    if (colorsArr) {
      colors = colorsArr;
    } else {
      colors = ["#5d96c8", "#b753cd", "#69ca6b", "#af3251", "#c1bd4f", "#db3f8d", "#669900", "#334433"]
    }
    if (isQuessionairePie) {
      newData.sort(function (a, b) { return b.value - a.value; });
      var unevalVals = newData.filter(function (arr) {
        return arr.key == "unevaluated";
      });
      var evalCount: any;
      if (unevalVals && unevalVals[0] && unevalVals[0].value) {
        evalCount = sum - unevalVals[0].value;
      } else {
        evalCount = sum;
      }
      var options: any = {
        container: "#" + id,
        data: newData,
        height: height ? height : 160,
        width: width ? width : undefined,
        colors: colors,
        colorsObj: colorsObj,
        islegends: false,
        islegendleft: false,
        istxt: sum == 0 ? 0 : (evalCount / sum) * 100 + "%",
        // istxt: $scope.noOfQuestionsPerAnsPercentage+"%",
        txtColor: colorsObj[newData[0].key]
      };
    } else {
      var options: any = {
        container: "#" + id,
        data: newData,
        height: 160,
        colors: colors,
        colorsObj: colorsObj,
        islegends: true,
        islegendleft: true,
        legendwidth: 30,
        format: true,
        istxt: sum == 0 ? 0 : (maxval / sum) * 100 + "%",
        legendmargintop: 30
      };
    }
    function reusablePie(pieOptions) {
      //code for number formatting
      //	$(".toolTip_piehorizontal").remove();
      var asIndex = 0;
      if (pieOptions.container) {
        $(pieOptions.container).empty();
      }
      if (location.hash == "#!/alertDashboard" && (!pieOptions.data || pieOptions.data.length == 0)) {
        d3.select(pieOptions.container).append("div").attr("class", "alertsDashErrorDiv").html("<span>Data Not Found</span>");
        return false;
      }
      if (location.hash == "#!/alertDashboard") {
        var extnts:any = d3.extent(pieOptions.data,  (d:any)=> {
          return d.value
        });
        if (extnts[0] == 0 && extnts[1] == 0) {
          d3.select(pieOptions.container).append("div").attr("class", "alertsDashErrorDiv").html("<span>Data Not Found</span>");
          return false;
        }
      }
      //dont show mid value for all pie's and on click show percentage

      if (!pieOptions.showValue && pieOptions.data && pieOptions.data.length > 0) {
        pieOptions.showValue = 'noValue';
        var sumofValues = d3.sum(pieOptions.data,  (d:any)=> { return d.value });
        $.each(pieOptions.data,  (i:any, d:any)=> {
          d.piePercentage = parseInt(d.value / sumofValues) * 100;
        })
      }


      // --------------------------Initialize
      // Values-----------------------------
      if (pieOptions) {
        this.container = pieOptions.container ? pieOptions.container : "body"

        this.data = (pieOptions.data) ? pieOptions.data : []

        this.radius = pieOptions.radius ? {
          innerRadius: pieOptions.radius.innerRadius ? pieOptions.radius.innerRadius : 0,
          outerRadius: pieOptions.radius.outerRadius ? pieOptions.radius.outerRadius : 100
        } : {
            innerRadius: 0,
            outerRadius: 100
          };
        this.height = pieOptions.height ? pieOptions.height : 600;
        this.randomIdString = Math.floor(Math.random() * 10000000000);
        this.legendwidth = pieOptions.legendwidth ? pieOptions.legendwidth : 50;
        this.contentWidth = pieOptions.islegends ? (pieOptions.legendwidth ? (100 - pieOptions.legendwidth) : 50) : 100
        this.txtColor = pieOptions.txtColor ? pieOptions.txtColor : '#2473B5'
        this.txtSize = pieOptions.txtSize ? pieOptions.txtSize : '21px'

      } else {
        return false;
      }

      var containerid = this.container;
      var _this = this
      var randomSubstring = this.randomIdString;
      // var chartContainerdiv = '<div class="chartContainer"
      // align="center" style="width: 80%; margin: auto;
      // margin-top: 30px; font-size: 14px;font-family:
      // roboto-regular;"> <div class="graphBox"
      // style="margin: auto; background-color: #374c59;
      // width: 100%;left: 0px;top: 0px;overflow:
      // hidden;position: relative;"> <div class="headerDiv"
      // style="font-weight:bold;background-color:
      // #425661;text-align: left;color: #239185;
      // border-bottom: 1px solid rgba(192, 192, 192,
      // 0.47);width: 100%; line-height: 2.5;font-size: 16px
      // ;padding-left: 5px;">' + pieOptions.header +
      // '</div><div id="pie_chart_div' + randomSubstring + '"
      // class="chartContentDiv" style="width: 100%;"></div>
      // </div></div>'
      var chartContainerdiv = '<div id="pie_chart_div' + randomSubstring + '" class="" style="width: 100%;"></div>'
      $(this.container).html(chartContainerdiv);
      var chart_container = "#pie_chart_div" + randomSubstring;
      var _this = this;
      var data = this.data;
      if (_this.pieOptions) {
        var sumTotal = sum;
      }
      // $(chart_container).append("<div id='streamContainer-" + (randomSubstring) +
      // "'style='width:100%' ></div>")

      // var div = d3.select("body").append("div").attr("class",
      // "toolTip_horizontal").style("position", "absolute").style("z-index",
      // 1000).style("background","rgb(27, 39, 53)").style("padding","5px
      // 10px").style("border-radius","10px").style("font-size","10px").style("display","none");

      var pieLegendData = [];
      if (pieOptions.islegendleft) {
        $(chart_container).append("<div class='pielegendContainer' style ='text-transform:uppercase;text-align: left;float:left;width:" + this.legendwidth + "%' id='legendContainer-" + (randomSubstring) + "'></div>")

        $(chart_container).append("<div id='streamContainer-" + (randomSubstring) + "' style ='float:left;width:" + this.contentWidth + "%'></div>")
      } else {
        $(chart_container).append("<div id='streamContainer-" + (randomSubstring) + "' style ='float:left;width:" + this.contentWidth + "%'></div>")
        $(chart_container).append("<div class='pielegendContainer' style ='text-transform:uppercase;text-align: left;float:left;width:" + this.legendwidth + "%' id='legendContainer-" + (randomSubstring) + "'></div>")

      }
      var colorScale = d3.scaleOrdinal().range(pieOptions.colors ? pieOptions.colors : ["#5d96c8", "#b753cd", "#69ca6b", "#69ca6b", "#c1bd4f", "#db3f8d", "#669900"]);

      this.width = pieOptions.width ? pieOptions.width : $('#streamContainer-' + (randomSubstring)).width() - 10;
      var width = this.width,
        height = this.height;

      //	        if (height > width) {
      //	            height = width;
      //	        }



      // define scales
      var radius = Math.min(width, height) / 2;
      // define main grounp
      var arc:any = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - radius / 2);
      var labelArc = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);
      var pie = d3.pie().padAngle(pieOptions.ispadding ? 0.2 : 0)
        .sort(null)
        .value(function (d:any) {
          return d.value;
        });
      var svg = d3.select('#streamContainer-' + (randomSubstring)).append("svg").attr('id', 'mainSvg-' + randomSubstring)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
      var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");
      g.append("path").style("fill", function (d:any, i:any) {

        if (pieOptions.colorsObj) {
          pieLegendData.push({
            name: d.data.key,
            color: pieOptions.colorsObj[d.data.key],
            value: d.data.value,
            formattedVal: Number(d.data.value), //.formatAmt().split('.')[0],
            piedata: data,
            arcData: d,
            container: pieOptions.container

          })
          return pieOptions.colorsObj[d.data.key]
          pieLegendData.push({
            name: d.data.key,
            color: colorScale(d.data.key),
            value: d.data.value,
            formattedVal: Number(d.data.value),//.formatAmt().split('.')[0],
            piedata: data,
            arcData: d,
            container: pieOptions.container
          })
        } else if (pieOptions.container == '#as_score' || pieOptions.container == '#bs_score' && location.hash.indexOf('generalCardHolderDetails') >= 0) {
          pieLegendData.push({
            name: d.data.key,
            color: colorScale(d.data.key),
            value: d.data.value,
            formattedVal: Number(d.data.value),//.formatAmt().split('.')[0],
            piedata: data,
            arcData: d,
            container: pieOptions.container
          })
          return data[i]['color']
        } else if (pieOptions.fixedColorWithKey != undefined) {
          var index, selectedLegendColor;
          if (pieOptions.fixedColorWithKey.length > pieOptions.data.length) {
            index = pieOptions.fixedColorWithKey.map(function (d1) {
              return d1.key;
            }).indexOf(d.data.key);

            pieOptions.fixedColorWithKey.map(function (d1) {
              if (d.data.key == d1.key) {
                selectedLegendColor = d1.color;
              }
            });
          }
          if (index == -1 || pieOptions.fixedColorWithKey.length <= pieOptions.data.length) {
            asIndex = asIndex + 1;
            index = asIndex - 1;
            selectedLegendColor = pieOptions.colors[index];
          }
          pieLegendData.push({
            name: d.data.key,
            color: selectedLegendColor,
            value: d.data.value,
            formattedVal: Number(d.data.value),//.formatAmt().split('.')[0],
            piedata: data,
            arcData: d,
            container: pieOptions.container
          })
          return selectedLegendColor;
        }
        else {
          pieLegendData.push({
            name: d.data.key,
            color: colorScale(d.data.key),
            value: d.data.value,
            formattedVal: Number(d.data.value),//.formatAmt().split('.')[0],
            piedata: data,
            arcData: d,
            container: pieOptions.container
          })
          return colorScale(d.data.key);
        }


      }).style('stroke', function (d:any) {
        if (pieOptions.sum) {
          if (d.data.value > pieOptions.sum || pieOptions.data.length == 1) {
            return 'white';
          }
        }
      })
        .style("cursor", function () {
          if (pieOptions.cursor == 'default') {
            return "default";
          } else {
            return "pointer";
          }

        })
        .on("contextmenu", function (d) {
          if (location.hash == "#!/alertDashboard") {
            window.transSelectedFilter.data = d;
            window.transSelectedFilter.id = pieOptions.container;
            window.transSelectedFilter.chartType = "pie";
            //           		 aplyAlertDasboardFilters(d,pieOptions.container,"pie");
          }
        })
        .on("click", function (d:any) {
          if (pieOptions.showValue == 'noValue' && d.data.piePercentage != undefined) {
            $(containerid + ' ' + 'text').html('')
            var txtY = parseFloat(_this.txtSize.toLowerCase().split("px")[0]) / 2.5;
            g.append("text").attr("y", txtY).text(d.data.piePercentage + '%').style('text-anchor', "middle").style('font-size', _this.txtSize).style("fill", _this.txtColor).style("stroke", "none")
          }
          if (pieOptions.page && pieOptions.page == "mip") {
            //refresh(d.data.key, $(this).parent().parent().parent().parent().parent().parent().attr("id"))
          } else if (location.hash.indexOf('generalCardHolderDetails') >= 0 || location.hash.indexOf('dualCardHolderDetails') >= 0 || location.hash.indexOf('earlyAdopters') >= 0) {
            window.pieAndWorldOnClick(pieOptions.container, pieOptions.data, d);
          }
        })
        // .on("mouseover", function (d) {
        //   Pietooltipdiv.style("visibility", "visible");
        //   Pietooltipdiv.style("display", "inline-block");
        //   if (d.data.txt) {
        //     Pietooltipdiv.html(d.data.txt);
        //   } else if (pieOptions.format) {
        //     if (pieOptions.container == "#dataPart" || pieOptions.container == "#dayWeek") {
        //       Pietooltipdiv.html(d.data.key + ": <span class='fa fa-ils f-10'></span> " + Number(d.value).formatAmt().split('.')[0]);
        //     } else {
        //       Pietooltipdiv.html(d.data.key + ": " + Number(d.value).formatAmt().split('.')[0]);
        //     }
        //   } else {
        //     Pietooltipdiv.html(d.data.key + ": " + (d.actualValue ? d.actualValue : d.value));
        //   }

        // })
        // .on("mousemove", function (d) {
        //   var p = $(chart_container)
        //   var position = p.offset();
        //   var elmen = document.getElementsByClassName('line_chart_tool')
        //   var tooltipWidth = elmen[0].clientWidth
        //   var cursor = d3.event.x;
        //   if ((position.left < d3.event.pageX) && (cursor > tooltipWidth)) {
        //     for (i = 0; i < elmen.length; i++) {
        //       elmen[i].classList.remove("tooltip-left");
        //       elmen[i].classList.add("tooltip-right");
        //     }
        //     Pietooltipdiv.style("left", d3.event.pageX - tooltipWidth + "px");
        //     Pietooltipdiv.style("top", d3.event.pageY - 25 + "px");
        //   } else {
        //     for (i = 0; i < elmen.length; i++) {
        //       elmen[i].classList.remove("tooltip-right");
        //       elmen[i].classList.add("tooltip-left");
        //     }
        //     Pietooltipdiv.style("left", d3.event.pageX + 10 + "px");
        //     Pietooltipdiv.style("top", d3.event.pageY - 25 + "px");
        //   }
        // })
        // .on("mouseout", function (d) {
        //   Pietooltipdiv.style("visibility", "hidden");
        //   Pietooltipdiv.style("display", "none");
        // })
        .transition()
        .delay(function (d, i) {
          return i * 10;
        })
        .duration(500)
        .attrTween('d', function (d) {
          var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
          return function (t) {
            d.endAngle = i(t);
            return arc(d)
          }
        });
      if (pieOptions.istxt) {
        var txtY = parseFloat(this.txtSize.toLowerCase().split("px")[0]) / 2.5;
        if (typeof (pieOptions.istxt) != "boolean" && (pieOptions.istxt) != "true" && (pieOptions.istxt) != "false" && (pieOptions.showValue != 'noValue')) {
          g.append("text").attr("y", txtY).text(pieOptions.istxt).style('text-anchor', "middle").style('font-size', this.txtSize).style("fill", this.txtColor).style("stroke", "none")
        } else if (pieOptions.showValue != 'noValue') {
          g.append("text").attr("y", txtY).text((pieOptions.maxval.toFixed(2)) + "%").style('text-anchor', "middle").style('font-size', this.txtSize).style("fill", this.txtColor).style("stroke", "none")
        }
      }
      if (pieOptions.islegends) {
         var pieLegendArray = [];
         data.forEach((d:any, i:any) => {
          pieLegendArray.push(d.key);
         });
         renderPieLegend(pieLegendArray);
      }

      /**
       * Function to store legend Data
       *
       * @param {array}
       */
      if (location.hash == "#!/alertDashboard" || location.hash.split('/')[1] == "generalCardHolderDetails" || location.hash.split('/')[1] == "dualCardHolderDetails" || location.hash.split('/')[1] == "earlyAdopters") {
        window.reusablePieLegendData(pieLegendData, containerid)
      }
      // --------------------------------------------------------------------------
      /**
       * Function to render Pie chart legends
       *
       * @param {array}
       *            data
       *
       */
      function renderPieLegend(data) {
        if (pieOptions.legendmargintop) {
          $("#legendContainer-" + (randomSubstring)).css("margin-top", pieOptions.legendmargintop);
        }
        data.array.forEach((d:any,i:any) => {
          $("#legendContainer-" + (randomSubstring)).append('<div class="pieLegendDiv" style = "color: #778c96;" ><div class="bar_legend_circles" style="background-color:' + (pieOptions.colorsObj ? pieOptions.colorsObj[d] : colorScale(d)) + ';height: 12px;width: 12px;border-radius: 6px;display: inline-block"></div><span style="padding:10px;margin:0 2px;font-size:10px">' + d + '</span></div>')
          $("#legendContainer-" + (randomSubstring)).find(".pieLegendDiv").css("font-family", "'Roboto Medium'");
        });


      }
      //code for number formatting
      // Number.prototype.formatAmt = function (decPlaces, thouSeparator, decSeparator) {
      //   var n = this,
      //     decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
      //     decSeparator = decSeparator == undefined ? "." : decSeparator,
      //     thouSeparator = thouSeparator == undefined ? "," : thouSeparator,
      //     sign = n < 0 ? "-" : "",
      //     i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "",
      //     j = (j = i.length) > 3 ? j % 3 : 0;
      //   return sign + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
      // };
    }
    setTimeout(function () {
       reusablePie(options);
    });

  };
  // public sourceListData:any =[];
  // AllSourceData(source){
  //   this.sourceListData = source;
  //  // this.sourceData()
  // }
  // sourceData(){
  //   //var val =this.sourceListData
  //   return  this.sourceListData;
  // }
  // sourceListData = new Subject<any>();
  // public sourceData = this.sourceListData.asObservable();
  // AllSourceData(data: any) {
  //   this.sourceListData.next(data);
  // }
  getCompanyInfo(data) {
    this.sourceTargetDetails.next(data);

  }
}
