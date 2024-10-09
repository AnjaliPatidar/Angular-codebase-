/* collapse chart constant values */
const collapseConst = {
	colors: ["#46a2de", "#5888C8", "#31d99c", "#de5942", "#ffa618"],
	fullScreenDuration: 500
}
function collapseChart(collapseOptions) {
    if (collapseOptions.container) {
        $(collapseOptions.container).empty();
    }
    /*--------------------------Initialize Values-----------------------------*/
    if (collapseOptions) {
        this.container = collapseOptions.container ? collapseOptions.container : "body"
        this.data = (collapseOptions.data) ? collapseOptions.data : []
        this.height = collapseOptions.height ? collapseOptions.height : 600;
        this.uri = collapseOptions.uri;
        this.collapseHeader = collapseOptions.header ? collapseOptions.header : "FORCE COLLAPSE CHART";

        this.randomIdString = Math.floor(Math.random() * 10000000000);
        this.headerOptions = collapseOptions.headerOptions== false?collapseOptions.headerOptions:true;
    } else {
       
        return false;
    }
    var header = collapseOptions.header;
    var actualOptions = jQuery.extend(true, {}, collapseOptions);
    var randomSubstring = this.randomIdString;
    var hl = this.height
    var h = parseInt(hl) + 50;
    var _this = this;
    var modalwidth = $(window).width()-200;
    var modal = ' <div id="modal_' + randomSubstring + '"class="modal fade " tabindex="-1" role="dialog"> <div class="modal-dialog modal-lg" style="width:'+modalwidth+'px"> <form ><div class="modal-content"><div class="modal-body"  style="padding:0;background-color:#334d59" id="modal_chart_container' + randomSubstring + '"></div></div></form></div></div>';
    var chartContainerdiv = '<div class="chartContainer"  align="center" style="width: 100%; margin: auto; margin-top: 0px; font-size: 14px;font-style: inherit;"> <div class="graphBox" style="height:' + h + 'px;max-height: ' + h + 'px;min-height: ' + h + 'px;margin: auto; background-color: #374c59; width: 100%;left: 0px;top: 0px;position: relative;"> <div class="headerDiv" style="font-weight:bold;background-color: #425661;text-align: left;color: #239185; border-bottom: 1px solid rgba(192, 192, 192, 0.47);width: 100%; line-height: 2.5;font-size: 16px ;padding-left: 5px;">' + header + '</div><div id="collapse_chart_div' + randomSubstring + '" class="chartContentDiv" style="width: 100%;"></div> </div></div>'
    /* var chartContainerdiv = '<div class="chartContainer"  align="center" style="width: 80%; margin: auto; margin-top: 30px; font-size: 14px;font-style: inherit;"> <div class="dataBox" style="margin: auto; background-color: #374c59; width: 100%;left: 0px;top: 0px;overflow: hidden;position: relative;"> <div class="headerDiv" style="font-weight:bold;background-color: #425661;text-align: left;color: #239185; border-bottom: 1px solid rgba(192, 192, 192, 0.47);width: 100%; line-height: 2.5;font-size: 16px ;padding-left: 5px;">' + header + '</div><div id="bubble_chart_div' + randomSubstring + '" class="chartContentDiv" style="width: 100%;"></div> </div></div>' */
    $(this.container).html(chartContainerdiv);
    $(this.container).append(modal);
    var chart_container = "#collapse_chart_div" + randomSubstring;
    this.width = collapseOptions.width ? collapseOptions.width : $(chart_container).width() - 10;
    if (this.height > this.width) {
        this.height = this.width
    }

    this.diameter = this.height > this.width ? this.width - 50 : this.height - 50;
    
    if (!this.headerOptions) {
		var closebtn =  '<button type="button" class="cancel" style="float: right;padding:0 8px;border:0;opacity: 1;background-color: transparent;float:right" data-dismiss="modal" aria-label="Close"> <span class="fa fa-remove"></span></button>'
		$(chart_container).siblings(".headerDiv").append(closebtn);
    }
    if ($(chart_container).siblings(".headerDiv").find(".bstheme_menu_button").length == 0)
        var header_options = '<div style="float: right; padding: 0 10px; cursor: pointer;" class="bstheme_menu_button bstheme_menu_button_' + randomSubstring + '" data-toggle="collapse" data-target="#opt_' + randomSubstring + '"><i class="fa fa-ellipsis-v" aria-hidden="true"></i><div class="bstheme_options" style="position:absolute;right:10px;z-index:2000"> <div style="display:none;" id="opt_' + randomSubstring + '" class="collapse"><span class="header_fullscreen_chart' + randomSubstring + '"><i class="fa fa-expand" aria-hidden="true"></i></span><span class="header_refresh_' + randomSubstring + '"><i class="fa fa-refresh" aria-hidden="true"></i></span> <span class="header_table_' + randomSubstring + '"> <i class="fa fa-table" aria-hidden="true"></i></span> <span class="header_chart_' + randomSubstring + '" style="display:none" ><i class="fa fa-bar-chart" aria-hidden="true"></i></span></div></div> </div>';
    $(chart_container).siblings(".headerDiv").append(header_options);
   
      if (!this.headerOptions) {
          $(chart_container).siblings(".headerDiv").find(".bstheme_options").css("right","28px");
           $('.header_fullscreen_chart' + randomSubstring).css("display","none");
      }else{
          $(chart_container).siblings(".headerDiv").find(".bstheme_options").css("right","0");
      }

    $(".force_tooltip").remove();
    var tool_tip = $('body').append('<div class="force_tooltip" style="visibility:none;display:none"><span class="forced_tootip_next"><span class="tool_tip_x_val"></span><table><tbody><tr><td> </td><td><b>216.4 mm</b></td></tr><tr><td class="city-color-one">New York: </td><td><b>91.2 mm</b></td></tr><tr><td class="city-color-two">London: </td><td><b>52.4 mm</b></td></tr><tr><td class="city-color-three">Berlin: </td><td><b>47.6 mm</b></td></tr></tbody></table></span></div>');

    var data = this.data;
    var curretn_uri = this.Uri;
    var collapse_header = this.collapseHeader;
    var containerid = this.container;

    var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    var colorScale = d3.scaleOrdinal().range(collapseConst.colors);
    var width = this.width,
            height = this.height,
            diameter = this.diameter,
            node,
            root,
            radius = Math.min(width, height) / 2;

    var svg = d3.select(chart_container).append("svg:svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .append("svg:g")
            .attr("transform", "translate(" + width / 6 + "," + height / 6 + ")");

    var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function (d) {
                return d.id;
            }))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 3, height / 3));

    var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(data.links)
            .enter().append("line")
            .attr("stroke-width", function (d) {
                return Math.sqrt(d.value);
            })
            .style("stroke", "steelblue")
            .style("stroke-opacity", "0.6");

    var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(data.nodes)
            .enter().append("circle")
            .attr("r", 5)
            .attr("fill", function (d) {
                return colorScale(d.group);
            }).style("stroke", "#fff")
            .style("stroke-width", "1.5px")
            .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended)).on("mouseover", function (d) {


        $(".force_tooltip").html('<span> ' + d.id + '</span>');
        $(".force_tooltip").css("display", "block");
        return $(".force_tooltip").css("visibility", "visible");

        
    })
            .on("mousemove", function () {
                $(".force_tooltip").css("top", (d3.event.pageY - 10) + "px")
                return  $(".force_tooltip").css("left", (d3.event.pageX + 10) + "px");

            })
            .on("mouseout", function () {
            	  $(".force_tooltip").css("display", "none");
                return $(".force_tooltip").css("visibility", "hidden");
            });
    simulation
            .nodes(data.nodes)
            .on("tick", ticked);

    simulation.force("link")
            .links(data.links);

    function ticked() {
        link
                .attr("x1", function (d) {
                    return d.source.x;
                })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });

        node
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                });
    }


    function dragstarted(d) {
        if (!d3.event.active)
            simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active)
            simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
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
            new collapseChart(actualOptions);
        }
    });

    /**
     * Function to handle show hide of header options
     */
    $("body").on("click", ".header_table_" + randomSubstring, function () {

        var a = parseInt(hl / 55);

        $(chart_container).empty();
        $(this).css("display", "none");
        $(".header_chart_" + randomSubstring).css("display", "inline-block");

        var tbl = "<div id ='collapseChart_table_" + randomSubstring + "'   style='overflow:hidden;background-color:#374C59;padding:5px;width:100%;height:" + (_this.height) + "px'><table id ='collapse_table_" + randomSubstring + "'class='table-striped table-condensed' style='width:100%;padding:5px;background-color:#283C45;color:#5A676E;'><thead><tr><th>Label</th><th>Group</th></tr></thead><tbody>";
      
        $.each(data.nodes, function (i, v) {

            tbl = tbl + "<tr><td>" + (v.id.toUpperCase()) + "</td><td>" + v.group + "</td></tr>"

        });
        tbl = tbl + "</tbody></table></div>";
        $(chart_container).append(tbl);
        $("#collapse_table_" + randomSubstring).DataTable({"bLengthChange": false, "paging": false, "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                if (iDisplayIndex % 2 == 1) {
                    $('td', nRow).css('background-color', '#32464F');
                } else {
                    $('td', nRow).css('background-color', '#283C45');
                }
            }});
        $("#collapseChart_table_" + randomSubstring).mCustomScrollbar({
            axis: "y"
        });
        $("#collapse_table_" + randomSubstring + " tr:first").css("background-color", "#0CB29A");

        var id1 = $("#collapse_table_" + randomSubstring).children('div').find('div').eq(0);
        var id2 = $("#collapse_table_" + randomSubstring).children('div').find('div').eq(1);
        var id3 = $("#collapse_table_" + randomSubstring).children('div').find('div').eq(2);
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
        $(".dataTables_wrapper").css("background-color", "#374C59");
    });
    /**
     * Function to handle show hide of header options
     */
    $("body").on("click", ".header_chart_" + randomSubstring, function () {
        var chartId = $(this).parent().parent().parent().parent().siblings("div").attr("id");
        if ("#" + chartId == chart_container) {
            $(this).css("display", "none");
            $(".header_table_" + randomSubstring).css("display", "inline-block");
            $(containerid).empty();
            new collapseChart(actualOptions);
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
            new collapseChart(options);
        }, collapseConst.fullScreenDuration)
    })
}