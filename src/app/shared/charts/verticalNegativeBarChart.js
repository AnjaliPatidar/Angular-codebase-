var stackedtimelinediv = d3.select("body").append("div").attr("class", "toolTip_piehorizontal tooltip_stackedTime").style("position", "absolute").style("z-index", 1000).style("background","rgb(27, 39, 53)").style("padding","5px 10px").style("border-radius","10px").style("font-size","10px").style("display","none");
var tool_tip = $('body').append('<div class="Bubble_Chart_tooltip" style="position: absolute;z-index: 99999;opacity: 1; pointer-events: none; visibility: visible;display:none;text-transform:uppercase;background-color:#0cae96;  padding: 10px;border-radius: 5px; border: 1px solid gray;font-size: 10px;color:black;"><span style=" font-size: 12px; position: absolute; white-space: nowrap;  margin-left: 0px; margin-top: 0px; left: 8px; top: 8px;"><span style="font-size:10px" class="tool_tip_x_val"></span><table><tbody><tr><td style="padding:0"> </td><td style="padding:0"><b>216.4 mm</b></td></tr><tr><td style="color:#434348;padding:0">New York: </td><td style="padding:0"><b>91.2 mm</b></td></tr><tr><td style="color:#90ed7d;padding:0">London: </td><td style="padding:0"><b>52.4 mm</b></td></tr><tr><td style="color:#f7a35c;padding:0">Berlin: </td><td style="padding:0"><b>47.6 mm</b></td></tr></tbody></table></span></div>');
function verticalBarChart(options){
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
     options.marginBottom=options.marginBottom?options.marginBottom:30
     options.marginRight=options.marginRight?options.marginRight:20
     options.marginLeft=options.marginLeft?options.marginLeft:50
     options.xParam=options.xParam?options.xParam:$('#errormsg').html('Please check ... May be Data,x-Parameter or y-Parameter is missing.. ');
     options.yParam=options.yParam?options.yParam:$('#errormsg').html('Please check ... May be Data,x-Parameter or y-Parameter is missing.. ');
     options.gridx=options.gridx?options.gridx:false
     options.gridy=options.gridy?options.gridy:false
     options.axisX=options.axisX?options.axisX:false
     options.axisY=options.axisY?options.axisY:false
     options.showxYaxis = options.showxYaxis?options.showxYaxis:false
     options.color=options.color?options.color:["#46a2de", "#5888C8", "#31d99c", "#de5942", "#ffa618"]
     options.barText =options.barText?options.barText:false			   
    		 
  }   
  
  var colorScale = d3.scaleOrdinal().range(options.color);
  var data = options.data
	var series = d3.stack()
	    .keys(["value",'no_value'])
	    .offset(d3.stackOffsetDiverging)
	    (data);

  var tool_tip;
	var svg = d3.select("svg")
	 var margin = { top: options.marginTop, right: options.marginRight, bottom: options.marginBottom, left: options.marginLeft },
     width = options.width 
     height = options.height - margin.top - margin.bottom;
	  var svg = d3.select(options.container)
      .append("svg")
      .attr('height', height)
      .attr('width', width)
   

	var x = d3.scaleBand()
	    .domain(data.map(function(d) { return d.name; }))
	    .rangeRound([margin.left, width - margin.right])
	    .padding(0.1);

	  if(location.hash =="#!/cluster" || location.hash.indexOf('generalCardHolderDetails' ) >= 0){
			/* var min =d3.min(series, stackMin);
			 var max =d3.max(series, stackMax)
			 if(min < 0){
				min= (min * (-1)) 
			 }
			 if(max < 0){
				 max=(max * (-1)) 
			 }
			 if(min > max){
				 max=min;
				 min=-min
			 }else if(min < max){
				 max=max;
				 min=-max 
			 }*/
			 var y = d3.scaleLinear()
			    .domain([options.domainArray[0],options.domainArray[1]])
			    .rangeRound([height - margin.bottom, margin.top]);
		 }else{
			 var y = d3.scaleLinear()
			    .domain([d3.min(series, stackMin),d3.max(series, stackMax)])
			    .rangeRound([height - margin.bottom, margin.top]);
		 }
	 /* var y = d3.scaleLinear()
	    .domain([d3.min(series, stackMin),d3.max(series, stackMax)])
	    .rangeRound([height - margin.bottom, margin.top]);*/
	var z = d3.scaleOrdinal(d3.schemeCategory10);
    var legendData=[];
    // add the Y gridlines
	  svg.append("g")			
	      .attr("class", "grid")
	      .attr("transform", "translate(" + margin.left + ",-10)")
	      .call(make_y_gridlines()
	          .tickSize(-width)
	          .tickFormat("")
	      )
	      
	var bar = svg.append("g")
	  .selectAll("g")
	  .data(series)
	  .enter().append("g")
	  .attr("transform", "translate(0,-10)")
	bar.selectAll("rect")
	  .data(function(d) { return d; })
	  .enter().append("rect")
	    .attr("width", x.bandwidth)
	    .attr("x", function(d) { 
	    	if(!isNaN(d[1])){
	    		return x(d.data.name);
	    	}
	    	})
	    .attr("y", function(d) { 
	    	if(!isNaN(d[1])){
	    		return y(d[1]);
	    	}})
	    .attr("height", function(d) { 
	    	if(!isNaN(d[1])){
	    	return y(d[0]) - y(d[1]);}
	    	})
	    .attr("fill", function(d,i) { 
	    	if(!isNaN(d[1])){
		    	legendData.push({
		    		name:d.data.name,
		    		count:d.data.value,
		    		color:colorScale(d.data.name)
		    	})
	    	}
		    	if(options.fixedColorWithKey!=undefined){
		    		var index =  options.fixedColorWithKey.map(function(d1){
		    			return d1.name
		    		}).indexOf(d.data.name)
		    		return options.fixedColorWithKey[index]['color']
		    	}else{
		    		return colorScale(d.data.name)
		    	}
	    	})
	    	.on("mouseover", function (d) {
	    		 $(".Bubble_Chart_tooltip").remove()
	    		tool_tip = $('body').append('<div class="Bubble_Chart_tooltip" style="position: absolute;z-index: 99999;opacity: 1; pointer-events: none; visibility: visible;display:none;text-transform:uppercase;background-color:#0cae96;  padding: 10px;border-radius: 5px; border: 1px solid gray;font-size: 10px;color:black;"><span style=" font-size: 12px; position: absolute; white-space: nowrap;  margin-left: 0px; margin-top: 0px; left: 8px; top: 8px;"><span style="font-size:10px" class="tool_tip_x_val"></span><table><tbody><tr><td style="padding:0"> </td><td style="padding:0"><b>216.4 mm</b></td></tr><tr><td style="color:#434348;padding:0">New York: </td><td style="padding:0"><b>91.2 mm</b></td></tr><tr><td style="color:#90ed7d;padding:0">London: </td><td style="padding:0"><b>52.4 mm</b></td></tr><tr><td style="color:#f7a35c;padding:0">Berlin: </td><td style="padding:0"><b>47.6 mm</b></td></tr></tbody></table></span></div>');
	    			if(location.hash =="#!/cluster" || location.hash.indexOf('generalCardHolderDetails') >= 0){
	    				$(".Bubble_Chart_tooltip").html('<span>' + '<span style="text-transform:lowercase;">&#963</span> = '+ d.data.value+'</span>');
	    			}else{
	    			 	$(".Bubble_Chart_tooltip").html('<span>' +d.data.name.split('_').join(' ')+ " : " + d.data.value+'</span>');
	    			}
	    		 	$(".Bubble_Chart_tooltip").css("visibility", "visible");
                    return $(".Bubble_Chart_tooltip").css("display", "block");
              }).on("contextmenu",function(d){
              	if(location.hash =="#!/alertDashboard"){
                     window.transSelectedFilter.data = d
              		 window.transSelectedFilter.id = options.container;
              		 window.transSelectedFilter.chartType ="negativeBar";
//              		 aplyAlertDasboardFilters(d,pieOptions.container,"pie");
              	 }
            }).on("mousemove", function () {
                	var p=$(options.container)
                	var position=p.offset();
                	var windowWidth=window.innerWidth;
                	var element = document.getElementsByClassName("Bubble_Chart_tooltip");
                	for (i = 0; i < element.length; i++) {
                        var tooltipWidth = $(".Bubble_Chart_tooltip").width()+50
                	}
              
                	var cursor=d3.event.x;
                 	if((position.left<d3.event.pageX)&&(cursor>tooltipWidth)){
                		var element = document.getElementsByClassName("Bubble_Chart_tooltip");
                		 for (i = 0; i < element.length; i++) {
                		element[i].classList.remove("tooltip-left");
            			element[i].classList.add("tooltip-right");
                		 }
	               		$(".Bubble_Chart_tooltip").css("left",(d3.event.pageX - 15-$(".Bubble_Chart_tooltip").width()) + "px");
	             	}else{
                		var element =document.getElementsByClassName("Bubble_Chart_tooltip");
                		for (i = 0; i < element.length; i++) {
                		element[i].classList.remove("tooltip-right");
               		    element[i].classList.add("tooltip-left");
                		}
               		    $(".Bubble_Chart_tooltip").css("left", (d3.event.pageX + 10) + "px");
	           
                	}
                    return $(".Bubble_Chart_tooltip").css("top",d3.event.pageY + "px")
   	
                })
                .on("mouseout", function () {
                    //hide tool-tip
                    $(".Bubble_Chart_tooltip").css("visibility", "hidden");
                    return $(".Bubble_Chart_tooltip").css("display", "none");
                })
                
                
	
	
