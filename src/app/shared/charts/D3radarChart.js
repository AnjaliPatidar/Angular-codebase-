var div_radar = d3.select("body").append("div").attr("class", "radar_tooltip").style("position", "absolute").style("z-index", 1000).style("background", "rgb(27, 39, 53)").style("padding", "5px 10px").style("border-radius", "10px").style("font-size", "10px").style("display", "none");

  function RadarChart(id, data,options){
      $(options.container).empty();
        if (options)
        {
            options.container = options.container ? options.container : "body";
            options.width = options.width ? options.width : $(options.container).width();
            options.height = options.height ? options.height : 300;
            options.circleRadius = options.circleRadius ? options.circleRadius :5;
            options.radians = options.radians ? options.radians : 2 * Math.PI;
            options.levels = options.levels ? options.levels : 5;
            options.maxValue = options.maxValue ? options.maxValue : 0;
            options.opacityArea = options.opacityArea ? options.opacityArea : 0.35;
            options.transformToRight = options.transformToRight ? options.transformToRight : 5;
            options.TranslateX = options.TranslateX ? options.TranslateX : 80;
            options.TranslateY = options.TranslateY ? options.TranslateY : 30;
            options.ExtraWidthX = options.ExtraWidthX ? options.ExtraWidthX : 300;            
            options.ExtraWidthY = options.ExtraWidthY ? options.ExtraWidthY : 100;
            options.factor = options.factor ? options.factor : 1.25;
            options.factorLegend = options.factorLegend ? options.factorLegend : 0.85;
            options.color =options.color ?options.color : d3_v3.scale.category10();
            options.roundStrokes = options.roundStrokes ? options.roundStrokes: true;
            options.marginTop = options.marginTop ? options.marginTop : 20;
            options.marginBottom = options.marginBottom ? options.marginBottom : 20;
            options.marginRight = options.marginRight ? options.marginRight : 20;
            options.marginLeft = options.marginLeft ? options.marginLeft : 20;
            options.wrapWidth=options.wrapWidth?options.wrapWidth:60;
            options.opacityCircles = options.opacityCircles ? options.opacityCircles :0.1;
            options.strokeWidth = options.strokeWidth ? options.strokeWidth : 2
        }

	
	
	
	//If the supplied maxValue is smaller than the actual one, replace by the max in the data
	var maxValue = Math.max(options.maxValue, d3_v3.max(data, function(i){return d3_v3.max(i.map(function(o){return o.value;}))}));
		
	var allAxis = (data[0].map(function(i, j){return i.axis})),	//Names of each axis
		total = allAxis.length,					//The number of different axes
		radius = Math.min(options.width/3, options.height/2), 	//Radius of the outermost circle
		Format = d3_v3.format('%'),			 	//Percentage formatting
		angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"
	
	//Scale for the radius
	var rScale = d3_v3.scale.linear()
		.range([0, radius])
		.domain([0, maxValue]);
		
	/////////////////////////////////////////////////////////
	//////////// Create the container SVG and g /////////////
	/////////////////////////////////////////////////////////

	//Remove whatever chart with the same id/class was present before
	d3_v3.select(id).select("svg").remove();
	var width =options.width + options.marginLeft + options.marginRight,
    height = options.height + options.marginTop + options.marginBottom
	//Initiate the radar chart SVG
	var svg = d3_v3.select(id)
//	         .append("svg")
//			.attr("width",  options.width + options.marginLeft + options.marginRight)
//			.attr("height", options.height + options.marginTop + options.marginBottom)
	.append("div")
   .classed("svg-container", true) //container class to make it responsive
   .append("svg")
   //responsive SVG needs these 2 attributes and no width and height attr
   .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox",[0, 0, width, height].join(" "))
   //class to make it responsive
   .classed("svg-content-responsive", true)
			.attr("class", "radar"+id);
	//Append a g element		
	var g = svg.append("g")
			.attr("transform", "translate(" + (options.width/3 + options.marginLeft + 10) +"," + (options.height/3 + options.marginTop + 5) + ")");
	
	/////////////////////////////////////////////////////////
	////////// Glow filter for some extra pizzazz ///////////
	/////////////////////////////////////////////////////////
	
	//Filter for the outside glow
	var filter = g.append('defs').append('filter').attr('id','glow'),
		feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
		feMerge = filter.append('feMerge'),
		feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
		feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

	/////////////////////////////////////////////////////////
	/////////////// Draw the Circular grid //////////////////
	/////////////////////////////////////////////////////////
	
	//Wrapper for the grid & axes
	var axisGrid = g.append("g").attr("class", "axisWrapper");
	
	//Draw the background circles
	axisGrid.selectAll(".levels")
	   .data(d3_v3.range(1,(options.levels+1)).reverse())
	   .enter()
		.append("circle")
		.attr("class", "gridCircle")
		.attr("r", function(d, i){return radius/options.levels*d;})
		.style("fill", "transparent")
		.style("stroke", "#2E424B")
		.style("fill-opacity", options.opacityCircles)
		.style("filter" , "url(#glow)");

	//Text indicating at what % each level is
//	axisGrid.selectAll(".axisLabel")
//	   .data(d3_v3.range(1,(options.levels+1)).reverse())
//	   .enter().append("text")
//	   .attr("class", "axisLabel")
//	   .attr("x", 4)
//	   .attr("y", function(d){return -d*radius/options.levels;})
//	   .attr("dy", "0.4em")
//	   .style("font-size", "10px")
//	   .attr("fill", "#6d858f")
//	   .text(function(d,i) { return Format(maxValue * d/options.levels); });

	/////////////////////////////////////////////////////////
	//////////////////// Draw the axes //////////////////////
	/////////////////////////////////////////////////////////
	
	//Create the straight lines radiating outward from the center
	var axis = axisGrid.selectAll(".axis")
		.data(allAxis)
		.enter()
		.append("g")
		.attr("class", "axis");
	//Append the lines
	axis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
		.attr("class", "line")
		.style("stroke", "#2E424B")
		.style("stroke-width", "1px");

	//Append the labels at each axis
	axis.append("text")
		.attr("class", "legend")
		.style("font-size", "11px")
		.style("fill","#6d858f")
		.style("cursor","pointer")
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em")
		.attr("x", function(d, i){ return rScale(maxValue * options.factor) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("y", function(d, i){ return rScale(maxValue * options.factor) * Math.sin(angleSlice*i - Math.PI/2); })
		.text(function(d){return d})

//		.call(wrap, options.wrapWidth);

		.on('click', function(d){
			window.pushFilters(d, false, 'attackType', d, 'selectedAttackType', 'locationMultipleEnd');
			$(".radar_tooltip").css("display", "none");
		});


	/////////////////////////////////////////////////////////
	///////////// Draw the radar chart blobs ////////////////
	/////////////////////////////////////////////////////////
	
	//The radial line function
	var radarLine = d3_v3.svg.line.radial()
		.interpolate("linear-closed")
		.radius(function(d) { return rScale(d.value); })
		.angle(function(d,i) {	return i*angleSlice; });
		
	if(options.roundStrokes) {
		radarLine.interpolate("cardinal-closed");
	}
				
	//Create a wrapper for the blobs	
	var blobWrapper = g.selectAll(".radarWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarWrapper");
			
	//Append the backgrounds	
	blobWrapper
		.append("path")
		.attr("class", "radarArea")
		.attr("d", function(d,i) { return radarLine(d); })
		.style("fill", function(d,i) { 
			if(options.colorObj && d[0].group){
				return options.colorObj[d[0].group];
			}
			return options.color(i);
			})
		.style("fill-opacity", options.opacityArea)
		.on('mouseover', function (d,i){
			//Dim all blobs
			d3_v3.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", 0.1); 
			//Bring back the hovered over blob
			d3_v3.select(this)
				.transition().duration(200)
				.style("fill-opacity", 0.7);	
		})
		.on('mouseout', function(){
			//Bring back all blobs
			d3_v3.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", options.opacityArea);
		});
		
	//Create the outlines	
	blobWrapper.append("path")
		.attr("class", "radarStroke")
		.attr("d", function(d,i) { return radarLine(d); })
		.style("stroke-width", options.strokeWidth + "px")
		.style("stroke", function(d,i) { 
			if(options.colorObj && d[0].group){
				return options.colorObj[d[0].group];
			}
			return options.color(i); })
		.style("fill", "none")
		.style("filter" , "url(#glow)");		
	
	//Append the circles
	blobWrapper.selectAll(".radarCircle")
		.data(function(d,i) { return d; })
		.enter().append("circle")
		.attr("class", "radarCircle")
		.attr("r", options.circleRadius)
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		.style("fill", function(d,i,j) { 
			if(options.colorObj && d.group){
				return options.colorObj[d.group];
			}
			return options.color(j); })
		.style("fill-opacity", 0.8);

	/////////////////////////////////////////////////////////
	//////// Append invisible circles for tooltip ///////////
	/////////////////////////////////////////////////////////
	
	//Wrapper for the invisible circles on top
	var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarCircleWrapper");
		
	//Append a set of invisible circles on top for the mouseover pop-up
	blobCircleWrapper.selectAll(".radarInvisibleCircle")
		.data(function(d,i) { return d; })
		.enter().append("circle")
		.attr("class", "radarInvisibleCircle")
		.attr("r", options.circleRadius*1.5)
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		.style("fill", "none")
		.style("pointer-events", "all")
		.on("mouseover", function(d,i) {
			
			$(".radar_tooltip").css("display", "block");
        	
        	$(".radar_tooltip").html('<div><span class="text-gray-ta" style="text-transform: uppercase">'+d.axis+'</span></div><div><span>'+ d.actualValue +' of '+ d.totIncidentsCount +' ('+ d.incidentsValPercentage +'%)</span></div>');
         

		})
		.on("mousemove",function(d){
	           		var p = $(options.container)
		           		var position = p.offset();
		           		var windowWidth = window.innerWidth;
		           		var tooltipWidth = $(".radar_tooltip").width() + 50
		           	    var cursor = d3_v3.event.x;
		                if ((position.left < d3_v3.event.pageX) && (cursor > tooltipWidth)) {
		           			var element = document.getElementsByClassName("radar_tooltip");
		           			for (var i = 0; i < element.length; i++) {
		           				element[i].classList.remove("tooltip-left");
		           				element[i].classList.add("tooltip-right");
		           			}
		           			$(".radar_tooltip").css("left", (d3_v3.event.pageX - 30 - $(".radar_tooltip").width()) + "px");
		           		} else {
		           			var element = document.getElementsByClassName("radar_tooltip");
		           			for (var i = 0; i < element.length; i++) {
		           				element[i].classList.remove("tooltip-right");
		           				element[i].classList.add("tooltip-left");
		           			}
		           			$(".radar_tooltip").css("left", (d3_v3.event.pageX) +20 + "px");
		           		}
		           		return $(".radar_tooltip").css("top", d3_v3.event.pageY-20+ "px")
		            
		               })
		                .on("mouseout",function(d){
		                	$(".radar_tooltip").css("display", "none");
		               })

	
	
	/////////////////////////////////////////////////////////
	/////////////////// Helper Function /////////////////////
	/////////////////////////////////////////////////////////

	//Taken from http://bl.ocks.org/mbostock/7555321
	//Wraps SVG text	
	function wrap(text, width) {
	  text.each(function() {
		var text = d3_v3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.4, // ems
			y = text.attr("y"),
			x = text.attr("x"),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
			
		while (word = words.pop()) {
		  line.push(word);
		  tspan.text(line.join(" "));
		  if (tspan.node().getComputedTextLength() > width) {
			line.pop();
			tspan.text(line.join(" "));
			line = [word];
			tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
		  }
		}
	  });
	}//wrap	
	
}//RadarChart


function nFormatter(num, digits) {
	var si = [
	  { value: 1E18, symbol: "E" },
	  { value: 1E15, symbol: "P" },
	  { value: 1E12, symbol: "T" },
	  { value: 1E9,  symbol: "G" },
	  { value: 1E6,  symbol: "M" },
	  { value: 1E3,  symbol: "k" }
	], rx = /\.0+$|(\.[0-9]*[1-9])0+$/, i;
	for (i = 0; i < si.length; i++) {
	  if (num >= si[i].value) {
		return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
	  }
	}
	return num.toFixed(digits).replace(rx, "$1");
  }
