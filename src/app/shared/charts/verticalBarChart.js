   $(".toolTip_barhorizontal").remove();
	    var div = d3.select("body").append("div").attr("class", "toolTip_barhorizontal text-uppercase").style("position", "absolute").style("z-index", 1000).style("background","rgb(27, 39, 53)").style("padding","5px 10px").style("font-size","10px").style("display","none").style("visibility","hidden").style("min-width","200px").style("max-width","300px");
	   
function verticalBarGraph(data,options){
	$(options.id).empty();
	    var margin = {top: 20, right: 20, bottom: 30, left: 40};
	    var width = (options.width?options.width:$(options.id).width() )- margin.left - margin.right;
	    var height = (options.height?options.height:500) - margin.top - margin.bottom;
	    
	    // set the ranges
	    var x = d3.scaleBand()
	              .range([0, width])
	              .padding(0.1);
	    var y = d3.scaleLinear()
	              .range([height, 0]);
	    var svg = d3.select(options.id).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");
   
	    plotBarGraph ()   
	    function plotBarGraph (){
	    // append the svg object to the body of the page
	    // append a 'group' element to 'svg'
	    // moves the 'group' element to the top left margin
	   
	    // Scale the range of the data in the domains
	    x.domain(data.map(function(d) { return d.x; }));
	    y.domain([0, d3.max(data, function(d) { return d.y; })]);
	 // gridlines in y axis function
	    function make_y_gridlines() {		
	        return d3.axisLeft(y)
	            .ticks(8)
	    }
	   var y_grid = svg.append("g")			
	      .attr("class", "grid")
	      .call(make_y_gridlines()
	          .tickSize(-width)
	          .tickFormat("")
	      )
	      y_grid.selectAll("line").style("stroke","rgb(46, 66, 75)")
	      						  .style("shape-rendering","crispEdges")
	      						  .style("stroke-width","1px")
	       y_grid.selectAll("path").style("display","none");
	    // append the rectangles for the bar chart
	    svg.selectAll(".mipbar")
	        .data(data)
	      .enter().append("rect")
	        .attr("class", "mipbar") 
//	        .attr("rx", (x.bandwidth() / 4))
//            .attr("ry", (x.bandwidth() / 4))
	        .attr("x", function(d) { return x(d.x); })
	        .attr("width", x.bandwidth())
	        .attr("y", function(d) { return y(d.y); })
	        .attr("height", function(d) { return height - y(d.y); })
	        .style("fill", function(d) { 
	        	if(options.color){
	        		return options.color
	        	} else{
	        		return "#C39446"
	        	}
	        	 })
	       .on("mouseover", function (d) {
	    	    d3.select(this).style("opacity","0.7");;
	    	    div.style("visibility", "visible");
                div.style("display", "inline-block");
                if( options.id == '#priceEarningRatioBarChart')
                    div.html("<div style='color:white;margin-bottom:15px;min-width:120px;'><span style='color:#657F8B'>Year: "+d.x.split('"').join("")+"</span></br><span style='color:#657F8B'>p/e ratio: "+d.y+"</span></div>");
                else if(options.id.indexOf('bar_') > 0)
                    div.html("<div style='color:white;margin-bottom:15px;min-width:120px;'><span style='color:#657F8B'>Year: "+d.x.split('"').join("")+"</span></br><span style='color:#657F8B'>Number of incidents: "+nFormatter(d.y,2)+"</span></div>");
                else
                	div.html("<div style='color:white;margin-bottom:15px'><h5>"+(d.x.split('"').join(""))+"</h5></div><div style='margin-bottom:15px'>Funding Received <h4 style='color:#3372A8;margin-top:0'>"+d.y+"BN</h4></div><div style='margin-bottom:15px'>Type <h6 style='color:#3372A8;margin-top:0'>"+d.type+"</h6></div>");
            })
            .on("mousemove", function (d) {
            	/*var svgWidth = $(options.id).width();
            	if(d3.event.pageX + 10+( $(".toolTip_barhorizontal").width()) >svgWidth){
            		div.style("left", d3.event.pageX + 10-( $(".toolTip_barhorizontal").width()+35) + "px");
            	}else{
            		div.style("left", d3.event.pageX + 10 + "px");
            	}
				div.style("top", d3.event.pageY - 25 + "px");*/
				var p = $(options.id);
				var position = p.offset();
				var windowWidth = window.innerWidth;
				var tooltipWidth = $(".toolTip_barhorizontal").width() + 50
				var cursor = d3.event.x;
				if ((position.left < d3.event.pageX) && (cursor > tooltipWidth)) {
					var element = document.getElementsByClassName("toolTip_barhorizontal");
					for (var i = 0; i < element.length; i++) {
						element[i].classList.remove("tooltip-left");
						element[i].classList.add("tooltip-right");
					}
					$(".toolTip_barhorizontal").css("left", (d3.event.pageX - 30 - $(".toolTip_barhorizontal").width()) + "px");
				} else {
					var element = document.getElementsByClassName("toolTip_barhorizontal");
					for (var i = 0; i < element.length; i++) {
						element[i].classList.remove("tooltip-right");
						element[i].classList.add("tooltip-left");
					}
					$(".toolTip_barhorizontal").css("left", (d3.event.pageX) +20 + "px");
				}
				return $(".toolTip_barhorizontal").css("top", d3.event.pageY-20+ "px");

            })
            .on("mouseout", function (d) {
//            	if(options.id == '#priceEarningRatioBarChart'){
//            		d3.select(this).style("fill","#50c9e2");
//            	}else{
//            		d3.select(this).style("fill","#C39446");
//            	}
            	 d3.select(this).style("opacity",1);;
            	 div.style("visibility", "hidden");
                div.style("display", "none");
            })

	    // add the x Axis
//						    var x_g = svg.append("g")
//						        .attr("transform", "translate(0," + height + ")")
//						        .call(d3.axisBottom(x));

	 
	 
	         // add the y Axis
            if(options.id.indexOf('bar_') > 0){
            	
            }else{
				  var y_g=  svg.append("g")
			        .call(d3.axisLeft(y) .ticks(8).tickFormat(d3.format(".0s")));
				  y_g.selectAll("path").style("display","none");
				  y_g.selectAll("line").style("display","none");
				  y_g.selectAll("text").style("stroke","none").style("fill","#6D6F65").style("font-weight","bold");
            }
	    }
 }

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
