import * as $ from 'jquery';
// require(d3);
var d3 = require("d3");
// 'use strict';
//---------------------------------------------------------------------------------------------
/**
 *
 *Function to load chart
 *@param  Object options
 */
var fo;
function snackRiskScore() {}

snackRiskScore.prototype.sankey_chart_risk_score  = function(options) {
	var tool_tip = $('body').append('<div class="Bubble_Chart_tooltip" style="position: absolute;z-index: 99999;opacity: 1; pointer-events: none; display:none;text-transform:uppercase;background-color:#0cae96;  padding: 10px;border-radius: 5px; border: 1px solid gray;font-size: 10px;color:black;"><span style=" font-size: 12px; position: absolute; white-space: nowrap;  margin-left: 0px; margin-top: 0px; left: 8px; top: 8px;"><span style="font-size:10px" class="tool_tip_x_val"></span><table><tbody><tr><td style="padding:0"> </td><td style="padding:0"><b>216.4 mm</b></td></tr><tr><td style="color:#434348;padding:0">New York: </td><td style="padding:0"><b>91.2 mm</b></td></tr><tr><td style="color:#90ed7d;padding:0">London: </td><td style="padding:0"><b>52.4 mm</b></td></tr><tr><td style="color:#f7a35c;padding:0">Berlin: </td><td style="padding:0"><b>47.6 mm</b></td></tr></tbody></table></span></div>');

    //empty the container before appending the chart
    if (options.container) {
        $(options.container).empty();
    }
    //--------------------------Initialize Values-----------------------------
    if (options) {
        options.container = options.container ? options.container : "body";
        options.data = (options.data) ? options.data : [];
        options.edge_labels = options.edge_labels ? options.edge_labels : [];

        options.randomIdString = Math.floor(Math.random() * 10000000000);
        options.height = options.height ? options.height : 600;
        options.rectColor = options.rectColor ? options.rectColor : "transparent";
        options.margin = options.margin ? {
            top: options.margin.top ? options.margin.top : 20,
            right: options.margin.right ? options.margin.right : 20,
            bottom: options.margin.bottom ? options.margin.bottom : 30,
            left: options.margin.left ? options.margin.left : 60
        } : {
                top: 20,
                right: 20,
                bottom: 50,
                left: 60
            };
        options.translateX = (options.translateX !== undefined) ? options.translateX : '100';
        options.translateY = (options.translateY !== undefined) ? options.translateY : '100';
    }
    var actualOptions = jQuery.extend(true, {}, options);
    var randomSubstring = Math.floor(Math.random() * 10000000000);
    //define width from the parent width
    options.width = options.width ? options.width : $(options.container).width() - 20;
    //define rect wisth based on chart width and number of nodes
    // options.rectWidth = options.rectWidth ? options.rectWidth : ((options.width) / (options.data.nodes.length + 2))
    options.rectWidth = options.rectWidth ? options.rectWidth : ((options.width) / (options.data.nodes.length * 3))

    //const data

    var dataSource = [];
    var uniqSource = [];


    //define margins and dynamic width/height
    var margin = {
        top: options.margin.top ? options.margin.top : 20,
        right: options.margin.right ? options.margin.right : 20,
        bottom: options.margin.bottom ? options.margin.bottom : 20,
        left: options.margin.left ? options.margin.left : 20
    };
    _.forEach(options.data.links, function (v, k) {

        dataSource[k] = v.source;
        if (dataSource[k] != dataSource[k - 1]) {
            uniqSource[k] = dataSource[k];
        }
    });
    var width = options.width;
    var height = options.height;

    //const data
    var MIN_RECT_WIDTH = 150;
    var MIN_RECT_HEIGHT = 100;
    var isnegativeValue;
    var isZeroValue;
    var imageY =25;
    if (width > $(options.container).width()) {
        if(!options.isReport){
           width = $(options.container).width();
        }
    }
    width = width - (margin.left + margin.right);
    width = width - MIN_RECT_WIDTH;
    height = height - MIN_RECT_HEIGHT;
    var bankTxtY=80;
    if(options.edge_labels.length <= 3){
    	MIN_RECT_WIDTH = 400;
        width = MIN_RECT_WIDTH;
        height = MIN_RECT_HEIGHT;
    }
    if(options.edge_labels.length <= 4){
    	 bankTxtY =100;
        imageY = 50;
    }
    options.img_x_pos = options.img_x_pos ? options.img_x_pos : -60;
    options.text_x_pos = options.text_x_pos ? options.text_x_pos : 0;

    var _this = options;


    //define color scales
    var color = d3.scaleOrdinal().domain(options.edge_labels).range([
        '#368FCE', '#8C3F8E', '#F48D27', '#95AF0D', '#4C475F'
    ]);
    var sankeyChartId = options.container;

    // var randomSubstring = options.r
    //define sankey
    d3.sankey = function () {
        var sankey = {},
            nodeWidth = 164,
            nodePadding = 8,
            size = [width, height],
            nodes = [],
            links = [];
        //define sankey node width
        sankey.nodeWidth = function (_) {
            if (!arguments.length) return nodeWidth;
            nodeWidth = +_;
            return sankey;
        };
        //define sankey node padding
        sankey.nodePadding = function (_) {
            if (!arguments.length) return nodePadding;
            nodePadding = +_;
            return sankey;
        };
        //define sankey nodes
        sankey.nodes = function (_) {
            if (!arguments.length) return nodes;
            nodes = _;
            return sankey;
        };
        //define sankey links
        sankey.links = function (_) {
            if (!arguments.length) return links;
            links = _;
            return sankey;
        };
        //define sankey size
        sankey.size = function (_) {
            if (!arguments.length) return size;
            size = _;
            return sankey;
        };
        //define sankey layout
        sankey.layout = function (iterations) {
            computeNodeLinks();
            computeNodeValues();
            computeNodeBreadths();
            computeNodeDepths(iterations);
            computeLinkDepths();
            return sankey;
        };
        //define sankey re-layout
        sankey.relayout = function () {
            computeLinkDepths();
            return sankey;
        };
        //Function to compute path for links
        sankey.link = function () {
            var curvature = .5;

            function link(d) {
                var x0 = d.source.x + d.source.dx,
                    x1 = d.target.x,
                    xi = d3.interpolateNumber(x0, x1),
                    x2 = xi(curvature),
                    x3 = xi(1 - curvature),
                    y0 = d.source.y + d.sy + d.dy / 2,
                    y1 = d.target.y + d.ty + d.dy / 2;
                return "M" + -10 + "," + -10 +
                    "M" + x0 + "," + y0 +
                    "C" + x2 + "," + y0 +
                    " " + x3 + "," + y1 +
                    " " + x1 + "," + y1;
            }

            link.curvature = function (_) {
                if (!arguments.length) return curvature;
                curvature = +_;
                return link;
            };

            return link;
        };

        // Populate the sourceLinks and targetLinks for each node.
        // Also, if the source and target are not objects, assume they are indices.
        function computeNodeLinks() {
            nodes.forEach(function (node) {
                node.sourceLinks = [];
                node.targetLinks = [];
            });
            links.forEach(function (link) {
                var source = link.source,
                    target = link.target;
                if (typeof source === "number" || typeof source === "string") source = link.source = nodes[link.source]; //Object.assign({}, nodes.filter(function(d,i){ return d.id == link.source})[0])  ;
                if (typeof target === "number" || typeof target === "string") target = link.target = nodes[link.target]; //Object.assign({}, nodes.filter(function(d,i){ return d.id == link.target})[0])  ;//
                source.sourceLinks.push(link);
                target.targetLinks.push(link);
            });
        }

        // Compute the value (size) of each node by summing the associated links.
        function computeNodeValues() {
            nodes.forEach(function (node) {
                node.value = Math.max(
                    d3.sum(node.sourceLinks, value),
                    d3.sum(node.targetLinks, value)
                );
            });
        }

        // Iteratively assign the breadth (x-position) for each node.
        // Nodes are assigned the maximum breadth of incoming neighbors plus one;
        // nodes with no incoming links are assigned breadth zero, while
        // nodes with no outgoing links are assigned the maximum breadth.
        function computeNodeBreadths() {
            var remainingNodes = nodes,
                nextNodes,
                x = 0;

            while (remainingNodes.length) {
                nextNodes = [];
                remainingNodes.forEach(function (node) {
                    node.x = x;
                    node.dx = nodeWidth;
                    node.sourceLinks.forEach(function (link) {
                        nextNodes.push(link.target);
                    });
                });
                remainingNodes = nextNodes;
                ++x;
            }

            //
            moveSinksRight(x);
            scaleNodeBreadths((width - nodeWidth) / (x - 1));
        }

        function moveSourcesRight() {
            nodes.forEach(function (node) {
                if (!node.targetLinks.length) {
                    node.x = d3.min(node.sourceLinks, function (d) {
                        return d.target.x;
                    }) - 1;
                }
            });
        }

        function moveSinksRight(x) {
            nodes.forEach(function (node) {
                if (!node.sourceLinks.length) {
                    node.x = x - 1;
                }
            });
        }

        function scaleNodeBreadths(kx) {
            nodes.forEach(function (node) {
                node.x *= kx;
            });
        }

        function computeNodeDepths(iterations) {
            var nodesByBreadth = d3.nest()
                .key(function (d) {
                    return d.x;
                })
                .sortKeys(d3.ascending)
                .entries(nodes)
                .map(function (d) {
                    return d.values;
                });

            //
            initializeNodeDepth();
            resolveCollisions();
            for (var alpha = 1; iterations > 0; --iterations) {
                relaxRightToLeft(alpha *= .99);
                resolveCollisions();
                relaxLeftToRight(alpha);
                resolveCollisions();
            }

            function initializeNodeDepth() {
                var ky = d3.min(nodesByBreadth, function (nodes) {
                    return (size[1] - (nodes.length - 1) * nodePadding) / d3.sum(nodes, value);
                });

                nodesByBreadth.forEach(function (nodes) {
                    nodes.forEach(function (node, i) {
                        node.y = i;
                        node.dy = node.value * ky;
                    });
                });

                links.forEach(function (link) {
                    link.dy = link.value * ky;
                });
            }

            function relaxLeftToRight(alpha) {
                nodesByBreadth.forEach(function (nodes, breadth) {
                    nodes.forEach(function (node) {
                        if (node.targetLinks.length) {
                            var y = d3.sum(node.targetLinks, weightedSource) / d3.sum(node.targetLinks, value);
                            node.y += (y - center(node)) * alpha;
                        }
                    });
                });

                function weightedSource(link) {
                    return center(link.source) * link.value;
                }
            }

            function relaxRightToLeft(alpha) {
                nodesByBreadth.slice().reverse().forEach(function (nodes) {
                    nodes.forEach(function (node) {
                        if (node.sourceLinks.length) {
                            var y = d3.sum(node.sourceLinks, weightedTarget) / d3.sum(node.sourceLinks, value);
                            node.y += (y - center(node)) * alpha;
                        }
                    });
                });

                function weightedTarget(link) {
                    return center(link.target) * link.value;
                }
            }

            function resolveCollisions() {
                nodesByBreadth.forEach(function (nodes) {
                    var node,
                        dy,
                        y0 = 0,
                        n = nodes.length,
                        i;

                    // Push any overlapping nodes down.
                    nodes.sort(ascendingDepth);
                    for (i = 0; i < n; ++i) {
                        node = nodes[i];
                        dy = y0 - node.y;
                        if (dy > 0) node.y += dy;
                        y0 = node.y + node.dy + nodePadding;
                    }

                    // If the bottommost node goes outside the bounds, push it back up.
                    dy = y0 - nodePadding - size[1];
                    if (dy > 0) {
                        y0 = node.y -= dy;

                        // Push any overlapping nodes back up.
                        for (i = n - 2; i >= 0; --i) {
                            node = nodes[i];
                            dy = node.y + node.dy + nodePadding - y0;
                            if (dy > 0) node.y -= dy;
                            y0 = node.y;
                        }
                    }
                });
            }

            function ascendingDepth(a, b) {
                return a.y - b.y;
            }
        }

        function computeLinkDepths() {
            nodes.forEach(function (node) {
                node.sourceLinks.sort(ascendingTargetDepth);
                node.targetLinks.sort(ascendingSourceDepth);
            });
            nodes.forEach(function (node) {
                var sy = 0,
                    ty = 0;
                node.sourceLinks.forEach(function (link) {
                    link.sy = sy;
                    sy += link.dy;
                });
                node.targetLinks.forEach(function (link) {
                    link.ty = ty;
                    ty += link.dy;
                });
            });

            function ascendingSourceDepth(a, b) {
                return a.source.y - b.source.y;
            }

            function ascendingTargetDepth(a, b) {
                return a.target.y - b.target.y;
            }
        }

        function center(node) {
            return node.y + node.dy / 2;
        }

        function value(link) {
            return link.value;
        }
        return sankey;
    };


    // append the svg  to the page
    var svg = d3.select(options.container).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr('class', 'mainSvg')
        .append('g')
    // .attr("transform",
    //       "translate(" + margin.left + "," + margin.top + ")");

    d3.select('.mainSvg').select('g').attr('transform', 'translate('+options.translateX + ','+ options.translateY+')')

    // set the sankey diagram properties
    var sankey = d3.sankey()
        .nodeWidth(36)
        // .nodeWidth(options.rectWidth ? options.rectWidth : 20)
        .nodePadding(100)
        .size([width, height]);

    var path = sankey.link();

    // append a defs (for definition) element to your SVG
    var defs = svg.append('defs');

    //call function to load the chart
    loadsank(options.data);

    // load the data
    function loadsank(graph) {
        sankey
            .nodes(graph.nodes)
            .links(graph.links)
            .layout(32); // any value > 13 breaks the link gradient

        // add in the links
        var link = svg.append('g').selectAll('.link')
            .data(graph.links)
            .enter().append('path')
            .attr('class', 'link')
            .attr('d', path)
            .attr("stroke", '#4294D9')
            .style('stroke-width', function (d) {
                return Math.max(1, d.dy);
            })
            .style('fill', 'none')
            .style('stroke-opacity', 0.2)
            .sort((a, b) => b.dy - a.dy)
        var clickedEleId;

        // add in the nodes
        var node = svg.append('g').selectAll('.node')
            .data(graph.nodes)
            .enter().append('g')
            .attr('class', 'node').style("cursor", "pointer")
            .attr('transform', function (d,i) {
                if(i == 0){
                    return 'translate('+(d.x + 30)+' ,'+d.y+')';
                } else {
                	 return 'translate('+d.x +' ,'+d.y+')';

                }
            })


        // add the rectangles for the nodes
        var node_width = MIN_RECT_WIDTH;
        node.append('rect')
            .attr('height', function (d) {
                if (d.dy < 0) {
                    if (!isnegativeValue) {
                        isnegativeValue = d.dy;
                    }
                    if (isnegativeValue > d.dy) {
                        isnegativeValue = d.dy;
                    }
                    return 0;
                } else if (d.dy == 0) {
                    if (!isZeroValue) {
                        isZeroValue = 50
                    }
                    if (isZeroValue > d.dy) {
                        isZeroValue = 50
                    }
                    return 0;
                } else {
                    return d.dy;
                }
            })
            .attr('width', sankey.nodeWidth())
            .style('fill', function (d) {
                return options.rectColor;
            });

            link.on("mouseover", function (d) {
                    $(this).css("opacity", 1);
                    	$(".Bubble_Chart_tooltip").html(d.txt.split('_').join(' '));
                    $(".Bubble_Chart_tooltip").css("visibility", "visible");
                    return $(".Bubble_Chart_tooltip").css("display", "block");
                })
               .on("mousemove", function () {
                	var p=$(options.container)
                	var position=p.offset();
                	var windowWidth=window.innerWidth;
                	var tooltipWidth=$(".Bubble_Chart_tooltip").width()+50
                	var cursor=d3.event.x;
                 	if((position.left<d3.event.pageX)&&(cursor>tooltipWidth)){
                		var element = document.getElementsByClassName("Bubble_Chart_tooltip");
                		element[0].classList.remove("tooltip-left");
            			element[0].classList.add("tooltip-right");
	               		$(".Bubble_Chart_tooltip").css("left",(d3.event.pageX - 15-$(".Bubble_Chart_tooltip").width()) + "px");
	             	}else{
                		var element =document.getElementsByClassName("Bubble_Chart_tooltip");
                   		element[0].classList.remove("tooltip-right");
               		    element[0].classList.add("tooltip-left");
               		    $(".Bubble_Chart_tooltip").css("left", (d3.event.pageX + 10) + "px");

                	}
                    return $(".Bubble_Chart_tooltip").css("top",d3.event.pageY + "px")


                  //   $(".Bubble_Chart_tooltip").css("top", (d3.event.pageY - 10) + "px")
                    //return  $(".Bubble_Chart_tooltip").css("left", (d3.event.pageX + 10) + "px");
                })
                .on("mouseout", function () {
                    //hide tool-tip
                    $(".Bubble_Chart_tooltip").css("visibility", "hidden");
                    return $(".Bubble_Chart_tooltip").css("display", "none");
                });

            node.on("mouseover", function (d) {
                    $(this).css("opacity", 1);
                    if( $(this).attr("id") && $(this).attr("id")=='firstnode'){
                    	return $(".Bubble_Chart_tooltip").css("display", "none");
                    }
                    if(d.name !=""){
                    	$(".Bubble_Chart_tooltip").html('<span style = "color:"#FFFFFF">' + d.name +' : '+(d.value*100).toFixed(2)+'%</span> ');
                        $(".Bubble_Chart_tooltip").css("visibility", "visible");
                        return $(".Bubble_Chart_tooltip").css("display", "block");
                    }

                })
               .on("mousemove", function () {
                	var p=$(options.container)
                	var position=p.offset();
                	var windowWidth=window.innerWidth;
                	var tooltipWidth=$(".Bubble_Chart_tooltip").width()+50
                	var cursor=d3.event.x;
                 	if((position.left<d3.event.pageX)&&(cursor>tooltipWidth)){
                		var element = document.getElementsByClassName("Bubble_Chart_tooltip");
                		element[0].classList.remove("tooltip-left");
            			element[0].classList.add("tooltip-right");
	               		$(".Bubble_Chart_tooltip").css("left",(d3.event.pageX - 15-$(".Bubble_Chart_tooltip").width()) + "px");
	             	}else{
                		var element =document.getElementsByClassName("Bubble_Chart_tooltip");
                   		element[0].classList.remove("tooltip-right");
               		    element[0].classList.add("tooltip-left");
               		    $(".Bubble_Chart_tooltip").css("left", (d3.event.pageX + 10) + "px");

                	}
                    return $(".Bubble_Chart_tooltip").css("top",d3.event.pageY + "px")


                  //   $(".Bubble_Chart_tooltip").css("top", (d3.event.pageY - 10) + "px")
                    //return  $(".Bubble_Chart_tooltip").css("left", (d3.event.pageX + 10) + "px");
                })
                .on("mouseout", function () {
                    //hide tool-tip
                    $(".Bubble_Chart_tooltip").css("visibility", "hidden");
                    return $(".Bubble_Chart_tooltip").css("display", "none");
                });

        $('svg')[0].width.baseVal.value = ($('svg')[0].width.baseVal.value) + MIN_RECT_WIDTH;
        $('svg')[0].height.baseVal.value = ($('svg')[0].height.baseVal.value) + MIN_RECT_HEIGHT;


        if (isnegativeValue) {
            setTimeout(function () {
            	   actualOptions.height = parseFloat(actualOptions.height) + parseFloat(Math.abs(isnegativeValue));
                   if (parseFloat(Math.abs(isnegativeValue)) < 0) {
                       actualOptions.width = parseFloat(actualOptions.width) - parseFloat(Math.abs(isnegativeValue));
                   } else {
                       actualOptions.width = parseFloat(actualOptions.width) + parseFloat(Math.abs(isnegativeValue));
                   }
                var sankey = sankey_chart_risk_score(actualOptions)

                window.loadRiskpieChart(true,actualOptions);
//                var wd = parseInt(d3.select('.mainSvg').attr('width'));
//                d3.select('.mainSvg').attr('width', (parseInt(d3.select('.sankPie').attr('width')) * 2) + wd);
            }, 1000)
        }
        if (isZeroValue) {
            setTimeout(function () {

                actualOptions.height = parseFloat(actualOptions.height) + isZeroValue;
                actualOptions.width = parseFloat(actualOptions.width) - isZeroValue;
                var sankey = sankey_chart_risk_score(actualOptions)
				setTimeout(function(){
					 window.loadRiskpieChart(true,actualOptions);
				},100)

//                var wd = parseInt(d3.select('.mainSvg').attr('width'));
//                d3.select('.mainSvg').attr('width', (parseInt(d3.select('.sankPie').attr('width')) * 2) + wd);
            }, 1000)
        }

        fo = node.append("foreignObject").attr("class", "foreign div")
            .attr("x", 0)
            .attr("y", function (d) {
                return 0
            })
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        $(options.container).find('.node').each(function (i, d) {
            if (i==1) {
                $(this).find('foreignObject').attr('id', 'finalDiv')
                    .attr('x', '-10')
                    .attr('y', '-10')
                    .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');
                $(this).find('rect').attr('class', 'lastRect');
                $(this).find('rect').attr('width', 5);
                $(this).find('text').remove();
            } else {
            	   if (i != 0) {
                       $(this).find('rect').attr('class', 'rect-mid');
                   } else {
                       $(this).find('text').remove();
                       $(this).find('rect').attr('class', 'firstRect');
                       $(this).find('rect').attr('width', 5);
                       $(this).attr('id', 'firstnode')
                   }
                   $(this).find('foreignObject').remove();
            }
        })
//$('.rect-mid').attr('height') ? $('.rect-mid').attr('height') /9 :
        // // add in the title for the nodes
        node.append('text')
            .attr('x',sankey.nodeWidth() / 5)
            .attr('y',-10)
            .attr('dy', '.35em')
            .attr('text-anchor', 'middle')
            .attr('transform', null)
            .style('text-transform', 'capitalize')
            .text(d =>{
               var riskname =  d.name;
                if(d.name && d.id !== 0) {
                    riskname = riskname + " (" +((d.value*100).toFixed(2)+'%)');
                }
                return riskname;
            })
            .attr("stroke",'none')
             .attr("fill",'#9B9FA2')
            .filter(d => d.x < width / 2)
            .attr('x', sankey.nodeWidth() / 3)
            .attr('text-anchor', 'middle')
            .style("fill", "#9B9FA2").style("stroke", "none").style("font-weight", "bolder");

        if(!options.isReport){
            $('.node').each(function (i, d) {
                if ($('.node').length - 1 == i) {
                	$(this).find('text').remove();
                }
            });
        }
        var ht = $('.lastRect').attr('height')


        var pathImg;
        if(options.isfromOtherModules){
      	  pathImg ="../assets/images/Building1.webp";
        }else{
      	  pathImg ="assets/images/Building1.webp";
        }
       if(options.isReport){
           pathImg = options.companyLogo ? options.companyLogo : pathImg;
       }

        d3.select('#firstnode').append("svg:image")
        .attr('x', options.img_x_pos)
        .attr('y', -40)
        .attr('width', 50)
        .attr('height', 80)
        .attr("xlink:href", pathImg)
        .attr('transform', 'translate(0, ' + imageY + ')');
d3.select('#firstnode').append("text")
		    .attr('x', options.text_x_pos)
            .attr('y',bankTxtY)
            .attr('width', 50)
            .attr('height', 80)
		    .attr("text-anchor", "middle")
		    .attr("stroke",'none')
		     .attr("font-weight",'normal')
		      .attr("fill",'#9B9FA2')
		    .style("font-size",options.labelSize)
		  //  .style("text-decoration", "underline")
            .text(options.entityName?options.entityName:'')
            .call(wrap,30,50);

			//code to remove first text from first node.
			var element  = $('#firstnode').find('text')
			$(element[0]).text(' ')
        // the function for moving the nodes
        function dragmove(d) {
            d3.select(this).attr('transform',
                `translate(${d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))},${d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))})`);
            sankey.relayout();
            link.attr('d', path);
        }
    }

    function wrap(text, width, lineHeigthVal) {
        text.each(function(element,index) {
          var text = d3.select(this),
              words = text.text().split(/\s+/).reverse(),
              word,
              line = [],
              lineNumber = 0,
              lineHeight = lineHeigthVal, // ems
              y = text.attr("y"),
            //   dy = parseFloat(text.attr("dy")),
              dy =0.8,

              tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
          while (word = words.pop()) {/*jshint ignore:line*/
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan").attr("x", -40).attr("y", 80).attr("dy", ++index* dy + "em").text(word);
            }
          }
        });
      }

}


var snackRiskScoreModule = new snackRiskScore();

export {
    snackRiskScoreModule
};
