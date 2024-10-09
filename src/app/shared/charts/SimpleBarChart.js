 var stackedtimelinediv = d3.select("body").append("div").attr("class", "toolTip_simplebarChart tooltip_stackedTime").style("position", "absolute").style("z-index", 999999).style("background","rgb(27, 39, 53)").style("padding","5px 10px").style("border-radius","10px").style("font-size","10px").style("display","none");
function simpleVerticalBarChart(options){
$(options.container).empty();
if(location.hash =="#!/alertDashboard" && (!options.data ||  options.data.length==0 )){
	d3.select(options.container).append("div").attr("class","alertsDashErrorDiv").html("<span>Data Not Found</span>");
	return false;
}
  if(options)
  {
     options.container=options.container?options.container:"body"
     options.width=options.width?options.width:$(options.container).width()-10
     options.height=options.height?options.height:300
     options.marginTop=options.marginTop?options.marginTop:10
     options.marginBottom=options.marginBottom?options.marginBottom:0
     options.marginRight=options.marginRight?options.marginRight:10
     options.marginLeft=options.marginLeft?options.marginLeft:50
     options.xParam=options.xParam?options.xParam:$('#errormsg').html('Please check ... May be Data,x-Parameter or y-Parameter is missing.. ');
     options.yParam=options.yParam?options.yParam:$('#errormsg').html('Please check ... May be Data,x-Parameter or y-Parameter is missing.. ');
     options.gridx=options.gridx?options.gridx:false
     options.gridy=options.gridy?options.gridy:false
     options.axisX=options.axisX?options.axisX:false
     options.axisY=options.axisY?options.axisY:false
     options.showxYaxis = options.showxYaxis?options.showxYaxis:false
     options.color_hash = options.color_hash?options.color_hash:{
         0 : ["Invite","#3132FE"],
         1 : ["Accept","#E81F0F"],
         2 : ["Decline","#B2CCE7"]

       };
       options.colors=options.colors?options.colors:"#3132FE";
       options.xtext = options.xtext ? options.xtext : "";
  }  
  var tool_tip = $('body').append('<div class="avg_Exp_Per_Customer" style="position: absolute;z-index: 99999;opacity: 1; pointer-events: none; display:none;text-transform:uppercase;background-color:#1d242c;overflow: visible; padding: 10px;border-radius: 10px; border: 1px solid #1d242c;font-size: 10px;color:#7d94a5;"><span style=" font-size: 12px; position: absolute; white-space: nowrap;  margin-left: 0px; margin-top: 0px; left: 8px; top: 8px;"><span style="font-size:10px" class="tool_tip_x_val"></span><table><tbody><tr><td style="padding:0"> </td><td style="padding:0"><b>216.4 mm</b></td></tr><tr><td style="color:#434348;padding:0">New York: </td><td style="padding:0"><b>91.2 mm</b></td></tr><tr><td style="color:#90ed7d;padding:0">London: </td><td style="padding:0"><b>52.4 mm</b></td></tr><tr><td style="color:#f7a35c;padding:0">Berlin: </td><td style="padding:0"><b>47.6 mm</b></td></tr></tbody></table></span></div>');
  var margin = {top: options.marginTop, right:options.marginRight , bottom:options.marginBottom , left:options.marginLeft };
  var   width =  options.width - margin.left - margin.right,
  height = options.height - margin.top - margin.bottom;
  
   var svg = d3.select(options.container).append("svg").attr("width", options.width + margin.left + margin.right)
             .attr("height", height + margin.top + margin.bottom+20)
           
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  
var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
  y = d3.scaleLinear().rangeRound([height, 0]);

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

function formatTotalAmount(amount) {
    if (amount != undefined) {
        var amountVal = amount.toString().split('.');
        var finalAmount;
        if (amountVal[0].length <= 6) {
            finalAmount = formatNummerWithComma(amount)
        }else if (amountVal[0].length <= 8 && amountVal[0].length > 6) {
            finalAmount = (amount / 1000000).toFixed(2) + 'M';
        } else if (amountVal[0].length >= 9) {
            finalAmount = (amount / 1000000000).toFixed(2) + 'B';
        }
        return finalAmount;
    }
}

function formatNummerWithComma(amount) {
    var formatAmount;
    formatAmount = Number(Math.round(parseFloat(amount))).formatAmt()
    return formatAmount.split('.')[0];
}

var data = options.data
	var dd=[{
              "letter": "Apples",
              "frequency": 20
      },
          {
              "letter": "Bananas",
              "frequency": 12
      },
          {
              "letter": "Grapes",
              "frequency": 19
      
      }];


x.domain(data.map(function(d) { return d.letter; }));

var maxValue = d3.max(data, function(d) { return d.frequency; })
var lineGraphValue, lineGraphValueFormatted, lineGraphLabel;
if(options.container == "#connection_avg_bar"){
	lineGraphValue = options.avgExpCluster;
	lineGraphValueFormatted = options.avgExpClusterFormattted;
	lineGraphLabel = "Average expenditure in the cluster";
}else{
	lineGraphValue = options.totExpCluster;
	lineGraphValueFormatted = options.totExpClusterFormattted;
	lineGraphLabel = "Total expenditure in the cluster";
}

if(parseInt(lineGraphValue)>maxValue){
	y.domain([0,parseInt(lineGraphValue)]);
}else{
	y.domain([0,maxValue]);
}
if(options.container == "#connection_avg_bar" || options.container == "#connection_total_bar"){
	var x_g = g.append("g")
	    .attr("class", "axis axis--x stack")
	     .style('color','lightgrey')
	    .attr("transform", "translate(0," + height + ")")
	.call(d3.axisBottom(x));
	 x_g.selectAll("path").style("stroke", "rgb(46, 66, 75)")
     .style("shape-rendering", "crispEdges")
     .style("fill", "none");
     x_g.selectAll("line").style("stroke", "rgb(46, 66, 75)")
     .style("shape-rendering", "crispEdges")
     .style("fill", "none");
     x_g.selectAll("text").style("fill", "#6c7e88")
     .style("font-size", "10px")
     .style("stroke", "none")
     .call(wrap, x.bandwidth(), 1.1)
	
	g.append("g")
    .attr("class", "axis axis--y stack")
    .style('stroke','lightgrey')
    .call(d3.axisLeft(y).ticks(5))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end");
//    .text("Frequency");
	
	//add the Y gridlines
	d3.selectAll("g.axis.axis--y.stack")
	.data(data)
	//svg.append('g')
	    .attr("class", "grid")
	    .attr("transform", "translate(0,0)")
	    /*.call(make_y_gridlines()
	        .tickSize(-width)
	        .tickFormat("")
	    )*/
	    .call(d3.axisLeft(y)
	             .ticks(5)
	             .tickFormat(function(d){
	            	return formatTotalAmount(d);
	             })
	            .tickSize(-width)).style("fill", "#797979")
	           
}else{
	g.append("g")
    .attr("class", "axis axis--x stack")
     .style('color','lightgrey')
    .attr("transform", "translate(0," + height + ")");
    
    g.append("g")
    .attr("class", "axis axis--y stack")
    .call(d3.axisLeft(y).ticks(10))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end");
  //  .text("Frequency");
}

var bar=g.selectAll(".bar")
  .data(data)
  .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { 
    	return x(d.letter)+(x.bandwidth()/5); 
    	})
    .attr("y", function(d) { return y(d.frequency); })
    .style("fill", function(d, i) { 
    	if(options.container == "#connection_avg_bar" || options.container == "#connection_total_bar"){
    		if(i == 0){
    			return "url(#gradient1)"
    		}else{
    			return "url(#gradient2)"
    		}
    	}else{
    		return options.colors;
    	}
    })
    .attr("width", x.bandwidth()/1.5)
    .attr("height", function(d) { return height - y(d.frequency); })
    .on("click", function (d){
    	if(options.container == '#sideRiskBarChartOne' && location.hash =="#!/alertDashboard"){
    		  window.riskAlertModal(d,options.colors)
    	}else if(options.container!='#custCounterPartyChart' && options.container!='#associatedAlertsByNumber' && location.hash =="#!/alertDashboard"){
    		var data={
        			'data':[]
        	}
        	data.data.className=d.letter
         	window.openSideModal(data,options.container,options.colors);
    	}
      	
    })
    .on("mouseover", function (d) {
    	if(options.type =="byamount"){
    		$(".avg_Exp_Per_Customer").html('<span>' + d.letter + " : $" + Number(d.frequency).formatAmt()+'</span>');
    	}else if(options.container == '#sideRiskBarChartOne' && location.hash =="#!/alertDashboard"){
    		$(".avg_Exp_Per_Customer").html('<span>' + d.letter + " : " + Number(d.frequency).formatAmt() +'</span>');
    	}else{
    		$(".avg_Exp_Per_Customer").html('<span>' + d.letter + " : ₪ " + formatTotalAmount(d.frequency) +'</span>');
    	}
    	  return $(".avg_Exp_Per_Customer").css("display", "block");
	  	})
	 .on("contextmenu",function(d){
    	if(location.hash =="#!/alertDashboard"){
            window.transSelectedFilter.data = d
      		 window.transSelectedFilter.id = options.container;
      		 window.transSelectedFilter.chartType ="simpleBar";
//      		 aplyAlertDasboardFilters(d,pieOptions.container,"pie");
      	 }
    })
	.on("mousemove", function (d) {	
		var p=$(options.container)
    	var position=p.offset();
    	var windowWidth=window.innerWidth;
    	var tooltipWidth=$(".Bubble_Chart_tooltip").width()+50
    	var cursor=d3.event.x;
     	if((position.left<d3.event.pageX)&&(cursor>tooltipWidth)){
    		var element = document.getElementsByClassName("avg_Exp_Per_Customer");
    		for(i=0;i<element.length;i++){
    		element[i].classList.remove("tooltip-left");
			element[i].classList.add("tooltip-right");
    		}
       		$(".avg_Exp_Per_Customer").css("left",(d3.event.pageX - 25-$(".avg_Exp_Per_Customer").width()) + "px");
     	}else{
    		var element =document.getElementsByClassName("avg_Exp_Per_Customer");
    		for(i=0;i<element.length;i++){
       		element[i].classList.remove("tooltip-right");
   		    element[i].classList.add("tooltip-left");
    		}
   		    $(".avg_Exp_Per_Customer").css("left", (d3.event.pageX + 25) + "px");
   
    	}
        return $(".avg_Exp_Per_Customer").css("top",d3.event.pageY + "px")
	})
	.on("mouseout", function (d) {
		//  $(".avg_Exp_Per_Customer").css("visibility", "hidden");
          return $(".avg_Exp_Per_Customer").css("display", "none");
	})
	
