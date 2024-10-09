'use strict';
/*exported comparisonProgressBar */
/**
 * @purpose: plot progress bar
 * @created: 2th august 2018
 * @author: Karunakar
 * @function :comparisonProgressBar
 * @param :options
 * @returns : no return
 */
function comparisonProgressBar(options) {
    $(options.container).empty();
    options.container = options.container ? options.container : "body";
    options.width = options.width ? options.width : $(options.container).width() - 10;
    options.height = options.height ? options.height : 300;
    options.marginTop = options.marginTop ? options.marginTop : 10;
    options.marginBottom = options.marginBottom ? options.marginBottom : 60;
    options.marginRight = options.marginRight ? options.marginRight : 24;
    options.marginLeft = options.marginLeft ? options.marginLeft : 10;

    //Declared variables.
    var margin, div, lCol, rCol, xFrom, xTo, y, padding, widthScale, xAxis, chart, maxValue1, maxValue2, minValue1, minValue2, finalMax, finalMin, yPosByIndex;

    /**
     * @purpose: To format number to currency,
	 * @created: 22th august 2018,
	 * @author: Karunakar,
     * @function formatAmt,
     * @param decPlaces,thouSeparator,decSeparator,
     * @returns {string}
     */
    Number.prototype.formatAmt = function(decPlaces, thouSeparator, decSeparator) {
        var n = this,
            decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
            decSeparator = decSeparator == undefined ? "." : decSeparator,
            thouSeparator = thouSeparator == undefined ? "," : thouSeparator,
            sign = n < 0 ? "-" : "",
            i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "",
            j = (j = i.length) > 3 ? j % 3 : 0;
        return sign + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
    };
    /**
     * @purpose: To format Number With Comma,
	 * @created: 30th august 2018,
	 * @author: Karunakar,
     * @function: formatNummerWithComma,
     * @param :amount
     * @returns {string}
     */
    function formatNummerWithComma(amount) {
        var formatAmount;
        formatAmount = Number(Math.round(amount)).formatAmt();
        return formatAmount.split('.')[0];
    }

    //	Setting chart margin from all four direction of div i.e marginTop, marginRight, marginBottom, marginLeft.
    margin = {
        top: options.marginTop,
        right: options.marginRight,
        bottom: options.marginBottom,
        left: options.marginLeft

    };
    //	Div to display info on tooltip
    div = d3_v3.select("body").append("div").attr("class", "toolTip_barhorizontal text-uppercase").style("position", "absolute").style("z-index", 1000).style("background", "rgb(27, 39, 53)").style("padding", "5px 10px").style("font-size", "10px").style("display", "none").style("visibility", "hidden").style("min-width", "200px").style("max-width", "300px");
// chord1 and chord2 are the chords connected with ribbons in chord diagram on details page in LEAD generation which is to be compared with each other. 
    lCol = "chord1";
    rCol = "chord2";
    xFrom = d3_v3.scale.linear() // xFrom defines range for left side rectangle.
        .range([0, options.width]);
    xTo = d3_v3.scale.linear() // xTo defines range for right side rectangle.
        .range([0, options.width]);
    y = d3_v3.scale.ordinal() // y defines scale for y axis.
        .rangeBands([20, options.height]);
    padding = [20, 50, 20, 0]; //Top, right, bottom, left
    widthScale = d3_v3.scale.linear() //widthScale defines range of x axis scale.  
        .range([0, options.width + options.width]);
    xAxis = d3_v3.svg.axis() // xaxis with range and scale orientation
        .scale(widthScale)
        .orient("bottom");
    //    Function to rendar chart as per data recieved
    /**
     * @purpose: to render compare progressbar chart as per data recieved in function(comparisonProgressBar)  as options.data,
	 * @created: 12th august 2018,
	 * @author: Karunakar,
     * @function: render,
     * @param :data
     * @returns no return type
     */
    function render(data) {

        chart = d3_v3.select(options.container).append("svg") //create chart svg
            .attr('class', 'chartToCompare') //append svg with specific class.
            .attr("width", options.width + options.width + options.marginRight) //append svg with particular width
            .attr("height", options.height + margin.top + margin.bottom)//append svg with particular height
            .append("g") //create a group g on svg
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        maxValue1 = d3_v3.max(data, function(d) {
            return d[lCol]; //to find max  value in  data as per lCol(chord1)
        });
        maxValue2 = d3_v3.max(data, function(d) {
            return d[rCol]; //to find max  value in  data as per rCol(chord2)
        });
        minValue1 = d3_v3.min(data, function(d) {
            return d[lCol]; //to find min  value in  data as per lCol(chord1)
        });
        minValue2 = d3_v3.min(data, function(d) {
            return d[rCol]; //to find min value in  data as per rCol(chord2)
        });

        if (maxValue1 > maxValue2) { //to find max  value out of two chords (i.e chord1 & chord2)
            finalMax = maxValue1;
        } else {
            finalMax = maxValue2;
        }

        if (minValue1 > minValue2) { //to find min  value out of two chords (i.e chord1 & chord2)
            finalMin = minValue2;
        } else {
            finalMin = minValue1;
        }
        xFrom.domain([finalMin, finalMax]); //create domain from min to max for xFrom

        widthScale.domain(['-' + finalMax, finalMax]); //create domain from min to max for widthScale
        xTo.domain(d3_v3.extent(data, function(d) {
            return d[rCol];
        }));

        y.domain(data.map(function(d) { //create domain from min to max for y
            return d.name;
        }));

        yPosByIndex = function(d) { // to find position index value of key(name) on Y axis
            return y(d.name);
        };
        chart.append("g") //append g for progress bar to show ticks
            .attr("class", "x_axis_progressbar") //append Xaxis & ticks with specific class.
            .attr("transform", "translate(" + padding[3] + "," + (options.height) + ")")
            .call(xAxis.tickFormat(function(d) {
                    if (d < 0) {
                        return -1 * d;
                    } else {
                        return d;
                    }
                }).tickSize(-options.height + margin.top, 0, 0).ticks(16) //tick number and size
            ).selectAll("text")
            .attr("transform", "rotate(45)")
            .style("text-anchor", "start");


        chart.selectAll("rect.left") //append rect on left hand side
            .data(data)
            .enter().append("rect")
            .attr("x", function(d) {
                return (options.width - xFrom(d[lCol]) - 2); //x pos of rect
            })
            .attr('rx', 3) //chamfer corner of rect from x
            .attr('ry', 3) //chamfer corner of rect from y
            .attr("y", yPosByIndex)
            .attr("class", "left")
            .attr("width", function(d) {
                return xFrom(d[lCol]); // width declared for rect
            })
              .style("cursor","pointer")
            .attr('fill', function(d) { // fill color
                var index = options.colorObj.map(function(d1) {
                    return d1.name;
                }).indexOf(d.name);
                return options.colorObj[index].color;
            })
            .attr("height", y.rangeBand() - 4) // height declared for rect
            .on("mouseover", function(d) { //mouseover on left side rect to show value.
                d3_v3.select(this).style("opacity", "0.7"); //on mouseover set opacity.
                div.style("visibility", "visible");//on mouseover set visibility to visible for tooltip div.
                div.style("display", "inline-block");
                div.html("<div style='color:white;margin-bottom:15px'><h5>" + d.name + "</h5></div><div style='margin-bottom:15px'>Value <h4 style='color:#3372A8;margin-top:0'>" + "₪ " + formatNummerWithComma(d.chord1) + "</h4></div>");
            })
            .on("mousemove", function() {
                var p = $(options.container); // selecting container of chart div
                var position = p.offset();// set position container of chart div
                var tooltipWidth = $(".toolTip_barhorizontal").width() + 50; // tooltip div width
                var cursor = d3_v3.event.x;
                if ((position.left < d3_v3.event.pageX) && (cursor > tooltipWidth)) { //changing left and right class on tooltip div as per condition to avoid tooltip div from getting hidden.
                    var element = document.getElementsByClassName("toolTip_barhorizontal");
                    for (var i = 0; i < element.length; i++) {
                        element[i].classList.remove("tooltip-left");
                        element[i].classList.add("tooltip-right");
                    }
                    $(".toolTip_barhorizontal").css("left", (d3_v3.event.pageX - 30 - $(".toolTip_barhorizontal").width()) + "px");
                } else {
                    var element = document.getElementsByClassName("toolTip_barhorizontal");
                    for (var i = 0; i < element.length; i++) {
                        element[i].classList.remove("tooltip-right");
                        element[i].classList.add("tooltip-left");
                    }
                    $(".toolTip_barhorizontal").css("left", (d3_v3.event.pageX) + 20 + "px");
                }
                return $(".toolTip_barhorizontal").css("top", d3_v3.event.pageY - 20 + "px");
            })
            .on("mouseout", function() {
                d3_v3.select(this).style("opacity", 1);
                div.style("visibility", "hidden");
                div.style("display", "none");
            });
        chart.selectAll("rect.right") //append rect on left hand side
            .data(data)
            .enter().append("rect")
            .attr("x", options.width)
            .attr("y", yPosByIndex)
            .attr("class", "right")
               .style("cursor","pointer")
            .attr("width", function(d) {
                return xFrom(d[rCol]); // width declared for rect
            })
            .attr('fill', function(d) { // fill colors on  rect
                var index = options.colorObj.map(function(d1) {
                    return d1.name;
                }).indexOf(d.name);
                return options.colorObj[index].color;
            })
            .attr('rx', 3) //chamfer corner of rect from x
            .attr('ry', 3) //chamfer corner of rect from y
            .attr("height", y.rangeBand() - 4)
            .on("mouseover", function(d) {
                d3_v3.select(this).style("opacity", "0.7");
                div.style("visibility", "visible");
                div.style("display", "inline-block");
                div.html("<div style='color:white;margin-bottom:15px'><h5>" + d.name + "</h5></div><div style='margin-bottom:15px'>Value <h4 style='color:#3372A8;margin-top:0'>" + "₪ " + formatNummerWithComma(d.chord2) + "</h4></div>");
            })
            .on("mousemove", function() {
                var p = $(options.container);
                var position = p.offset();
                var tooltipWidth = $(".toolTip_barhorizontal").width() + 50;
                var cursor = d3_v3.event.x;
                if ((position.left < d3_v3.event.pageX) && (cursor > tooltipWidth)) {
                    var element = document.getElementsByClassName("toolTip_barhorizontal");
                    for (var i = 0; i < element.length; i++) {
                        element[i].classList.remove("tooltip-left");
                        element[i].classList.add("tooltip-right");
                    }
                    $(".toolTip_barhorizontal").css("left", (d3_v3.event.pageX - 30 - $(".toolTip_barhorizontal").width()) + "px");
                } else {
                    var element = document.getElementsByClassName("toolTip_barhorizontal");
                    for (var i = 0; i < element.length; i++) {
                        element[i].classList.remove("tooltip-right");
                        element[i].classList.add("tooltip-left");
                    }
                    $(".toolTip_barhorizontal").css("left", (d3_v3.event.pageX) + 20 + "px");
                }
                return $(".toolTip_barhorizontal").css("top", d3_v3.event.pageY - 20 + "px");

            })
            .on("mouseout", function() {
                d3_v3.select(this).style("opacity", 1);
                div.style("visibility", "hidden");
                div.style("display", "none");
            });

        chart.selectAll("text.leftscore") //append text for rect on left hand side
            .data(data)
            .enter().append("text")
            .attr("x", function(d) {
                if (xFrom(d[lCol]) >= 150) { //150 is min size of rect bar if size is less 150 than to maintain text away from colliding in center +100 is being added.
                    return options.width - xFrom(d[lCol]) + 100;
                } else {
                    return options.width - xFrom(d[lCol]) - 40;
                }
            })
            .attr("y", function(d) {
                return y(d.name) + y.rangeBand() / 2;
            })
            .attr("dx", "20")
            .attr("dy", ".36em")
            .attr("text-anchor", "end")
            .attr('class', 'leftscore')
             .style("cursor","pointer")
            .text(function(d) {
                return "₪ " + Number(d[lCol]).formatAmt();
            })
            .attr('fill', function(d) {
                var index = options.colorObj.map(function(d1) { // fill colors
                    return d1.name;
                }).indexOf(d.name);
                return options.colorObj[index].textColor;
            })
                .on("mouseover", function(d) {
                d3_v3.select(this).style("opacity", "0.7");
                div.style("visibility", "visible");
                div.style("display", "inline-block");
                div.html("<div style='color:white;margin-bottom:15px'><h5>" + d.name + "</h5></div><div style='margin-bottom:15px'>Value <h4 style='color:#3372A8;margin-top:0'>" + "₪ " + formatNummerWithComma(d.chord1) + "</h4></div>");
            })
            .on("mousemove", function() {
                var p = $(options.container);
                var position = p.offset();
                var tooltipWidth = $(".toolTip_barhorizontal").width() + 50;
                var cursor = d3_v3.event.x;
                if ((position.left < d3_v3.event.pageX) && (cursor > tooltipWidth)) {
                    var element = document.getElementsByClassName("toolTip_barhorizontal");
                    for (var i = 0; i < element.length; i++) {
                        element[i].classList.remove("tooltip-left");
                        element[i].classList.add("tooltip-right");
                    }
                    $(".toolTip_barhorizontal").css("left", (d3_v3.event.pageX - 30 - $(".toolTip_barhorizontal").width()) + "px");
                } else {
                    var element = document.getElementsByClassName("toolTip_barhorizontal");
                    for (var i = 0; i < element.length; i++) {
                        element[i].classList.remove("tooltip-right");
                        element[i].classList.add("tooltip-left");
                    }
                    $(".toolTip_barhorizontal").css("left", (d3_v3.event.pageX) + 20 + "px");
                }
                return $(".toolTip_barhorizontal").css("top", d3_v3.event.pageY - 20 + "px");

            })
            .on("mouseout", function() {
                d3_v3.select(this).style("opacity", 1);
                div.style("visibility", "hidden");
                div.style("display", "none");
            });


        chart.selectAll("text.score") //append text for rect on right hand side
            .data(data)
            .enter().append("text")
            .attr("x", function(d) {
                if (xFrom(d[rCol]) <= 90) { //90 is min size of rect bar if size is less 90 than to maintain text away from colliding in center +90 is being added.
                    return xFrom(d[rCol]) + options.width + 90;
                } else {
                    return xFrom(d[rCol]) + options.width;
                }
            })
            .attr("y", function(d) {
                return y(d.name) + y.rangeBand() / 2;
            })
            .attr("dx", -5)
            .attr("dy", ".36em")
            .attr("text-anchor", "end")
            .attr('class', 'score')
            .style("cursor","pointer")
            .text(function(d) {
                return "₪ " + Number(d[rCol]).formatAmt();
            })
            .attr('fill', function(d) { // fill colors
                var index = options.colorObj.map(function(d1) {
                    return d1.name;
                }).indexOf(d.name);
                return options.colorObj[index].textColor;
            })
                .on("mouseover", function(d) {
                d3_v3.select(this).style("opacity", "0.7");
                div.style("visibility", "visible");
                div.style("display", "inline-block");
                div.html("<div style='color:white;margin-bottom:15px'><h5>" + d.name + "</h5></div><div style='margin-bottom:15px'>Value <h4 style='color:#3372A8;margin-top:0'>" + "₪ " + formatNummerWithComma(d.chord2) + "</h4></div>");
            })
            .on("mousemove", function() {
                var p = $(options.container);
                var position = p.offset();
                var tooltipWidth = $(".toolTip_barhorizontal").width() + 50;
                var cursor = d3_v3.event.x;
                if ((position.left < d3_v3.event.pageX) && (cursor > tooltipWidth)) {
                    var element = document.getElementsByClassName("toolTip_barhorizontal");
                    for (var i = 0; i < element.length; i++) {
                        element[i].classList.remove("tooltip-left");
                        element[i].classList.add("tooltip-right");
                    }
                    $(".toolTip_barhorizontal").css("left", (d3_v3.event.pageX - 30 - $(".toolTip_barhorizontal").width()) + "px");
                } else {
                    var element = document.getElementsByClassName("toolTip_barhorizontal");
                    for (var i = 0; i < element.length; i++) {
                        element[i].classList.remove("tooltip-right");
                        element[i].classList.add("tooltip-left");
                    }
                    $(".toolTip_barhorizontal").css("left", (d3_v3.event.pageX) + 20 + "px");
                }
                return $(".toolTip_barhorizontal").css("top", d3_v3.event.pageY - 20 + "px");

            })
            .on("mouseout", function() {
                d3_v3.select(this).style("opacity", 1);
                div.style("visibility", "hidden");
                div.style("display", "none");
            });



        //   chart.append("text").attr("x", width / 3).attr("y", 10).attr("class", "title").text("Infant Mortality");
        // chart.append("text").attr("x", width / 3 + rightOffset).attr("y", 10).attr("class", "title").text("GDP");
        //     chart.append("text").attr("x",width+labelArea/3).attr("y", 10).attr("class","title").text("Countries");

        var zeroPosition = parseInt($('.x_axis_progressbar .tick').find('text').length / 2);
        var ele = $('.x_axis_progressbar .tick').find('text')[zeroPosition];
        $(ele).attr('transform', 'rotate(0)');

        $(options.container).find('.domain').css('display', 'none'); // to hide domain 
        $(options.container).find('.x_axis_progressbar').find('text').css('fill', '#6A6A6A');
        $(options.container).find('.x_axis_progressbar').find('tick').find('line').css('stroke', '#00000;!important'); //ticks stroke on x_axis_progressbar
    }

    render(options.data);

}