 var tool_tip;
function BubbleHierarchyChart(bubbleHierarchyOptions) {
    if (bubbleHierarchyOptions.container) {
        $(bubbleHierarchyOptions.container).empty();
    }
    if(location.hash =="#!/alertDashboard" && (!bubbleHierarchyOptions.data || !bubbleHierarchyOptions.data.children || bubbleHierarchyOptions.data.children.length==0 )){
		d3.select(bubbleHierarchyOptions.container).append("div").attr("class","alertsDashErrorDiv").html("<span>Data Not Found</span>");
		return false;
	}
    //--------------------------Initialize Values-----------------------------
    if (bubbleHierarchyOptions) {
        this.container = bubbleHierarchyOptions.container ? bubbleHierarchyOptions.container : "body"
        this.data = (bubbleHierarchyOptions.data) ? bubbleHierarchyOptions.data : []
        this.height = bubbleHierarchyOptions.height ? bubbleHierarchyOptions.height : 600;
        this.uri = bubbleHierarchyOptions.uri;
        this.bubbleHierarchyHeader = bubbleHierarchyOptions.header ? bubbleHierarchyOptions.header : "BUBBLE HIERARCHY";

        this.randomIdString = Math.floor(Math.random() * 10000000000);
        this.bubbleColorScale = bubbleHierarchyOptions.bubbleColorScale?bubbleHierarchyOptions.bubbleColorScale:false
        this.bubbleSizeScale = bubbleHierarchyOptions.bubbleSizeScale?bubbleHierarchyOptions.bubbleSizeScale:false
        this.headerOptions = bubbleHierarchyOptions.headerOptions == false ? bubbleHierarchyOptions.headerOptions : true;
        this.bubbleColor = bubbleHierarchyOptions.bubbleColor ? bubbleHierarchyOptions.bubbleColor :["#38719E", "#9C6AED", "#198A78", "#4393D8","#BD65E4"];
        bubbleHierarchyOptions.specialToolTip=bubbleHierarchyOptions.specialToolTip?bubbleHierarchyOptions.specialToolTip:false;
        this.detailPage = bubbleHierarchyOptions.detailPage;
    } else {
      
        return false;
    }
 //   var colorList2 =   ['#ce3939','#ce6839','#ce9c39','#bace39','#45ce39','#39ce79','#39cece','#3997ce','#3965ce','#6539ce','#ce39bf','#ce3979','#bc7676','#63552c','#39632c','#632c49']
    var colorList2 =   ['#ce3939','#ce6839','#ce9c39','#bace39','#45ce39','#39ce79','#39cece','#3997ce','#3965ce','#6539ce','#ce39bf','#ce3979','#bc7676','#63552c','#39632c','#632c49','#8e446b','#a88a99','#ba7195','#6d5b64','#4c2b3c','#dba2bf']

 	var uc2Baroptions={
    	    axisX:false,
    	    axisY:false,
    	    barText:true,
    	    color:colorList2,
    	    gridColor:"#273B44",
    	    gridx:false,
    	    gridy:false,
    	    height:250,
    	    marginBottom:1,
    	    marginLeft:40,
    	    marginRight:5,
    	    marginTop:50,
    	    showxYaxis:false,
    	    width:450,
    	    movinglineStroke:"blue",
    	    movingtextColor:"#FFFFFF",
    	    container:"#uc2Bar",
    	    label:true
    	}
    	
    	
    var color =   ['#ce3939','#ce6839','#ce9c39','#bace39','#45ce39','#39ce79','#39cece','#3997ce','#3965ce','#6539ce','#ce39bf','#ce3979','#bc7676','#63552c','#39632c','#632c49','#66525c','#e0c7d4','#9e9398','#c1608c','#436a84']
    var baroptions = {
            container: '#barChart_tooltip',
            height: 160,
            width:400,
            marginRight: 5,
            marginLeft:40,
            marginBottom: 1,
            marginTop:30,
            color: colorList2,
            barText:true,
            label:true,
            gridColor:'#273B44'
        }
   
    var actualOptions = jQuery.extend(true, {}, bubbleHierarchyOptions);
    var randomSubstring = this.randomIdString;
    var h = this.height;
    var header = this.bubbleHierarchyHeader;
    // var bubblehierarchyChartId = this.container;
    var containerid = this.container;

    var _this = this;
    var modalwidth = $(window).width() - 200;
    var modal = ' <div id="modal_' + randomSubstring + '"class="modal fade " tabindex="-1" role="dialog"> <div class="modal-dialog modal-lg" style="width:' + modalwidth + 'px"> <form ><div class="modal-content"><div class="modal-body"  style="padding:0;background-color:#334d59" id="modal_chart_container' + randomSubstring + '"></div></div></form></div></div>';

    var bcolor=this.bubbleColor[0]
//    var chartContainerdiv = '<div class="chartContainer"  align="center" style="width: 100%; margin: auto; margin-top: 0px; font-size: 14px;font-style: inherit;"> <div class="graphBox" style="height:' + h + 'px;max-height: ' + h + 'px;min-height: ' + h + 'px;margin: auto; background-color: #374c59; width: 100%;left: 0px;top: 0px;position: relative;"> <div class="headerDiv" style="font-weight:bold;background-color: #425661;text-align: left;color: #239185; border-bottom: 1px solid rgba(192, 192, 192, 0.47);width: 100%; line-height: 2.5;font-size: 16px ;padding-left: 5px;">' + header + '</div><div id="bubblehierarchy_chart_div' + randomSubstring + '" class="chartContentDiv" style="width: 100%;"></div> </div></div>'
     var chartContainerdiv = '<div id="bubblehierarchy_chart_div' + randomSubstring + '" class="chartContentDiv" style="width: 100%;"></div> '
    $(containerid).html(chartContainerdiv);
    $(containerid).append(modal);
    var chart_container = "#bubblehierarchy_chart_div" + randomSubstring;
   
    this.width = bubbleHierarchyOptions.width ? bubbleHierarchyOptions.width : $(chart_container).width() - 10;
    if (this.height > this.width) {
        this.height = this.width
    }

    this.diameter = this.height > this.width ? this.width : this.height;
//    if (!this.headerOptions) {
//        var closebtn = '<button type="button" class="cancel" style="float: right;padding:0 8px;border:0;opacity: 1;background-color: transparent;float:right" data-dismiss="modal" aria-label="Close"> <span class="fa fa-remove"></span></button>'
//        $(chart_container).siblings(".headerDiv").append(closebtn);
//    }
//
//    if ($(chart_container).siblings(".headerDiv").find(".bstheme_menu_button").length == 0)
//        var header_options = '<div style="float: right; padding: 0 10px; cursor: pointer;" class="bstheme_menu_button bstheme_menu_button_' + randomSubstring + '" data-toggle="collapse" data-target="#opt_' + randomSubstring + '"><i class="fa fa-ellipsis-v" aria-hidden="true"></i><div class="bstheme_options" style="position:absolute;right:10px;z-index:2000"> <div style="display:none; min-width: 120px; margin-top: 2px; background: rgb(27, 39, 53) none repeat scroll 0% 0%; border: 1px solid rgb(51, 51, 51); border-radius: 4px;" id="opt_' + randomSubstring + '" class="collapse"><span style="display: inline-block;float: left;text-align: center;width: 33.33%; border-right: 1px solid #000;" class="header_fullscreen_chart' + randomSubstring + '"><i class="fa fa-expand" aria-hidden="true"></i></span><span style="display: inline-block;float: left;text-align: center;width: 33.33%; border-right: 1px solid #000;" class="header_refresh_' + randomSubstring + '"><i class="fa fa-refresh" aria-hidden="true"></i></span> <span style="display: inline-block;float: left;text-align: center;width: 33.33%;" class="header_table_' + randomSubstring + '"> <i class="fa fa-table" aria-hidden="true"></i></span> <span style="display: none;float: left;text-align: center;width: 33.33%;" class="header_chart_' + randomSubstring + '" ><i class="fa fa-bar-chart" aria-hidden="true"></i></span></div></div> </div>';
//    $(chart_container).siblings(".headerDiv").append(header_options);
//
//    if (!this.headerOptions) {
//        $(chart_container).siblings(".headerDiv").find(".bstheme_options").css("right", "28px");
//        $('.header_fullscreen_chart' + randomSubstring).css("display", "none");
//    } else {
//        $(chart_container).siblings(".headerDiv").find(".bstheme_options").css("right", "0");
//    }
    root = this.data;
    //  $(".graphBox").mCustomScrollbar({
    //     axis: "y",
    //    //theme: "3d"
    // });
//  
    var data = this.data;
    var formatSi = d3.format(".3s");
    function formatAbbreviation(x) {
      var s = formatSi(x);
      switch (s[s.length - 1]) {
        case "G": return s.slice(0, -1) + "B";
      }
      return s;
    }

//    var curretn_uri = this.Uri;
//    var bubble_header = this.bubbleHierarchyHeader;
  //  var tool_tip = $('body').append('<div class="bubblehierarchy_tooltip text-uppercase" style="position: absolute; opacity: 1; pointer-events: none; visibility: visible;display:none;background-color:#0cae96;  padding: 10px;border-radius: 5px; border: 1px solid gray;font-size: 10px;color:black;"><span style=" font-size: 12px; position: absolute; white-space: nowrap;  margin-left: 0px; margin-top: 0px; left: 8px; top: 8px;"><span style="font-size:10px" class="tool_tip_x_val"></span><table><tbody><tr><td style="padding:0"> </td><td style="padding:0"><b>216.4 mm</b></td></tr><tr><td style="color:#434348;padding:0">New York: </td><td style="padding:0"><b>91.2 mm</b></td></tr><tr><td style="color:#90ed7d;padding:0">London: </td><td style="padding:0"><b>52.4 mm</b></td></tr><tr><td style="color:#f7a35c;padding:0">Berlin: </td><td style="padding:0"><b>47.6 mm</b></td></tr></tbody></table></span></div>');
 if(_this.container == "israClusterBubbleChart"){   
    tool_tip = $('body').append('<div class="Bubble_Chart_tooltip bubble-chart-cluster" style="position: absolute;z-index: 99999;opacity: 1; pointer-events: none; visibility: visible;display:none;text-transform:uppercase;background-color:#0cae96;  padding: 10px;border-radius: 5px; border: 1px solid gray;font-size: 10px;color:black;"><span style=" font-size: 12px; position: absolute; white-space: nowrap;  margin-left: 0px; margin-top: 0px; left: 8px; top: 8px;"><span style="font-size:10px" class="tool_tip_x_val"></span><table><tbody><tr><td style="padding:0"> </td><td style="padding:0"><b>216.4 mm</b></td></tr><tr><td style="color:#434348;padding:0">New York: </td><td style="padding:0"><b>91.2 mm</b></td></tr><tr><td style="color:#90ed7d;padding:0">London: </td><td style="padding:0"><b>52.4 mm</b></td></tr><tr><td style="color:#f7a35c;padding:0">Berlin: </td><td style="padding:0"><b>47.6 mm</b></td></tr></tbody></table></span> </div>');
 } else {
	tool_tip = $('body').append('<div class="Bubble_Chart_tooltip" style="position: absolute;z-index: 99999;opacity: 1; pointer-events: none; visibility: visible;display:none;text-transform:uppercase;background-color:#0cae96;  padding: 10px;border-radius: 5px; border: 1px solid gray;font-size: 10px;color:black;"><span style=" font-size: 12px; position: absolute; white-space: nowrap;  margin-left: 0px; margin-top: 0px; left: 8px; top: 8px;"><span style="font-size:10px" class="tool_tip_x_val"></span><table><tbody><tr><td style="padding:0"> </td><td style="padding:0"><b>216.4 mm</b></td></tr><tr><td style="color:#434348;padding:0">New York: </td><td style="padding:0"><b>91.2 mm</b></td></tr><tr><td style="color:#90ed7d;padding:0">London: </td><td style="padding:0"><b>52.4 mm</b></td></tr><tr><td style="color:#f7a35c;padding:0">Berlin: </td><td style="padding:0"><b>47.6 mm</b></td></tr></tbody></table></span></div>');
 }
    var width = this.width,
            height = this.height,
            diameter = this.diameter,
            node,
            root;

// var diameter = 400,
    var format = d3.format(",d");

    var color = d3.scaleOrdinal().range(_this.bubbleColor);
    var colorScale = d3.scaleOrdinal().range(["#F160AB", "#62ABDE", "#F6D584", "#60F3BD","#9C6AED","#198A78"]);
if(_this.bubbleColorScale){
	colorScale =_this.bubbleColorScale;
}


    var bubble = d3.pack()
            .size([diameter, diameter])
            .padding(10);

    var svg;
    if(width == height){
	    svg= d3.select(chart_container).append("svg")
	            .attr("width", diameter)
	            .attr("height", diameter)
	            .attr("class", "bubble");
    }else if(width>height){
    	svg= d3.select(chart_container).append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "bubble")
        .append("g")
        .attr("transform", "translate(" + (width -height)/ 2 + "," + 0 + ")");
    
    }else{
    	svg= d3.select(chart_container).append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "bubble")
        .append("g")
        .attr("transform", "translate(" +0 + "," +  (height-width)/ 2 + ")");
    }
   
