/**
 * Function to plot line chart
 */
const default_line_color = "#4294D9";
const default_grid_color = "#1c2d34";
const default_line_stroke_width = "2px";
var div = d3.select("body").append("div").attr("class",
  "line_chart_new_tooltip").style("position", "absolute").style(
    "z-index", 1000).style("background", "rgb(27, 39, 53)").style(
      "padding", "5px 10px").style("border-radius", "10px").style(
        "font-size", "10px").style("display", "none");

import * as $ from 'jquery';
import * as d3 from 'd3';

function LineChart() { }



LineChart.prototype.InitializeandPlotLine = function (options) {
  if (location.hash == "#!/alertDashboard"
    && (!options.data || ((!options.data[0].values || options.data[0].values.length == 0) && (!options.data[1].values || options.data[1].values.length == 0)))) {
    d3.select(options.container).append("div").attr("class",
      "alertsDashErrorDiv").html("<span>Data Not Found</span>");

    return false;
  }
  if (location.hash == "#!/alertDashboard") {
    options.currency = '$';
  }
  $(options.container).empty();
  if (options) {
    options.container = options.container ? options.container : "body"
    options.width = options.width ? options.width : $(options.container)
      .width() - 10
    options.height = options.height ? options.height : 300
    options.marginTop = options.marginTop ? options.marginTop : 10
    options.marginBottom = options.marginBottom ? options.marginBottom : 30
    options.marginRight = options.marginRight ? options.marginRight : 10
    options.marginLeft = options.marginLeft ? options.marginLeft : 50
    options.xParam = options.xParam ? options.xParam
      : $('#errormsg')
        .html(
          'Please check ... May be Data,x-Parameter or y-Parameter is missing.. ');
    options.yParam = options.yParam ? options.yParam
      : $('#errormsg')
        .html(
          'Please check ... May be Data,x-Parameter or y-Parameter is missing.. ');
    options.gridx = options.gridx ? options.gridx : false
    options.gridy = options.gridy ? options.gridy : false
    options.axisX = options.axisX ? options.axisX : false
    options.axisY = options.axisY ? options.axisY : false
    options.showxYaxis = options.showxYaxis ? options.showxYaxis : false
    options.labelRotate = options.labelRotate ? options.labelRotate : 0
    options.noXyAxis = options.noXyAxis ? options.noXyAxis : false
    options.currency = options.currency ? options.currency : ""
  }
  if (!options.axisX) {
    options.marginBottom = 5;
  }
  if (!options.axisY) {
    options.marginLeft = 5
  }
  if (options.labelRotate != 0) {
    var svg = d3.select(options.container).append("svg").attr("width",
      options.width).attr("height", parseInt(options.height) + 15)
  } else {
    var svg = d3.select(options.container).append("svg").attr("width",
      options.width).attr("height", options.height)
  }
  var margin = {
    top: options.marginTop,
    right: options.marginRight,
    bottom: options.marginBottom,
    left: options.marginLeft
  }, width = options.width - margin.left - margin.right, height = options.height
    - margin.top - margin.bottom;

  var parseTime = d3.timeParse("%Y"),
  bisectDate = d3.bisector(function (d) {
    return d.x;
  }).left;

  var formatMillisecond = d3.timeFormat(".%L"), formatSecond = d3
    .timeFormat(":%S"), formatMinute = d3.timeFormat("%I:%M"), formatHour = d3
      .timeFormat("%I %p"), formatDay = d3.timeFormat("%a %d"), formatWeek = d3
        .timeFormat("%b %d"), formatMonth = d3.timeFormat("%B"), formatYear = d3
          .timeFormat("%Y");

  function multiFormat(date) {
    return (d3.timeSecond(date) < date ? formatMillisecond
      : d3.timeMinute(date) < date ? formatSecond
        : d3.timeHour(date) < date ? formatMinute
          : d3.timeDay(date) < date ? formatHour
            : d3.timeMonth(date) < date ? (d3
              .timeWeek(date) < date ? formatDay
              : formatWeek)
              : d3.timeYear(date) < date ? formatMonth
                : formatYear)(date);
  }

  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  function make_x_axis() {
    return d3.axisBottom(x).ticks(3).style("stroke", "red");
  }
  function make_y_axis() {
    return d3.axisLeft(y).ticks(5);
  }

  function extractNumber(num) {
    return num.toString().replace(/\D+$/g, "")
  }
  var line = d3.line().x(function (d) {
    return x(d.x);
  }).y(function (d) {
    return y(extractNumber(d.value));
  })
  // .curve(d3.curveCardinal);

  var g = svg.append("g").attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

  var linedata = options.data;
  var data = options.actualData;
  var tool_tip_data = [];

  $.each(linedata, function (i, d) {

    formatdata(d.values);
  });
  function formatdata(data) {
    data.map(function (d) {

      return d.x = new Date(d.time)
    })
  }

  var yext = [];
  var xext = [];
  var yd3Min;
  $.each(linedata, function (i, d) {
    $.each(d.values, function (i1, d1) {
      tool_tip_data.push(d1)
    });
    yd3Min = d3.min(d.values, function (d1) {
      return parseFloat(extractNumber(d1.value))
    })
    yext.push(yd3Min);
    yext.push(d3.max(d.values, function (d1) {
      return parseFloat(extractNumber(d1.value))
    }));
    xext.push(d3.min(d.values, function (d1) {

      return d1.x
    }));
    xext.push(d3.max(d.values, function (d1) {
      return d1.x
    }));
  });

  x.domain(d3.extent(xext, function (d) {
    return d;
  }));
  if (options.xDomain) {
    x.domain(options.xDomain);
  }
  y.domain(d3.extent(yext, function (d) {
    return d;
  }));

  if (options.ystartsFromZero && (yd3Min >= 0)) {
    var ydomain = y.domain();
    y.domain([0, ydomain[1]]);
  }

  // .text("Population)");

  if (options.gridx == true) {
    var x_g = g.append("g").attr("class", "bs_linegrid").attr("transform",
      "translate(0," + height + ")")
      // .attr("class","gridx").style("fill","red")
      .call(make_x_axis().tickSize(-height, 0, 0)
        // .tickFormat("%Y")
      )
    x_g.selectAll("line").style("shape-rendering", "crispEdges").style(
      "fill", "none").style("stroke", function () {
        if (options.gridcolor) {
          return options.gridcolor;
        } else {
          return default_grid_color;
        }
      });
  }
  if (options.gridy == true) {
    var y_g = g.append("g").attr("class", "bs_linegrid").call(
      make_y_axis().tickSize(-width, 0, 0).tickFormat(""))
    y_g.selectAll("path").style("stroke", options.gridStroke_Y).style(
      "shape-rendering", "crispEdges").style("fill", "none").style(
        "opacity", 0)
    y_g.selectAll("line").style("shape-rendering", "crispEdges").style(
      "fill", "none").style("stroke", function () {
        if (options.gridcolor) {
          return options.gridcolor;
        } else {
          return default_grid_color;
        }
      });
  }

  if (options.axisX) {
    if (options.labelRotate != 0) {
      var h = parseInt(height) + 20
    } else {
      h = height;
    }
    var x_g = g.append("g").attr("class", "bs_axisX").attr("transform",
      "translate(0," + h + ")").call(
        d3.axisBottom(x).ticks(3).tickFormat(function (date) {
          return multiFormat(date)
        }));
    x_g.selectAll('text').attr("transform",
      "rotate(" + options.labelRotate + ")").style("fill", "#778c96")
      .style("font-family", "'Roboto Medium'")
      .style("stroke", "none");
    x_g.selectAll('line').remove();
  }
  if (options.axisY) {
    if (options.yTickFormat) {
      var y_g = g.append("g").attr("class", "bs_axisY").call(
        d3.axisLeft(y).ticks(5).tickFormat(d3.format("")));
    } else {
      var y_g = g.append("g").attr("class", "bs_axisY").call(
        d3.axisLeft(y).ticks(5).tickFormat(d3.formatPrefix('.0s', 1e3)));
    }

    // .append("text")
    // .attr("class", "axis-title")
    // .attr("transform", "rotate(-90)")
    // .attr("y", 6)
    // .attr("dy", ".71em")
    // .style("text-anchor", "end")
    // .attr("fill", "#5D6971")
    // .style("font-size","20px")
    y_g.selectAll('text').style("fill", "#778c96").style("font-family",
      "'Roboto Medium'").style("stroke", "none");
    y_g.selectAll('line').remove();
  }
  if (!options.showxYaxis) {
    svg.selectAll('.domain').style('opacity', 0);
  }
  // var focus = g.append("g")
  // .attr("class", "focus")
  // .style("display", "none");
  //
  // focus.append("line")
  // .attr("class", "x-hover-line hover-line")
  // .attr("y1", 0)
  // .attr("y2", height);
  //
  // focus.append("line")
  // .attr("class", "y-hover-line hover-line")
  // .attr("x1", width)
  // .attr("x2", width);
  //
  // focus.append("circle")
  // .attr("class", "bs_circle")
  // .attr("r", 3.5);
  //
  // focus.append("text")
  // .attr("class", "bs_tooltip")
  // .attr("y", -25)
  // .attr("dy", ".21em");

  svg.append("rect").attr("transform",
    "translate(" + margin.left + "," + margin.top + ")").attr("class",
      "bs_overlay").attr("width", width).attr("height", height).on(
        "mouseover", function () {

          // focus.style("display", null);
        }).on("mouseout", function () {
          div.style("visibility", "hidden");
          div.style("display", "none")
          // focus.style("display", "none");
        }).on("contextmenu", function () {
          if (location.hash == "#!/alertDashboard") {
            window.transSelectedFilter.data = options.type
            window.transSelectedFilter.id = options.container;
            window.transSelectedFilter.chartType = "line";
            // aplyAlertDasboardFilters(d,pieOptions.container,"pie");
          }
        }).on("mousemove", mousemove);

  if (options.plotLineValue) {
    g.append("line").attr("x1", 0).attr("x2", width).attr("y1",
      y(options.plotLineValue)).attr("y2", y(options.plotLineValue))
      .attr("stroke", options.plotLineColor).attr("fill", "none")
      .style(
        "stroke-width",
        options.strokeWidth ? options.strokeWidth
          : default_line_stroke_width)
    g.append("text").attr("x", 5).attr("y", y(options.plotLineValue) - 5)
      .attr("stroke", "none").attr("fill", "#617f8d").text(
        "Average Amount: "
        + getFormattedAmount(options.plotLineValue))
      .style("font-size", "10px")

  }
  function mousemove() {
    // code for multi
    var txt = '';
    var x0 = x.invert(d3.mouse(this)[0]);
    $
      .each(
        linedata,
        function (key, d) {
          d.values.sort(function (a, b) {
            return a.time - b.time
          });
          var i = bisectDate(d.values, x0, 1), d0 = d.values[i - 1], d1 = d.values[i];

          if (d0) {
            div.style("visibility", "visible")
            div.style("display", "inline-block")
            if (d1) {
              var d = x0 - d0.x > d1.x - x0 ? d1 : d0;
            } else {
              var d = d0;
            }
            if (d.value || d.value == 0) {
              if (options.colorsObj) {
                txt = txt + "<div style='color:"
                  + options.colorsObj[key]
                  + "!important'>" + d.time
                  + ": <span >"
                  + options.currency
                  + (Number(d.value).formatAmt())
                  + "</span></div>"

              } else {
                txt = txt + "<div>" + d.time
                  + ": <span>" + options.currency
                  + ' '
                  + (Number(d.value).formatAmt())
                  + "</span></div>"
              }
            }

          } else {
            div.style("display", "none")
          }

        })
    if (!txt || txt == '') {
      div.style("display", "none");
    }
    div.html(txt);
    var p = $(options.container)
    var position = p.offset();
    var elmen = document.getElementsByClassName('line_chart_new_tooltip')
    for (var i = 0; i < elmen.length; i++) {
      var tooltipWidth = elmen[i].clientWidth
    }

    var cursor = d3.event.x;
    if ((position.left < d3.event.pageX) && (cursor > tooltipWidth)
      && cursor > 150) {
      for (var i = 0; i < elmen.length; i++) {
        elmen[i].classList.remove("tooltip-left");
        elmen[i].classList.add("tooltip-right");
      }
      if (tooltipWidth > 0) {
        div.style("left", d3.event.pageX - tooltipWidth + "px");
      } else {
        div.style("left", d3.event.pageX - (width / 2) + "px");
      }
      div.style("top", d3.event.pageY - 25 + "px");
    } else {
      for (var i = 0; i < elmen.length; i++) {
        elmen[i].classList.remove("tooltip-right");
        elmen[i].classList.add("tooltip-left");
      }
      div.style("left", d3.event.pageX + 10 + "px");
      div.style("top", d3.event.pageY - 25 + "px");

    }

    if (txt) {
      div.style("visibility", "visible")
      div.style("display", "inline-block")

    } else {
      div.style("display", "none")
    }
    if (txt == '') {
      div.style("display", "none")
    }
  }
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  if (linedata) {
    if (linedata.length) {
      $.each(linedata, function (i, d) {
        drawline(d.values, i);
      });

    }
  } else {

  }
  function drawline(data, no) {
    data.sort(function (a, b) {
      return a.x.getTime() - b.x.getTime();
    })
    var path = g.append("path").data([data]).attr("class", "bs_line").attr(
      "d", line).style(
        "stroke",
        function (d) {
          if (options.colorsObj) {
            if (location.hash == "#/adverseTransactions"
              && d[0].values != undefined
              && d[0].values[0].risk) {
              return options.colorsObj[(d[0].values[0].risk)];
            } else if (d.risk) {
              return options.colorsObj[d.risk]
            } else {
              return options.colorsObj[no]
            }
          } else {
            return default_line_color;
          }
        }).style("fill", "none").style(
          "stroke-width",
          options.strokeWidth ? options.strokeWidth
            : default_line_stroke_width);
  }
  if (options.noXyAxis == true) {
    $(options.container + ' ' + '.bs_axisX').css('display', 'none')
    $(options.container + ' ' + '.bs_axisY').css('display', 'none')
  }
  // code for number formatting
  Number.prototype.formatAmt = function (decPlaces, thouSeparator,
    decSeparator) {
    var n = this, decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2
      : decPlaces, decSeparator = decSeparator == undefined ? "."
        : decSeparator, thouSeparator = thouSeparator == undefined ? ","
          : thouSeparator, sign = n < 0 ? "-" : "", i = parseInt(n = Math
            .abs(+n || 0).toFixed(decPlaces))
            + "", j = (j = i.length) > 3 ? j % 3 : 0;
    return sign
      + (j ? i.substr(0, j) + thouSeparator : "")
      + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator)
      + (decPlaces ? decSeparator
        + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
  };

  function getFormattedAmount(amt) {
    var formattedAmt = amt;
    return (formattedAmt ? Number(formattedAmt).formatAmt() : "");
  }
  // code for number formatting ends here

};

var LineChartModule = new LineChart();

export {
  LineChartModule
};