import * as $ from "jquery";
import * as d3 from "d3";
import { saveAs } from "file-saver";
// import * as savePng from "save-svg-as-png";
import * as html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

var stackedtimelinediv = d3
  .select("body")
  .append("div")
  .attr("class", "toolTip_piehorizontal tooltip_stackedTime")
  .style("position", "absolute")
  .style("z-index", 1000)
  .style("background", "rgb(27, 39, 53)")
  .style("padding", "35px 10px")
  .style("border-radius", "10px")
  .style("font-size", "10px")
  .style("display", "none");
function stackedbarTimelinechart() {}
stackedbarTimelinechart.prototype.stackedbarTimelinechartProto = function (
  options,
  d3
) {
  $(options.container).empty();
  if (options) {
    options.container = options.container ? options.container : "body";
    options.width = options.width
      ? options.width
      : $(options.container).width() - 10;
    options.height = options.height ? options.height : 300;
    options.marginTop = options.marginTop ? options.marginTop : 10;
    options.marginBottom = options.marginBottom ? options.marginBottom : 30;
    options.marginRight = options.marginRight ? options.marginRight : 10;
    options.marginLeft = options.marginLeft ? options.marginLeft : 50;
    options.xParam = options.xParam
      ? options.xParam
      : $("#errormsg").html(
          "Please check ... May be Data,x-Parameter or y-Parameter is missing.. "
        );
    options.yParam = options.yParam
      ? options.yParam
      : $("#errormsg").html(
          "Please check ... May be Data,x-Parameter or y-Parameter is missing.. "
        );
    options.gridx = options.gridx ? options.gridx : false;
    options.gridy = options.gridy ? options.gridy : false;
    options.axisX = options.axisX ? options.axisX : true;
    options.axisY = options.axisY ? options.axisY : true;
    options.tickColor = options.tickColor ? options.tickColor : "red";
    options.showxYaxis = options.showxYaxis ? options.showxYaxis : false;
    options.color_hash = options.color_hash
      ? options.color_hash
      : {
          0: ["Invite", "#3132FE"],
          1: ["Accept", "#E81F0F"],
          2: ["Decline", "#B2CCE7"],
        };
    options.showXaxisTitle = options.showXaxisTitle
      ? options.showXaxisTitle
      : "";
    options.showYaxisTitle = options.showYaxisTitle
      ? options.showYaxisTitle
      : "";
    options.widgetId = options.widgetId;
    options.showlabel = options.showlabel ? options.showlabel : false;
    options.widgetName = options.widgetName
      ? options.widgetName
      : "widget chart";
  }
  var padding = {
    top: options.marginTop,
    right: options.marginRight,
    bottom: options.marginBottom,
    left: options.marginLeft,
  };
  var w = options.width - padding.left - padding.right,
    h = options.height - padding.top - padding.bottom;
  var dataset;
  //Set up stack method
  var stack = d3.layout.stack();
  var colors = [
    "#7881eb",
    "#91b23e",
    "#6256bf",
    "#54be66",
    "#ba499e",
    "#47bb8a",
    "#c12e74",
    "#33d4d1",
    "#df5b51",
    "#6697e2",
    "#caa331",
    "#553081",
    "#6db069",
    "#ca73d4",
    "#4e6e21",
    "#c285cf",
    "#aab866",
    "#5662b0",
    "#b69c41",
    "#832b66",
    "#cb762d",
    "#d473a2",
    "#b88146",
    "#e76697",
    "#a84822",
    "#8e2c53",
    "#a64b37",
    "#d75f77",
    "#8f2738",
    "#d85b64",
  ];
  dataset = options.data;

  //Data, stacked
  stack(dataset);
  //var color_hash =
  if (options.colors) var colorScale = d3.scaleOrdinal().range(options.colors);
  //Set up scales
  var x = d3.scale
    .ordinal()
    .domain(
      dataset[0].map(function (d) {
        return d.time;
      })
    )
    .rangeRoundBands([0, w], 0.2);

  var y = d3.scale
    .sqrt()
    .domain([
      0,
      d3.max(dataset, function (d) {
        return d3.max(d, function (d) {
          return d.y0 + d.y;
        });
      }),
    ])

    .range([h, 0]);
  var xAxis = d3.svg.axis().scale(x);
  // if (x.domain().length > 3) {

  //     xAxis.tickValues(x.domain().filter(function (d, i) { return !(i % 3); }))
  //         .orient("bottom")
  //         //         .ticks(d3.time.days,1)
  //         .ticks(5);
  // } else if (x.domain().length > 2) {
  //     xAxis.tickValues(x.domain().filter(function (d, i) { return !(i % 2); }))
  //         .orient("bottom")
  //         .ticks(5);
  // } else {     
  xAxis.orient("bottom").ticks(5);
  //Below Changes Related to https://blackswantechnologies.atlassian.net/browse/RD-23285
  if (x.domain().length > 15) {
    xAxis.orient("bottom").tickValues(0);
  }

  // }

  var yAxis = d3.svg.axis().scale(y).orient("left").ticks(10,'f');

  //Easy colors accessible via a 10-step ordinal scale
  // var colors = d3.scale.category10();

  //Create SVG element
  var svg = d3
    .select(options.container)
    .append("svg")
    .attr("width", options.width)
    .attr("transform", "translate(" + 15 + "," + 10 + ")");

  /*
   * Purpose : genColors will hold all the color codes used by the series. It will be used to map the colors for the legends.
   * Author : Ashen
   * Date : 11-Sep-2020
   */
  let genColors = [];

  // Add a group for each row of data
  var groups = svg
    .selectAll("g")
    .data(dataset)
    .enter()
    .append("g")
    // .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
    .attr("class", "rgroups")
    //    .attr("transform","translate("+ padding.left + "," + (h-padding.bottom-padding.top ) +")")
    .style("fill", function (d, i) {
      if (options.colors) {
        let obj = {};
        obj[d[0].type] = colorScale(d.type);
        genColors.push(obj);
        return colorScale(d.type);
      }
      if (options.arrayTypeColorSet && options.arrayTypeColorSet.length > 0) {
        // Finding the series colors used mapped with category
        return fetchCategoryColor(options.arrayTypeColorSet, d[0].type);
      }
      if (colors.length) {
        if (colors[i]) {
          let obj = {};
          obj[d[0].type] = colors[i];
          genColors.push(obj);
          return colors[i];
        } else {
          var random = Math.floor(Math.random() * 9) + 1;
          let obj = {};
          obj[d[0].type] = colors[random];
          genColors.push(obj);
          return colors[random];
        }
      }
      let obj = {};
      obj[d[0].type] = options.color_hash[dataset.indexOf(d)][1];
      genColors.push(obj);
      return options.color_hash[dataset.indexOf(d)][1];
    });

  // Add a rect for each data value
  var rects = groups
    .selectAll("rect")
    .data(function (d) {
      return d;
    })
    .enter()
    .append("rect")
    .attr("transform", "translate(" + padding.left + "," + 0 + ")")
    .attr("x", function (d) {
      return x(d.time);
    })
    .attr("y", function (d) {
      return y(d.y0 + d.y);
    })
    .attr("height", function (d) {
      return y(d.y0) - y(d.y0 + d.y);
    })
    .attr("width", x.rangeBand())
    .style("fill", function (d, i) {
      if (options.colorObj) {
        return options.colorObj[d.time];
      }
    })
    //	 .attr("rx", (15 / 4))
    //	 .attr("ry", (15 / 4))
    .style("fill-opacity", 1);

  rects
    .on("click", function (d) {
      window.openSideModal(d);
    })
    .on("mouseover", function (d) {
      stackedtimelinediv.style("visibility", "visible");
      stackedtimelinediv.style("display", "inline-block");
      if (d.txt) {
        stackedtimelinediv.html(d.txt);
      } else if (d.time) {
        stackedtimelinediv.html(
          '<div class="text-uppercase"><div>' +
            d.time +
            "</div><div>" + d.type + ":"+
            d3.format(",")(d.y)
            +"</div></div>"
        );
      } else {
        stackedtimelinediv.html(
          '<div class="text-uppercase"><div>year: ' +
            d.time +
            "</div><div>Amount:" +
            d3.format(",")(d.y)    +
            "</div><div>type:" +
            d.type +
            "</div></div>"
        );
      }
    })
    .on("mousemove", function (d) {
      if (
        $(".tooltip_stackedTime").width() + d3.event.pageX + 10 <
        $(window).width()
      ) {
        $(".tooltip_stackedTime").css("left", d3.event.pageX + 10 + "px");
      } else {
        $(".tooltip_stackedTime").css(
          "left",
          d3.event.pageX - 25 - $(".tooltip_stackedTime").width() + "px"
        );
      }
      return stackedtimelinediv.style("top", d3.event.pageY - 25 + "px");
    })
    .on("mouseout", function (d) {
      stackedtimelinediv.style("visibility", "hidden");
      stackedtimelinediv.style("display", "none");
    });

  if (options.showlabel) {
    groups
      .selectAll()
      .data(function (d) {
        return d;
      })
      .enter()
      .append("text")
      .text(function (d) {
        if (y(d.y0) - y(d.y0 + d.y) > 15) return d3.format(",")(d.y);
      })
      .attr("transform", "translate(" + (padding.left - 10) + "," + 0 + ")")
      .attr("x", function (d) {
        if (x(d.time) + x.rangeBand() / 2 < 50)
          return x(d.time) + x.rangeBand() / 2 - 8;
        else return x(d.time) + x.rangeBand() / 2 - 6;
      })
      .attr("y", function (d) {
        if (y(d.y0 + d.y) == 0) return y(d.y0 + d.y) + 20;
        else return y(d.y0 + d.y) + 15;
      })
      .style("fill", "#000")
      .style("font-weight", "bold");
  }

  if (options.axisX) {
    var x_g = svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(" + padding.left + "," + h + ")")
      .call(xAxis);
    x_g
      .selectAll("path")
      .style("stroke", "#E3E3E3")
      .style("shape-rendering", "crispEdges")
      .style("fill", "none");
    x_g
      .selectAll("line")
      .style("stroke", "#E3E3E3")
      .style("shape-rendering", "crispEdges")
      .style("fill", "none");
    x_g
      .selectAll("text")
      .style("fill", "#E3E3E3")
      .style("font-size", "10px")
      .style("stroke", "none")
      .style("transform", "rotate(-15deg) translateY(19px)")
      .call(wrap, 10);
  }

  //
  //
  if (options.axisY) {
    var y_g = svg
      .append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + padding.left + "," + 10 + ")")
      .call(yAxis);
    y_g
      .selectAll("path")
      .style("stroke", "#E3E3E3")
      .style("shape-rendering", "crispEdges")
      .style("fill", "none");
    y_g
      .selectAll("line")
      .style("stroke", "#E3E3E3")
      .style("shape-rendering", "crispEdges")
      .style("fill", "none");
    y_g
      .selectAll("text")
      .style("fill", "#E3E3E3")
      .style("font-size", "10px")
      .style("stroke", "none");
  }
  // adding legend

  var itemWidth = 100;
  var itemHeight = 25;

  /*
   * Purpose : The legend code approch was changed due to the duplication issue.
   * Author : Ashen
   * Date : 11-Sep-2020
   */

  let lablesSet = {};
  for (let index = 0; index < options.data.length; index++) {
    const element = options.data[index];

    for (let index_sub = 0; index_sub < element.length; index_sub++) {
      const subdata = element[index_sub];
      if (subdata.y > 0) {
        lablesSet[subdata.type] = subdata.y;
      }
    }
  }

  // var LegendData = Object.keys(lablesSet);
  var LegendData = [];
  for (let index = 0; index < options.arrayTypeColorSet.length; index++) {
    const element = options.arrayTypeColorSet[index];
    LegendData.push(element.type);
  }

  var width = 500;

  var margin;
  var line = 0;
  var col = 0;

  var margin = { top: 20, right: 100, bottom: 30, left: 40 };

  var legendHolder = svg
    .append("g")
    .attr("id", "legendwrap_" + options.widgetId)
    // translate the holder to the bottom of the graph
    .attr("transform", "translate(40,320)");

  var legend;
  var legend = legendHolder
    .selectAll(".legend")
    .attr("transform", "translate(40,320)")
    .data(LegendData)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) {
      var y = line * 25;
      var x = col;
      col += d.length * 13 + 15;
      if (col > width) {
        x = 0;
        col = d.length * 13 + 15;
        line++;
        y = line * 25;
      }
      return "translate(" + x + "," + y + ")";
    });

  legend
    .append("circle")
    .attr("cx", 0)
    .attr("r", 7)
    // .attr("width", 18)
    // .attr("height", 18)
    .attr("fill", function (d, i) {
      // Finding the series colors used mapped with category
      return fetchCategoryColor(options.arrayTypeColorSet, d);
    });

  legend
    .append("text")
    .attr("x", 10)
    .attr("y", 0)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    // .style("font-family", "monospace")
    .text(function (d) {
      return d;
    })
    .style("fill", function (d) {
      return "white";
    });

  var legendWidth = d3
    .select("#legendwrap_" + options.widgetId)
    .node()
    .getBoundingClientRect().width;

  var legendHeight = d3
    .select("#legendwrap_" + options.widgetId)
    .node()
    .getBoundingClientRect().height;

  var containerWidth = d3
    .select(options.container)
    .node()
    .getBoundingClientRect().width;

  legendHolder.attr(
    "transform",
    "translate(" + (containerWidth - legendWidth) / 2 + ",350)"
  );

  // Increaseing the ovrall svg height to show the full legend height
  svg.style("height", options.height + 90 + legendHeight);

  // Commented by ASHEN due to Legend duplicate and circle legend caused by it

  //     var legend = groups.append('g')
  //     .attr('transform', 'translate(40,300)')
  //     .selectAll(".legend")
  //     .data(function (d) { return d; })
  //     .enter()
  //     .append("g")
  //     .attr("transform", function (d, i) { return "translate(" + i % 5 * itemWidth + "," + Math.floor(i / 5) * itemHeight + ")"; })
  //     .attr("class", "legend")

  // var rects = legend.append('rect')
  //     .attr("width", 10)
  //     .attr("height", 10)
  //     .attr("fill", function (d, i) {

  //         if (options.colors) {
  //             return colorScale(d.time);
  //         }
  //         if (colors.length) {
  //             if (colors[i]) {
  //                 return colors[i];
  //             } else {
  //                 var random = Math.floor(Math.random() * 9) + 1;
  //                 return (colors[random]);
  //             }
  //         }
  //         return options.color_hash[dataset.indexOf(d)][1];
  //     });

  // var text = legend.append('text')
  //     .attr("x", 15)
  //     .attr("y", -5)
  //     .text(function (d) {
  //         if (d.y > 0) {
  //             return d.time;
  //         }
  //     })
  //     .call(wrap, 10)

  /* var legend = groups.append("g")
		.attr("transform", "translate(0," + (30) + ")")
		.selectAll(".legend")
        .data(function (d) { return d; })


    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });  */

  /*     var legend = groups.append("g")
             .selectAll(".legend")
            .data(function(d){return d;})
            .enter()
            .append("g")
            .attr("transform", function(d,i) { return "translate(" + i%n * 20 + "," + Math.floor(i/n) * 20 + ")"; })
            .attr("class","legend"); */

  /* legend.append("rect")
        .attr("x", w - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function (d, i) {
                        if (options.colors) {
                            return colorScale(d.time);
                        }
                        if(colors.length){
                            if(colors[i]){
                                return colors[i];
                            }else{
                                var random  = Math.floor(Math.random()*9) + 1;
                               return (colors[random]);
                            }
                        }
                        return options.color_hash[dataset.indexOf(d)][1];
                    });
    legend.append("text")
        .attr("x", w - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        if(d.y>0){
            return d.time;
        }
            })
     */
  /* var rects = legend.append('rect')
        .attr("width",15)
        .attr("height",15)
        .attr("fill", function(d,i) { return color(i); });

    var text = legend.append('text')
        .attr("x", 15)
        .attr("y",12)
        .text(function(d) { return d; }); */
  //    var legend = svg.append("g")
  //        .attr("class","legend")
  //        .attr("x", w - padding.right - 65)
  //        .attr("y", 25)
  //        .attr("height", 100)
  //        .attr("width",100);

  //    legend.selectAll("g").data(dataset)
  //       .enter()
  //       .append('g')
  //       .each(function(d,i){
  //        var g = d3.select(this);
  //        g.append("rect")
  //         .attr("x", w - padding.right - 65)
  //         .attr("y", i*25 + 10)
  //         .attr("width", 10)
  //         .attr("height",10)
  //         .style("fill", function (d, i) {
  //             if (options.colors) {
  //                 return colorScale(d.time);
  //             }
  //             if(colors.length){
  //                 if(colors[i]){
  //                     return colors[i];
  //                 }else{
  //                     var random  = Math.floor(Math.random()*9) + 1;
  //                    return (colors[random]);
  //                 }
  //             }
  //             return options.color_hash[dataset.indexOf(d)][1];
  //         });

  //        g.append("text")
  //         .attr("x", w - padding.right - 50)
  //         .attr("y", i*25 + 20)
  //         .attr("height",30)
  //         .attr("width",100)
  //         .style("fill", function (d, i) {
  //             if (options.colors) {
  //                 return colorScale(d.type);
  //             }
  //             if(colors.length){
  //                 if(colors[i]){
  //                     return colors[i];
  //                 }else{
  //                     var random  = Math.floor(Math.random()*9) + 1;
  //                    return (colors[random]);
  //                 }
  //             }
  //             return options.color_hash[dataset.indexOf(d)][1];
  //         })
  //         .text(function (d, i) {
  //         });

  //     });

  svg
    .append("text")
    .attr("class", "ytext")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - 4)
    .attr("x", 0 - h / 2)
    .attr("dy", "1em")
    .style("fill", "#E3E3E3")
    .style("font-size", "14px")
    .attr("text-anchor", "middle")
    .text(options.showYaxisTitle)
    .style("text-transform", "upperCase");
  //
  svg
    .append("text")
    .attr("class", "xtext")
    .attr("x", w / 2 + padding.left)
    .attr("y", options.height + 35)
    .style("fill", "#E3E3E3")
    .style("font-size", "14px")
    .attr("text-anchor", "middle")
    .text(options.showXaxisTitle)
    .style("text-transform", "upperCase");

  //   svg.append("text")
  //         .attr("class","title")
  //         .attr("x", (w / 2))
  //         .attr("y", 20)
  //         .attr("text-anchor", "middle")
  //         .style("font-size", "16px")
  //         .style("text-decoration", "underline")
  //         .text("Number of messages per day.");

  // Set-up the export button
  // d3.select('#saveButton_'+options.widgetId)
  // .on('click', function(){
  //     // Get the d3js SVG element and save using saveSvgAsPng.js
  //     savePng.saveSvgAsPng(document.getElementsByTagName("svg")[0], "plot.png", {scale: 2, backgroundColor: "#FFFFFF"});
  // })
  // if you want to work with filesaver uncommnet it
  d3.select("#saveButton_" + options.widgetId).on("click", function () {
    var svgString = getSVGString(svg.node());
    svgString2Image(
      svgString,
      2 * options.width,
      2 * options.height,
      "png",
      save
    ); // passes Blob and filesize String to the callback

    function save(dataBlob, filesize) {
      saveAs(dataBlob, options.widgetName + ".png"); // FileSaver.js function
    }
  });
};

