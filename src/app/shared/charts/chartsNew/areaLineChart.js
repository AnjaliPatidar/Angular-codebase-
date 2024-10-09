import * as d3 from 'd3';
function AreaLineChart() { }
// var data = [{"date":"1","close":79},{"date":"2","close":90},{"date":"3","close":9},{"date":"4","close":4},{"date":"9","close":2},{"date":"5","close":4},{"date":"8","close":3},{"date":"6","close":1},{"date":"8","close":3}]

// var baropt = {
//       container: "areaLineChart",
//       height:340,
//       data: data,
//       showGrid: true,
//       stroke: "red",
//       shapeRendering: "crispEdges",
//       toolTipTextColor : "white",
//       toolTipText: "logged users",
//       ShowDataOpacity: false,
//       toolTipBorder:"3px",
//       toolTipBackground:"white",
//       strokeWidth: '1px',
//       xAxisType: 'number',
//       xAxisLine: false,
//       yAxisLine: false,
//       xAxisValues: true,
//       yAxisValues: true,
//       valuesColor: "#aaabaa",
//       curveColor: "#4687b1",
//       dotFill: "#4687b1",
//       dotStroke: "#4687b1",
//       //xAxisHeading: "X-axies heading",
//       yAxisHeading: "Number of logons",
//       pathColor: "red",
//       gradientColor: [{
//         offset: "0%",
//         color: "#304959",
//         opacity:"1",
//       }, {
//         offset: "30%",
//         color: "#304959",
//         opacity:"0.5",
//       }, {
//         offset: "60%",
//         color: "#304959",
//         opacity:"0.3",
//       }, {
//         offset: "100%",
//         color: "#304959",
//         opacity:"0",
//       }]
//     };
const groupedColumnValues = {
    xAxisTextX: 8,
    xAxisTextY: 10,
}
AreaLineChart.prototype.areaLineChart = function (options) {
    document.getElementById(options.container).innerHTML = '';
    if (options) {
        options.container = options.container ? options.container : "body";
        options.width = options.width ? options.width : document.getElementById(options.container).offsetWidth;
        options.height = options.height ? options.height : 300;
        options.marginTop = options.marginTop ? options.marginTop : 20;
        options.marginBottom = options.marginBottom ? options.marginBottom : 50;
        options.marginRight = options.marginRight ? options.marginRight : 20;
        options.marginLeft = options.marginLeft ? options.marginLeft : 40;
        options.xAxisType = options.xAxisType ? options.xAxisType : 'date';
        options.xAxisTextDX = options.xAxisTextDX ? options.xAxisTextDX : ".71em";
        options.yAxisTextDY = options.yAxisTextDY ? options.yAxisTextDY : "1.1em";

        options.xAxisLine  = options.xAxisLine  ? options.xAxisLine : false;
        options.yAxisLine  = options.yAxisLine  ? options.yAxisLine : false;

        options.xAxisValues  = options.xAxisValues  ? options.xAxisValues : false;
        options.yAxisValues  = options.yAxisValues  ? options.yAxisValues : false;

        options.valuesColor =  options.valuesColor ?  options.valuesColor: "black";
        options.curveColor = options.curveColor?options.curveColor:"black";

        options.dotFill =  options.dotFill? options.dotFill : "black";
        options.dotStroke =  options.dotStroke? options.dotStroke : "black";

        options.xAxisHeadingTextX = options.xAxisHeadingTextX ? options.xAxisHeadingTextX  : 8;
        options.xAxisHeadingTextY = options.xAxisHeadingTextY ? options.xAxisHeadingTextY  : 10;

        options.xAxisHeadingTextDX = options.xAxisHeadingTextDX?options.xAxisHeadingTextDX : ".71em";
        options.yAxisHeadingTextDY =  options.yAxisHeadingTextDY ?  options.yAxisHeadingTextDY : "1.1em";

        options.yAxisTextHeadingdx = options.yAxisTextHeadingdx? options.yAxisTextHeadingdx : -20;

        options.pathColor =  options.pathColor? options.pathColor : "black";
        options.gradientColor = options.gradientColor ? options.gradientColor : "none";
        options.xAxisDomain = options.xAxisDomain ? options.xAxisDomain :null;
   }

    //Area chart
    //set the dimensions and margins of the graph

    var margin = { top: options.marginTop, right: options.marginRight, bottom: options.marginBottom, left: options.marginLeft },
        width = options.width - margin.left - margin.right,
        height = options.height - margin.top - margin.bottom;
    var svg;
    svg = d3.select("#"+options.container).append("svg").attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");



    var div = d3.select("body").append("div").attr("class", "arealine_chart_new_tooltip").attr("id", "arealine_chart_new_tooltipId").style("position", "absolute").style("z-index", 1000).style("background", "rgb(27, 39, 53)").style("padding", "5px 10px").style("font-size", "10px").style("display", "none").style("max-width","143px");
    // parse the date / time
    var parseTime = d3.timeParse("%Y-%m-%d");

    // set the ranges
    if (options.xAxisType == 'date') {
        var x = d3.scaleTime().range([0, width]);
    }

    else {
        var x = d3.scaleLinear()
            .range([0, width]);
    }

    var y = d3.scaleLinear().range([height, 0]);

    // define the area
    var area = d3.area()
        .x(function (d) {
            return x(d.date);
        })
        .y0(height)
        .y1(function (d) {
            return y(d.close);
        });

    // define the line
    var valueline = d3.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.close);
        });

    // gridlines in y axis function
  function make_y_gridlines() {
    return d3.axisLeft(y)

}