// d3.json("flare.json", function(error, data) {
//   if (error) throw error;

    var root = d3.hierarchy(classes(data))
            .sum(function (d) {
                return d.value;
            })
            .sort(function (a, b) {
                return b.value - a.value;
            });

    bubble(root);
    var node = svg.selectAll(".node")
            .data(root.children)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            }).style("cursor",function(){
                if(containerid == '#israClusterBubbleChart' && (location.hash =="#!/cluster" || location.hash =="#!/dualCardClusterPage")){
                    return "pointer";
                }
                else{
                    return "default";
                }
            });   
    var radius = []
      node.append("circle")
            .attr("r", function (d) {
            	radius.push(d.r)
            })
              radius.sort(function(x, y) {
                return d3.ascending(x,y);
            })
    var bubbleSizeScale2 = d3.scaleLinear().domain([0, radius[radius.length-1]+80]).range([5, 30]);
    node.append("circle")
            .attr("r", function (d) {
            	radius.push(d.r)
           if(containerid == '#israClusterBubbleChart' && location.hash =="#!/cluster" ){
        	   return 0;
           }else{
                return d.r;
           }
            })
            .style("stroke", "none")
            .style("stroke-width", 5)
            .style("stroke-opacity", 2.5)
            .style("fill", function (d) {
            	if(_this.bubbleColorScale){
            		return _this.bubbleColorScale(parseFloat(d.data.allData.avgExp))
            	}
               if(d.data.allData.colorRange){
	        	   return d.data.allData.colorRange
	           }else{
	                 return color(d.data.className);
	           }
            })
            .transition().duration(2000).attr("r", function(d) {
             return d.r;
             });
             if(bubbleHierarchyOptions.specialToolTip){
             node.append("text")
             .attr("dy", "0.8em")
             .style("text-anchor", "middle")
             .style("font-size",function(d){
            	  if(_this.bubbleSizeScale){
            		  
            		  return (bubbleSizeScale2(d.r)-5)
            	 }
             })
             .style("fill",'white')
             .style("font-weight",'bold')
             .style("stroke",function(d){
            	 if(_this.bubbleColorScale){
             		return ''
             	}
                if(d.data.allData.colorRange){
 	        	   return d.data.allData.colorRange
 	           }else{
 	                 return color(d.data.className);
 	           }
             })
             .style("opacity",0.4)
             .text(function(d) { 
            	 if((bubbleSizeScale2(d.r))>8){
            	 return "CUSTOMERS"; }});
             
             node.append("text")
             .attr("dy", "2em")
             .style("text-anchor", "middle")
             .style("font-weight",'bold')
             .style("font-size",function(d){
            	  if(_this.bubbleSizeScale){
            		  return bubbleSizeScale2(d.r)
            	 }
             })
             .style("stroke",function(d){
            	 if(_this.bubbleColorScale){
             		return ''
             	}
                if(d.data.allData.colorRange){
 	        	   return d.data.allData.colorRange
 	           }else{
 	                 return color(d.data.className);
 	           }
             }) .style("fill",'white')
             .style("opacity",0.4)
            .text(function(d) { return parseInt(d.data.allData.size) });
             
             node.append("text")
             .attr("dy", "-2em")
             .style("text-anchor", "middle")
             .style("font-weight",'bold')
             .style("font-size",function(d){
            	  if(_this.bubbleSizeScale){
            		  return bubbleSizeScale2(d.r)
            	 }
             })
             .style("stroke",function(d){
            	 if(_this.bubbleColorScale){
             		return ''
             	}
                if(d.data.allData.colorRange){
 	        	   return d.data.allData.colorRange
 	           }else{
 	                 return color(d.data.className);
 	           }
             }) .style("fill",'white')
             .style("opacity",0.4)
             .text(function(d) { 
            	 if((bubbleSizeScale2(d.r))>8){
            	 return d.data.allData.name.toUpperCase() }});
             
}
    node.on("click", function (d){
    	if(containerid != '#	' && containerid !='#riskAlertModalCountries' && location.hash =="#!/alertDashboard" ){
    		window.openSideModal(d,containerid,bcolor);
    	}
    	if(containerid == '#israClusterBubbleChart' && location.hash =="#!/cluster" ){
    		window.detailsPage(_this.detailPage, d.data.allData.clusterID);
    	}else if(containerid == '#israClusterBubbleChart' && location.hash =="#!/dualCardClusterPage" ){
    		window.detailsPage('Dual Card Holders', d.data.allData.clusterID);
    	}
    	
    	location.hash =="#!/dualCardClusterPage" 
    }).on("contextmenu",function(d){
    	if(location.hash =="#!/alertDashboard"){
            window.transSelectedFilter.data = d
      		 window.transSelectedFilter.id = containerid;
      		 window.transSelectedFilter.chartType ="bubble";
//      		 aplyAlertDasboardFilters(d,pieOptions.container,"pie");
      	 }
    })
     
    .on("mouseover", function (d) {
    	 $(this).css("opacity", 0.8);
		 if(bubbleHierarchyOptions.specialToolTip){
			 $(".Bubble_Chart_tooltip").remove()
	    	 tool_tip = $('body').append('<div class="Bubble_Chart_tooltip bubble-chart-cluster" style="position: absolute;z-index: 99999;opacity: 1; pointer-events: none; visibility: visible;display:none;text-transform:uppercase;background-color:#0cae96;  padding: 10px;border-radius: 5px; border: 1px solid gray;font-size: 10px;color:black;"><span style=" font-size: 12px; position: absolute; white-space: nowrap;  margin-left: 0px; margin-top: 0px; left: 8px; top: 8px;"><span style="font-size:10px" class="tool_tip_x_val"></span><table><tbody><tr><td style="padding:0"> </td><td style="padding:0"><b>216.4 mm</b></td></tr><tr><td style="color:#434348;padding:0">New York: </td><td style="padding:0"><b>91.2 mm</b></td></tr><tr><td style="color:#90ed7d;padding:0">London: </td><td style="padding:0"><b>52.4 mm</b></td></tr><tr><td style="color:#f7a35c;padding:0">Berlin: </td><td style="padding:0"><b>47.6 mm</b></td></tr></tbody></table></span> </div>');
				 var pieValue =  parseInt(d.data.allData.customersOutOfIsracardPopulation);
					 if(d.data.allData.hasOwnProperty("attributes")){
						var totalCustomer = Number(Math.round(d.data.allData.size)).formatAmt()
						totalCustomer = totalCustomer.split('.')[0] 
						$(".Bubble_Chart_tooltip").html('<div class="row" style="margin:0"><div class="col-sm-3"> <div class="c100 p'+pieValue+' pink radial" style="left:0!important"><span>'+pieValue+'%</span> <div class="slice"> <div class="bar"></div> <div class="fill"></div> </div></div><p style="font-size:9px;"><span style="margin-top:5px;">'+totalCustomer+' CUSTOMERS</span></p></div> <div class="col-sm-9 chart-tooltip-right pad-x0"> <h3>' + d.data.allData.name + '</h3><p style= "margin:0 0 10px"><span>Total Amount</span>: <span> <span class="fa fa-ils f-10"></span> '+formatTotalAmount(d.data.allData.totalAmount)+'</span></p> <p style= "margin:0 0 7px"><span>AVERAGE EXPENDITURE</span></p><ul class="list-unstyled progressbar-list"><li class="progressbar-list-item"><div class="left-col">CLUSTER</div><div class="progress"><div  class="progress-bar progress-dark-red" role="progressbar" aria-valuenow="'+d.data.allData.progress1+'" aria-valuemin="0" aria-valuemax="100" style="width:'+d.data.allData.progress1+'%"><span class="sr-only">'+d.data.allData.avgExpenditure+' Complete</span></div></div><div class="right-col"> <span class="fa fa-ils f-8"></span> '+ formatAbbreviation(d.data.allData.avgExpenditure) +'</div></li><li class="progressbar-list-item"><div class="left-col">GENERAL POPULATION</div><div class="progress"><div  class="progress-bar progress-dark-red" role="progressbar" aria-valuenow="'+d.data.allData.progress2+'" aria-valuemin="0" aria-valuemax="100" style="width:'+d.data.allData.progress2+'%"><span class="sr-only">'+formatAbbreviation(d.data.allData.avgExpPerCustomerAmongGP)+' Complete</span></div></div><div class="right-col"> <span class="fa fa-ils f-8"></span> '+formatAbbreviation(d.data.allData.avgExpPerCustomerAmongGP)+'</div></li></ul></div></div><div class="bar-chart-wrapper"><div id="barChart_tooltip"></div><div style="width:100%" id="legendsDiv"></div></div>');		 
						 baroptions.width = 450
						 baroptions.domainArray=[d3.min(d.data.allData.attributes, function(d) { 
				        		if(d.is_found){
				        		return d.attribute_sd_value; }}),d3.max(d.data.allData.attributes, function(d) { 
				        			if(d.is_found){
				        			return d.attribute_sd_value; }})]
						 var barDta = []
						 if(d.data.allData.attributes){
							 d.data.allData.attributes.forEach(function(d){
								 if(d.is_found){
									 var index = bubbleHierarchyOptions.localTableData.map(function(d){
											return d.key
										}).indexOf(d.attribute_name.toUpperCase())
										if(index == -1){
											barDta.push({
							                'name': d.attribute_name,
							                'value': d.attribute_sd_value
											})
							            }else if(index != -1){
							            	barDta.push({
						            		    'name': bubbleHierarchyOptions.localTableData[index]['UIname'],
								                'value': d.attribute_sd_value
												})
								           }
								 }
							 })
							 baroptions.data = barDta
							 baroptions.data.sort(function(x, y) {
			         	           return d3.ascending(x.name,y.name);
			         	       })
			         	  	 
							 verticalBarChart(baroptions)
						 }
						 
					 }else  if(d.data.allData.hasOwnProperty("cluser_attributes")){
						 var totalCustomer = Number(Math.round(d.data.allData.size)).formatAmt()
							totalCustomer = totalCustomer.split('.')[0] 	
						 $(".Bubble_Chart_tooltip").html('<div class="row" style="margin:0"><div class="col-sm-3"> <div class="c100 p'+pieValue+' pink radial" style="left:0!important"><span>'+pieValue+'%</span> <div class="slice"> <div class="bar"></div> <div class="fill"></div> </div></div><p style="font-size:9px;"><span style="margin-top:5px;">'+totalCustomer+' CUSTOMERS</span></p></div> <div class="col-sm-9 chart-tooltip-right pad-x0"> <h3>' + d.data.allData.name + '</h3><p style= "margin:0 0 10px"><span>Total Amount</span>: <span class="fa fa-ils f-10"></span> '+formatTotalAmount(d.data.allData.totalAmount)+'</span></p> <p style= "margin:0 0 7px"><span>AVERAGE EXPENDITURE</span></p><ul class="list-unstyled progressbar-list"><li class="progressbar-list-item"><div class="left-col">CLUSTER</div><div class="progress"><div  class="progress-bar progress-dark-red" role="progressbar" aria-valuenow="'+d.data.allData.progress1+'" aria-valuemin="0" aria-valuemax="100" style="width:'+d.data.allData.progress1+'%"><span class="sr-only"> '+d.data.allData.avgExp+' Complete</span></div></div><div class="right-col"><span class="fa fa-ils f-8"></span> '+ formatAbbreviation(d.data.allData.avgExp) +'</div></li><li class="progressbar-list-item"><div class="left-col">GENERAL POPULATION</div><div class="progress"><div  class="progress-bar progress-dark-red" role="progressbar" aria-valuenow="'+d.data.allData.progress2+'" aria-valuemin="0" aria-valuemax="100" style="width:'+d.data.allData.progress2+'%"><span class="sr-only">'+formatAbbreviation(d.data.allData.avgExpPerCustomerAmongGP)+' Complete</span></div></div><div class="right-col"> <span class="fa fa-ils f-8"></span> '+formatAbbreviation(d.data.allData.avgExpPerCustomerAmongGP)+'</div></li></ul></div></div><div class="bar-chart-wrapper"><div id="uc2Bar"></div><div style="width:100%" id="legendsDiv"></div></div>');		 
								 uc2Baroptions.container = "#uc2Bar"
									 uc2Baroptions.height = 400
									 if(d.data.allData.cluser_attributes){
										 var data1 = []
										 d.data.allData.cluser_attributes['primary_attributes'].forEach(function(d){
											 data1.push({
												 'name':d.attribute_name,
												 'value':d.attribute_sd_value
											 })
										 })
										 
										 var data2 = []
										 d.data.allData.cluser_attributes['secondary_attributes'].forEach(function(d){
											 data2.push({
												 'name':d.attribute_name,
												 'value':d.attribute_sd_value
											 })
										 })
										 uc2Baroptions.data = [data1,data2]
										 var min1 = d3.min( d.data.allData.cluser_attributes['primary_attributes'], function(d) { return d.attribute_sd_value; })
										 var max1 = d3.max( d.data.allData.cluser_attributes['primary_attributes'], function(d) { return d.attribute_sd_value; })
										 var min2 = d3.min( d.data.allData.cluser_attributes['secondary_attributes'], function(d) { return d.attribute_sd_value; })
										 var max2 = d3.max( d.data.allData.cluser_attributes['secondary_attributes'], function(d) { return d.attribute_sd_value; })
										var datasort = [min1,max2,min2,max2]
										 datasort.sort(function(x, y) {
						         	           return d3.ascending(x.name,y.name);
						         	       })
									//	 uc2Baroptions.domainArray=[[d3.min( d.data.allData.cluser_attributes['primary_attributes'], function(d) { return d.attribute_sd_value; }),d3.max( d.data.allData.cluser_attributes['primary_attributes'], function(d) { return d.attribute_sd_value; })],[d3.min(d.data.allData.cluser_attributes['secondary_attributes'], function(d) { return d.attribute_sd_value; }),d3.max(d.data.allData.cluser_attributes['secondary_attributes'], function(d) { return d.attribute_sd_value; })]]
										 uc2Baroptions.domainArray= [[datasort[0],datasort[datasort.length-1]],[datasort[0],datasort[datasort.length-1]]]
										 //uc2Baroptions.domainArray= bubbleHierarchyOptions.domainArray
										 uc2Baroptions.container2 = 'mainsvg'+d.data.allData.clusterID
										 NegativeBarWithTooltipChart(uc2Baroptions)
									 }
							
							 uc2Baroptions.container = "#uc2Bar"
							NegativeBarWithTooltipChart(uc2Baroptions)
					 }else{
							 $(".Bubble_Chart_tooltip").html('<div class="row" style="margin:0"><div class="col-sm-3"> <div class="c100 p'+pieValue+' pink radial" style="left:0!important"><span>'+pieValue+'%</span> <div class="slice"> <div class="bar"></div> <div class="fill"></div> </div></div><p style="font-size:9px; text-align:center"><span style="margin-top:5px;">CUSTOMERS</span></p></div> <div class="col-sm-9 chart-tooltip-right pad-x0"> <h3>' + d.data.allData.name + '</h3><p style= "margin:0 0 10px"><span>Total Amount</span>: <span> <span class="fa fa-ils f-10"></span> '+format(d.data.allData.avgExp)+'</span></p> <p style= "margin:0 0 7px"><span>AVERAGE EXPENDITURE</span></p><ul class="list-unstyled progressbar-list"><li class="progressbar-list-item"><div class="left-col">CLUSTER</div><div class="progress"><div  class="progress-bar progress-dark-red" role="progressbar" aria-valuenow="'+d.data.allData.progress1+'" aria-valuemin="0" aria-valuemax="100" style="width:'+d.data.allData.progress1+'%"><span class="sr-only">'+d.data.allData.avgExpenditure+' Complete</span></div></div><div class="right-col"><span class="fa fa-ils f-8"></span> '+ formatAbbreviation(d.data.allData.avgExpenditure) +'</div></li><li class="progressbar-list-item"><div class="left-col">GENERAL POPULATION</div><div class="progress"><div  class="progress-bar progress-dark-red" role="progressbar" aria-valuenow="'+d.data.allData.progress2+'" aria-valuemin="0" aria-valuemax="100" style="width:'+d.data.allData.progress2+'%"><span class="sr-only">'+formatAbbreviation(d.data.allData.avgExpPerCustomerAmongGP)+' Complete</span></div></div><div class="right-col"> <span class="fa fa-ils f-8"></span> '+formatAbbreviation(d.data.allData.avgExpPerCustomerAmongGP)+'</div></li></ul></div></div><div class="bar-chart-wrapper"><div id="barChart_tooltip"></div><div style="width:100%" id="legendsDiv"></div></div>');		 
					 }
		 }else{
        		if(location.hash =="#!/alertDashboard"){
        			$(".Bubble_Chart_tooltip").html('<span>' + d.data.className + ":$" + format(d.value)+'</span>');
        		}else{
        			$(".Bubble_Chart_tooltip").html('<span>' + d.data.className + ":" + format(d.value)+'</span>');
        		}
        	}
        	return $(".Bubble_Chart_tooltip").css("display", "block");
		})
       .on("mousemove", function () {
       	var p=$(chart_container)
       	var position=p.offset();
       	var windowWidth=window.innerWidth;
       	var tooltipWidth=$(".Bubble_Chart_tooltip").width()+50
       	var cursor=d3.event.x;
        	if((position.left<d3.event.pageX)&&(cursor>tooltipWidth)){
       		var element = document.getElementsByClassName("Bubble_Chart_tooltip");
       		for(i=0;i<element.length;i++){
       		element[i].classList.remove("tooltip-left");
   			element[i].classList.add("tooltip-right");
	   			if(bubbleHierarchyOptions.specialToolTip){
	   				element[i].classList.add("cluster-chart-tooltip");
	   			}
       		}
          		$(".Bubble_Chart_tooltip").css("left",(d3.event.pageX - 15-$(".Bubble_Chart_tooltip").width()) + "px");
        	}else{
       		var element =document.getElementsByClassName("Bubble_Chart_tooltip");
       		for(i=0;i<element.length;i++){
          		element[i].classList.remove("tooltip-right");
      		    element[i].classList.add("tooltip-left");
      		    if(bubbleHierarchyOptions.specialToolTip){
	   				element[i].classList.add("cluster-chart-tooltip");
	   			}
       		}   
       		if(bubbleHierarchyOptions.specialToolTip){
      		    $(".Bubble_Chart_tooltip").css("left", (d3.event.pageX + 50) + "px");
       		}else{
       			$(".Bubble_Chart_tooltip").css("left", (d3.event.pageX + 10) + "px");
       		}
       	}
        	if(bubbleHierarchyOptions.specialToolTip && (location.hash.indexOf('cluster') >= 0 ||location.hash.indexOf('dualCardClusterPage') >= 0)){
        		 return $(".Bubble_Chart_tooltip").css("top",d3.event.pageY-200 + "px")
       		}else if(bubbleHierarchyOptions.specialToolTip){
        		 return $(".Bubble_Chart_tooltip").css("top",d3.event.pageY-100 + "px")
       		}else{
       			return $(".Bubble_Chart_tooltip").css("top",d3.event.pageY + "px")
       		}
          

       })
       .on("mouseout", function () {
        $(".Bubble_Chart_tooltip").css("display", "none");
       	 $(this).css("opacity", 1);
            //hide tool-tip
            return $(".Bubble_Chart_tooltip").css("display", "none");
        });
	
    // node.append("text")
    //     .attr("dy", ".3em")
    //     .style("text-anchor", "middle")
    //     .text(function(d) { return d.data.className.substring(0, d.r / 3); });
