var div_radar = d3.select("body").append("div").attr("class", "treemap_tooltip").style("position", "absolute").style("z-index", 1000).style("background", "rgb(27, 39, 53)").style("padding", "5px 10px").style("border-radius", "10px").style("font-size", "10px").style("display", "none");

function treeMap(options) {
      $(options.container).empty();
        if (options)
        {
            options.container = options.container ? options.container : "body";
            options.width = options.width ? options.width : $(options.container).width();
            options.height = options.height ? options.height : 300;
            options.data = options.data ? options.data :'';
            options.headerHeight = options.headerHeight?options.headerHeight:20;
            options.isChildClass = options.isChildClass?options.isChildClass:false;
            options.headerColor = options.headerColor ? options.headerColor : "#555555";
            options.color = options.color ? d3_v3.scale.ordinal().range(options.color): d3_v3.scale.category10();
            options.transitionDuration = options.transitionDuration ? options.transitionDuration :500;
        }
    var xscale = d3_v3.scale.linear().range([0, options.width]);
    var yscale = d3_v3.scale.linear().range([0, options.height]);
    var root;
    var node;

    var treemap = d3_v3.layout.treemap()
            .round(false)
            .size([options.width, options.height])
            .sticky(true)
            .value(function (d) {
                return d.data.size;
            });

    var chart = d3_v3.select(options.container)
            .append("svg:svg")
            .attr("width", options.width)
            .attr("height", options.height)
            .append("svg:g")
            .attr("transform", "translate(.5,.5)");


        node = root = options.data;
        var nodes = treemap.nodes(root);

        var children = nodes.filter(function (d) {
            return !d.children;
        });
        var parents = nodes.filter(function (d) {
            return d.children;
        });

        // create parent cells
        var parentCells = chart.selectAll("g.cell.parent")
                .data(parents, function (d) {
                    return "p-" + d.name;
                });
        var parentEnterTransition = parentCells.enter()
                .append("g")
                .attr("class", "cell parent")
                .on("click", function (d) {
                    zoom(d);
                });
        parentEnterTransition.append("rect")
                .attr("width", function (d) {
                    return Math.max(0.01, d.dx);
                })
                .attr("height", options.headerHeight)
                .style("fill", options.headerColor);
        parentEnterTransition.append('foreignObject')
                .attr("class", "foreignObject")
                .append("xhtml:body")
                .attr("class", "labelbody")
                .append("div")
                .attr("class", "label");
        // update transition
        var parentUpdateTransition = parentCells.transition().duration(options.transitionDuration);
        parentUpdateTransition.select(".cell")
                .attr("transform", function (d) {
                    return "translate(" + d.dx + "," + d.y + ")";
                });
        parentUpdateTransition.select("rect")
                .attr("width", function (d) {
                    return Math.max(0.01, d.dx);
                })
                .attr("height",options.headerHeight)
                .style("fill", options.headerColor);
        parentUpdateTransition.select(".foreignObject")
                .attr("width", function (d) {
                    return Math.max(0.01, d.dx);
                })
                .attr("height", options.headerHeight)
                .select(".labelbody .label")
                .text(function (d) {
                    return d.name;
                });
        // remove transition
        parentCells.exit()
                .remove();

        // create children cells
        var childrenCells = chart.selectAll("g.cell.child")
                .data(children, function (d) {
                    return "c-" + d.name;
                });
        // enter transition
        var childEnterTransition = childrenCells.enter()
                .append("g")
                .attr("class", "cell child")
                .on("click", function (d) {
                	if(options.clickfunction){
                		 window.pushFilters (d.name, false, "attackType", 'notLocation', 'selectedAttackType', 'locationMultipleEnd');
                		 $(".treemap_tooltip").css("display", "none");
                	}
//                    zoom(node === d.parent ? root : d.parent);
                }).on("mouseover", function(d,i) {
        			
        			$(".treemap_tooltip").css("display", "block");
                	
                	$(".treemap_tooltip").html('<div><span class="text-gray-ta" style="text-transform: uppercase">'+d.name+'  </span> </div><div><span>'+'NUMBER OF INCIDENTS: ' +'</span><span>'+nFormatter(d.data.size,1) +'</span></div>');
                 

        		})
        		.on("mousemove",function(d){
        	           		var p = $(options.container)
        		           		var position = p.offset();
        		           		var windowWidth = window.innerWidth;
        		           		var tooltipWidth = $(".treemap_tooltip").width() + 50
        		           	    var cursor = d3_v3.event.x;
        		                if ((position.left < d3_v3.event.pageX) && (cursor > tooltipWidth)) {
        		           			var element = document.getElementsByClassName("treemap_tooltip");
        		           			for (var i = 0; i < element.length; i++) {
        		           				element[i].classList.remove("tooltip-left");
        		           				element[i].classList.add("tooltip-right");
        		           			}
        		           			$(".treemap_tooltip").css("left", (d3_v3.event.pageX - 30 - $(".treemap_tooltip").width()) + "px");
        		           		} else {
        		           			var element = document.getElementsByClassName("treemap_tooltip");
        		           			for (var i = 0; i < element.length; i++) {
        		           				element[i].classList.remove("tooltip-right");
        		           				element[i].classList.add("tooltip-left");
        		           			}
        		           			$(".treemap_tooltip").css("left", (d3_v3.event.pageX) +20 + "px");
        		           		}
        		           		return $(".treemap_tooltip").css("top", d3_v3.event.pageY-20+ "px")
        		            
        		               })
        		                .on("mouseout",function(d){
        		                	$(".treemap_tooltip").css("display", "none");
        		               });
        childEnterTransition.append("rect")
                .classed("background", true)
                .style("fill", function (d) {
                	if(options.isChildClass){
                		 return options.color(d.name);
                	}
                    return options.color(d.parent.name);
                });
        childEnterTransition.append('foreignObject')
                .attr("class", "foreignObject")
                .attr("width", function (d) {
                    return Math.max(0.01, d.dx);
                })
                .attr("height", function (d) {
                    return Math.max(0.01, d.dy);
                })
                .append("xhtml:body")
                .attr("class", "labelbody")
                .append("div")
                .style("color","#fff")
                .attr("class", "label")
                .text(function (d) {
                    return d.name;
                });
//        childEnterTransition.selectAll(".foreignObject .labelbody .label")
//                .style("display", "none");
//        if (isIE) {
//            childEnterTransition.selectAll(".foreignObject .labelbody .label")
//                .style("display", "none");
//        } else {
//            childEnterTransition.selectAll(".foreignObject")
//                .style("display", "none");
//        }

        // update transition
        var childUpdateTransition = childrenCells.transition().duration(options.transitionDuration);
        childUpdateTransition.select(".cell")
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });
        childUpdateTransition.select("rect")
                .attr("width", function (d) {
                    return Math.max(0.01, d.dx);
                })
                .attr("height", function (d) {
                    return d.dy;
                })
                .style("fill", function (d) {
                	if(options.isChildClass){
               		 return options.color(d.name);
               	}
                    return options.color(d.parent.name);
                });
        childUpdateTransition.select(".foreignObject")
                .attr("width", function (d) {
                    return Math.max(0.01, d.dx);
                })
                .attr("height", function (d) {
                    return Math.max(0.01, d.dy);
                })
                .select(".labelbody .label")
                .text(function (d) {
                    return d.name;
                });
        // exit transition
        childrenCells.exit()
                .remove();

        d3_v3.select("select").on("change", function () {
            treemap.value(this.value == "size" ? size : count)
                    .nodes(root);
            zoom(node);
        });

        zoom(node);
   


    function size(d) {
        return d.data.size;
    }


    function count(d) {
        return 1;
    }


    //and another one
    function textHeight(d) {
        var ky = options.height/ d.dy;
        yscale.domain([d.y, d.y + d.dy]);
        return (ky * d.dy) / options.headerHeight;
    }


    function getRGBComponents(color) {
        var r = color.substring(1, 3);
        var g = color.substring(3, 5);
        var b = color.substring(5, 7);
        return {
            R: parseInt(r, 16),
            G: parseInt(g, 16),
            B: parseInt(b, 16)
        };
    }


    function idealTextColor(bgColor) {
        var nThreshold = 105;
        var components = getRGBComponents(bgColor);
        var bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);
        return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";
    }


    function zoom(d) {
        treemap
                .padding([options.headerHeight / (options.height / d.dy), 0, 0, 0])
                .nodes(d);

        // moving the next two lines above treemap layout messes up padding of zoom result
        var kx = options.width / d.dx;
        var ky = options.height / d.dy;
        var level = d;

        xscale.domain([d.x, d.x + d.dx]);
        yscale.domain([d.y, d.y + d.dy]);

        if (node != level) {
//            if (isIE) {
//                chart.selectAll(".cell.child .foreignObject .labelbody .label")
//                    .style("display", "none");
//            } else {
//                chart.selectAll(".cell.child .foreignObject")
//                    .style("display", "none");
//            }
//            chart.selectAll(".cell.child .foreignObject .labelbody .label")
//                    .style("display", "none");
        }

        var zoomTransition = chart.selectAll("g.cell").transition().duration(options.transitionDuration)
                .attr("transform", function (d) {
                    return "translate(" + xscale(d.x) + "," + yscale(d.y) + ")";
                })
                .each("end", function (d, i) {
                    if (!i && (level !== root)) {
                        chart.selectAll(".cell.child")
                                .filter(function (d) {
                                    return d.parent === node; // only get the children for selected group
                                })
                                .select(".foreignObject .labelbody .label")
                                .style("color", function (d) {
                                	if(options.isChildClass){
                               		 return options.color(d.name);
                               	}
                                    return idealTextColor(options.color(d.parent.name));
                                });

//                    if (isIE) {
                        chart.selectAll(".cell.child")
                                .filter(function (d) {
                                    return d.parent === node; // only get the children for selected group
                                })
                                .select(".foreignObject .labelbody .label")
                                .style("display", "block")
//                    } else {
//                        chart.selectAll(".cell.child")
//                            .filter(function(d) {
//                                return d.parent === self.node; // only get the children for selected group
//                            })
//                            .select(".foreignObject")
//                            .style("display", "")
//                    }
                    }
                });

        zoomTransition.select(".foreignObject")
                .attr("width", function (d) {
                    return Math.max(0.01, kx * d.dx);
                })
                .attr("height", function (d) {
                    return d.children ? options.headerHeight : Math.max(0.01, ky * d.dy);
                })
                .select(".labelbody .label")
                .text(function (d) {
                    return d.name;
                });

        // update the width/height of the rects
        zoomTransition.select("rect")
                .attr("width", function (d) {
                    return Math.max(0.01, kx * d.dx);
                })
                .attr("height", function (d) {
                    return d.children ? options.headerHeight : Math.max(0.01, ky * d.dy);
                })
                .style("fill", function (d) {
                    return d.children ? options.headerColor : (options.isChildClass?options.color(d.name):options.color(d.parent.name));
                });

        node = d;

        if (d3_v3.event) {
            d3_v3.event.stopPropagation();
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