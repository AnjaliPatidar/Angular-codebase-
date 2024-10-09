function CaseTimeLineChart(CaseTimeLineOptions) {
    if (CaseTimeLineOptions.container) {
        $(CaseTimeLineOptions.container).empty();
    }
    /* --------------------------Initialize Values----------------------------- */
    if (CaseTimeLineOptions) {
        this.container = CaseTimeLineOptions.container ? CaseTimeLineOptions.container : "body"
        this.data = (CaseTimeLineOptions.data) ? CaseTimeLineOptions.data : []
        this.height = CaseTimeLineOptions.height ? CaseTimeLineOptions.height : 600;
        this.uri = CaseTimeLineOptions.uri;
        this.CaseTimeLineHeader = CaseTimeLineOptions.header ? CaseTimeLineOptions.header : "CaseTimeLine CHART";
        this.margin = CaseTimeLineOptions.margin ? {
            top: CaseTimeLineOptions.margin.top ? CaseTimeLineOptions.margin.top : 20,
            right: CaseTimeLineOptions.margin.right ? CaseTimeLineOptions.margin.right : 20,
            bottom: CaseTimeLineOptions.margin.bottom ? CaseTimeLineOptions.margin.bottom : 30,
            left: CaseTimeLineOptions.margin.left ? CaseTimeLineOptions.margin.left : 40
        } : {top: 10, right: 10, bottom: 20, left: 10};
        this.randomIdString = Math.floor(Math.random() * 10000000000);
    } else {
       
        return false;
    }
    var actualOptioins = jQuery.extend(true, {}, CaseTimeLineOptions);
    var options = jQuery.extend(true, {}, CaseTimeLineOptions);
    var randomSubstring = this.randomIdString;
    var chartContainerdiv = '<div class="chartContainer"  align="center" style="width: 100%; margin: auto; margin-top: 5px; font-size: 14px;"> <div class="graphBox" style="margin: auto; background-color: #374c59; width: 100%;left: 0px;top: 0px;overflow: hidden;position: relative;"><div id="CaseTimeLine_chart_div' + randomSubstring + '" class="chartContentDiv" style="width: 100%;"></div> </div></div>'
    $(this.container).html(chartContainerdiv);
    var chart_container;
    var domElement = chart_container = "#CaseTimeLine_chart_div" + randomSubstring;
    this.width = CaseTimeLineOptions.width ? CaseTimeLineOptions.width : $(chart_container).width() - 10;
    if (this.height > this.width) {
        this.height = this.width;
    }
    if ($(chart_container).siblings(".headerDiv").find(".bstheme_menu_button").length == 0)
        var header_options = '<div style="float: right; padding: 0 10px; cursor: pointer;" class="bstheme_menu_button bstheme_menu_button_' + randomSubstring + '" data-toggle="collapse" data-target="#opt_' + randomSubstring + '"><i class="fa fa-ellipsis-v" aria-hidden="true"></i><div class="bstheme_options" style="position:absolute;right:10px;z-index:2000"> <div style="display:none;" id="opt_' + randomSubstring + '" class="collapse"><span class="header_refresh_' + randomSubstring + '"><i class="fa fa-refresh" aria-hidden="true"></i></span> <span class="header_table_' + randomSubstring + '"> <i class="fa fa-table" aria-hidden="true"></i></span> <span class="header_chart_' + randomSubstring + '" style="display:none" ><i class="fa fa-bar-chart" aria-hidden="true"></i></span></div></div> </div>';
    $(chart_container).siblings(".headerDiv").append(header_options);
    var data = this.data;
    var curretn_uri = this.uri;
    var CaseTimeLine_header = this.header;
    var tool_tip = $('body').append('<div class="CaseTimeLine_Chart_tooltip" style="position: absolute; opacity: 1; pointer-events: none; display:none;background-color:#0cae96;  padding: 10px;border-radius: 5px; border: 1px solid gray;font-size: 10px;color:black;"><span style=" font-size: 12px; position: absolute; white-space: nowrap;  margin-left: 0px; margin-top: 0px; left: 8px; top: 8px;"><span style="font-size:10px" class="tool_tip_x_val"></span><table><tbody><tr><td style="padding:0"> </td><td style="padding:0"><b>216.4 mm</b></td></tr><tr><td style="color:#434348;padding:0">New York: </td><td style="padding:0"><b>91.2 mm</b></td></tr><tr><td style="color:#90ed7d;padding:0">London: </td><td style="padding:0"><b>52.4 mm</b></td></tr><tr><td style="color:#f7a35c;padding:0">Berlin: </td><td style="padding:0"><b>47.6 mm</b></td></tr></tbody></table></span></div>');
    var containerid = this.container;
    var colorScale = d3.scaleOrdinal().range(["#32709A", "#1CB766", "#CEB012", "#E61872", "#ffa618"]);
    var margin = this.margin, width = this.width - margin.left - margin.right,
        height = this.height - margin.top - margin.bottom;
    var outerWidth = this.width, outerHeight = this.height;
    /* APPEND legend header */
    $(".groupedbarlegendContainerDiv").remove();
    $(chart_container).parent().find(".headerDiv").append("<div style='float:right;font-size:14px;' class='groupedbarlegendContainerDiv legend-container' id='legendContainer-" + (randomSubstring) + "'></div>")

    timeline(chart_container)
            .data(data)
            .band("mainBand", 0.82)
            .band("naviBand", 0.08)
            .xAxis("mainBand")
            .xAxis("naviBand")
            .brush("naviBand", ["mainBand"])
            .redraw();
    
    function timeline(domElement) {
    	 /* global timeline variables */
    	var timeline = {},  		/* The timeline */
            data = {},  			/* Container for the data */
            components = [],    	/* All the components of the timeline for redrawing */
            bandGap = 25,      		/* Arbitray gap between to consecutive bands */
            bands = {},      		/* Registry for all the bands in the timeline */
            bandY = 0,      		/* Y-Position of the next band */
            bandNum = 0;    		/* Count of bands for ids */

         /* Create svg element */
        var svg = d3.select(domElement).append("svg")
	                .attr("class", "svg")
	                .attr("id", "svg").style("backgroundcolor", "#384B59")
	                .attr("width", outerWidth)
	                .attr("height", outerHeight)
	                .append("g")
	                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("clipPath")
            .attr("id", "chart-area")
            .append("rect")
            .attr("width", width+5)
            .attr("height", height);

        var chart = svg.append("g")
			            .attr("class", "chart")
			            .attr("clip-path", "url(#chart-area)");

        var tooltip = d3.select("body")
		                .append("div")
		                .attr("class", "tooltip")
		                .style("display", "block");
        /* data */
        timeline.data = function (items) {
            var today = new Date(),
                tracks = [],
                yearMillis = 31622400000,
                instantOffset = 100 * yearMillis;
        	data.items = items;

            function compareAscending(item1, item2) {
            	/* Every item must have two fields: 'start' and 'end'. */
                var result = item1.start - item2.start;
                /* earlier first */
                if (result < 0) {
                    return -1;
                }
                if (result > 0) {
                    return 1;
                }
                /* longer first */
                result = item2.end - item1.end;
                if (result < 0) {
                    return -1;
                }
                if (result > 0) {
                    return 1;
                }
                return 0;
            }

            function compareDescending(item1, item2) {
                /* Every item must have two fields: 'start' and 'end'. */
                var result = item1.start - item2.start;
                /* later first */
                if (result < 0) {
                    return 1;
                }
                if (result > 0) {
                    return -1;
                }
                /* shorter first */
                result = item2.end - item1.end;
                if (result < 0) {
                    return 1;
                }
                if (result > 0) {
                    return -1;
                }
                return 0;
            }

            function calculateTracks(items, sortOrder, timeOrder) {
                var i, track;
                sortOrder = sortOrder || "descending"; 
                timeOrder = timeOrder || "backward"; 
                
                function sortBackward() {
                	/* older items end deeper */
                    items.forEach(function (item) {
                        for (i = 0, track = 0; i < tracks.length; i++, track++) {
                            if (item.end < tracks[i]) {
                                break;
                            }
                        }
                        item.track = track;
                        tracks[track] = item.start;
                    });
                }
                function sortForward() {
                    /* younger items end deeper */
                    items.forEach(function (item) {
                        for (i = 0, track = 0; i < tracks.length; i++, track++) {
                            if (item.start > tracks[i]) {
                                break;
                            }
                        }
                        item.track = track;
                        tracks[track] = item.end;
                    });
                }

                if (sortOrder === "ascending")
                    data.items.sort(compareAscending);
                else
                    data.items.sort(compareDescending);

                if (timeOrder === "forward")
                    sortForward();
                else
                    sortBackward();
            }
            var groups = [];
            /* Convert yearStrings into dates */
            data.items.forEach(function (item) {
                if ($.inArray(item.group, groups) == -1) {
                    groups.push(item.group);
                }
                item.start = parseDate(item.start);
                if (item.end == "") {
                    item.end = new Date(item.start.getTime() + instantOffset);
                    item.instant = true;
                } else {
                    item.end = parseDate(item.end);
                    item.instant = false;
                }
                if (item.end > today) {
                    item.end = today
                }
            });
            calculateTracks(data.items, "descending", "backward");

            data.nTracks = tracks.length;
            data.minDate = d3.min(data.items, function (d) {
                return d.start;
            });
            data.maxDate = d3.max(data.items, function (d) {
                return d.end;
            });
            renderLegends(groups)
            function renderLegends(labelObject) {
                var legenddiv = d3.select('#legendContainer-' + randomSubstring)
                var legendHolder = legenddiv.selectAll('.legend-holder')
			                        .data(labelObject)
			                        .enter()
			                        .append('div')
			                        .attr('class', function (d) {
			                            return 'legend-holder legend_holder_div_' + randomSubstring + '_' + d;
			                        })
			                        .style('display', 'inline-block')
			                        .style('width', '80px')
			                        .style('opacity', '1')
			                        .style('cursor', 'pointer')
			                        .on("click", function () {
			                            var current_div_class = $(this).attr("class");
			                            var rectClass = "rect_" + current_div_class.split(" ")[1].split("legend_holder_div_")[1];
			                          
			                            /* Get current div opacity */
			                            var current_opacity = ($(this).css("opacity"));
			                            newOpacity = current_opacity == 1 ? 0.5 : 1;
			                            $(this).css("opacity", newOpacity);
			                            $("." + rectClass).css("opacity", newOpacity == 0.5 ? 0.2 : newOpacity);
			
			                        });
                /* append legend circles */
                legendHolder
                        .append('div')
                        .style('background-color', function (d, i) {
                            return colorScale(d)
                    	 }).attr("class", "bar_legend_circles")
                        .style("height", "10px")
                        .style("width", "10px")
                        .style("border-radius", "6px")
                        .style("display", "inline-block");

                /* append legend text */
                legendHolder.append("p").text(function (d, i) {
                    return d.toUpperCase();
                }).style('color', function (d, i) {
                    return colorScale(d)
                }).style('display', 'inline-block').style('margin-left', '5px');
            }
            return timeline;
        };
        /*-------------------------------------------- band -------------------------------------------*/
        timeline.band = function (bandName, sizeFactor) {
            var band = {};
            band.id = "band" + bandNum;
            band.x = 0;
            band.y = bandY;
            band.w = width;
            band.h = height * (sizeFactor || 1);
            band.trackOffset = 4;
            /* Prevent tracks from getting too high */
            band.trackHeight = Math.min((band.h - band.trackOffset) / data.nTracks, 50);
            band.itemHeight = band.trackHeight * 0.9,
            band.parts = [],
            band.instantWidth = 100; /* arbitray value */

            band.xScale = d3.scaleTime()
                    .domain([data.minDate, data.maxDate])
                    .range([0, band.w]);

            band.yScale = function (track) {
                return band.trackOffset + track * band.trackHeight;
            };

            band.g = chart.append("g")
                    .attr("id", band.id)
                    .attr("transform", "translate(0," + band.y + ")");

            band.g.append("rect")
	                .attr("class", "band")
	                .attr("width", band.w)
	                .attr("height", band.h).style("fill", "none");

            /* Items */
            if (bandNum == 1) {
                band.itemHeight = 10;
            }
            var items = band.g.selectAll("g")
                    .data(data.items)
                    .enter().append("svg")
                    .attr("y", function (d) {
                        return band.yScale(d.track);
                     })
                    .attr("height", band.itemHeight)
                    .attr("class", function (d) {
                        return d.instant ? "part instant" : "part interval";
                    });
            if (bandNum == 1) {
                var intervals = d3.select("#band" + bandNum).selectAll(".interval");
                intervals.append("circle")
                        .attr("cx", band.itemHeight / 2)
                        .attr("cy", band.itemHeight / 2)
                        .attr("r", 5).style("fill", function (d, i) {
                    return colorScale(d.group)
                })
                intervals.style("fill", "#2E3F49").style("stroke-width", "6").style("pointer-events", "true")
            } else {
                var intervals = d3.select("#band" + bandNum).selectAll(".interval");
                intervals.append("rect")
                        .attr("width", "100%")
                        .attr("height", "100%").attr("rx", 5).attr("ry", 5)
                        .attr("class", function (d) {
                            return "rect_" + randomSubstring + "_" + d.group
                         })
                        .style("fill", "transperant")
                        .style("stroke", "#425661")
                        .style("stroke-width", "2px");
                intervals.append("text")
                        .attr("class", function (d) {
                            return " intervalLabel rect_" + randomSubstring + "_" + d.group
                         })
                        .style("fill", function (d, i) {
                            return colorScale(d.group)
                         }).style("font-size", "14px")
                        .style("font-weight", "700")
                        .attr("x", 10)
                        .attr("y", 15)
                        .text(function (d) {
                            return (d.label).toUpperCase();
                        });
                intervals.append("text")
                        .attr("class", function (d) {
                            return " intervalLabel rect_" + randomSubstring + "_" + d.group
                        })
                        .style("fill", "#5E6C73").style("font-size", "12px")
                        .attr("x", 10)
                        .attr("y", 30)
                        .attr("height", 50)
                        .text(function (d) {
                            return (d.description).toUpperCase();
                         });
                intervals.style("fill", "#2E3F49").style("stroke-width", "6").style("pointer-events", "true")
            }
            band.addActions = function (actions) {
                /* actions - array: [[trigger, function], ...] */
                actions.forEach(function (action) {
                    items.on(action[0], action[1]);
                })
            };

            band.redraw = function () {
                	items
                        .attr("x", function (d) {
                            return band.xScale(d.start);
                        })
                        .attr("width", function (d) {
                            return band.xScale(d.end) - band.xScale(d.start);
                        });
                band.parts.forEach(function (part) {
                    part.redraw();
                })
            	$.each(items._groups[0],function(){
            		if($(this).find("text") && $(this).find("text")[0]){
	            		if(parseFloat($(this).attr("x"))>0  && parseFloat($(this).attr("x"))<parseFloat($(this).parent().parent().parent().parent().attr("width")) && $(this).find("text")[0].innerHTML == "PETRO SAUDI PANAMA"){
	            			showriskTransaction("Risky Transaction", "Click here to Navigate");
	            		}
            		}     				    
            	})
            };   
            bands[bandName] = band;
            components.push(band);
            /* Adjust values for next band */
            bandY += band.h + bandGap;
            bandNum += 1;

            return timeline;
        };
        /* -------------------------------------- xAxis ------------------------------- */
        timeline.xAxis = function (bandName, orientation) {
            var band = bands[bandName];
            var axis = d3.axisBottom(band.xScale)
	                     .tickSize(6, 0)
		                 .tickFormat(function (d) {
//		                	 return toYear(d);
		                	 if (d3.timeYear(d) < d) {
		                	      return d3.timeFormat('%b')(d);
		                	    } else {
		                	      return d3.timeFormat('%Y')(d);
		                	    }
		                  })

            var xAxis = chart.append("g")
		                    .attr("class", "axis")
		                    .attr("transform", "translate(0," + (band.y + band.h) + ")")
		                    .call(axis);
            xAxis.selectAll("path").style("stroke", "#6c7e88")
				                    .style("shape-rendering", "crispEdges")
				                    .style("fill", "none");
            xAxis.selectAll("line").style("stroke", "#6c7e88")
				                    .style("shape-rendering", "crispEdges")
				                    .style("fill", "none");
            xAxis.selectAll("text").style("fill", "#6c7e88")
				                    .style("font-size", "10px")
				                    .style("stroke", "none");

            xAxis.redraw = function () {
                xAxis.call(axis);
                xAxis.selectAll("path").style("stroke", "#6c7e88")
                        .style("shape-rendering", "crispEdges")
                        .style("fill", "none");
                xAxis.selectAll("line").style("stroke", "#6c7e88")
                        .style("shape-rendering", "crispEdges")
                        .style("fill", "none");
                xAxis.selectAll("text").style("fill", "#6c7e88")
                        .style("font-size", "10px")
                        .style("stroke", "none");
            };

            band.parts.push(xAxis); /* for brush.redraw */
            components.push(xAxis); /* for timeline.redraw */

            return timeline;
        };

        /* ----------------------------------------- brush ---------------------------------*/
        timeline.brush = function (bandName, targetNames) {
            var band = bands[bandName];
            var brush = d3.brushX(band.xScale.range([0, band.w]))
            				.extent([[0, 0], [width, height]])
            				.on("end", function () {
					            xBrush.selectAll("rect")
					                    .attr("y", 4)
					                    .attr("height", band.h - 4)
					                    
					            xBrush.selectAll("rect.selection").style("stroke", "#0CB298");

		                        var extent = d3.event.selection;
		                        var domain = (extent === null)
		                                ? band.xScale.domain()
		                                : extent.map(band.xScale.invert, band.xScale);
		                        updateNotifications(domain[0], domain[1]);
		                        /*caseTimelineScope.updateCaseLog(data.items, domain[0], domain[1]);
		                         updateCalendar(domain[0], domain[1]);*/
//		                        updateAssociatedEntities(domain[0], domain[1]);
		                        targetNames.forEach(function (d) {
		                            bands[d].xScale.domain(domain);
		                            bands[d].redraw();
		                        });
            				});

            var xBrush = band.g.append("svg")
			                .attr("class", "x brush")
			                .call(brush)
                xBrush.call(brush.move, [0, width]);
            	xBrush.selectAll("rect")
                		.attr("y", 4)
                		.attr("height", band.h - 4)
//	            xBrush.selectAll(".resize").remove();
//	            xBrush.selectAll(".handle").remove();
            return timeline;
        };

        /* ----------------------------------------- redraw ----------------------------------*/
        timeline.redraw = function () {
            components.forEach(function (component) {
                component.redraw();
            });
        };
        
        function updateCalendar(startDate, endDate) {
        	$('#datepicker').datepicker("setDate", new Date(startDate) );
        	var startDateVal = new Date(startDate);
        	var endDateVal = new Date(endDate);
        	
        	if(startDateVal.getFullYear() >= 2012 || endDateVal.getFullYear() >= 2012 ) {
        		var eventStr = '';
        		eventStr += '<div class="event-list-item">' +
        	    '<div class="avatar-holder"><img src="http://findicons.com/files/icons/1072/face_avatars/300/a01.png" class="img-avatar" style="height: 40px; width: 40px"></div>' +
        		    '<div class="event-details">' +
        		        '<h1 class="headeline">' + 'E-mail from Compliance to the RM with request for information.' + '</h1>' +
        		        '<div class="details">' +
        		            '<strong>Venue:</strong><span>' + '' + '</span>' +
        		            '<br>' +
        		            '<strong>Time:</strong><span>' + 'February 8, 2012' + '</span>' +
        		        '</div>' +
        		    '</div>' +
        		'</div>';
        		
        		eventStr += '<div class="event-list-item">' +
        	    '<div class="avatar-holder"><img src="http://findicons.com/files/icons/1072/face_avatars/300/a01.png" class="img-avatar" style="height: 40px; width: 40px"></div>' +
        		    '<div class="event-details">' +
        		        '<h1 class="headeline">' + 'E-mail from the RM to Compliance  saying there is a business rationale.' + '</h1>' +
        		        '<div class="details">' +
        		            '<strong>Venue: </strong><span>' + '' + '</span>' +
        		            '<br>' +
        		            '<strong>Time: </strong><span>' + 'February 12, 2012' + '</span>' +
        		        '</div>' +
        		    '</div>' +
        		'</div>';
        		
        		$('.event-item-holder').html('');
        		$('.event-item-holder').html(eventStr);
        	} else {
        		$('.event-item-holder').html('');
        	}
        }
      
        /* Notification Sensitive to Case Timeline */
        function updateNotifications(startDate, endDate) {
        	var dataItems = data.items;
        	var notifItemCount = 0;
        	var startDateCompare = new Date(startDate);
        	var endDateCompare = new Date(endDate);
        	var htmlString = '';
        	
        	$.each( dataItems, function( i, dataItem ) {
	    		var dataStartDate = new Date(dataItem.start);
	    		var detailsVal;
	    		if(dataItem.detailedDescription){
	    			detailsVal = dataItem.detailedDescription;
	    		} else {
	    			detailsVal = dataItem.description;
	    		}
	    		
	    		if ((dataStartDate.getTime() >= startDateCompare.getTime()) && (dataStartDate.getTime() <= endDateCompare.getTime())) {
	    			htmlString += '<li class="dataItem" data-toggle="modal" data-details="' + detailsVal + '" data-target="#detailsModal" ng-repeat="notif in notifications" class="ng-scope">'+
						'<div>'+
						   '<i class="fa fa-star-o" aria-hidden="true"></i>'+
						   '<span class="notification-headline">ALERT</span>'+
						   '<span class="pull-right ng-binding">'+
						   dataItem.label +
						   '</span>'+
						'</div>'+
						'<p class="ng-binding">'+dataItem.description+'</p>'+
					 '</li>';
	    			notifItemCount++;
	    		}
	    	});
        	
        	$(document).on("click", ".dataItem", function () {
    		     var detailsVal = $(this).data('details');
    		     $('#detailsText').html('');
    		     $('#detailsText').html(detailsVal);
    		});
        	$('.notifications-counter').html('You have total '+  notifItemCount +' notifications today')
            $('.notifications-list').html(htmlString);
        }
        
        /* Associated Entities Sensitive to Case Time line */
        function updateAssociatedEntities(startDate, endDate) {
            var uri1 = "vendor/data/dataAssociatedEntities.json";
    	    d3.json(uri1, function (data) {
    	    	var associatedEntitiesData = "[";
    	    	var j=0;
    	    	$.each( data, function( i, jsonItem ) {
    	    		/* Calculate date here. */
    	    		var dateJsonItem = new Date(jsonItem.date);
    	    		var startDateCompare = new Date(startDate);
    	    		var endDateCompare = new Date(endDate);

    	    		if ((dateJsonItem.getTime() > startDateCompare.getTime()) && (dateJsonItem.getTime() < endDateCompare.getTime())) {
    	    			if (j > 0) {
        	    			associatedEntitiesData += ",";
        	    		}
    	    			j=1;
    	    			associatedEntitiesData += JSON.stringify(jsonItem);
    	    		}
    	    	});
    	    	associatedEntitiesData += "]";
    	    	timescalebubbleData = JSON.parse(associatedEntitiesData);     
                 var trData;
    	         $.each(timescalebubbleData,function(i,d){
    	        	 if(i==0){
    	        		 trData =  '<tr><td>'+(d.date) +'</td><td>'+d.entityName+'</td><td>'+d.rate+'%</td></tr>';
    	     	        
    	        	 }else{
    	        		 trData = trData+ '<tr><td>'+(d.date) +'</td><td>'+d.entityName+'</td><td>'+d.rate+'%</td></tr>';
    		     	         
    	        	 }
    	         });
    	         $("#associatedEntitiestablebody").empty();
    	         $("#associatedEntitiestablebody").append(trData);
    	         /* $scope.associatedEntitiesDatas = timescalebubbleData;*/
    	    	timescalebubbleChart({
    	    		container: '#associatedEntitiesChart',
	            	data: timescalebubbleData,		          
		            height: '250',
                    isheader:false,
                    ytext:"Similarity Percent",
                    xticks:5,
                    margin:{top: 20, right: 0, bottom: 30, left: 50}
		                
		        });
    	    });
        }
        /* Utility functions */
        function parseDate(dateString) {
            /* 'dateString' must either conform to the ISO date format YYYY-MM-DD
             	or be a full year without month and day.
             	AD years may not contain letters, only digits '0'-'9'!
             	Invalid AD years: '10 AD', '1234 AD', '500 CE', '300
			 	n.Chr.'
             	Valid AD years: '1', '99', '2013'
            	BC years must contain letters or negative numbers!
             	Valid BC years: '1 BC', '-1', '12 BCE', '10 v.Chr.',
			 	'-384'
            	A dateString of '0' will be converted to '1 BC'.
             	Because JavaScript can't define AD years between 0..99,
             	these years require a special treatment.*/

            var format = d3.timeParse("%Y-%m-%d"),
            			date,
            			year;

        	date = format(dateString);
            if (date !== null)
                return date;

            /* BC yearStrings are not numbers!*/
            if (isNaN(dateString)) { /* Handle BC year */
                /* Remove non-digits, convert to negative number */
                year = -(dateString.replace(/[^0-9]/g, ""));
            } else { /* Handle AD year */
                /* Convert to positive number */
                year = +dateString;
            }
            if (year < 0 || year > 99) { /* 'Normal' dates */
                date = new Date(year, 6, 1);
            } else if (year == 0) { /* Year 0 is '1 BC' */
                date = new Date(-1, 6, 1);
            } else { 
            	 /* Create arbitrary year and then set the correct year
                 For full years, I chose to set the date to mid year (1st of July). */
                date = new Date(year, 6, 1);
                date.setUTCFullYear(("0000" + year).slice(-4));
            }
             /* Finally create the date */
            return date;
        }
        function toYear(date, bcString) {
            /* bcString is the prefix or postfix for BC dates.
             If bcString starts with '-' (minus),
             if will be placed in front of the year. */
            bcString = bcString || " BC" /* With blank! */
            var year = date.getUTCFullYear();
            if (year > 0)
                return year.toString();
            if (bcString[0] == '-')
                return bcString + (-year);
            return (-year) + bcString;
        }
        return timeline;
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
            chartCaseTimeLine(options);
        }
    });
    /**
	 * Function to handle show hide of header options
	 */
    $("body").on("click", ".header_table_" + randomSubstring, function () {
        $(chart_container).empty();
        $(this).css("display", "none");
        $(".header_chart_" + randomSubstring).css("display", "inline-block");
        var tbl = "<div id ='CaseTimeLineChart_table'" + randomSubstring + ">";
        var tbl = "<div id ='worldChart_table'" + randomSubstring + "><table class='table-striped' style='width:100%;background-color:#FFF'><thead><tr><th>Label</th><th>Start</th><th>End</th></tr></thead><tbody>";
        $.each(data, function (index, value) {
            tbl = tbl + "<tr><td>" + value.label + "</td><td>" + value.start + "</td><td>" + (value.end ? value.end : "-") + "</td></tr>"
        });
        tbl = tbl + "</tbody></table></div>";
        $(chart_container).append(tbl);
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
            new CaseTimeLineChart(actualOptioins);
        }
    });
}