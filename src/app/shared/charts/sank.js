/* sank chart constant values */
const sankConst = {
	nodeWidth : 24,
  	nodePadding : 8,
	titleX: -6,
	titleDY: '.35em',
	colorDomain: ['1MDB',
				    'Petrosaudi',
				    'Good Star',
				    'Totality LTD',
				    'Jasmine LOO Ai Swan'],
    colors:['#368FCE','#8C3F8E','#F48D27','#69CA6B','#95AF0D']
}

function sankey_chart(options)
{  
	var isnegativeValue;
	if (options.container) {
        $(options.container).empty();
    }
    /*--------------------------Initialize Values-----------------------------*/
    if (options) {
        options.container = options.container ? options.container : "body"
        options.data = (options.data) ? options.data : []
        options.header = options.header?options.header:"SANKEY CHART";
        options.randomIdString = Math.floor(Math.random() * 10000000000);
        options.height = options.height ? options.height : 600;
        options.margin = options.margin ? {
            top: options.margin.top ? options.margin.top : 20,
            right: options.margin.right ? options.margin.right : 20,
            bottom: options.margin.bottom ? options.margin.bottom : 30,
            left: options.margin.left ? options.margin.left : 40
        } : {top: 20, right: 20, bottom: 50, left: 50};
        options.headerOptions = options.headerOptions == false ? options.headerOptions : true;
        options.isHeaer=options.isHeaer == false ? options.isHeaer : true;

    }
    var actualOptions = jQuery.extend(true, {}, options); 
    
   var colorDomain = [];
   $.each(options.data.nodes,function(i,d){
	   colorDomain.push(d.name);
   })
    var sankeyChartId=options.container;
    var randomSubstring = options.randomIdString;
    var header=options.header;
   
	d3.sankey = function() {
		var sankey = {},
	      	nodeWidth = sankConst.nodeWidth,
	      	nodePadding = sankConst.nodePadding,
	      	size = [1, 1],
	      	nodes = [],
	      	links = [];
	
	  sankey.nodeWidth = function(_) {
		  if (!arguments.length) return nodeWidth;
		  	nodeWidth = +_;
		  	return sankey;
	  };
	
	  sankey.nodePadding = function(_) {
	    if (!arguments.length) return nodePadding;
	    nodePadding = +_;
	    return sankey;
	  };
	
	  sankey.nodes = function(_) {
	    if (!arguments.length) return nodes;
	    nodes = _;
	    return sankey;
	  };
	
	  sankey.links = function(_) {
	    if (!arguments.length) return links;
	    links = _;
	    return sankey;
	  };
	
	  sankey.size = function(_) {
	    if (!arguments.length) return size;
	    size = _;
	    return sankey;
	  };
	
	  sankey.layout = function(iterations) {
	    computeNodeLinks();
	    computeNodeValues();
	    computeNodeBreadths();
	    computeNodeDepths(iterations);
	    computeLinkDepths();
	    return sankey;
	  };
	
	  sankey.relayout = function() {
	    computeLinkDepths();
	    return sankey;
	  };
	
	  sankey.link = function() {
	    var curvature = .5;
	
	    function link(d) {
	      var x0 = d.source.x + d.source.dx,
	          x1 = d.target.x,
	          xi = d3.interpolateNumber(x0, x1),
	          x2 = xi(curvature),
	          x3 = xi(1 - curvature),
	          y0 = d.source.y + d.sy + d.dy / 2,
	          y1 = d.target.y + d.ty + d.dy / 2;
	      return  "M" + -10 + "," + -10 
	           + "M" + x0  + "," + y0
	           + "C" + x2  + "," + y0
	           + " " + x3  + "," + y1
	           + " " + x1  + "," + y1;
	    }
	
	    link.curvature = function(_) {
	      if (!arguments.length) return curvature;
	      curvature = +_;
	      return link;
	    };
	
	    return link;
	  };
	
	  /* Populate the sourceLinks and targetLinks for each node.
	     Also, if the source and target are not objects, assume they are indices. */
	  function computeNodeLinks() {
		  nodes.forEach(function(node) {
		      node.sourceLinks = [];
		      node.targetLinks = [];
		  });
		  links.forEach(function(link) {
		      var source = link.source,
		          target = link.target;
		      if (typeof source === "number") source = link.source = nodes[link.source];
		      if (typeof target === "number") target = link.target = nodes[link.target];
		      source.sourceLinks.push(link);
		      target.targetLinks.push(link);
		  });
	  }
	  /* Compute the value (size) of each node by summing the associated links. */
	  function computeNodeValues() {
		  nodes.forEach(function(node) {
			  node.value = Math.max(
		        d3.sum(node.sourceLinks, value),
		        d3.sum(node.targetLinks, value)
	      );
	    });
	  }
	  /* Iteratively assign the breadth (x-position) for each node.
  		 Nodes are assigned the maximum breadth of incoming neighbors plus one;
  		 nodes with no incoming links are assigned breadth zero, while
	     nodes with no outgoing links are assigned the maximum breadth.*/
	  function computeNodeBreadths() {
		  var remainingNodes = nodes,
		  		nextNodes,
		  		x = 0;
	
	    while (remainingNodes.length) {
	      nextNodes = [];
	      remainingNodes.forEach(function(node) {
	        node.x = x;
	        node.dx = nodeWidth;
	        node.sourceLinks.forEach(function(link) {
	        	nextNodes.push(link.target);
	        });
	      });
	      remainingNodes = nextNodes;
	      ++x;
	    }
	    moveSinksRight(x);
	    scaleNodeBreadths((width - nodeWidth) / (x - 1));
	  }
	
	  function moveSourcesRight() {
	    nodes.forEach(function(node) {
	      if (!node.targetLinks.length) {
	        node.x = d3.min(node.sourceLinks, function(d) { return d.target.x; }) - 1;
	      }
	    });
	  }
	
	  function moveSinksRight(x) {
	    nodes.forEach(function(node) {
	      if (!node.sourceLinks.length) {
	        node.x = x - 1;
	      }
	    });
	  }
	
	  function scaleNodeBreadths(kx) {
	    nodes.forEach(function(node) {
	      node.x *= kx;
	    });
	  }
	
	  function computeNodeDepths(iterations) {
	    var nodesByBreadth = d3.nest()
	        .key(function(d) { return d.x; })
	        .sortKeys(d3.ascending)
	        .entries(nodes)
	        .map(function(d) { return d.values; });
	  
	    initializeNodeDepth();
	    resolveCollisions();
	    for (var alpha = 1; iterations > 0; --iterations) {
	      relaxRightToLeft(alpha *= .99);
	      resolveCollisions();
	      relaxLeftToRight(alpha);
	      resolveCollisions();
	    }
	
	    function initializeNodeDepth() {
	      var ky = d3.min(nodesByBreadth, function(nodes) {
	        return (size[1] - (nodes.length - 1) * nodePadding) / d3.sum(nodes, value);
	      });
	
	      nodesByBreadth.forEach(function(nodes) {
	        nodes.forEach(function(node, i) {
	          node.y = i;
	          node.dy = node.value * ky;
	        });
	      });
	
	      links.forEach(function(link) {
	        link.dy = link.value * ky;
	      });
	    }
	
	    function relaxLeftToRight(alpha) {
	      nodesByBreadth.forEach(function(nodes, breadth) {
	        nodes.forEach(function(node) {
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
	      nodesByBreadth.slice().reverse().forEach(function(nodes) {
	        nodes.forEach(function(node) {
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
	      nodesByBreadth.forEach(function(nodes) {
	        var node,
	            dy,
	            y0 = 0,
	            n = nodes.length,
	            i;
	
	        /* Push any overlapping nodes down. */
	        nodes.sort(ascendingDepth);
	        for (i = 0; i < n; ++i) {
	        	node = nodes[i];
	        	dy = y0 - node.y;
	        	if (dy > 0) node.y += dy;
	        	y0 = node.y + node.dy + nodePadding;
	        }
	
	        /* If the bottom most node goes outside the bounds, push it back up. */
	        dy = y0 - nodePadding - size[1];
	        if (dy > 0) {
	          y0 = node.y -= dy;
	         /* Push any overlapping nodes back up. */
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
	    nodes.forEach(function(node) {
		      node.sourceLinks.sort(ascendingTargetDepth);
		      node.targetLinks.sort(ascendingSourceDepth);
	    });
	    nodes.forEach(function(node) {
	      var sy = 0, ty = 0;
	      node.sourceLinks.forEach(function(link) {
		        link.sy = sy;
		        sy += link.dy;
	      });
	      node.targetLinks.forEach(function(link) {
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

	var randomSubstring= Math.floor(Math.random() * 10000000000);
	var h=options.height+50;
	var modalwidth=$(window).width()-200;
    var modal = ' <div id="modal_' + randomSubstring + '"class="modal fade " tabindex="-1" role="dialog"> <div class="modal-dialog modal-lg" style="width:'+modalwidth+'px"> <form ><div class="modal-content"><div class="modal-body"  style="padding:0;background-color:#334d59" id="modal_chart_container' + randomSubstring + '"></div></div></form></div></div>';
  
    var chartContainerdiv = '<div class="chartContainer"  align="center" style="width: 100%; margin: auto; margin-top: 0px; font-size: 12px;font-style: inherit;"> <div class="graphBox" style="height:'+h+'px;max-height: '+h+'px;min-height: '+h+'px;margin: auto; background-color: #374c59; width: 100%;left: 0px;top: 0px;position: relative;"> <div class="headerDiv" style="font-weight:bold;background-color: #425661;text-align: left;color: #239185; border-bottom: 1px solid rgba(192, 192, 192, 0.47);width: 100%; line-height: 2.5;font-size: 16px ;padding-left: 5px;">' + header + '</div><div id="sankey_chart_div' + randomSubstring + '" class="chartContentDiv" style="width: 100%;"></div> </div></div>'
    $(options.container).html(chartContainerdiv);
    $(options.container).append(modal);
    var chart_container = "#sankey_chart_div" + randomSubstring;
    if (!options.headerOptions) {
    	var closebtn =  '<button type="button" class="cancel" style="float: right;padding:0 8px;border:0;opacity: 1;background-color: transparent;float:right" data-dismiss="modal" aria-label="Close"> <span class="fa fa-remove"></span></button>'
		$(chart_container).siblings(".headerDiv").append(closebtn);
    }
    if ($(chart_container).siblings(".headerDiv").find(".bstheme_menu_button").length == 0)
        var header_options = '<div style="float: right; padding: 0 10px; cursor: pointer;" class="bstheme_menu_button bstheme_menu_button_' + randomSubstring + '" data-toggle="collapse" data-target="#opt_' + randomSubstring + '"><i class="fa fa-ellipsis-v" aria-hidden="true"></i><div class="bstheme_options" style="position:absolute;right:10px;z-index:2000"> <div style="display:none; min-width: 120px; margin-top: 2px; background: rgb(27, 39, 53) none repeat scroll 0% 0%; border: 1px solid rgb(51, 51, 51); border-radius: 4px;" id="opt_' + randomSubstring + '" class="collapse"><span style="display: inline-block;float: left;text-align: center;width: 33.33%; border-right: 1px solid #000;" class="header_fullscreen_chart' + randomSubstring + '"><i class="fa fa-expand" aria-hidden="true"></i></span><span style="display: inline-block;float: left;text-align: center;width: 33.33%; border-right: 1px solid #000;" class="header_refresh_' + randomSubstring + '"><i class="fa fa-refresh" aria-hidden="true"></i></span> <span style="display: inline-block;float: left;text-align: center;width: 33.33%;" class="header_table_' + randomSubstring + '"> <i class="fa fa-table" aria-hidden="true"></i></span> <span style="display: none;float: left;text-align: center;width: 33.33%;" class="header_chart_' + randomSubstring + '" ><i class="fa fa-bar-chart" aria-hidden="true"></i></span></div></div> </div>';
    	$(chart_container).siblings(".headerDiv").append(header_options);
   
      if (!options.headerOptions) {
          $(chart_container).siblings(".headerDiv").find(".bstheme_options").css("right","28px");
          $('.header_fullscreen_chart' + randomSubstring).css("display","none");
      }else{
          $(chart_container).siblings(".headerDiv").find(".bstheme_options").css("right","0");
      }
    $(".graphBox").mCustomScrollbar({
        axis: "y",
       /* theme: "3d" */
    });
     $(".sank_tooltip").remove();
     var tool_tip = $('body').append('<div class="sank_tooltip text-uppercase" style="visibility:visible;display:none"><span class="sank_tooltip_next"><span class="tool_tip_x_val"></span><table><tbody><tr><td> </td><td><b>216.4 mm</b></td></tr><tr><td class="city-color-one">New York: </td><td><b>91.2 mm</b></td></tr><tr><td class="city-color-two">London: </td><td><b>52.4 mm</b></td></tr><tr><td class="city-color-three">Berlin: </td><td><b>47.6 mm</b></td></tr></tbody></table></span></div>');
     if(!options.isHeaer){
     	$(chart_container).siblings(".headerDiv").remove();
     }
     var units = "Widgets";

     options.width = options.width ? options.width : $(chart_container).width() - 20;
     var margin = options.margin,
         width = options.width - margin.left - margin.right,
         height = options.height - margin.top - margin.bottom;

	var _this = options;
	const formatNumber = d3.format(',.0f');
	const format = function(d){ return `${formatNumber(d)} ${units}`};

	var color = d3.scaleOrdinal() .domain(colorDomain).range(sankConst.colors);

	d3.select(chart_container)
	  .style('visibility', 'visible');
	
	/* append the svg canvas to the page */
	const svg = d3.select(chart_container).append('svg')
	  .attr('width', width + margin.left + margin.right)
	  .attr('height', height + margin.top + margin.bottom)
	  .append('g')
	  .attr('transform', `translate(${margin.left},${margin.top})`);
	
	/* set the sankey diagram properties */
	const sankey = d3.sankey()
	  .nodeWidth(12)
	  .nodePadding(10)
	  .size([width, height]);
	
	const path = sankey.link();
	
	/* append a defs (for definition) element to your SVG */
	const defs = svg.append('defs');
	
	
	  loadsank(options.data);
	/* load the data */
	function loadsank(graph) {
	  
	  sankey
	    .nodes(graph.nodes)
	    .links(graph.links)
	    .layout(14); /* any value > 13 breaks the link gradient */
	 
	  /* add in the links */
	  const link = svg.append('g').selectAll('.link')
	    .data(graph.links)
	    .enter().append('path')
	      .attr('class', 'link')
	      .attr('d', path)
	      .style('stroke-width', function(d)
	        { return Math.max(1, d.dy)})
	      .style('fill', 'none')
	      .style('stroke-opacity', 1.4)
	      .sort(function(a, b) { return b.dy - a.dy})
	      .on("mouseover", function (d) {
	    	  if(d.txt){
	    		  $(".sank_tooltip").html(d.txt)
	    	  }else
                 $(".sank_tooltip").html('<div>'+d.label+'</div><span> Type: ' + d.source.name  + '</span><br>' + '<span> Value: '+formatNumber(d.value)+'</span>');
                 return $(".sank_tooltip").css("display", "block");
      		})
         	.on("mousemove", function () {
//         		if($(".sank_tooltip").width()+d3.event.pageX+10<$(window).width()){
//            		$(".sank_tooltip").css("left", (d3.event.pageX + 10) + "px");
//            	}else{
//            		$(".sank_tooltip").css("left", (d3.event.pageX - 10-$(".sank_tooltip").width()) + "px");
//            	}	
//         		
//                return $(".sank_tooltip").css("top", (d3.event.pageY - 10) + "px")
                
                var p=$(chart_container)
             	var position=p.offset();
             	var windowWidth=window.innerWidth;
             	var tooltipWidth=$(".sank_tooltip").width()+50
             	var cursor=d3.event.x;
             	if((position.left<d3.event.pageX)&&(cursor>tooltipWidth)){
             		var element = document.getElementsByClassName("sank_tooltip");
	               		element[0].classList.add("tooltip-right");
	               		$(".sank_tooltip").css("left",(d3.event.pageX -15-$(".sank_tooltip").width()) + "px");
	                
             		
             	}else{
                		var element =document.getElementsByClassName("sank_tooltip");
            		    element[0].classList.remove("tooltip-right");
            		    $(".sank_tooltip").css("left", (d3.event.pageX + 10) + "px");
	           
             	}
                 return $(".sank_tooltip").css("top",d3.event.pageY + "px")
	
	
             })
             .on("mouseout", function () {
                return $(".sank_tooltip").css("display", "none");
             });
	 
	 
	 
	  /* add in the nodes */
	  const node = svg.append('g').selectAll('.node')
			    .data(graph.nodes)
			    .enter().append('g')
			    .attr('class', 'node')
			    .attr('transform', function(d)
			    		{ return `translate(${d.x},${d.y})`})
			    		.call(d3.drag()
			    				.subject(function(d){return d})
			    				.on('start', function() { 
			    					this.parentNode.appendChild(this); })
			    					.on('drag', dragmove));
	 
	  /* add the rectangles for the nodes */
	  node.append('rect')
	    .attr('height', function(d){ 
	    	if(d.dy<0){
	    		if(!isnegativeValue){
	    			isnegativeValue = d.dy;
	    		}
	    		if(isnegativeValue>d.dy){
	    			isnegativeValue = d.dy;
	    		}
	    			return 0;
	    	}
	    	
	    	return d.dy
	    	})
	    .attr('width', sankey.nodeWidth())
	    .style('fill', function(d) { 
	      if(color.domain().indexOf(d.name) > -1){
	        return d.color = color(d.name);  
	      } else {
	        return d.color = '#ccc';
	      }
	    })
	    if(isnegativeValue){
		    setTimeout(function(){
		    	  $(sankeyChartId).empty();
		    	  actualOptions.height = parseFloat(actualOptions.height)+parseFloat(Math.abs(isnegativeValue));
		            new sankey_chart(actualOptions);
		    },1000)
	    }
	    /* .append('title')
	    
	     .on("mouseover", function (d) {
	    	 if(d.txt){
	    		  $(".sank_tooltip").html(d.txt)
	    	  }else
                 $(".sank_tooltip").html('<div>'+d.label+'</div><span>Type: ' + d.name +'</span><br>' + '<span> Value: '+formatNumber(d.value)+'</span>');
                 return $(".sank_tooltip").css("display", "block");
	     })
         .on("mousemove", function () {
        	 $(".sank_tooltip").css("top", (d3.event.pageY - 10) + "px")
        	 return  $(".sank_tooltip").css("left", (d3.event.pageX + 10) + "px");

         })
         .on("mouseout", function () {
            return $(".sank_tooltip").css("display", "none");
        });	 
	  /* add in the title for the nodes */
	  node.append('text')
	  .style("text-transform","uppercase")
	    .attr('x', sankConst.titleX)
	    .attr('y', function(d){ return d.dy / 2})
	    .attr('dy', sankConst.titleDY)
	    .attr('text-anchor', 'end')
	    .attr('transform', null)
	    .text(function(d){return d.name} )
	    .filter(function(d){ return d.x < width / 2})
	      .attr('x', 6 + sankey.nodeWidth())
	      .attr('text-anchor', 'start');
	
	  /* add gradient to links */
	  link.style('stroke', function(d,i) {
	
	    /* make unique gradient ids */ 
	    const gradientID = `gradient${i}`;
	
	    const startColor = d.source.color;
	    const stopColor = d.target.color;
	    const linearGradient = defs.append('linearGradient')
	        .attr('id', gradientID);
	
	    linearGradient.selectAll('stop') 
	      .data([                             
	          {offset: '10%', color: startColor },      
	          {offset: '90%', color: stopColor }    
	        ])                  
	      .enter().append('stop')
	      .attr('offset', function(d) {
	    
	        return d.offset; 
	      })   
	      .attr('stop-color', function(d) {
	      
	        return d.color;
	      });
	
	    return `url(#${gradientID})`;
	  })
	 
	/* the function for moving the nodes */
	  function dragmove(d) {
		    d3.select(this).attr('transform', 
		      `translate(${d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))},${d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))})`);
		    sankey.relayout();
		    link.attr('d', path);
	  }
	}
	    /**
	     * Function to handle show hide of header options
	     */
	    $("body").on("click", ".bstheme_menu_button_" + randomSubstring, function () {
	        var id = ($(this).attr("data-target"));
	        if ($(id).css("display") == "none") {
	            $(id).css("display", "inline-block");
	        } else {
	            $(id).css("display", "none");
	        }
	    });
	    /**
	     * Function to handle show hide of header options
	     */
	    $("body").on("click", ".header_refresh_" + randomSubstring, function () {
	        var chartId = $(this).parent().parent().parent().parent().siblings("div").attr("id");
	        if ("#" + chartId == chart_container) {
	            $(sankeyChartId).empty();
	            new sankey_chart(actualOptions);
	        }
	    });
    /**
     * Function to handle show hide of header options
     */
    $("body").on("click", ".header_table_" + randomSubstring, function () {
    	var a=parseInt(h/55);
        $(chart_container).empty();
        $(chart_container).css("overflow","auto");
        $(this).css("display", "none");
        $(".header_chart_" + randomSubstring).css("display", "inline-block");
      var data = options.data;
      var tbl = "<div id ='sankey_table_" + randomSubstring + "' style='padding:5px;background-color: #425661;overflow:hidden;height:" + (_this.height) + "px'><table id ='sankey_table1_" + randomSubstring + "'class=' table-striped table-condensed' style='width:100%;background-color:#283C45;padding:5px;color:#5A676E; ' ><thead><tr><th>TYPE</th><th>VALUE</th></tr></thead><tbody>";
         $.each(data.nodes,function(i,v){
           tbl = tbl + "<tr><td>" + (v.name.toUpperCase()) + "</td><td>" + v.value+ "</td></tr>"
         });
         tbl = tbl + "</tbody></table></div>";
         $(chart_container).append(tbl);
         $("#sankey_table1_" + randomSubstring).DataTable({ "bLengthChange": false,"paging": false,"fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
	    if (iDisplayIndex % 2 == 1) {
	        $('td', nRow).css('background-color', '#32464F');
	    } else {
	        $('td', nRow).css('background-color', '#283C45');
	    }
} });
      
         $("#sankey_table_" + randomSubstring).mCustomScrollbar({
            axis: "y"
        });
      $("#sankey_table_"+randomSubstring+" tr:first").css("background-color","#0CB29A");
      var id1 = $("#sankey_table_"+randomSubstring).children('div').find('div').eq(0);
      var id2 = $("#sankey_table_"+randomSubstring).children('div').find('div').eq(1);
      var id3 = $("#sankey_table_"+randomSubstring).children('div').find('div').eq(2);
      var id1attr=id1.attr("id");
      var id2attr=id2.attr("id");
      var id3attr=id3.attr("id");

      	$("#"+id1attr+" "+ "label").css("color","#666666")
       $("#"+id2attr+" "+ "label").css("color","#666666")
       $("#"+id3attr).css("color","#666666")
       
       $(" .dataTables_filter input").css({"margin-left": "0.5em",  "position": "relative","border": "0", "min-width": "240px",
		    "background": "transparent",
		   "border-bottom": "1px solid #666666",
		   " border-radius":" 0",
		    "padding":" 5px 25px",
		   "color": "#ccc",
		   "height":" 30px",
		    "-webkit-box-shadow":" none",
		    "box-shadow":" none"
       })
           $(".dataTables_wrapper").css("background-color","#374C59");
     
    });
    /**
     * Function to handle show hide of header options
     */
    $("body").on("click", ".header_chart_" + randomSubstring, function () {
        $(chart_container).css("overflow","hidden");
        var chartId = $(this).parent().parent().parent().parent().siblings("div").attr("id");
        if ("#" + chartId == chart_container) {
            $(this).css("display", "none");
            $(".header_table_" + randomSubstring).css("display", "inline-block");
            $(sankeyChartId).empty();
            new sankey_chart(actualOptions);
        }
    });
    $("body").on("click", ".header_fullscreen_chart" + randomSubstring, function () {
        $("#modal_" + randomSubstring).modal('show');
        var options = jQuery.extend(true, {}, actualOptions);
        setTimeout(function () {
            $("#modal_chart_container" + randomSubstring).css("width", "100%")
            options.container = "#modal_chart_container" + randomSubstring;
            options.headerOptions=false;
            options.height =450;
            new sankey_chart(options);
        }, 500)
    })
}
