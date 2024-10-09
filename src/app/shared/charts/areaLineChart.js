    function areaLineChart(options){
        $(options.container).empty();
        if (options)
        {
            options.container = options.container ? options.container : "body";
            options.width = options.width ? options.width : $(options.container).width(); 
            options.height = options.height ? options.height : 300;
            options.marginTop = options.marginTop ? options.marginTop : 20;
            options.marginBottom = options.marginBottom ? options.marginBottom : 50;
            options.marginRight = options.marginRight ? options.marginRight : 20;
            options.marginLeft = options.marginLeft ? options.marginLeft : 20;
            options.xParam = options.xParam ? options.xParam : $('#errormsg').html('Please check ... May be Data,x-Parameter or y-Parameter is missing.. ');
            options.yParam = options.yParam ? options.yParam : $('#errormsg').html('Please check ... May be Data,x-Parameter or y-Parameter is missing.. ');
            options.gridx = options.gridx ? options.gridx : false;
            options.gridy = options.gridy ? options.gridy : false;
            options.axisX = options.axisX ? options.axisX : false;
            options.axisY = options.axisY ? options.axisY : false;
            options.showxYaxis = options.showxYaxis ? options.showxYaxis : false;
            options.labelRotate = options.labelRotate ? options.labelRotate : 0;
            options.randomIdString = Math.floor(Math.random() * 10000000000);
            options.header = options.header ? options.header : "AREA LINE CHART";
            options.color = options.color ? options.color : "#BE62AE";
            options.labelRotate = options.labelRotate ? options.labelRotate : 0;
            options.headerOptions = options.headerOptions == false ? options.headerOptions : false;
    
        }
        
        //Area chart 
        //set the dimensions and margins of the graph
      
            var margin = {top: options.marginTop, right: options.marginRight, bottom: options.marginBottom, left: options.marginLeft},
            width = options.width - margin.left - margin.right,
            height = options.height - margin.top - margin.bottom;
            
            if (options.labelRotate != 0) {
            var svg = d3.select(options.container).append("svg").attr("width", width).attr("height", parseInt(options.height) + 25)
            } else {
            var svg = d3.select(options.container).append("svg").attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
            }
        
        
        var div = d3.select("body").append("div").attr("class", "arealine_chart_new_tooltip").style("position", "absolute").style("z-index", 1000).style("background", "rgb(27, 39, 53)").style("padding", "5px 10px").style("border-radius", "10px").style("font-size", "10px").style("display", "none");
        // parse the date / time
        var parseTime = d3.timeParse("%d-%b-%y");
    
        // set the ranges
        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);
    
        // define the area
        var area = d3.area()
            .x(function(d) {
                return x(d.date);
            })
            .y0(height)
            .y1(function(d) {
                return y(d.close);
            });
    
        // define the line
        var valueline = d3.line()
            .x(function(d) {
                return x(d.date);
            })
            .y(function(d) {
                return y(d.close);
            });
    
        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
    //    var svg = d3.select("#cashHoldingPatternLineChart").append("svg")
    //        .attr("width", width + margin.left + margin.right)
    //        .attr("height", height + margin.top + margin.bottom)
    //        .append("g")
    //        .attr("transform",
    //            "translate(" + margin.left + "," + margin.top + ")");
    
        // get the data
        var data = options.data;
    
        // format the data
        data.forEach(function(d) {
            d.date = parseTime(d.date);
            d.close = +d.close;
        });
    
        // scale the range of the data
        x.domain(d3.extent(data, function(d) {
            return d.date;
        }));
        y.domain([0, d3.max(data, function(d) {
            return d.close;
        })]);
    
        svg.append("linearGradient")
            .attr("id", "area-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0).attr("y1", y(0))
            .attr("x2", 0).attr("y2", y(1000))
            .selectAll("stop")
            .data([{
                offset: "0%",
                color: "#393b4b"
            }, {
                offset: "30%",
                color: "#453a4f"
            }, {
                offset: "60%",
                color: "#503a53"
            }, {
                offset: "100%",
                color: "#533b55"
            }, ])
            .enter().append("stop")
            .attr("offset", function(d) {
                return d.offset;
            })
            .attr("stop-color", function(d) {
                return d.color;
            });
    
    
        // add the area
        svg.append("path")
            .data([data])
            .attr("class", "area")
            .attr("d", area)
            .style("fill", "url(#area-gradient)")
            // add the valueline path.
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline)
            .style("stroke", "db3f8d")
            .style("fill", "none")
            .style("stroke-width", "2px");
        // add the X Axis
        var x_g = svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
        x_g.selectAll('text')
            .attr("transform", "rotate(-65)")
            .style("fill", "#778c96")
            .style("font-family", "'Roboto Medium'")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .style("stroke", "none");
        x_g.selectAll('path').remove();
        // add the Y Axis
        svg.append("g")
            .call(d3.axisLeft(y))
            .style("display", "none");
    
        svg.selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("class", "circle")
            .attr("cx", function(d) {
                return x(d.date);
            })
            .attr("cy", function(d) {
                return y(d.close);
            })
            .attr("r", 6)
            .style("fill", "#8e3260")
            .style("stroke", "#c83f85")
            .on("mouseover", function(d) {
                $(this).css("fill-opacity", 0.1);
                $(".arealine_chart_new_tooltip").html('<span>' + "$" + d.close + "K" + '</span>');
                return $(".arealine_chart_new_tooltip").css("display", "block");
            })
            .on("mousemove", function() {
                var p = $(options.container)
                var position = p.offset();
                var windowWidth = window.innerWidth;
                var tooltipWidth = $(".arealine_chart_new_tooltip").width() + 50
                var cursor = d3.event.x;
                if ((position.left < d3.event.pageX) && (cursor > tooltipWidth)) {
                    var element = document.getElementsByClassName("arealine_chart_new_tooltip");
                    for (i = 0; i < element.length; i++) {
                        element[i].classList.remove("tooltip-left");
                        element[i].classList.add("tooltip-right");
    
                    }
                    $(".arealine_chart_new_tooltip").css("left", (d3.event.pageX - 15 - $(".arealine_chart_new_tooltip").width()) + "px");
                } else {
                    var element = document.getElementsByClassName("arealine_chart_new_tooltip");
                    for (i = 0; i < element.length; i++) {
                        element[i].classList.remove("tooltip-right");
                        element[i].classList.add("tooltip-left");
    
                    }
                    $(".arealine_chart_new_tooltip").css("left", (d3.event.pageX + 10) + "px");
    
                }
                return $(".arealine_chart_new_tooltip").css("top", d3.event.pageY + "px")
    
    
            })
            .on("mouseout", function() {
                $(this).css("fill-opacity", 1);
                //hide tool-tip
                return $(".arealine_chart_new_tooltip").css("display", "none");
            });
    }


    