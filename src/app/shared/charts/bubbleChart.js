/* Bubble chart constant values */
const BubbleConst = {
	bubbleHeight: 600,
	bubbleHeader: "BUBBLE CHART",
	colors: ["#46a2de", "#5888C8", "#31d99c", "#de5942", "#ffa618"],
	dy: ".35em",
	radius: 30
}
function bubbleChart(bubbleOptions) {
    if (bubbleOptions.container) {
        $(bubbleOptions.container).empty();
    }
    //--------------------------Initialize Values-----------------------------
    if (bubbleOptions) {
        this.container = bubbleOptions.container ? bubbleOptions.container : "body"
        this.data = (bubbleOptions.data) ? bubbleOptions.data : []
        this.height = bubbleOptions.height ? bubbleOptions.height : BubbleConst.bubbleHeight;
        this.uri = bubbleOptions.uri;
        this.bubbleHeader = bubbleOptions.header ? bubbleOptions.header : BubbleConst.bubbleHeader;

        this.randomIdString = Math.floor(Math.random() * 10000000000);
        this.isBackground = bubbleOptions.isBackground ==false?false:true;

        this.headerOptions = bubbleOptions.headerOptions == false ? bubbleOptions.headerOptions : true;
        this.isheader= bubbleOptions.isheader == false ? bubbleOptions.isheader : true;

    } else {
        
        return false;
    }
var actualOptions = jQuery.extend(true, {}, bubbleOptions);

    var randomSubstring = this.randomIdString;
    var h = this.height+50;

    var header=this.bubbleHeader;
     var containerid = this.container;
     var _this = this;
    var modalwidth = $(window).width() - 200;
    var modal = ' <div id="modal_' + randomSubstring + '"class="modal fade " tabindex="-1" role="dialog"> <div class="modal-dialog modal-lg" style="width:' + modalwidth + 'px"> <form ><div class="modal-content"><div class="modal-body"  style="padding:0;background-color:#334d59" id="modal_chart_container' + randomSubstring + '"></div></div></form></div></div>';
   //var chartContainerdiv = '<div class="chartContainer"  align="center" style="width: 100%; margin: auto; margin-top: 0px; font-size: 14px;font-style: inherit;"> <div class="graphBox" style="height:'+h+'px;max-height: '+h+'px;min-height: '+h+'px;margin: auto; background-color: #374c59; width: 100%;left: 0px;top: 0px;position: relative;"> <div class="headerDiv" style="font-weight:bold;background-color: #425661;text-align: left;color: #239185; border-bottom: 1px solid rgba(192, 192, 192, 0.47);width: 100%; line-height: 2.5;font-size: 16px ;padding-left: 5px;">' + header + '</div><div id="bubble_chart_div' + randomSubstring + '" class="chartContentDiv" style="width: 100%;"></div> </div></div>'
  // var chartContainerdiv = '<div class="chartContainer"  align="center" style="width: 80%; margin: auto; margin-top: 30px; font-size: 14px;font-family: roboto-regular;"> <div class="graphBox" style="margin: auto; background-color: #374c59; width: 100%;left: 0px;top: 0px;overflow: hidden;position: relative;"> <div class="headerDiv" style="font-weight:bold;background-color: #425661;text-align: left;color: #239185; border-bottom: 1px solid rgba(192, 192, 192, 0.47);width: 100%; line-height: 2.5;font-size: 16px ;padding-left: 5px;">' + this.bubbleHeader + '</div><div id="bubble_chart_div' + randomSubstring + '" class="chartContentDiv" style="width: 100%;"></div> </div></div>'
   
 	if(!bubbleOptions.isBackground){
 		var chartContainerdiv = '<div class="chartContainer"  align="center" style="width: 100%; margin: auto; margin-top: 0px; font-size: 14px;font-style: inherit;"> <div class="graphBox" > <div class="headerDiv" style="font-weight:bold;background-color: #425661;text-align: left;color: #239185; border-bottom: 1px solid rgba(192, 192, 192, 0.47);width: 100%; line-height: 2.5;font-size: 16px ;padding-left: 5px;">' + header + '</div><div id="bubble_chart_div' + randomSubstring + '" class="chartContentDiv" style="width: 100%;"></div> </div></div>'

	}else{
		 var chartContainerdiv = '<div class="chartContainer"  align="center" style="width: 100%; margin: auto; margin-top: 0px; font-size: 14px;font-style: inherit;"> <div class="graphBox" style="height:' + h + 'px;max-height: ' + h + 'px;min-height: ' + h + 'px;margin: auto; background-color: #374c59; width: 100%;left: 0px;top: 0px;position: relative;"> <div class="headerDiv" style="font-weight:bold;background-color: #425661;text-align: left;color: #239185; border-bottom: 1px solid rgba(192, 192, 192, 0.47);width: 100%; line-height: 2.5;font-size: 16px ;padding-left: 5px;">' + header + '</div><div id="bubble_chart_div' + randomSubstring + '" class="chartContentDiv" style="width: 100%;"></div> </div></div>'

	}
    $(containerid).html(chartContainerdiv);
      $(containerid).append(modal);
    var chart_container = "#bubble_chart_div" + randomSubstring;
    this.width = bubbleOptions.width ? bubbleOptions.width : $(chart_container).width() - 10;
    if (this.height > this.width) {
        this.height = this.width
    }

    this.diameter = this.height > this.width ? this.width - 50 : this.height - 50;
     if (!this.headerOptions) {
        var closebtn = '<button type="button" class="cancel" style="float: right;padding:0 8px;border:0;opacity: 1;background-color: transparent;float:right" data-dismiss="modal" aria-label="Close"> <span class="fa fa-remove"></span></button>'
        $(chart_container).siblings(".headerDiv").append(closebtn);
    }

    if ($(chart_container).siblings(".headerDiv").find(".bstheme_menu_button").length == 0){
       
	  var header_options = '<div style="float: right; padding: 0 10px; cursor: pointer;" class="bstheme_menu_button bstheme_menu_button_' + randomSubstring + '" data-toggle="collapse" data-target="#opt_' + randomSubstring + '"><i class="fa fa-ellipsis-v" aria-hidden="true"></i><div class="bstheme_options" style="position:absolute;right:10px;z-index:2000"> <div style="display:none;" id="opt_' + randomSubstring + '" class="collapse"><span class="header_fullscreen_chart' + randomSubstring + '"><i class="fa fa-expand" aria-hidden="true"></i></span><span class="header_refresh_' + randomSubstring + '"><i class="fa fa-refresh" aria-hidden="true"></i></span> <span class="header_table_' + randomSubstring + '"> <i class="fa fa-table" aria-hidden="true"></i></span> <span class="header_chart_' + randomSubstring + '" style="display:none" ><i class="fa fa-bar-chart" aria-hidden="true"></i></span></div></div> </div>';
	    $(chart_container).siblings(".headerDiv").append(header_options);
    }
      if (!this.headerOptions) {
        $(chart_container).siblings(".headerDiv").find(".bstheme_options").css("right", "28px");
        $('.header_fullscreen_chart' + randomSubstring).css("display", "none");
    } else {
        $(chart_container).siblings(".headerDiv").find(".bstheme_options").css("right", "0");
    }
      if(!this.isheader){
    	  $(chart_container).siblings(".headerDiv").css("display","none");
      }
    root = this.data;


    //  $(".graphBox").mCustomScrollbar({
    //     axis: "y",
    //    //theme: "3d"
    // });
    var data = this.data;
    var curretn_uri = this.Uri;
    var bubble_header = this.bubbleHeader;
    var tool_tip = $('body').append('<div class="Bubble_Chart_tooltip" style="position: absolute;z-index: 99999;opacity: 1; pointer-events: none; display:none;text-transform:uppercase;background-color:#0cae96;  padding: 10px;border-radius: 5px; border: 1px solid gray;font-size: 10px;color:black;"><span style=" font-size: 12px; position: absolute; white-space: nowrap;  margin-left: 0px; margin-top: 0px; left: 8px; top: 8px;"><span style="font-size:10px" class="tool_tip_x_val"></span><table><tbody><tr><td style="padding:0"> </td><td style="padding:0"><b>216.4 mm</b></td></tr><tr><td style="color:#434348;padding:0">New York: </td><td style="padding:0"><b>91.2 mm</b></td></tr><tr><td style="color:#90ed7d;padding:0">London: </td><td style="padding:0"><b>52.4 mm</b></td></tr><tr><td style="color:#f7a35c;padding:0">Berlin: </td><td style="padding:0"><b>47.6 mm</b></td></tr></tbody></table></span></div>');
    var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    var colorScale = d3.scaleOrdinal().range(BubbleConst.colors);
    var width = this.width,
            height = this.height,
            diameter = this.diameter,
            x = d3.scaleLinear().range([0, diameter]),
            y = d3.scaleLinear().range([0, diameter]),
            node,
            root;
    var pack = d3.pack()
            .size([diameter, diameter])

    var vis = d3.select(chart_container).append("svg:svg")
//            .style({ "-webkit-touch-callout": "none","-webkit-user-select": "none",  "-khtml-user-select": "none","-moz-user-select": "none", "-ms-user-select": "none", "user-select": "none"})
            .attr("width", width)
            .attr("height", height)
            .append("svg:g")
            .attr("transform", "translate(" + (width - diameter) / 2 + "," + (height - diameter) / 2 + ")")
		    .call(d3.zoom().scaleExtent([0.5, 40])
		                   .translateExtent([[-100, -100], [width + 90, height + 100]]).on("zoom", redraw))
                           .append("g");	
    
    	plotBubbleChart(data);


  //Redraw for zoom
  function redraw() {
    vis.attr("transform", d3.event.transform)
  }
    function plotBubbleChart(data) {

        node = root = d3.hierarchy(data)
                .sum(function (d) {
                    return d.size;
                })
                .sort(function (a, b) {
                    return b.value - a.value;
                });

        var nodes = pack(root).descendants();

       var g= vis.selectAll("circle")
                .data(nodes)
                .enter().append("svg:circle")
//                .call(d3.zoom().on("zoom", function () {
//                	g.attr("transform", d3.event.transform)
//		        }))	
                .attr("class", function (d) {
                    return d.children ? "parent" : "child";
                })
                .attr("fill", function (d) {
                    if (d.parent) {
                        return colorScale(d.parent.data.name)
                    } else {
                        return "transparent";
                    }
                })
                .style("fill-opacity", function (d) {
                    if (!d.children) {
                        return 0.4
                    }
                })
                .style("fill", function (d) {
                    if (d.children) {
                        return "transparent";
                    }
                })
                .attr("opacity", function (d) {
                    if (d.parent && !d.children) {
                        return 0.5;
                    } else {
                        return 1;
                    }
                })
                .style("stroke", function (d) {

                    if (d.children && d.parent) {
                        return  colorScale(d.data.name)
                    } else if (d.parent && !d.children) {
                        return colorScale(d.parent.data.name);
                    }

                })

                .style("stroke-width", function (d) {
                    if (d.parent && !d.children) {
                        return 5;
                    } else {
                        return 7;
                    }
                })
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                })
                .attr("r", function (d) {
                    return d.r;
                })
                .on("click", function (d) {

                    return zoom(node == d ? root : d);
                    
                })
                
                .on("mouseover", function (d) {
                    $(this).css("opacity", 1);
                    var valueStr = '';
                    if (d.data.size) {
                    	valueStr = ': <span>' + d.data.size + '</span>'
                    }
                    if (d.parent) {
                    	$(".Bubble_Chart_tooltip").html('<span>' + d.data.name + '</span> ' + valueStr);
                    } else {
                    	$(".Bubble_Chart_tooltip").css("visibility", "hidden");
                    	 return $(".Bubble_Chart_tooltip").css("display", "none");
                    }
                    $(".Bubble_Chart_tooltip").css("visibility", "visible");
                    return $(".Bubble_Chart_tooltip").css("display", "block");
                })
                .on("mousemove", function () {
                	var p=$(chart_container)
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
                    $(this).css("opacity", 0.4);
                    //hide tool-tip
                    $(".Bubble_Chart_tooltip").css("visibility", "hidden");
                    return $(".Bubble_Chart_tooltip").css("display", "none");
                });


        vis.selectAll("text")
                .data(nodes)
                .enter().append("svg:text")

                .attr("class", function (d) {
                    return d.children ? "parent" : "child";
                })
                .style("pointer-events", "none")
                .style("font-size", "11px")
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("dy", BubbleConst.dy)
                .attr("text-anchor", "middle")
                .style("opacity", function (d) {
                    return d.r > BubbleConst.radius ? 1 : 0;
                })
                .text(function (d) {
                    if (!d.children)
                        return d.data.name;
                }).style("fill", function (d) {
            if (d.parent && !d.children) {
                return colorScale(d.parent.data.name);
            }
//                    return d.children? "red":"white";
        })


        vis.on("click", function () {
            zoom(root);
        });
        function zoom(d, i) {
            var k = diameter / d.r / 2;
            x.domain([d.x - d.r, d.x + d.r]);
            y.domain([d.y - d.r, d.y + d.r]);

            var t = vis.transition()
                    .duration(d3.event.altKey ? 7500 : 750);

            t.selectAll("circle")
                    .attr("cx", function (d) {
                        return x(d.x);
                    })
                    .attr("cy", function (d) {
                        return y(d.y);
                    })
                    .attr("r", function (d) {
                        return k * d.r;
                    });

            t.selectAll("text")
                    .attr("x", function (d) {
                        return x(d.x);
                    })
                    .attr("y", function (d) {
                        return y(d.y);
                    })
                    .style("opacity", function (d) {
                        return k * d.r > BubbleConst.radius ? 1 : 0;
                    });

            node = d;
            d3.event.stopPropagation();
        }

    }
    //------------------------------------------------------------------------------
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
//------------------------------------------------------------------------------
    /**
     * Fuction to handle show hide of header options
     */
    $("body").on("click", ".header_refresh_" + randomSubstring, function () {
        var chartId = $(this).parent().parent().parent().parent().siblings("div").attr("id");
        if ("#" + chartId == chart_container) {
            $(containerid).empty();
           
            chartBubble(actualOptions);
        }
    });
