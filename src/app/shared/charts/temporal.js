function temporalChart(temporalOptions) {
    if (temporalOptions.container) {
        $(temporalOptions.container).empty();
    }
    //--------------------------Initialize Values-----------------------------
    if (temporalOptions) {
        this.container = temporalOptions.container ? temporalOptions.container : "body"
        this.data = (temporalOptions.data) ? temporalOptions.data : []
        this.height = temporalOptions.height ? temporalOptions.height : 600;
        this.uri = temporalOptions.uri;
        this.collapseHeader = temporalOptions.header ? temporalOptions.header : "FORCE COLLAPSE CHART";

        this.randomIdString = Math.floor(Math.random() * 10000000000);
        this.headerOptions = temporalOptions.headerOptions == false ? temporalOptions.headerOptions : true;
        this.ticks = temporalOptions.ticks ? temporalOptions.ticks : 5;
        this.isHeaer=temporalOptions.isHeaer == false ? temporalOptions.isHeaer : true;


    } else {
        console.error('temporal Chart Initialization Error : temporal Chart Params Not Defined');
        return false;
    }
    var header = temporalOptions.header;
    var actualOptions = jQuery.extend(true, {}, temporalOptions);
    var randomSubstring = this.randomIdString;
    var hl = this.height
    var h = parseInt(hl) + 50;
    var _this = this;
    var modalwidth = $(window).width() - 200;
    var modal = ' <div id="modal_' + randomSubstring + '"class="modal fade " tabindex="-1" role="dialog"> <div class="modal-dialog modal-lg" style="width:' + modalwidth + 'px"> <form ><div class="modal-content"><div class="modal-body"  style="padding:0;background-color:#334d59" id="modal_chart_container' + randomSubstring + '"></div></div></form></div></div>';
    var chartContainerdiv = '<div class="chartContainer"  align="center" style="width: 100%; margin: auto; margin-top: 0px; font-size: 14px;font-style: inherit;"> <div class="graphBox" style="height:' + h + 'px;max-height: ' + h + 'px;min-height: ' + h + 'px;margin: auto; background-color: #374c59; width: 100%;left: 0px;top: 0px;position: relative;"> <div class="headerDiv" style="font-weight:bold;background-color: #425661;text-align: left;color: #239185; border-bottom: 1px solid rgba(192, 192, 192, 0.47);width: 100%; line-height: 2.5;font-size: 16px ;padding-left: 5px;">' + header + '</div><div id="collapse_chart_div' + randomSubstring + '" class="chartContentDiv" style="width: 100%;"></div> </div></div>'
    // var chartContainerdiv = '<div class="chartContainer"  align="center" style="width: 80%; margin: auto; margin-top: 30px; font-size: 14px;font-style: inherit;"> <div class="dataBox" style="margin: auto; background-color: #374c59; width: 100%;left: 0px;top: 0px;overflow: hidden;position: relative;"> <div class="headerDiv" style="font-weight:bold;background-color: #425661;text-align: left;color: #239185; border-bottom: 1px solid rgba(192, 192, 192, 0.47);width: 100%; line-height: 2.5;font-size: 16px ;padding-left: 5px;">' + header + '</div><div id="bubble_chart_div' + randomSubstring + '" class="chartContentDiv" style="width: 100%;"></div> </div></div>'
    $(this.container).html(chartContainerdiv);
    $(this.container).append(modal);
    var chart_container = "#collapse_chart_div" + randomSubstring;
    this.width = temporalOptions.width ? temporalOptions.width : $(chart_container).width() - 10;
    if (this.height > this.width) {
        this.height = this.width
    }
    var mapGlyphMargin = {top: 30, right: 10, bottom: 10, left: 10};
    var fullMareyMargin = {top: 30, right: 20, bottom: 10, left: 60};
    this.diameter = this.height > this.width ? this.width - 50 : this.height - 50;
    if (!this.headerOptions) {
        var closebtn = '<button type="button" class="cancel" style="float: right;padding:0 8px;border:0;opacity: 1;background-color: transparent;float:right" data-dismiss="modal" aria-label="Close"> <span class="fa fa-remove"></span></button>'
        $(chart_container).siblings(".headerDiv").append(closebtn);
    }
    if ($(chart_container).siblings(".headerDiv").find(".bstheme_menu_button").length == 0)
        var header_options = '<div style="float: right; padding: 0 10px; cursor: pointer;" class="bstheme_menu_button bstheme_menu_button_' + randomSubstring + '" data-toggle="collapse" data-target="#opt_' + randomSubstring + '"><i class="fa fa-ellipsis-v" aria-hidden="true"></i><div class="bstheme_options" style="position:absolute;right:10px;z-index:2000"> <div style="display:none;" id="opt_' + randomSubstring + '" class="collapse"><span class="header_fullscreen_chart' + randomSubstring + '"><i class="fa fa-expand" aria-hidden="true"></i></span><span class="header_refresh_' + randomSubstring + '"><i class="fa fa-refresh" aria-hidden="true"></i></span> <span class="header_table_' + randomSubstring + '"> <i class="fa fa-table" aria-hidden="true"></i></span> <span class="header_chart_' + randomSubstring + '" style="display:none" ><i class="fa fa-bar-chart" aria-hidden="true"></i></span></div></div> </div>';
    $(chart_container).siblings(".headerDiv").append(header_options);

    if (!this.headerOptions) {
        $(chart_container).siblings(".headerDiv").find(".bstheme_options").css("right", "28px");
        $('.header_fullscreen_chart' + randomSubstring).css("display", "none");
    } else {
        $(chart_container).siblings(".headerDiv").find(".bstheme_options").css("right", "0");
    }
    if(!this.isHeaer){
    	$(chart_container).siblings(".headerDiv").remove();
    }

    $(".force_tooltip").remove();
    var tool_tip = $('body').append('<div class="temporal_tooltip" style="z-index:2000;position: absolute; opacity: 1; pointer-events: none; visibility: hidden;background-color:#0cae96; padding: 10px;border-radius: 5px;border: 1px solid gray;font-size: 10px;color:#000;"><span style=" font-size: 12px; position: absolute; white-space: nowrap;  margin-left: 0px; margin-top: 0px; left: 8px; top: 8px;"><span style="font-size:10px" class="tool_tip_x_val"></span><table><tbody><tr><td style="padding:0"> </td><td style="padding:0"><b>216.4 mm</b></td></tr><tr><td style="color:#434348;padding:0">New York: </td><td style="padding:0"><b>91.2 mm</b></td></tr><tr><td style="color:#90ed7d;padding:0">London: </td><td style="padding:0"><b>52.4 mm</b></td></tr><tr><td style="color:#f7a35c;padding:0">Berlin: </td><td style="padding:0"><b>47.6 mm</b></td></tr></tbody></table></span></div>');

    var data = this.data;
    var curretn_uri = this.Uri;
    var collapse_header = this.collapseHeader;
    var containerid = this.container;

//    var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    var colorScale = d3.scaleOrdinal().range(["#B55664", "#3D79A5", "#15AD66"]);
    var width = this.width,
            height = this.height,
            diameter = this.diameter;

    var chartdivs = '<div class="full-width section-trains"> <div class="full-width marey-container_' + randomSubstring + '" loading"> <div class="row"><div class=" col-xs-4 fixed-left_' + randomSubstring + '" style=""> <div class="side-map_' + randomSubstring + '"></div><div class="side-caption_' + randomSubstring + '"></div> </div><div class="col-xs-8  fixed-right_' + randomSubstring + '" style=""> <div class="inner"><div class="marey_' + randomSubstring + '"></div> </div>  </div> </div> </div> </div>'
    $(chart_container).append(chartdivs)
    //add "appendOnce" method to d3 selections which can be called many times but ensures that
    // the dom element is only added once.  It always returns the dom element, and adds a "firstTime"
    // attribute to it that is a length-1 selection the first time its added, and an empty selection
    // all subsequent times
//    d3.selection.prototype.appendOnce = function (type, clazz) {
//        var result = this.selectAll('.' + clazz.replace(/ /g, '.')).data([1]);
//        result.firstTime = result.enter().append(type).attr('class', clazz);
//        return result;
//    };

    // add "onOnce" method to d3 selections - adds a single listener to the selection that filters on sub-selections
    // when there are too many events that each have a listener and it becomes a performance problem, switch over
    // to using this listener on a parent dom element to reduce total number of listeners
//    d3.selection.prototype.onOnce = function (eventType, subSelector, func) {
//        this.each(function () {
//            $(this).on(eventType, subSelector, function (evt) {
//                var d = d3.select(this).datum();
//                try {
//                    d3.event = evt.originalEvent;
//                    return func.call(this, d);
//                } finally {
//                    d3.event = null;
//                }
//            });
//        });
//        return this;
//    };
    // add "off" method to d3 selections - clears events types from a space separated list from the
    // selection that were added using D3 or jQuery.
    // For example: selection.off('mouseover mouseout')
    d3.selection.prototype.off = function (eventTypes) {
        var self = this;
        eventTypes.split(/\s+/g).forEach(function (eventType) {
            self.each(function () {
                $(self).off(eventType);
            }).on(eventType, null);
        });
        return self;
    };

    // add utility to move an SVG selection to the front
    d3.selection.prototype.moveToFront = function () {
        return this.each(function () {
            this.parentNode.appendChild(this);
        });
    };

    function wrap(text, width) {
        text.each(function () {
            var text = d3.select(this),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.1, // ems
                    y = text.attr("y") || 0,
                    x = text.attr("x") || 0,
                    dy = parseFloat(text.attr("dy") || 0),
                    tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
            while (!!(word = words.pop())) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width || word === '<br>') {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = word !== '<br>' ? [word] : [];
                    tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
    }
    temporal(temporalOptions.data);
    //--------------------------------------------------------------------------
    /**
     * Function to plot chart
     */
    function temporal(data) {
        var network = data["station-network"];
        var spider = data.spider;
        var trips = data["marey-trips"];
        var header = data["marey-header"];


        // The annotations displayed along the right side of the Marey diagram
        var sideAnnotationData = [
            // At the minimum you need time and text which positions the annotation...
//    {
//      time: '2014/02/03 05:00',
//      text: 'Service starts at 5AM on Monday morning. Each line represents the path of one train. Time continues downward, so steeper lines indicate slower trains. <br> \u25BE'
//    },
//    {
//      time: '2014/02/03 05:55',
//      text: 'Since the red line splits, we show the Ashmont branch first then the Braintree branch.  Trains on the Braintree branch "jump over" the Ashmont branch.',
//      // But additionally you can have a line connecting the annotation to a point in the marey diagram
////      connections: [{
////        time: '2014/02/03 05:40',
////        station: 'ashmont',
////        line: 'red'
////      }]
//    }

        ];
        var idToNode = {};
        network.nodes.forEach(function (data) {
            data.x = spider[data.id][0];
            data.y = spider[data.id][1];
            idToNode[data.id] = data;
        });
        network.links.forEach(function (link) {
            link.source = network.nodes[link.source];
            link.target = network.nodes[link.target];
            link.source.links = link.source.links || [];
            link.target.links = link.target.links || [];
            link.target.links.splice(0, 0, link);
            link.source.links.splice(0, 0, link);
        });
        trips.forEach(function (d) {
            d.stops = d.stops || [];
            var m = moment(d.begin * 1000).zone(5);
            d.secs = m.diff(m.clone().startOf('day')) / 1000;
        });
        var stationToName = {};
        var end = {};
        var startandendlables = {};
        var nodesPerLine = network.nodes.map(function (d) {
            return d.links.map(function (link) {
                var key = d.id + '|' + link.line;
                if (d.links.length === 1) {
                    end[key] = true;
                }
                stationToName[key] = d.name;
                return key;
            });
        });

        var mapGlyphTrainCircleRadius = 2.5;
        nodesPerLine = _.uniqWith(_.flatten(nodesPerLine));
        var xExtent = d3.extent(d3.values(header), function (d) {
            return d[0];
        });
        var minUnixSeconds = d3.min(d3.values(trips), function (d) {
            return d.begin;
        });
        var maxUnixSeconds = d3.max(d3.values(trips), function (d) {
            return d.end;
        });





        /* 2. Render the side map glyph that shows locations of trains
         *    at a point in time
         *************************************************************/
        var fixedLeft = d3.select(".fixed-left_" + randomSubstring);
        var mapGlyphSvg = fixedLeft.select('.side-map_' + randomSubstring).append('svg')
                .attr("id", "mapGlyphSvg_" + randomSubstring)
                .style("width", "100%")
                .style("height", _this.height)
//                .style("margin-top", "100");

        function renderSideMap(mapGlyphContainer, outerWidth, outerHeight) {

            var xRange = d3.extent(network.nodes, function (d) {
                return d.x;
            });
            var yRange = d3.extent(network.nodes, function (d) {
                return d.y;
            });
            var width = outerWidth - mapGlyphMargin.left - mapGlyphMargin.right,
                    height = Math.max(outerHeight - mapGlyphMargin.top - mapGlyphMargin.bottom - $('.side-caption_' + randomSubstring).height() - 40, 150);
            var xScale = width / (xRange[1] - xRange[0]);
            var yScale = height / (yRange[1] - yRange[0]);
            var scale = Math.min(xScale, yScale);
            network.nodes.forEach(function (data) {
                data.pos = [data.x * scale, data.y * scale];
            });
            var endDotRadius = 0.2 * scale;
            var mapGlyph = mapGlyphContainer
                    .attr('width', scale * (xRange[1] - xRange[0]) + mapGlyphMargin.left + mapGlyphMargin.right)
                    .attr('height', scale * (yRange[1] - yRange[0]) + mapGlyphMargin.top + mapGlyphMargin.bottom)
                    .append('g').attr("class", 'map-container')
                    .attr('transform', 'translate(' + mapGlyphMargin.left + ',' + mapGlyphMargin.top + ')');
            // mapGlyphContainer.append("circle")
            //         .attr("cx", mapGlyphContainer.attr("width") / 2)
            //         .attr("cy", mapGlyphContainer.attr("height") / 2)
            //         .attr("r", Math.max(mapGlyphContainer.attr("width")/2, mapGlyphContainer.attr("height")) / 2)
            //         .style("fill", "transparent")
            //         .style("stroke", "#536573")
            //         .style("stroke-width","2px")
            //         .style("stroke-opacity","0.3");


            var stations = mapGlyph
                    .selectAll('.station')
                    .data(network.nodes, function (d) {
                        return d.name;
                    });

            var connections = mapGlyph
                    .selectAll('.connect')
                    .data(network.links, function (d) {
                        return (d.source && d.source.id) + '-' + (d.target && d.target.id);
                    });

            connections
                    .enter()
                    .append('line')
                    .attr('class', function (d) {
                        return 'connect ' + d.line + '-dimmable';
                    })
                    .attr('x1', function (d) {
                        return d.source.pos[0];
                    })
                    .attr('y1', function (d) {
                        return d.source.pos[1];
                    })
                    .attr('x2', function (d) {
                        return d.target.pos[0];
                    })
                    .attr('y2', function (d) {
                        return d.target.pos[1];
                    })
                    .style("fill", "none")
                    .style("stroke", function (d) {
                        return colorScale(d.line);
                    });

            connections
                    .attr('x1', function (d) {
                        return d.source.pos[0];
                    })
                    .attr('y1', function (d) {
                        return d.source.pos[1];
                    })
                    .attr('x2', function (d) {
                        return d.target.pos[0];
                    })
                    .attr('y2', function (d) {
                        return d.target.pos[1];
                    });

            stations
                    .enter()
                    .append('circle')
                    .attr('class', function (d) {
                        return 'station middle station-label ' + d.id;
                    })
                    .style("fill", function (d) {
                        return "#B7B7B7";
//                        return colorScale(d.links[0].color)
                    })
                    .style("opacity", 0.3)
                    .on('mouseover', function (d) {

                        highlightMareyTitle(d.id, _.unique(d.links.map(function (link) {
                            return link.line;
                        })));
                        $(".temporal_tooltip").html('<span style="color:#000;"> ' + d.name + '</span>');
                        return $(".temporal_tooltip").css("visibility", "visible");

                    })
                    .on("mousemove", function () {
                        $(".temporal_tooltip").css("top", (d3.event.pageY - 10) + "px")
                        return  $(".temporal_tooltip").css("left", (d3.event.pageX + 10) + "px");

                    })
                    .on('mouseout', function (d) {
                        highlightMareyTitle(null);
                        return $(".temporal_tooltip").css("visibility", "hidden");

                    })
                    .attr('cx', function (d) {
                        return d.pos[0];
                    })
                    .attr('cy', function (d) {
                        return d.pos[1];
                    })
                    .attr('r', 3);

            stations
                    .attr('cx', function (d) {
                        return d.pos[0];
                    })
                    .attr('cy', function (d) {
                        return d.pos[1];
                    })
                    .attr('r', 3);

            // line color circles
            function dot(id, clazz) {
                mapGlyph.selectAll('circle.' + id)
                        .classed(clazz, true)
                        .classed('end', true)
                        .classed('middle', false)
                        .attr('r', Math.max(endDotRadius, 3));
            }
            dot('place-asmnl', "red");
            dot('place-alfcl', "red");
            dot('place-brntn', "red");
            dot('place-wondl', "High");
            dot('place-bomnl', "High");
            dot('place-forhl', "Low");
            dot('place-ogmnl', "Low");
        }

        // Render train dots onto the map glyph at a particular point in time
        var lastTime = minUnixSeconds;
        function renderTrainsAtTime(unixSeconds) {
            if (!unixSeconds) {
                unixSeconds = lastTime;
            }
            lastTime = unixSeconds;
            if (!showingMap) {
                return;
            }
            var active = trips.filter(function (d) {
                return d.begin < unixSeconds && d.end > unixSeconds;
            });
            var positions = active.map(function (d) {
                // get prev, next stop and mix
                for (var i = 0; i < d.stops.length - 1; i++) {
                    if (d.stops[i + 1].time > unixSeconds) {
                        break;
                    }
                }

                // find the datapoint before and after this time and interpolate
                var from = d.stops[i];
                var to = d.stops[i + 1];
                var ratio = (unixSeconds - from.time) / (to.time - from.time);
                return {trip: d.trip, pos: placeWithOffset(from, to, ratio), line: d.line};
            });

            var trains = mapGlyphSvg.select('.map-container').selectAll('.train').data(positions, function (d) {
                return d.trip;
            });
            trains.enter().append('circle')
                    .attr('class', function (d) {
                        return 'train highlightable hoverable dimmable ' + d.line;
                    })
                    .classed('active', function (d) {
                        return d.trip === highlightedTrip;
                    })
                    .classed('hover', function (d) {
                        return d.trip === hoveredTrip;
                    })
                    .attr('r', mapGlyphTrainCircleRadius)
                    .on('click', function (d) {
                        highlightTrain(d);
                    })
                    .on('mouseover', hoverTrain)
                    .on('mouseout', unHoverTrain)
                    .style("fill", function (d) {
                        return colorScale(d.line);
                    })
                    .style("stroke", function (d) {
                        return colorScale(d.line);
                    })
                    .style("stroke-width", "25px")
                    .style("stroke-opacity", 0);
            trains
                    .attr('cx', function (d) {
                        return d.pos[0];
                    })
                    .attr('cy', function (d) {
                        return d.pos[1];
                    });
            trains.exit().remove();
            timeDisplay.text(moment(unixSeconds * 1000).zone(5).format('h:mm a'));
        }





        /* 3. Set up the scaffolding for lined-up and full Marey diagrams
         *************************************************************/
        var marey = d3.select(".marey_" + randomSubstring).text('').style('text-align', 'left')
                .append('svg')
                .attr("id", "marey_" + randomSubstring)
                .style("width", "100%")
                .style("height", "100%");
        var mareyContainer = d3.select('.marey-container_' + randomSubstring).classed('loading', false);
        d3.select(".lined-up-marey").text('');
        var timeDisplay = mareyContainer.selectAll('.marey-time');

        d3.select('body').on('click.highlightoff', function () {
            highlightedTrip = null;
            highlight();
        });




        /* 4. On load and when the screen width changes
         *
         * This section makes heavy use of a utility defined in
         * common.js 'appendOnce' that when called adds a new element
         * or returns the existing element if it already exists.
         *************************************************************/
        // first some state shared across re-renderings
//        var frozen = false;
        var showingMap = false;
//        var highlightedLinedUpMarey = null;
        var highlightedTrip = null;
        var hoveredTrip = null;
        var lastWidth = null;

        // the method that actually gets called on screen size chages
        function renderMarey(outerSvg, fullMareyOuterWidth) {

            if (fullMareyOuterWidth === lastWidth) {
                return;
            }
            lastWidth = fullMareyOuterWidth;



            /* 4a. Render the full Marey
             *************************************************************/

            var fullMareyOuterHeight = _this.height;
            var fullMareyWidth = fullMareyOuterWidth - fullMareyMargin.left - fullMareyMargin.right,
                    fullMareyHeight = fullMareyOuterHeight - fullMareyMargin.top - fullMareyMargin.bottom;
            outerSvg.attr('width', fullMareyOuterWidth)
                    .attr('height', fullMareyOuterHeight);

            var fullMareyHeader = outerSvg.append('g').attr("class", 'header')
                    .attr('transform', 'translate(' + fullMareyMargin.left + ',0)');
            var fullMareyBodyContainer = outerSvg.append('g').attr('class', 'main')
                    .attr('transform', 'translate(' + fullMareyMargin.left + ', ' + fullMareyMargin.top + ')');
            var fullMareyBackground = fullMareyBodyContainer.append('g').attr('class', 'background');
            var fullMareyForeground = fullMareyBodyContainer.append('g').attr('class', 'foreground');

            var xScale = d3.scaleLinear()
                    .domain(xExtent)
                    .range([0, fullMareyWidth]);
            var yScale = d3.scaleLinear()
                    .domain([
                        minUnixSeconds,
                        maxUnixSeconds
                    ]).range([15, fullMareyHeight]).clamp(true);

            var timeScale = d3.scaleTime()
                    .domain([new Date(minUnixSeconds * 1000), new Date(maxUnixSeconds * 1000)])
                    .range([15, fullMareyHeight]);

            // draw the station label header aross the top
            var keys = d3.keys(header);
            var stationXScale = d3.scaleOrdinal()
                    .domain(keys)
                    .range(keys.map(function (d) {
                        return xScale(header[d][0]);
                    }));
            var stationXScaleInvert = {};
            keys.forEach(function (key) {
                stationXScaleInvert[header[key][0]] = key;
            });

            var stationLabels = fullMareyHeader
                    .selectAll('.station-label')
                    .data(nodesPerLine);
            startandendlables = [];
            $.each(end, function (d, i) {
                startandendlables.push({
                    "val": d,
                    "pos": stationXScale(d)
                });
            });
            startandendlables.sort(function (a, b) {
                return a.pos - b.pos
            });
            $.each(startandendlables, function (i, d) {
                startandendlables[d.val] = [];
                startandendlables[d.val].endstart = "start";
                if (startandendlables[(d.val.split("|")[1])]) {
                    startandendlables[d.val].endstart = "end";
                }
                startandendlables[(d.val.split("|")[1])] = true;
            });
            stationLabels
                    .enter()
                    .append('text')
                    .attr('class', 'station-label')
                    .style('display', function (d) {
                        return end[d] ? null : 'none';
                    })
                    .style('text-anchor', function (d) {
                        if (end[d]) {
                            if (startandendlables[d].endstart == "start") {
                                return "start";
                            } else {
                                return "end";
                            }

                        } else {
                            return "start";
                        }
                    })
                    .attr("y", function (d) {
                        if (!end[d]) {
                            return "-15px";
                        }
                    })
                    .style('font-size', "11px")
                    .text(function (d) {
                        return (stationToName[d]);
                    })
                    .style("fill", function (d) {
                        return colorScale(d.split("|")[1]);
                    })
                    .attr('transform', function (d) {
                        return 'translate(' + (stationXScale(d) - 2) + ',' + (fullMareyMargin.top - 3) + ')';
                    });

            var stations = fullMareyForeground.selectAll('.station')
                    .data(nodesPerLine, function (d) {
                        return d;
                    });

            stations
                    .enter()
                    .append('line')
                    .attr('class', function (d) {
                        return 'station ' + d.replace('|', '-');
                    })
                    .attr('x1', function (d) {
                        return xScale(header[d][0]);
                    })
                    .attr('x2', function (d) {
                        return xScale(header[d][0]);
                    })
                    .attr('y1', 0)
                    .attr('y2', fullMareyHeight);

            // draw the tall time axis down the side
            var y_g = fullMareyForeground.append('g').attr('class', 'y axis')
                    .call(d3.axisLeft(timeScale)
                            .tickFormat(function (d) {
                                return moment(d).zone(5).format("h:mm A");
                            })
                            .ticks(_this.ticks)).attr("class", "axis")
                    .style("stroke", "#6c7e88");

//            var yAxis = d3.svg.axis()
//                    .tickFormat(function (d) {
//                        return moment(d).zone(5).format("h:mm A");
//                    })
//                    .ticks(d3.time.minute, 15)
//                    .scale(timeScale)
//                    .orient("left");
//            var y_g = fullMareyForeground.appendOnce('g', 'y axis').call(yAxis);
            y_g.selectAll("text").style("fill", "#6c7e88")
                    .style("font-size", "10px")
                    .style("stroke", "none");
            y_g.selectAll("path").style("stroke", "#6c7e88")
                    .style("shape-rendering", "crispEdges")
                    .style("fill", "none");
            y_g.selectAll("line").style("stroke", "#6c7e88")
                    .style("shape-rendering", "crispEdges")
                    .style("fill", "none");
            var lineMapping = d3.line()
                    .x(function (d) {
                        return d[0];
                    })
                    .y(function (d) {
                        return d[1];
                    })
                    .defined(function (d) {
                        return d !== null;
                    })
                    .curve(d3.curveLinear);
            var mareyLines = fullMareyForeground.selectAll('.mareyline')
                    .data(trips, function (d) {
                        return d.trip;
                    });


            fullMareyForeground


            mareyLines
                    .enter()
                    .append('path').on('mouseover', hoverTrain)
                    .on('mouseout', unHoverTrain)
                    .on('click', highlightTrain)
                    .attr('class', function (d) {
                        return 'mareyline hoverable highlightable dimmable ' + d.line;
                    })
                    .style("fill", "none")
                    .style("stroke", function (d) {
                        return colorScale(d.line);
                    })
                    .attr('transform', function (d) {
                        if (!d.origY) {
                            d.origY = yScale(d.stops[0].time);
                        }
                        return 'translate(0,' + d.origY + ')';
                    })
                    .attr('d', draw(xScale, yScale));
            mareyContainer.select('.fixed-right_' + randomSubstring).on('mousemove', selectTime);
            mareyContainer.select('.fixed-right_' + randomSubstring).on('mousemove.titles', updateTitle);
            var barBackground = fullMareyBackground.append('g').attr('class', 'g-bar hide-on-ios');
            var barForeground = fullMareyForeground.append('g').attr('class', 'g-bar hide-on-ios');
            barBackground.append('line').attr('class', 'bar')
                    .attr('x1', 1)
                    .attr('x2', fullMareyWidth)
                    .attr('y1', 0)
                    .attr('y2', 0)
                    .style("fill", "none")
                    .style("stroke", "gray");
            barForeground.append('rect').attr('class', 'text-background')
                    .attr('x', 1)
                    .attr('y', -17)
                    .attr('width', 48)
                    .attr('height', 16)
//                    .style("fill","#374D5A");
            barForeground.append('text').attr('class', 'marey-time')
                    .attr('dx', 2)
                    .attr('dy', -4);
            timeDisplay = mareyContainer.selectAll('.marey-time').style("fill", "#6c7e88")
                    .style("font-size", "12px")
                    .style("stroke", "none");
            ;
            var bar = mareyContainer.selectAll("g.g-bar");

            // If a previous time was selected, then select that time again now
            if (!lastTime) {
                select(minUnixSeconds);
            }

            // on hover, show the station you are hovered on
            function updateTitle() {
                var pos = d3.mouse(fullMareyForeground.node());
                var x = pos[0];
                var station = stationXScaleInvert[Math.round(xScale.invert(x))];
                if (station) {
                    highlightMareyTitle(station);
                }
            }

            // on hover, set the time that is displayed in the map glyph on the side
            function selectTime() {

                var pos = d3.mouse(fullMareyForeground.node());
                var y = pos[1];
                var x = pos[0];
                if (x > 0 && x < fullMareyWidth) {
                    var time = yScale.invert(y);
                    select(time);
                }
            }

            // actually set the time for the map glyph once the time is determined
            function select(time) {
                var y = yScale(time);
                bar.attr('transform', 'translate(0,' + y + ')');
                timeDisplay.text(moment(time * 1000).zone(5).format('h:mm a'));
                renderTrainsAtTime(time);
            }

            // Get a list of [x, y] coordinates for all train trips for
            // both the full Marey and the lined-up Marey
            function getPointsFromStop(xScale, yScale, d, relative) {
                var last = null;
                var stops = d.stops.map(function (stop) {
                    // special case: place-jfk, place-nqncy -> place-jfk, place-asmnl (at same time), place-nqncy 
                    // special case: place-nqncy, place-jfk -> place-nqncy, place-asmnl (at same time), place-jfk
                    var result;
                    if (last && last.stop === 'place-jfk' && stop.stop === 'place-nqncy') {
                        result = [null, {stop: 'place-asmnl', time: last.time}, stop];
                    } else if (last && last.stop === 'place-nqncy' && stop.stop === 'place-jfk') {
                        result = [{stop: 'place-asmnl', time: stop.time}, null, stop];
                    } else {
                        result = [stop];
                    }
                    last = stop;
                    return result;
                });
                var flattenedStops = _.flatten(stops);
                var startX = xScale(header[d.stops[0].stop + '|' + d.line][0]);
                var points = flattenedStops.map(function (stop) {
                    if (!stop) {
                        return null;
                    }
                    var y = yScale(stop.time) - yScale(flattenedStops[0].time);
                    var x = xScale(header[stop.stop + '|' + d.line][0]);
                    if (relative) {
                        x -= startX;
                    }
                    return [x, y];
                });
                return points;
            }
            function draw(xScale, yScale, relative) {
                return function (d) {
                    var points = getPointsFromStop(xScale, yScale, d, relative);
                    return lineMapping(points);
                };
            }

        }




        /* 5. Add interaction behavior with surrounding text
         *************************************************************/
        // Setup the links in text that scroll to a position in the marey diagram
        // <a href="#" data-dest="id of dist dom element to scroll to" class="scrollto">...
        fixedLeft.selectAll('.scrollto')
                .on('click', function () {
                    var id = d3.select(this).attr('data-dest');
                    var $element = $("#" + id);
                    $('body, html').animate({scrollTop: $element.position().top}, '300', 'swing');
                    d3.event.preventDefault();
                });

        // Setup the links in text that highlight a particular line
        // <a href="#" data-line="color of line to highlight" class="highlight">...
        fixedLeft.selectAll('.highlight')
                .on('click', function () {
                    d3.event.preventDefault();
                })
                .on('mouseover', function () {
                    var line = d3.select(this).attr('data-line');
                    var others = _.without(['red', 'Low', 'High'], line);
                    others.forEach(function (other) {
                        mareyContainer.selectAll('.' + other + ', .' + other + '-dimmable, circle.middle').classed('line-dimmed', true);
                    });
                })
                .on('mouseout', function () {
                    mareyContainer.selectAll('.line-dimmed').classed('line-dimmed', false);
                });






        /* Bootstrap the Visualization - and re-render on width changes
         *************************************************************/

        showingMap = true;
        renderMarey(marey, $("#marey_" + randomSubstring).width());
        renderTrainsAtTime();

        renderSideMap(mapGlyphSvg, $("#mapGlyphSvg_" + randomSubstring).width(), $("#mapGlyphSvg_" + randomSubstring).height());





        /* Miscellaneous Utilities
         *************************************************************/
        function highlight() {
            mareyContainer.selectAll('.highlightable').style("opacity", 0.2);
            mareyContainer.classed('highlight-active', !!highlightedTrip);
            mareyContainer.selectAll('.highlightable')
                    .classed('active', function (d) {
                        return d.trip === highlightedTrip;
                    });
            mareyContainer.selectAll('.highlightable.active')._groups[0].length
            if (mareyContainer.selectAll('.highlightable.active') && mareyContainer.selectAll('.highlightable.active')._groups && mareyContainer.selectAll('.highlightable.active')._groups[0] && mareyContainer.selectAll('.highlightable.active')._groups[0].length) {
                mareyContainer.selectAll('.highlightable.active').style("opacity", 1);
                mareyContainer.selectAll('circle.highlightable.active').style("stroke-width", "25px")
                        .style("stroke-opacity", 0.5)
            } else {
                mareyContainer.selectAll('.highlightable').style("opacity", 1);
                mareyContainer.selectAll('circle.highlightable')
                        .style("stroke-opacity", 0)
            }


        }
        function highlightTrain(d) {
            if (d === null) {
                highlightedTrip = null;
            } else {
                highlightedTrip = d.trip;
            }
            highlight();
            d3.event.stopPropagation();
        }
        function unHoverTrain() {
            hoveredTrip = null;
            hover();
        }
        function hoverTrain(d) {
            hoveredTrip = d.trip;
            hover();
        }

        function hover() {
            if (mareyContainer.selectAll('.hoverable.highlightable.active') && mareyContainer.selectAll('.hoverable.highlightable.active')._groups && mareyContainer.selectAll('.hoverable.highlightable.active')._groups[0] && mareyContainer.selectAll('.hoverable.highlightable.active')._groups[0].length) {

                return false;
            }
            marey.selectAll('.hoverable.highlightable').style("stroke-width", "1px");
            mareyContainer.selectAll('circle.highlightable')
                    .style("stroke-opacity", 0);
            mareyContainer.selectAll('.hoverable')
                    .classed('hover', function (d) {
                        return d.trip === hoveredTrip;
                    });
            marey.selectAll('.hoverable.hover').style("stroke-width", "3px");
            mareyContainer.selectAll('circle.highlightable.hover').style("stroke-width", "25px")
                    .style("stroke-opacity", 0.5)

        }
        function highlightMareyTitle(title, lines) {
            var titles = {};
            titles[title] = true;
            if (lines) {
                lines.forEach(function (line) {
                    titles[title + "|" + line] = true;
                });
            } else if (title) {
                titles[title] = true;
                titles[title.replace(/\|.*/, '')] = true;
            }
            var stationLabels = marey.selectAll('text.station-label');
            stationLabels.style('display', function (d) {
                var display = end[d] || titles[d];
                return display ? null : 'none';
            });
            stationLabels.classed('active', function (d) {
                return titles[d.id ? d.id : d];
            });
        }

        function placeWithOffset(from, to, ratio) {
            var fromPos = idToNode[from.stop].pos;
            var toPos = idToNode[to.stop].pos;
            var midpoint = d3.interpolate(fromPos, toPos)(ratio);
            var angle = Math.atan2(toPos[1] - fromPos[1], toPos[0] - fromPos[0]) + Math.PI / 2;
            return [midpoint[0] + Math.cos(angle) * mapGlyphTrainCircleRadius, midpoint[1] + Math.sin(angle) * mapGlyphTrainCircleRadius];
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
            chartTemporal(actualOptions);//calling World function
        }
    });
//------------------------------------------------------------------------------
    /**
     * Fuction to handle show hide of header options
     */
    $("body").on("click", ".header_table_" + randomSubstring, function () {
        var a = parseInt(h / 55);

        $(chart_container).empty();

        $(this).css("display", "none");
        $(".header_chart_" + randomSubstring).css("display", "inline-block");
        var tbl = "<div id ='temporalChart_table_" + randomSubstring + "' style='padding:5px;background-color: #425661;overflow:overflow:hidden;height:" + (_this.height) + "px'><table id ='temporalChart_table1_" + randomSubstring + "' class='table table-striped' style='width:100%;background-color:#425661;padding:5px;color:#5A676E;' ><thead><tr><th>Transaction ID</th><th>From</th><th>To</th><th>Risk Level</th></tr></thead><tbody>";
        $.each(data['marey-trips'], function (index, value) {
            tbl = tbl + "<tr><td>" + (value.trip.toUpperCase()) + "</td><td>" + new Date(value.begin) + "</td><td>" + new Date(value.end) + "</td><td>" + new Date(value.line) + "</td></tr>"

        });
        tbl = tbl + "</tbody></table></div>";
        $(chart_container).append(tbl);
        $('#temporalChart_table1_' + randomSubstring).DataTable({"bLengthChange": false, "paging": false, "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                if (iDisplayIndex % 2 == 1) {
                    //even color
                    $('td', nRow).css('background-color', '#32464F');
                } else {
                    $('td', nRow).css('background-color', '#283C45');
                }
            }});
        $("#temporalChart_table_" + randomSubstring).mCustomScrollbar({
            axis: "y"
        });

        $("#temporalChart_table_" + randomSubstring + " tr:first").css("background-color", "#0CB29A");

        var id1 = $("#temporalChart_table_" + randomSubstring).children('div').find('div').eq(0);
        var id2 = $("#temporalChart_table_" + randomSubstring).children('div').find('div').eq(1);
        var id3 = $("#temporalChart_table_" + randomSubstring).children('div').find('div').eq(2);
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
        $(".dataTables_wrapper").css("background-color", "#374C59");




    });
//------------------------------------------------------------------------------
    /**
     * Fuction to handle show hide of header options
     */
    $("body").on("click", ".header_chart_" + randomSubstring, function () {
        $(chart_container).css("overflow", "hidden");
        var chartId = $(this).parent().parent().parent().parent().siblings("div").attr("id");
        if ("#" + chartId == chart_container) {
            $(this).css("display", "none");
            $(".header_table_" + randomSubstring).css("display", "inline-block");
            $(containerid).empty();
            new temporalChart(actualOptions);
        }
    });
    $("body").on("click", ".header_fullscreen_chart" + randomSubstring, function () {
//       $("#modal_"+randomSubstring).modal("show");
        $("#modal_" + randomSubstring).modal('show');
        var options = jQuery.extend(true, {}, actualOptions);
        setTimeout(function () {
            $("#modal_chart_container" + randomSubstring).css("width", "100%")
            options.container = "#modal_chart_container" + randomSubstring;

            options.headerOptions = false;
            options.height = 450;
            options.ticks = 15;
            new temporalChart(options);
        }, 500)

        //"modal_chart_container"+randomSubstring
    })
}