// });

// Returns a flattened hierarchy containing all leaf nodes under the root.
    function classes(root) {
        var classes = [];

        function recurse(name, node) {
            if (node.children)
                node.children.forEach(function (child) {
                    recurse(node.name, child);
                });
            else
                classes.push({packageName: name, className: node.name, value: node.size, allData : node });
        }

        recurse(null, root);
        return {children: classes};
    }

//    d3.select(self.frameElement).style("height", diameter + "px");

    var newdata = [];
    function datahandle(data, parentName)
    {

        if (data.children)
        {
            $.each(data.children, function (i, v) {

                datahandle(v, data.name)
            });
        }
        else
        {
            newdata.push({
                "name": data.name,
                "size": data.size,
                "group": parentName
            })
        }
    }

//------------------------------------------------------------------------------
    /**
     * Fuction to handle show hide of header options
     */
    $("body").on("click", ".bstheme_menu_button_" + randomSubstring, function () {

        var id = ($(this).attr("data-target"));
        if ($(id).css("display") == "none") {
            $(id).css("display", "inline-block");
        } else {
            $(id).css("display", "none");
        }
    });

//------------------------------------------------------------------------------
    /**
     * Fuction to handle show hide of header options
     */
    $("body").on("click", ".header_refresh_" + randomSubstring, function () {
        var chartId = $(this).parent().parent().parent().parent().siblings("div").attr("id");
        if ("#" + chartId == chart_container) {
            $(containerid).empty();
            chartBubbleHierarchy(actualOptions);
        }
    });
