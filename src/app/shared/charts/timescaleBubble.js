/*--------------------------Store time scale bubble chart Values-----------------------------*/
const timeScaleValues = {
	colors : ["#46a2de", "#5888C8", "#31d99c", "#de5942", "#ffa618"],
	xAxisTextX: 8,
	xAxisTextY: 10,
	xAxisTextDX: ".71em",
	yAxisTextDY: "1.1em",
	yAxisTextdx: -20,
	bubbleDuration: 400
}
import * as $ from 'jquery';
import * as d3 from 'd3';
function TimeScaleBubbleChart() { }

TimeScaleBubbleChart.prototype.timescalebubbleChart = function (timeLineOptions) {
    if (timeLineOptions.container) {
        $(timeLineOptions.container).empty();
    }
/*--------------------------Initialize Values-----------------------------*/
    if (timeLineOptions) {
        this.container = timeLineOptions.container ? timeLineOptions.container : "body"
        this.data = (timeLineOptions.data) ? timeLineOptions.data : []
        this.width = timeLineOptions.width ? timeLineOptions.width : 240;
        this.margin = timeLineOptions.margin ? {
            top: timeLineOptions.margin.top ? timeLineOptions.margin.top : 20,
            right: timeLineOptions.margin.right ? timeLineOptions.margin.right : 20,
            bottom: timeLineOptions.margin.bottom ? timeLineOptions.margin.bottom : 30,
            left: timeLineOptions.margin.left ? timeLineOptions.margin.left : 40
        } : {top: 20, right: 50, bottom: 50, left: 50};

        this.height = timeLineOptions.height ? timeLineOptions.height : 600;
        this.xticks = timeLineOptions.xticks ? timeLineOptions.xticks : 10;
        this.yticks = timeLineOptions.yticks ? timeLineOptions.yticks : 10;
        this.xtext = timeLineOptions.xtext ? timeLineOptions.xtext : "";
        this.ytext = timeLineOptions.ytext ? timeLineOptions.ytext : "";
        this.headerOptions = timeLineOptions.headerOptions == false ? timeLineOptions.headerOptions : true;

        this.randomIdString = Math.floor(Math.random() * 10000000000);
        this.isheader = timeLineOptions.isheader == false ? timeLineOptions.isheader : true;
        
        timeLineOptions.show_YAxis = timeLineOptions.show_YAxis == false ? timeLineOptions.show_YAxis : true;
        timeLineOptions.show_XAxisPath = timeLineOptions.show_XAxisPath == false ? timeLineOptions.show_XAxisPath : true;
        timeLineOptions.show_YAxisPath = timeLineOptions.show_YAxisPath == false ? timeLineOptions.show_YAxisPath : true;
        timeLineOptions.show_XAxisTicks = timeLineOptions.show_XAxisTicks == false ? timeLineOptions.show_XAxisTicks : true;
        timeLineOptions.show_YAxisTicks = timeLineOptions.show_YAxisTicks == false ? timeLineOptions.show_YAxisTicks : true;
        timeLineOptions.circleColor = timeLineOptions.circleColor? timeLineOptions.circleColor : '#49D2D9';
        timeLineOptions.grid_Y=timeLineOptions.grid_Y?timeLineOptions.grid_Y:false;
        timeLineOptions.localLanguageDate =timeLineOptions.localLanguageDate?timeLineOptions.localLanguageDate:'Date'
        timeLineOptions.localLanguageError =timeLineOptions.localLanguageError?timeLineOptions.localLanguageError:'Error'
    } else {
        return false;
    }
    var _this = this;
    var actualOptions = jQuery.extend(true, {}, timeLineOptions);
    var randomSubstring = this.randomIdString;
    var data = this.data;
    this.uri1 = timeLineOptions.uri1;
    this.uri2 = timeLineOptions.uri2;
    this.timeLineHeader = timeLineOptions.header ? timeLineOptions.header : "TIME LINE CHART";
    var h1 = this.height;
    var h = parseInt(h1);
    var modalwidth = $(window).width() - 200;
    var modal = ' <div id="modal_' + randomSubstring + '"class="modal fade " tabindex="-1" role="dialog"> <div class="modal-dialog modal-lg" style="width:' + modalwidth + 'px"> <form ><div class="modal-content"><div class="modal-body"  style="padding:0;background-color:#334d59" id="modal_chart_container' + randomSubstring + '"></div></div></form></div></div>';
    
    if(timeLineOptions.container != '#autodeskTimeline'){
    var chartContainerdiv = '<div class="chartContainer"  align="center" style="overflow:hidden;width: 100%; margin: auto; margin-top: 0px; font-size: 14px;font-style: inherit;"> <div class="graphBox" style="height:' + h + 'px;max-height: ' + h + 'px;min-height: ' + h + 'px;margin: auto; background-color: transparent; width: 100%;left: 0px;top: 0px;position: relative;"> <div class="headerDiv" style="font-weight:bold;background-color: #425661;text-align: left;color: #239185; border-bottom: 1px solid rgba(192, 192, 192, 0.47);width: 100%; line-height: 2.5;font-size: 16px ;padding-left: 5px;">' + this.timeLineHeader + '</div><div id="timeLine_chart_div' + randomSubstring + '" class="chartContentDiv" style="width: 100%;"></div> </div></div>'
    }else{
    	var chartContainerdiv = '<div class="chartContainer"  align="center" style="overflow:hidden;width: 100%; margin: auto; margin-top: 0px; font-size: 14px;font-style: inherit;"> <div class="graphBox" style="height: auto;max-height: ' + h + 'px;min-height: auto;margin: auto; background-color: transparent; width: 100%;left: 0px;top: 0px;position: relative;"> <div class="headerDiv" style="font-weight:bold;background-color: #425661;text-align: left;color: #239185; border-bottom: 1px solid rgba(192, 192, 192, 0.47);width: 100%; line-height: 2.5;font-size: 16px ;padding-left: 5px;">' + this.timeLineHeader + '</div><div id="timeLine_chart_div' + randomSubstring + '" class="chartContentDiv" style="width: 100%;"></div> </div></div>'
    }

    /* var chartContainerdiv = '<div class="chartContainer"  align="center" style="width: 80%; margin: auto; margin-top: 30px; font-size: 14px;font-style: inherit;"> <div class="graphBox" style="margin: auto; background-color: #374c59; width: 100%;left: 0px;top: 0px;overflow: hidden;position: relative;"> <div class="headerDiv" style="font-weight:bold;background-color: #425661;text-align: left;color: #239185; border-bottom: 1px solid rgba(192, 192, 192, 0.47);width: 100%; line-height: 2.5;font-size: 16px ;padding-left: 5px;">' + this.timeLineHeader + '</div><div id="timeLine_chart_div' + randomSubstring + '" class="chartContentDiv" style="width: 100%;"></div> </div></div>' */
    $(this.container).html(chartContainerdiv);
    $(this.container).append(modal);
    var chart_container = "#timeLine_chart_div" + randomSubstring;
   
    this.width = timeLineOptions.width ? timeLineOptions.width : $(chart_container).width();
    var tool_tip = $('body').append('<div class="TimeScale_Bubble_Chart_tooltip1" style="z-index:1234567;position: absolute; opacity: 1; pointer-events: none; visibility: hidden;display:none;background-color:#0cae96;padding: 10px;border-radius: 5px;border: 1px solid gray;font-size: 10px;color:black;"><span style=" font-size: 12px; position: absolute; white-space: nowrap;  margin-left: 0px; margin-top: 0px; left: 8px; top: 8px;"><span style="font-size:10px" class="tool_tip_x_val"></span><table><tbody><tr><td style="padding:0"> </td><td style="padding:0"><b>216.4 mm</b></td></tr><tr><td style="color:#434348;padding:0">New York: </td><td style="padding:0"><b>91.2 mm</b></td></tr><tr><td style="color:#90ed7d;padding:0">London: </td><td style="padding:0"><b>52.4 mm</b></td></tr><tr><td style="color:#f7a35c;padding:0">Berlin: </td><td style="padding:0"><b>47.6 mm</b></td></tr></tbody></table></span></div>');
    var current_uri1 = this.uri1;
    var current_uri2 = this.uri2;
    var timeline_header = this.timeLineHeader;
    var colorScale = d3.scaleOrdinal().range(timeScaleValues.colors);
    var containerid = this.container;
    if (!this.headerOptions) {
        var closebtn = '<button type="button" class="cancel" style="float: right;padding:0 8px;border:0;opacity: 1;background-color: transparent;float:right" data-dismiss="modal" aria-label="Close"> <span class="fa fa-remove"></span></button>'
        $(chart_container).siblings(".headerDiv").append(closebtn);
    }
    if ($(chart_container).siblings(".headerDiv").find(".bstheme_menu_button").length == 0)
        var header_options = '<div style="float: right; padding: 0 10px; cursor: pointer;" class="bstheme_menu_button bstheme_menu_button_' + randomSubstring + '" data-toggle="collapse" data-target="#opt_' + randomSubstring + '"><i class="fa fa-ellipsis-v" aria-hidden="true"></i><div class="bstheme_options" style="position:absolute;right:10px;z-index:2000"> <div style="display:none; min-width: 120px; margin-top: 2px; background: rgb(27, 39, 53) none repeat scroll 0% 0%; border: 1px solid rgb(51, 51, 51); border-radius: 4px;" id="opt_' + randomSubstring + '" class="collapse"><span style="display: inline-block;float: left;text-align: center;width: 33.33%; border-right: 1px solid #000;" class="header_fullscreen_chart' + randomSubstring + '"><i class="fa fa-expand" aria-hidden="true"></i></span><span style="display: inline-block;float: left;text-align: center;width: 33.33%; border-right: 1px solid #000;" class="header_refresh_' + randomSubstring + '"><i class="fa fa-refresh" aria-hidden="true"></i></span> <span style="display: inline-block;float: left;text-align: center;width: 33.33%;" class="header_table_' + randomSubstring + '"> <i class="fa fa-table" aria-hidden="true"></i></span> <span style="display: none;float: left;text-align: center;width: 33.33%;" class="header_chart_' + randomSubstring + '" ><i class="fa fa-bar-chart" aria-hidden="true"></i></span></div></div> </div>';
    $(chart_container).siblings(".headerDiv").append(header_options);
    if(!this.isheader){
    	 $(chart_container).siblings(".headerDiv").css("display","none")
    }
    if (!this.headerOptions) {
        $(chart_container).siblings(".headerDiv").find(".bstheme_options").css("right", "28px");
        $('.header_fullscreen_chart' + randomSubstring).css("display", "none");
    } else {
        $(chart_container).siblings(".headerDiv").find(".bstheme_options").css("right", "0");
    }
    var data = this.data,
            margin = this.margin,
            width = this.width - margin.left - margin.right,
            height = this.height - margin.top - margin.bottom;

    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    var parseTime = d3.timeFormat("%b %d");
    var maxSize = d3.max(data, function (d) {
        return d.size;
    })
    var svg = d3.select(chart_container)
            .append("svg")
            .attr('height', this.height)
            .attr('width', this.width)
            .attr('id', 'mainSvg-' + randomSubstring);
    /*define main group */
    var g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr('id', 'mainGroup-' + randomSubstring);

    x.domain(d3.extent(data, function (d) {
        return new Date(d.date);
    }));
    var ydomain = d3.extent(data, function (d) {
        return d.size;
    })
    y.domain(ydomain).nice();
/*    var ymin= y.invert(maxSize);
    y.domain(ymin,ydomain[1]) */
    plottimescaleBubbleChart(data);
    function plottimescaleBubbleChart(data) {

        /* Add the x Axis */
        var x_g = g.append("g")
                .attr("transform", "translate(0," + height + ")")
                .attr("class", "axis")
                .call(d3.axisBottom(x).ticks(_this.xticks).tickFormat(d3.timeFormat("%b %d")))
        x_g.append("text")
                .attr("transform", "translate(" + (width / 2) + "," + 30 + ")")
                .attr("x", timeScaleValues.xAxisTextX).attr("y", timeScaleValues.xAxisTextY)
                .attr("dx", timeScaleValues.xAxisTextDX)
                .style("text-anchor", "middle")
                .style("fill", "#6c7e88")
                .text(_this.xtext).style("font-size", "14px");

	        x_g.selectAll("path").style("stroke", "#6c7e88")
	                .style("shape-rendering", "crispEdges")
	                .style("fill", "none")
	                .style("display", function () {
	                        return timeLineOptions.show_XAxisPath ? 'block' : 'none';
	                    });
	        x_g.selectAll("line").style("stroke", "#6c7e88")
		            .style("shape-rendering", "crispEdges")
		            .style("fill", "none")
		             .style("display", function () {
	                        return timeLineOptions.show_XAxisTicks ? 'block' : 'none';
	                    });
       
        x_g.selectAll("text").style("fill", "#6c7e88")
                .style("font-size", "10px")
                .style("stroke", "none");

        /* Add the y Axis */
        if(timeLineOptions.grid_Y){
            var grid_y =svg.append("g")			
            .attr("class", "grid")
            .attr("transform", "translate(" + margin.left + ",20)")
            .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat("")
            )
            grid_y.selectAll("path").style("stroke", "#6c7e88")
            .style("shape-rendering", "crispEdges")
            .style("fill", "none")
            .style("display", function () {
                return timeLineOptions.show_YAxisPath ? 'block' : 'none';
            });
        }
       
	        var y_g = g.append("g")
	        		 .style("display", function () {
	                        return timeLineOptions.show_YAxis ? 'block' : 'none';
	                    })
	                .call(d3.axisLeft(y).ticks(_this.yticks)).attr("class", "axis")
	                .style("stroke", "#6c7e88");
	        y_g.append("text")
	                .attr("transform", "rotate(-90)")
	                .attr("y", -margin.left)
	                .attr("dy", timeScaleValues.yAxisTextDY)
	                .attr("dx", timeScaleValues.yAxisTextdx)
	                .style("text-anchor", "end")
	                .style("fill", "#6c7e88")
	                .text(_this.ytext).style("font-size", "14px");
	        y_g.selectAll("text").style("fill", "#6c7e88")
	                .style("font-size", "10px")
	                .style("stroke", "none");
	        y_g.selectAll("path").style("stroke", "#6c7e88")
	                .style("shape-rendering", "crispEdges")
                    .style("fill", "none")
                    .style("display", function () {
                        return timeLineOptions.show_YAxisPath ? 'block' : 'none';
                    });
	        y_g.selectAll("line").style("stroke", "#6c7e88")
	                .style("shape-rendering", "crispEdges")
                    .style("fill", "none")
                    .style("display", function () {
                        return timeLineOptions.show_YAxisTicks ? 'block' : 'none';
                    });
                  
        var circleOpacity = '0.4';
        if(timeLineOptions.container == '#autodeskTimeline'){
	        var colorsArray = ['#5E4A91', '#5E883E', '#843F90', '#A69636', '#C03A77', '#4866AA', '#BF4541', '#64C068'];
	        var colorScale = d3.scaleOrdinal().range(colorsArray);
        }
        
        g.selectAll("circle")
                .data(data)
                .enter()
                .insert("circle")
                .attr("fill", function(d){
                	 if(timeLineOptions.container == '#autodeskTimeline'){
                		 circleOpacity = '0.6';
                		 return colorScale(d.entityName);
                	 }else{
                		 return timeLineOptions.circleColor;
                	 }
                })
                .style("opacity", circleOpacity)
                .style("pointer-events", "all")
                .style("cursor", function(d){
                	if(timeLineOptions.container == '#autodeskTimeline'){
                		return "pointer";
                	}
                })
                .on('click', function(d){
                	if(timeLineOptions.container == '#autodeskTimeline'){
                		window.pushFilters(d.entityName, false, 'attackType', 'notLocation', 'selectedAttackType', 'locationMultipleEnd');
                		 /* hide tool-tip */
                        $(".TimeScale_Bubble_Chart_tooltip1").css("display", "none");
                        return $(".TimeScale_Bubble_Chart_tooltip1").css("visibility", "hidden");
                	}
                })
                .on("mouseover", function (d) {
                    $(this).css("opacity", 1);
                    var date = new Date(d.date);
                    if(timeLineOptions.container == '#autodeskTimeline'){
                    	$(".TimeScale_Bubble_Chart_tooltip1").html('<span><span style="color:#000;">' +timeLineOptions.localLanguageDate +':</span> ' + d.formattedDate + '</span>' + '<span><span style="color:#000;"> CLASSIFICATION :</span> ' + d.entityName + '</span><span><span style="color:#000;"> NUMBER OF INCIDENTS :</span> ' + d.formattedCount + '</span>');
                    }else{
	                    var valueStr = '';
	                    if (d.size != undefined) {
                            if(timeLineOptions.container == '#errorBubbleChart'){
	                            valueStr = '<br><span><span style="color:#000;">'+timeLineOptions.localLanguageError+' COUNT :</span> ' + d.size + '</span>'
                            }
                            else{
	                            valueStr = '<br><span><span style="color:#000;">SIMILARITY PERCENT :</span> ' + d.size + '</span><br><span>NAME : '+d.entityName+'</span>'
                            }
	                    }
	                    $(".TimeScale_Bubble_Chart_tooltip1").html('<span><span style="color:#000;">' +timeLineOptions.localLanguageDate +':</span> ' + date.toLocaleDateString()  + '</span>' + valueStr);
                    }
                    
                    $(".TimeScale_Bubble_Chart_tooltip1").css("display", "block");
                    return $(".TimeScale_Bubble_Chart_tooltip1").css("visibility", "visible");
                })
                .on("mousemove", function () {
                	var p=$(chart_container)
                	var position=p.offset();
                	var windowWidth=window.innerWidth;
                	var tooltipWidth=$(".TimeScale_Bubble_Chart_tooltip1").width()+50
                	var cursor=d3.event.x;
                   	if((position.left<d3.event.pageX)&&(cursor>tooltipWidth)){
                   		var element = document.getElementsByClassName("TimeScale_Bubble_Chart_tooltip1");
                   		element[0].classList.remove("tooltip-left");
            			element[0].classList.add("tooltip-right");
	               		$(".TimeScale_Bubble_Chart_tooltip1").css("left",(d3.event.pageX - 15-$(".TimeScale_Bubble_Chart_tooltip1").width()) + "px");
	                }else{
	                	var element =document.getElementsByClassName("TimeScale_Bubble_Chart_tooltip1");
	                	element[0].classList.remove("tooltip-right");
               		    element[0].classList.add("tooltip-left");
               		    $(".TimeScale_Bubble_Chart_tooltip1").css("left", (d3.event.pageX + 10) + "px");
	           
                	}
           		 //   $(".TimeScale_Bubble_Chart_tooltip1").css("left",position.left + "px");
                   return $(".TimeScale_Bubble_Chart_tooltip1").css("top",d3.event.pageY + "px")
   	
                })
                .on("mouseout", function () {
                	if(timeLineOptions.container == '#autodeskTimeline'){
                		$(this).css("opacity", 0.6);
                	}else {
                		$(this).css("opacity", 0.4);
                	}
                    /* hide tool-tip */
                    $(".TimeScale_Bubble_Chart_tooltip1").css("display", "none");
                    return $(".TimeScale_Bubble_Chart_tooltip1").css("visibility", "hidden");
                })

                .attr("cx", function (d) {
                    return x(new Date(d.date));
                })
                .attr("r", function (d) {
                	if(timeLineOptions.container == '#autodeskTimeline'){
                		var domainX = timeLineOptions['domain'] ? timeLineOptions['domain']['x'] : 10;
                		var domainY = timeLineOptions['domain'] ? timeLineOptions['domain']['y'] : 5000;
                		var sizeScale = d3.scaleLinear().domain([domainX,domainY]).range([5,15]);
                		return sizeScale(d.size);
                	}else{
                		return (d.size);
                	}
                })
                .attr("cy", 0)
                .transition().duration(timeScaleValues.bubbleDuration).ease(d3.easeLinear)
                .attr("cy", function (d) {
                    return y(d.size)
                })
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
            $(containerid).empty();
            timescaleBubble(actualOptions);
        }
    });
    /**
     * Function to handle show hide of header options
     */
    $("body").on("click", ".header_table_" + randomSubstring, function () {
        var a = parseInt(h / 55);

        $(chart_container).empty();

        $(this).css("display", "none");
        $(".header_chart_" + randomSubstring).css("display", "inline-block");

        var tbl = "<div id ='timescale_table_" + randomSubstring + "' style='overflow:hidden;background-color:#374C59;padding:5px;width:100%;height:" + (_this.height) + "px'><table id='timescale_table1_" + randomSubstring + "' class='table table-striped' style='width:100%;background-color:#283C45;padding:5px;color:#5A676E;' ><thead><tr><th>Date</th><th>Value</th></tr></thead><tbody>";
        $.each(data, function (index, value) {
            tbl = tbl + "<tr><td>" + value.date + "</td><td>" + value.size + "</td></tr>"

        });
        tbl = tbl + "</tbody></table></div>";
        $(chart_container).append(tbl);
        $('#timescale_table1_' + randomSubstring).DataTable({"bLengthChange": false, "paging": false, "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                if (iDisplayIndex % 2 == 1) {
                    $('td', nRow).css('background-color', '#32464F');
                } else {
                    $('td', nRow).css('background-color', '#283C45');
                }
            }});

        $("#timescale_table_" + randomSubstring).mCustomScrollbar({
            axis: "y"
        });

        $("#timescale_table_" + randomSubstring + " tr:even").css("background-color", "#32464F");
        $("#timescale_table_" + randomSubstring + " tr:odd").css("background-color", "#283C45");
        $("#timescale_table_" + randomSubstring + " tr:first").css("background-color", "#0CB29A");

        var id1 = $("#timescale_table_" + randomSubstring).children('div').find('div').eq(0);
        var id2 = $("#timescale_table_" + randomSubstring).children('div').find('div').eq(1);
        var id3 = $("#timescale_table_" + randomSubstring).children('div').find('div').eq(2);
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
        });
    });
    /**
     * Function to handle show hide of header options
     */
    $("body").on("click", ".header_chart_" + randomSubstring, function () {
        $(chart_container).css("overflow", "hidden");
        var chartId = $(this).parent().parent().parent().parent().siblings("div").attr("id");
        if ("#" + chartId == chart_container) {
            $(this).css("display", "none");
            $(".header_table_" + randomSubstring).css("display", "inline-block");
            $(containerid).empty();
            new timescalebubbleChart(actualOptions);
        }
    });

    $("body").on("click", ".header_fullscreen_chart" + randomSubstring, function () {
        $("#modal_" + randomSubstring).modal('show');
        var options = jQuery.extend(true, {}, actualOptions);
        setTimeout(function () {
            $("#modal_chart_container" + randomSubstring).css("width", "100%")
            options.container = "#modal_chart_container" + randomSubstring;
            options.headerOptions = false;
            options.height = 450;
            new timescalebubbleChart(options);
        }, 500)
    })
    // gridlines in y axis function
    function make_y_gridlines() {		
        return d3.axisLeft(y)
            .ticks(5)
    }
}

var TimeScaleBubbleChartModule = new TimeScaleBubbleChart();

export {
    TimeScaleBubbleChartModule
};