stackedbarTimelinechart.prototype.exportChart = function (
  element_id,
  widget_name,
  type
) {
  let element = document.getElementById("chartPanel_" + element_id);
  var rect = element.getBoundingClientRect();
  var contentElement = document.getElementById("chartPanel_" + element_id);
  let elementHeight = contentElement.offsetHeight;
  let elementWidth = contentElement.offsetWidth;
  switch (type) {
    case "PNG":
      html2canvas($("#chartPanel_" + element_id)[0], {
        allowTaint: true,
        backgroundColor: "rgba(0, 0, 0, 0)",
        removeContainer: true,
        width: elementWidth + 20,
        height: elementHeight + 20,
        scrollY: window.pageYOffset * -1,
        scrollX: 0,
        x: rect.left,
        y: rect.top,
      }).then(function (canvas) {
        let dataBlob = canvas.toDataURL("image/png");
        save(dataBlob);
      });

      break;

    case "PDF":
      html2canvas($("#chartPanel_" + element_id)[0], {
        allowTaint: true,
        backgroundColor: "rgba(0, 0, 0, 0)",
        removeContainer: true,
        width: elementWidth + 20,
        height: elementHeight + 20,
        scrollY: window.pageYOffset * -1,
        scrollX: 0,
        x: rect.left,
        y: rect.top,
      }).then(function (canvas) {
        let dataBlob = canvas.toDataURL("image/png");
        // var doc = new jsPDF("p", "mm");
        var doc = new jsPDF("p", "mm", "a4");

        var widthPDF = doc.internal.pageSize.getWidth();
        var heightPDF = doc.internal.pageSize.getHeight();

        var imgHeight = (canvas.height * widthPDF) / canvas.width;

        doc.addImage(dataBlob, "PNG", 10, 10, widthPDF - 10, imgHeight - 10);
        doc.save(widget_name + ".pdf");
      });

      break;
    default:
      break;
  }

  function save(dataBlob, filesize) {
    saveAs(dataBlob, widget_name + ".png"); // FileSaver.js function
  }
};
var StackedBarModule = new stackedbarTimelinechart();

