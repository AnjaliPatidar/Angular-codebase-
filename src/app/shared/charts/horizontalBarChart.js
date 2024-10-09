 var barcolorScale = d3.scaleOrdinal().range(["#5d96c8" , "#b753cd" , "#69ca6b" , "#69ca6b","#c1bd4f" , "#db3f8d" , "#669900"]);   
function barChart(chartData, id, index) {
	   var div = d3.select("body").append("div").attr("class", "toolTip_barhorizontal text-uppercase").style("position", "absolute").style("z-index", 1000).style("background","rgb(27, 39, 53)").style("padding","5px 10px").style("font-size","10px").style("display","none").style("min-width","200px").style("max-width","300px");
	   $("#" + id).empty();
	    var titleText;
	    if (id == "persons-bar-chart-container")
	        titleText = "Persons";
	    else if (id == "orgs-bar-chart-container")
	        titleText = "Organizations";
	    else if (id == "doughnut-chart-container")
	        titleText = "Locations";
	    // format the data
	    var data = chartData;
	    data = data.sort(function (a, b) {
	        return d3.ascending(a.count, b.count);
	    });
	    data.forEach(function (d) {
	        d.count = +d.count;
	    }); // set the dimensions and margins of the graph	
	    var margin = {top: 5, right:30, bottom: 5, left: 100},
	            width = $("#" + id).width() - margin.left - margin.right,
	            height = 182 - margin.top - margin.bottom;
	    var bar_min_height=12;
	    var barheightwithpadding=24;
	    var datalength = data.length;
	    if((datalength*barheightwithpadding)>height){
	    	height =(datalength*barheightwithpadding); 
	    }
	    // set the ranges	  
	    var y = d3.scaleBand()
	            .range([height, 0])
	            .padding(0.5);
	    var x = d3.scaleLinear()
	            .range([0, width]);
	
	     // append the svg object to the body of the page	 
	    // append a 'group' element to 'svg'	
	    // moves the 'group' element to the top left margin	
	    var svg = d3.select("#" + id).append("svg")
	            .attr("width", width + margin.left + margin.right)
	            .attr("height", height + margin.top + margin.bottom)
	            .append("g")
	            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	    // Scale the range of the data in the domains	
	    x.domain([0, d3.max(data, function (d) {
	            return d.count;
	        })])
	    y.domain(data.map(function (d) {
	        return d.key;
	    }));
	    //	      // append the rectangles for the bar chart	
	    var bar = svg.selectAll(".bar")
	            .data(data)
	            .enter().append("rect")
	            .attr("class", "bar").style("cursor", "pointer")
	            .attr("width", 0)
	            .attr("rx",4).attr("ry",4)
	            .attr("y", function (d) {
	                return y(d.key);
	            })
	            .style("fill", function (d) {
	                return barcolorScale(index);
	            })
	            .attr("height", y.bandwidth());
	    bar.transition().duration(500).attr("width", function (d) {
	        return x(d.count);
	    })  ;
	    svg.selectAll(".txt")
	            .data(data)
	            .enter().append("text").attr("class", "txt")
	            .attr("x",function(d){
	            	return x(d.count)+2;
	            })
	            .attr("y",function(d){
	            	return y(d.key)+(3*(y.bandwidth()/4));
	            }).text(function(d){
	            	return d.txtToShow;
	            }).style("font-size","10px").style("fill","#4a6570").style("stroke","none")
	          
	    //	          Tooltips onto Bar on mousemove and off on mouseout     
	    bar.on("mousemove", function (d) {
	        div.style("left", d3.event.pageX + 10 + "px");
	        div.style("top", d3.event.pageY - 25 + "px");
	        div.style("display", "inline-block");
	        div.html(d.key + ":" + d.count);
	    });
	    bar.on("mouseout", function (d) {
	        div.style("display", "none");
	    });
	    bar.on("click", function (d) {
	        refresh(d.key, $(this).parent().parent().parent().attr("id"));
	    });
	    // add the x Axis	 
	    var x_g = svg.append("g")
	            .attr("transform", "translate(0," + height + ")")
	
	            .call(d3.axisBottom);
	
	    // add the y Axis
	   var y_g= svg.append("g")
	            .call(d3.axisLeft(y))
	            .attr("class", "y_axis");
	    y_g.selectAll("path").style("display", "none");
	    y_g.selectAll("line").style("display", "none");
	    y_g.selectAll("text").each(function(d){
	    	var txt = d;
	    	txt = txt.split(" ").join("*");
	    	if(d.length>13){
	    	 txt =	d.slice(0,11)+"..";
	    	}
	    d3.select(this).text(txt.split("*").join(" ").toUpperCase())
	    }).style("fill","#778c96").style("font-family","'Roboto Medium'");
   }