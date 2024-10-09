import * as $ from 'jquery';
import * as d3 from 'd3';
function LineChartGradient() { }
LineChartGradient.prototype.gradientLineChart = function (options) {
    $('#'+options.container).empty();
    var container = document.getElementById(options.container);
    // container.innerHTML =null
    if (options) {
        options.container = options.container ? options.container : "body";
        options.width = options.width ? options.width : $('#'+options.container).width();;
        options.height = options.height ? options.height : 300;
        options.marginTop = options.marginTop ? options.marginTop : 30;
        options.marginBottom = options.marginBottom ? options.marginBottom : 30;
        options.marginRight = options.marginRight ? options.marginRight : 20;
        options.marginLeft = options.marginLeft ? options.marginLeft : 50;
        options.strokeWidth = options.strokeWidth ? options.strokeWidth : 2;
        options.circleRadius = options.circleRadius ? options.circleRadius : 7;
        options.data = options.data ? options.data : [];
        options.itemSize = options.itemSize ? options.itemSize : 22;
        options.show_YAxis = options.show_YAxis ? options.show_YAxis : true;
        options.show_YAxisText = options.show_YAxisText ? options.show_YAxisText : true;
        options.show_YAxisPath = options.show_YAxisPath ? options.show_YAxisPath : true;
        options.show_YAxisTicks = options.show_YAxisTicks ? options.show_YAxisTicks : true;
        options.fontSize_YAxis = options.fontSize_YAxis ? options.fontSize_YAxis : 10;
        options.fontFamily_YAxis = options.fontFamily_YAxis ? options.fontFamily_YAxis : "sans-serif";
        options.show_XAxis = options.show_XAxis ? options.show_XAxis : true;
        options.show_XAxisText = options.show_XAxisText ? options.show_XAxisText : true;
        options.show_XAxisPath = options.show_XAxisPath ? options.show_XAxisPath : true;
        options.show_XAxisTicks = options.show_XAxisTicks ? options.show_XAxisTicks : true;
        options.fontSize_XAxis = options.fontSize_XAxis ? options.fontSize_XAxis : 10;
        options.fontFamily_XAxis = options.fontFamily_XAxis ? options.fontFamily_XAxis : "sans-serif";
        options.gridx = options.gridx ? options.gridx : false;
        options.gridy = options.gridy ? options.gridy : false;
    }

    var margin = { top: options.marginTop, right: options.marginRight, bottom: options.marginBottom, left: options.marginLeft }

    var width = options.width - options.marginRight - options.marginLeft,
        height = options.height - options.marginTop - options.marginBottom;
   // Get the data
   var data = $.extend(true, [], options.data);
    // parse the date / time
    var parseTime = d3.timeParse("%b %d, %Y");
    var hms = '02:04:33';   // your input string
    var a = hms.split(':'); // split it at the colons
    // format the data
   data = data.sort((val1, val2)=> {return new Date(val1.date) - new  Date(val2.date)});
    data.forEach(function (d) {
        d.date = new Date(d.date);
        d.y= d.y.split(':');
        d.y = millisecond(d.y);
    });
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    // define the area
    var area = d3.area()
    .x(function(d) {
        return x(d.date);
    })
    .y0(height)
    .y1(function(d) {
        return y(d.y);
    });
    // define the line
    var line = d3.line()
        .x(function (d) { return x(d.date); })
        .y(function (d) { return y(d.y); });

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin

    var svg = d3.select(container).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Scale the range of the data
    x.domain(d3.extent(data, function (d) { return d.date; }));
    y.domain([0, d3.max(data, function (d) { return d.y; })]);
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
    data.map(function (point, index, arr) {
        var next = arr[index + 1],
            prev = arr[index - 1];

        point.x = point.date,
            point.y = point.y,
            point.x1 = point.date,
            point.y1 = point.y,
            point.x2 = (next) ? next.date : prev.date,
            point.y2 = (next) ? next.y : prev.y,
            point.iserr = point.iserr

    });
    // add the area
    svg.append("path")
    .data([data])
    .attr("class", "area")
    .attr("d", area)
    .style("fill", "url(#area-gradient)")
    // Add the valueline path.
    svg.selectAll('path')
        .data([data])
        .attr("class", "line")
        .attr("d", line)
        .attr('x1', function (d) { return x(d.x1); })
        .attr('y1', function (d) { return y(d.y1); })
        .attr('x2', function (d) { return x(d.x2); })
        .attr('y2', function (d) { return y(d.y2); })
        .attr("stroke", function (d) {
            return (d.iserr) ? 'red' : '#009ACD';
        })
        .attr("fill", "none")
        .attr("stroke-width", options.strokeWidth);
    // Add the X Axis
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
        x_g.selectAll("path").style("stroke", "#6c7e88")
        .style("shape-rendering", "crispEdges")
        .style("fill", "none");
        x_g.selectAll("line").style("stroke", "#6c7e88")
        .style("shape-rendering", "crispEdges")
        .style("fill", "none");
        x_g.selectAll("text")
        .style("font-size", "10px")
        .style("stroke", "none");

    //   svg.append("g")
    //       .attr("transform", "translate(0," + height + ")")
    //       .call(d3.axisBottom(x));

    // Add the Y Axis
    var y_g =svg.append("g")
        .call(d3.axisLeft(y))
        .style("stroke", "db3f8d");
        y_g.selectAll("path").style("stroke", "#6c7e88")
        .style("shape-rendering", "crispEdges")
        .style("fill", "none");
    y_g.selectAll("line").style("stroke", "#6c7e88")
        .style("shape-rendering", "crispEdges")
        .style("fill", "none");
    y_g.selectAll("text")
        .style("font-size", "10px")
        .style("fill", "#6c7e88")
        .style("stroke", "none");
    svg.selectAll("myCircles")
        .data(data)
        .enter()
        .append("circle")
        //.attr("fill", "teal")
        .style("fill", function (d) {
            return d.iserr ? "red" : "#009ACD";

            ;
        })
        .attr("stroke", "none")
        .attr("cx", function (d) { return x(d.date) })
        .attr("cy", function (d) { return y(d.y) })
        .attr("r", options.circleRadius)

 // minutes are worth 60 seconds. Hours are worth 60 minutes.
function millisecond(arrMilliSec){
    var seconds = (+arrMilliSec[0]) * 60 * 60 + (+arrMilliSec[1]) * 60 + (+arrMilliSec[2]); 
     return seconds
}

};

var LineChartGradientModule = new LineChartGradient();

export {
    LineChartGradientModule
};