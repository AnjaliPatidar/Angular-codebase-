/*------ Store brush Values ----*/
const timeLineColumnValues = {
	colors : ["#46a2de", "#5888C8", "#31d99c", "#de5942"],
	radius: 5
}
/*----- Function to render brush ----*/
var loadtimeLineColumnChart = function(timeLineColumnChartoptions,d3) {
	
    var container = timeLineColumnChartoptions.container ? timeLineColumnChartoptions.container : 'body';
    var svg_backgroundcolor = timeLineColumnChartoptions.svg_backgroundcolor ? timeLineColumnChartoptions.svg_backgroundcolor : "transparent";

    var height = timeLineColumnChartoptions.height ? timeLineColumnChartoptions.height : 50;
    var Svgwidth = timeLineColumnChartoptions.width ? timeLineColumnChartoptions.width : $(container).width();

    var margin = timeLineColumnChartoptions.margin ? timeLineColumnChartoptions.margin : {top: 20, bottom: 20, left: 20, right: 20};
    var data = timeLineColumnChartoptions.data ? timeLineColumnChartoptions.data : d3.range(width).map(Math.random);
    var xdomain = d3.extent(data, function (d) {
        return new Date(d.time);
    });
   var format = d3.format(",d");
   var tool_tip = $('body').append('<div class="timeLineColumn_tooltip text-uppercase" style="word-break:break-all;padding:10px;position: absolute; opacity: 1; pointer-events: none; display: none; z-index: 1000"><span style=" font-size: 12px; position: absolute; white-space: nowrap;  margin-left: 0px; margin-top: 0px; left: 8px; top: 8px;"><span style="font-size:10px" class="tool_tip_x_val"></span><table><tbody><tr><td style="padding:0"> </td><td style="padding:0"><b>216.4 mm</b></td></tr><tr><td style="color:#434348;padding:0">New York: </td><td style="padding:0"><b>91.2 mm</b></td></tr><tr><td style="color:#90ed7d;padding:0">London: </td><td style="padding:0"><b>52.4 mm</b></td></tr><tr><td style="color:#f7a35c;padding:0">Berlin: </td><td style="padding:0"><b>47.6 mm</b></td></tr></tbody></table></span></div>');

    var ydomain = d3.extent(data, function (d) {
        return (d.amount);
    });
    $(container).empty();
    var width = Svgwidth - margin.left - margin.right;

    var x = d3.scaleTime()
            .domain(xdomain)
            .rangeRound([0, width]),
        y = d3.scaleLinear().domain(ydomain).range([height, 0]);
    var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    var colorScale = d3.scaleOrdinal().range(timeLineColumnValues.colors);
    if(timeLineColumnChartoptions.colors){
    	colorScale = d3.scaleOrdinal().range(timeLineColumnChartoptions.colors);
    }
    var svg = d3.select(container).append("svg").attr("width", Svgwidth)
             .attr("height", height + margin.top + margin.bottom)
             .style("background-color", svg_backgroundcolor);
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x_g =  g.append("g")
            .attr("class", "axis axis--x-brush")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)).style("stroke", "#556B76");
    x_g.selectAll('text').style("fill","#556B76").style("font-family","'Roboto Medium'").style("stroke","none");
    x_g.select("path").style("stroke","#2e424b");
    x_g.selectAll("line").style("stroke","#2e424b")
  
    var circle = g.append("g").attr("clip-path", "url(#brushClip)")
	            .attr("class", "circle")
	            .selectAll("circle")
	            .data(data)
	            .enter().append("circle")
	            .attr('cursor','pointer')
	            .style("fill", function (d) {
	            	
	            	if(d.type){
	            		if(timeLineColumnChartoptions.colorsObj){
	            			return timeLineColumnChartoptions.colorsObj[d.type];
	            		}
	            		return colorScale(d.type);
	            	}
	                return colorScale(d);
	            })
	            .attr("transform", function (d, i) {
	            
	                return "translate(" + x(new Date(d.time)) + "," + y(d.amount) + ")";
	            })
	            .attr("r", timeLineColumnValues.radius)
	            .on("click", function (d){
	            	window.popUpdata(d);
	            	
	            })
	            .on("mouseover", function (d) {
//	            	if(d.txt){
//	            		 $(".timeLineColumn_tooltip").html('<div class="custom-tooltip right text-uppercase" style="top:'+(d3.event.pageY - 10)+'"px";left:'+(d3.event.pageX + 10)+'"px";"><div class="tooltip-arrow"></div><div class="tooltip-inner" style="text-align:left;">'+d.txt+'</div></div>');
//					    	
//	            	}
	           
//	            	 if( d.type){
//	            		var txt = '<span>' + d.time + '</span>'
//	            		 $(".timeLineColumn_tooltip").html('<div class="custom-tooltip right text-uppercase" style="top:'+(d3.event.pageY - 10)+'"px";left:'+(d3.event.pageX + 10)+'"px";"><div class="tooltip-arrow"></div><div class="tooltip-inner" style="text-align:left;">'+txt+'</div></div>');
//					}else
	            	if(d.name){
						var txt = '<span>'+"Name: " + d.name + '</span><br><span>'+"Date: " + d.time + '</span>';
	            		 $(".timeLineColumn_tooltip").html('<div class="custom-tooltip right text-uppercase" style="top:'+(d3.event.pageY - 10)+'"px";left:'+(d3.event.pageX + 10)+'"px";"><div class="tooltip-arrow"></div><div class="tooltip-inner clearfix" style="text-align:left;">'+txt+'<a class="pull-right" style="color: #337ab7;">Click For More Information</a></div></div>');
					}else{
	            		var txt ='<span> '+"Date Published: " + d.time + '</span><br><span>' + "Value: " + format(d.amount) + '</span>';
	            		$(".timeLineColumn_tooltip").html('<div class="custom-tooltip right text-uppercase" style="top:'+(d3.event.pageY - 10)+'"px";left:'+(d3.event.pageX + 10)+'"px";"><div class="tooltip-arrow"></div><div class="tooltip-inner" style="text-align:left;">'+txt+'<a class="pull-right" style="color: #337ab7;">Click For More Information</a></div></div>');
	 				}
	            	 $(".timeLineColumn_tooltip").css("visibility", "visible");
	            	return $(".timeLineColumn_tooltip").css("display", "block");
	            })
                .on("mousemove", function () {
               		$(".timeLineColumn_tooltip").css("top", (d3.event.pageY - 10) + "px")
                    return  $(".timeLineColumn_tooltip").css("left", (d3.event.pageX + 10) + "px");

                })
                .on("mouseout", function () {
                	 $(".timeLineColumn_tooltip").css("visibility", "hidden");

                    return $(".timeLineColumn_tooltip").css("display", "none");
                });;
}
module.exports = loadtimeLineColumnChart;
