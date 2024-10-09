import * as $ from 'jquery';

function TextcloudChart() { }

TextcloudChart.prototype.textcloudChart =function(barOptions,d3,cloud) {   
    if (barOptions.container) {
        $(barOptions.container).empty();
    }
    //--------------------------Initialize Values-----------------------------
    if (barOptions) {
        this.container = barOptions.container ? barOptions.container : "body"
        this.readFromFile = (barOptions.readFromFile !== undefined) ? barOptions.readFromFile : false
        this.dataFileLocation = (barOptions.readFromFile !== undefined || barOptions.readFromFile) ? barOptions.dataFileLocation : undefined;
        this.data = (barOptions.data) ? barOptions.data : []
         this.margin = barOptions.margin ? {
            top: barOptions.margin.top ? barOptions.margin.top : 20,
            right: barOptions.margin.right ? barOptions.margin.right : 20,
            bottom: barOptions.margin.bottom ? barOptions.margin.bottom : 30,
            left: barOptions.margin.left ? barOptions.margin.left : 40
        } : {top: 20, right: 20, bottom: 50, left: 50};
        this.height = barOptions.height ? barOptions.height : 600;
        this.width = barOptions.width ? barOptions.width : $(this.container).width() - 10;
        this.groupedStacked = barOptions.groupedStacked ? barOptions.groupedStacked : "grouped";
        this.randomIdString = Math.floor(Math.random() * 10000000000);
        barOptions.textClick=barOptions.textClick?barOptions.textClick:'true'


    } else {
        console.error('Map Chart Initialization Error : Bar Chart Params Not Defined');
        return false;
    }
    var randomSubstring = this.randomIdString;

    var margin = this.margin,
            width = this.width - margin.left - margin.right,
            height = this.height - margin.top - margin.bottom,
            barColor = this.barColor;
    if (height > width) {
        height = 3 * width / 4;
        this.height = 3 * this.width / 4;
    }
    this.data.sort(function(a,b){
		   return b.count-a.count;
	   })
	   this.data.splice(30);
    var textcloudData = this.data;
    var domainX = barOptions['domain'] ? barOptions['domain']['x'] : 10;
	var domainY = barOptions['domain'] ? barOptions['domain']['y'] : 5000;
	var sizeScale = d3.scaleLinear().domain([domainX,domainY]).range([12,35]);
	var domain = d3.extent(textcloudData,function(d){return d.size})
		var sizeScale = d3.scaleLinear().domain(domain).range([10,60]);
    //define svg
    var svg = d3.select(this.container)
            .append("svg")
            .attr('height', this.height)
            .attr('width', this.width)
            .attr('id', 'mainSvg-' + randomSubstring)
            .attr("class", "wordcloud")
            .append("g")
            .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");
//    .attr("transform", "translate(320,200)");
    cloud()
            .size([this.width, this.height])
            .words(textcloudData)
            .rotate(0)
            .fontSize(function (d) {
            	if(location.hash =="#!/alertDashboard"){
            	  return parseInt(sizeScale(d.amount));
            	}else {
                  return parseInt(sizeScale(d.size));
            	}
            })
            .on("end", draw)
            .start();


    function draw(words) {
         var clickText= svg.selectAll("g text")
                .data(words, function (d) {
                     return d.text;
                })

                //Entering words
                .enter()
                .append("text")
                .style("font-family",'"Roboto Regular"')
                .style("fill", function (d, i) {
                    return "#4192b7";
                })
                .style("font-size", function (d, i) {
                	if(location.hash =="#!/alertDashboard"){
                		return parseInt(sizeScale(d.amount))
                	}else {
                		return parseInt(sizeScale(d.size))
                	}
                })
               
                .attr("text-anchor", "middle")
//            .attr('font-size', 1)
                .attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function (d) {
                    return d.text;
                })
                if(barOptions.textClick=='true'){
	                clickText.on("click", function (d) {
							if (d.text == void 0)
							    return;
							if(window.location.href.split("/transactionIntelligence/#")[1]){
								window.open(window.location.href.split("/transactionIntelligence/#")[0] + "/entity/#!/company/" + d.text, '_blank');
							    
							}else
								window.open(window.location.href.split("/#/")[0] + "/entity/#!/company/" + d.text, '_blank');
				   }).style("cursor", "pointer");
	            }

    }
}

var textTagmodule = new TextcloudChart();
 
export{
    textTagmodule
 }