export { StackedBarModule };
function wrap(text, width) {
  text.each(function () {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1, // ems
      x = text.attr("x"),
      y = text.attr("y"),
      dy = 0, //parseFloat(text.attr("dy")),
      tspan = text
        .text(null)
        .append("tspan")
        .attr("x", x)
        .attr("y", y)
        .attr("dy", dy + "em");
    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text
          .append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word);
      }
    }
  });
}
// Below are the functions that handle actual exporting:
// getSVGString ( svgNode ) and svgString2Image( svgString, width, height, format, callback )
function getSVGString(svgNode) {
  svgNode.setAttribute("xlink", "http://www.w3.org/1999/xlink");
  var cssStyleText = getCSSStyles(svgNode);
  appendCSS(cssStyleText, svgNode);

  var serializer = new XMLSerializer();
  var svgString = serializer.serializeToString(svgNode);
  svgString = svgString.replace(/(\w+)?:?xlink=/g, "xmlns:xlink="); // Fix root xlink without namespace
  svgString = svgString.replace(/NS\d+:href/g, "xlink:href"); // Safari NS namespace fix

  return svgString;

  function getCSSStyles(parentElement) {
    var selectorTextArr = [];

    // Add Parent element Id and Classes to the list
    selectorTextArr.push("#" + parentElement.id);
    for (var c = 0; c < parentElement.classList.length; c++)
      if (!contains("." + parentElement.classList[c], selectorTextArr))
        selectorTextArr.push("." + parentElement.classList[c]);

    // Add Children element Ids and Classes to the list
    var nodes = parentElement.getElementsByTagName("*");
    for (var i = 0; i < nodes.length; i++) {
      var id = nodes[i].id;
      if (!contains("#" + id, selectorTextArr)) selectorTextArr.push("#" + id);

      var classes = nodes[i].classList;
      for (var c = 0; c < classes.length; c++)
        if (!contains("." + classes[c], selectorTextArr))
          selectorTextArr.push("." + classes[c]);
    }

    // Extract CSS Rules
    var extractedCSSText = "";
    for (var i = 0; i < document.styleSheets.length; i++) {
      var s = document.styleSheets[i];

      try {
        if (!s.cssRules) continue;
      } catch (e) {
        if (e.name !== "SecurityError") throw e; // for Firefox
        continue;
      }

      var cssRules = s.cssRules;
      for (var r = 0; r < cssRules.length; r++) {
        includes(cssRules[r].selectorText, selectorTextArr);
        // if ( contains( cssRules[r].selectorText, selectorTextArr ) )
        // 	extractedCSSText += cssRules[r].cssText;
      }
    }

    return extractedCSSText;

    function contains(str, arr) {
      return arr.indexOf(str) === -1 ? false : true;
    }
  }

  function appendCSS(cssText, element) {
    var styleElement = document.createElement("style");
    styleElement.setAttribute("type", "text/css");
    styleElement.innerHTML = cssText;
    var refNode = element.hasChildNodes() ? element.children[0] : null;
    element.insertBefore(styleElement, refNode);
  }
}

function svgString2Image(svgString, width, height, format, callback) {
  var format = format ? format : "png";

  var imgsrc =
    "data:image/svg+xml;base64," +
    btoa(unescape(encodeURIComponent(svgString))); // Convert SVG string to data URL

  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;

  var image = new Image();
  image.onload = function () {
    context.clearRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    canvas.toBlob(function (blob) {
      var filesize = Math.round(blob.length / 1024) + " KB";
      if (callback) callback(blob, filesize);
    });
  };

  image.src = imgsrc;
}
function includes(str, arr) {
  if ("undefined" !== typeof str) {
    for (var q = 0; q < arr.length; q++) {
      if (str.indexOf(arr[q]) !== -1) {
        return true;
      }
    }
  }
}

function fetchCategoryColor(themeColors, categoryType) {
  let colCode = "red"; //Default missing color
  for (let index = 0; index < themeColors.length; index++) {
    const element = themeColors[index];
    if (element.type == categoryType) {
      colCode = element.color;
    }
  }

  return colCode;
}
