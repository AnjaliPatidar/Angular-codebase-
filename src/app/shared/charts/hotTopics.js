function cloudTag(barOptions) {
    	 if (barOptions.id) {
 	        $(barOptions.id).empty();
 	    }
 	    //--------------------------Initialize Values-----------------------------
 	    if (barOptions) {
 	        this.container = barOptions.id ? barOptions.id : "body"
 	        this.data = (barOptions.data) ? barOptions.data : []
 	         this.margin = barOptions.margin ? {
 	            top: barOptions.margin.top ? barOptions.margin.top : 20,
 	            right: barOptions.margin.right ? barOptions.margin.right : 20,
 	            bottom: barOptions.margin.bottom ? barOptions.margin.bottom : 30,
 	            left: barOptions.margin.left ? barOptions.margin.left : 40
 	        } : {top: 20, right: 20, bottom: 50, left: 50};
 	        this.height = barOptions.height ? barOptions.height : 600;
 	        this.width = barOptions.width ? barOptions.width : $(this.container).width() - 10;

 	        this.randomIdString = Math.floor(Math.random() * 10000000000);
 	        barOptions.textClick=barOptions.textClick?barOptions.textClick:'true'


 	    } else {
 	        console.error('cloud Chart Initialization Error : cloud Chart Params Not Defined');
 	        return false;
 	    }
 	    var randomSubstring = this.randomIdString;
 	   this.data.map(function(d){
 		   d.text = d.name;
 		   
 		   return d.size  = d.count
 	   })
 	   this.data.sort(function(a,b){
 		   return b.count-a.count;
 	   })
 	   this.data.splice(30);
 	    var margin = this.margin,
 	            width = this.width - margin.left - margin.right,
 	            height = this.height - margin.top - margin.bottom,
 	            barColor = this.barColor;
 	    if (height > width) {
 	        height = 3 * width / 4;
 	        this.height = 3 * this.width / 4;
 	    }
 	    //define tool tip
// 	    $(".world_map_tooltip").remove();
// 	    var tool_tip = $('body').append('<div class="world_map_tooltip" style="position: absolute; opacity: 1; pointer-events: none; visibility: hidden;"><span style=" font-size: 12px; position: absolute; white-space: nowrap;  margin-left: 0px; margin-top: 0px; left: 8px; top: 8px;"><span style="font-size:10px" class="tool_tip_x_val"></span><table><tbody><tr><td style="padding:0"> </td><td style="padding:0"><b>216.4 mm</b></td></tr><tr><td style="color:#434348;padding:0">New York: </td><td style="padding:0"><b>91.2 mm</b></td></tr><tr><td style="color:#90ed7d;padding:0">London: </td><td style="padding:0"><b>52.4 mm</b></td></tr><tr><td style="color:#f7a35c;padding:0">Berlin: </td><td style="padding:0"><b>47.6 mm</b></td></tr></tbody></table></span></div>');
 	    var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
// 	    var colorScale = d3.scaleThreshold()
// 	            .domain([10000, 100000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000, 500000000, 1500000000])
// 	            .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)", "rgb(33,113,181)", "rgb(8,81,156)", "rgb(8,48,107)", "rgb(3,19,43)"]);


 	    var textcloudData = this.data;
 	    var domainX = barOptions['domain'] ? barOptions['domain']['x'] : 0;
 		var domainY = barOptions['domain'] ? barOptions['domain']['y'] : 500;
 		var domain = d3.extent(textcloudData,function(d){return d.count})
 		var sizeScale = d3.scaleLinear().domain(domain).range([8,60]);

 	    //define svg
 	    var svg = d3.select(this.container)
 	            .append("svg")
 	            .attr('height', this.height)
 	            .attr('width', this.width)
 	            .attr('id', 'mainSvg-' + randomSubstring)
 	            .attr("class", "wordcloud")
 	            .append("g")
 	            .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");
// 	    .attr("transform", "translate(320,200)");
 	    d3.layout.cloud()
 	            .size([this.width, this.height])
 	            .words(textcloudData)
 	            .rotate(0)
// 	             .rotate(function() { return ~~(Math.random() * 2) * 90; })
 	            .font('monospace')
 	            .fontSize(function (d) {
 	            	
 	                  return parseInt(sizeScale(d.size));
 	            	
 	            })
// 	             .spiral("archimedean")
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
 	                	if(d.color){
 	                		return d.color;
 	                	}
 	                    return "#4192b7";
 	                })
 	                .style("font-size", function (d, i) {
 	                	
 	                		return parseInt(sizeScale(d.size))
 	                	
 	                })
 	               
 	                .attr("text-anchor", "middle")
