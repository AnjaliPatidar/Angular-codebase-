/* Pie chart constant values */
const PieChartConst = {
		dy: ".35em",
		colors: ['#1F77B4', '#FF7F0E', "#E61874", "#1DBF6A", "#9467bd", "#d62728", "#b65663"]
}
var PietooltipdivDiscover = d3.select("body").append("div").attr("class", "toolTip_piehorizontal").style("text-transform", "uppercase").style("position", "absolute").style("z-index", 1000).style("background","rgb(27, 39, 53)").style("padding","5px 10px").style("border-radius","10px").style("font-size","10px").style("display","none");

function pieChart(pieOptions) {
    if (pieOptions.container) {
        $(pieOptions.container).empty();
    }
    /*--------------------------Initialize Values-----------------------------*/
    if (pieOptions) {
        this.container = pieOptions.container ? pieOptions.container : "body"

        this.readFromFile = (pieOptions.readFromFile !== undefined) ? pieOptions.readFromFile : false
        this.dataFileLocation = (pieOptions.readFromFile !== undefined || pieOptions.readFromFile) ? pieOptions.dataFileLocation : undefined;
        this.data = (pieOptions.data) ? pieOptions.data : []

        this.radius = pieOptions.radius ? {
            innerRadius: pieOptions.radius.innerRadius ? pieOptions.radius.innerRadius : 0,
            outerRadius: pieOptions.radius.outerRadius ? pieOptions.radius.outerRadius : 100
        } : {innerRadius: 0, outerRadius: 100};
        this.height = pieOptions.height ? pieOptions.height : 600;

        this.pieChartHeader = pieOptions.header ? pieOptions.header : "DONUT CHART";
        this.randomIdString = Math.floor(Math.random() * 10000000000);
        this.maxLlegendHeight= pieOptions.maxLlegendHeight ? pieOptions.maxLlegendHeight :false;
        this.showtext= pieOptions.showtext==false ? false :true;
        this.txt = pieOptions.txt?pieOptions.txt:false;

    } else {
        return false;
    }
    var actualOptions = jQuery.extend(true, {}, pieOptions);
    var containerid  = this.container;
    var randomSubstring = this.randomIdString;
    /* var chartContainerdiv = '<div class="chartContainer"  align="center" style="width: 80%; margin: auto; margin-top: 30px; font-size: 14px;font-family: roboto-regular;"> <div class="graphBox" style="margin: auto; background-color: #374c59; width: 100%;left: 0px;top: 0px;overflow: hidden;position: relative;"> <div class="headerDiv" style="font-weight:bold;background-color: #425661;text-align: left;color: #239185; border-bottom: 1px solid rgba(192, 192, 192, 0.47);width: 100%; line-height: 2.5;font-size: 16px ;padding-left: 5px;">' + pieOptions.header + '</div><div id="pie_chart_div' + randomSubstring + '" class="chartContentDiv" style="width: 100%;"></div> </div></div>' */
    var chartContainerdiv = '<div id="pie_chart_div' + randomSubstring + '" class="" style="width: 100%;"></div>'
    $(this.container).html(chartContainerdiv);
    var chart_container = "#pie_chart_div" + randomSubstring;
   var _this =this;
if ($(chart_container).siblings(".headerDiv").find(".bstheme_menu_button").length == 0)
        var header_options = '<div style="float: right; padding: 0 10px; cursor: pointer;" class="bstheme_menu_button bstheme_menu_button_' + randomSubstring + '" data-toggle="collapse" data-target="#opt_' + randomSubstring + '"><i class="fa fa-ellipsis-v" aria-hidden="true"></i><div class="bstheme_options" style="position:absolute;right:10px;z-index:2000"> <div style="display:none;" id="opt_' + randomSubstring + '" class="collapse"><span class="header_refresh_' + randomSubstring + '"><i class="fa fa-refresh" aria-hidden="true"></i></span> <span class="header_table_' + randomSubstring + '"> <i class="fa fa-table" aria-hidden="true"></i></span> <span class="header_chart_' + randomSubstring + '" style="display:none" ><i class="fa fa-bar-chart" aria-hidden="true"></i></span></div></div> </div>';
    $(chart_container).siblings(".headerDiv").append(header_options);
    var data = this.data;
    
    var todayDate = new Date();
    todayDate = todayDate.getDate() +'/'+(todayDate.getMonth()+1)+'/'+ todayDate.getFullYear();
    
    /* APPEND legend header */
    $(chart_container).append("<div id='streamContainer-" + (randomSubstring) + "' style ='float:left;width:50%'></div>")
    $(chart_container).append("<div class='pielegendContainer' style ='text-align: left;float:right;width:50%' id='legendContainer-" + (randomSubstring) + "'><h4 class='text-grey'>CASE STATUSES AS ON TODAY ("+ todayDate +")</h4></div>")

    var colorScale = d3.scaleOrdinal(PieChartConst.colors);
    this.width = pieOptions.width ? pieOptions.width : $(chart_container).width() - 10;
    var width = this.width - this.width / 2,
            height = this.height;
    if (height > width) {
        height = width;
    }
    /* define scales */
    var radius = Math.min(width, height) / 2;
    if(this.maxLlegendHeight){
    	$(chart_container).find('#legendContainer-' + (randomSubstring)).css({"max-height":(radius),"overflow-x":"hidden","overflow-y":"auto"})
    }
    /* define main group */
    var arc = d3.arc()
            .outerRadius(radius - 20)
            .innerRadius(radius - radius / 2);

    var labelArc = d3.arc()
            .outerRadius(radius - 40)
            .innerRadius(radius - 40);

    var pie = d3.pie()
            .sort(null)
            .value(function (d) {
                return d.value;  
            });
    var svg = d3.select('#streamContainer-' + (randomSubstring)).append("svg").attr('id', 'mainSvg-' + randomSubstring)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + ((height / 2) - 20) + ")");
    if(_this.txt){
    	svg.append("text").attr("y",6).text(_this.txt).style('text-anchor',"middle").style("fill","silver").style("stroke","none")
    }
    var g = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

    g.append("path")
            .attr("d", arc)
            .style("fill", function (d) {            
                return colorScale(d.data.key);
            })  .on("mouseover", function (d) {
            	PietooltipdivDiscover.style("visibility", "visible");
            	PietooltipdivDiscover.style("display", "inline-block");
            	PietooltipdivDiscover.html(d.data.key + ":" + (d.actualValue?d.actualValue:d.value));
            })
            .on("mousemove", function (d) {
            	PietooltipdivDiscover.style("left", d3.event.pageX + 10 + "px");
            	PietooltipdivDiscover.style("top", d3.event.pageY - 25 + "px");

            })
            .on("mouseout", function (d) {
            	PietooltipdivDiscover.style("visibility", "hidden");
            	PietooltipdivDiscover.style("display", "none");
            });
   
    g.append("text")
            .attr("transform", function (d) {
                return "translate(" + arc.centroid(d) + ")";
            })
            .attr("dy", PieChartConst.dy)
            .text(function (d) {
if(_this.showtext)
                return d.data.value;

            }).style("font-size", function () {
        if (width < 300) {
            return "10px";
        }
    })
    var pieLegendArray = [];
    $.each(data, function (i, d) {
        pieLegendArray.push(d.key);
    });
    renderPieLegend(pieLegendArray);
    /**
     * Function to render Pie chart legends
     * @param {array} data
     * 
     */
    function renderPieLegend(data) {
        $.each(data, function (i, d) {
            $("#legendContainer-" + (randomSubstring)).append('<div class="pieLegendDiv" style = "color: #60717C"," font-size: 10px" ><div class="bar_legend_circles" style="background-color:' + colorScale(d) + ';height: 10px;width: 10px;border-radius: 6px;display: inline-block;vertical-align: middle;"></div><span style="padding:0px !important;margin:0 2px;vertical-align: middle;">' + d + '</span></div>')
        });
    }
    /**
     * Function to handle show hide of header options
     */
    $("body").on("click", ".bstheme_menu_button_" + randomSubstring, function () {
        var id = ($(this).attr("data-target"));
        if ($(id).css("display") == "none") {
            $(id).css("display", "inline-block");
        } else {
            $(id).css("display", "none");
        }
    });
    /**
     * Function to handle show hide of header options
     */
    $("body").on("click", ".header_refresh_" + randomSubstring, function () {
        var chartId = $(this).parent().parent().parent().parent().siblings("div").attr("id");
        if ("#" + chartId == chart_container) {
            $(containerid).empty();
            ChartPie(actualOptions);
        }
    });
    /**
     * Function to handle show hide of header options
     */
    $("body").on("click", ".header_table_" + randomSubstring, function () {
        var hi = $(chart_container).parent().height();
       var he = $(chartContainerdiv).height();
        var h = height-100;
        $(chart_container).empty();
        $(this).css("display", "none");
        
/*  var chartContainerdiv = '<div class="chartContainer"  align="center" style="width: 80%; margin: auto; margin-top: 30px; font-size: 14px;font-family: roboto-regular;"> <div class="graphBox" style="margin: auto; background-color: #374c59; width: 100%;left: 0px;top: 0px;overflow: hidden;position: relative;"> <div class="headerDiv" style="font-weight:bold;background-color: #425661;text-align: left;color: #239185; border-bottom: 1px solid rgba(192, 192, 192, 0.47);width: 100%; line-height: 2.5;font-size: 16px ;padding-left: 5px;">' + pieOptions.header + '</div><div id="pie_chart_div' + randomSubstring + '" class="chartContentDiv" style="width: 100%;"></div> </div></div>'
         $(this.container).html(chartContainerdiv); */
        
        $(".header_chart_" + randomSubstring).css("display", "inline-block");
        var tbl = "<div id ='pieChart_table_"+ randomSubstring + "' style='width:100%;padding:5px;font-size: 14px !important;background-color:#283C45'><table class='table-striped' class='table table-condensed' style='width:100%;background-color:#283C45;padding:5px;color:#5A676E;height:"+h+"px;max-height: "+h+"px;min-height: "+h+"px'><thead><tr><th>Name</th><th>Value</th></tr></thead><tbody>";
       
            $.each(data, function (i, v) {
                tbl = tbl + ("<tr><td>" + (v.key.toUpperCase()) + "</td><td>" + v.value + "</td></tr>");
            })
            tbl = tbl + "</tbody></table></div>";        
        $(chart_container).append(tbl);
         $(".table-striped").DataTable({ "bLengthChange": false,"fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
    if (iDisplayIndex % 2 == 1) {
        $('td', nRow).css('background-color', '#32464F');
    } else {
        $('td', nRow).css('background-color', '#283C45');
    }
} });
         
      $("#pieChart_table_"+randomSubstring+" tr:even").css("background-color","#32464F");
      $("#pieChart_table_"+randomSubstring+" tr:odd").css("background-color","#283C45");
      $("#pieChart_table_"+randomSubstring+" tr:first").css("background-color","#0CB29A");
      
      var id1 = $("#pieChart_table_"+randomSubstring).children('div').find('div').eq(0);
      var id2 = $("#pieChart_table_"+randomSubstring).children('div').find('div').eq(1);
      var id3 = $("#pieChart_table_"+randomSubstring).children('div').find('div').eq(2);
      var id1attr=id1.attr("id");
      var id2attr=id2.attr("id");
      var id3attr=id3.attr("id");
      
  		$("#"+id1attr+" "+ "label").css("color","#666666")
  		$("#"+id2attr+" "+ "label").css("color","#666666")
  		$("#"+id3attr).css("color","#666666")
       
       $(" .dataTables_filter input").css({"margin-left": "0.5em",  "position": "relative","border": "0", "min-width": "240px",
		    "background": "transparent",
		    "border-bottom": "1px solid #666666",
		    "border-radius":" 0",
		    "padding":" 5px 25px",
		    "color": "#ccc",
		    "height":" 30px",
		    "-webkit-box-shadow":" none",
		    "box-shadow":" none"
       	})
    });
    /**
     * Function to handle show hide of header options
     */
    $("body").on("click", ".header_chart_" + randomSubstring, function () {
        var chartId = $(this).parent().parent().parent().parent().siblings("div").attr("id");
        if ("#" + chartId == chart_container) {
            $(this).css("display", "none");
            $(".header_table_" + randomSubstring).css("display", "inline-block");
            $(containerid).empty();
            new pieChart(actualOptions);
        }
    });
}


