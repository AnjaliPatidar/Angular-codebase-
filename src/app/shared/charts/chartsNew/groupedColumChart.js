/*--------------------------Store grouped chart Values-----------------------------*/
import * as $ from 'jquery';
import * as d3 from 'd3';
const groupedColumnValues = {
        //  colors: ["#f86520", "#fd9220", "#fac322", "#e7f921", "#E58B19"],
        xAxisTextX: 8,
        xAxisTextY: 10,
        xAxisTextDX: ".71em",
        yAxisTextDY: "1.1em",
        yAxisTextdx: -20,
        stackedChartDuration: 300,
        groupedBarsDuration: 300,
        clipPathDuration: 400,
        legendColor: "rgb(108, 126, 136)",
        barsX: 0,
        barsY: 0,
        scalesHeight: 0,
        scalesPadding: 0.2
}
function GroupedColumChart() { }
GroupedColumChart.prototype.groupedColumChart = function (barOptions) {
        if (barOptions.container) {
                $(barOptions.container).empty();
        }
        if (location.hash == "#!/alertDashboard" && (!barOptions.data || barOptions.data.length == 0)) {
                d3.select(barOptions.container).append("div").attr("class", "alertsDashErrorDiv").html("<span>Data Not Found</span>");
                return false;
        }
        /*--------------------------Initialize Values-----------------------------*/
        if (barOptions) {
                this.container = barOptions.container ? barOptions.container : "body"
                this.barColor = barOptions.barColor ? barOptions.barColor : "blue"
                this.readFromFile = (barOptions.readFromFile !== undefined) ? barOptions.readFromFile : false
                this.dataFileLocation = (barOptions.readFromFile !== undefined || barOptions.readFromFile) ? barOptions.dataFileLocation : undefined;
                this.data = (barOptions.data) ? barOptions.data : []
                this.showTicks = barOptions.showTicks ? barOptions.showTicks : true;
                this.ticks = barOptions.ticks ? barOptions.ticks : 'all';
                this.showLegends = (barOptions.showLegends !== undefined) ? barOptions.showLegends : false;
                this.xLabelRotation = barOptions.xLabelRotation ? barOptions.xLabelRotation : 0;
                this.yLabelRotation = barOptions.yLabelRotation ? barOptions.yLabelRotation : 0;
                this.margin = barOptions.margin ? {
                        top: barOptions.margin.top ? barOptions.margin.top : 20,
                        right: barOptions.margin.right ? barOptions.margin.right : 20,
                        bottom: barOptions.margin.bottom ? barOptions.margin.bottom : 30,
                        left: barOptions.margin.left ? barOptions.margin.left : 40
                } : { top: 20, right: 30, bottom: 20, left: 30 };

                this.showAxisX = (barOptions.showAxisX !== undefined) ? barOptions.showAxisX : true;
                this.showAxisY = (barOptions.showAxisY !== undefined) ? barOptions.showAxisY : true;
                this.showXaxisTicks = barOptions.showXaxisTicks !== undefined ? barOptions.showXaxisTicks : true;
                this.showYaxisTicks = barOptions.showYaxisTicks !== undefined ? barOptions.showYaxisTicks : true;
                this.groupedStacked = barOptions.groupedStacked ? barOptions.groupedStacked : "grouped";
                this.randomIdString = Math.floor(Math.random() * 10000000000);
                this.groupedColumnHeader = barOptions.header ? barOptions.header : "";
                this.height = barOptions.height ? barOptions.height : 600;
                this.ytext = barOptions.ytext ? barOptions.ytext : "Usability Rate";
                this.xtext = barOptions.xtext ? barOptions.xtext : "Vehical Model";
                this.legendColor = barOptions.legendColor ? barOptions.legendColor : false;
                this.headerOptionsExpand = barOptions.headerOptionsExpand == false ? barOptions.headerOptionsExpand : true;
                this.headerOptions = barOptions.headerOptions == false ? barOptions.headerOptions : true;
                this.isHeaer = barOptions.isHeaer == false ? barOptions.isHeaer : true;
                this.showlineaxisX = barOptions.showlineaxisX == false ? barOptions.showlineaxisX : true;
                this.showlineaxisY = barOptions.showlineaxisY == false ? barOptions.showlineaxisY : true;
                this.showgroupedstacked = barOptions.showgroupedstacked == false ? barOptions.showgroupedstacked : true;
                this.colors = barOptions.colors ? barOptions.colors : ["#f86520", "#fd9220", "#fac322", "#e7f921", "#E58B19"];
                this.islegends = barOptions.islegends ? barOptions.islegends : false;
                this.showxYTxt = barOptions.showxYTxt ? barOptions.showxYTxt : false;
                this.roundedBar = barOptions.roundedBar ? barOptions.roundedBar : "topRounded";
                this.rightSideYaxis =barOptions.rightSideYaxis ? barOptions.rightSideYaxis :false;
                this.appendTextOnBar =barOptions.appendTextOnBar ? barOptions.appendTextOnBar:false;
                this.gridYRightside =barOptions.gridYRightside ?barOptions.gridYRightside :false;
                this.gridY= barOptions.gridY ? barOptions.gridY:false;
        } else {
                return false;
        }
        var randomSubstring = this.randomIdString;
        var actualOptions = jQuery.extend(true, {}, barOptions);
        var _this = this;
        var h1 = this.height;
        var barWidth;
        if (!_this.showgroupedstacked) {
                var h = parseInt(h1)
        } else {
                var h = parseInt(h1) + 80;
        }
        var container = barOptions.container
        var type = barOptions.type
        var header = this.isHeaer ? this.groupedColumnHeader : "";

        var modalwidth = $(window).width() - 200;
        var modal = ' <div id="modal_' + randomSubstring + '"class="modal fade group-chart-modal" tabindex="-1" role="dialog"> <div class="modal-dialog modal-lg" style="width:' + modalwidth + 'px"><form><div class="modal-content"><div class="modal-body" id="modal_chart_container' + randomSubstring + '"></div></div></form></div></div>';
        var chartContainerdiv = '<div class="chart-container"><div class="graph-box-wrapper" style="height:' + h + 'px;max-height: ' + h + 'px;min-height: ' + h + 'px;background:transparent;"> <div class="chart-header-wrapper">' + header + '</div><div style="text-transform:uppercase" id="groupedColumn_chart_div' + randomSubstring + '" class="chart-content-wrapper"></div></div></div>'

        $(this.container).html(chartContainerdiv);
        $(this.container).append(modal);
        var chart_container = "#groupedColumn_chart_div" + randomSubstring;

        barOptions.width = barOptions.width ? barOptions.width : $(chart_container).width() - 10;
        var groupedStacked = this.groupedStacked;
        var margin = this.margin,
                width = barOptions.width - margin.left - margin.right,
                height = this.height - margin.top - margin.bottom,
                barColor = this.barColor;
        if (!this.headerOptionsExpand) {
                var closebtn = '<button type="button" class="cancel" data-dismiss="modal" aria-label="Close"><span class="fa fa-remove"></span></button>'
                $(chart_container).siblings(".chart-header-wrapper").append(closebtn);
        }
        if ($(chart_container).siblings(".chart-header-wrapper").find(".bstheme_menu_button").length == 0)
                var header_options = '<div class="btn-bstheme-menu bstheme_menu_button bstheme_menu_button_' + randomSubstring + '" data-toggle="collapse" data-target="#opt_' + randomSubstring + '"><i class="fa fa-ellipsis-v" aria-hidden="true"></i><div class="bstheme_options" style="position:absolute;right:10px;z-index:2000"> <div style="display:none;" id="opt_' + randomSubstring + '" class="collapse"><span class="header_fullscreen_chart' + randomSubstring + '"><i class="fa fa-expand" aria-hidden="true"></i></span><span class="header_refresh_' + randomSubstring + '"><i class="fa fa-refresh" aria-hidden="true"></i></span> <span class="header_table_' + randomSubstring + '"> <i class="fa fa-table" aria-hidden="true"></i></span> <span class="header_chart_' + randomSubstring + '" style="display:none" ><i class="fa fa-bar-chart" aria-hidden="true"></i></span></div></div> </div>';
        if (this.headerOptions)
                $(chart_container).siblings(".chart-header-wrapper").append(header_options);

        if (!this.headerOptionsExpand) {
                $(chart_container).siblings(".chart-header-wrapper").find(".bstheme_options").css("right", "28px");
                $('.header_fullscreen_chart' + randomSubstring).css("display", "none");
        } else {
                $(chart_container).siblings(".chart-header-wrapper").find(".bstheme_options").css("right", "0");
        }
        if (!_this.isHeaer) {
                $(chart_container).siblings(".chart-header-wrapper").css("border-bottom", "0");
                $(chart_container).siblings(".chart-header-wrapper").find(".bstheme_menu_button").remove();
        }
        /*--  append div for switching between stack and group  --*/
        if (groupedStacked == "grouped") {
                $(chart_container).append('<div class="switch-chart-wrapper"><form><label class="custom-radio"><input type="radio" name="mode" value="grouped" checked><span><i class="fa fa-circle"></i>Grouped</span></label><label class="custom-radio"><input type="radio" name="mode" value="stacked"><span><i class="fa fa-circle"></i>Stacked</span></label></form></div>');

        } else {
                $(chart_container).append('<div class="switch-chart-wrapper"><form><label class="custom-radio"><input type="radio" name="mode" value="grouped"><span><i class="fa fa-circle"></i>Grouped</span></label><label class="custom-radio"><input type="radio" name="mode" value="stacked" checked><span><i class="fa fa-circle"></i>Stacked</span></label></form></div>');
        }
        if (!_this.showgroupedstacked) {
                $(chart_container).find('form').css('display', 'none')
        }
        /*--  APPEND legend header  --*/
        if (_this.islegends == true) {
                $(".groupedbarlegendContainerDiv").remove();
                $(chart_container).parent().find(".chart-header-wrapper").append("<div class='groupedbarlegendContainerDiv legend-container' style='max-width:60%;text-transform:uppercase' id='legendContainer-" + (randomSubstring) + "'></div>")
        }
        /*--  define svg  --*/
        var svg = d3.select(chart_container)
                .append("svg")
                .attr('height', this.height)
                .attr('width', barOptions.width)
                .attr('id', 'mainSvg-' + randomSubstring);

        /*--  define tool tip  --*/
        $(".grouped-bar-tooltip").remove();
        var tool_tip = $('body').append('<div class="grouped-bar-tooltip" style="display:none;z-index: 99999;text-transform:uppercase"><span class="tooltip-text"><span class="tool-tip-x-val"></span><table><tbody><tr><td></td><td><strong>216.4 mm</strong></td></tr><tr><td>New York:</td><td><strong>91.2 mm</strong></td></tr><tr><td>London:</td><td><strong>52.4 mm</strong></td></tr><tr><td>Berlin: </td><td><strong>47.6 mm</strong></td></tr></tbody></table></span></div>');

        /*--  define  scales  --*/
        var x0 = d3.scaleBand().rangeRound([0, width]).paddingInner(0.2),
                y = d3.scaleLinear().rangeRound([height, groupedColumnValues.scalesHeight]),
                x1 = d3.scaleBand().padding(groupedColumnValues.scalesPadding);
        var colorScale = d3.scaleOrdinal().range(_this.colors);

        /*--  define main grounp  --*/
        var g = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr('id', 'mainGroup-' + randomSubstring);

        /*--  get bar data and check for existance  --*/
        var columnData = this.data;
        if (columnData) {
                if (columnData.length)
                        drawColumns(columnData, this.barColor);
        } else {
        }

        /*------------------------------------------------------------------------------*/
        /**
         * 
         * @param {array} data
         * @returns {undefined}Function to plot bars
         */
        function drawColumns(data) {
                function rectangle(x, y, width, height, radius) {
                        return "M" + (x + radius) + "," + y + "h" + (width - 2 * radius) + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius + "v" + (height - 2 * radius) + "v" + radius + "h" + -radius + "h" + (2 * radius - width) + "h" + -radius + "v" + -radius + "v" + (2 * radius - height) + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + -radius + "z";
                };
                var clip = g.append("defs").append("svg:clipPath")
                        .attr("id", "clip" + randomSubstring)
                        .append("svg:rect")
                        .attr("id", "clip-rect")
                        .attr("x", groupedColumnValues.barsX)
                        .attr("y", groupedColumnValues.barsY)
                        .attr("width", width)
                        .attr("height", height);

                /*--  get keys from object  --*/
                var keys = d3.keys(data[0]).slice(1);

                /*--  define stack for stacked bar  --*/
                var stack = d3.stack()
                        .keys(keys)
                        .offset(d3.stackOffsetNone);

                var layers = stack(data);

                /*--  defines domains  --*/
                x0.domain(data.map(function (d) {
                        return d.x;
                }));
                x1.domain(keys).rangeRound([0, x0.bandwidth()]);

                /*--  x-aixs  --*/
                if (_this.showAxisX) {
                        var x_g = g.append("g")
                                .attr("class", "axis axis--x")
                                .attr("transform", "translate(0," + height + ")")
                                .attr('id', 'xAxis-' + randomSubstring)
                                .call(d3.axisBottom(x0));
                        x_g.append("text")
                                .attr("transform", "translate(" + (width / 2) + "," + 30 + ")")
                                .attr("x", groupedColumnValues.xAxisTextX).attr("y", groupedColumnValues.xAxisTextY)
                                .attr("dx", groupedColumnValues.xAxisTextDX)
                                .style("text-anchor", "middle")
                                .style("fill", "#6c7e88")
                                .text(_this.xtext).style("font-size", "14px");
                        x_g.selectAll("path").style("stroke", "#6c7e88")
                                .style("shape-rendering", "crispEdges")
                                .style("fill", "none");
                        x_g.selectAll("line").style("stroke", "#6c7e88")
                                .style("shape-rendering", "crispEdges")
                                .style("fill", "none");

                        if (_this.xLabelRotation != 0 && _this.xLabelRotation != undefined) {
                                x_g.selectAll("text")
                                        .style("fill", "#6c7e88")
                                        .style("font-size", "10px")
                                        .style("stroke", "none")
                                        .style("text-anchor", "end")
                                        .attr("dx", "-.8em")
                                        .attr("dy", ".15em")
                                        .attr("transform", _this.xLabelRotation);
                        }
                        else {
                                x_g.selectAll("text").style("fill", "#6c7e88")
                                        .style("font-size", "10px").style("stroke", "none")
                        }

                }

                y.domain([0, d3.max(data, function (d) {
                        return d3.max(keys, function (key) {
                                return d[key];
                        });
                })]);

                if (!_this.showlineaxisX) {
                        $('.axis--x').find('.domain').css('display', 'none')
                        x_g.selectAll('line').remove();
                }
                /*--  y-aixs  --*/
                
                         // Add the Y1 Axis
                         if(barOptions.rightSideYaxis){
                                var y_g = g.append("g")
                                .attr("class", "axis axis--y")
                                .attr('id', 'yAxis-' + randomSubstring)
                                .attr("transform", "translate( " + width + ", 0 )")
                                .call(d3.axisRight(y).ticks(4, "s"));
                         } else{
                                var y_g = g.append("g")
                                .attr("class", "axis axis--y")
                                .attr('id', 'yAxis-' + randomSubstring)
                                .call(d3.axisLeft(y).ticks(4, "s"))
                         }
                         
                y_g.append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", -margin.left)
                        .attr("dy", groupedColumnValues.yAxisTextDY)
                        .attr("dx", groupedColumnValues.yAxisTextdx)
                        .style("text-anchor", "end")
                        .style("fill", "#6c7e88")
                        .text(_this.ytext).style("font-size", "14px");

                y_g.selectAll("path").style("stroke", "#6c7e88")
                        .style("shape-rendering", "crispEdges")
                        .style("fill", "none");
                y_g.selectAll("line").style("stroke", "#6c7e88")
                        .style("shape-rendering", "crispEdges")
                        .style("fill", "none");
                y_g.selectAll("text").style("fill", "#6c7e88")
                        .style("font-size", "10px")
                        .style("stroke", "none");
                        
 // add the Y gridlines
                if (barOptions.gridY) {
                        if (barOptions.gridYRightside) {
                                var Y_grid = g.append("g")
                                        .attr("class", "grid")
                                        .attr("transform", "translate( " + width + ", 0 )")
                                        .call(make_y_gridlines('right')
                                                .tickSize(-width)
                                                .tickFormat("")
                                        )
                                Y_grid.selectAll("path").style("stroke", "#6c7e88").style(
                                        "shape-rendering", "crispEdges").style("fill", "none").style(
                                                "opacity", 0.12)
                                Y_grid.selectAll("line").style("shape-rendering", "crispEdges").style(
                                        "fill", "none").style("stroke","#ffffff").style(
                                                "opacity", 0.12);
                        } else {
                                var Y_grid = g.append("g")
                                        .attr("class", "grid")
                                        .call(make_y_gridlines('left')
                                                .tickSize(-width)
                                                .tickFormat("")
                                        )
                                Y_grid.selectAll("path").style("stroke", "red").style(
                                        "shape-rendering", "crispEdges").style("fill", "none").style(
                                                "opacity", 0)
                                Y_grid.selectAll("line").style("shape-rendering", "crispEdges").style(
                                        "fill", "none").style("stroke", "red");
                        }
                }
              
                if (!_this.showlineaxisY) {
                        $('.axis--y').find('.domain').css('display', 'none')
                        y_g.selectAll('line').remove();

                }
                /*--  add groups based on data  --*/
                var groupedG = g.append("g")
                        .selectAll("g")
                        .data(data)
                        .enter().append("g").attr("class", "groupg")
                        .on("contextmenu", function () {
                                if (location.hash == "#!/alertDashboard") {
                                        window.transSelectedFilter.data = type
                                        window.transSelectedFilter.id = container;
                                        window.transSelectedFilter.chartType = "bar";
                                        //    	           		 aplyAlertDasboardFilters(d,pieOptions.container,"pie");
                                }
                        })
                        .on("mouseover", function (d) {
                                /*--  show tooltip  --*/
                                $(this).find("path").css("fill-opacity", 0.6);
                                $(this).find(".background_rect").css("fill", "transparent");
                                $(".grouped-bar-tooltip").empty();
                                var keys = d3.keys(d).slice(1);
                                keys = keys.sort()
                                if (barOptions.showxYTxt) {
                                        var text = '';
                                        var keys = d3.keys(d).slice(1);
                                        keys = keys.sort()
                                        for (var i = 0; i < keys.length; i++) {
                                                text = text + "<div style='color:" + barOptions.colors[i] + "!important'>" + d.x + ": <span >" + d[keys[i]] + "</span></div>";
                                        }
                                } else if (barOptions.txt != undefined) {
                                        var tooltipData = [];
                                        $.each(barOptions.txt, function (k, v) {
                                                if (d.x === v.CaseId) {
                                                        tooltipData.push(v);
                                                }
                                        });
                                        var keys1 = d3.keys(tooltipData[0]).slice(1);
                                        keys1 = keys1.sort()
                                        var text = '<table style = "color:#000; border-collapse: collapse;font-size: 12px;min-width: 50px">';
                                        for (var i = 0; i < keys1.length; i++) {
                                                text += '<tr><td style="color:#7d94a5;font-size:12px" class="table-item">' + keys1[i].toUpperCase() + '</td><td style="color:#7d94a5;font-size:12px">: ' + (tooltipData[0][keys1[i]]) + '</td></tr>';
                                        }
                                        text += '</table>';
                                } else {
                                        var text = '<span style="color:#7d94a5">' + d.x + '</span><table style = "color:#000; border-collapse: collapse;font-size: 12px;min-width: 50px">';
                                        for (var i = 0; i < keys.length; i++) {
                                                text += '<tr><td  style="font-size:12px;"  class="table-item">' + '<div style="background-color:' + (  _this.colors?_this.colors[keys[i]]:barOptions.colors[i] )+ ';width:10px;height:10px;border-radius:8px"></div>' + '</td><td  style="color:#7d94a5;font-size:12px;text-transform:capitalize"  class="table-item">' + keys[i] + '</td><td style="color:#7d94a5;font-size:12px">' + d[keys[i]] + '</td></tr>';
                                        }
                                        text += '</table>';
                                }
                                $(".grouped-bar-tooltip").html(text);
                                $(".grouped-bar-tooltip").css("visibility", "visible");
                                return $(".grouped-bar-tooltip").css("display", "block");

                        })
                        .on("mousemove", function (e) {
                                var p = $(chart_container)
                                var position = p.offset();
                                var windowWidth = window.innerWidth;
                                var tooltipWidth = $(".grouped-bar-tooltip").width() + 50
                                var cursor = d3.event.x;
                                if ((position.left < d3.event.pageX) && (cursor > tooltipWidth)) {
                                        var element = document.getElementsByClassName("grouped-bar-tooltip");
                                        element[0].classList.remove("tooltip-left");
                                        element[0].classList.add("tooltip-right");
                                        $(".grouped-bar-tooltip").css("left", (d3.event.pageX - 15 - $(".grouped-bar-tooltip").width()) + "px");
                                } else {
                                        var element = document.getElementsByClassName("grouped-bar-tooltip");
                                        element[0].classList.remove("tooltip-right");
                                        element[0].classList.add("tooltip-left");
                                        $(".grouped-bar-tooltip").css("left", (d3.event.pageX + 10) + "px");

                                }
                                return $(".grouped-bar-tooltip").css("top", d3.event.pageY + "px")
                        })
                        .on("mouseout", function () {
                                /*--  hide tool-tip  --*/
                                $(this).find(".background_rect").css("fill", "transparent");
                                $(this).find("path").css("fill-opacity", 1);
                                $(".grouped-bar-tooltip").css("visibility", "hidden");
                                return $(".grouped-bar-tooltip").css("display", "none");
                        })
                        .attr("transform", function (d) {
                                return "translate(" + x0(d.x) + ",0)";
                        });

                /*--  append background rect for tooltip  --*/
                groupedG.append("rect").attr("class", "background_rect").attr("rx", 5)
                        .attr("ry", 5)
                        .attr("x", 0).attr("y", 0).attr("width", x0.bandwidth()).attr("height", height).attr("fill", "transparent").attr("opacity", 1);

                /*--  append bars  --*/
                var prevVal = 0;
/*--  append bars with particular type od round --*/
                if (barOptions.roundedBar == "topRounded") {
                        var rect = groupedG.selectAll(".rect_" + randomSubstring)
                                .data(function (d) {
                                        prevVal = 0;
                                        return keys.map(function (key, i) {
                                                var curentObj = { key: key, value: d[key], value0: prevVal };
                                                prevVal = prevVal + d[key];
                                                return curentObj;
                                        });
                                })

                                .enter()
                                .append("path")
                                .attr("class", function (d) {
                                        return "rect_" + randomSubstring + " rect_" + randomSubstring + "_" + d.key
                                })
                                .attr("clip-path", "url(#clip" + randomSubstring + ")")

                                .attr("d", function (d, i) {
                                        var x;
                                        if (x1.bandwidth() > 100) {
                                                x = x1(d.key) + (parseFloat(x1.bandwidth() / 3));
                                                barWidth = parseFloat(x1.bandwidth() / 3);
                                        } else if (x1.bandwidth() < 15) {
                                                x = x1(d.key);
                                                barWidth = 15;
                                        } else {
                                                x = x1(d.key);
                                                barWidth = parseFloat(x1.bandwidth());
                                        }
                                        return rectangle(x, (y(d.value)), barWidth, (height - y(d.value)), (x1.bandwidth() / 4 > 5 ? (x1.bandwidth() / 4 > 20 ? 20 : x1.bandwidth() / 4) : 5))
                                })
                                .attr("fill", function (d) {
                                        return colorScale(d.key);
                                })
                                .transition().duration(groupedColumnValues.clipPathDuration).ease(d3.easeLinear)
                                .attr("y", function (d) {
                                        return y(d.value);
                                });
                }
                if (barOptions.roundedBar == "allSideRounded") {
                        var rect = groupedG.selectAll(".rect_" + randomSubstring)
                                .data(function (d) {
                                        prevVal = 0;
                                        return keys.map(function (key, i) {
                                                var curentObj = { key: key, value: d[key], value0: prevVal };
                                                prevVal = prevVal + d[key];
                                                return curentObj;
                                        });
                                })

                                .enter()
                                .append("rect")
                                .attr("x", function (d) {
                                        return x1(d.key);
                                })
                                .attr("y", height)

                                .attr("rx", (x1.bandwidth() / 6))
                                .attr("ry", (x1.bandwidth() / 6))
                                .attr("width", x1.bandwidth())

                                .attr("height", function (d) {
                                        return height - y(d.value);
                                })
                                .attr("fill", function (d) {
                                        return _this.colors?_this.colors[d.key]:colorScale(d.key);
                                })
                                .transition().duration(groupedColumnValues.clipPathDuration).ease(d3.easeLinear)
                                .attr("y", function (d) {
                                        return y(d.value);
                                });
                        
                }
                if(barOptions.appendTextOnBar){
                        groupedG.selectAll(".rect_" + randomSubstring)
                        .data(function (d) {
                                prevVal = 0;
                                return keys.map(function (key, i) {
                                        var curentObj = { key: key, value: d[key], value0: prevVal };
                                        prevVal = prevVal + d[key];
                                        return curentObj;
                                });
                        })
                        .enter()
                        .append("text")
                        .attr("class", function (d) {
                                return "bar-text";
                        })
                        .attr("fill", "#ffffff")
                        .text(function (d) {
                            if(d.value){
                                return d.value
                            }
                               
                                //   return formatCount(d.)
                        })
                        .attr("transform", function (d, i) {
                                var x0 = x1(d.key)  + x1.bandwidth()/2,
                                        y0 = y(d.value)-5;
                                return "translate(" + x0 + "," + y0 + ") rotate(0)";
                        })
                }
               
                $('input[type=radio][name=mode]').change(function () {
                        if ($(this).val() == "grouped") {
                                plotGroupedBars();
                        } else {
                                plotStackedChart();
                        }
                });
                if (x1.bandwidth() < barWidth) {
                        barOptions.width = barOptions.width + (((barWidth - x1.bandwidth()) * 3) * barOptions.data.length);
                        GroupedColumChartModule.groupedColumChart(barOptions);
                }
                if (groupedStacked != "grouped") {
                        plotStackedChart();
                }
                function plotGroupedBars() {

                        y.domain([0, d3.max(data, function (d) {
                                return d3.max(keys, function (key) {
                                        return d[key];
                                });
                        })]);
                        d3.selectAll('#yAxis-' + randomSubstring).call(d3.axisLeft(y).ticks(8, "s"));
                        var y_g = d3.selectAll('#yAxis-' + randomSubstring);
                        y_g.selectAll("path").style("stroke", "#6c7e88")
                                .style("shape-rendering", "crispEdges")
                                .style("fill", "none");
                        y_g.selectAll("line").style("stroke", "#6c7e88")
                                .style("shape-rendering", "crispEdges")
                                .style("fill", "none");
                        y_g.selectAll("text").style("fill", "#6c7e88")
                                .style("font-size", "10px")
                                .style("stroke", "none");
                        d3.selectAll(".rect_" + randomSubstring).transition()
                                .duration(groupedColumnValues.groupedBarsDuration)
                                .delay(function (d, i) {
                                        return i * 10;
                                })
                                .attr("d", function (d, i) {
                                        var x, width;
                                        if (x1.bandwidth() > 100) {
                                                x = x1(d.key) + (parseFloat(x1.bandwidth() / 3));
                                                width = parseFloat(x1.bandwidth() / 3);
                                        } else {
                                                x = x1(d.key);
                                                width = parseFloat(x1.bandwidth());
                                        }
                                        return rectangle(x, (y(d.value)), width, (height - y(d.value)), (x1.bandwidth() / 4 > 5 ? (x1.bandwidth() / 4 > 20 ? 20 : x1.bandwidth() / 4) : 5))
                                })
                        //                    .attr("x", function (d) {
                        //                        return x1(d.key);
                        //                    })
                        //                    .attr("width", x1.bandwidth())
                        //                    .transition()
                        //                    .attr("y", function (d) {
                        //                        return y(d.value);
                        //                    })
                        //                    .attr("height", function (d) {
                        //                        return height - y(d.value);
                        //                    }).attr("rx", (x1.bandwidth() / 4))
                        //                    .attr("ry", (x1.bandwidth() / 4))

                }
                function plotStackedChart() {

                        y.domain([0, d3.max(layers[layers.length - 1], function (d) {

                                return d[0] > d[1] ? d[0] : d[1];
                        })]).nice();
                        d3.selectAll('#yAxis-' + randomSubstring).call(d3.axisLeft(y).ticks(8, "s"));
                        var y_g = d3.selectAll('#yAxis-' + randomSubstring);
                        y_g.selectAll("path").style("stroke", "#6c7e88")
                                .style("shape-rendering", "crispEdges")
                                .style("fill", "none");
                        y_g.selectAll("line").style("stroke", "#6c7e88")
                                .style("shape-rendering", "crispEdges")
                                .style("fill", "none");
                        y_g.selectAll("text")
                                .style("fill", "#6c7e88")
                                .style("font-size", "10px")
                                .style("stroke", "none");
                        d3.selectAll(".rect_" + randomSubstring).transition()
                                .duration(groupedColumnValues.stackedChartDuration)
                                .delay(function (d, i) {
                                        return i * 10;
                                })
                                .attr("d", function (d, i) {
                                        var x;
                                        if (x0.bandwidth() > 100) {
                                                x = ((x0.bandwidth()) / 2.5);
                                                width = x0.bandwidth() / 5;
                                        } else {
                                                x = 0;
                                                width = x0.bandwidth();
                                        }
                                        return rectangle(x, (y(d.value + d.value0)), width, (y(d.value0) - y(d.value + d.value0)), 0)
                                })
                        //                    .attr("y", function (d) {
                        //                        return y(d.value + d.value0);
                        //                    })
                        //                    .attr("height", function (d) {
                        //                        return y(d.value0) - y(d.value + d.value0);
                        //                    })
                        //                    .transition()
                        //                    .attr("x", function (d, i) {
                        //                        if (x0.bandwidth() > 20) {
                        //                            return (x0.bandwidth()) / 4;
                        //                        } else {
                        //                            return 0;
                        //                        }
                        //                    })
                        //                    .attr("width", function () {
                        //                        if (x0.bandwidth() > 20) {
                        //                            return  x0.bandwidth() / 2;
                        //                        } else {
                        //                            return  x0.bandwidth();
                        //                        }
                        //                    })
                        //                    .attr("rx", 0)
                        //                    .attr("ry", 0);

                }

                /*--  call function to ender legends  --*/
                renderLegend(keys, randomSubstring);
        }

        /*--------------------------------------------------------------------------*/
        function renderLegend(labelObject) {
                var numberOfLegends = labelObject.length;

                /*--  create legends div  --*/
                var legenddiv = d3.select('#legendContainer-' + randomSubstring)

                /*--  holder for each legend  --*/
                var legendHolder = legenddiv.selectAll('.legend-holder')
                        .data(labelObject)
                        .enter()
                        .append('div')
                        .attr('class', function (d) {
                                return 'legend-holder legend_holder_div_' + randomSubstring + '_' + d;
                        })
                        .style('display', 'inline-block')
                        .style('padding', '2px')
                        .style('opacity', '1')
                        .style('cursor', 'pointer')
                        .on("click", function () {
                                var current_div_class = $(this).attr("class");
                                var rectClass = "rect_" + current_div_class.split(" ")[1].split("legend_holder_div_")[1];

                                /*--  Get  current div opacity  --*/
                                var current_opacity = ($(this).css("opacity"));

                                newOpacity = current_opacity == 1 ? 0.5 : 1;
                                $(this).css("opacity", newOpacity);
                                $("." + rectClass).css("opacity", newOpacity == 0.5 ? 0.2 : newOpacity);

                        });

                /*--  append legend circles  --*/
                legendHolder
                        .append('div')
                        .style('background-color', function (d, i) {
                                return colorScale(d)

                        }).attr("class", "bar-legend-circles");

                /*--  append legend text  --*/
                legendHolder.append("p").text(function (d, i) {
                        return d;
                }).style('color', function (d, i) {
                        if (_this.legendColor) {
                                return colorScale(d)
                        } else {
                                return groupedColumnValues.legendColor;
                        }

                }).style('display', 'inline-block').style('margin-left', '5px');
                //   $('#legendContainer-' + randomSubstring).mThumbnailScroller({
                //           axis: "x"
                //   });
        }

        /*----------------------------------------------------------------------------------*/
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

        /*----------------------------------------------------------------------------------*/
        /**
         * Function to handle show hide of header options
         */
        $("body").on("click", ".header_refresh_" + randomSubstring, function () {
                var chartId = $(this).parent().parent().parent().parent().siblings("div").attr("id");
                if ("#" + chartId == chart_container) {
                        $(chart_container).empty();
                        GroupedColumChartModule.groupedColumChart(actualOptions);
                }
        });
        //
        /* @purpose: gridlines in y axis function 
        * @created: 29-10-2019
        * @returns:  AxisType
        * @author:Amritesh*/
        function make_y_gridlines(type) {	
                if(type =='right'){
                        return d3.axisRight(y)
                        .ticks(5)
                }	 else{
                        return d3.axisLeft(y)
                        .ticks(5)     
                }
                
        }
        /*----------------------------------------------------------------------------------*/
        /**
         * Function to handle show hide of header options
         */
        $("body").on("click", ".header_table_" + randomSubstring, function () {
                var a = parseInt(h / 55);

                $(chart_container).empty();
                $(this).css("display", "none");
                $(".header_chart_" + randomSubstring).css("display", "inline-block");
                var tbl = "<div id ='groupedChart_table_" + randomSubstring + "'  class='grouped-chart-table' style='height:" + (_this.height) + "px' ><table id='groupedChart_table_1" + randomSubstring + "' class='table-striped'><thead><tr>";
                var keys = d3.keys(columnData[0]);
                $.each(keys, function (i, v) {
                        if (v == "x") {
                                tbl = tbl + "<th>" + "TYPE" + "</th>";
                        } else {
                                tbl = tbl + "<th>" + (v.toUpperCase()) + "</th>";
                        }

                })
                tbl = tbl + "</tr></thead><tbody>"
                $.each(columnData, function (index, value) {

                        tbl = tbl + "<tr>";
                        $.each(keys, function (i1, v1) {
                                if (typeof (value[v1]) == "string") {
                                        tbl = tbl + "<td>" + (value[v1].toUpperCase()) + "</td>";
                                }
                                else {
                                        tbl = tbl + "<td>" + value[v1] + "</td>";
                                }
                        });

                        tbl = tbl + "</tr>"
                });
                tbl = tbl + "</tbody></table></div>";
                $(chart_container).append(tbl);
                $('#groupedChart_table_1' + randomSubstring).DataTable({
                        "bLengthChange": false, "paging": false, "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                                if (iDisplayIndex % 2 == 1) {

                                        /*--  even color  --*/
                                        $('td', nRow).css('background-color', '#32464F');
                                } else {
                                        $('td', nRow).css('background-color', '#283C45');
                                }
                        }
                });
                $("#groupedChart_table_" + randomSubstring).mCustomScrollbar({
                        axis: "y"
                });

                $("#groupedChart_table_" + randomSubstring + " tr:even").css("background-color", "#32464F");
                $("#groupedChart_table_" + randomSubstring + " tr:odd").css("background-color", "#283C45");
                $("#groupedChart_table_" + randomSubstring + " tr:first").css("background-color", "#0CB29A");

                var id1 = $("#groupedChart_table_" + randomSubstring).children('div').find('div').eq(0);
                var id2 = $("#groupedChart_table_" + randomSubstring).children('div').find('div').eq(1);
                var id3 = $("#groupedChart_table_" + randomSubstring).children('div').find('div').eq(2);
                var id1attr = id1.attr("id");
                var id2attr = id2.attr("id");
                var id3attr = id3.attr("id");

                $("#" + id1attr + " " + "label").css("color", "#666666")
                $("#" + id2attr + " " + "label").css("color", "#666666")
                $("#" + id3attr).css("color", "#666666")

                $(".dataTables_filter input").css({
                        "margin-left": "0.5em", "position": "relative", "border": "0", "min-width": "240px",
                        "background": "transparent",
                        "border-bottom": "1px solid #666666",
                        " border-radius": " 0",
                        "padding": " 5px 25px",
                        "color": "#ccc",
                        "height": " 30px",
                        "-webkit-box-shadow": " none",
                        "box-shadow": " none"
                })
                $(".dataTables_wrapper").css("background-color", "#374C59");
        });

        /*----------------------------------------------------------------------------------*/
        /**
         * Function to handle show hide of header options
         */
        $("body").on("click", ".header_chart_" + randomSubstring, function () {
                var chartId = $(this).parent().parent().parent().parent().siblings("div").attr("id");
                if ("#" + chartId == chart_container) {
                        $(this).css("display", "none");
                        $(".header_table_" + randomSubstring).css("display", "inline-block");
                        $(chart_container).empty();
                        GroupedColumChartModule.groupedColumChart(actualOptions);
                }
        });
        $("body").on("click", ".header_fullscreen_chart" + randomSubstring, function () {
                $("#modal_" + randomSubstring).modal('show');
                var options = jQuery.extend(true, {}, actualOptions);
                setTimeout(function () {
                        $("#modal_chart_container" + randomSubstring).css("width", "100%")
                        options.container = "#modal_chart_container" + randomSubstring;
                        options.headerOptionsExpand = false;
                        options.height = 450;
                        GroupedColumChartModule.groupedColumChart(options);
                }, 500);
        })
}
var GroupedColumChartModule = new GroupedColumChart();

export {
        GroupedColumChartModule
};