//------------------------------------------------------------------------------
    /**
     * Fuction to handle show hide of header options
     */

 $("body").on("click", ".header_table_" + randomSubstring, function () {
     //   var h = $(chartContainerdiv).height()
         
        $(chart_container).empty();
//        $(chart_container).css("overflow","auto");
        $(this).css("display", "none");
        $(".header_chart_" + randomSubstring).css("display", "inline-block");
        // var newdata=data.nodes;

        var tbl = "<div id ='bubbleChart_table_" + randomSubstring + "'  style='padding:5px;background-color: #425661;overflow:overflow:hidden;height:" + (_this.height) + "px'><table id ='bubbleChart_table1_" + randomSubstring + "' class='table table-striped ' style='width:100%;background-color:#283C45;padding:5px;color:#5A676E; ' ><thead><tr><th>NAME</th><th>VALUE</th><th>GROUP</th></tr></thead><tbody>";

       $.each(data.children,function(i,v){
         $.each(v.children, function (index, value) {
             tbl = tbl + "<tr><td>" + (value.name.toUpperCase()) + "</td><td>" + value.size + "</td><td>"+v.name+"</td></tr>"

        });
    });
        tbl = tbl + "</tbody></table></div>";
        $(chart_container).append(tbl);
        $("#bubbleChart_table1_" + randomSubstring).DataTable({"bLengthChange": false, "paging": false, "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                if (iDisplayIndex % 2 == 1) {
                    //even color
                    $('td', nRow).css('background-color', '#32464F');
                } else {
                    $('td', nRow).css('background-color', '#283C45');
                }
            }});
        $("#bubbleChart_table_" + randomSubstring).mCustomScrollbar({
            axis: "y"
        });

        $("#bubbleChart_table_" + randomSubstring + " tr:first").css("background-color", "#0CB29A");
        var id1 = $("#bubbleChart_table_" + randomSubstring).children('div').find('div').eq(0);
        var id2 = $("#bubbleChart_table_" + randomSubstring).children('div').find('div').eq(1);
        var id3 = $("#bubbleChart_table_" + randomSubstring).children('div').find('div').eq(2);
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








//------------------------------------------------------------------------------
    /**
     * Fuction to handle show hide of header options
     */
    $("body").on("click", ".header_chart_" + randomSubstring, function () {
         $(chart_container).css("overflow","hidden");
        var chartId = $(this).parent().parent().parent().parent().siblings("div").attr("id");
        if ("#" + chartId == chart_container) {
            $(this).css("display", "none");
            $(".header_table_" + randomSubstring).css("display", "inline-block");
            $(containerid).empty();
            new bubbleChart(actualOptions);
        }
    });

//------------------------------------------------------------------------------------------------

 $("body").on("click", ".header_fullscreen_chart" + randomSubstring, function () {
//       $("#modal_"+randomSubstring).modal("show");
        $("#modal_" + randomSubstring).modal('show');
        var options = jQuery.extend(true, {}, actualOptions);
        setTimeout(function () {
            $("#modal_chart_container" + randomSubstring).css("width", "100%")
            options.container = "#modal_chart_container" + randomSubstring;
            options.headerOptions = false;
            options.height = 450;
            new bubbleChart(options);
        }, 500)

        //"modal_chart_container"+randomSubstring
    })




}

