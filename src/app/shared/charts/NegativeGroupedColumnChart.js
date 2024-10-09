 function negativeGroupedChart(options){
		  $(options.container).empty();
		  var data =options.data;


		    var margin = {top: 20, right: 20, bottom: 30, left: 40},
		            width = options.width- margin.left - margin.right,
		            height = options.height - margin.top - margin.bottom;

		    var negWidth = width * -1;
		    var posWidth = width * 0.5;
		    var x0 = d3_v3.scale.ordinal()
		            .rangeRoundBands([0, width], .1);

		    var x1 = d3_v3.scale.ordinal();

		    var y = d3_v3.scale.linear()
		            .range([height, 0]);

		    var color = d3_v3.scale.ordinal()
		            .range(options.color);

		    var xAxis = d3_v3.svg.axis()
		            .scale(x0)
		            .orient("bottom");

		    var yAxis = d3_v3.svg.axis()
		            .scale(y)
		            .orient("left")
		            .tickFormat(d3.format(".2s"));

		    var svg = d3_v3.select(options.container).append("svg")
		            .attr("width", width + margin.left + margin.right)
		            .attr("height", height + margin.top + margin.bottom)
		            .append("g")
		            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


		    var ageNames = d3_v3.keys(data[0]).filter(function (key) {
		        return key !== "time"  & key !="ages";
		    });

		    data.forEach(function (d) {
		   if(!d.ages){
		         d.ages = ageNames.map(function (name) {
		            return {name: name, value: +d[name]}; 
		        });
		   } 
		    });

		    x0.domain(data.map(function (d) {
		        return d.time;
		    }));
		    x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
		    var d3Min =    d3_v3.min(data, function (d) {
		        return d3_v3.min(d.ages, function (d) {
		            return d.value;
		        });
		    });
		     var  d3Max =  d3_v3.max(data, function (d) {
		         return d3_v3.max(d.ages, function (d) {
		             return d.value;
		         });
		     });
		    y.domain([ d3Min,d3Max ]);
            var checkNegoOrPos = false;
		    var xAxisTransform =  height;
		   if(d3Min < 0) {
			   checkNegoOrPos = true
		        xAxisTransform = height;
		    }
		   var x_g=svg.append("g")
		            .attr("class", "X axis")
		            .attr("transform", "translate(0," + xAxisTransform + ")")  // this line moves x-axis
		            .call(xAxis);
		   x_g.selectAll("path").style("stroke", "rgb(46, 66, 75)")
           .style("shape-rendering", "crispEdges")
           .style("fill", "none");
           x_g.selectAll("line").style("stroke", "rgb(46, 66, 75)")
           .style("shape-rendering", "crispEdges")
           .style("fill", "none");
           x_g.selectAll("text").style("fill", "#6c7e88")
           .style("font-size", "10px")
           .style("stroke", "none");
			    
			   var y_g=svg.append("g")
			   .attr("class", "y axis")
			   
			           .call(yAxis)
			  y_g.selectAll("path").style("stroke", "rgb(46, 66, 75)")
			  .style("shape-rendering", "crispEdges")
			  .style("fill", "none");
			   y_g.selectAll("line").style("stroke", "rgb(46, 66, 75)")
			  .style("shape-rendering", "crispEdges")
			  .style("fill", "none");
			   y_g.selectAll("text").style("fill", "#6c7e88")
			  .style("font-size", "10px")
			  .style("stroke", "none");
           
			   y_g.selectAll("text")
		            .append("text")
		            .attr("class", "Yaxis label")
		            .attr("transform", "rotate(-90)")
		            .attr("y", 6)
		            .attr("dy", ".71em")
		            .style("text-anchor", "middle")
		            .text("USD");

		    var state = svg.selectAll(".state")
		            .data(data)
		            .enter().append("g")
		            .attr("class", "groupRect")
		            .attr("transform", function (d) {
		                return "translate(" + x0(d.time) + ",0)";
		            }) 
		            .on("mouseover",function(d){
		            	$(".Screening_new_tooltip").css("display", "block");
		            	
		            	$(".Screening_new_tooltip").html('<div><span class="text-gray-ta" style="text-transform: uppercase">Year : </span> <span>'+d.time +'</span></div><div><span class="text-gray-ta" style="text-transform: uppercase">Book value per share : </span> <span>'+d.book_value+' USD</span></div><div><span class="text-gray-ta" style="text-transform: uppercase">Cash flow per share : </span> <span>'+d.cash_value+' USD</span></div>');
		               })
		               .on("mousemove",function(d){
//		            	   $(".Screening_new_tooltip").html('<div><span>Year : </span><span>'+d.time +'</span></div><div><span>Book_value_per_share : </span><span>'+d.book_value+'</span></div><div><span>Cash_flow_per_share : </span><span>'+d.cash_value+'</span></div>');
		            	   
		           		var p = $(options.container)
		           		var position = p.offset();
		           		var windowWidth = window.innerWidth;
		           		var tooltipWidth = $(".Screening_new_tooltip").width() + 50
		           	    var cursor = d3_v3.event.x;
		                if ((position.left < d3_v3.event.pageX) && (cursor > tooltipWidth)) {
		           			var element = document.getElementsByClassName("Screening_new_tooltip");
		           			for (var i = 0; i < element.length; i++) {
		           				element[i].classList.remove("tooltip-left");
		           				element[i].classList.add("tooltip-right");
		           			}
		           			$(".Screening_new_tooltip").css("left", (d3_v3.event.pageX - 30 - $(".Screening_new_tooltip").width()) + "px");
		           		} else {
		           			var element = document.getElementsByClassName("Screening_new_tooltip");
		           			for (var i = 0; i < element.length; i++) {
		           				element[i].classList.remove("tooltip-right");
		           				element[i].classList.add("tooltip-left");
		           			}
		           			$(".Screening_new_tooltip").css("left", (d3_v3.event.pageX) +20 + "px");
		           		}
		           		return $(".Screening_new_tooltip").css("top", d3_v3.event.pageY-20+ "px")
		            
		               })
		                .on("mouseout",function(d){
		                	$(".Screening_new_tooltip").css("display", "none");
		               })
					   
		    state.selectAll("rect")
		            .data(function (d) {
		                return d.ages;
		            })
		            .enter().append("rect")
		            .attr("width", x1.rangeBand())
		            .attr("x", function (d) {
		                return x1(d.name);
		            })
		            .attr("y", function (d) {
		            	if(checkNegoOrPos == true){
		                return y(Math.max(0, d.value));
		            	}else{
		            		return y(d.value);
						}
		            })
		            .attr("height", function (d) {
		            	if(checkNegoOrPos == true){
		                return Math.abs(y(d.value) - y(0));
		            	} else{
		            		return height - y(d.value);
		            	}
		            })
		            .style("fill", function (d,i) {
		                return color(d.name);
		            })

	  }