// 	            .attr('font-size', 1)
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
//        var defualts = {
//             tag:"hottopictag",
//        	 ballSize: 200
//        };
//       
//        var opts = $.extend({}, defualts, options);
//        var tagEle = "querySelectorAll" in document ? document.querySelector("#"+options.id).querySelectorAll("."+opts.tag) : getClass(opts.tag),
//            paper = $(this)[0];
//            RADIUS = opts.ballSize,
//            fallLength = 300*50,
//            tags=[],
//            angleX = Math.PI/fallLength,
//            angleY = Math.PI/fallLength,
//            CX = paper.offsetWidth/2,
//            CY = paper.offsetHeight/2,
//            EX = paper.offsetLeft + document.body.scrollLeft + document.documentElement.scrollLeft,
//            EY = paper.offsetTop + document.body.scrollTop + document.documentElement.scrollTop;
//
//        function getClass(className){
//            var ele = document.getElementsByTagName("*");
//            var classEle = [];
//            for(var i=0;i<ele.length;i++){
//                var cn = ele[i].className;
//                if(cn === className){
//                    classEle.push(ele[i]);
//                }
//            }
//            return classEle;
//        }
//
//        function innit(){
//            for(var i=0;i<tagEle.length;i++){
//                var a , b;
//                var k = (2*(i+1)-1)/tagEle.length - 1;
//                var a = Math.acos(k);
//                var b = a*Math.sqrt(tagEle.length*Math.PI);
//                // var a = Math.random()*2*Math.PI;
//                // var b = Math.random()*2*Math.PI;
//                var x = RADIUS * Math.sin(a) * Math.cos(b);
//                var y = RADIUS * Math.sin(a) * Math.sin(b);
//                var z = RADIUS * Math.cos(a);
//                var t = new tag(tagEle[i] , x , y , z);
//               //tagEle[i].style.color = "rgb("+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+")";
//                tags.push(t);
//                t.move();
//            }
//        }
//
////        Array.prototype.forEach = function(callback){
////            for(var i=0;i<this.length;i++){
////                callback.call(this[i]);
////            }
////        }
//
//        function animate(){
//            setInterval(function(){
//                rotateX();
//                rotateY();
//                for(var i=0;i<tags.length;i++){
//                	tags[i].move();
//                }
////                tags.forEach(function(){
////                    this.move();
////                })
//            } , 200)
//        }
//
//        if("addEventListener" in window){
//            paper.addEventListener("mousemove" , function(event){
//                var x = event.clientX - EX - CX;
//                var y = event.clientY - EY - CY;
//                // angleY = -x* (Math.sqrt(Math.pow(x , 2) + Math.pow(y , 2)) > RADIUS/4 ? 0.0002 : 0.0001);
//                // angleX = -y* (Math.sqrt(Math.pow(x , 2) + Math.pow(y , 2)) > RADIUS/4 ? 0.0002 : 0.0001);
//                angleY = x*0.0001;
//                angleX = y*0.0001;
//            });
//        }
//        else {
//            paper.attachEvent("onmousemove" , function(event){
//                var x = event.clientX - EX - CX;
//                var y = event.clientY - EY - CY;
//                angleY = x*0.0001;
//                angleX = y*0.0001;
//            });
//        }
//
//        function rotateX(){
//            var cos = Math.cos(angleX);
//            var sin = Math.sin(angleX);
//            for(var i=0;i<tags.length;i++){
//            	var _this = tags[i];
//            	var y1 = _this.y * cos - _this.z * sin;
//                  var z1 = _this.z * cos + _this.y * sin;
//                  _this.y = y1;
//                  _this.z = z1;
//            }
////            tags.forEach(function(){
////                var y1 = this.y * cos - this.z * sin;
////                var z1 = this.z * cos + this.y * sin;
////                this.y = y1;
////                this.z = z1;
////            })
//
//        }
//
//        function rotateY(){
//            var cos = Math.cos(angleY);
//            var sin = Math.sin(angleY);
//            for(var i=0;i<tags.length;i++){
//            	var _this = tags[i];
//            	  var x1 = _this.x * cos - _this.z * sin;
//                  var z1 = _this.z * cos + _this.x * sin;
//                  _this.x = x1;
//                  _this.z = z1;
//            }
////            tags.forEach(function(){
////                var x1 = this.x * cos - this.z * sin;
////                var z1 = this.z * cos + this.x * sin;
////                this.x = x1;
////                this.z = z1;
////            })
//        }
//
//        var tag = function(ele , x , y , z){
//            this.ele = ele;
//            this.x = x;
//            this.y = y;
//            this.z = z;
//        }
//
//        tag.prototype = {
//            move:function(){
//                var scale = fallLength/(fallLength-this.z);
//                var alpha = (this.z+RADIUS)/(2*RADIUS);
//                this.ele.style.fontSize = 15 * scale + "px";
//                this.ele.style.fontWeight= 'normal';
//                this.ele.style.opacity = alpha + 0.5;
//                this.ele.style.filter = "alpha(opacity = "+(alpha+0.5)*100+")";
//                this.ele.style.zIndex = parseInt(scale*100);
//                this.ele.style.left = this.x + CX - this.ele.offsetWidth/2 +"px";
//                this.ele.style.top = this.y + CY - this.ele.offsetHeight/2 +"px";
//            }
//        }
//        innit();
//        animate();
    }