if(options.gridColor && options.label){
		bar.selectAll("text") 
		.data(function(d) { return d; })
		  .enter().append("text")
		  .attr("x", (function(d) { return (x(d.data.name) + x.bandwidth()/ 2)-10 ; }  ))
		  .attr("y", function(d) { 
			  if(!isNaN(d[1])){
				  if(d[1]>0){
					  return y(d[1])+5
		    		 }else{
		    			 return (y(d[1])+y(d[0]) - y(d[1]))
		    	     }
				  
		  		}})
		   .attr("dy", ".6em")
		     .text(function(d) { 
		    	 if(!isNaN(d[1])){
		    		 if(y(d[0]) - y(d[1])>0){
		    			 return d.data.value
		    		 }
		    	} })
	    .attr("font-size", "9px")
	    .attr('fill','#efe6e6')
}
    // gridlines in x axis function
	function make_x_gridlines() {		
	    return d3.axisBottom(x)
	        .ticks(5)
	}
	
	// gridlines in y axis function
	function make_y_gridlines() {		
	    return d3.axisLeft(y)
	        .ticks(5)
	}
	
	svg.append("g")
	.attr("class", "xAxis")
	    .attr("transform", "translate(0," + y(0) + ")")
	    .call(d3.axisBottom(x));
	

	svg.append("g")
	 .attr("class", "yAxis")
	    .attr("transform", "translate(" + margin.left + ",-10)")
	    .call(d3.axisLeft(y).ticks(5));
	
	 // add the X gridlines
	/*  svg.append("g")			
	      .attr("class", "grid")
	      .attr("transform", "translate(0," + height + ")")
	      .call(make_x_gridlines()
	          .tickSize(-height)
	          .tickFormat("")
	      )*/

	
	function stackMin(serie) {
	  return d3.min(serie, function(d) { return d[0]; });
	}

	function stackMax(serie) {
	  return d3.max(serie, function(d) { return d[1]; });
	}

    /**
	 * Function to store legend Data
	 * 
	 * @param {array} 
	 */
	if(location.hash =="#!/cluster" || location.hash.indexOf('generalCardHolderDetails') >= 0){
		window.VerticalNegativeBarChartlegendData(legendData,options.container)
	}
	if(location.hash =="#!/alertDashboard"){
	window.VerticalNegativeBarChartlegendData(legendData,options.container)
	}
	
	$(options.container).find('svg').find('.xAxis').css('display','none')
	$(options.container).find('svg').find('.yAxis').find('line').css('display','none')
	$(options.container).find('svg').find('.grid').find('.domain').css('display','none')
	$(options.container).find('svg').find('.yAxis').find('.domain').css('display','none')
	if(options.gridColor){
		$(options.container).find('svg').find('.yAxis').find('text').css('fill',options.gridColor)
		$(options.container).find('svg').find('.grid').find('line').css('stroke',options.gridColor)
	}else {
		$(options.container).find('svg').find('.yAxis').find('text').css('display','none')
		$(options.container).find('svg').find('.grid').find('line').css('display','none')
	}
	
	//$(options.container).find('svg').find('path').css('display','none')
	

}
