function sunBurstIcicleChart(options){
  if(options)
  {
     options.container=options.container?options.container:"body"
     options.width=options.width?options.width:$(options.container).width()-10
     options.height=options.height?options.height:300
     options.marginTop=options.marginTop?options.marginTop:10
     options.marginBottom=options.marginBottom?options.marginBottom:30
     options.marginRight=options.marginRight?options.marginRight:10
     options.marginLeft=options.marginLeft?options.marginLeft:50
  }  
  
  var margin = {top: 20, right: 20, bottom: 30, left: 40};
  var width = (options.width?options.width:$(options.container).width() )- margin.left - margin.right;
  var height = (options.height?options.height:500) - margin.top - margin.bottom;
var x = d3_v3.scale.linear()
  .range([0, width]);

var y = d3_v3.scale.linear()
  .range([0, height]);

var color = d3_v3.scale.category20c();

var partition = d3_v3.layout.partition()
  .children(function(d) { return isNaN(d.value) ? d3_v3.entries(d.value) : null; })
  .value(function(d) { return d.value; });

var svg = d3_v3.select(options.container).append("svg")
  .attr("width", width)
  .attr("height", height);

var rect = svg.selectAll("rect");
var dataNew = options.data;
var finaldata = {};
finaldata[dataNew.data.edges[0]['from']]={}
dataNew.data.edges.map(function(d){
var index = dataNew.data.vertices.map(function(d){return d.id}).indexOf(d.to)
finaldata[dataNew.data.edges[0]['from']][d.to]= dataNew.data.vertices[index]["avgExp"]})

rect = rect
    .data(partition(d3_v3.entries(finaldata)[0]))
  .enter().append("rect")
    .attr("x", function(d) { 
     return x(d.x); })
    .attr("y", function(d) { return y(d.y); })
     .attr("id", function(d,k) { return options.containerName+'_'+'rect'+'_'+k; })
    .attr("width", function(d) { return x(d.dx)-1; })
    .attr("height", function(d) { return y(d.dy)-1; })
    .attr("fill", function(d) {  
    	if(options.fixedColorWithKey!=undefined){
    		var index =  options.fixedColorWithKey.map(function(d1){
    			return d1.name
    		}).indexOf(d.key)
    		return options.fixedColorWithKey[index]['color']
    	}else{
    		return color((d.children ? d : d.parent).key); 
    	}
    	
    })
    .on("click", clicked)
     .on("mouseover", function (d) {
    	 $('.Bubble_Chart_tooltip').remove();
    	  var tool_tip = $('body').append('<div class="Bubble_Chart_tooltip" style="position: absolute;z-index: 99999;opacity: 1; pointer-events: none; display:none;text-transform:uppercase;background-color:#0cae96;  padding: 10px;border-radius: 5px; border: 1px solid gray;font-size: 10px;color:black;"><span style=" font-size: 12px; position: absolute; white-space: nowrap;  margin-left: 0px; margin-top: 0px; left: 8px; top: 8px;"><span style="font-size:10px" class="tool_tip_x_val"></span><table><tbody><tr><td style="padding:0"> </td><td style="padding:0"><b>216.4 mm</b></td></tr><tr><td style="color:#434348;padding:0">New York: </td><td style="padding:0"><b>91.2 mm</b></td></tr><tr><td style="color:#90ed7d;padding:0">London: </td><td style="padding:0"><b>52.4 mm</b></td></tr><tr><td style="color:#f7a35c;padding:0">Berlin: </td><td style="padding:0"><b>47.6 mm</b></td></tr></tbody></table></span></div>');
                    $(this).css("opacity", 0.8);
                    	$(".Bubble_Chart_tooltip").html('<span>' +d.key+ '</span> ' + ' : '+ Number(d.value).formatAmt());
                    $(".Bubble_Chart_tooltip").css("visibility", "visible");
                    return $(".Bubble_Chart_tooltip").css("display", "block");
                })
                .on("mousemove", function () {
                	var p=$(options.container)
                	var position=p.offset();
                	var windowWidth=window.innerWidth;
                	var tooltipWidth=$(".Bubble_Chart_tooltip").width()+50
                	var cursor=d3_v3.event.x;
                 	if((position.left<d3_v3.event.pageX)&&(cursor>tooltipWidth)){
                		var element = document.getElementsByClassName("Bubble_Chart_tooltip");
                		element[0].classList.remove("tooltip-left");
            			element[0].classList.add("tooltip-right");
	               		$(".Bubble_Chart_tooltip").css("left",(d3_v3.event.pageX - 15-$(".Bubble_Chart_tooltip").width()) + "px");
	             	}else{
                		var element =document.getElementsByClassName("Bubble_Chart_tooltip");
                   		element[0].classList.remove("tooltip-right");
               		    element[0].classList.add("tooltip-left");
               		    $(".Bubble_Chart_tooltip").css("left", (d3_v3.event.pageX + 10) + "px");
	           
                	}
                    return $(".Bubble_Chart_tooltip").css("top",d3_v3.event.pageY + "px")
   	
                	
                })
                .on("mouseout", function () {
                    $(this).css("opacity", 1);
                    //hide tool-tip
                    $(".Bubble_Chart_tooltip").css("visibility", "hidden");
                    return $(".Bubble_Chart_tooltip").css("display", "none");
                });


function clicked(d) {
x.domain([d.x, d.x + d.dx]);
y.domain([d.y, 1]).range([d.y ? 20 : 0, height]);

rect.transition()
    .duration(750)
    .attr("x", function(d) { return x(d.x); })
    .attr("y", function(d) { return y(d.y); })
    .attr("width", function(d) { return x(d.x + d.dx) - x(d.x)-1; })
    .attr("height", function(d) { return y(d.y + d.dy) - y(d.y)-1; });
}

//code for number formatting
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

 
}