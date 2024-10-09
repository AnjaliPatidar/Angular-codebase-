 /**
 * Function to load brush
 */
function loadBrush(data, options, finalData, bombMap, mapid){
	  //load time line brush 
    var container_id = "#" + options.timelineid;
    var xdomain = d3.extent(data, function (d) {
        return new Date(d.time);
    });
    var ydomain = d3.extent(data, function (d) {
        return new Date(d.weight);
    });
    var height = 50;
    var Svgwidth = $(container_id).width();//400-> width of side menu and spaces
    $(container_id).empty();

    var margin = {top: 20, bottom: 20, left: 20, right: 20}
    var width = Svgwidth - margin.left - margin.right;
    var svg = d3.select(container_id).append("svg").attr("width", Svgwidth).attr("height", height + margin.top + margin.bottom);
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    g.append("defs").append("svg:clipPath")
            .attr("id", "brushClip")
            .append("svg:rect")
            .attr("id", "clip_rect_brush")
            .attr("x", "0")
            .attr("y", "10")
            .attr("width", width)
            .attr("height", height);

    var x = d3.scaleTime()
            .domain(xdomain)
            .rangeRound([0, width]);

    var y = d3.scaleLinear().domain(ydomain).range([height, 0]);
    var _this = this;
    var brush = d3.brushX()
            .extent([[0, 0], [width, height]])
            .on("end", function () {
                var s = d3.event.selection;
                if (s != null && finalData) {
                	updateNetworkChart(s,x,finalData,options);
                }else if(s != null){
                	updateMapChart(s,x,data,options,bombMap,mapid);
                }
            });

    g.append("g")
            .attr("class", "axis axis--x-brush")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)).style("stroke", "#838F99");


    var gBrush = g.append("g")
            .attr("class", "brush")
            .call(brush).call(brush.move, x.range());
    gBrush.selectAll('.selection').style("fill","#47667F").style("stroke","none");
    gBrush.selectAll('.handle').attr("width",3).style("fill","#578BBA").style("stroke","none");
    gBrush.selectAll('.overlay').style("fill","transparent").style("stroke","#374B56");
    
    svg.select(".axis--x-brush").selectAll('text').attr("fill","none").attr("stroke","#3B4E5B");
    svg.select(".axis--x-brush").selectAll('line').attr("fill","none").attr("stroke","#3B4E5B");
    svg.select(".axis--x-brush").selectAll('path').attr("fill","none").attr("stroke","none");
//			    gBrush.call(brush.move, [0, 1].map(x));
    var rects = g.append("g").attr("clip-path", "url(#brushClip)")
            .attr("class", "rect")
            .selectAll("rect")
            .data(data)
            .enter().append("rect")
            .style("fill", function (d) {
                return "#3D5F78";
            })
            .attr("x", function (d) {
         	   if(d.time){
         		   return x(new Date(d.time))-2.5;
         	   }
            })
            .attr("y", function (d) {
                return height - y(d.weight);
            })

            .attr("width", 5)
            .attr("height", function (d) {
         	   if(d.time){
         		   return y(d.weight);
         	   }
            });
}