//------------------------------------------------------------------------------  
    /**
     * Fuction to handle show hide of header options
     */
    $("body").on("click", ".header_table_" + randomSubstring, function () {
        // var h = $(chartContainerdiv).height()

        $(chart_container).empty();
//        $(chart_container).css("overflow","auto");
        $(this).css("display", "none");
        $(".header_chart_" + randomSubstring).css("display", "inline-block");

        var tbl = "<div id ='bubblehierarchy_table_" + randomSubstring + "'  style='padding:5px;background-color: #425661;overflow:overflow:hidden;height:" + (_this.height) + "px'><table id ='bubblehierarchy_table1_" + randomSubstring + "' class=' table-striped ' style='width:100%;background-color:#283C45;padding:5px;color:#5A676E; ' ><thead><tr><th>NAME</th><th>VALUE</th><th>GROUP</th></tr></thead><tbody>";

        datahandle(data, data.name);

        $.each(newdata, function (i2, v2) {
            tbl = tbl + "<tr><td>" + (v2.name.toUpperCase()) + "</td><td>" + v2.size + "</td><td>" + (v2.group.toUpperCase()) + "</td></tr>"

        });
        tbl = tbl + "</tbody></table></div>";
        $(chart_container).append(tbl);
        $("#bubblehierarchy_table1_" + randomSubstring).DataTable({"bLengthChange": false, "paging": false, "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                if (iDisplayIndex % 2 == 1) {
                    //even color
                    $('td', nRow).css('background-color', '#32464F');
                } else {
                    $('td', nRow).css('background-color', '#283C45');
                }
            }});
        $("#bubblehierarchy_table_" + randomSubstring).mCustomScrollbar({
            axis: "y"
        });

        $("#bubblehierarchy_table_" + randomSubstring + " tr:first").css("background-color", "#0CB29A");
        var id1 = $("#bubblehierarchy_table_" + randomSubstring).children('div').find('div').eq(0);
        var id2 = $("#bubblehierarchy_table_" + randomSubstring).children('div').find('div').eq(1);
        var id3 = $("#bubblehierarchy_table_" + randomSubstring).children('div').find('div').eq(2);
        var id1attr = id1.attr("id");
        var id2attr = id2.attr("id");
        var id3attr = id3.attr("id");

        $("#" + id1attr + " " + "label").css("color", "#666666")
        $("#" + id2attr + " " + "label").css("color", "#666666")
        $("#" + id3attr).css("color", "#666666")

        $(" .dataTables_filter input").css({"margin-left": "0.5em", "position": "relative", "border": "0", "min-width": "240px",
            "background": "transparent",
            "border-bottom": "1px solid #666666",
            " border-radius": " 0",
            "padding": " 5px 25px",
            "color": "#ccc",
            "height": " 30px",
            "-webkit-box-shadow": " none",
            "box-shadow": " none"
        })

    });

