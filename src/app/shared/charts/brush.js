/*------ Store brush Values ----*/
const brushValues = {
	colors : ["#46a2de", "#5888C8", "#31d99c", "#de5942"],
	radius: 5
}
/*----- Function to render brush ----*/
function createBrush(brushoptions) {
    var container = brushoptions.container ? brushoptions.container : 'body';
    var svg_backgroundcolor = brushoptions.svg_backgroundcolor ? brushoptions.svg_backgroundcolor : "transparent";

    var height = brushoptions.height ? brushoptions.height : 50;
    var Svgwidth = brushoptions.width ? brushoptions.width : $(container).width();

    var margin = brushoptions.margin ? brushoptions.margin : {top: 20, bottom: 20, left: 20, right: 20};
    var data = brushoptions.data ? brushoptions.data : d3.range(width).map(Math.random);
    var xdomain = d3.extent(data, function (d) {
    	if(d.time){
    		 return (d.time);
    	}
        return new Date(d);
    });
    $(container).empty();
    var width = Svgwidth - margin.left - margin.right;

    var x = d3.scaleTime()
            .domain(xdomain)
            .rangeRound([0, width]),
        y = d3.randomNormal(height / 2, height / 8);
    var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    var colorScale = d3.scaleOrdinal().range(brushoptions.colors?brushoptions.colors:brushValues.colors);
    var svg = d3.select(container).append("svg").attr("width", Svgwidth)
             .attr("height", height + margin.top + margin.bottom)
             .style("background-color", svg_backgroundcolor);
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    g.append("defs").append("svg:clipPath")
            .attr("id", "brushClip")
            .append("svg:rect")
            .attr("id", "clip_rect_brush")
            .attr("x", "0")
            .attr("y", "10")
            .attr("width", width)
            .attr("height", height);

    var brush = d3.brushX()
		        .extent([[0, 0], [width, height]])
		        .on("end", function () {
		        	if(brushoptions.noBrush){
		        		return false;
		        	}
	                var s = d3.event.selection;
	                if (s != null) {
	                    var sx = s.map(x.invert);
	                    var x0 = parseInt(sx[0].getTime());
	                    var x1 = parseInt(sx[1].getTime());
	                    getDateRange(x0, x1);
	                             /*  chartsFilter(x0,x1) */
	                }
	                
	            });

   var x_g= g.append("g")
            .attr("class", "axis axis--x-brush")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)).style("stroke", "#838F99");
if(brushoptions.brushFill){
	x_g.selectAll("path").style('stroke',brushoptions.brushFill);
	x_g.selectAll("line").style('stroke',brushoptions.brushFill);
	x_g.selectAll("text").style("stroke","none").style('fill',"#879fa9");
}
    var gBrush = g.append("g")
            .attr("class", "brush").style("fill", "#334552")
            .call(brush).call(brush.move, x.range());
               /* gBrush.call(brush.move, [0, 1].map(x)); */
    gBrush.select(".selection")
            .style("fill", brushoptions.brushFill?brushoptions.brushFill:"#0cb29a")
            .style("stroke",brushoptions.brushFill?brushoptions.brushFill: "#0cb29a")
            .style("fill-opacity", 0.3);
    gBrush.select(".overlay").style("fill", "transparent")
    var circle = g.append("g").attr("clip-path", "url(#brushClip)")
	            .attr("class", "circle")
	            .selectAll("circle")
	            .data(data)
	            .enter().append("circle")
	            .style("fill", function (d) {
	            	if(d.type && brushoptions.colorsObj){
	            		return brushoptions.colorsObj[d.type];
	            	}
	                return colorScale(d);
	            })
	            .attr("transform", function (d, i) {
	            
	                return "translate(" + x(d.time?(d.time):new Date(d)) + "," + y() + ")";
	            })
	            .attr("r", brushValues.radius);
}