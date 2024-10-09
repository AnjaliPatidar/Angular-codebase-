import * as $ from 'jquery';
import * as d3 from 'd3';
function ReusablePie() {}
var Pietooltipdiv = d3.select("body").append("div").attr("class", "line_chart_tool").style("position", "absolute").style("z-index", 1000).style("background", "rgb(27, 39, 53)").style("padding", "5px 10px").style("visibility", "visible").style("border-radius", "10px").style("font-size", "10px").style("display", "none");
Number.prototype.formatAmt = function(decPlaces, thouSeparator, decSeparator) {
       var n = this,
           decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
           decSeparator = decSeparator == undefined ? "." : decSeparator,
           thouSeparator = thouSeparator == undefined ? "," : thouSeparator,
           sign = n < 0 ? "-" : "",
           i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "",
           j = (j = i.length) > 3 ? j % 3 : 0;
       return sign + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
   };
ReusablePie.prototype.ReusablePie = function (pieOptions) {
    var asIndex = 0;
    if (pieOptions.container) {
        //$(pieOptions.container).empty();
        document.getElementById(pieOptions.container.replace(/#/g, '')).innerHTML = "";
    }
    if (location.hash == "#!/alertDashboard" && (!pieOptions.data || pieOptions.data.length == 0)) {
        d3.select(pieOptions.container).append("div").attr("class", "alertsDashErrorDiv").html("<span>Data Not Found</span>");
        return false;
    }
    if (location.hash == "#!/alertDashboard") {
        var extnts = d3.extent(pieOptions.data, function(d) {
            return d.value
        });
        if (extnts[0] == 0 && extnts[1] == 0) {
            d3.select(pieOptions.container).append("div").attr("class", "alertsDashErrorDiv").html("<span>Data Not Found</span>");
            return false;
        }
    }
    // --------------------------Initialize
    // Values-----------------------------
    if (pieOptions) {
        this.container = pieOptions.container ? pieOptions.container : "body"
  
        this.data = (pieOptions.data) ? pieOptions.data: []
  
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
        this.txtSize = pieOptions.txtSize ? pieOptions.txtSize : '21px';
        this.legendHeight = pieOptions.legendHeight ? pieOptions.legendHeight : '';
  
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
    var chartContainerdiv = '<div id="pie_chart_div' + randomSubstring + '" class="" style="width: 100%;display: flex;padding-top:'+ pieOptions.paddingTop+'"></div>'
    //$(this.container).html(chartContainerdiv);
    if(this.container == pieOptions.container){
      document.getElementById(this.container.replace(/#/g, '') ).innerHTML = chartContainerdiv;
    }else{
      document.getElementsByTagName(this.container).innerHTML = chartContainerdiv;
    }
  
    var chart_container = "#pie_chart_div" + randomSubstring;
    var _this = this;
    var data = this.data;
    if(_this.pieOptions){
      //var sumTotal = sum;
    }
    // $(chart_container).append("<div id='streamContainer-" + (randomSubstring) +
    // "'style='width:100%' ></div>")
  
    // var div = d3.select("body").append("div").attr("class",
    // "toolTip_horizontal").style("position", "absolute").style("z-index",
    // 1000).style("background","rgb(27, 39, 53)").style("padding","5px
    // 10px").style("border-radius","10px").style("font-size","10px").style("display","none");
  
    var pieLegendData = [];
    if (pieOptions.islegendleft) {
        //$(chart_container).append("<div class='pielegendContainer' style ='text-transform:uppercase;text-align: left;float:left;width:" + this.legendwidth + "%' id='legendContainer-" + (randomSubstring) + "'></div>")
        document.getElementById(chart_container.replace(/#/g, '')).innerHTML += "<div class='pielegendContainer custom-scroll-wrapper' style ='text-transform:uppercase;text-align: left;overflow-y: scroll;float:left;width:" + this.legendwidth + "%;" +"max-height:"+this.legendHeight+"' id='legendContainer-" + (randomSubstring) + "'></div>"
        //$(chart_container).append("<div id='streamContainer-" + (randomSubstring) + "' style ='float:left;width:" + this.contentWidth + "%'></div>")
        document.getElementById(chart_container.replace(/#/g, '')).innerHTML +="<div id='streamContainer-" + (randomSubstring) + "' style ='float:left;width:" + this.contentWidth + "%'></div>"
    } else {
        //$(chart_container).append("<div id='streamContainer-" + (randomSubstring) + "' style ='width:" + this.contentWidth + "%'></div>")
        //$(chart_container).append("<div class='pielegendContainer' style ='text-transform:uppercase;text-align: left;float:left;width:" + this.legendwidth + "%' id='legendContainer-" + (randomSubstring) + "'></div>")
        document.getElementById(chart_container.replace(/#/g, '')).innerHTML +="<div id='streamContainer-" + (randomSubstring) + "' style ='width:" + this.contentWidth + "%'></div>"
        document.getElementById(chart_container.replace(/#/g, '')).innerHTML +="<div class='pielegendContainer custom-scroll-wrapper' style ='text-transform:uppercase;text-align: left;overflow-y: scroll;float:left;width:" + this.legendwidth + "%;" +"max-height:"+this.legendHeight+"' id='legendContainer-" + (randomSubstring) + "'></div>"
    }
    var colorScale = d3.scaleOrdinal().range(pieOptions.colors ? pieOptions.colors : ["#5d96c8", "#b753cd", "#69ca6b", "#69ca6b", "#c1bd4f", "#db3f8d", "#669900"]);
  
    this.width = pieOptions.width ? pieOptions.width :  document.getElementById('streamContainer-' + (randomSubstring)).offsetWidth - 10;
    var width = this.width,
        height = this.height;
  
    //	        if (height > width) {
    //	            height = width;
    //	        }
    
    // define scales
    var radius = Math.min(width, height) / 2;
    // define main grounp
    var arc = d3.arc()
        .outerRadius(this.radius.innerRadius)
        .innerRadius(this.radius.outerRadius);
    var labelArc = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);
    var pie = d3.pie().padAngle(pieOptions.ispadding ? 0.2 : 0)
        .sort(null)
        .value(function(d) {
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
    g.append("path").style("fill", function(d,i) {
  
            if (pieOptions.colorsObj) {
                pieLegendData.push({
                    name: d.data.key,
                    color: pieOptions.colorsObj[d.data.key],
                    value: d.data.value,
                    formattedVal: Number(d.data.value).formatAmt().split('.')[0],
                    piedata:data,
                    arcData:d,
                    container:pieOptions.container
                    
                })
                return pieOptions.colorsObj[d.data.key]
                pieLegendData.push({
                    name: d.data.key,
                    color: colorScale(d.data.key),
                    value: d.data.value,
                    formattedVal: Number(d.data.value).formatAmt().split('.')[0],
                    piedata:data,
                    arcData:d,
                    container:pieOptions.container
                })
            }else if(pieOptions.container == '#as_score' || pieOptions.container == '#bs_score' && location.hash.indexOf('generalCardHolderDetails') >= 0){
              pieLegendData.push({
                    name: d.data.key,
                    color: colorScale(d.data.key),
                    value: d.data.value,
                    formattedVal: Number(d.data.value).formatAmt().split('.')[0],
                    piedata:data,
                    arcData:d,
                    container:pieOptions.container
                })
              return  data[i]['color']
            }else if(pieOptions.fixedColorWithKey!=undefined){
                var index, selectedLegendColor;
                if(pieOptions.fixedColorWithKey.length > pieOptions.data.length){
                index =  pieOptions.fixedColorWithKey.map(function(d1){
                  return d1.key;
                }).indexOf(d.data.key);
                
                pieOptions.fixedColorWithKey.map(function(d1){
                if(d.data.key == d1.key){
                  selectedLegendColor = d1.color;
                }
                });
                }
              if(index == -1 || pieOptions.fixedColorWithKey.length <= pieOptions.data.length){
               asIndex = asIndex + 1;
               index = asIndex - 1;
               selectedLegendColor = pieOptions.colors[index];
              }
              pieLegendData.push({
                  name: d.data.key,
                  color: selectedLegendColor,
                  value: d.data.value,
                  formattedVal: Number(d.data.value).formatAmt().split('.')[0],
                  piedata:data,
                      arcData:d,
                      container:pieOptions.container
              })
              return selectedLegendColor;
          }
            else{
              pieLegendData.push({
                    name: d.data.key,
                    color: colorScale(d.data.key),
                    value: d.data.value,
                    formattedVal: Number(d.data.value).formatAmt().split('.')[0],
                    piedata:data,
                    arcData:d,
                    container:pieOptions.container
                })
              return colorScale(d.data.key);
            }
           
        }).style('stroke',function(d){
          if(pieOptions.sum){
            if(d.data.value > pieOptions.sum || pieOptions.data.length == 1){
              return 'white';
            }
          }
        })
        .style("cursor",function(){
          if(pieOptions.cursor == 'default'){
            return  "default";
          }else{
            //return  "pointer";
          }
         
        })
        .on("contextmenu", function(d) {
            if (location.hash == "#!/alertDashboard") {
                window.transSelectedFilter.data = d;
                window.transSelectedFilter.id = pieOptions.container;
                window.transSelectedFilter.chartType = "pie";
                //           		 aplyAlertDasboardFilters(d,pieOptions.container,"pie");
            }
        })
        .on("click", function(d) {
            if (pieOptions.showValue == 'noValue') {
               // $(containerid + ' ' + 'text').html('')
                if(containerid == pieOptions.container){
                  document.getElementById(containerid + ' ' + 'text').innerHTML = '';
                }else{
                  document.getElementsByTagName(containerid + ' ' + 'text').innerHTML = '';
                }
                var txtY = parseFloat(_this.txtSize.toLowerCase().split("px")[0]) / 2.5;
                g.append("text").attr("y", txtY).text(d.data.piePercentage + '%').style('text-anchor', "middle").style('font-size', _this.txtSize).style("fill", _this.txtColor).style("stroke", "none")
            } else if (pieOptions.page && pieOptions.page == "mip") {
                refresh(d.data.key, $(this).parent().parent().parent().parent().parent().parent().attr("id"))
            } else if (location.hash.indexOf('generalCardHolderDetails') >= 0 || location.hash.indexOf('dualCardHolderDetails') >= 0 || location.hash.indexOf('earlyAdopters') >= 0 ) {
                window.pieAndWorldOnClick(pieOptions.container, pieOptions.data, d);
            }
        })
        .on("mouseover", function(d) {
            Pietooltipdiv.style("visibility", "visible");
            Pietooltipdiv.style("display", "inline-block");
            if(d.data.txt){
               Pietooltipdiv.html(d.data.txt);
            }else if (pieOptions.format) {
              if(pieOptions.container == "#dataPart" || pieOptions.container == "#dayWeek"){
                Pietooltipdiv.html(d.data.key + ": <span class='fa fa-ils f-10'></span> " + Number(d.value).formatAmt().split('.')[0]);
              }else{
               Pietooltipdiv.html(d.data.key + ": " + Number(d.value).formatAmt().split('.')[0]);
              }
            } else {
                Pietooltipdiv.html(d.data.key + ": " + (d.actualValue ? d.actualValue : d.value));
            }
  
        })
        .on("mousemove", function(d) {
            //var p = $(chart_container)
            var p =  document.getElementById(chart_container.replace(/#/g, ''))
            
            var position ={ 
              top: p.offsetTop, 
              left: p.offsetLeft, 
          };;
            var elmen = document.getElementsByClassName('line_chart_tool')
            var tooltipWidth = elmen[0].clientWidth
            var cursor = d3.event.x;
            if ((position.left < d3.event.pageX) && (cursor > tooltipWidth)) {
                for (var i = 0; i < elmen.length; i++) {
                    elmen[i].classList.remove("tooltip-left");
                    elmen[i].classList.add("tooltip-right");
                }
                Pietooltipdiv.style("left", d3.event.pageX - tooltipWidth + "px");
                Pietooltipdiv.style("top", d3.event.pageY - 25 + "px");
            } else {
                for (var i = 0; i < elmen.length; i++) {
                    elmen[i].classList.remove("tooltip-right");
                    elmen[i].classList.add("tooltip-left");
                }
                Pietooltipdiv.style("left", d3.event.pageX + 10 + "px");
                Pietooltipdiv.style("top", d3.event.pageY - 25 + "px");
            }
        })
        .on("mouseout", function(d) {
            Pietooltipdiv.style("visibility", "hidden");
            Pietooltipdiv.style("display", "none");
        })
        .transition()
        .delay(function(d, i) {
            return i * 10;
        })
        .duration(500)
        .attrTween('d', function(d) {
            var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
            return function(t) {
                d.endAngle = i(t);
                return arc(d)
            }
        });
    if (pieOptions.istxt) {
        var txtY = parseFloat(this.txtSize.toLowerCase().split("px")[0]) / 2.5;
        if (typeof(pieOptions.istxt) != "boolean" && (pieOptions.istxt) != "true" && (pieOptions.istxt) != "false" && (pieOptions.showValue != 'noValue')) {
            g.append("text").attr("y", txtY).attr('dy',"-8px").text(pieOptions.istxt).style('text-anchor', "middle").style('font-size', '23px').style("fill", this.txtColor).style("stroke", "none").style("margin-top","10px")
            if(pieOptions.divideTxt){
            g.append("text").attr("y", txtY).attr('dy',"10px").text(pieOptions.divideTxt).style('text-anchor', "middle").style('font-size', '12px').style("fill", this.txtColor).style("stroke", "none").style("display","block")
            }
        } else if (pieOptions.showValue != 'noValue') {
            g.append("text").attr("y", txtY).text((pieOptions.maxval.toFixed(2)) + "%").style('text-anchor', "middle").style('font-size', this.txtSize).style("fill", this.txtColor).style("stroke", "none")
        }
    }
    if (pieOptions.islegends) {
        var pieLegendArray = [];
        for(var i=0;i < data.length;i++){
           
          pieLegendArray.push(data[i].key);
  
        }
       //angular.forEach(data, function(i,d) {
        //});
        renderPieLegend(data);
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
            document.getElementById("legendContainer-" + (randomSubstring)).style.marginTop = pieOptions.legendmargintop;
        }
        for(var i=0;i < data.length;i++){
        //angular.forEachach(data, function(i,d) {
          document.getElementById("legendContainer-" + (randomSubstring)).innerHTML +='<div class="pieLegendDiv d-flex" style = "color: #778c96;" ><div class="bar_legend_circles" style="background-color:' + (pieOptions.colorsObj ? pieOptions.colorsObj[data[i].key] : colorScale(data[i].key)) + ';height: 12px;min-width: 12px;border-radius: 6px;display: inline-block;"></div><span style="padding:0 5px;margin:0 2px;font-size:14px;display:flex!important;"><span class="text-capitalize" style="font-size:14px; width:108px;margin-right:3px">' + data[i].key+'</span>' +'<span style="font-size:20px;font-weight:500;color:#fff;line-height: normal;" class="text-dark-black gotham-medium">'+ data[i].value+'</span></span></div>'
          document.getElementById("legendContainer-" + (randomSubstring)).querySelector(".pieLegendDiv").style.fontFamily="Roboto Medium";
        //});
        }
  
    }
    //code for number formatting
    Number.prototype.formatAmt = function(decPlaces, thouSeparator, decSeparator) {
        var n = this,
            decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
            decSeparator = decSeparator == undefined ? "." : decSeparator,
            thouSeparator = thouSeparator == undefined ? "," : thouSeparator,
            sign = n < 0 ? "-" : "",
            i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "",
            j = (j = i.length) > 3 ? j % 3 : 0;
        return sign + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
    };
  };
var PieChartModule = new ReusablePie();

export {
    PieChartModule
};