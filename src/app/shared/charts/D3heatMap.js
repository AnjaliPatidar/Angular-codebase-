import * as $ from 'jquery';
import * as d3 from 'd3';
var div_radar = d3.select("body").append("div").attr("class", "heatmap_tooltip").style("position", "absolute").style("z-index", 1000).style("background", "rgb(27, 39, 53)").style("padding", "5px 10px").style("border-radius", "10px").style("font-size", "10px").style("display", "none");
function HeatMap() {}
HeatMap.prototype.heatMap = function (options,callback) {

    $(options.container).empty();
        if (options)
        {
            options.container = options.container ? options.container : "body";
            options.width = options.width ? options.width : $(options.container).width();
            options.height = options.height ? options.height : 300;
            options.marginTop = options.marginTop ? options.marginTop : 30;
            options.marginBottom = options.marginBottom ? options.marginBottom : 30;
            options.marginRight = options.marginRight ? options.marginRight : 20;
            options.marginLeft = options.marginLeft ? options.marginLeft : 50;
            options.itemSize = options.itemSize ? options.itemSize : 22;
            options.show_YAxis = options.show_YAxis ? options.show_YAxis : true;
            options.show_YAxisText = options.show_YAxisText ? options.show_YAxisText : true;
            options.rotate_YAxisText = options.rotate_YAxisText ? options.rotate_YAxisText : false;
            options.show_YAxisPath = options.show_YAxisPath ? options.show_YAxisPath : false;
            options.show_YAxisTicks = options.show_YAxisTicks ? options.show_YAxisTicks : false;
            options.rotate_YAxisTicks = options.rotate_YAxisTicks ? options.rotate_YAxisTicks : true;
            options.fontSize_YAxis = options.fontSize_YAxis ? options.fontSize_YAxis : 10;
            options.fontFamily_YAxis = options.fontFamily_YAxis ? options.fontFamily_YAxis : "sans-serif";
            options.show_XAxis = options.show_XAxis ? options.show_XAxis : true;
            options.show_XAxisText = options.show_XAxisText ? options.show_XAxisText : true;
            options.rotate_XAxisText = options.rotate_XAxisText ? options.rotate_XAxisText : true;
            options.show_XAxisPath = options.show_XAxisPath ? options.show_XAxisPath : false;
            options.show_XAxisTicks = options.show_XAxisTicks ? options.show_XAxisTicks : false;
            options.rotate_XAxisTicks = options.rotate_XAxisTicks ? options.rotate_XAxisTicks : true;
            options.fontSize_XAxis = options.fontSize_XAxis ? options.fontSize_XAxis : 10;
            options.fontFamily_XAxis = options.fontFamily_XAxis ? options.fontFamily_XAxis : "sans-serif";
            options.gridx = options.gridx ? options.gridx : false;
			options.gridy = options.gridy ? options.gridy : false;
			options.data= options.data? options.data:[];
			options.icons = options.icons ? options.icons : [],
			options.chartName = options.chartName ? options.chartName : null
		}
        var margin = {top: options.marginTop, right: options.marginRight, bottom: options.marginBottom, left: options.marginLeft}
        var width = options.width - margin.right - margin.left,
                height = options.height - margin.top - margin.bottom;

        var formatDate = d3.timeFormat("%Y-%m-%d");
        var arr = ["#2980B9", "#E67E22", "#27AE60"];

			var data1 = options.data
			var itemSize = data1.length,
                    cellSize = width
            var data = data1.map(function (item) {
                var newItem = {};
                newItem.country = item.country;
                newItem.product = item.product;
				newItem.value = item.value;
				if(options.chartName && options.chartName === "agingChart"){
					newItem.statusCode = item.statusCode;
				}
                return newItem;
            });
             var x_elements = d3.set(data.map(function (item) {
	                return item.product;
	            })).values(),
	                    y_elements = d3.set(data.map(function (item) {
	                        return item.country;
	                    })).values();
             var cellSizeWidth = (width)/x_elements.length;
	            var cellSizeHeight = (height)/y_elements.length;
            var expenseMetrics = d3.nest()
                    .key(function (d) {
                        return d.country;
                    })
                    .rollup(function (v) {
                        return {
                            total: d3.extent(v, function (d) {
                                return d.value;
                            }),

                        };
                    })
                    .entries(data);
            for (var i in data) {
                for (var j in expenseMetrics) {
                    if (data[i].country == expenseMetrics[j].key) {
                        data[i].extent = expenseMetrics[j] && expenseMetrics[j].value && expenseMetrics[j].value.total ? expenseMetrics[j].value.total : 0
                    }
                }
            }
            var x_elements = d3.set(data.map(function (item) {
                return item.product;
            })).values(),
               y_elements = d3.set(data.map(function (item) {
                 return item.country;
                })).values();
            var cellwidth = (width) / x_elements.length;
            var cellheight = (height) / y_elements.length;
            var xScale = d3.scaleBand()
                    .domain(x_elements)
					.range([0, x_elements.length * cellwidth]);

            var xAxis =d3.axisBottom()
                    .scale(xScale)
                    .tickFormat(function (d) {
                        return d;
                    })
//                    .orient("top");

            var yScale = d3.scaleBand()
                    .domain(y_elements)
                    .range([0, y_elements.length * cellheight]);

            var yAxis = d3.axisLeft()
                    .scale(yScale)
                    .tickFormat(function (d) {
                        return d;
                    })
//                    .orient("left");

            var colorArr = ["#7f7f81", "#e8de65", "#8623b4", "#faad5b", "#fb5a5d", "#47bb7e"]
               var colorScale = d3.scaleOrdinal()
	            		.domain([1, 8])
	                    .range(colorArr);
// Draw SVG
	            var svg = d3.select(options.container)
	                    .append("svg")
	                    .attr("width", width + margin.left + margin.right)
	                    .attr("height", height + margin.top + margin.bottom)
	                    .append("g")
	                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	// Draw RECT blocks
	            var cells = svg.selectAll('rect')
	                    .data(data)
	                    .enter().append('g').append('rect')
						.attr('class', 'cell')
	                    .attr('width', cellSizeWidth-1)
						.attr('height', cellSizeHeight-1)
	                    .style("cursor", "pointer")
	                    .attr('y', function (d) {
	                        return yScale(d.country);
	                    })
	                    .attr('x', function (d) {
	                        return xScale(d.product);
	                    })
	                    .attr('fill', function (d) {
	                    	return colorScale(d.country);
						})
//                             .attr('opacity', function (d) {
//	                    	if(d.extent[0] == d.extent[1]){
//	                    		 return d.extent[0];
//	                    	}else{
//		                        var expScale = d3.scaleLinear().domain(d.extent).range([0.1,1]);
//		                        return expScale(d.value);
//	                    	}
//	                    })
                                   .on("click", function (d) {
									   if(options.container != '#heatMapChart'){
										   window.pushFilters (d.country, false, "attackType", 'notLocation', 'selectedAttackType');
										    setTimeout(function(){
											$(".heatmap_tooltip").css("display", "none");
											window.pushFilters (d.key, false, 'industry', d.product, 'industryMultiple', 'locationMultipleEnd');
										}, 100);
									   }

						})
						.on('click',function(d){
							if(options.chartName && options.chartName === "agingChart"){
								callback.callFilterFromAgingChart(d);
							}else{
								handleToolTip(d)
							}
						})
						.on('mouseover',function(d){
							handleToolTip(d)
						})
						// .on("mousemove",function(d){
						// 	var p = $(options.container)
						// 		var position = p.offset();
						// 		var windowWidth = window.innerWidth;
						// 		var tooltipWidth = $(".heatmap_tooltip").width() + 50
						// 		var cursor = d3.event.x;
						// 	 if ((position.left < d3.event.pageX) && (cursor > tooltipWidth)) {
						// 			var element = document.getElementsByClassName("heatmap_tooltip");
						// 			for (var i = 0; i < element.length; i++) {
						// 				element[i].classList.remove("tooltip-left");
						// 				element[i].classList.add("tooltip-right");
						// 			}
						// 			$(".heatmap_tooltip").css("left", (d3.event.pageX - 30 - $(".heatmap_tooltip").width()) + "px");
						// 		} else {
						// 			var element = document.getElementsByClassName("heatmap_tooltip");
						// 			for (var i = 0; i < element.length; i++) {
						// 				element[i].classList.remove("tooltip-right");
						// 				element[i].classList.add("tooltip-left");
						// 			}
						// 			$(".heatmap_tooltip").css("left", (d3.event.pageX) +20 + "px");
						// 		}
						// 		return $(".heatmap_tooltip").css("top", d3.event.pageY-20+ "px")

						 	// })
						 	 .on("mouseout",function(d){
						 		 $(".heatmap_tooltip").css("display", "none");
						 	})
	//adding text
				var text = svg.selectAll()
						   .data(data)
						   .enter()
						   .append('g')
						   .append('text')
						   .text((d)=>d.value)
						   .attr('x',d=>{
							return options.chartName ? xScale(d.product)+(cellSizeWidth/3) : xScale(d.product)+(cellSizeWidth/2);
							})
						   .attr('y',d=>{
							 return yScale(d.country)+(cellSizeHeight/2);
						   })
						  .style("fill", "#000")
						  .style("font-weight", "bold")
              .attr("class", "chart-block-text");

	// Draw y axis
	            var y_g = svg.append("g")
	                    .attr("class", "y axis")
	                    .style("display", function () {
	                        return options.show_YAxis ? 'block' : 'none';
	                    })
	                    .call(yAxis);

	//  Y Axis path
	            y_g.selectAll("path")
	                    .attr("class", "y axispath")
	                    .style("stroke", "#ccc")
	                    .style("shape-rendering", "crispEdges")
	                    .style("fill", "none")
	                    .style("display", function () {
	                        return options.show_YAxisPath ? 'block' : 'none';
	                    });
	//  Y Axis Text
	            y_g.selectAll('text')
	                    .attr('font-weight', 'normal')
	                    .style("font-size", options.fontSize_YAxis + "px")
	                    .style("font-family", options.fontFamily_YAxis)
	                    .style("display", function () {
	                        return options.show_YAxisText ? 'block' : 'none';
	                    })
	                    .style("fill", "#6c7e88")
	                    .attr("transform", function () {
	                        return options.rotate_YAxisText ? 'rotate(-120)' : 'rotate(0)';
	                    });
	//  Y Axis Ticks
	            y_g.selectAll("line")
	                    .attr("class", "y axisline")
	                    .style("stroke", "#ccc")
	                    .style("shape-rendering", "crispEdges")
	                    .style("fill", "none")
	                    .style("display", function () {
	                        return options.show_YAxisTicks ? 'block' : 'none';
	                    })
	                    .attr("transform", function () {
	                        return options.rotate_YAxisTicks ? 'rotate(-60)' : 'rotate(0)';
	                    });
	// Draw x axis
	            var x_g = svg.append("g")
	                    .attr("class", "x axis")
	                    .style("display", function () {
	                        return options.show_XAxis ? 'block' : 'none';
	                    })
	                    .call(xAxis);
	   //  X Axis path
	            x_g.selectAll("path")
	                    .attr("class", "y axispath")
	                    .style("stroke", "#ccc")
	                    .style("shape-rendering", "crispEdges")
	                    .style("fill", "none")
	                    .style("display", function () {
	                        return options.show_XAxisPath ? 'block' : 'none';
	                    });

	//  X Axis Text
	            x_g.selectAll('text')
	                    .attr('font-weight', 'normal')
	                    .style("font-size", options.fontSize_XAxis + "px")
	                    .style("font-family", options.fontFamily_XAxis)
	                    .style("text-anchor", "start")
	                    .attr("dx", ".8em")
	                    .attr("dy", "-.5em")
	                    .style("fill", "#6c7e88")
						.attr("transform", function () {
	                        return options.rotate_XAxisText? (options.rotate_XAxisTextValue? options.rotate_XAxisTextValue: 'rotate(-90)'): 'rotate(0)';
	                    });

	//  X Axis Ticks
	            x_g.selectAll("line")
	                    .attr("class", "x axisline")
	                    .style("stroke", "#ccc")
	                    .style("shape-rendering", "crispEdges")
	                    .style("fill", "none")
	                    .style("display", function () {
	                        return options.show_XAxisTicks ? 'block' : 'none';
	                    })
	                    .attr("transform", function () {
	                        return options.rotate_XAxisTicks ? 'rotate(-60)' : 'rotate(0)';
	                    });
	// x Axis icons
				if(options.icons.length > 0) {
					d3.selectAll('.x .tick text').attr('visibility','hidden')
					d3.selectAll('.x .tick').each(function (d,i) {
						d3.select(this).append('svg:foreignObject')
						.attr("width", 20)
						.attr("height", 20)
						.attr('y',-21)
						.attr('x',-5)
						.html('<i class="fa fa-' + options.icons[i].icon + '" style="font-size:18px;color:' + options.icons[i].color + ' " ></i>')
					})
				}
}

function handleToolTip(d){
	$(".heatmap_tooltip").css("display", "block");

	$(".heatmap_tooltip").html('<div><span class="text-gray-ta" style="text-transform: uppercase">'+d.country+'  </span> </div><div><span style="text-transform: uppercase">'+d.product+' : '+'</span><span> &nbsp'+d.value +'</span></div>');
	$(".heatmap_tooltip").css("width","230px");
	if($(".heatmap_tooltip").width() + 20 + d3.event.pageX > window.innerWidth ){ //handling tooltip going  out of window
		$(".heatmap_tooltip").css("left", (d3.event.pageX) - (1.25 * $(".heatmap_tooltip").width() )+ "px");
		$(".heatmap_tooltip").css("top", d3.event.pageY-20+ "px")
	}else{
		$(".heatmap_tooltip").css("left", (d3.event.pageX) +20 + "px");
		$(".heatmap_tooltip").css("top", d3.event.pageY-20+ "px")
	}

}
var heatMapChartModule = new HeatMap();
export {
    heatMapChartModule
};
