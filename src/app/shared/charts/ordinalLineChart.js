
function lineChartWithOrdinal(options) {
        $(options.container).empty();
        if (options)
        {
            options.container = options.container ? options.container : "body";
            options.width = options.width ? options.width : $(options.container).width(); 
            options.height = options.height ? options.height : 300;
            options.marginTop = options.marginTop ? options.marginTop : 20;
            options.marginBottom = options.marginBottom ? options.marginBottom : 30;
            options.marginRight = options.marginRight ? options.marginRight : 20;
            options.marginLeft = options.marginLeft ? options.marginLeft : 40;
            options.xParam = options.xParam ? options.xParam : $('#errormsg').html('Please check ... May be Data,x-Parameter or y-Parameter is missing.. ');
            options.yParam = options.yParam ? options.yParam : $('#errormsg').html('Please check ... May be Data,x-Parameter or y-Parameter is missing.. ');
            options.gridx = options.gridx ? options.gridx : false;
            options.gridy = options.gridy ? options.gridy : false;
    		options.axisX = options.axisX ? options.axisX : false;
            options.axisY = options.axisY ? options.axisY : false;
            options.showxYaxis = options.showxYaxis ? options.showxYaxis : false;
            options.labelRotate = options.labelRotate ? options.labelRotate : 0;
            options.randomIdString = Math.floor(Math.random() * 10000000000);
            options.header = options.header ? options.header : "LINE CHART";
            options.color = options.color ? options.color : "#BE62AE";
            options.labelRotate = options.labelRotate ? options.labelRotate : 0;
            options.headerOptions = options.headerOptions == false ? options.headerOptions : false;

        }
        var margin = {top: options.marginTop, right: options.marginRight, bottom: options.marginBottom, left: options.marginLeft},
                width = options.width - margin.left - margin.right,
                height = options.height - margin.top - margin.bottom;
        if (options.labelRotate != 0) {
            var svg = d3.select(options.container).append("svg").attr("width", width).attr("height", parseInt(options.height) + 25)
        } else {
            var svg = d3.select(options.container).append("svg").attr("width", width).attr("height", options.height)
        }
        
//        var svg = d3.select(options.container)
//                .append("svg")
//                .attr('height', options.height)
//                .attr('width', width)
        var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
                y = d3.scaleLinear().rangeRound([height, 0]);
        var g = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        var data = options.data
        data.forEach(function (d) {
            d.frequency = +d.frequency;//This is a quick way to convert a string to a number in JavaScript.The + sign in front of the d dot frequency converts the string to a number.
        });
        
		function make_x_axis() {
		        return d3.axisBottom(x)
		                .ticks(5)
		                .style("stroke", "red");
		}
		function make_y_axis() {
		        return d3.axisLeft(y)
		                .ticks(5);
		}
        var line = d3.line()
                .x(function (d) {
                    return x(d.letter);
                })
                .y(function (d) {
                    return y(d.frequency);
                })

        x.domain(data.map(function (d) {
            return d.letter;
        }));
        var tickVluesArr = getTickValues(x.domain());

        y.domain([0, d3.max(data, function (d) {
                return d.frequency;
            })]);
        
	if (options.gridx == true) {
	    var x_g = g.append("g")
	            .attr("class", "bs_linegrid")
	            .attr("transform", "translate(0," + height + ")")
	            // .attr("class","gridx").style("fill","red")
	            .call(make_x_axis()
	                    .tickSize(-height, 0, 0)
	            // .tickFormat("%Y")
	            )
	    x_g.selectAll("line")
	            .style("shape-rendering", "crispEdges")
	            .style("fill", "none").style("stroke", function () {
	                        if (options.gridcolor) {
	                                return options.gridcolor;
	                        } else {
	                                return default_grid_color;
	                        }
	                });
	 }
    if (options.gridy == true) {
            var y_g = g.append("g")
                    .attr("class", "bs_linegrid")
                    .call(make_y_axis()
                            .tickSize(-width, 0, 0)
                            .tickFormat("")
                    )
            y_g.selectAll("path").style("stroke", options.gridStroke_Y)
                    .style("shape-rendering", "crispEdges")
                    .style("fill", "none")
                    .style("opacity", 0)
            y_g.selectAll("line")
                    .style("shape-rendering", "crispEdges")
                    .style("fill", "none").style("stroke", function () {
                            if (options.gridcolor) {
                                    return options.gridcolor;
                            } else {
                                    return "#2e424b";
                            }
                    });
    }
	if (options.axisX) {
	    if (options.labelRotate != 0) {
	            var h = parseInt(height) + 20
	    } else {
	            h = height;
	    }
	    var x_g = g.append("g")
        .attr("class", "bs_axisX")
        .attr("transform", "translate(0," + h + ")")
        .call(d3.axisBottom(x).ticks(5));
        
	    x_g.selectAll('text').attr("transform", "rotate(" + options.labelRotate + ")").style("fill", "#778c96").style("font-family", "'Roboto Medium'").style("stroke", "none");
	    x_g.selectAll('text').text(function(d,i){
	    	return tickVluesArr[i];
	    })
	    x_g.selectAll('line').remove();
	}
	
	if (options.axisY) {
	        var y_g = g.append("g")
            .attr("class", "bs_axisY")
            .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(".0s")));
	        // .append("text")
	        // .attr("class", "axis-title")
	        // .attr("transform", "rotate(-90)")
	        // .attr("y", 6)
	        // .attr("dy", ".71em")
	        // .style("text-anchor", "end")
	        // .attr("fill", "#5D6971")
	        // .style("font-size","20px")
	        y_g.selectAll('text').style("fill", "#778c96").style("font-family", "'Roboto Medium'").style("stroke", "none");
	        y_g.selectAll('line').remove();
	}
	if (!options.showxYaxis) {
	    svg.selectAll('.domain').style('opacity', 0);
	}
//        g.append("g")
//                .attr("class", "axis axis--x")
//                .attr("transform", "translate(0," + height + ")")
//                .call(d3.axisBottom(x));
////
//        g.append("g")
//                .attr("class", "axis axis--y")
//                .call(d3.axisLeft(y).ticks(10, "%"))
//                .append("text")
//                .attr("transform", "rotate(-90)")
//                .attr("y", 6)
//                .attr("dy", "0.71em")
//                .attr("text-anchor", "end")
//                .text("Frequency");

        g.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("d", line)
                .style("stroke",options.color)
                .style("fill","none")
                .style("stroke-width","2px")
//        g.selectAll("circle")
//                .data(data)
//                .enter().append("circle")
//                .attr("class", "circle")
//                .attr("cx", function (d) {
//                    return x(d.letter);
//                })
//                .attr("cy", function (d) {
//                    return y(d.frequency);
//                })
//                .attr("r", 4)
//                .style("fill","#BE62AE")
                
         function getTickValues(values){
        	var finalVals =[];
        	$.each(values,function(i,d){
        		finalVals.push(d.slice(0,8)+"..");
        	});
        	return finalVals;
        }
    }