if(options.container == "#connection_avg_bar" || options.container == "#connection_total_bar"){
	lineGraphValue = (parseInt(lineGraphValue));
	
	 g.selectAll(".barstext")
	 .data(data)
	 .enter().append("text")
	    	.attr("class","barstext")
	    	.attr("x", function(d) { return x(d.letter) + (x.bandwidth()/2); })
	    	.attr("y",function(d) { return height-height/10 })
	    	.attr('fill','lightgrey')
	    	.style("text-anchor", "middle")
	    	.text(function(d){return  '₪' + formatTotalAmount(d.frequency);})
	    svg.append("g")
	      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	       .append("line")
	       .attr("x2", width)
	       .attr("y1", y(lineGraphValue))
	        .attr("y2", y(lineGraphValue))
	       .style("stroke", "lightgrey")
	       .style("stroke-width", "1px")
	       .attr("stroke-dasharray", 10 )
	       svg.append("text")
	       .attr('class', 'linetext')
	       	.attr("transform", "translate(" + (width+60) + "," + (y(lineGraphValue)+20) + ")")
				.attr("dy", ".35em")
				.attr("text-anchor", "start")
				.style("fill", "#797979")
	      /* .attr("x", width+5)
	    	.attr("y",(height-margin.top) -y(lineGraphValue))*/
	//       .attr("transform", "translate(0, "+height/2+")")
	       .attr('fill','lightgrey')
	    	.style("text-anchor", "middle")
	    	.style("fill", "#797979");
//	    	.text(formatTotalAmount(lineGraphValue));
//	    	.call(wrap, 50, 0.2);
	 
	 var gradient1 = svg
	 	.data(data)
		.append("linearGradient")
		.attr("y1", 80)
		.attr("y2", 300)
		.attr("x1", "0")
		.attr("x2", "0")
		.attr("id", "gradient1")
		.attr("gradientUnits", "userSpaceOnUse")
		
		gradient1
			.append("stop")
			.attr("offset", "0")
			.attr("stop-color", "#64b5f6")
		gradient1
			.append("stop")
			.attr("offset", "0.5")
			.attr("stop-color", "#2962ff");
		
	var gradient2 = svg
	 	.data(data)
		.append("linearGradient")
		.attr("y1", 80)
		.attr("y2", 300)
		.attr("x1", "0")
		.attr("x2", "0")
		.attr("id", "gradient2")
		.attr("gradientUnits", "userSpaceOnUse")
		
		gradient2
			.append("stop")
			.attr("offset", "0")
			.attr("stop-color", "#5ad8e7")
		gradient2
			.append("stop")
			.attr("offset", "0.5")
			.attr("stop-color", "#0097a7");
}