//------------------------------------------------------------------------------
    /**
     * Fuction to handle show hide of header options
     */
    $("body").on("click", ".header_chart_" + randomSubstring, function () {
        $(chart_container).css("overflow", "hidden");
        var chartId = $(this).parent().parent().parent().parent().siblings("div").attr("id");
        if ("#" + chartId == chart_container) {
            $(this).css("display", "none");
            $(".header_table_" + randomSubstring).css("display", "inline-block");
            $(containerid).empty();
            new BubbleHierarchyChart(actualOptions);
        }
    });
//------------------------------------------------------------------------------------------------

    $("body").on("click", ".header_fullscreen_chart" + randomSubstring, function () {
//       $("#modal_"+randomSubstring).modal("show");
        $("#modal_" + randomSubstring).modal('show');
        var options = jQuery.extend(true, {}, actualOptions);
        setTimeout(function () {
            $("#modal_chart_container" + randomSubstring).css("width", "100%")
            options.container = "#modal_chart_container" + randomSubstring;
            options.headerOptions = false;
            options.height = 450;
            new BubbleHierarchyChart(options);
        }, 500)

        //"modal_chart_container"+randomSubstring
    })
    
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
        formatAmount = Number(Math.round(amount)).formatAmt()
        return formatAmount;
    }
    

}