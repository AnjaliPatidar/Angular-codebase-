import * as d3 from 'd3';
function verticalBarGraph(){}
// var options  = {"yaxisHeadingText":"","toolTipTextColor":"white","toolTipText":"openFailuresOn","toolTipBackground":"","toolTipBorder":"2px","showlineaxisY":true,"showlineaxisX":true,"paddingX":0.4,"id":"#barchart","rx":10,"ry":10,"height":300,"marginTop":45,"marginBottom":70,"stroke":"red","marginRight":45,"marginLeft":45,"tickColor":"rgb(51, 69, 81)","color_hash":{"0":["Invite","#8F4582"]},"colors":"#B13161","width":900.09375,"xParam":{},"yParam":{},"gridx":true,"gridy":false,"axisX":true,"axisY":false,"showxYaxis":false,"xtext":"","showGrid" : false,"showBarData":false}
// var data = [{"x":"sep24","y":79},{"x":"sep25","y":13},{"x":"sep26","y":9},{"x":"sep27jhhhhhhhhhhhhhhhhhhh uhjj hvhjg gyyjj yhy","y":4},{"x":"sep38","y":2},{"x":"sep29","y":4},{"x":"sep30","y":3},{"x":"sep31","y":1},{"x":"sep 30","y":3}]


verticalBarGraph.prototype.verticalBarGraph = function (data,options,callback){
	if(document.getElementById("toolTip_barhorizontalId"+options.id)){
		var element = document.getElementById("toolTip_barhorizontalId"+options.id)
		element.parentNode.removeChild(element);
	}
	var div = d3.select("body").append("div").attr("class", "toolTip_barhorizontal ").attr("id", "toolTip_barhorizontalId"+options.id).style("position", "absolute").style("z-index", 1000).style("padding","5px 10px").style("font-size","10px").style("display","none").style("visibility","hidden").style("min-width","200px").style("max-width","300px");
	document.getElementById(options.id).innerHTML = '';
  	var margin = {top: options.marginTop, right: options.marginRight, bottom: options.marginBottom, left: options.marginLeft},
	 width = (options.width?options.width:document.getElementById(options.id).offsetWidth  )- margin.left - margin.right;
	var  height =(options.height?options.height:500) - margin.top - margin.bottom;

	var x = d3.scaleBand()
		.range([0, width])
		.domain(data.map(d => d.x))
		.padding(options.paddingX ? options.paddingX : "0.1")

	var y = d3.scaleLinear()
		.range([height, 0])
		.domain([0, d3.max(data, d => d.y)])

  	var xAxis = d3.axisBottom(x)

	var yAxis = d3.axisLeft(y)

	if(options.yAxisTickFormat){
		yAxis.tickFormat(d3.format(options.yAxisTickFormat));
	}

	if(options.yAxisTicks){
		yAxis.ticks(options.yAxisTicks);
	}

	var svg = d3.select("#"+options.id).append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate("+margin.left+"," +margin.top+")")

	if(options.xaxisHeadingText){
		svg.append("text")
		.attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
		.style("text-anchor", "middle")
		.text(options.xaxisHeadingText)
	}

	if(options.yaxisHeadingText){
		svg.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - margin.left)
		.attr("x",0 - (height / 2))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.text(options.yaxisHeadingText)
		.style("fill",options.yaxisHeadingTextColor ? options.yaxisHeadingTextColor : "white")
	}

	if(options.xAxisFlags){
		svg.append("g")
		.attr("class", "x-scale")
		.style("fill","#ff000000")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		d3.selectAll(".x-scale .tick text").style("visibility",'hidden');
		d3.selectAll(".x-scale .tick line").style("visibility",'hidden');
		d3.selectAll(".x-scale path").style("visibility",'hidden');
		d3.selectAll(".x-scale .tick").each(function(d,i){
			d3.select(this)
			.append('defs').append('pattern').attr('id',`flag-${d.toLowerCase()}`).attr('x',0).attr('y',0).attr('width',20).attr('height',20)
			.append('image').attr('xlink:href', "../../assets/css/flags/1x1/" + d.toLowerCase() + ".svg").attr('height','20').attr('weight','20px');
		});
		d3.selectAll(".x-scale .tick").each(function(d,i){
			d3.select(this)
			.append('ellipse').attr('fill',`url(#flag-${d.toLowerCase()})`).attr('rx',10).attr('cx',0).attr('cy',15)
			.style("cursor",'pointer');
		}).on('click',x => {
			callback.callFilterFromSourceMangeDomainSearch(x);
		});
	} else {
		svg.append("g")
		.attr("class", "Xaxis")
		.attr("transform", "translate(0,"+height+")")
		.call(xAxis)
		.selectAll(".tick text")
		.style("fill",options.valuesColor ? options.valuesColor :"white")
		.call(wrap, x.bandwidth())
	}

	svg.append("g")
		.attr("class", "Yaxis")
		.call(yAxis)
		.selectAll(".tick text")
		.style("fill",options.valuesColor ? options.valuesColor :"white")
		// if(showlineaxisY){

		//  }
		if (!options.showlineaxisY) {

			document.querySelector('.Yaxis .domain').style.display = "none"
			//y.selectAll('line').remove();
		}
		if (!options.showlineaxisX) {
			document.querySelector('.Xaxis .domain').style.display = "none"

		}
  // gridlines in y axis function
  function make_y_gridlines() {
			  return d3.axisLeft(y)

		  }

		 var y_grid = svg.append("g")
			.attr("class", "grid")
			.attr("id","grid")
			.call(make_y_gridlines()
				.tickSize(-width)
				.tickFormat("")
			);

			y_grid.selectAll("line").style("stroke",options.stroke ? options.stroke : "rgba(240, 240, 240, 0.6)")
									  .style("shape-rendering",options.shapeRendering ? options.shapeRendering :"crispEdges")
									  .style("stroke-width",options.strokeWidth ? options.strokeWidth :"1px");
			 y_grid.selectAll("path").style("display","none");
			 if(!options.showGrid){
				//$('.grid').find('.tick').css('display', 'none')
				document.getElementById('grid').style.display = "none"

			 }
   // gridlines in y axis ends
   // start add bars
	svg.selectAll(".bar")
		.data(data)
	  .enter().append("rect")
		.attr("class", "bar")
		.style("fill", function(d) {
			if(options.colors){
				return options.colors
			} else{
				//return "#C39446"
			}
			 })
		.attr("rx",options.rx ? options.rx : '')
		.attr("ry",options.ry ? options.ry : '')
		.attr("x", d => x(d.x))
		.attr("width", x.bandwidth())
		.attr("y", d => y(d.y))
		.attr("height", d => height - y(d.y))
		.on("mouseover", function (d) {
			d3.select(this).style("opacity",options.hoverBarOpacity ? options.hoverBarOpacity:'');
			div.style("visibility", "visible");
			div.style("display", "inline-block");

			div.html("<div style='color :"+options.toolTipTextColor +"' <span>"+options.toolTipText +"&nbsp;"+d.x+"</span>");

		})
		.on("mousemove", function (d) {
			/*var svgWidth = $(options.id).width();
			if(d3.event.pageX + 10+( $(".toolTip_barhorizontal").width()) >svgWidth){
				div.style("left", d3.event.pageX + 10-( $(".toolTip_barhorizontal").width()+35) + "px");
			}else{
				div.style("left", d3.event.pageX + 10 + "px");
			}
			div.style("top", d3.event.pageY - 25 + "px");*/

			var p = document.getElementById(options.id);
			var position ={
				top: p.offsetTop,
				left: p.offsetLeft,
			};
			var windowWidth = window.innerWidth;
			var tooltipWidth = document.getElementById("toolTip_barhorizontalId"+options.id).offsetWidth + 50
			var cursor = d3.event.x;
			if ((position.left < d3.event.pageX) && (cursor > tooltipWidth)) {
				var element = document.getElementsByClassName("toolTip_barhorizontal");
				for (var i = 0; i < element.length; i++) {
					element[i].classList.remove("tooltip-left");
					element[i].classList.add("tooltip-right");
				}
				document.getElementById("toolTip_barhorizontalId"+options.id).style.left = (d3.event.pageX - 15 - document.getElementById("toolTip_barhorizontalId"+options.id).offsetWidth) + "px";
			} else {
				var element = document.getElementsByClassName("toolTip_barhorizontal");
				for (var i = 0; i < element.length; i++) {
					element[i].classList.remove("tooltip-right");
					element[i].classList.add("tooltip-left");
				}
				document.getElementById("toolTip_barhorizontalId"+options.id).style.left =  (d3.event.pageX) +10 + "px";
			}
			document.getElementById("toolTip_barhorizontalId"+options.id).style.borderRadius= options.toolTipBorder ? options.toolTipBorder : "" ;
			document.getElementById("toolTip_barhorizontalId"+options.id).style.background =  options.toolTipBackground ? options.toolTipBackground : "rgb(27, 39, 53)" ;
			document.getElementById("toolTip_barhorizontalId"+options.id).style.opacity =  options.toolTipOpacity ? options.toolTipOpacity : "" ;

			return document.getElementById("toolTip_barhorizontalId"+options.id).style.top = d3.event.pageY-20+ "px";

		})
		.on("mouseout", function (d) {
//            	if(options.id == '#priceEarningRatioBarChart'){
//            		d3.select(this).style("fill","#50c9e2");
//            	}else{
//            		d3.select(this).style("fill","#C39446");
//            	}
			 d3.select(this).style("opacity",1);
			 div.style("visibility", "hidden");
			div.style("display", "none");
		})
	// end add bars
	 // start add text
	 if(options.showBarData){
	 svg.selectAll(".text")
		.data(data)
	  .enter().append("text")
		.attr("class", "text")
		.style("fill",options.dataColor ? options.dataColor : "white" )
		.attr("x", d => x(d.x)+ x.bandwidth() / 4 )
		.attr("y", d => y(d.y)-5).text(d=> d.y)
	 }
	 // end add text


  function wrap(text, width) {
	text.each(function() {
	  var text = d3.select(this),
		  words = text.text().split(/\s+/).reverse(),
		  word,
		  line = [],
		  lineNumber = 0,
		  lineHeight = 1.1, // ems
		  y = text.attr("y"),
		  dy = parseFloat(text.attr("dy")),
		  tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em")
	  while (word = words.pop()) {
		line.push(word)
		tspan.text(line.join(" "))
		if (tspan.node().getComputedTextLength() > width) {
		  line.pop()
		  tspan.text(line.join(" "))
		  line = [word]
		  tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word)
		}
	  }
	})
  }
}
var verticalBarGraphModule = new verticalBarGraph();
export {
    verticalBarGraphModule
};