var r;
r = ('<span id = "texthelp_pc" style="color:lightgrey;display:block;padding:1px;width:100%;z-index:1000; position: relative;"><span class="fa fa-ils f-8"></span> ' + lineGraphValueFormatted + '<br>' + lineGraphLabel +'</span>')
var fo = svg.append('foreignObject').attr('class', 'helptext_pc').attr("width", "18%").attr('x', width+65).attr('y', y(lineGraphValue))
.attr("height", "25px")
.append("xhtml:div").attr("xmlns", "http://www.w3.org/2000/html")
.attr("id", "helptext_pc")
.html(r);

// gridlines in y axis function
function make_y_gridlines() {	
    return d3.axisLeft(y)
        .ticks(5)
}
function wrap(text, width, lineHeigthVal) {
	  text.each(function() {
	    var text = d3.select(this),
	        words = text.text().split(/\s+/).reverse(),
	        word,
	        line = [],
	        lineNumber = 0,
	        lineHeight = lineHeigthVal, // ems
	        y = text.attr("y"),
	        dy = parseFloat(text.attr("dy")),
	        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
	    while (word = words.pop()) {
	      line.push(word);
	      tspan.text(line.join(" "));
	      if (tspan.node().getComputedTextLength() > width) {
	        line.pop();
	        tspan.text(line.join(" "));
	        line = [word];
	        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
	      }
	    }
	  });
	}
       
$('.stack').find('.domain').css('display','none')
 

}