var y_grid = svg.append("g")
  .attr("class", "grid")
  .attr("id","grid")
  .call(make_y_gridlines()
      .tickSize(-width)
      .tickFormat("")
  );

  y_grid.selectAll("line").style("stroke",options.stroke ? options.stroke : "rgb(46, 66, 75)")
                            .style("shape-rendering",options.shapeRendering ? options.shapeRendering :"crispEdges")
                            .style("stroke-width",options.strokeWidth ? options.strokeWidth :"1px");
   y_grid.selectAll("path").style("display","none");
   if(!options.showGrid){
      //$('.grid').find('.tick').css('display', 'none')
  document.getElementById('grid').style.display = "none"

   }
// gridlines in y axis ends
    // get the data
    var data = options.data;

    // format the data
    data.forEach(function (d) {
        if (options.xAxisType == 'date') {
            d.date = parseTime(d.date);
        }
        else {
            d.date = d.date; //parseTime(d.date);
        }
        d.close = +d.close;

    });

    // scale the range of the data
    if(options.xAxisDomain){
        x.domain(options.xAxisDomain);
    }
    else{
        x.domain(d3.extent(data, function (d) {
            return d.date;
        }));

    }
    y.domain([0, d3.max(data, function (d) {
        return d.close;
    })]);


    var defs = svg.append("defs")
        .append("linearGradient")
        .attr("id", "area-gradient")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "0%").attr("y2", "100%");

    if(options.gradientColor){
       for(let i = 0 ; i < options.gradientColor.length ; i++ ){
        defs.append('stop')
        .attr('stop-color', options.gradientColor[i]['color'])
        .attr('offset', options.gradientColor[i]['offset'])
        .attr("stop-opacity", options.gradientColor[i]['opacity']);
       }
    }



    // add the area
    svg.append("path")
        .data([data])
        .attr("class", "area")
        .attr("d", area)
        .style("fill", "url(#area-gradient)")
    // add the valueline path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline)
        .style("stroke",  options.curveColor)
        .style("fill", "none")
        .style("stroke-width", "2px");
    // add the X Axis
    var x_g = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(parseInt(options.xAxiesNoOfTicks)));
    x_g.selectAll("text").style("fill",options.valuesColor);
    if(!options.xAxisLine){
        x_g.selectAll("path").style("display","none");
        x_g.selectAll("line").style("display","none");
    }
    if(!options.xAxisValues){
        x_g.selectAll("text").style("display","none");
    }
    if(options.xAxisHeading){
        x_g.append("text")
        .attr("transform", "translate(" + (width / 2) + "," + 30 + ")")
        .attr("x",options.xAxisHeadingTextX).attr("y", options.xAxisHeadingTextY)
        .attr("dx",options.xAxisHeadingTextDX)
        .style("text-anchor", "middle")
        .style("fill", "#6c7e88")
        .text(options.xAxisHeading).style("font-size", "14px");
    }
    x_g.selectAll("path").style("stroke", options.pathColor)
    .style("shape-rendering", "crispEdges")
    .style("fill", "none");
    x_g.selectAll("line").style("stroke", options.pathColor)
    .style("shape-rendering", "crispEdges")




    // add the Y Axis


    var y_g = svg.append("g")
            .call(d3.axisLeft(y))
            .style("stroke", "db3f8d")
    y_g.selectAll("text").style("fill",options.valuesColor);
    if(!options.yAxisLine){
        y_g.selectAll("path").style("display","none");
        y_g.selectAll("line").style("display","none");
    }
    if(!options.yAxisValues){
        y_g.selectAll("text").style("display","none");
    }
    if(options.yAxisHeading){
        y_g.append("text")
        .attr("class", "y-axis-heading")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left)
        .attr("dy", '1.1em')
        .attr("dx", -20)
        .style("fill", "#6c7e88")
        .style("text-anchor", "end")
        .text(options.yAxisHeading).style("font-size", "14px");
    }

    y_g.selectAll("path").style("stroke", options.pathColor)
        .style("shape-rendering", "crispEdges")
        .style("fill", "none");
    y_g.selectAll("line").style("stroke", options.pathColor)
        .style("shape-rendering", "crispEdges")
        .style("fill", "none");
    y_g.selectAll("text")
        .style("font-size", "10px")
        .style("stroke", "none");







    svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("class", "circle")
        .attr("cx", function (d) {
            return x(d.date);
        })
        .attr("cy", function (d) {
            return y(d.close);
        })
        .attr("r", 6)
        .style("fill", options.dotFill)
        .style("stroke",  options.dotStroke)
        .on("mouseover", function (d) {
            if(options.ShowDataOpacity){
            var circles = document.getElementsByClassName('circle');
            for(var i =0; i< circles.length; i++){
               // circles[i].onclick = function(){

                    this.style.opacity  = 0.1;
                //}
            }
        }
            //$(this).css("fill-opacity", 0.1);
            document.getElementById("arealine_chart_new_tooltipId").innerHTML ="<div style='color :"+options.toolTipTextColor +"' <span> <ul style='list-style: none;padding: 0px;'><li>"+d.close+"&nbsp;"+options.toolTipText +"</li><li>"+d.date+"</li></ul>"+"</span></div>";
            return document.getElementById("arealine_chart_new_tooltipId").style.display = "block";
        })
        .on("mousemove", function () {
            var p = document.getElementById(options.container)
            var position ={
				top: p.offsetTop,
				left: p.offsetLeft,
			};
            var windowWidth = window.innerWidth;
            var tooltipWidth = document.getElementById("arealine_chart_new_tooltipId").offsetWidth + 50
            var cursor = d3.event.x;
            if ((position.left < d3.event.pageX) && (cursor > tooltipWidth)) {
                var element = document.getElementsByClassName("arealine_chart_new_tooltip");
                for (var i = 0; i < element.length; i++) {
                    element[i].classList.remove("tooltip-left");
                    element[i].classList.add("tooltip-right");

                }
                document.getElementById("arealine_chart_new_tooltipId").style.left =  d3.event.pageX - 15 - document.getElementById("arealine_chart_new_tooltipId").offsetWidth + "px";
            } else {
                var element = document.getElementsByClassName("arealine_chart_new_tooltip");
                for (var i = 0; i < element.length; i++) {
                    element[i].classList.remove("tooltip-right");
                    element[i].classList.add("tooltip-left");

                }
                document.getElementById("arealine_chart_new_tooltipId").style.left =  (d3.event.pageX + 10) + "px";

            }
            document.getElementById("arealine_chart_new_tooltipId").style.borderRadius= options.toolTipBorder ? options.toolTipBorder : "" ;
			document.getElementById("arealine_chart_new_tooltipId").style.background =  options.toolTipBackground ? options.toolTipBackground : "rgb(27, 39, 53)" ;
            return document.getElementById("arealine_chart_new_tooltipId").style.top = d3.event.pageY + "px";


        })
        .on("mouseout", function () {
            //$(this).css("fill-opacity", 1);
            //if(options.dataOpacity){
            var circles = document.getElementsByClassName('circle');
            for(var i =0; i< circles.length; i++){
               // circles[i].onclick = function(){
                    this.style.opacity  = 1;
                //}
            }
            //hide tool-tip
            return document.getElementById("arealine_chart_new_tooltipId").style.display = "none";
        });

}

var AreaLineChartModule = new AreaLineChart();
export {
    AreaLineChartModule
};
