/* cluster bubble chart constant values */
const clusterBubbleConst = {
	colors: ["#31d99c", "#5888C8","#de5942" , "#ffa618"],
	dy: ".3em"
}
function clusterbubbleChart(clusturedOptions) {
    if (clusturedOptions.container) {
        $(clusturedOptions.container).empty();
    }
    /*--------------------------Initialize Values-----------------------------*/
    if (clusturedOptions) {
        this.container = clusturedOptions.container ? clusturedOptions.container : "body"
        this.data = (clusturedOptions.data) ? clusturedOptions.data : []
        this.header = clusturedOptions.header?clusturedOptions.header:"CLUSTURED CHART";
        this.randomIdString = Math.floor(Math.random() * 10000000000);
        this.height = clusturedOptions.height ? clusturedOptions.height : 600;
        this.headerOptionsExpand = clusturedOptions.headerOptionsExpand == false ? clusturedOptions.headerOptionsExpand : true;
        this.headerOptions= clusturedOptions.headerOptions == false ? clusturedOptions.headerOptions : true;
        this.isheader= clusturedOptions.isheader == false ? clusturedOptions.isheader : true;
    } else {
        return false;
    }

    var actualOptions = jQuery.extend(true, {}, clusturedOptions);
    var clusterbubbleChartId=this.container;
    var randomSubstring = this.randomIdString;
    var h1= this.height;
    var h=parseInt(h1)+40
    var header=this.header;

    var _this = this;
    var modalwidth = $(window).width() - 200;
    var modal = ' <div id="modal_' + randomSubstring + '"class="modal fade " tabindex="-1" role="dialog"> <div class="modal-dialog modal-lg" style="width:' + modalwidth + 'px"> <form ><div class="modal-content"><div class="modal-body"  style="padding:0;background-color:#334d59" id="modal_chart_container' + randomSubstring + '"></div></div></form></div></div>';

    var chartContainerdiv = '<div class="chartContainer"  align="center" style="width: 100%; margin: auto; margin-top: 0px; font-size: 14px;font-style: inherit;"> <div class="graphBox" style="height:'+h+'px;max-height: '+h+'px;margin: auto; background-color:transparent; width: 100%;left: 0px;top: 0px;position: relative;"> <div class="headerDiv" style="font-weight:bold;background-color: #425661;text-align: left;color: #239185; border-bottom: 1px solid rgba(192, 192, 192, 0.47);width: 100%; line-height: 2.5;font-size: 16px ;padding-left: 5px;">' + header + '</div><div id="bubble_chart_div' + randomSubstring + '" class="chartContentDiv" style="width: 100%;"></div> </div></div>'
    $(this.container).html(chartContainerdiv);
    $(this.container).append(modal);
    var chart_container = "#bubble_chart_div" + randomSubstring;
    this.width = clusturedOptions.width ? clusturedOptions.width : $(chart_container).width() - 10;
    if (this.height > this.width) {
        this.height = this.width
    }

       
    this.diameter = this.height > this.width ? this.width - 50 : this.height - 50;
    if (!this.headerOptionsExpand) {
        var closebtn = '<button type="button" class="cancel" style="float: right;padding:0 8px;border:0;opacity: 1;background-color: transparent;float:right" data-dismiss="modal" aria-label="Close"> <span class="fa fa-remove"></span></button>'
        $(chart_container).siblings(".headerDiv").append(closebtn);
    }

    if ($(chart_container).siblings(".headerDiv").find(".bstheme_menu_button").length == 0)
       
	var header_options = '<div style="float: right; padding: 0 10px; cursor: pointer;" class="bstheme_menu_button bstheme_menu_button_' + randomSubstring + '" data-toggle="collapse" data-target="#opt_' + randomSubstring + '"><i class="fa fa-ellipsis-v" aria-hidden="true"></i><div class="bstheme_options" style="position:absolute;right:10px;z-index:2000"> <div style="display:none;" id="opt_' + randomSubstring + '" class="collapse"><span class="header_fullscreen_chart' + randomSubstring + '"><i class="fa fa-expand" aria-hidden="true"></i></span><span class="header_refresh_' + randomSubstring + '"><i class="fa fa-refresh" aria-hidden="true"></i></span> <span class="header_table_' + randomSubstring + '"> <i class="fa fa-table" aria-hidden="true"></i></span> <span class="header_chart_' + randomSubstring + '" style="display:none" ><i class="fa fa-bar-chart" aria-hidden="true"></i></span></div></div> </div>';
    if(this.headerOptions)
    $(chart_container).siblings(".headerDiv").append(header_options);
  
    if (!this.headerOptionsExpand) {
	    $(chart_container).siblings(".headerDiv").find(".bstheme_options").css("right", "28px");
	    $('.header_fullscreen_chart' + randomSubstring).css("display", "none");
    } else {
        $(chart_container).siblings(".headerDiv").find(".bstheme_options").css("right", "0");
    }
    if(!this.isheader){
    	$(chart_container).siblings(".headerDiv").css("display","none");
    }
    data = this.data;
    var tool_tip = $('body').append('<div class="Cluster_Chart_tooltip" style="text-transform:uppercase;position: absolute; z-index: 99999;opacity: 1; pointer-events: none; display:none"><span style=" font-size: 12px; position: absolute; white-space: nowrap;  margin-left: 0px; margin-top: 0px; left: 8px; top: 8px;"><span style="font-size:10px" class="tool_tip_x_val"></span><table><tbody><tr><td style="padding:0"> </td><td style="padding:0"><b>216.4 mm</b></td></tr><tr><td style="color:#434348;padding:0">New York: </td><td style="padding:0"><b>91.2 mm</b></td></tr><tr><td style="color:#90ed7d;padding:0">London: </td><td style="padding:0"><b>52.4 mm</b></td></tr><tr><td style="color:#f7a35c;padding:0">Berlin: </td><td style="padding:0"><b>47.6 mm</b></td></tr></tbody></table></span></div>');

    var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    var colorScale = d3.scaleOrdinal().range(clusterBubbleConst.colors);
    var width = this.width,
        height = this.height,
        diameter = this.diameter,
        node,
        root,
        radius = Math.min(width, height) / 2;

    var pie = d3.pie()
            .sort(null)
            .value(function (d) {
                return d.value;
            });
    var arc = d3.arc()
            .outerRadius(radius - 66)
            .innerRadius(radius - 40)
            .padAngle(0.03);



    var svg = d3.select(chart_container).append("svg:svg")
            .attr("width", width)
            .attr("height", height)
            .append("svg:g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
            

    plotclusterbubbleChart(data);
    function plotclusterbubbleChart(data) {
        var g = svg.selectAll(".arc")
                .data(pie(data))
                .enter().append("g")
                .attr("class", "arc")
                .call(d3.zoom().on("zoom", function () {
            g.attr("transform", d3.event.transform)
		     }))																																											    
   

        g.append("path")
                .attr("d", arc)
                .style("fill", function (d) {                   
                    return colorScale(d.data.label);
                }) 
                .on("mouseover", function (d) {
                	if(d.data.txt){
	               		 $(".Cluster_Chart_tooltip").html(d.data.txt);
	               		$(".Cluster_Chart_tooltip").css("visibility", "visible");
	               		 return $(".Cluster_Chart_tooltip").css("display", "block");
	               	}
                	else if(d.data.label){
                        $(this).css("opacity", 1);
                        var valueStr = '';
                        valueStr = ': <span>' + d.data.value + '</span>'
                        $(".Cluster_Chart_tooltip").html('<span>' + d.data.label + '</span> ' + valueStr);
                        $(".Cluster_Chart_tooltip").css("visibility", "visible");
                        return $(".Cluster_Chart_tooltip").css("display", "block");
                    }
                	else{
                		$(".Cluster_Chart_tooltip").css("visibility", "hidden");
                         return $(".Cluster_Chart_tooltip").css("display", "none");
                    }
               })
               .on("mousemove", function () {
            	   var p=$(chart_container)
                	var position=p.offset();
                	var windowWidth=window.innerWidth;
                	var tooltipWidth=$(".Cluster_Chart_tooltip").width()+50
                	var cursor=d3.event.x;
                	
                		if((position.left<d3.event.pageX)&&(cursor>tooltipWidth)){
                			var element = document.getElementsByClassName("Cluster_Chart_tooltip");
                			element[0].classList.remove("tooltip-left");
                			element[0].classList.add("tooltip-right");
                			$(".Cluster_Chart_tooltip").css("left",(d3.event.pageX - 15-$(".Cluster_Chart_tooltip").width()) + "px");
                		}else{
                		
                   		var element =document.getElementsByClassName("Cluster_Chart_tooltip");
               		    element[0].classList.remove("tooltip-right");
               		    element[0].classList.add("tooltip-left");
               		    $(".Cluster_Chart_tooltip").css("left", (d3.event.pageX + 10) + "px");
   	           		}
                    return $(".Cluster_Chart_tooltip").css("top",d3.event.pageY + "px")
   	          
               })
               .on("mouseout", function () {   
            	   $(".Cluster_Chart_tooltip").css("visibility", "hidden");
                   /*hide tool-tip*/
                   return $(".Cluster_Chart_tooltip").css("display", "none");
               });;

               arc
                .outerRadius(radius - 10)
                .innerRadius(-110);


/*create zone regions*/
        var zones = [];
        g.append("g")
                .attr("class", function (d, i) {
                    return "bubble" + i;
                })
                .attr("transform", function (d) {
                    zones[d.data.label] = arc.centroid(d);
                    return "translate(" + arc.centroid(d) + ")";
                });

/*loop through data and for EACH children array paint dots.*/
        $.each(data, function (index, value) {
            setBubbleChart(radius - 30, index, value.children);
        });
/*custom bubble chart*/
        function bubbledata(data) {
            return $.extend(true, {}, {
                "children": data
            }); 
            /* return deep clone*/
        }

        function setBubbleChart(width, index, data) {
        	if(data.length==0){
        		return;
        	}
            /*_create bubble*/
            var diameter = width / 2; 

            var bubs = svg.select(".bubble" + index).append("g")
                    .attr("class", "bubs");

            bubs.attr("transform", "translate(" + -diameter / 2 + "," + -diameter / 2 + ")");
            /*_create bubble*/
            var data = bubbledata(data);
            var pack = d3.pack()
                    .size([diameter, diameter])
            node = root = d3.hierarchy(data)
                    .sum(function (d) {
                        return d.size;
                    })
                    .sort(function (a, b) {
                        return b.value - a.value;
                    });



            var nodes = pack(root).descendants();
            
            var bubbles = bubs.selectAll('circle')
                    .data(nodes);

            bubbles.enter()
                    .insert("circle")
                    .attr('transform', function (d) {
                        return 'translate(' + d.x + ',' + d.y + ')';
                    })
                    .attr('r', function (d) {
                        return d.r;
                    }).style("stroke-width", 3)
                    .style("opacity", 0.4)
                    .style("fill", function (d) {
                        if (d.data.group) {
                            return colorScale(d.data.group);
                        } else {
                            return "none";
                        }
                    }).style("stroke", function (d) {
                if (d.data.group) {
                    return colorScale(d.data.group);
                } else {
                    return "none";
                }
            })
            .on("mouseover", function (d) {
            	if(d.data.txt){
            		 $(".Cluster_Chart_tooltip").html(d.data.txt);
            			$(".Cluster_Chart_tooltip").css("visibility", "visible");
            		 
            		 return $(".Cluster_Chart_tooltip").css("display", "block");
            	}else if(d.data.size){
                    $(this).css("opacity", 1);
                    var valueStr = '';
                    valueStr = ': <span>' + (d.data.size).toFixed(2) + '</span>'
                    $(".Cluster_Chart_tooltip").html('<span>' + d.data.name + '</span> ' + valueStr);
                	$(".Cluster_Chart_tooltip").css("visibility", "visible");
                    return $(".Cluster_Chart_tooltip").css("display", "block");
                }else{
                	$(".Cluster_Chart_tooltip").css("visibility", "hidden");
                     return $(".Cluster_Chart_tooltip").css("display", "none");
                }
            })
            .on("mousemove", function () {
       	        var p=$(chart_container)
             	var position=p.offset();
             	var windowWidth=window.innerWidth;
             	var tooltipWidth=$(".Cluster_Chart_tooltip").width()+50
             	var cursor=d3.event.x;
             	if((position.left<d3.event.pageX)&&(cursor>tooltipWidth)){
             			var element = document.getElementsByClassName("Cluster_Chart_tooltip");
             			element[0].classList.remove("tooltip-left");
            			element[0].classList.add("tooltip-right");
             			$(".Cluster_Chart_tooltip").css("left",(d3.event.pageX - 15-$(".Cluster_Chart_tooltip").width()) + "px");
             		}else{
                  		var element =document.getElementsByClassName("Cluster_Chart_tooltip");
                  		element[0].classList.remove("tooltip-right");
               		    element[0].classList.add("tooltip-left");
            		    $(".Cluster_Chart_tooltip").css("left", (d3.event.pageX + 10) + "px");
	           		}
                 return $(".Cluster_Chart_tooltip").css("top",d3.event.pageY + "px")
	            
            })
            .on("mouseout", function () {
                $(this).css("opacity", 0.4);
                /*hide tool-tip*/
            	$(".Cluster_Chart_tooltip").css("visibility", "hidden");
                return $(".Cluster_Chart_tooltip").css("display", "none");
            });

            bubbles.enter()
                    .insert("text")
                    .attr('transform', function (d) {
                        return 'translate(' + d.x + ',' + d.y + ')';
                    })
                    .attr("class", "bubbletext")
                    .attr("dy", clusterBubbleConst.dy)
                    .style("text-anchor", "middle")
                    .text(function (d) {

                    });

            bubbles = bubbles

                    .attr('transform', function (d) {
                        return 'translate(' + d.x + ',' + d.y + ')';
                    })
                    .attr('r', function (d) {
                        return d.r;
                    }).style("stroke-width", 5);
        }
    }

    /**
     * Fuction to handle show hide of header options
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
     * Fuction to handle show hide of header options
     */
    $("body").on("click", ".header_refresh_" + randomSubstring, function () {
        var chartId = $(this).parent().parent().parent().parent().siblings("div").attr("id");
        if ("#" + chartId == chart_container) {
            $(clusterbubbleChartId).empty();
            ClusterBubble(actualOptions);
        }
    });
    /**
     * Fuction to handle show hide of header options
     */

 $("body").on("click", ".header_table_" + randomSubstring, function () {
        
        $(chart_container).empty();
        $(this).css("display", "none");
        $(".header_chart_" + randomSubstring).css("display", "inline-block");

        var tbl = "<div id ='cluster_table_" + randomSubstring + "'  style='padding:5px;background-color: #425661;overflow:overflow:hidden;height:" + (_this.height) + "px'><table id ='cluster_table1_" + randomSubstring + "' class='table-striped ' style='width:100%;background-color:#283C45;padding:5px;color:#5A676E; ' ><thead><tr><th>NAME</th><th>VALUE</th><th>GROUP</th></tr></thead><tbody>";
    $.each(data,function(i,v){
        $.each(v.children, function (index, value) {
             tbl = tbl + "<tr><td>" + (value.name.toUpperCase()) + "</td><td>" + value.size + "</td><td>"+value.group+"</td></tr>"
        });
     });
    tbl = tbl + "</tbody></table></div>";
    $(chart_container).append(tbl);
    $("#cluster_table1_" + randomSubstring).DataTable({"bLengthChange": false, "paging": false, "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            if (iDisplayIndex % 2 == 1) {
                $('td', nRow).css('background-color', '#32464F');
            } else {
                $('td', nRow).css('background-color', '#283C45');
            }
        }});
    $("#cluster_table_" + randomSubstring).mCustomScrollbar({
        axis: "y"
    });

        $("#cluster_table_" + randomSubstring + " tr:first").css("background-color", "#0CB29A");
        var id1 = $("#cluster_table_" + randomSubstring).children('div').find('div').eq(0);
        var id2 = $("#cluster_table_" + randomSubstring).children('div').find('div').eq(1);
        var id3 = $("#cluster_table_" + randomSubstring).children('div').find('div').eq(2);
        var id1attr = id1.attr("id");
        var id2attr = id2.attr("id");
        var id3attr = id3.attr("id");



        $("#" + id1attr + " " + "label").css("color", "#666666")
        $("#" + id2attr + " " + "label").css("color", "#666666")
        $("#" + id3attr).css("color", "#666666")

        $(" .dataTables_filter input").css({"margin-left": "0.5em", "position": "relative", "border": "0", "min-width": "240px",
            "background": "transparent",
            "border-bottom": "1px solid #666666",
            " border-radius": " 0",
            "padding": " 5px 25px",
            "color": "#ccc",
            "height": " 30px",
            "-webkit-box-shadow": " none",
            "box-shadow": " none"
        })
    });

 $("body").on("click", ".header_fullscreen_chart" + randomSubstring, function () {
        $("#modal_" + randomSubstring).modal('show');
        var options = jQuery.extend(true, {}, actualOptions);
        setTimeout(function () {
            $("#modal_chart_container" + randomSubstring).css("width", "100%")
            options.container = "#modal_chart_container" + randomSubstring;
            options.headerOptionsExpand = false;
            options.height = 450;
            new ClusterBubble(options);
        }, 500)
    })
}
