var vlaData={};
_ALLVLA = [];
var customerLevelsforLeadGen={
		"Customer":400,
		"Card":300,
		"Merchant":1,
		"MerchantType":200
}
//window.vlaId="#vla";
window.imgPath ="scripts/VLA/";
var format = d3.format(",d");
var vis = (function () {
	 var stateKey, eventKey, keys = {
	 hidden: "visibilitychange",
	 webkitHidden: "webkitvisibilitychange",
	 mozHidden: "mozvisibilitychange",
	 msHidden: "msvisibilitychange"
	 };
	 for (stateKey in keys) {
	 if (stateKey in document) {
	 eventKey = keys[stateKey];
	 break;
	 }
	 }
	 return function (c) {
	 if (c)
	 document.addEventListener(eventKey, c);
	 return !document[stateKey];
	 }
	})();
	vis(function () {
	 var currentState = vis() ? 'Visible' : 'Not visible';
	 if (currentState == "Not visible") {
	 } else {
		 if(_ALLVLA.length > 0){
				for(var i=0; i<_ALLVLA.length; i++){
					_cy_ = _ALLVLA[i];
					_cy_.layout({
				        name:  window.global.page == "customerPage"?'concentric':'cola',
				        nodeSpacing: 50,
				        edgeLengthVal: 45,
				        animate: true,
				        randomize: false,
				        maxSimulationTime: 1500,
				        concentric:function(node){
				        	if(window.global.page == "customerPage"){
	                    		return customerLevelsforLeadGen[node.data().labelV]?customerLevelsforLeadGen[node.data().labelV]:1;
	                    	}
				        	return 1;
				        }
				    });
				}
			}
	 }
	});

CurentVLAIDs = [];
function PlotVLA(vla_options){
	var CurentVLAID  = "#"+vla_options.target_html_element;
	window.CurentVLAIDs.push(CurentVLAID);
	window.layout = vla_options.layout;
function handleRiskScore(data){
	var scale =d3.scaleLinear().domain([0,100]).range([1,10]);
	 if(location.hash.indexOf('dualCardHolderDetails') >= 0){
		 var expenditureDomain = d3.extent(data.vertices,function(d){if(d.avgExp)return parseFloat(d.avgExp)});
	 }
	data.vertices.map(function(d){
		 if (window.global.page && window.global.page == "tI") {
			 d.start =d.date?d.date:d.addedOnDate;
			 if(d.location && d.location.risk && d.location.risk.score && !d.isScaledRisk){
				 d.isScaledRisk= true
				 return d.riskScore = scale(d.location.risk.score);
			 }else{
				 if(!d.isScaledRisk){
					 d.isScaledRisk= true
					 return d.riskScore = d.riskScore?scale(d.riskScore) :scale(0);
				 }
			 }			
		 }else{
			 if(location.hash.indexOf('dualCardHolderDetails') >= 0){
				 var colorScale = d3.scaleLinear().domain(expenditureDomain).range(["#768A93","#e80202"]);
                 	if(d.avgExp){
                 		d.evt_color  =  colorScale(parseFloat(d.avgExp));
			 		}
     		}
			 if(!d.isScaledRisk){
				 d.isScaledRisk= true
				 return d.riskScore = scale((d.riskScore?d.riskScore:0));
			 }
		 }
	});
	return data;
}
function getCustomerPageData(resp){
	if(resp.data != undefined){
		return resp.data
	}else{
		return resp
	}
}
var riskScale =d3.scaleLinear().domain([0,100]).range([1,10]);
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/**
 * @Чулан https://habrahabr.ru/sandbox/47210/
 */
/*
 //попробуем получить строку которой нету в словаре
 _('test'); //test
 _('two words'); //two words
 //регистрируем словарь
 _.registerLocale('ru', {
 'test': 'Тест',
 'two words': 'Два слова',
 });
 //попробуем снова
 _('test'); //Тест
 _('two words'); //Два слова
 */
var VLA;
(function (VLA) {
	CurentVLAID  =CurentVLAID;
    var locale_debug = true; // show missing translations in console as error
    var _data = {};
    var _defaultLocale = 'en_US';
    function is_rtl(locale) {
        locale = locale || _defaultLocale;
        if (_data.hasOwnProperty(locale) && typeof _data[locale] == 'object') {
            return _data[locale].rtl;
        } else if (locale_debug && locale != 'en_US') {
//            console.error("Locale is not registered:", locale);
        }
        return false;
    }
    VLA.is_rtl = is_rtl;
    function setLocale(locale) {
        _defaultLocale = locale;
    }
    VLA.setLocale = setLocale;
    function _(str, locale) {
        locale = locale || _defaultLocale;
        if (_data.hasOwnProperty(locale) && typeof _data[locale] == 'object') {
            if (_data[locale].text.hasOwnProperty(str)) {
                return _data[locale].text[str];
            } else if (locale_debug && locale != 'en_US') {
//                console.error("[" + locale + "]Translation is missing for", str);
            }
        } else if (locale_debug && locale != 'en_US') {
//            console.error("Locale is not registered:", locale);
        }
        return str;
    }
    VLA._ = _;
    function _registerLocale(locale, data, rtl) {
        if (rtl === void 0) {
            rtl = false;
        }
        if (!_data.hasOwnProperty(locale)) {
            _data[locale] = {rtl: rtl, text: {}};
        }
        for (var str in data) {
            if (data.hasOwnProperty(str)) {
                _data[locale].text[str] = data[str];
            }
        }
    }
    VLA._registerLocale = _registerLocale;
})(VLA || (VLA = {}));
var VLA;
(function (VLA) {
    var UI;
    (function (UI) {
        UI.icons_set = {
            "no-icon": "",
            "glass": "",
            "music": "",
            "search": "",
            "envelope-o": "",
            "heart": "",
            "star": "",
            "star-o": "",
            "user": "",
            "film": "",
            "th-large": "",
            "th": "",
            "th-list": "",
            "check": "",
            "search-plus": "",
            "search-minus": "",
            "power-off": "",
            "signal": "",
            "trash-o": "",
            "home": "",
            "file-o": "",
            "clock-o": "",
            "road": "",
            "download": "",
            "arrow-circle-o-down": "",
            "arrow-circle-o-up": "",
            "inbox": "",
            "play-circle-o": "",
            "refresh": "",
            "list-alt": "",
            "lock": "",
            "flag": "",
            "headphones": "",
            "volume-off": "",
            "volume-down": "",
            "volume-up": "",
            "qrcode": "",
            "barcode": "",
            "tag": "",
            "tags": "",
            "book": "",
            "bookmark": "",
            "print": "",
            "camera": "",
            "font": "",
            "bold": "",
            "italic": "",
            "text-height": "",
            "text-width": "",
            "align-left": "",
            "align-center": "",
            "align-right": "",
            "align-justify": "",
            "list": "",
            "indent": "",
            "video-camera": "",
            "pencil": "",
            "map-marker": "",
            "adjust": "",
            "tint": "",
            "share-square-o": "",
            "check-square-o": "",
            "arrows": "",
            "step-backward": "",
            "fast-backward": "",
            "backward": "",
            "play": "",
            "pause": "",
            "stop": "",
            "forward": "",
            "fast-forward": "",
            "step-forward": "",
            "eject": "",
            "chevron-left": "",
            "chevron-right": "",
            "plus-circle": "",
            "minus-circle": "",
            "times-circle": "",
            "check-circle": "",
            "question-circle": "",
            "info-circle": "",
            "crosshairs": "",
            "times-circle-o": "",
            "check-circle-o": "",
            "ban": "",
            "arrow-left": "",
            "arrow-right": "",
            "arrow-up": "",
            "arrow-down": "",
            "expand": "",
            "compress": "",
            "plus": "",
            "minus": "",
            "asterisk": "",
            "exclamation-circle": "",
            "gift": "",
            "leaf": "",
            "fire": "",
            "eye": "",
            "eye-slash": "",
            "plane": "",
            "calendar": "",
            "random": "",
            "comment": "",
            "magnet": "",
            "chevron-up": "",
            "chevron-down": "",
            "retweet": "",
            "shopping-cart": "",
            "folder": "",
            "folder-open": "",
            "arrows-v": "",
            "arrows-h": "",
            "twitter-square": "",
            "facebook-square": "",
            "camera-retro": "",
            "key": "",
            "comments": "",
            "thumbs-o-up": "",
            "thumbs-o-down": "",
            "star-half": "",
            "heart-o": "",
            "sign-out": "",
            "linkedin-square": "",
            "thumb-tack": "",
            "external-link": "",
            "sign-in": "",
            "trophy": "",
            "github-square": "",
            "upload": "",
            "lemon-o": "",
            "phone": "",
            "square-o": "",
            "bookmark-o": "",
            "phone-square": "",
            "twitter": "",
            "github": "",
            "unlock": "",
            "credit-card": "",
            "hdd-o": "",
            "bullhorn": "",
            "bell": "",
            "certificate": "",
            "hand-o-right": "",
            "hand-o-left": "",
            "hand-o-up": "",
            "hand-o-down": "",
            "arrow-circle-left": "",
            "arrow-circle-right": "",
            "arrow-circle-up": "",
            "arrow-circle-down": "",
            "globe": "",
            "wrench": "",
            "tasks": "",
            "filter": "",
            "briefcase": "",
            "arrows-alt": "",
            "cloud": "",
            "flask": "",
            "paperclip": "",
            "square": "",
            "list-ul": "",
            "list-ol": "",
            "strikethrough": "",
            "underline": "",
            "table": "",
            "magic": "",
            "truck": "",
            "pinterest": "",
            "pinterest-square": "",
            "google-plus-square": "",
            "google-plus": "",
            "money": "",
            "caret-down": "",
            "caret-up": "",
            "caret-left": "",
            "caret-right": "",
            "columns": "",
            "envelope": "",
            "linkedin": "",
            "comment-o": "",
            "comments-o": "",
            "sitemap": "",
            "umbrella": "",
            "lightbulb-o": "",
            "exchange": "",
            "cloud-download": "",
            "cloud-upload": "",
            "user-md": "",
            "stethoscope": "",
            "suitcase": "",
            "bell-o": "",
            "coffee": "",
            "cutlery": "",
            "file-text-o": "",
            "building-o": "",
            "hospital-o": "",
            "ambulance": "",
            "medkit": "",
            "fighter-jet": "",
            "beer": "",
            "h-square": "",
            "plus-square": "",
            "angle-double-left": "",
            "angle-double-right": "",
            "angle-double-up": "",
            "angle-double-down": "",
            "angle-left": "",
            "angle-right": "",
            "angle-up": "",
            "angle-down": "",
            "desktop": "",
            "laptop": "",
            "tablet": "",
            "circle-o": "",
            "quote-left": "",
            "quote-right": "",
            "spinner": "",
            "circle": "",
            "github-alt": "",
            "folder-o": "",
            "folder-open-o": "",
            "smile-o": "",
            "frown-o": "",
            "meh-o": "",
            "gamepad": "",
            "keyboard-o": "",
            "flag-o": "",
            "flag-checkered": "",
            "terminal": "",
            "code": "",
            "location-arrow": "",
            "crop": "",
            "code-fork": "",
            "question": "",
            "info": "",
            "exclamation": "",
            "superscript": "",
            "subscript": "",
            "eraser": "",
            "puzzle-piece": "",
            "microphone": "",
            "microphone-slash": "",
            "shield": "",
            "calendar-o": "",
            "fire-extinguisher": "",
            "rocket": "",
            "maxcdn": "",
            "chevron-circle-left": "",
            "chevron-circle-right": "",
            "chevron-circle-up": "",
            "chevron-circle-down": "",
            "html5": "",
            "css3": "",
            "anchor": "",
            "unlock-alt": "",
            "bullseye": "",
            "ellipsis-h": "",
            "ellipsis-v": "",
            "rss-square": "",
            "play-circle": "",
            "ticket": "",
            "minus-square": "",
            "minus-square-o": "",
            "level-up": "",
            "level-down": "",
            "check-square": "",
            "pencil-square": "",
            "external-link-square": "",
            "share-square": "",
            "compass": "",
            "gbp": "",
            "file": "",
            "file-text": "",
            "sort-alpha-asc": "",
            "sort-alpha-desc": "",
            "sort-amount-asc": "",
            "sort-amount-desc": "",
            "sort-numeric-asc": "",
            "sort-numeric-desc": "",
            "thumbs-up": "",
            "thumbs-down": "",
            "youtube-square": "",
            "youtube": "",
            "xing": "",
            "xing-square": "",
            "youtube-play": "",
            "dropbox": "",
            "stack-overflow": "",
            "instagram": "",
            "flickr": "",
            "adn": "",
            "bitbucket": "",
            "bitbucket-square": "",
            "tumblr": "",
            "tumblr-square": "",
            "long-arrow-down": "",
            "long-arrow-up": "",
            "long-arrow-left": "",
            "long-arrow-right": "",
            "apple": "",
            "windows": "",
            "android": "",
            "linux": "",
            "dribbble": "",
            "skype": "",
            "foursquare": "",
            "trello": "",
            "female": "",
            "male": "",
            "sun-o": "",
            "moon-o": "",
            "archive": "",
            "bug": "",
            "vk": "",
            "weibo": "",
            "renren": "",
            "pagelines": "",
            "stack-exchange": "",
            "arrow-circle-o-right": "",
            "arrow-circle-o-left": "",
            "dot-circle-o": "",
            "wheelchair": "",
            "vimeo-square": "",
            "plus-square-o": "",
            "space-shuttle": "",
            "slack": "",
            "envelope-square": "",
            "wordpress": "",
            "openid": "",
            "yahoo": "",
            "google": "",
            "reddit": "",
            "reddit-square": "",
            "stumbleupon-circle": "",
            "stumbleupon": "",
            "delicious": "",
            "digg": "",
            "pied-piper-pp": "",
            "pied-piper-alt": "",
            "drupal": "",
            "joomla": "",
            "language": "",
            "fax": "",
            "building": "",
            "child": "",
            "paw": "",
            "spoon": "",
            "cube": "",
            "cubes": "",
            "behance": "",
            "behance-square": "",
            "steam": "",
            "steam-square": "",
            "recycle": "",
            "tree": "",
            "spotify": "",
            "deviantart": "",
            "soundcloud": "",
            "database": "",
            "file-pdf-o": "",
            "file-word-o": "",
            "file-excel-o": "",
            "file-powerpoint-o": "",
            "file-code-o": "",
            "vine": "",
            "codepen": "",
            "jsfiddle": "",
            "circle-o-notch": "",
            "git-square": "",
            "git": "",
            "tencent-weibo": "",
            "qq": "",
            "history": "",
            "circle-thin": "",
            "header": "",
            "paragraph": "",
            "sliders": "",
            "share-alt": "",
            "share-alt-square": "",
            "bomb": "",
            "tty": "",
            "binoculars": "",
            "plug": "",
            "slideshare": "",
            "twitch": "",
            "yelp": "",
            "newspaper-o": "",
            "wifi": "",
            "calculator": "",
            "paypal": "",
            "google-wallet": "",
            "cc-visa": "",
            "cc-mastercard": "",
            "cc-discover": "",
            "cc-amex": "",
            "cc-paypal": "",
            "cc-stripe": "",
            "bell-slash": "",
            "bell-slash-o": "",
            "trash": "",
            "copyright": "",
            "at": "",
            "eyedropper": "",
            "paint-brush": "",
            "birthday-cake": "",
            "area-chart": "",
            "pie-chart": "",
            "line-chart": "",
            "lastfm": "",
            "lastfm-square": "",
            "toggle-off": "",
            "toggle-on": "",
            "bicycle": "",
            "bus": "",
            "ioxhost": "",
            "angellist": "",
            "cc": "",
            "meanpath": "",
            "buysellads": "",
            "connectdevelop": "",
            "dashcube": "",
            "forumbee": "",
            "leanpub": "",
            "sellsy": "",
            "shirtsinbulk": "",
            "simplybuilt": "",
            "skyatlas": "",
            "cart-plus": "",
            "cart-arrow-down": "",
            "diamond": "",
            "ship": "",
            "user-secret": "",
            "motorcycle": "",
            "street-view": "",
            "heartbeat": "",
            "venus": "",
            "mars": "",
            "mercury": "",
            "transgender-alt": "",
            "venus-double": "",
            "mars-double": "",
            "venus-mars": "",
            "mars-stroke": "",
            "mars-stroke-v": "",
            "mars-stroke-h": "",
            "neuter": "",
            "genderless": "",
            "facebook-official": "",
            "pinterest-p": "",
            "whatsapp": "",
            "server": "",
            "user-plus": "",
            "user-times": "",
            "viacoin": "",
            "train": "",
            "subway": "",
            "medium": "",
            "optin-monster": "",
            "opencart": "",
            "expeditedssl": "",
            "mouse-pointer": "",
            "i-cursor": "",
            "object-group": "",
            "object-ungroup": "",
            "sticky-note": "",
            "sticky-note-o": "",
            "cc-jcb": "",
            "cc-diners-club": "",
            "clone": "",
            "balance-scale": "",
            "hourglass-o": "",
            "hourglass": "",
            "hand-scissors-o": "",
            "hand-lizard-o": "",
            "hand-spock-o": "",
            "hand-pointer-o": "",
            "hand-peace-o": "",
            "trademark": "",
            "registered": "",
            "creative-commons": "",
            "gg": "",
            "gg-circle": "",
            "tripadvisor": "",
            "odnoklassniki": "",
            "odnoklassniki-square": "",
            "get-pocket": "",
            "wikipedia-w": "",
            "safari": "",
            "chrome": "",
            "firefox": "",
            "opera": "",
            "internet-explorer": "",
            "contao": "",
            "500px": "",
            "amazon": "",
            "calendar-plus-o": "",
            "calendar-minus-o": "",
            "calendar-times-o": "",
            "calendar-check-o": "",
            "industry": "",
            "map-pin": "",
            "map-signs": "",
            "map-o": "",
            "map": "",
            "commenting": "",
            "commenting-o": "",
            "houzz": "",
            "vimeo": "",
            "black-tie": "",
            "fonticons": "",
            "reddit-alien": "",
            "edge": "",
            "credit-card-alt": "",
            "codiepie": "",
            "modx": "",
            "fort-awesome": "",
            "usb": "",
            "product-hunt": "",
            "mixcloud": "",
            "scribd": "",
            "pause-circle": "",
            "pause-circle-o": "",
            "stop-circle": "",
            "stop-circle-o": "",
            "shopping-bag": "",
            "shopping-basket": "",
            "hashtag": "",
            "bluetooth": "",
            "bluetooth-b": "",
            "percent": "",
            "gitlab": "",
            "wpbeginner": "",
            "wpforms": "",
            "envira": "",
            "universal-access": "",
            "wheelchair-alt": "",
            "question-circle-o": "",
            "blind": "",
            "audio-description": "",
            "volume-control-phone": "",
            "braille": "",
            "assistive-listening-systems": "",
            "glide": "",
            "glide-g": "",
            "low-vision": "",
            "viadeo": "",
            "viadeo-square": "",
            "snapchat": "",
            "snapchat-ghost": "",
            "snapchat-square": "",
            "pied-piper": "",
            "first-order": "",
            "yoast": "",
            "themeisle": ""
        };
    })(UI = VLA.UI || (VLA.UI = {}));
})(VLA || (VLA = {}));
/// <reference path="libs/jquery.d.ts" />
/// <reference path="libs/cytoscape.d.ts" />
/// <reference path="ui_icons.ts" />
/// <reference path="libs/gexf.d.ts"/>
/// <reference path="libs/moment.d.ts" />
var VLA;
(function (VLA) {
    var UI;
    (function (UI) {
        var Graph = (function () {
            Graph.default_background_color = "#768A93";
            var lastHighlighted = null;
            var lastUnhighlighted = null;
            var layoutPadding = 80;
            var aniDur = 500;
            var easing = 'linear';
            function Graph(target_div, options) {
                this.layout_name = 'preset';
                this.basic_styles = {
                    "node": {

                        "width": function (e) {
                        	return 80;
                            

                        },
                        "height": function (e) {
                        	return 80;                            
                        },
                        "background-color": function (n) {
                        	if((window.global.page == "doc" || window.global.page == "customerPage" ) && n.data().evt_color){
                        		return n.data().evt_color;
                        	}
                            var size = 1;
                            if (n && n.data() && n.data().risks) {
                                size = this.node_cumulative_risk_scale(n.data().risks);
                            } else {
                                size = n.data().riskScore;
                            }
                            var w = n.data('weight') * 1;
                            if (!w || isNaN(w))
                                w = 1;
                            if (!size || isNaN(size))
                                size = 1;
                            var risk_weight = size * w;
                            if( window.global.page == "customerPage" && (n.data().labelV.toLowerCase() == "customer" || n.data().labelV.toLowerCase() == "club")){
                            	return '#4192b7';
                            }
                            if (n.data().name == window.global.queryString) {
                            	if(window.global.page == "doc"){
                            		return '#53e06a';
                            	}
                                return '#4192b7';
                            }
                            if (window.global.entityID) {
                                if (n.data().customer_number == window.global.entityID || n.data().name == window.global.entityID) {
                                	if(window.global.page == "doc"){
                                		return '#53e06a';
                                	}
                                	return '#4192b7';
                                }
                                if ($.inArray(n.data().oid, window.global.expandedNodes[CurentVLAID]) != -1) {
                                    return "#e8bb37";
                                }
                            }
                            if (!risk_weight || isNaN(risk_weight))
                                return  Graph.default_background_color;

                            var wf = (risk_weight < 3) ? 3 : (risk_weight > 8 ? 8 : risk_weight);

                            if ($(CurentVLAID).css('background-color') == "rgb(248, 248, 255)") {
                                if (wf >= 6)
                                    return '#e04033';
                                else {
                                    return  Graph.default_background_color;
                                }
                            } else {
                                if (wf >= 6)
                                    return '#e04033';
                                else {
                                    return  Graph.default_background_color;
                                }
                            }

                        },
                        "text-outline-width": 0,
                        "text-outline-color": "",
//                        "color": "#ffffff",
//                        "border-width": 4,
//                        "border-color": "fff",
                        "font-size": "18px",
                        "font-family": "FontAwesome, helvetica",
                        "font-style": "normal",
                        "font-weight": "normal",
                        "min-zoomed-font-size": "4",
                        "box-shadow": "0 0 100px rgba(0,0,1,0.5)",
                        'transition-property': 'height, width',
                        'transition-duration': '0.3s',
                    },
                    "edge": {
                        // "content": "data(_label)",
                        "width": function (e) {
                            var w = e.data('weight') * 1;
                            if (!w || isNaN(w))
                                w = 1;
                            return w;
                        },
                        "line-color": "white",
                        "source-arrow-color": "white",
                        "target-arrow-color": "white",
                        "font-size": "12px",
                        "font-family": "helvetica",
                        "font-style": "normal",
                        "font-weight": "normal",
                        "min-zoomed-font-size": 4,
                    },
                };
                this.type_styles = [];
                this.connection_type_styles = [];
                this.temp_data = {};
                // if (typeof cytoscape === 'undefined')
                // 	throw new Error('VLA UI JavaScript requires js.Cytoscape');
                // if (typeof jQuery === 'undefined')
                // 	throw new Error('VLA UI JavaScript requires jQuery');
                var default_options = {coords_scale: 1200};
                this.options = $.extend({}, default_options, options);
                this.coords_scale = this.options.coords_scale;
                this.parent_element = target_div;
                this.ol_load = $.Deferred();
                this.ol_loaded = this.ol_load.promise();
            }
            ;
            Graph.prototype.cytoscape = function () {
                return this.cy;
            };
            ;
            Graph.prototype.is_dynamic = function () {
                return this.dynamic_nodes.length > 0;
            };
            Graph.prototype.get_dynamic_values = function () {
                return this.dynamic_values;
            };
            Graph.prototype.busy = function (value) {
                if (typeof value !== 'undefined') {
                    this.in_busy_state = value;
                    if (value) {
                        $('.custom-spinner').show();                        
                        $(CurentVLAID).siblings(".custom-spinner").show();
                        this.ui_spinner.show();
                    } else {
                        $('.toggle-sidebar,.toggle-header').show();
                        this.ui_spinner.hide();
                        $('.custom-spinner').hide();
                        $(CurentVLAID).siblings(".custom-spinner").hide()
                        $('.mainsidewrapper').removeClass('sidebar-wrapper-main');
                        if ($('.on-any-node-selected').css('display') == "none")
                            $('#displayFeatures_div_node').hide();
                        if ($('.on-any-edge-selected').css('display') == "none")
                            $('#displayFeatures_div_edge').hide();
                    }

                }
                //<i class="fa fa-spinner fa-pulse fa-3x fa-fw margin-bottom"></i>
                return this.in_busy_state;
            };
            ;
            Graph.prototype.show_nodes_by_type = function (type) {
                // TODO: add caching by type?
                this.cy.$('node[_type="' + type + '"]').show();
            };
            Graph.prototype.hide_nodes_by_type = function (type) {
                // TODO: add caching by type?
                this.cy.$('node[_type="' + type + '"]').hide();
            };
            Graph.prototype.set_labels_visible = function (show_labels) {
                var nodes = this.cy.$("node");
                var edges = this.cy.$("edge");
                if (show_labels) {
                    nodes.addClass("show_label");
                    edges.addClass("show_label");
                } else {
                    nodes.removeClass("show_label");
                    edges.removeClass("show_label");
                }

            };

            Graph.prototype.init = function () {
                var self = this;
                var progress = $.Deferred();
                var cy_container = $("<div>").addClass("vla-cy vla-cy"+CurentVLAID+" content-wrapper");
                cy_container.appendTo(this.parent_element);
                cy_container.css("width", global.dimensions.width);//330==> side menu width
                cy_container.css("height", global.dimensions.height);
                cy_container.css("min-height", global.dimensions.height);
                cy_container.css("max-height", global.dimensions.height);
                cy_container.css("top", global.dimensions.top);
                cy_container.css("left", global.dimensions.left);
                this.ui_spinner = $("<div class='vla_spinner'>");
                this.ui_spinner.html("<span class='fa fa-spinner fa-spin fa-2x'></span>")
                        .appendTo(this.parent_element);
                
                 _cy_ = window._cy_ = window[CurentVLAID+"cy"] =cytoscape({
                    container: cy_container[0],
                    // textureOnViewport: true, // do not redraw graph on drag
                    zoom: 0.6,
                    ready: function () {
                        self.cy = this;
                        self.on_cytoscape_ready();
                        progress.resolve();
                    }
                });
                 _ALLVLA.push(_cy_);
                allNodes = _cy_.nodes();
                allEles = _cy_.elements();
                _cy_.on('select unselect', 'node', _.debounce(function (e) {
                    var node = _cy_.$('node:selected');
                    node.trigger('mouseout');
                    if (node.nonempty()) {
                        Promise.resolve().then(function () {
                            return  highlightedNodes(node);
                        });
                    } else {
                        clear();
                    }
                }, 100));
                return progress.promise();
            };

            var highlightedNodes = function (node) {
            	if(window.global.page == "tI" && node.data().labelV == "tx" && node.data().oid){
            		ScrollTxTable("trans"+(node.data().oid.split("tx-")[1]));
            	}
            	var oldNhood = lastHighlighted;
                var nhood = lastHighlighted = node.closedNeighborhood();
                var others = lastUnhighlighted = _cy_.elements().not(nhood);
                var reset = function () {
                    _cy_.batch(function () {
                        others.css({'display': 'none'});
                        nhood.css({'display': ''});
                        allEles.css({'events': 'no'});
                    });
//                      nhood.css({'opacity': '0.06'});

//                    return Promise.resolve().then(function () {
//                        if (isDirty()) {
//                            return fit();
//                        } else {
//                            return Promise.resolve();
//                        }
//                        ;
//                    }).then(function () {
//                        return Promise.delay(aniDur);
//                    });
                };
//                function isDirty() {
//                    return lastHighlighted != null;
//                }
                var runLayout = function () {
                    others.css({'display': 'none'});
                    var l = nhood.filter(':visible').makeLayout({
                        name: 'concentric',
                        fit: false,
                        animate: true,
                        animationDuration: aniDur,
                        animationEasing: easing,
//                                            boundingBox: {
//                                              x1: 4530.5 - 1,
//                                              x2: 4530.5 + 1,
//                                              y1: 4530.5 - 1,
//                                              y2: 4530.5 + 1,
//                                            },
                        avoidOverlap: true,
                        concentric: function (ele) {
                        	if(window.global.page == "customerPage"){
	                    		return customerLevelsforLeadGen[ele.data().labelV]?customerLevelsforLeadGen[ele.data().labelV]:1;
	                    	}
                            if (ele.same(node)) {
                                return 2;
                            } else {
                                return 1;
                            }
                        },
                        levelWidth: function () {
                            return 1;
                        },
                        minNodeSpacing: 150
                    });

                    var promise = _cy_.promiseOn('layoutstop');

                    l.run();
                    return promise;
                };

//                var fit = function () {
//                    others.css({'display': 'none'});
//                    return _cy_.animation({
//                        fit: {
//                            eles: nhood.filter(':visible'),
//                        },
//                        easing: easing,
//                        duration: aniDur,
//                    }).play().promise();
//                };

                var showOthersFaded = function () {
                    return Promise.delay(250).then(function () {
                        _cy_.batch(function () {
//                           others.css({'display':'','opacity':'0.2'});
                        });
                    });
                };

                var inCenter = function () {
                    if (!nhood.length) {
                        return;
                    }
                    if (nhood.length > 30) {
                        _cy_.animate({
                            center: true,
//                                fit:true
                            zoom: 0.25,
                        }, {
                            duration: 200
                        });
                    } else {
                        _cy_.animate({
                            center: true,
//                                fit:true
                            zoom: 0.5,
                        }, {
                            duration: 200
                        });
                    }
                };
                
                function nodeDetails(){
	                $("#colorSpectrum").spectrum({
	                    color: "" + node.css('background-color') + ""
	                });
	                $("#borderSpectrum").spectrum({
	                    color: "" + node.css('border-color') + ""
	                });
	                
                }
                return Promise.resolve()
                        .then(nodeDetails)
                        .then(reset)
                        .then(runLayout)
//                        .then(fit)
//                        .then(showOthersFaded)
                        .then(inCenter)
                        ;
            };

            $("body").on("click", "#close-id", function () {

//            $('#close-id').click(function(){
                alert("clicked over the cross-button: hurrehhh ");
                clear();
            });

            var clear = function (opts) {
                if (!isDirty()) {
                    return Promise.resolve();
                }

                opts = $.extend({
                }, opts);

                _cy_.stop();
                allNodes.stop();

                var nhood = lastHighlighted;
                var others = lastUnhighlighted;

                lastHighlighted = lastUnhighlighted = null;

                var hideOthers = function () {
                    return Promise.delay(125).then(function () {
                        others.css({'display': 'none'});
                        return Promise.delay(125);
                    });
                };

                var showOthers = function () {
                    _cy_.batch(function () {
                        return Promise.delay(325).then(function () {
                            others.css({'display': '', 'opacity': '1'});
                            return Promise.delay(325);
                        });

                    });

                    return Promise.delay(aniDur);
                };

                var restorePositions = function () {
                    var ele = _cy_.elements();
                    return _cy_.animation({
                        fit: {
                            eles: ele,
                            padding: 20,
                            avoidOverlap: true
                        },
                        easing: "linear",
                        duration: 20,
                        avoidOverlap: true
                    }).play().promise();
//                    on_cytoscape_ready();
//                  _cy_.batch(function(){
//                    others.nodes().forEach(function( n ){
//                      var p = n.data('orgPos');
//                      var i = 1;
//                      n.position({ x: 100 * i, y: 100 });
//                    });
//                    i++;
//                  });

//                  return restoreElesPositions( nhood.nodes() );

                };
                var restoreElesPositions = function (nhood) {
                    return Promise.all(nhood.map(function (ele) {
                        var p = ele.data('orgPos');
                        var i = 1;
                        return ele.animation({
                            position: {x: 100 * i, y: 100},
                            duration: aniDur,
                            easing: easing
                        }).play().promise();
                        i++;
                    }));
                };
                var resetHighlight = function () {
                    nhood.removeClass('highlighted');
                };

                return Promise.resolve()
                        .then(hideOthers)
                        .then(resetHighlight)
                        .then(showOthers)
                        .then(restorePositions)
                        ;
            };
            function isDirty() {
                return lastHighlighted != null;
            }

            Graph.prototype.load_remote_css = function () {
                var _this = this;
                $.ajax({url: "graph_style.css", dataType: "text"})
                        .then(function (cycss) {
                            _this.cy.style(cycss);
                        });
            };
            Graph.prototype.on_cytoscape_ready = function () {
                this.init_plugins();
                this.init_events();
                this.init_undoRedo();
                this.reassign_all_styles();
            };
            Graph.prototype.clear_all_styles = function () {
                this.cytoscape()['style'](null);
            };
            Graph.prototype.add_type_style = function (type_name, style) {
                var selector = this.type_selector(type_name);
                this.type_styles.push([selector, style]);
            };
            Graph.prototype.add_connection_type_style = function (type_name, style) {
                var selector = this.type_selector(type_name);
                this.connection_type_styles.push([selector, style]);
            };
            Graph.prototype.reassign_all_styles = function () {
                this.cytoscape().startBatch();
                this.clear_all_styles();
                this.reassign_system_basic_styles();
                // add types stylesheets here
                this.reassign_types_styles();
                // TODO: add conditional styles here, attribute dependent
                this.reassign_connection_types_styles();
                this.reassign_elements_custom_styles();
                this.reassign_system_important_styles();
                this.cytoscape().endBatch();
            };
            Graph.prototype.reassign_connection_types_styles = function () {
                var style = this.cytoscape().style();
                // console.warn("reassign_connection_types_styles");
                for (var _i = 0, _a = this.connection_type_styles; _i < _a.length; _i++) {
                    var pair = _a[_i];
                    style.selector("edge" + pair[0]).css(pair[1]);
                }
            };
            Graph.prototype.reassign_types_styles = function () {
                var style = this.cytoscape()['style']();
                for (var _i = 0, _a = this.type_styles; _i < _a.length; _i++) {
                    var pair = _a[_i];
                    style.selector(pair[0]).css(pair[1]);
                }
            };
            Graph.prototype.custom_style_mapper = function (node, property) {
                var defaults = node.isEdge() ? this.basic_styles.edge : this.basic_styles.node;
                var _style = node.data("_style");
                if (_style && _style[property]) {
                    if (node.isEdge() && property === 'width') {
                        // width weighted
                        var width = _style[property];
                        var w = node.data('weight') * 1;
                        if (!w || isNaN(w))
                            w = 1;
                        // check for units
                        var pair = width.match(/(\d+)(.*)?/);
                        if (pair && pair[2]) {
                            width = pair[1] * w + pair[2];
                        } else {
                            width *= w;
                        }
                        return width;
                    }
                    return _style[property];
                }
                return defaults[property];
            };
            /**
             * create stylesheets like:
             * node._custom_styled {
             * 		width: function(element){ return element.data._style.width || default_width;  }
             * 		color: function(element){ return element.data._style.color || default_color;  }
             * }
             * to dynamically assign custom color or font-size or whatever inside style rule
             */
            Graph.prototype.reassign_elements_custom_styles = function () {
                var _this = this;
                // colouring, changing size/font
                var cy_style = this.cytoscape()['style']();
                // NODES
                var custom_mapped = ["border-color", "background-color"];
                var custom_mapped_label = ["font-size"];
                var css = {};
                var _loop_1 = function (prop) {
                    css[prop] = function (n) {
                        return _this.custom_style_mapper(n, prop);
                    };
                };
                for (var _i = 0, custom_mapped_1 = custom_mapped; _i < custom_mapped_1.length; _i++) {
                    var prop = custom_mapped_1[_i];
                    _loop_1(prop);
                }
                var label_css = {};
                var _loop_2 = function (prop) {
                    label_css[prop] = function (n) {
                        return _this.custom_style_mapper(n, prop);
                    };
                };
                for (var _a = 0, custom_mapped_label_1 = custom_mapped_label; _a < custom_mapped_label_1.length; _a++) {
                    var prop = custom_mapped_label_1[_a];
                    _loop_2(prop);
                }
                cy_style.selector("node._custom_styled").css(css);
                // apply only when label is visible
                cy_style.selector("node._custom_styled.show_label").css(label_css);
                // EDGES
                custom_mapped = ["font-family", "font-size", "line-color", "width", "source-arrow-color", "target-arrow-color"];
                css = {};
                var _loop_3 = function (prop) {
                    css[prop] = function (n) {
                        return _this.custom_style_mapper(n, prop);
                    };
                };
                for (var _b = 0, custom_mapped_2 = custom_mapped; _b < custom_mapped_2.length; _b++) {
                    var prop = custom_mapped_2[_b];
                    _loop_3(prop);
                }
                cy_style.selector("edge._custom_styled").css(css);
            };
            Graph.prototype.reassign_system_basic_styles = function () {
                // console.info("assign basic styles");
                var style = this.cytoscape()['style']();
                style.selector("node").css(this.basic_styles.node);
                style.selector("node.compound").css({
                    "color": "#000000",
//                    "content": "data(_label)",
                    "background-color": "#e2e2e2",
                    "z-index": 1
                });
                style.selector("edge").css(this.basic_styles.edge);
            };
            Graph.prototype.node_cumulative_risk_scale = function (risks) {
                var max_scale = 1, min_scale = 0, scale_span = max_scale - min_scale;
                var CUMRISK = 1 - ((1 - risks.direct) * (1 - risks.indirect) * (1 - risks.transactional));
                return min_scale + scale_span * CUMRISK;
            };
            Graph.prototype.node_font_size_by_risks = function (n) {
                var size = 30;
                if (n && n.data() && n.data().risks) {
                    size *= this.node_cumulative_risk_scale(n.data().risks);
                }
                return size;
            };
            Graph.prototype.white_node_border_color = function (n) {
                var size = 1;
                if (n && n.data() && n.data().risks) {
                    size = this.node_cumulative_risk_scale(n.data().risks);
                }
                if (size > 0.6)
                    return 'red';
                else {
                    return '#283c45';
                }
            };

            Graph.prototype.node_themebackground_color = function (n) {
                if ($(CurentVLAID).css('background-color') == "rgb(248, 248, 255)")
                    return '#f8f8ff';
                else
                    return '#283c45';
            };
            
            Graph.prototype.node_background_color = function (n) {
            	if((window.global.page == "doc" || window.global.page == "customerPage" ) && n.data().evt_color){
            		return n.data().evt_color;
            	}
                var size = 1;
                if (n && n.data() && n.data().risks) {
                    size = this.node_cumulative_risk_scale(n.data().risks);
                } else {
                    size = n.data().riskScore;
                }
                var w = n.data('weight') * 1;
                if (!w || isNaN(w))
                    w = 1;
                if (!size || isNaN(size))
                    size = 1;
                var risk_weight = size * w;
                if( window.global.page == "customerPage" && (n.data().labelV.toLowerCase() == "customer" || n.data().labelV.toLowerCase() == "club")){
                	return '#4192b7';
                }
                if (n.data().name == window.global.queryString) {
                	if(window.global.page == "doc"){
                		return '#53e06a';
                	}
                    return '#4192b7';
                }
                if (window.global.entityID) {
                    if (n.data().customer_number == window.global.entityID || n.data().name == window.global.entityID) {
                    	if(window.global.page == "doc"){
                    		return '#53e06a';
                    	}
                    	return '#4192b7';
                    }
                    if ($.inArray(n.data().oid, window.global.expandedNodes[CurentVLAID]) != -1) {
                        return "#e8bb37";
                    }
                }
                if (!risk_weight || isNaN(risk_weight))
                    return  Graph.default_background_color;

                var wf = (risk_weight < 3) ? 3 : (risk_weight > 8 ? 8 : risk_weight);

                if ($(CurentVLAID).css('background-color') == "rgb(248, 248, 255)") {
                    if (wf >= 6)
                        return '#e04033';
                    else {
                        return  Graph.default_background_color;
                    }
                } else {
                    if (wf >= 6)
                        return '#e04033';
                    else {
                        return  Graph.default_background_color;
                    }
                }

            };

            Graph.prototype.node_text_color = function (n) {
            	 if ($(CurentVLAID).css('background-color') == "rgb(248, 248, 255)")
                    return '#000';
                else
                    return '#000';
            };

            Graph.prototype.gray_node_border_color = function (n) {
                var size = 1;
                if (n && n.data() && n.data().risks) {
                    size = this.node_cumulative_risk_scale(n.data().risks);
                }
                if (size > 0.6)
                    return 'red';
                else {
                    return '#fff';
                }
            }
            Graph.prototype.node_border_color = function (n) {
                var size = 1;
                if (n && n.data() && n.data().risks) {
                    size = this.node_cumulative_risk_scale(n.data().risks);
                } else {
                    size = n.data().riskScore;
                }
                var w = n.data('weight') * 1;
                if (!w || isNaN(w))
                    w = 1;
                var risk_weight = size * w;
                if (!risk_weight || isNaN(risk_weight))
                    return  Graph.default_background_color;
                var wf = (risk_weight < 3) ? 3 : (risk_weight > 8 ? 8 : risk_weight);
                if ($(CurentVLAID).css('background-color') == "rgb(248, 248, 255)") {
                    if (wf >= 6)
                        return '#e04033';
                    else {
                        return  Graph.default_background_color;
                    }
                } else {
                    if (wf >= 6)
                        return '#e04033';
                    else {
                        return  Graph.default_background_color;
                    }
                }
            };
            Graph.prototype.node_size_by_risks = function (n) {
                var size = 50;
                if (n && n.data() && n.data().risks) {
                    size *= this.node_cumulative_risk_scale(n.data().risks);
                }
                return size;
            };
            Graph.prototype.reassign_system_important_styles = function () {
                var _this = this;
                // console.info("assign important styles");
                var style = this.cytoscape()['style']();
                style.selector("node").css({
                    "text-valign": "bottom",
                    "background-image": function (n) {
                        if (n.data()['labelV'] == 'location') {
                            if (n.data()['name'] != '') {
                            	$.ajax({
                            		method: 'GET',
                            		url: window.imgPath+'KeylineICONS/flags/' + (n.data()['name']) + '.svg',
                            		success:function(){
                            			return 'url('+window.imgPath+'KeylineICONS/flags/' + (n.data()['name']) + '.svg)';
                            		},error:function(){
                            			return 'url('+window.imgPath+'KeylineICONS/map-marker.svg)';
                            		}
                            	})
                            }
                        }
                        if (n.data().risks == void 0) {
                            var w = n.data('weight') * 1;
//                            var risk = n.data('riskScore') * 1;
                            var risk = 0
                            if (!w || isNaN(w))
                                w = 1;
                            var risk_weight = risk * w;
                            var wf = (risk_weight < 3) ? 3 : (risk_weight > 6 ? 6 : Math.floor(risk_weight));
                            wf = parseInt(wf * 20);
                            var count = "_" + wf;
                            if(n.data()['_icon'])
                            	return 'url('+window.imgPath+'KeylineICONS/' + (n.data()['_icon']) + count + '.svg)';
                            else
                            	return 'url('+window.imgPath+'KeylineICONS/default' + count + '.svg)';
                        }else{
                        	var max_scale = 1, min_scale = 0, scale_span = max_scale - min_scale;
                            var CUMRISK = 1 - ((1 - n.data().risks.direct) * (1 - n.data().risks.indirect) * (1 - n.data().risks.transactional));
                            var risk = min_scale + scale_span * CUMRISK;
                            if (!risk || isNaN(risk))
                                return;
                            var w = n.data('weight') * 1;
                            if (!w || isNaN(w))
                                w = 1;
                            var risk_weight = risk * w;
                            if (!risk_weight || isNaN(risk_weight))
                                return;
                            var wf = (risk_weight < 3) ? 3 : (risk_weight > 6 ? 6 : Math.floor(risk_weight));
                            wf = parseInt(wf * 20);
                            var count = "_" + wf;
                            if(n.data()['_icon'])
                            	return 'url('+window.imgPath+'KeylineICONS/' + (n.data()['_icon']) + count + '.svg)';
                            else
                            	return 'url('+window.imgPath+'KeylineICONS/default' + count + '.svg)';
                        }
                    },
                    "font-size": 30,
                    "font-family": "FontAwesome, helvetica",
                    'transition-property': 'height, width',
                    'transition-duration': '0.2s',
//                    "border-width": 2,
//                    "border-color": "white",
                    "z-index": 9998,
                });
                style.selector("edge").css({
                    "line-color": "gray",
                    "target-arrow-color": "gray",
                    "target-arrow-shape": "triangle",
                    "curve-style": "bezier",
//                    "target-arrow-fill":"hollow"
                });
                style.selector("node.risks").css({
                    "background-color": function (n) {
                        return _this.node_background_color(n);
                    },
                    "z-index": 999
                });
                style.selector("node.compound").css({
                    "text-halign": "center",
                    "text-valign": "top",
//                    "content": "data(_label)",
                    "font-size": function (n) {
                        return _this.custom_style_mapper(n, "font-size");
                    },
                    "font-family": function (n) {
                        return _this.custom_style_mapper(n, "font-family");
                    },
                });
                /* label */
                style.selector(".hover").css({
//                    "content": "data(_label)",
//                    "text-outline-width": 2,
//                    "text-outline-color": "white",
                    "color": "white",
                    "font-size": function (n) {
                        return _this.custom_style_mapper(n, "font-size");
                    },
                    "font-family": function (n) {
                        return _this.custom_style_mapper(n, "font-family");
                    },
                });
                style.selector("node.zoomNode").css({
                    "width": "100px",
                    "height": "100px",
                    "background-image": "none",
                    'background-image-opacity': '0',
                    'background-fit': 'cover',
                    "background-color": function (n) {
                        return _this.node_background_color(n);
                    },
                    'content': function (n) {
                        return n.connectedEdges().length;
                    },
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'font-size': '60px',
                    'color': function (n) {
                        return _this.node_text_color();
                    },
                    'border-color': function (n) {
                        return _this.node_border_color(n);
                    },
                    'border-width': 1,
                    'transition-property': 'height, width, content',
                    'transition-duration': '0.3s',
//                    'transition-timing-function':'ease-in'
                });
                style.selector("node.zoomdarkThemeNode").css({
                    "width": "100px",
                    "height": "100px",
                    "background-image": "none",
                    'background-fit': 'cover',
                    'content': function (n) {
                        return n.connectedEdges().length;
                    },
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'font-size': '80px',
                    'color': '#000',
                    'border-color': '#fff',
                    'border-width': 1,
                    'transition-property': 'height, width, content',
                    'transition-duration': '0.3s',
//                    'transition-timing-function':'ease-in'
                });
                style.selector("node.zoomLightNode").css({
                    "width": "100px",
                    "height": "100px",
                    'background-fit': 'cover',
                    'transition-property': 'height, width',
                    'transition-duration': '0.3s'
                });
                style.selector("node.show_label").css({
                    "content": function(n){
                    	if(typeof n.data()['_label'] === "string"){
                    		
                    		if(window.global.page == "doc" && n.data().labelV =="Event" && n.data()['_label'].length>15 ){
                    			
                    			return n.data()['_label'].charAt(0).toUpperCase() + n.data()['_label'].substring(1,15)+"...";
                    		}
                    		return n.data()['_label'].charAt(0).toUpperCase() + n.data()['_label'].substring(1);
                    	}
                    	return n.data()['_label'];
                    },
                    "color": "#ccece6",
                    "font-size": function (n) {
                        return _this.custom_style_mapper(n, "font-size");
                    },
                    "font-family": function (n) {
                        return _this.custom_style_mapper(n, "font-family");
                    },
                });
                style.selector("node.whiteTheme").css({
//                    "border-width": 2,
                    "background-color": function (n) {
                        return _this.node_background_color(n);
                    },
//                    "border-color": function (n) {
//                        return _this.white_node_border_color(n);
//                    },
                    "background-image": function (n) {
                        if (n.data()['labelV'] == 'location') {
                            if (n.data()['name'] != '') {
                                return 'url('+window.imgPath+'KeylineICONS/flags/' + (n.data()['name']) + '.svg)';
                            }
                        }
                        if (n.data().weight == void 0)
                        	 if ($(CurentVLAID).css('background-color') == "rgb(248, 248, 255)")
                                return 'url('+window.imgPath+'KeylineICONS/' + (n.data()['_icon']) + '_light.svg)';
                            else
                                return 'url('+window.imgPath+'KeylineICONS/' + (n.data()['_icon']) + '.svg)';
                        if (n.data().risks == void 0)
                            if (n.data().risks == void 0) {
                                var w = n.data('weight') * 1;
                                var risk = n.data('riskScore') * 1;
                                if (!w || isNaN(w))
                                    w = 1;
                                var risk_weight = risk * w;
                                var wf = (risk_weight < 3) ? 3 : (risk_weight > 6 ? 6 : Math.floor(risk_weight));
                                wf = parseInt(wf * 20);
                                var count = "_" + wf;
                                if ($(CurentVLAID).css('background-color') == "rgb(248, 248, 255)")
                                    return 'url('+window.imgPath+'KeylineICONS/' + (n.data()['_icon']) + count + '_light.svg)';
                                else
                                    return 'url('+window.imgPath+'KeylineICONS/' + (n.data()['_icon']) + count + '.svg)';
                            }
                        var max_scale = 1, min_scale = 0, scale_span = max_scale - min_scale;
                        var CUMRISK = 1 - ((1 - n.data().risks.direct) * (1 - n.data().risks.indirect) * (1 - n.data().risks.transactional));
                        var risk = min_scale + scale_span * CUMRISK;
                        if (!risk || isNaN(risk))
                            return;
                        var w = n.data('weight') * 1;
                        if (!w || isNaN(w))
                            w = 1;
                        var risk_weight = risk * w;
                        if (!risk_weight || isNaN(risk_weight))
                            return;
                        var wf = (risk_weight < 3) ? 3 : (risk_weight > 6 ? 6 : Math.floor(risk_weight));
                        wf = parseInt(wf * 20);
                        var count = "_" + wf;
                        return 'url('+window.imgPath+'KeylineICONS/' + (n.data()['_icon']) + count + '_light.svg)';
                    },
                    'transition-property': 'height, width',
                    'transition-duration': '0.3s'
                });
                style.selector("node.nodewithoutBackground").css({
//                    "background-color":"#283c45",
                    "background-image": function (n) {
                        if (n.data()['labelV'] == 'location') {
                            if (n.data()['name'] != '') {
                                return 'url('+window.imgPath+'KeylineICONS/flags/' + (n.data()['name']) + '.svg)';
                            }
                        }
                        if (n.data().risks == void 0) {
                            var w = n.data('weight') * 1;
                            var risk = n.data('riskScore') * 1;
                            if (!w || isNaN(w))
                                w = 1;
                            var risk_weight = risk * w;
                            var wf = (risk_weight < 3) ? 3 : (risk_weight > 6 ? 6 : Math.floor(risk_weight));
                            wf = parseInt(wf * 20);
                            var count = "_" + wf;
                            if ($(CurentVLAID).css('background-color') == "rgb(248, 248, 255)")
                            	 return 'url('+window.imgPath+'KeylineICONS/' + (n.data()['_icon']) + count + '.svg)';
                            else
                                return 'url('+window.imgPath+'KeylineICONS/' + (n.data()['_icon']) + count + '_light.svg)';

                        }
                        var max_scale = 1, min_scale = 0, scale_span = max_scale - min_scale;
                        var CUMRISK = 1 - ((1 - n.data().risks.direct) * (1 - n.data().risks.indirect) * (1 - n.data().risks.transactional));
                        var risk = min_scale + scale_span * CUMRISK;
                        if (!risk || isNaN(risk))
                            return;
                        var w = n.data('weight') * 1;
                        if (!w || isNaN(w))
                            w = 1;
                        var risk_weight = risk * w;
                        if (!risk_weight || isNaN(risk_weight))
                            return;
                        var wf = (risk_weight < 3) ? 3 : (risk_weight > 6 ? 6 : Math.floor(risk_weight));
                        wf = parseInt(wf * 20);
                        var count = "_" + wf;
                        if ($(CurentVLAID).css('background-color') == "rgb(248, 248, 255)") {
                            if (n.data()['labelV'] == 'company') {
                                if (n.data()['_icon'] != '') {
                                    return 'url('+window.imgPath+'KeylineICONS/' + (n.data()['_icon']) + count + '.svg)';
                                }
                            } else {
                                return 'url('+window.imgPath+'KeylineICONS/' + (n.data()['_icon']) + count + '.svg)';
                            }
                        } else {
                            if (n.data()['labelV'] == 'company') {
                                if (n.data()['_icon'] != '') {
                                    return 'url('+window.imgPath+'KeylineICONS/' + (n.data()['_icon']) + count + '_light.svg)';
                                }
                            } else {
                                return 'url('+window.imgPath+'KeylineICONS/' + (n.data()['_icon']) + count + '.svg)';
                            }
                        }

                    },
                    "border-width": 2,
                    "border-color": function (n) {
                        return _this.node_border_color(n);
                    },
                    "background-color": function (n) {
                        return _this.node_themebackground_color(n);
                    },
                });
                style.selector("node.zoomNodewithoutBackground").css({
                    "width": "100px",
                    "height": "100px",
                    "background-image": "none",
                    'background-fit': 'cover',
                    'content': function (n) {
                        return n.connectedEdges().length;
                    },
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'font-size': '80px',
                    'color': '#000',
                    'border-color': function (n) {
                        return _this.node_border_color(n);
                    },
                    'border-width': 1,
                    'transition-property': 'height, width, content',
                    'transition-duration': '0.3s',
                });
                style.selector("node.grayTheme").css({
                    "background-image": function (n) {
                        if (n.data()['labelV'] == 'location') {
                            if (n.data()['name'] != '') {
                                return 'url('+window.imgPath+'KeylineICONS/flags/' + (n.data()['name']) + '.svg)';
                            }
                        }
                        if (n.data().weight == void 0)
                            return 'url('+window.imgPath+'KeylineICONS/' + (n.data()['_icon']) + '.svg)';
                        if (n.data().risks == void 0)
                            return 'url('+window.imgPath+'KeylineICONS/' + (n.data()['_icon']) + '.svg)';
                        var max_scale = 1, min_scale = 0, scale_span = max_scale - min_scale;
                        var CUMRISK = 1 - ((1 - n.data().risks.direct) * (1 - n.data().risks.indirect) * (1 - n.data().risks.transactional));
                        var risk = min_scale + scale_span * CUMRISK;
                        if (!risk || isNaN(risk))
                            return;
                        var w = n.data('weight') * 1;
                        if (!w || isNaN(w))
                            w = 1;
                        var risk_weight = risk * w;
                        if (!risk_weight || isNaN(risk_weight))
                            return;
                        var wf = (risk_weight < 3) ? 3 : (risk_weight > 6 ? 6 : Math.floor(risk_weight));
                        wf = parseInt(wf * 20);
                        var count = "_" + wf;
                        return 'url('+window.imgPath+'KeylineICONS/' + (n.data()['_icon']) + count + '.svg)';
                    }
                });
                style.selector("edge.show_label").css({
                    "content": function(n){
                    	if(typeof n.data()['_label'] === "string")
                    		return n.data()['_label'].charAt(0).toUpperCase() + n.data()['_label'].substring(1);
                    	return n.data()['_label'];
                    },
                    "color": "#98B3C5",
                    "font-size": function (n) {
                        return _this.custom_style_mapper(n, "font-size");
                    },
                    "font-family": function (n) {
                        return _this.custom_style_mapper(n, "font-family");
                    },
                });
                //Show labels after node selection
                style.selector("edge:selected, edge.co-selected").css({
                    // "width": (e) => {
                    // 	let w = e.data('weight')*1;
                    // 	if (!w || isNaN(w))
                    // 		w = 1;
                    // 	return w*4;
                    // },
                    "width": 4,
//                    "content": "data(_label)",
//                    "text-outline-width": 2,
//                    "text-outline-color": "white",
                });
                style.selector("node.co-selected,").css({
                    "opacity": 1,
//                    "border-width": 1,
//                    "border-color": "purple",
                    "z-index": 9998,
                });
                style.selector("edge.co-selected").css({
                    "line-color": "gray",
                    "target-arrow-color": "gray",
                    "source-arrow-color": "gray"
                });
                style.selector("node.af-highlight").css({
                    opacity: 1,
                    "border-width": 4,
                    "border-color": "#ff00ff",
                    "z-index": 9998,
                });
                // find path highlight
                style.selector("node.path-highlight").css({
                    opacity: 1,
                    "border-width": 4,
                    "border-color": "#00ff00",
                    "z-index": 9998,
                });
                style.selector("edge.path-highlight").css({
                    "line-color": "pink",
                    "target-arrow-color": "#e7fbff",
                    "source-arrow-color": "#e7fbff",
                    "z-index": 9999,
                });
                // emulated :hover for edges
                style.selector("edge.hover").css({
                    "line-color": "#4b7482",
                    "target-arrow-color": "#4b7482",
                    "source-arrow-color": "#4b7482",
                    "z-index": 9999,
                });
                style.selector("node.hover").css({
//                    "border-width": 2,
//                    "border-color": "white"
                });
                style.selector(":selected").css({
                    // "background-color": "black",
//                    "line-color": "white",
//                    "target-arrow-color": "white",
//                    "source-arrow-color": "white",
//                    // opacity: 1,
                    "border-width": function (n) {
                    	 if ($(CurentVLAID).css('background-color') == "rgb(248, 248, 255)") {
                            return 6;
                        } else {
                            return 6;
                        }
                    },
                    "border-color": function (n) {
                    	 if ($(CurentVLAID).css('background-color') == "rgb(248, 248, 255)") {
                            return '#000';
                        } else {
                            return '#fff';
                        }
                    },
//                    "z-index": 9999
                });
            };
            Graph.prototype.set_node_icon = function (nodes, icon_name) {
                nodes.not(":child").data("_icon", (icon_name));
                nodes.filter(":parent").children().data("_icon", VLA.UI.Graph.icon(icon_name));
            };
            Graph.prototype.set_element_style = function (elements, style) {
                var _this = this;
                if (!elements.length)
                    return;
                this.cytoscape().startBatch();
                // store custom styles in data._style attribute, ._custom_styled elements get some styles from data(_style)
                elements.forEach(function (element) {
                    if (!element.data("_style"))
                        element.data("_style", {});
                    var upd_style = $.extend({}, element.data("_style"), style);
                    var all_styles_empty = true;
                    for (var key in upd_style) {
                        if (!upd_style.hasOwnProperty(key))
                            continue;
                        var value = upd_style[key];
                        if (typeof value != 'undefined' && value != '') {
                            all_styles_empty = false;
                            break;
                        }
                    }
                    element.data("_style", upd_style);
                    if (element.isParent()) {
                        _this.set_element_style(element.children(), upd_style);
                        return;
                    }
//                    if (all_styles_empty)
//                        element.removeClass("_custom_styled");
//                    else
//                        element.addClass("_custom_styled");
                });
                this.cytoscape().endBatch();
            };
            Graph.prototype.get_custom_style = function (element) {
                return element.data("_style");
            };
            Graph.prototype.is_custom_styled = function (element) {
                return element.hasClass("_custom_styled");
            };
            Graph.prototype.type_selector = function (type_name) {
                return "[_type=\"" + type_name + "\"]";
            };
            Graph.prototype.set_edge_type = function (elements, type_name) {
                var edges = elements.filter("edge");
                edges.data("_type", type_name);
            };
            Graph.prototype.get_edge_type = function (elements) {
                return elements.data("_type");
            };
            Graph.prototype.set_node_type = function (elements, type_name) {
                var nodes = elements.filter("node");
                nodes.data("_type", type_name);
            };
            Graph.prototype.not_neighbour_of_selected = function (element) {
                if (element.isEdge())
                    return element.connectedNodes(":selected").length == 0;
                // node
                if (element.connectedEdges(":selected").length != 0)
                    return false;
                return element.connectedEdges().connectedNodes(":selected").not(element).length == 0;
            };
            Graph.prototype.init_events = function () {
                // this.cy.on('layoutstart', function (evt) {
                // 	//self.busy(true);
                // });
                // this.cy.on('layoutstop', function (evt) {
                // 	//self.busy(false);
                // });
                var _this = this;
                // hover emulation
                this.cy.on('mouseover', 'edge', function (evt) {
                    var edge = evt.cyTarget;
                    edge.addClass("hover");
                    var node = this;
                    if (node.isEdge())
                		text = window.vlaBuildingObjects.ui_panel.selection_info_panel.edge_info(node)
                		$("#vla_tooltip").html(text)
            		$("#vla_tooltip").css("display", "block");
                });
                this.cy.on('click mouseover', 'node', function (evt) { 
                   	var node = this;
                	var text = '';
                    var edge = evt.cyTarget;
                    edge.addClass("hover zoomNode");
                    if (edge.hasClass('show_label')) {
                        edge.removeClass("show_label");
                        edge.addClass("show_label1");
                    }
                    var selecedOpt;
                    if ($(".second_second_sub_dropdown_check").length == 1) {
                        //get value for second sub menu
                        selecedOpt = $(".second_sub_menu").next("ul").find("select").val();
                    } else {
                        //get value for first sub menu
                        selecedOpt = $(".first_sub_menu").next("ul").find("select").val();
                    }
//                    if (selecedOpt == 'nodewithoutBackground') {
//                        edge.removeClass("whiteTheme");
//                        edge.removeClass("nodewithoutBackground");
//                    }
//                    if (selecedOpt == 'nodeBackground') {
//                        edge.removeClass("whiteTheme");
//                    }
                    if (!node.isEdge())
                		text = window.vlaBuildingObjects.ui_panel.selection_info_panel.node_info(node)
                		if(location.href.indexOf('leadGeneration') >= 0){
                			 $("#vla_tooltip").html(text.replace("$", "₪").replace("<i class='fa fa-dollar' aria-hidden='true'></i>","<i class='fa fa-ils' aria-hidden='true'></i> "))
                             
                		}else{
                			 $("#vla_tooltip").html(text)
                		}
                   	 $("#vla_tooltip").css("display", "block");
                });
                this.cy.on('mouseout', 'edge', function (evt) {
                    $(".qtip").hide();
                    $("#vla_tooltip").css("display", "none");
                    var edge = evt.cyTarget;
                    edge.removeClass("hover");
                   
                });
                this.cy.on('mouseout', 'node', function (evt) {
                    $(".qtip").hide();
                    $("#vla_tooltip").css("display", "none");
                    var edge = evt.cyTarget;
                    if (edge.hasClass('show_label1')) {
                        edge.removeClass("show_label1");
                        edge.addClass("show_label");
                    }
                    edge.removeClass("hover zoomNode");
                    var selecedOpt;
                    if ($(".second_second_sub_dropdown_check").length == 1) {
                        //get value for second sub menu
                        selecedOpt = $(".second_sub_menu").next("ul").find("select").val();
                    } else {
                        //get value for first sub menu
                        selecedOpt = $(".first_sub_menu").next("ul").find("select").val();
                    }

//                    if (selecedOpt == 'nodewithoutBackground') {
//                        edge.addClass("whiteTheme");
//                        edge.addClass("nodewithoutBackground");
//                    }
//                    if (selecedOpt == 'nodeBackground') {
//                    	 edge.addClass("whiteTheme");
//                    }
                });
                this.cy.on('select', function (evt) {
                    _this.highlight_element_neighbourhood(evt.cyTarget);
                });
                this.cy.on('unselect', function (evt) {
                    _this.unhighlight_element_neighbourhood(evt.cyTarget);
                });
                this.cy.on('mousemove', 'node', function (evt) {
                	var tooltipWidth=$("#vla_tooltip").width()+50;
                	var p = $(CurentVLAID);
                  	var position=p.offset();
                  	var cursor=evt.originalEvent.clientX;
                  	var element = document.getElementById("vla_tooltip");
                	  	if((evt) && (evt.originalEvent) && (evt.originalEvent.path[3]) && (evt.originalEvent.path[3].id == "vlaCompare1" ||evt.originalEvent.path[3].id == "vlaCompare2") && window.global.page == "customerPage"){
                		if((position.left<evt.originalEvent.clientX)&&(cursor>tooltipWidth)){
                    		element.classList.remove("tooltip-left");
                			element.classList.add("tooltip-right");
                			$("#vla_tooltip").css("left",(evt.originalEvent.clientX - 25-$("#vla_tooltip").width()) + "px");
                			$("#vla_tooltip").css("top", evt.originalEvent.clientY + 200 );
                		}else{
                       		element.classList.remove("tooltip-right");
                   		    element.classList.add("tooltip-left");
                			$("#vla_tooltip").css("left",evt.originalEvent.clientX + 15);
                         	$("#vla_tooltip").css("top", evt.originalEvent.clientY + 200 );
                		}
                    } else{
                    		if((position.left<evt.originalEvent.clientX)&&(cursor>tooltipWidth)){
                        		element.classList.remove("tooltip-left");
                    			element.classList.add("tooltip-right");
                    			$("#vla_tooltip").css("left",(evt.originalEvent.clientX - 25-$("#vla_tooltip").width()) + "px");
                    			$("#vla_tooltip").css("top", evt.originalEvent.clientY-20 );
                    		}else{
                           		element.classList.remove("tooltip-right");
                       		    element.classList.add("tooltip-left");
                    			$("#vla_tooltip").css("left",evt.originalEvent.clientX + 15);
                             	$("#vla_tooltip").css("top", evt.originalEvent.clientY-20 );
                        
                    		}
                    }
//                    var edge = evt.cyTarget;
//                    edge.addClass("hover");
                });
                this.cy.on('mousemove', 'edge', function (evt) {
                	var tooltipWidth=$("#vla_tooltip").width()+50;
                	var p = $(CurentVLAID);
                  	var position=p.offset();
                  	var cursor=evt.originalEvent.clientX;
                  	var element = document.getElementById("vla_tooltip");
                	if((evt) && (evt.originalEvent) && (evt.originalEvent.path[3]) && (evt.originalEvent.path[3].id == "vlaCompare1" ||evt.originalEvent.path[3].id == "vlaCompare2") && window.global.page == "customerPage"){
                		if((position.left<evt.originalEvent.clientX)&&(cursor>tooltipWidth)){
                    		element.classList.remove("tooltip-left");
                			element.classList.add("tooltip-right");
                			$("#vla_tooltip").css("left",(evt.originalEvent.clientX - 25-$("#vla_tooltip").width()) + "px");
                			$("#vla_tooltip").css("top", evt.originalEvent.clientY + 200 );
                		}else{
                       		element.classList.remove("tooltip-right");
                   		    element.classList.add("tooltip-left");
                			$("#vla_tooltip").css("left",evt.originalEvent.clientX + 15);
                         	$("#vla_tooltip").css("top", evt.originalEvent.clientY + 200 );
                		}
                    } else{
                    		if((position.left<evt.originalEvent.clientX)&&(cursor>tooltipWidth)){
                        		element.classList.remove("tooltip-left");
                    			element.classList.add("tooltip-right");
                    			$("#vla_tooltip").css("left",(evt.originalEvent.clientX - 25-$("#vla_tooltip").width()) + "px");
                    			$("#vla_tooltip").css("top", evt.originalEvent.clientY-20 );
                    		}else{
                           		element.classList.remove("tooltip-right");
                       		    element.classList.add("tooltip-left");
                    			$("#vla_tooltip").css("left",evt.originalEvent.clientX + 15);
                             	$("#vla_tooltip").css("top", evt.originalEvent.clientY-20 );
                        
                    		}
                    }
                });
            };

            Graph.prototype.highlight_element_neighbourhood = function (target) {
                // mark connected nodes and edges as "co-selected"
                if (target.isEdge()) {
                    // highlight connected nodes
                    target.connectedNodes().addClass("co-selected");
                } else {
                    target.connectedEdges().addClass("co-selected");
                    target.connectedEdges().connectedNodes().not(target).addClass("co-selected");
                    if (target.isChild()) {
                        target.parent().addClass("co-selected");
                    } else if (target.isParent()) {
                        target.children().addClass("co-selected");
                    }
                }
            };

            Graph.prototype.update_node_highlight = function (element) {
                if (this.not_neighbour_of_selected(element))
                    element.removeClass("co-selected");
                else
                    element.addClass("co-selected");
            };
            Graph.prototype.unhighlight_element_neighbourhood = function (target) {
                // remove "co-selected" mark from connected nodes and edges (beware if those are co-selected with some else node/edge)
                if (target.isEdge()) {
                    if (target.connectedNodes(":selected").length == 0) {
                        // check connected nodes are not connected to selected edges or nodes
                        target.connectedNodes().stdFilter(this.not_neighbour_of_selected).removeClass("co-selected");
                    }
                } else {
                    target.connectedEdges().stdFilter(this.not_neighbour_of_selected).removeClass("co-selected");
                    target.connectedEdges().connectedNodes().stdFilter(this.not_neighbour_of_selected).removeClass("co-selected");
                    if (target.isChild())
                        target.parent().stdFilter(this.not_neighbour_of_selected).removeClass("co-selected");
                    else if (target.isParent())
                        target.children().stdFilter(this.not_neighbour_of_selected).removeClass("co-selected");
                }
            };
            // highlight_selection_neighbourhood_MASS() {
            // 	console.time("HN");
            // 	let target_nodes = this.selected_nodes();
            // 	let target_edges = this.selected_edges();
            //
            // 	this.cytoscape().startBatch();
            // 	// edges -> highlight connected nodes
            // 	target_edges.connectedNodes().addClass("co-selected");
            //
            // 	// mark connected nodes and edges as "co-selected"
            // 	target_nodes.connectedEdges().addClass("co-selected");
            // 	target_nodes.connectedEdges().connectedNodes().addClass("co-selected");
            // 	// targets.connectedEdges().connectedNodes().not(target).addClass("co-selected");
            // 	// highlight parents
            // 	target_nodes.filter(":child").parent().addClass("co-selected");
            // 	// highlight kids
            // 	target_nodes.filter(":parent").children().addClass("co-selected");
            //
            // 	this.cytoscape().endBatch();
            // 	console.timeEnd("HN");
            // }
            Graph.prototype.init_plugins = function () {
                var panzoom_defaults = {
                    zoomFactor: 0.01,
                    zoomDelay: 45,
                    minZoom: 0.1,
                    maxZoom: 10,
                    fitPadding: 50,
                    panSpeed: 10,
                    panDistance: 10,
                    panDragAreaSize: 75,
                    panMinPercentSpeed: 0.25,
                    panInactiveArea: 8,
                    panIndicatorMinOpacity: 0.5,
                    zoomOnly: false,
                    fitSelector: undefined,
                    animateOnFit: function () {
                        return false;
                    },
                    fitAnimationDuration: 1000,
                    // icon class names
                    sliderHandleIcon: 'fa fa-minus',
                    zoomInIcon: 'fa fa-plus',
                    zoomOutIcon: 'fa fa-minus',
                    resetIcon: 'fa fa-expand'
                };
                this.cy['panzoom'](panzoom_defaults); // TODO: do it normal way.... dig the d.ts files
                var edgehandles_defaults = {
                    preview: true,
                    stackOrder: 4,
                    handleSize: 10,
                    handleColor: '#ff0000',
                    handleLineType: 'ghost',
                    handleLineWidth: 3,
                    handleIcon: false,
                    handleNodes: 'node',
                    hoverDelay: 150,
                    cxt: false,
                    enabled: false,
                    toggleOffOnLeave: false,
                    edgeType: function (sourceNode, targetNode) {
                        // can return 'flat' for flat edges between nodes or 'node' for intermediate node between them
                        // returning null/undefined means an edge can't be added between the two nodes
                        return 'flat';
                    },
                    loopAllowed: function (node) {
                        // for the specified node, return whether edges from itself to itself are allowed
                        return false;
                    },
                    nodeLoopOffset: -50,
                    nodeParams: function (sourceNode, targetNode) {
                        // for edges between the specified source and target
                        // return element object to be passed to cy.add() for intermediary node
                        return {};
                    },
                    edgeParams: function (sourceNode, targetNode, i) {
                        // for edges between the specified source and target
                        // return element object to be passed to cy.add() for edge
                        // NB: i indicates edge index in case of edgeType: 'node'
                        return {};
                    },
                    start: function (sourceNode) {
                        // fired when edgehandles interaction starts (drag on handle)
                    },
                    complete: function (sourceNode, targetNodes, addedEntities) {
                        // fired when edgehandles is done and entities are added
                    },
                    stop: function (sourceNode) {
                        // fired when edgehandles interaction is stopped (either complete with added edges or incomplete)
                    }
                };
                // this.cy['edgehandles']( edgehandles_defaults );
            };
            ;
            Graph.prototype.init_undoRedo = function () {
                var options = {
                    isDebug: true,
                    actions: {},
                    undoableDrag: true // Whether dragging nodes are undoable can be a function as well
                };
                this.actions = this.cytoscape()['undoRedo'](options); // Can also be set whenever wanted.
                this.init_action_connect();
                this.init_action_rename();
                this.init_action_hide();
            };
            Graph.prototype.init_action_connect = function () {
                var _this = this;
                this.actions.action("connect", function (args) {
                    args.links = _this._connect_nodes(args.source, args.target);
                    return args;
                }, function (args) {
                    var target = args.target;
                    _this.cytoscape().remove(args.links);
                    _this.update_node_highlight(target);
                    return args;
                });
            };
            Graph.prototype.init_action_rename = function () {
                this.actions.action("rename", function (args) {
                    args.saved_label = args.target.data("_label") || "";
                    var label = args.label || "";
                    args.target.data("_label", label);
                    return args;
                }, function (args) {
                    args.target.data("_label", args.saved_label);
                    return args;
                });
            };
            Graph.prototype.init_action_hide = function () {
                var _this = this;
                this.actions.action("hide", function (args) {
                    return _this._hide_elements(args);
                }, function (args) {
                    args.show();
                    return args;
                });
            };
            Graph.prototype.add = function (nodes, edges) {
                var _this = this;
                this.cy.batch(function () {
                    _this.cy.add(nodes);
                    if (typeof edges !== 'undefined')
                        _this.cy.add(edges);
                });
            };
            ;
            /**
             * check if there any nodes, edges, properties affected by "time"
             */
            Graph.prototype.setup_dynamic_content = function () {
                var _this = this;
                // "A big ball of wibbly wobbly, timey wimey stuff"
//                console.info("setup_dynamic_content");
                this.dynamic_values = {
                    start: moment("9999-12-31").endOf('day'),
                    end: moment("0000-01-01").startOf('day')
                };
                this.dynamic_nodes = [];
                this.cytoscape().elements().each(function (i, el) {
                    // nodes and edges here
                    var spells = _this.import_spells_data(el);
                    if (spells.length) {
                        _this.dynamic_nodes.push(el);
                    }
                });
                // if (this.dynamic_values.start === +Infinity) {
                // 	this.dynamic_values.start = +moment(this.dynamic_values.end, "x").startOf('day').subtract(1,'day');
                // }
                // if (this.dynamic_values.end === -Infinity) {
                // 	this.dynamic_values.end = +moment(this.dynamic_values.start, "x").endOf('day').add(1,'day');
                // }
            };
            /**
             * import all time affected data, collect it to "spells" array
             * @param el
             * @returns {TimeSpell[]}
             */
            Graph.prototype.import_spells_data = function (el) {
                var spells = [];
                var raw_spells;
                // top level spell
                raw_spells = el.data("spells");
                if (typeof raw_spells === 'undefined' || typeof raw_spells.length === 'undefined' || raw_spells == '') {
                    raw_spells = [];
                    if(el.data("start") != ''){
                    	raw_spells.push({
                      	  start:  el.data("start")
//                          start: randomDateGenerator(new Date(01 - 01 - 2001), new Date())
                      });
                    }
                    $('.vla-checkbox.timeline').addClass('vla-disabled');

                } else {
                    raw_spells.push({
                        start: el.data("start"),
                        end: el.data("end")
                    });
                }
                function randomDateGenerator(start, end) {
                    var date = new Date(+start + Math.random() * (end - start));
                    return date;
                }
                // external spells array
                if (raw_spells) {
                    var ts = void 0; // timestamp
                    for (var _i = 0, raw_spells_1 = raw_spells; _i < raw_spells_1.length; _i++) {
                        var raw_spell = raw_spells_1[_i];
                        var spell = {};
                        if (raw_spell["for"]) {
                            spell["for"] = raw_spell["for"];
                            spell.value = raw_spell.value;
                        }
                        var start = raw_spell.start;
                        if (start) {
                            start = moment(start).startOf('day');
                            spell.start = start;
                            this.extend_dynamic_values(start);
                        }
                        var end = raw_spell.end;
                        if (end) {
                            end = moment(end).endOf('day');
                            spell.end = end;
                            this.extend_dynamic_values(end);
                        }
                        if (spell.start || spell.end) {
                            spells.push(spell);
                        }
                    }
                }
                // overwrite
                if (spells.length) {
                    el.data("spells", spells);
                }
                return spells;
            };
            Graph.prototype.extend_dynamic_values = function (time) {
                var start = time.clone().startOf('day');
                var end = time.clone().endOf('day');
                if (start.isBefore(this.dynamic_values.start)) {
                    this.dynamic_values.start = start;
                }
                if (end.isAfter(this.dynamic_values.end)) {
                    this.dynamic_values.end = end;
                }
            };
            Graph.prototype.apply_time_span = function (value) {
                if (!value || value.length == 0)
                    return;
                this.time_point = moment(value[0], "x").endOf('day');
                this.time_point_end = moment(value[1], "x").endOf('day');
                //console.info("time_point", this.time_point.format("YYYY.MM.DD"));
                var is_any_affected = false;
                // apply changes
                //this.stop_layout();
                this.cytoscape().startBatch();
                for (var _i = 0, _a = this.dynamic_nodes; _i < _a.length; _i++) {
                    var el = _a[_i];
                    var visible = false;
                    var spells = el.data("spells");
                    if (spells) {
                        var affect_attributes = {};
                        for (var _b = 0, spells_1 = spells; _b < spells_1.length; _b++) {
                            var spell = spells_1[_b];
                            var check_start = Graph.match_time_point(this.time_point, spell.start, spell.end);
                            var check_end = Graph.match_time_point(this.time_point_end, spell.start, spell.end);
                            var check = Graph.match_time_point(spell.start, this.time_point, this.time_point_end);
                            if (typeof spell.for === 'string') {
                                // attribute life
                                if (check) {
                                    affect_attributes[spell.for] = spell.value;
                                }
                            } else {
                                // element life
                                visible = visible || check;
                            }
                        }
                        for (var _c = 0, spells_2 = spells; _c < spells_2.length; _c++) {
                            var spell = spells_2[_c];
                            if (typeof spell.for === 'string') {
                                var initial_value = el.data("_initial_" + spell.for);
                                if (typeof affect_attributes[spell.for] !== 'undefined') {
                                    // apply time affected value
                                    is_any_affected = true;
                                    if (typeof initial_value === 'undefined') {
                                        // save original value, if it's not saved yet
                                        var current_value = el.data(spell.for);
                                        el.data("_initial_" + spell.for, current_value);
                                    }
                                    el.data(spell.for, spell.value);
                                } else if (typeof initial_value !== 'undefined') {
                                    // revert initial value
                                    is_any_affected = true;
                                    el.data(spell.for, initial_value);
                                    el.removeData("_initial_" + spell.for);
                                }
                            }
                        }
                    }
                    if (visible) {
                        el.show();
                    } else {
                        el.hide();
                    }
                }
                this.cytoscape().endBatch();
                //this.start_layout();
                return is_any_affected;
            };
            Graph.match_time_point = function (time_point, start, end) {
                //console.info("match_time_point", time_point.format("YYYY.MM.DD"));
                if (start && end) {
                    // console.info("TO2",
                    // 	start.format("YYYY.MM.DD"),
                    // 	end.format("YYYY.MM.DD"),
                    // 	time_point.isBetween(start, end, 'day')
                    // );
                    return time_point.isBetween(start, end, 'day');
                } else if (start) {
                    // console.info("STARTS",
                    // 	start.format("YYYY.MM.DD"),
                    // 	time_point.isAfter(start, 'day')
                    // );
                    return time_point.isAfter(start, 'day');
                } else if (end) {
                    // console.info("ENDS",
                    // 	start.format("YYYY.MM.DD"),
                    // 	time_point.isBefore(end, 'day')
                    // );
                    return time_point.isBefore(end, 'day');
                }
                return true; // if no end and no start -- exists always
            };
            Graph.prototype.setup_geo_content = function () {
                var _this = this;
                this.geo_nodes = [];
               
                this.cy.nodes().each(function (i, node) {
                	if(node.data('labelV').toLowerCase() == 'location'){
                		var el = node.data();
                		  if (node.data('name')) {
                			  var geocoder = new google.maps.Geocoder();
				               var  latitude, longitude;
			            		geocoder.geocode( { 'address':node.data('name')}, function(results, status) {
			            			if (status == google.maps.GeocoderStatus.OK) {
			            				el.lat = results[0].geometry.location.lat();
			            				el.lon = results[0].geometry.location.lng();
			            				_this.geo_nodes.push(node);
			            				_this.init_map();
			            				window.vlaBuildingObjects.ui_panel.vertex_filter_label_form.set_control_enabled('map', true);
	            					}
								});   			            		
			            		
			            }
                	}
                });
                this.init_map();
            };
            Graph.prototype.init_map = function () {
                var _this = this;
                $.getScript("https://openlayers.org/en/v3.20.1/build/ol.js", function () {
                    var min_zoom_coeff = 0.000022667184963479284; //0.00005693739435028159
                    var min_zoom = _this.coords_scale * min_zoom_coeff;
                    _this.cytoscape().minZoom(min_zoom);
                    //this.cytoscape().maxZoom(1000);
                    // setup positions
                    for (var i = 0; i < _this.geo_nodes.length; i++)
                        _this.setup_geo_position(_this.geo_nodes[i]);
                });
            };
            Graph.prototype.vla_body = function (value) {
                var nodes = this.cy.$("node");
                if (value) {
                	 $(CurentVLAID).css({'background-color': '#F8F8FF'});
                    nodes.addClass('whiteTheme');
                    nodes.removeClass('grayTheme');
                } else {
                	$(CurentVLAID).css({'background-color': '#283c45'});
                    nodes.removeClass('whiteTheme');
                    nodes.addClass('grayTheme');
                }

            };
            Graph.prototype.map_mode = function (on) {
                var self = this;
                function pan_handler() {
                    self.sync_map_pan();
                }
                this.stop_layout();
                if (on) {
                    this.cytoscape().on("pan", pan_handler);
                    this.store_viewport();
                    this.show_map();
                    this.apply_geo_positions();
//                    this.cytoscape().fit(this.cytoscape().nodes(":locked"), 100);
                } else {
//                    this.restore_viewport();
                	 this.restore_viewport_by_me();
                    this.cytoscape().off("pan", pan_handler);
                    this.hide_map();
                    this.undo_geo_positions();
                }
            };

            Graph.prototype.store_viewport = function () {
                var ex = this.cytoscape().extent();
                this.temp_data.premap_pos = {x: ex.x1, y: ex.y1};
                this.temp_data.premap_zoom = this.cytoscape().zoom();
            };
            Graph.prototype.restore_viewport = function () {
                var c = this.temp_data.premap_pos;
                if (typeof c !== 'undefined') {
                    this.cytoscape().zoom(this.temp_data.premap_zoom); // important to zoom first
                    var tmp_node_data = {
                        group: "nodes",
                        data: {},
                        position: {x: c.x, y: c.y}
                    };
                    var tmp_node = this.cytoscape().add(tmp_node_data);
                    tmp_node.hide();
                    var pos = tmp_node.renderedPosition();
                    this.cytoscape().remove(tmp_node);
                    var delta = {x: pos.x * -1, y: pos.y * -1};
                    this.cytoscape().panBy(delta);
                }
            };
            Graph.prototype.restore_viewport_by_me = function () {
            	if(_ALLVLA.length > 0){
    				for(var i=0; i<_ALLVLA.length; i++){
    					_cy_ = _ALLVLA[i];
    					_cy_.layout({
    				        name: 'cola',
    				        nodeSpacing: 50,
    				        edgeLengthVal: 45,
    				        animate: true,
    				        randomize: false,
    				        maxSimulationTime: 1500
    				    });
    				}
    			}
            };
            Graph.prototype.show_map = function () {
                this.create_map_if_needed();
                this.map_div.show();
            };
            Graph.prototype.hide_map = function () {
                this.map_div.hide();
            };
            Graph.prototype.create_map_if_needed = function () {
                if (typeof this.map !== 'undefined')
                    return;
                var parent = this.parent_element; // .parent()
                this.map_div = $("<div>").addClass("vla-map").appendTo(parent);
                this.map_view = new ol.View({
                    center: [0, 0],
                    zoom: 6
                });
                this.map = new ol.Map({
                    layers: [
                        new ol.layer.Tile({
                            source: new ol.source.OSM()
                        })
                    ],
                    target: this.map_div[0],
                    controls: ol.control.defaults({
                        attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                            collapsible: false
                        })
                    }),
                    view: this.map_view
                });
                window['gmap'] = this.map;
                window['gview'] = this.map_view;
            };
            Graph.prototype.sync_map_pan = function () {
                var ex = this.cytoscape().extent();
                var cs = this.coords_scale;
                var line = new ol.geom.LineString([[ex.x1 * cs, ex.y1 * cs * -1], [ex.x2 * cs, ex.y2 * cs * -1]]);
                // line.transform('EPSG:4326', 'EPSG:3857');
                this.map_view.fit(line, this.map.getSize(), {
                    padding: [0, 0, 0, 0],
                    nearest: true,
                    constrainResolution: false
                });
            };
            Graph.prototype.is_geodata_available = function () {
                return this.geo_nodes.length > 0;
            };
            Graph.prototype.node_have_raw_geo_data = function (el) {
                if (window.global.page && window.global.page == "tI" && el.data('location')) {
                    var lat = (el.data('location').latitude) * 1;
                    var lon = (el.data('location').longitude) * 1;
                    return (!isNaN(lat) && !isNaN(lon));
                } else {
                    var lat = el.data('lat') * 1;
                    var lon = el.data('lon') * 1;
                    return (!isNaN(lat) && !isNaN(lon));
                }

            };
            Graph.prototype.node_have_geo_data = function (el) {
                return typeof this.geo_scratch(el).geo_coords !== 'undefined';
            };
            Graph.prototype.setup_geo_position = function (el) {
            	 if (window.global.page && window.global.page == "tI" && el.data('location')) {
                     var lat = (el.data('location').latitude) * 1;
                     var lon = (el.data('location').longitude) * 1;
                    
                 } else {
                     var lat = el.data('lat') * 1;
                     var lon = el.data('lon') * 1;
                   
                 }
                if (!isNaN(lat) && !isNaN(lon)) {
                    var coords = ol.proj.fromLonLat([lon, lat]);
                    var graph_coords = {x: coords[0] / this.coords_scale, y: coords[1] / this.coords_scale * -1};
                    this.geo_scratch(el).geo_coords = graph_coords;
                    return true;
                }
                return false;
            };
            Graph.prototype.apply_geo_positions = function () {
                var _this = this;
                // 1. save all positions
                this.cytoscape().nodes().each(function (i, node) {
                    var pos = node.modelPosition();
                    _this.geo_scratch(node).original_pos = {x: pos.x, y: pos.y};
                });
                // 2. set geo nodes positions
                for (var i = 0; i < this.geo_nodes.length; i++)
                    this.apply_geo_position(this.geo_nodes[i]);
                // 3. layout geo nodes neighbours
                this.layout_name = 'cola';
                this.update({
                    maxSimulationTime: 2500, stop: function () {
                        _this.cytoscape().nodes().removeScratch('cola');
                    }
                });
            };
            Graph.prototype.undo_geo_positions = function () {
                var _this = this;
                // 1. restore all positions
                this.cytoscape().nodes().each(function (i, node) {
                    _this.undo_geo_position(node);
                });
            };
            Graph.prototype.apply_geo_position = function (node) {
                var pos = node.modelPosition();
                this.geo_scratch(node).original_pos = {x: pos.x, y: pos.y};
                var geo_coords = this.geo_scratch(node).geo_coords;
                node.modelPosition(geo_coords);
                node.lock();
            };
            Graph.prototype.undo_geo_position = function (node) {
                var coords = this.geo_scratch(node).original_pos;
                node.unlock();
                node.modelPosition(coords);
                delete this.geo_scratch(node).original_pos;
            };
            Graph.prototype.geo_scratch = function (el) {
                var geo_scratch = el.scratch('_geo');
                if (typeof geo_scratch === 'undefined') {
                    el.scratch('_geo', {});
                }
                geo_scratch = el.scratch('_geo');
                return geo_scratch;
            };
            Graph.prototype.update = function (params) {
                //let is_new_layout = !this.layout || (this.layout && this.layout.options.name != this.layout_name);

                var _this = this;
                //this.stop_layout();
                var options = this.layout_options(this.layout_name);
                if (this.options.layout_options)
                    options = $.extend({}, this.layout_options(this.layout_name), this.options.layout_options);
                if (params)
                    options = $.extend({}, options, params);
                // to prevent name override
                options.name = this.layout_options(this.layout_name)['name'];
                if (this.cytoscape().nodes(":locked").length)
                    options.randomize = false;
                options.ready = function () {
                    _this.parent_element.trigger("layout-ready");
                };
                options.stop = function () {
                    _this.parent_element.trigger("layout-stop");
                    if (params && typeof params.stop !== 'undefined')
                        params.stop();
                };
                this.layout = this.cy.makeLayout(options);
                this.start_layout();
            };
            Graph.prototype.stop_layout = function () {
                var promise;
                if (this.layout) {
                    promise = this.cytoscape().promiseOn('layoutstop');
                    this.layout.stop();
                } else {
                    promise = Promise.resolve();
                }
                return promise;
            };
            Graph.prototype.start_layout = function () {
                if (this.layout)
                    this.layout.run();
            };
            Graph.prototype.set_layout = function (layout_name) {
                // if (layout_name === 'map') {
                // 	// if switching to map
                // 	if (this.layout_name !== 'map') // init only if realy switching
                // 		this.map_mode(true);
                //
                // 	return;
                // } else if (this.map_div && this.map_div.is(":visible")) {
                // 	// if switching from map
                // 	this.map_mode(false);
                // }
                this.layout_name = layout_name;
                if (this.cy)
                    this.update();
            };
            Graph.prototype.set_configurations = function (configuraion_value) {
                var nodes = this.cy.$("node");
                if (configuraion_value == 'nodeBackground') {
                    var nodes = this.cy.$("node");
                    nodes.addClass('risks');
                    nodes.removeClass('whiteTheme');
                    nodes.removeClass('nodewithoutBackground');
                }
                if (configuraion_value == 'nodewithoutBackground') {
                    var nodes = this.cy.$("node");
                    nodes.removeClass('risks');
                    nodes.removeClass('whiteTheme');
                    nodes.addClass('nodewithoutBackground');
                }
            };
            Graph.prototype.in_focus = function () {
                return this.parent_element.hasClass("vla-focused") && this.focus_target && this.focus_target.length > 0;
            };
            Graph.prototype.focus = function (node, depth) {
                var _this = this;
                if (depth === void 0) {
                    depth = 1;
                }
                // add focused=true property somewhere
                // may be we should store all hidden elements to not show everything, just what we hide here
                // mey be we should not show hidden neighbours
                this.clear_focus(false);
                this.parent_element.addClass("vla-focused");
                this.focus_target = node;
                var layoutPadding = 50;
                var layoutDuration = 500;
                // highlight
                var nhood = node; //.closedNeighborhood();
//                console.time("cycle");
                for (var i = 0; i < depth; i++) {
                    nhood = nhood.closedNeighborhood();
                    nhood = nhood.add(nhood.children().closedNeighborhood());
                    nhood = nhood.add(nhood.parent());
                }
//                console.timeEnd("cycle");
                //node.select();
                var cy = this.cy;
                cy.batch(function () {
                    // cy.elements().not( nhood ).removeClass('highlighted').addClass('faded');
                    // nhood.removeClass('faded').addClass('highlighted');
                    nhood.show();
                    _this.unfocused_elements = cy.elements().not(nhood).unselect().remove();
                    //this.update();
                    // var npos = node.position();
                    // var w = window.innerWidth;
                    // var h = window.innerHeight;
                    cy.stop().animate({
                        fit: {
                            eles: nhood,
                            padding: layoutPadding
                        }
                    }, {
                        duration: layoutDuration
                    });
                    // 	.delay( layoutDuration, function(){
                    // 	nhood.layout({
                    // 		name: 'concentric',
                    // 		padding: layoutPadding,
                    // 		animate: true,
                    // 		animationDuration: layoutDuration,
                    // 		boundingBox: {
                    // 			x1: npos.x - w/2,
                    // 			x2: npos.x + w/2,
                    // 			y1: npos.y - w/2,
                    // 			y2: npos.y + w/2
                    // 		},
                    // 		fit: true,
                    // 		concentric: function( n ){
                    // 			if( node.id() === n.id() ){
                    // 				return 2;
                    // 			} else {
                    // 				return 1;
                    // 			}
                    // 		},
                    // 		levelWidth: function(){
                    // 			return 1;
                    // 		}
                    // 	});
                    // } );
                });
            };
            ;
            Graph.prototype.focus_depth = function (depth) {
                this.focus(this.focus_target, depth);
            };
            Graph.prototype.clear_focus = function (do_layout_update) {
                var _this = this;
                if (do_layout_update === void 0) {
                    do_layout_update = false;
                }
                this.parent_element.removeClass("vla-focused");
                this.focus_target = null;
                // add clear focus ONLY if focused
                var cy = this.cy;
                cy.batch(function () {
                    // cy.$('.highlighted').forEach(function(n){
                    // 	n.animate({
                    // 		position: n.data('orgPos')
                    // 	});
                    // });
                    //cy.elements().removeClass('highlighted').removeClass('faded');
                    // cy.elements().show();
                    if (_this.unfocused_elements) {
                        _this.unfocused_elements.restore();
                    }
                    if (do_layout_update)
                        _this.update();
                });
            };
            Graph.icons = function () {
                // if (typeof Graph._icons == 'undefined') {
                // 	Graph._icons = {};
                // 	// Graph._icons['undefined'] = String.fromCharCode(0xf128);
                // 	Graph._icons['no icon'] = '';
                //
                // 	let reg = new RegExp("^\\.fa-([^:]*)::before$");
                //
                // 	for (let i = 0; i< document.styleSheets.length; i++) {
                // 		let styleSheet = document.styleSheets[i];
                // 		let classes = styleSheet['rules'] || styleSheet['cssRules'];
                //
                // 		for (let x = 0; x < classes.length; x++) {
                // 			if (typeof classes[x].selectorText != 'string')
                // 				continue;
                //
                // 			let match = classes[x].selectorText.match(reg);
                // 			if (match) {
                // 				//console.warn("css ---- ", classes[x].selectorText, (classes[x].cssText) ? classes[x].cssText : classes[x].style.cssText );
                // 				if (!classes[x].style || !classes[x].style.content)
                // 					continue;
                // 				let icon = classes[x].style.content;
                // 				if (icon.length==3)
                // 					icon = icon[1];
                // 				Graph._icons[match[1]] = icon;
                // 			}
                // 		}
                // 	}
                // }
                // return Graph._icons;
                return VLA.UI.icons_set;
            };
            Graph.icon = function (name) {
                var code = Graph.icons()[name];
                if (typeof code === 'undefined')
                    code = Graph.icons()['no icon'];
                return code;
            };
            Graph.icon_name = function (icon) {
                var name = "";
                var icons = Graph.icons();
                for (var key in icons) {
                    if (!icons.hasOwnProperty(key))
                        continue;
                    if (icons[key] == icon)
                        return key;
                }
                return name;
            };
            Graph.prototype.layout_options = function (layout_name) {
                var layouts = {};
                // The null layout puts all nodes at (0, 0). It’s useful for debugging purposes.
                layouts['null'] = {
                    name: 'null',
                    ready: function () {
                    },
                    stop: function () {
                    } // on layoutstop
                };
                // The random layout puts nodes in random positions within the viewport.
                layouts['random'] = {
                    name: 'random',
                    fit: false,
                    padding: 30,
                    boundingBox: undefined,
                    animate: false,
                    animationDuration: 500,
                    animationEasing: undefined,
                    ready: undefined,
                    stop: undefined // callback on layoutstop,
                };
                // The preset layout puts nodes in the positions you specify manually.
                layouts['preset'] = {
                    name: 'preset',
                    positions: undefined,
                    zoom: undefined,
                    pan: undefined,
                    fit: false,
                    padding: 30,
                    animate: false,
                    animationDuration: 500,
                    animationEasing: undefined,
                    ready: undefined,
                    stop: undefined // callback on layoutstop
                };
                // Compound Spring Embedder
                layouts['cose'] = {
                    name: 'cose',
                    // Called on `layoutready`
                    ready: function () {
                    },
                    // Called on `layoutstop`
                    stop: function () {
                    },
                    // Whether to animate while running the layout
                    animate: true,
                    // The layout animates only after this many milliseconds
                    // (prevents flashing on fast runs)
                    animationThreshold: 250,
                    // Number of iterations between consecutive screen positions update
                    // (0 -> only updated on the end)
                    refresh: 20,
                    // Whether to fit the network view after when done
                    fit: false,
                    // Padding on fit
                    padding: 30,
                    // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
                    boundingBox: undefined,
                    // Randomize the initial positions of the nodes (true) or use existing positions (false)
                    randomize: true,
                    // Extra spacing between components in non-compound graphs
                    componentSpacing: 100,
                    // Node repulsion (non overlapping) multiplier
                    nodeRepulsion: function (node) {
                        return 400000;
                    },
                    // Node repulsion (overlapping) multiplier
                    nodeOverlap: 20,
                    // Ideal edge (non nested) length
                    idealEdgeLength: function (edge) {
                        return 100;
                    },
                    // Divisor to compute edge forces
                    edgeElasticity: function (edge) {
                        return 100;
                    },
                    // Nesting factor (multiplier) to compute ideal edge length for nested edges
                    nestingFactor: 5,
                    // Gravity force (constant)
                    gravity: 80,
                    // Maximum number of iterations to perform
                    numIter: 1000,
                    // Initial temperature (maximum node displacement)
                    initialTemp: 200,
                    // Cooling factor (how the temperature is reduced between consecutive iterations
                    coolingFactor: 0.95,
                    // Lower temperature threshold (below this point the layout will end)
                    minTemp: 1.0,
                    // Whether to use threading to speed up the layout
                    useMultitasking: true,
                    avoidOverlap: true
                };
                layouts['cose-bilkent'] = {
                    name: 'cose-bilkent',
                    // Called on `layoutready`
                    ready: function () {
                    },
                    // Called on `layoutstop`
                    stop: function () {
                    },
                    // Whether to fit the network view after when done
                    fit: false,
                    // Padding on fit
                    padding: 10,
                    // Whether to enable incremental mode
                    randomize: true,
                    // Node repulsion (non overlapping) multiplier
                    nodeRepulsion: 4500,
                    // Ideal edge (non nested) length
                    idealEdgeLength: 50,
                    // Divisor to compute edge forces
                    edgeElasticity: 0.45,
                    // Nesting factor (multiplier) to compute ideal edge length for nested edges
                    nestingFactor: 0.1,
                    // Gravity force (constant)
                    gravity: 0.25,
                    // Maximum number of iterations to perform
                    numIter: 2500,
                    // For enabling tiling
                    tile: true,
                    // Type of layout animation. The option set is {'during', 'end', false}
                    animate: 'during',
                    // Represents the amount of the vertical space to put between the zero degree members during the tiling operation(can also be a function)
                    tilingPaddingVertical: 10,
                    // Represents the amount of the horizontal space to put between the zero degree members during the tiling operation(can also be a function)
                    tilingPaddingHorizontal: 10,
                    // Gravity range (constant) for compounds
                    gravityRangeCompound: 1.5,
                    // Gravity force (constant) for compounds
                    gravityCompound: 1.0,
                    // Gravity range (constant)
                    gravityRange: 3.8,
                    avoidOverlap: true
                };
                layouts['grid'] = {name: 'grid', animate: true, avoidOverlap: true};
                layouts['concentric'] = {
                    name: 'concentric',
                    fit: false,
                    padding: 30,
                    startAngle: 3 / 2 * Math.PI,
                    sweep: undefined,
                    clockwise: true,
                    equidistant: false,
                    minNodeSpacing: 20,
                    boundingBox: undefined,
                    avoidOverlap: true,
                    height: undefined,
                    width: undefined,
                    concentric: function (node) {
                    	if(window.global.page == "customerPage"){
                    		return customerLevelsforLeadGen[node.data().labelV]?customerLevelsforLeadGen[node.data().labelV]:1;
                    	}
                        return node.degree();
                    },
                    levelWidth: function (nodes) {
                        return nodes.maxDegree() / 4;
                    },
                    animate: true,
                    animationDuration: 500,
                    animationEasing: undefined,
                    ready: undefined,
                    stop: undefined // callback on layoutstop
                };
                layouts['spread'] = {
                    name: 'spread',
                    animate: true, // whether to show the layout as it's running
                    ready: undefined, // Callback on layoutready
                    stop: undefined, // Callback on layoutstop
                    fit: false, // Reset viewport to fit default simulationBounds
                    minDist: 20, // Minimum distance between nodes
                    padding: 20, // Padding
                    expandingFactor: -1.0, // If the network does not satisfy the minDist
                    // criterium then it expands the network of this amount
                    // If it is set to -1.0 the amount of expansion is automatically
                    // calculated based on the minDist, the aspect ratio and the
                    // number of nodes
                    maxFruchtermanReingoldIterations: 50, // Maximum number of initial force-directed iterations
                    maxExpandIterations: 4, // Maximum number of expanding iterations
                    boundingBox: undefined, // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
                    randomize: false // uses random initial node positions on true
                };
                layouts['breadthfirst'] = {
                    name: 'breadthfirst',
                    fit: false,
                    directed: false,
                    padding: 150,
                    circle: false,
                    spacingFactor: 3.75,
                    boundingBox: undefined,
                    avoidOverlap: true,
                    roots: undefined,
                    maximalAdjustments: 0,
                    animate: true,
                    animationDuration: 500,
                    animationEasing: undefined,
                    ready: undefined,
                    stop: undefined // callback on layoutstop
                };
                layouts['breadthfirst_c'] = $.extend({}, layouts['breadthfirst'], {
                    name: 'breadthfirst',
                    fit: false,
                    circle: true,
                    avoidOverlap: true
                });
                layouts['cola'] = {
                    name: 'cola',
                    nodeSpacing: 50,
                    edgeLengthVal: 45,
                    animate: true,
                    randomize: false,
                    maxSimulationTime: 1500

                };
                layouts['cola_inf'] = $.extend({}, layouts['cola'], {
                    name: 'cola',
                    fit: false,
                    ungrabifyWhileSimulating: false,
                    infinite: true, // overrides all other options for a forces-all-the-time mode
                    avoidOverlap: true
                });
                layouts['cytoscape-ngraph.forcelayout'] = {
                    name: 'cytoscape-ngraph.forcelayout',
                    async: {
                        // tell layout that we want to compute all at once:
                        maxIterations: 1000,
                        stepsPerCycle: 30,
                        // Run it till the end:
                        waitForStep: false
                    },
                    physics: {
                        /**
                         * Ideal length for links (springs in physical model).
                         */
                        springLength: 300,
                        /**
                         * Hook's law coefficient. 1 - solid spring.
                         */
                        springCoeff: 0.0008,
                        /**
                         * Coulomb's law coefficient. It's used to repel nodes thus should be negative
                         * if you make it positive nodes start attract each other :).
                         */
                        gravity: -5.2,
                        /**
                         * Theta coefficient from Barnes Hut simulation. Ranged between (0, 1).
                         * The closer it's to 1 the more nodes algorithm will have to go through.
                         * Setting it to one makes Barnes Hut simulation no different from
                         * brute-force forces calculation (each node is considered).
                         */
                        theta: 0.8,
                        /**
                         * Drag force coefficient. Used to slow down system, thus should be less than 1.
                         * The closer it is to 0 the less tight system will be.
                         */
                        dragCoeff: 0.02,
                        /**
                         * Default time step (dt) for forces integration
                         */
                        timeStep: 20,
                        iterations: 10000,
                        fit: true,
                        /**
                         * Maximum movement of the system which can be considered as stabilized
                         */
                        stableThreshold: 0.000009
                    },
                    iterations: 10000,
                    refreshInterval: 16,
                    refreshIterations: 10,
                    stableThreshold: 2,
                    animate: true,
                    fit: true
                };
                return layouts[layout_name];
            };
            ;
            Graph.prototype.snapshot_image = function (format, only_selected) {
                if (only_selected === void 0) {
                    only_selected = false;
                }
                if (format != 'png' && format != 'jpg') {
//                    console.error("unsupported format:", format);
                    return "";
                }
                if (!only_selected) {
                    return this.cy[format]({bg: 'white', full: true});
                } else {
                    var selected = this.cy.$(":selected");
                    selected = selected.add(selected.children());
                    var all_else = this.cy.$(":visible").difference(selected);
                    var selected_connections = selected.edgesWith(selected); // edges between selected nodes
                    all_else.not(selected_connections).hide();
                    this.cy.fit(selected, 100);
                    var img64 = this.cy.png({bg: 'black', full: false});
                    all_else.show();
                    return img64;
                }
            };
            Graph.prototype.snapshot_json_all = function () {
                return this.cy.json();
            };
            Graph.prototype.snapshot_json_selected = function () {
                var selected = this.cy.filter(":selected");
                selected = selected.add(selected.children());
                return selected.jsons();
            };
            Graph.prototype.snapshot_gexf_selected = function () {
                var selected = this.cy.filter(":selected");
                selected = selected.add(selected.children());
                return this.snapshot_gexf(selected);
            };
            Graph.prototype.snapshot_gexf_all = function () {
                return this.snapshot_gexf(this.cy.elements());
            };
            Graph.prototype.snapshot_gexf = function (elements) {
                var nodes = [];
                var edges = [];
                var nodes_attributes = [];
                var all_attributes = {};
                // collect attibutes
                elements.filter("node").forEach(function (node) {
                    var node_data = node.data();
                    for (var key in node_data) {
                        if (!node_data.hasOwnProperty(key))
                            continue;
                        if (all_attributes[key])
                            continue;
                        all_attributes[key] = "string";
                    }
                });
                elements.filter("node").forEach(function (node) {
                    var gexf_node = {
                        id: node.id(),
                        label: node.data("_label"),
                        attributes: {}
                    };
                    var node_data = node.data();
                    var attr_id = 0;
                    for (var key in all_attributes) {
                        if (!all_attributes.hasOwnProperty(key))
                            continue;
                        var value = node_data[key];
                        if (typeof value != 'undefined') {
                            gexf_node.attributes[attr_id] = value;
                        }
                        attr_id++;
                    }
                    nodes.push(gexf_node);
                });
                var attr_id = 0;
                for (var attr_name in all_attributes) {
                    if (!all_attributes.hasOwnProperty(attr_name))
                        continue;
                    nodes_attributes.push({
                        id: attr_id,
                        title: attr_name,
                        type: all_attributes[attr_name]
                    });
                    attr_id++;
                }
                elements.filter("edge").forEach(function (edge) {
                    var gexf_edge = {
                        id: edge.id(),
                        source: edge.source().id(),
                        target: edge.target().id(),
                    };
                    edges.push(gexf_edge);
                });
                var myGexf = gexf.create({
                    model: {
                        node: nodes_attributes
                    },
                    nodes: nodes,
                    edges: edges
                });
                return myGexf.serialize();
            };
            Graph.prototype.selected_elements = function () {
                return this.cy.elements(":selected");
            };
            Graph.prototype.selected_nodes = function () {
                return this.cy.nodes(":selected");
            };
            Graph.prototype.selected_edges = function () {
                return this.cy.edges(":selected");
            };
            Graph.prototype.connect_nodes = function (source, target) {
                this.actions.do("connect", {source: source, target: target});
            };
            Graph.prototype._connect_nodes = function (source, target) {
                var _this = this;
                this.cytoscape().startBatch();
                var collection = this.cytoscape().collection();
                source.forEach(function (n) {
                    var edge = {
                        data: {
                            source: n.id(),
                            target: target.id(),
                        },
                        group: "edges",
                    };
                    var e = _this.cy.add(edge);
                    e.data("_type", "_default");
                    collection = collection.add(e);
                });
                if (this.options.default_connection_type)
                    this.set_edge_type(collection, this.options.default_connection_type);
                this.cytoscape().endBatch();
                this.highlight_element_neighbourhood(source.filter(":selected"));
                this.highlight_element_neighbourhood(target.filter(":selected"));
                return collection;
            };
            Graph.prototype.group_nodes = function (nodes) {
                var cy_group;
                if (nodes.filter(":parent").length) {
                    cy_group = nodes.filter(":parent");
                } else {
                    var group = {data: {}};
                    var bbox = nodes.boundingBox({
                        includeNodes: true,
                        includeLabels: false,
                        includeShadows: false
                    });
                    var center = {
                        x: bbox.x1 + bbox.w / 2,
                        y: bbox.y1 + bbox.h / 2,
                    };
                    group.data['_label'] = "";
                    group['position'] = center;
                    cy_group = this.cytoscape().add(group);
                    cy_group.addClass("compound");
                }
                this.change_nodes_parent(nodes, cy_group);
                cy_group.select();
                // this.update();
            };
            Graph.prototype.change_nodes_parent = function (nodes, parent) {
                var _this = this;
                this.cytoscape().batch(function () {
                    // nodes.remove();
                    var new_edges = [];
                    nodes.deselect();
                    nodes.forEach(function (n) {
                        var this_is_compound_node_or_child = (n.isParent() || (parent && n.isChild()));
                        var same_parent = (!parent && !n.parent()) || (parent && parent.id() == n.parent().id());
                        if (this_is_compound_node_or_child || same_parent)
                            return;
                        var node = n.json();
                        if (parent)
                            node.data.parent = parent.id();
                        else
                            delete node.data.parent;
                        // TODO: bug - sometimes nodes became ungrabbable
                        node.grabbable = true; // hack...
                        var edges = n.connectedEdges();
                        edges.forEach(function (e) {
                            var edge = e.json();
                            new_edges.push(edge);
                        });
                        edges.remove();
                        // remove original
                        n.remove();
                        // add modified clone
                        _this.cytoscape().add(node);
                    });
                    if (new_edges.length) {
                        for (var _i = 0, new_edges_1 = new_edges; _i < new_edges_1.length; _i++) {
                            var edge = new_edges_1[_i];
                            _this.cytoscape().add(edge);
                        }
                    }
                });
            };
            Graph.prototype.ungroup_nodes = function (nodes) {
                if (nodes.isParent()) {
                    nodes.deselect();
                    var child_nodes = nodes.children();
                    this.change_nodes_parent(child_nodes, null);
                    nodes.remove();
                } else {
                    var parent_node = nodes.parent();
                    parent_node.deselect();
                    this.change_nodes_parent(nodes, null);
                    if (parent_node.children().length == 0)
                        parent_node.remove();
                }
            };
            Graph.prototype.is_group = function (node) {
                return node.isParent();
            };
            Graph.prototype.is_inside_group = function (node) {
                return node.isChild();
            };
            Graph.prototype.hide_elements = function (collectionElements) {
                return this.actions.do("hide", collectionElements);
            };
            Graph.prototype.new_search = function (collectionElements) {
                if (collectionElements.data('name') != void 0) {
                    var data = {
                        "fetchers": ["49", "9", "13"],
                        "keyword": collectionElements.data('name'),
                        "searchType": "Company",
                        "lightWeight": true,
                        "saveGraph": true
                    };
//                    global.init(data);
//                    window.location.search = collectionElements.data('name')
//                    window.location.href = '#/linkAnalysis/q=' + collectionElements.data('name');
                    if (window.global.page && window.global.page == "tI") {
                    	var url = window.location.href.split("/transactionIntelligence/#!/")[0] + "/#/linkAnalysis?q=" + (collectionElements.data('search-name')?collectionElements.data('search-name'):collectionElements.data('name'));
                        
                    }else{
                    	var url = window.location.href.split("/#/")[0] + "/#/linkAnalysis?q=" + collectionElements.data('name');
                        
                    }
                     var win = window.open(url, '_blank');
                    win.focus();
                }

            };
            Graph.prototype._hide_elements = function (collectionElements) {
                var affectedElements = this.cytoscape().collection().union(collectionElements);
                if (collectionElements.isParent()) {
                    affectedElements = affectedElements.union(collectionElements.children());
                }
                //collectionElements.unselect().hide();
                affectedElements.unselect().hide();
                return affectedElements;
            };
            Graph.prototype.remove = function (collectionElements) {
                collectionElements.unselect(); //.remove();
                this.actions.do("remove", collectionElements);
                // update layout
                // this.update();
            };
            Graph.prototype.find_shortest_path = function (source, target) {
                var res = this.cytoscape().elements().aStar({root: source, goal: target});
                this.cytoscape().elements().removeClass("path-highlight");
                if (res.found) {
                    res.path.addClass("path-highlight");
                }
            };
            Graph.prototype.mark_degreeCentrality = function (elements) {
                var dc = elements.degreeCentralityNormalized({directed: false});
                elements.css({'background-color': "#ffffff"});
                elements.forEach(function (node) {
                    var value = dc.degree(node);
                    // node.css({'background-opacity': value});
                    node.css({'background-blacken': value});
                });
            };
            Graph.prototype.mark_betweennessCentrality = function (elements) {
                // let ccn = elements.closenessCentralityNormalized();
                //
                // elements.forEach((node) => {
                // 	let closeness = ccn.closeness(node);
                // });
                var bc = elements.betweennessCentrality();
                elements.css({'background-color': "#ffffff"});
                elements.forEach(function (node) {
                    var value = bc.betweennessNormalized(node);
                    // node.css({'background-opacity': value});
                    node.css({'background-blacken': value});
                });
            };
            Graph.prototype.mark_closenessCentrality = function (elements) {
                var ccn = elements.closenessCentralityNormalized();
                elements.css({'background-color': "#ffffff"});
                elements.forEach(function (node) {
                    var value = ccn.closeness(node);
                    // node.css({'background-opacity': value});
                    node.css({'background-blacken': value});
                });
            };
            Graph.prototype.articleSearch = function (element) {
                window.global.openArticleModal(element);
            };

            Graph.prototype.entityPage = function (element) {
                if (element == void 0)
                    return;
                if (window.global.page && window.global.page == "tI") {
                	var url = window.location.href.split("/transactionIntelligence/#!/")[0] + "/entity/#!/"+(element.data('type') == "IND"? 'person':'company')+"/" + (element.data('search-name')?element.data('search-name'):element.data('name'));
                    
                }else{
                	var url = window.location.href.split("/#/")[0] + "/entity/#!/company/" + element.data('name');
                }
                 var win = window.open(url, '_blank');
                win.focus();
               };

            Graph.prototype.unmark_centrality = function () {
                this.cytoscape().elements().removeCss();
                this.cytoscape().style().update();
            };
            Graph.prototype.clustering = function () {
                var clusters = this.cytoscape().elements().markovCluster({
                    expandFactor: 2,
                    inflateFactor: 1,
                    multFactor: 1,
                    maxIterations: 10,
                    attributes: [
                        function (edge) {
                            var w = parseFloat(edge.data('weight'));
                            if (isNaN(w))
                                w = 1;
                            return w;
                        }
                    ]
                });
                // TODO: add palette?
                // Assign random colors to each cluster!
                for (var c = 0; c < clusters.length; c++) {
                    clusters[c].style('background-color', '#' + Math.floor(Math.random() * 16777215).toString(16));
                }
            };
            return Graph;
        }());
        UI.Graph = Graph;
    })(UI = VLA.UI || (VLA.UI = {}));
})(VLA || (VLA = {}));
/// <reference path="libs/jquery.d.ts" />
/// <reference path="libs/cytoscape.d.ts" />
/// <reference path="vla_ui_graph.ts" />
var VLA;
(function (VLA) {
    var DataServer = (function () {
        function DataServer(userId) {
            this._userId = userId;
            this.graph_ready_deferred = $.Deferred();
            this.graph_ready = this.graph_ready_deferred.promise();
        }
        DataServer.prototype.graph = function () {
            return this._graph;
        };
        DataServer.prototype.set_graph_object = function (graph) {
            this._graph = graph;
            this.graph_ready_deferred.resolve();
        };
        DataServer.prototype.add_data_on_graph = function () {
            if (!this.graph()){
            	
            }
//                console.error("GRAPH NOT READY! trying to load data to undefined graph object, too early");
            // this.import_raw_data();
        };
        // getRemote(params:VLA.ImportOptions): JQueryPromise<void> {
        //
        // 	//$.ajax({ url: "http://188.166.40.105:8080/elementexploration-1.0.7-SNAPSHOT/rest/api/caseseed/getData", data:{caseSeedId: this.caseSeedId, limit:1000}, dataType: "json", type:"GET" })
        // 	// $.ajax({ url: "graph.php", data:{}, dataType: "jsonp" })
        // 	//$.ajax({ url: "sample_norm.json", data:{}, dataType: "json" })
        // 	$.ajax({url: "getData_12.json", data: {}, dataType: "json"})
        // 		.then((data:getDataResponse) => {
        //
        // 			if (!data.vertices) {
        // 				// {"type":"unknown-exception","class":"com.orientechnologies.orient.core.exception.OStorageException"}
        // 				console.error("data not loaded", data);
        // 				this.raw_data_loading_progress.reject();
        // 				return;
        // 			}
        //
        // 			this.raw_data = data;
        //
        // 			this.raw_data_loading_progress.resolve();
        // 		}, function (status) {
        // 			this.raw_data_loading_progress.reject(status);
        // 		});
        //
        //
        // 	// $.ajax({url: "getRiskDataByCaseId_12.json", data: {}, dataType: "json"})
        // 	// 	.then((data:getRiskDataByCaseResponse) => {
        // 	// 		if (!data.status || data.status != 200) {
        // 	// 			console.error("data.status!=200, status:", data.status);
        // 	// 		}
        // 	//
        // 	// 		if (!data.body) {
        // 	// 			// {"type":"unknown-exception","class":"com.orientechnologies.orient.core.exception.OStorageException"}
        // 	// 			console.error("data not loaded", data);
        // 	// 			return;
        // 	// 		}
        // 	//
        // 	// 		this.risks_data = data;
        // 	// 		this.risks_data_loading_progress.resolve();
        // 	//
        // 	// 	}, function (status) {
        // 	// 		this.risks_data_loading_progress.reject(status);
        // 	// 	});
        //
        // 	// $.when(this.raw_data_import_progress, this.risks_data_loading_progress)
        // 	// 	.then(() => {
        // 	// 		console.info("addLoadedRisks!");
        // 	// 		this.addLoadedRisks();
        // 	// 	});
        //
        //
        // 	return this.raw_data_loading_progress.promise();
        // };
        DataServer.prototype.load_and_import = function (params) {
            if (params.type == 'json')
                return this.load_and_import_elementexploration_json(params);
            else if (params.type == 'gexf')
                return this.load_and_import_gexf(params);
            else if (params.type == 'cytoscape')
                return this.load_and_import_cytoscape_json(params);
            else if (params.type == 'test_crowd')
                return this.load_and_import_test_crowd(params);
        };
        DataServer.prototype.load_and_import_elementexploration_json = function (params) {
            var _this = this;
            var load_and_import_progress = $.Deferred();
            var load_promise;
            if (params.url)
                load_promise = $.ajax({url: params.url, dataType: "json"});
            else if (params.queryParams) {
            	if(location.hash.indexOf('#!/tI') == -1  && window.current_data ){
            		var load_promise = $.Deferred();
            		window.load_promiseAfterRisk(window.current_data, _this);
            		_this.import_elementexploration_json(window.current_data, load_and_import_progress);
            	}	
            	else{
            		load_promise = elementexploration.query_getData(params.caseId, params.limit, params.queryPath, params.token);
            		elementexploration.load_promiseswithRisk(load_promise, params, _this);
            	}
            } else if (params.caseId && params.limit) {
                load_promise = elementexploration.json_getData(params.caseId, params.limit);
                elementexploration.load_promises(load_promise, params, _this);
            } else {
//                console.error("wrong import params");
                load_and_import_progress.reject("wrong import params");
                return load_and_import_progress.promise();
            }
            	 load_promise.then(function (data) {
            		 if(window.global.page == "customerPage"){
                 		data = getCustomerPageData(data);
                 	 }
                     if (!data.vertices) {
//                         console.error("unexpected server response", data);
                         if (data.error)
                             load_and_import_progress.reject(data.error);
                         else
                             load_and_import_progress.reject(data);
                         return;
                     }
                     _this.import_elementexploration_json(data, load_and_import_progress);
                 }, function (xmlhttprequest, textstatus, message) {
                     var add_source = "";
                     if (params.url)
                         add_source = params.url;
                     else if (params.caseId)
                         add_source = params.caseId;
                     load_and_import_progress.reject(textstatus, add_source + ":" + message);
                 });
           
            return load_and_import_progress.promise();
        };
        DataServer.prototype.import_elementexploration_json = function (data, progress) {

            //code for merge data if transaction analysis page starts here
            if (window.global.page && window.global.page == "tI") {
            	if((CurentVLAID == "#vlaCompare1" || CurentVLAID =="#vlaCompare2") && window.global.vlaData[CurentVLAID]){
            		mergeByProperty(data.edges, window.global.vlaData[CurentVLAID].edges, 'id');
                    mergeByProperty(data.vertices, window.global.vlaData[CurentVLAID].vertices, 'id');
            	}else{          	  
	                if (window.global.vlaData['#vla']) {
	                    mergeByProperty(data.edges, window.global.vlaData['#vla'].edges, 'id');
	                    mergeByProperty(data.vertices, window.global.vlaData['#vla'].vertices, 'id');
	
	                } else {
	                    if (window.global.expandedNodes[CurentVLAID]) {
	                    	 loadExpandedNodeDetails(CurentVLAID,window.global.expandedNodes[CurentVLAID]);
	                    }
	                }
            	
	              //dummy data code for petro starts
	            	if(window.global.isstatic){
	            		data = filterData(data);
	            	}  //dummy data code for petro ends
	            	else
	            	data = handleRiskScore(data)
	            	
	                window.global.vlaData[CurentVLAID] = jQuery.extend(true, {}, data);
            	
	            	plotCountriesInTransactionAnalysis(CurentVLAID);
            	}
            }else{
            	data = handleRiskScore(data);
            	 plotCountriesInlinkAnalysis(jQuery.extend(true, {}, data));
            }
            //code for merge data if transaction analysis page ends here
            var _this = this;
            this.graph_ready.then(function () {
                _this.graph().batch(function () {
                    var weightsAr = {};
                    for (var _b = 0, _c = data.edges; _b < _c.length; _b++) {
                        var k = _c[_b];
                        weightsAr[k.from] = k.weight;
                        weightsAr[k.to] = k.weight;
                    }
//                    console.time("import elementexploration data");
                    for (var _i = 0, _a = data.vertices; _i < _a.length; _i++) {
                        var k = _a[_i];
                        if(!window.global.isstatic)
                        k.weight = weightsAr[k.id]
                        _this.graph().add(elementexploration.json_node_toCytoscape(k));
                    }
                    for (var _b = 0, _c = data.edges; _b < _c.length; _b++) {
                        var k = _c[_b];
                        _this.graph().add(elementexploration.json_edge_toCytoscape(k));
                    }
//                    console.info("n/e", data.vertices.length, data.edges.length);
//                    console.timeEnd("import elementexploration data");
                    progress.resolve();
                });
            });
        };
        DataServer.prototype.load_and_import_gexf = function (params) {
            var _this = this;
            var load_and_import_progress = $.Deferred();
            $.ajax({url: params.url, data: {}, dataType: "xml"})
                    .then(function (data) {
                        _this.import_gexf(data, load_and_import_progress);
                    }, function (status) {
                        load_and_import_progress.reject(status);
                    });
            return load_and_import_progress.promise();
        };
        DataServer.prototype.import_gexf = function (xmlDoc, progress) {
            var _this = this;
            var error = null;
            if (xmlDoc['parseError'] && xmlDoc['parseError'].errorCode != 0) {
                var parseError = xmlDoc['parseError'];
                error = "XML Parsing Error: " + parseError.reason
                        + " at line " + parseError.line
                        + " at position " + parseError.linepos;
            } else {
                if (xmlDoc.documentElement) {
                    if (xmlDoc.documentElement.nodeName == "parsererror") {
                        error = xmlDoc.documentElement.childNodes[0].nodeValue;
                    }
                }
            }
            if (error) {
                progress.reject(error);
                return;
            }
            this.graph_ready.then(function () {
                _this.graph().batch(function () {
//                    console.time("import gefx document");
                    var nodes_attributes_map = gexf_reader.attributes_map(xmlDoc, 'node');
                    // nodes
                    var nodes_tags = xmlDoc.getElementsByTagName("node");
                    for (var i = 0; i < nodes_tags.length; i++) {
                        _this.graph().add(gexf_reader.node_toCytoscape(nodes_tags[i], nodes_attributes_map));
                    }
                    var edges_tags = xmlDoc.getElementsByTagName("edge");
                    for (var i = 0; i < edges_tags.length; i++) {
                        _this.graph().add(gexf_reader.edge_toCytoscape(edges_tags.item(i)));
                    }
//                    console.info("n/e", nodes_tags.length, edges_tags.length);
//                    console.timeEnd("import gefx document");
                    progress.resolve();
                });
            });
        };
        DataServer.prototype.load_and_import_cytoscape_json = function (params) {
            var _this = this;
            var load_and_import_progress = $.Deferred();
            var load_promise;
            load_promise = $.ajax({url: params.url, dataType: "json"});
            load_promise.then(function (data) {
                _this.graph().startBatch();
                _this.graph().add(data.elements);
                _this.graph().endBatch();
                load_and_import_progress.resolve();
            }, function (status) {
                load_and_import_progress.reject(status);
            });
            return load_and_import_progress.promise();
        };
        // addLoadedRisks() {
        // 	let data = this.risks_data;
        // 	this.graph().batch(() => {
        // 		console.time("addLoadedRisks");
        // 		let affected = 0;
        // 		for (let row of data.body)
        // 		{
        // 			if (row.vertex) {
        // 				let node = this.graph().filter("[id='" + row.vertex+"']");
        // 				if (node.length) {
        // 					node.data("risks", row);
        // 					affected++;
        // 				}
        // 			}
        // 		}
        // 		console.timeEnd("addLoadedRisks");
        // 	});
        // }
        /*
         Use the user IDs 21220 or 21238 for testing purpose. Please treat all parameters as UTF-8 strings and never as numbers.
         */
        DataServer.prototype.upload_document_data = function (filename, filecontent, remarks) {
            // let url = "http://188.166.40.105:8080/elementexploration-1.0.7-SNAPSHOT/rest/api/";
            // let command = "commonStorageDocument/uploadDocument";
            // csid:this.caseSeedId
            $.ajax({url: "upload.php", data: {uid: this._userId, f: filename, d: filecontent}, method: "POST"})
                    .then(function (response) {
//                        console.info("response", response);
                        if (response.substr(0, 2) == 'OK') {
                            var fn = response.split(",")[1];
                            document.location.href = "file.php?fn=" + encodeURIComponent(fn) + "&f=" + encodeURIComponent(filename);
                        }
                    }, function (evt, data) {
//                        console.error("error");
//                        console.error("evt", evt);
//                        console.error("data", data);
                    });
            //?userId=21220&remarks=xxxx&fileTitle=yyyy
        };
        DataServer.prototype.get_documents_list = function () {
            // commonStorageDocument/myDocuments?userId=1&caseseedId=1&orderBy=uploadedOn&orderIn={asc|desc}&pageNumber=1&recordsPerPage=10
            // caseseedId, orderBy, orderIn, pageNumber, recordsPerPage are optional
            // $fields = array('docId','title','remark','size','type','uploadedOn','uploadedBy','modifiedBy','modifiedOn','docName');
            /*
             [paginationInformation] => stdClass Object
             (
             [title] => /elementexploration-1.0.7-SNAPSHOT/rest/api/commonStorageDocument/myDocuments
             [kind] => list
             [totalResults] => 18
             [count] => 8
             [index] => 2
             [startIndex] => 0
             [inputEncoding] => utf-8
             [outputEncoding] => utf-8
             )
             */
        };
        DataServer.prototype.load_and_import_test_crowd = function (params) {
            var _this = this;
            var load_and_import_progress = $.Deferred();
            this.graph_ready.then(function () {
                var cy = _this.graph();
                var num_vertices = params.v || 10;
                var vertices_added = 1;
                var v = {
                    data: {
                        id: "n0"
                    },
                    position: {
                        x: 0,
                        y: 0
                    }
                };
                var leafs = [cy.add(v)];
                vertices_added++;
                while (vertices_added < num_vertices) {
                    var next_leafs = [];
                    for (var i = 0; i < leafs.length; i++) {
                        var local_root = leafs[i];
                        var num_leafs = Math.random() * 5;
                        for (var ei = 0; ei < num_leafs; ei++) {
                            var v_1 = {
                                data: {
                                    id: "n" + vertices_added
                                },
                                position: {
                                    x: 0,
                                    y: 0
                                }
                            };
                            var local_leaf = cy.add(v_1);
                            vertices_added++;
                            var e = {
                                "group": "edges",
                                "data": {
                                    "id": local_root.id() + "e" + ei,
                                    "source": local_root.id(),
                                    "target": local_leaf.id()
                                }
                            };
                            cy.add(e);
                            next_leafs.push(local_leaf);
                        }
                    }
                    leafs = next_leafs;
                }
                load_and_import_progress.resolve();
            });
            return load_and_import_progress.promise();
        };
        return DataServer;
    }());
    VLA.DataServer = DataServer;
    var elementexploration;
    (function (elementexploration) {
        //const SERVER = "http://178.62.216.53:3101/";
        var SERVER = "", url = "";
        function json_getData(caseId, limit) {
            if (limit === void 0) {
                limit = "1000";
            }
            var case_limit = limit > 0 ? limit : 100;
//            if (elementexploration.is_numeric(caseId)) {
//                url = 'http://188.166.40.105:8080/elementexploration-1.0.7-SNAPSHOT/rest/api/caseseed/getData?caseSeedId=' + caseId + '&limit=' + case_limit;
            url = 'http://188.166.40.105:7070/element/rest/api/caseseed/getData?caseSeedId=59988&limit=100&userId=ff0f4d4c-6462-4027-a0f4-dad42ea1c84b'
//             } else {
//                url = 'http://95.85.58.85:3101/api/cases/' + caseId + '/graph/' + case_limit;
//            }
//            url ="/proxy/vla?caseSeedId=59988&limit=100&userId=ff0f4d4c-6462-4027-a0f4-dad42ea1c84b";
            return $.ajax({
                url: url,
//                url: SERVER + "getCase.php",
                //url: SERVER + "/elementexploration-1.0.7-SNAPSHOT/rest/api/caseseed/getData",
                //data: {caseSeedId:caseSeedId,limit:limit},
//                data: {caseId: caseId, limit: limit},
                dataType: "json",
                cache: false,
//                contentType: 'application/json; charset=utf-8',
                crossDomain: true
            });
        }

        function query_getData(caseId, limit, EHUB_API, token) {
            if (limit === void 0) {
                limit = "1000";
            }
            var case_limit = limit > 0 ? limit : 100;
              url = EHUB_API + 'search/graphData/' + caseId +"?token=" + token;
            if (window.global.graphURL) {
                url = window.global.graphURL;
            }
            return $.ajax({
                url: url,
                dataType: "json",
                crossDomain: true,
                success: function(n){
                    
                    window.global.filterdatatype = n.data;
                },
                error: function(n){
                	$('.vla-cy, '+CurentVLAID).html('<div class="server-error">The server is busy, please try after sometime.</div>');
                	$('#tagCloud_div').html('<div class="">No Data Available</div>');
                }
            });
        }
        //Check caseId is Number
        function is_numeric(caseId) {
            return !isNaN(parseFloat(caseId)) && isFinite(caseId);
        }
        function load_promiseswithRisk(load_promise, params, _this) {
            load_promise.then(function (response) {
            	window.load_promiseAfterRisk(response, _this);
            });
        }
        
        window.load_promiseAfterRisk = function(response, _this){
        	 if(window.global.page == "customerPage"){
        		 response = getCustomerPageData(response);
        	 }
        	if (response.type == void 0) {
        		window.current_data = response;
        		var a;
        		if(_this.graph() == undefined){
        			a = window._cy_;
            		
        		}else{
        			a = _this.graph()
        		}
        			a.batch(function () {
                        for (var _i = 0, _a = response.vertices; _i < _a.length; _i++) {
                            var row = _a[_i];
                            if (window.global.page && window.global.page == "tI" ) {
                            	 row['riskScore'] =row.riskScore;
                            }
                        }
                        if(window.global.page != "customerPage"){
                        callTagCloud();
                        }
                    });
                function callTagCloud() {
                	if(CurentVLAID =="#vla"){
                        textcloudData = handletagCloudData(response.vertices);
                        textcloudData1 = uniquetextcloudData(textcloudData);
                        textcloudData1 = addSizeinData(textcloudData1, response.vertices);
                        var exampleChart = new textcloudChart({
                            container: "#tagCloud_div",
                            data: textcloudData1,
                            height: '300'
                        });
                	}
                }
                setTimeout(function () {
                    var nodes = _cy_.elements();
                    nodes.addClass('risks');
                }, 200);

                function addSizeinData(data, data1) {
                    var newData = [];
                    data1.forEach(function (val, key) {
                        data.forEach(function (v, k) {
                        	
                            if (val.name == v) {                                	
                                newData.push({
                                    text: val.name,
                                    size: (val.riskScore?(riskScale(val.riskScore) * 2):0)+11//min 11px to read 
                                })
                            }
                        });

                    });
                    return newData;
                }

                function uniquetextcloudData(data) {
                    var filteredArray = data.filter(function (value, index) {
                        return data.indexOf(value) == index;
                    });

                    return filteredArray;
                }

                function handletagCloudData(data) {
                    var newData = [];
                    $.each(data, function (i, d) {
                        if (window.global.graphURL) {
                            if (d.name) {
                                newData.push(d.name);
                            }
                        } else
                        if (d.labelV == 'Company' || d.labelV == 'company') {
                            if (d.name) {
                                newData.push(d.name);
                            }

                        }
                    });
                    return newData;
                }
            }
        }
        
        function randomIntFromInterval(min, max)
        {
            return Math.random() * (max - min + 1) + min;
        }
        ;
        function load_promises(load_promise, params, _this) {
            load_promise.then(function (response) {
                if (response.type == void 0) {
//                        if (elementexploration.is_numeric(params.caseId)) {
                    elementexploration.json_getRisks(params.caseId, params.limit).then(function (data) {
                        if (data.status && data.status == 200) {
                            if (data.type == void 0) {
                                _this.graph().batch(function () {
//                                    console.time("addLoadedRisks");
                                    var affected = 0;
                                    for (var _i = 0, _a = data.body; _i < _a.length; _i++) {
                                        var row = _a[_i];
                                        if (row.vertex) {
                                            var node = _this.graph().filter("[id='" + row.vertex + "']");
                                            if (node.length) {
                                                // for (let key in row) {
                                                // 	if (!row.hasOwnProperty(key))
                                                // 		continue;
                                                //
                                                // 	node.data("risks_" + key, row[key]);
                                                // }
//                                                    if(row.direct && row.indirect && row.transactional){
                                                var max_scale = 1, min_scale = 0, scale_span = max_scale - min_scale;
                                                var CUMRISK = 1 - ((1 - row.direct) * (1 - row.indirect) * (1 - row.transactional));
                                                row['risks'] = min_scale + scale_span * CUMRISK;
                                                node.data("risks", row);
                                                node.addClass("risks");
                                                affected++;
//                                                    }

                                            }
                                        }
                                    }
//                                    console.timeEnd("addLoadedRisks");
                                });
                            } else {
                            	  $('.vla-cy'+CurentVLAID).prepend('<div class="server-error">The server is busy, please try after sometime.</div>');
                            }
                        }
                    });
//                        }
                } else {
                	 $('.vla-cy'+CurentVLAID).prepend('<div class="server-error">The server is busy, please try after sometime.</div>');
                }
            }),
                    load_promise.error(function (error) {
                    	  $('.vla-cy'+CurentVLAID).prepend('<div class="server-error">The server is busy, please try after sometime.</div>');
                    });
        }
        elementexploration.is_numeric = is_numeric;
        elementexploration.json_getData = json_getData;
        elementexploration.load_promises = load_promises;
        elementexploration.load_promiseswithRisk = load_promiseswithRisk;
        elementexploration.query_getData = query_getData;
        function json_getRisks(caseId, limit) {
            if (limit === void 0) {
                limit = "1000";
            }
//            if(elementexploration.is_numeric(caseId)){
//            url = 'http://188.166.40.105:8080/elementexploration-1.0.7-SNAPSHOT/rest/api/caseseed/getRiskDataByCaseId/' + caseId;
            url = 'http://188.166.40.105:8081/elementexploration/rest/api/caseseed/getRiskDataByCaseId/59988?userId=ff0f4d4c-6462-4027-a0f4-dad42ea1c84b'
//            url ="/proxy/vla_risk?userId=ff0f4d4c-6462-4027-a0f4-dad42ea1c84b";
            return $.ajax({
                url: url,
//                    url: SERVER + "getRisks.php",
//                    data: {caseId: caseId, limit: limit},
                dataType: "json",
                cache: false,
                contentType: 'application/json; charset=utf-8',
                crossDomain: true
            });
//          }
        }
        elementexploration.json_getRisks = json_getRisks;
        function json_node_toCytoscape(vertice) {
            var v = {
                data: {},
                position: {
                    x: 0,
                    y: 0
                },
                classes: vertice.labelV
            };
            v.data = vertice;
            v.data['id'] = vertice.id;
            v.data['_label'] = vertice.name ? vertice.name : (vertice.title ? vertice.title : vertice.id);
            //v.data['_icon'] = VLA.UI.Graph.icon(icon(vertice));
            // if (typeof vertice.position !== 'undefined') {
            // 	v.position = vertice.position;
            // }
            return v;
        }
        elementexploration.json_node_toCytoscape = json_node_toCytoscape;
        // function icon(node:json_node):string
        // {
        // 	let icons_by_labelV = {
        // 		"person" : "user",
        // 		"website": "internet-explorer"
        // 	};
        // 	let icon = icons_by_labelV[node.labelV];
        // 	if (typeof icon == 'undefined')
        // 		icon = 'undefined';
        //
        // 	return icon;
        // }
        function json_edge_toCytoscape(edge) {
            var e = {
                group: "edges",
                data: {
                    id: edge.id,
                    source: edge.from,
                    target: edge.to
                }
            };
            for (var key in edge) {
                if (!edge.hasOwnProperty(key))
                    continue;
                e.data[key] = edge[key];
            }
            if (edge.labelE)
                e.data['_label'] = edge.labelE.split("_").join(" ");
            return e;
        }
        elementexploration.json_edge_toCytoscape = json_edge_toCytoscape;
    })(elementexploration = VLA.elementexploration || (VLA.elementexploration = {}));
    var gexf_reader;
    (function (gexf_reader) {
        function attributes_map(xmlDoc, type) {
            var xml_attr_maps = xmlDoc.getElementsByTagName("attributes");
            if (!xml_attr_maps.length)
                return {};
            var xml_map;
            for (var i = 0; i < xml_attr_maps.length; i++) {
                if (xml_attr_maps.item(i).getAttribute("class") == type) {
                    xml_map = xml_attr_maps.item(i);
                    break;
                }
            }
            if (!xml_map)
                return {};
            var attributes = xml_map.getElementsByTagName("attribute");
            var map = {};
            for (var i = 0; i < attributes.length; i++) {
                var item = attributes.item(i);
                var map_item = {
                    id: item.getAttribute("id"),
                    title: item.getAttribute("title"),
                    type: item.getAttribute("type"),
                };
                var default_value = item.getElementsByTagName("default").item(0);
                if (default_value)
                    map_item.default_value = (typeof default_value.textContent != 'undefined') ? default_value.textContent : default_value.text;
                map[item.getAttribute("id")] = map_item;
            }
            return map;
        }
        gexf_reader.attributes_map = attributes_map;
        function node_toCytoscape(node, attributes_map) {
            var label = node.getAttribute("label");
            var id = node.getAttribute("id");
            if (typeof label == 'undefined')
                label = id;
            var data = {};
            var xml_attvalues = node.getElementsByTagName("attvalue");
            var attvalues = {};
            if (xml_attvalues.length) {
                for (var i = 0; i < xml_attvalues.length; i++) {
                    var name_1 = xml_attvalues[i].getAttribute("for");
                    attvalues[name_1] = xml_attvalues[i].getAttribute("value");
                }
            }
            for (var attribute_name in attributes_map) {
                if (!attributes_map.hasOwnProperty(attribute_name))
                    continue;
                var attribute = attributes_map[attribute_name];
                var value = attvalues[attribute_name];
                if (typeof value != 'undefined')
                    data[attribute.title] = value;
                else if (typeof attribute.default_value != 'undefined') {
                    data[attribute.title] = attribute.default_value;
                }
            }
            var v = {
                data: data,
                position: {
                    x: 0,
                    y: 0
                },
            };
            v.data['id'] = id;
            v.data['_label'] = label;
            v.data['_icon'] = "";
            return v;
        }
        gexf_reader.node_toCytoscape = node_toCytoscape;
        function edge_toCytoscape(edge) {
            var id = edge.getAttribute("id");
            if (typeof id != 'undefined')
                id = "e_" + id;
            var res = {
                group: "edges",
                data: {
                    id: id,
                    source: edge.getAttribute("source"),
                    target: edge.getAttribute("target")
                }
            };
            return res;
        }
        gexf_reader.edge_toCytoscape = edge_toCytoscape;
    })(gexf_reader = VLA.gexf_reader || (VLA.gexf_reader = {}));
})(VLA || (VLA = {}));
var VLA;
(function (VLA) {
    var UI;
    (function (UI) {
        var HTML_UI = (function () {
            function HTML_UI(target_div, options) {
                this.divno = this.divno ? this.divno++ : 0;
                this.options = options;
                this.parent_element = target_div;
                this.build_html_dom();
                this.bind_events();
                if (this.html_element.attr("class") && this.html_element.attr("class").split(" ")[0] == "vla-panel"+CurentVLAID.split("#")[1]) {
                var element = "<div id='div" + (this.html_element.attr("class").split(" ")[0]) + "' class='submenu-wrapper'></div>";
                    this.parent_element.append(element);
                    this.html_element.appendTo($("#div" + this.html_element.attr("class").split(" ")[0]));
//                    var htmlButton = document.createElement('button');
//                    htmlButton.className = 'vla-custom-configs';
//                    htmlButton.type = 'button';
//                    var htmlbuttonI = document.createElement('i');
//                    htmlbuttonI.className = 'fa fa-bars';
//                    htmlButton.appendChild(htmlbuttonI);
//                    var parentChildNodes  = this.parent_element[0].childNodes
//                    parentChildNodes[2].insertBefore(htmlButton,this.html_element[0]);
//                    parentChildNodes[2].classList.add('toggle-configs')
//          		  	var html_element = this.html_element[0];
//                    htmlButton.addEventListener('click',function(e){
//                	  var parentElement = e.currentTarget.parentElement.classList;
//                	  if(parentElement.contains('toggle-configs')){
//                		  parentElement.remove('toggle-configs');
//                		  $(html_element).slideDown();
//                	  }else{
//                		  parentElement.add('toggle-configs');
//                		  $(html_element).slideUp();
//                	  }
//                    });
                } else {
                    this.html_element.appendTo(this.parent_element);
                }
            }
            HTML_UI.prototype.on = function (event_name, callback) {
                this.parent_element.on("vla." + event_name, callback);
            };
            HTML_UI.prototype.trigger = function (event_name, data) {
                $(this.html_element).trigger("vla." + event_name, data);
            };
            HTML_UI.prototype.addClass = function (class_name) {
                this.html_element.addClass(class_name);
            };
            HTML_UI.prototype.removeClass = function (class_name) {
                this.html_element.removeClass(class_name);
            };
            HTML_UI.prototype.hasClass = function (class_name) {
                this.html_element.hasClass(class_name);
            };
            HTML_UI.prototype.hide = function () {
                this.html_element.hide();
            };
            HTML_UI.prototype.show = function () {
                this.html_element.show();
            };
            return HTML_UI;
        }());
        UI.HTML_UI = HTML_UI;
        var HTML_INPUT = (function (_super) {
            __extends(HTML_INPUT, _super);
            function HTML_INPUT() {
                _super.apply(this, arguments);
            }
            HTML_INPUT.prototype.value = function (val) {
                if (this.control)
                    if (val)
                        this.control.val(val);
                    else
                        return this.control.val();
            };
            return HTML_INPUT;
        }(HTML_UI));
        UI.HTML_INPUT = HTML_INPUT;
    })(UI = VLA.UI || (VLA.UI = {}));
})(VLA || (VLA = {}));
/// <reference path="libs/jquery.d.ts" />
/// <reference path="libs/cytoscape.d.ts" />
/// <reference path="libs/typeahead.d.ts" />
/// <reference path="libs/spectrum.d.ts" />
/// <reference path="vla_ui_html_ui.ts"/>
/// <reference path="vla_ui_attrfilter.ts"/>
/// <reference path="libs/moment.d.ts" />

var VLA;
(function (VLA) {
    var UI;
    (function (UI) {
        var Panel = (function (_super) {
            __extends(Panel, _super);
            function Panel() {
                _super.apply(this, arguments);
            }
            Panel.prototype.bind_events = function () {
                var _this = this;
                this.toggle_button.on("click", function () {
                    _this.parent_element.toggleClass("vla-panel-on");
                });
                this.parent_element.delegate(".vla-graph-link", "click", function () {
                    var node_id = $(this).data('id');
                    if (typeof node_id != 'undefined')
                        $(this).trigger("vla.graph-link-clicked", node_id);
                });
                $(window).on("resize", function () {
                    _this.update_max_height();
                });
            };
            Panel.prototype.build_html_dom = function () {
            	this.html_element = $('<ul class="vla-panel'+CurentVLAID.split("#")[1]+' vla-panel" style="list-style: none;color: #525F67;">');
            	this.update_max_height();
                //this.html_element.html('');
//                this.show_hidden_form = new Show_Hidden(this.html_element);
                this.search_panel = new SearchPanel(this.html_element);
                this.attr_filter_form = new UI.AttrFilter(this.html_element);
//                this.focus_depth_select = new FocusPanel(this.html_element);
//                this.filter_by_type_form = new Filter_by_type(this.html_element);
                this.vertex_filter_label_form = new Show_Labels(this.html_element);
                this.layout_form = new Layouts(this.html_element);
                if(vla_options.merchantFilter)
                this.layout_form1 = new MerchantFilter(this.html_element);

//   this.html_element.append('<li class= "head-options"><span class="fa fa-ellipsis-v"></span></li>');
//                this.html_element.append("<label style=\"font-size: 12px;margin-left:  15px;font-weight: bold;color: #788792;\">Filter By</label><select><option>All</option><option>Merchant</option><option>Merchant Type</option></select>");
                //<li class= "" style="display:inline-block"><ul class="dropdown"><li class="dropdown"></li></ul></li>');
                this.snapshot_buttons = new Snapshot_buttons(this.html_element);

                this.time_panel = new GraphTimePanel(this.parent_element, this.options);

                this.time_panel.hide();
//                $("#collapseOne").find(".panel-body").empty();
                this.selection_info_panel = new SelectedInfoPanel($("#collapseOne").find(".panel-body"), this.options);
//                this.style_panel = new NodeStylePanel(this.html_element);
//                this.edge_style_panel = new EdgeStylePanel(this.html_element);
                this.style_panel = new NodeStylePanel($("#displayFeatures_div_node").find(".panel-body .node-styles-panel"), this);
                this.edge_style_panel = new EdgeStylePanel($("#displayFeatures_div_edge").find(".panel-body .edge-styles-panel"), this);
                this.toggle_button = $("<div class='vla-panel-toggler'>");
                this.toggle_button.html("<span class='fa fa-bars' aria-hidden='true'>");
                this.toggle_button.appendTo(this.parent_element);

            };
            Panel.prototype.update_max_height = function () {
                this.html_element.css({'max-height':  global.dimensions.height});
            };

            Panel.prototype.on_selected_nodes_change = function (selected_nodes, selected_edges) {
                this.html_element.removeClass("sel-n-one sel-n-two sel-e-one sel-mixed sel-any sel-n-any sel-e-any");
                if (selected_edges > 0 || selected_nodes > 0) {
                    this.html_element.addClass("sel-any");
                }

                if (selected_nodes > 0) {
                    $("#displayFeatures_div_node .node-styles-panel .vla-node-style-panel").removeClass("on-any-node-selected");
                    $("#displayFeatures_div_node .node-styles-panel .vla-node-style-panel").addClass("node-styles-panel-show");
                    $('#displayFeatures_div_node').show();
                    this.html_element.addClass("sel-n-any");
                } else {
                    $("#displayFeatures_div_node .node-styles-panel .vla-node-style-panel").addClass("on-any-node-selected");
                    $("#displayFeatures_div_node .node-styles-panel .vla-node-style-panel").removeClass("node-styles-panel-show");
                    $('#displayFeatures_div_node').hide();
                }

                if (selected_edges > 0) {
                    $("#displayFeatures_div_edge .edge-styles-panel .vla-edge-style-panel").removeClass("on-any-edge-selected");
                    $("#displayFeatures_div_edge .edge-styles-panel .vla-edge-style-panel").addClass("edge-styles-panel-show");
                    $('#displayFeatures_div_edge').show();
                    this.html_element.addClass("sel-e-any");
                } else {
                    $("#displayFeatures_div_edge .edge-styles-panel .vla-edge-style-panel").addClass("on-any-edge-selected");
                    $("#displayFeatures_div_edge .edge-styles-panel .vla-edge-style-panel").removeClass("edge-styles-panel-show");
                    $('#displayFeatures_div_edge').hide();
                }

                if (selected_edges == 0 && (selected_nodes > 0 && selected_nodes < 3)) {
                    // 1 or 2 nodes only
                    if (selected_nodes == 1)
                        this.html_element.addClass("sel-n-one");
                    else
                        this.html_element.addClass("sel-n-two");
                } else if (selected_nodes == 0) {
                    if (selected_edges == 1) {
                        // one edge only
                        this.html_element.addClass("sel-e-one");
                    }
                } else {
                    // mixed selection
                    this.html_element.addClass("sel-mixed");
                }

            };

            return Panel;
        }(UI.HTML_UI));

        UI.Panel = Panel;
        var Layouts = (function (_super) {
            __extends(Layouts, _super);
            function Layouts() {
                _super.apply(this, arguments);
            }

            Layouts.prototype.bind_events = function () {
                var _this = this;
                this.control.on("change", function () {
                    var selectedOption = $(this).find('option:selected').val();
                    _this.trigger("layout-change", selectedOption);
                });
                this.control1.on("change", function () {
                    var selectedOption = $(this).find('option:selected').val();
                    _this.trigger("configurations-change", selectedOption);
                });
            };
            Layouts.prototype.enable_layout = function (name, enable) {
                this.control.find("option[value='" + name + "']")[enable ? "show" : "hide"]();
            };
            Layouts.prototype.set_control_enabled = function (value, reason) {
                if (value === void 0) {
                    value = true;
                }
                this.control
                        .prop('disabled', !value);
                var span = this.control.closest('.custom-configurations');
                span[value ? 'removeClass' : 'addClass']('vla-disabled');
                if (value == false && !!reason) {
                    span.attr('title', reason);
                } else {
                    span.attr('title', '');
                }
            };
            Layouts.prototype.build_html_dom = function () {
                var label_text = VLA._("Configurations");
                var first_menu_text = VLA._("Re-arrange");
                var second_menu_text = VLA._("Theme");
                var checkbox_text = VLA._("Cache");
                var second_first_sub_menu_text = VLA._("DarkTheme");
                var second_second_sub_menu_text = VLA._("LightTheme");
                var newClass =  !window.create_new_graph ? 'vla-cb-checked' : '';
                this.html_element = $('<li class="dropdown custom-configurations "><button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">' + label_text + '<span class="fa fa-caret-down"></span></button>').addClass('');
                var html_append = "<ul class=\"dropdown-menu\"><li class=\"dropdown-submenu\"><a class=\"test menu_first_dropdown\" tabindex=\"-1\" href=\"#\">" + first_menu_text + "<span class=\"fa fa-caret-down\"></span></a><ul class=\"dropdown-menu\"><li class=\"dropdown-submenu\"><a class=\"test\"  href=\"#\"><div class='element-body' style='width: 80px;'>\n<select id='custom-rearrange' style='text-transform:UPPERCASE;font-size: 13px;padding: 4px 0;'>\n\t<option value=\"concentric\">Concentric</option>\n\t<option value=\"breadthfirst\">Breadthfirst</option>\n\t<option value=\"breadthfirst_c\">Breadthfirst (circular)</option>\n\t<option value=\"cose\">Cose</option>\n\t<option style=\"display: none\" value=\"cola_inf\">Cola (inf)</option>\n\t<option value=\"cola\">Cola</option>\n\t<option style=\"display: none\" value=\"cytoscape-ngraph.forcelayout\">ngraph.forcelayout</option>\n\t<option style=\"display: none\" value=\"map\">Map</option>\n</select>\n<span class=\"vla-layouts-status\" style=\"display:none;\"></span>\n<button style=\"display:none;padding:4px 0;\" class=\"vla-layouts-start\"><span class=\"fa fa-play\"></span></button>\n<button class=\"vla-layouts-stop\"><span class=\"fa fa-stop\"></span></button></div></a></li></ul>\n\
                <a class=\"test menu_second_dropdown\" tabindex=\"-1\" href=\"#\">" + second_menu_text + "<span class='fa fa-caret-down'></span></a>\n\    <ul class=\"dropdown-menu\">\n\
                <li class=\"dropdown-submenu\">\n\
                <a class=\"test first_sub_menu second_first_sub_dropdown_check\" tabindex=\"-1\" href=\"#\" >" + second_first_sub_menu_text + "<span class=\"fa fa-caret-down\"></span></a>\n\
                <ul class=\"dropdown-menu\" style='width:215px;'><li class=\"dropdown-submenu\"><a class=\"test\" href=\"#\"><div class='element-body' style='width: 215px;'><select class='configurations' style='text-transform:UPPERCASE;font-size: 13px;padding: 4px 0;'>\n\t\n\
                <option value=\"select\">Select</option>\n\t\n\
                <option value=\"nodeBackground\">Nodes with background</option>\n\
                <option value=\"nodewithoutBackground\">Nodes without background</option>\n\
                </select></div></a></li></ul><a class=\"test second_sub_menu\" tabindex=\"-1\" href=\"#\">" + second_second_sub_menu_text + "<span class=\"fa fa-caret-down\"></span></a><ul class=\"dropdown-menu\" style='width:215px;'><li class=\"dropdown-submenu\"><a class=\"test\" href=\"#\"><div class='element-body' style='width: 215px;'><select class='configurations' style='text-transform:UPPERCASE;font-size: 13px;padding: 4px 0;'>\n\t\n\
                <option value=\"select\">Select</option>\n\t\n\
                <option value=\"nodeBackground\">Nodes with background</option>\n\
                <option value=\"nodewithoutBackground\">Nodes without background</option>\n\
                </select></div></a></li></ul></li></ul></li>";
                if(!window.global.page){
                	if(!vla_options.adverseNews){
                		html_append += "<span class=\"vla-checkbox "+newClass+"\">" + checkbox_text + " <span class=\"vla-cb-empty\">&#9633</span><span class=\"vla-cb-check\">&#9745;</span><input type=\"checkbox\" value=\"1\" /></span>";
                	}
                }
                html_append += "</ul>\n\n";
                this.html_element.append(html_append);                	

                this.control = this.html_element.find("select#custom-rearrange");
                this.control1 = this.html_element.find("select.configurations");
                this.status_span = this.html_element.find(".vla-layouts-status");
                this.button_start = this.html_element.find(".vla-layouts-start");
                this.button_stop = this.html_element.find(".vla-layouts-stop");
//                this.configuration_value = new Configurations(this.html_element);
            };
            return Layouts;
        }(UI.HTML_INPUT));

        var Configurations = (function (_super) {
            __extends(Configurations, _super);
            function Configurations() {
                _super.apply(this, arguments);
            }
            Configurations.prototype.bind_events = function () {
                var _this = this;
                this.control.on("change", function () {
                    _this.trigger("configurations-change", _this.value());
                });
            };
            Configurations.prototype.build_html_dom = function () {

            };
            return Configurations;
        })(UI.HTML_INPUT);

        var MerchantFilter = (function (_super) {
            __extends(MerchantFilter, _super);
            function MerchantFilter() {
                _super.apply(this, arguments);
            }
            MerchantFilter.prototype.bind_events = function () {
                var _this = this;
                this.newlay.on("change", function () {
                    var selectedOption = window.SetGlobalselection = $(this).find('option:selected').val();
                    window.filterByMerchantType($(this).attr('id').split('-')[1],selectedOption)
                    /*window.optionSelected = true;
                    _this.trigger("FilterInput-change", selectedOption);*/
                });
//                this.merchantFilterClass.on("change", function () {
//                   window.SetGlobalselection = $(this).closest(".vla-viewport").attr("id");
//                });
            };
            MerchantFilter.prototype.build_html_dom = function () {
                var label_text = VLA._("Filterlayout");
                var first_menu_text = VLA._("Filter-icons");
                window.optionSelected =false;
                var selectedType = window.SetGlobalselection ? window.SetGlobalselection : "MerchantType";
                if(selectedType == "Merchant"){
                	MetchantTypeSelect = "";
                	MetchantSelect = "selected";
                }else{
                	MetchantTypeSelect = "selected";
                	MetchantSelect = "";
                }
                this.html_element = $('<li class="dropdown custom-configurations ">').addClass('');
                var html_append = "<label style=\"font-size: 12px;margin-left:  15px;font-weight: bold;color: #788792;\">Filter By</label><select class='selectCustom' id='custom-"+ vla_options.merchantFilter.split("_vla")[0]+"' style='text-transform:UPPERCASE;font-size: 13px;padding: 4px 0;'><option "+ MetchantSelect +">Merchant</option><option value = 'MerchantType' "+ MetchantTypeSelect +">Merchant Type</option></select>";
                html_append += "</li>\n\n";
                this.html_element.append(html_append);                	

                this.newlay = this.html_element.find("select#custom-"+vla_options.merchantFilter.split("_vla")[0]);
                this.merchantFilterClass = this.html_element.find("select.selectCustom");
            };
            return MerchantFilter;
        }(UI.HTML_INPUT));

        var Show_Labels = (function (_super) {
            __extends(Show_Labels, _super);
            function Show_Labels() {
                _super.apply(this, arguments);
            }
            Show_Labels.prototype.bind_events = function () {
                var self = this;
                self.controls['labels'].on("change", function () {
                    self.trigger("show-labels-change", $(this).is(":checked"));
                });
                self.controls['time'].on("change", function () {
                    self.trigger("show-time-change", $(this).is(":checked"));
                });
                self.controls['map'].on("change", function () {
                    self.trigger("show-map-change", $(this).is(":checked"));
                });
                self.controls['theme'].on("change", function () {
                    self.trigger("change-theme", $(this).is(":checked"));
                });
                $(self.html_element).find(".vla-checkbox").on("click", function () {
                    var span = $(this);
                    var input = $(this).find("input");
                    if (span.is(".vla-disabled")) {
                        return;
                    }
                    var checked = input.is(":checked");
                    checked = !checked;
                    if (checked) {
                        span.addClass("vla-cb-checked");
                    } else {
                        span.removeClass("vla-cb-checked");
                    }
                    input.prop("checked", checked);
                    input.trigger("change");
                });
            };
            Show_Labels.prototype.set_control_enabled = function (control_name, value, reason) {
                if (value === void 0) {
                    value = true;
                }
                this.controls[control_name]
                        .prop('disabled', !value);
                var span = this.controls[control_name].closest('.vla-checkbox');
                span[value ? 'removeClass' : 'addClass']('vla-disabled');
                if (value == false && !!reason) {
                    span.attr('title', reason);
                } else {
                    span.attr('title', '');
                }
            };
            Show_Labels.prototype.build_html_dom = function () {
                var labels_text = VLA._("<span style='font-size: 10px;'>LABELS </span>");
                var time_panel_text = VLA._("<span style='font-size: 10px;'>TIMELINE </span>");
                var map_text = VLA._("<span style='font-size: 10px;'>MAP </span>");
                var theme_selection = VLA._("<span style='font-size: 10px;'>THEME </span>");
                this.html_element = $('<li style="display:inline-block;margin-top: 1px;" class="vla-show-labels-form"></li>');
                var htmlButton = document.createElement('button');
                htmlButton.className = 'vla-custom-configs';
                htmlButton.type = 'button';
                var htmlbuttonI = document.createElement('i');
                htmlbuttonI.className = 'fa fa-bars';
                htmlButton.appendChild(htmlbuttonI);
                this.html_element[0].appendChild(htmlButton);    
                
                htmlButton.addEventListener('click',toggleConfigButton);
                
                var div_element = document.createElement('div');
                div_element.className = 'div_configs';
                this.html_element[0].appendChild(div_element);
                var firstChildNode = this.html_element[0].querySelector('div');
                var labels_span = $("<span class=\"vla-checkbox \">" + labels_text + " <span class=\"vla-cb-empty\">&#9633</span><span class=\"vla-cb-check\">&#9745;</span><input type=\"checkbox\" value=\"1\" /></span>");
                var time_span = $("<span class=\"vla-checkbox timeline\" style='margin-right: 10px;'>" + time_panel_text + " <span class=\"vla-cb-empty timelineCheckbox\">&#9633</span><span class=\"vla-cb-check timelineCheckbox\">&#9745;</span><input type=\"checkbox\" value=\"1\" /></span>");
                var map_span = $("<span class=\"vla-checkbox \" style='margin-right: 22px;width:40px'>" + map_text + " <span class=\"vla-cb-empty mapCheckbox\">&#9633</span><span class=\"vla-cb-check mapCheckbox\">&#9745;</span><input type=\"checkbox\" value=\"1\" /></span>");
                var theme_selection_span = $("<span class=\"vla-checkbox\">" + theme_selection + " <span class=\"vla-cb-empty\">&#9633</span><span class=\"vla-cb-check\">&#9745;</span><input type=\"checkbox\" value=\"1\" /></span>");
                //this.html_element.html('<label><input id="cy_show_labels" type="checkbox" value="1" />Show all labels</label>');
                this.controls = {};
                this.controls['labels'] = labels_span.find("input");
                this.controls['time'] = time_span.find("input");
                this.controls['map'] = map_span.find("input");
                this.controls['theme'] = theme_selection_span.find("input");
                firstChildNode.appendChild(labels_span[0])
                firstChildNode.appendChild(time_span[0])
                firstChildNode.appendChild(map_span[0]);
            };
            Show_Labels.prototype.value = function (control_name) {
                return this.controls[control_name].is(":checked");
            };
            return Show_Labels;
        }(UI.HTML_UI));

        function toggleConfigButton(e){
        	var parentElement = e.currentTarget.parentElement.classList;
      	  if(parentElement.contains('toggle-configs')){
      		  parentElement.remove('toggle-configs');
//      		  $(html_element).slideDown();
      	  }else{
      		  parentElement.add('toggle-configs');
//      		  $(html_element).slideUp();
      	  }
        };

        var Show_Hidden = (function (_super) {
            __extends(Show_Hidden, _super);
            function Show_Hidden() {
                _super.apply(this, arguments);
            }
            Show_Hidden.prototype.bind_events = function () {
                var _this = this;
                this.control.on("click", function () {
                    _this.trigger("show-hidden-click");
                });
            };
            Show_Hidden.prototype.build_html_dom = function () {
                var restore_text = VLA._("Restore all hidden");
                this.html_element = $('<li class="show-all-block on-any-hidden">');
                this.html_element.html("<button class='btn btn-primary'>" + restore_text + "</button>");
                this.control = this.html_element.find("button");
            };
            Show_Hidden.prototype.value = function () {
            };
            return Show_Hidden;
        }(UI.HTML_INPUT));

        var Filter_by_type = (function (_super) {
            __extends(Filter_by_type, _super);
            function Filter_by_type() {
                _super.apply(this, arguments);
            }
            Filter_by_type.prototype.bind_events = function () {
                var _this = this;
                $(this.html_element).find("input[type=checkbox]").on("change", function (evt) {
                    _this.trigger("type-filter-change", {type: $(this).val(), state: $(this).is(":checked")});
                });
                $(this.html_element).find(".vla-checkbox").on("click", function () {
                    var span = $(this);
                    var input = $(this).find("input");
                    var checked = input.is(":checked");
                    checked = !checked;
                    if (checked) {
                        span.addClass("vla-cb-checked");
                    } else {
                        span.removeClass("vla-cb-checked");
                    }
                    input.prop("checked", checked);
                    input.trigger("change");
                });
            };
            Filter_by_type.prototype.build_html_dom = function () {
                this.html_element = $('<div class="vla-type-filter-form"></div>');
                this.controls = {};
                for (var type_key in Filter_by_type.types) {
                    if (!Filter_by_type.types.hasOwnProperty(type_key))
                        continue;
                    var control = $('<span class="vla-checkbox vla-cb-checked"><span class="fa fa-square vla-cb-empty"></span><span class="fa fa-check-square vla-cb-check"></span><input type="checkbox" value="' + type_key + '" checked />' + Filter_by_type.types[type_key] + '</span>');
                    control.appendTo(this.html_element);
                    this.controls[type_key] = this.html_element.find("input[value=" + type_key + "]");
                }
            };
            Filter_by_type.prototype.value = function () {
                var state = {};
                for (var type_key in Filter_by_type.types) {
                    if (!Filter_by_type.types.hasOwnProperty(type_key))
                        continue;
                    state[type_key] = this.controls[type_key].val();
                }
                return state;
            };
            Filter_by_type.prototype.type_state = function (type) {
                if (this.controls.hasOwnProperty(type))
                    return this.controls[type].is(":checked");
                else
                    return false;
            };
            Filter_by_type.types = {'person': 'Person', 'company': 'Company', 'website': 'Website', 'location': 'Location', 'company_number': 'Company number', 'officer_id': 'Officer ID'};
            return Filter_by_type;
        }(UI.HTML_INPUT));

        var Snapshot_buttons = (function (_super) {
            __extends(Snapshot_buttons, _super);
            function Snapshot_buttons() {
                _super.apply(this, arguments);
            }
            Snapshot_buttons.prototype.bind_events = function () {
                var _this = this;
                // for snapshot of the vla chart
                this.select_snapshot_type.on("change", function () {
                    var selectedOption = $(this).find('option:selected').text();
                    if (selectedOption != 'DOWNLOAD') {
                        if (selectedOption == 'JSON') {
                            var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(_cy_.json()));
                            downloadJSONfile(data);
                        } else {
                        	 var bgColor = $(CurentVLAID).css('background-color');
                            var color = convertToHex(bgColor);
                            selectedOption = selectedOption.toLowerCase();
                            var b64key = 'base64,';
                            var b64 = window.eval('_cy_.' + selectedOption + '({bg:"' + color + '", full: true})').substring(window.eval('_cy_.' + selectedOption + '()').indexOf(b64key) + b64key.length);
                            var imgBlob = base64ToBlob(b64, 'image/' + selectedOption);
                            saveAs(imgBlob, 'Graph.' + selectedOption);
                        }
                    }
                });
                function convertToHex(colorval) {
                    var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                    delete(parts[0]);
                    for (var i = 1; i <= 3; ++i) {
                        parts[i] = parseInt(parts[i]).toString(16);
                        if (parts[i].length == 1)
                            parts[i] = '0' + parts[i];
                    }
                    return color = '#' + parts.join('');
                }
                function downloadJSONfile(data) {
                	  $('<a id="downloadJson" style="visibility:hidden" href="data:' + data + '" download="data.json">download JSON</a>').appendTo(CurentVLAID);
                      $('a#downloadJson')[0].click();

                }
                ;
                this.button_snapshot_all.on("click", function () {
                    _this.trigger("snapshot-all-click", _this.select_snapshot_type.val());
                });
                this.button_snapshot_selected.on("click", function () {
                    _this.trigger("snapshot-selected-click", _this.select_snapshot_type.val());
                });
                this.button_import_case.on("click", function () {
                    var caseId = UI.prompt("Case ID");
                    if (caseId)
                        _this.trigger("import-case-request", caseId);
                });
                if(window.global.page != "customerPage"){
                    this.button_import.on("click", function () {
                        _this.input_file_import.trigger("click");
                    });
                    this.input_file_import.on("change", function () {
    //                    console.warn("file selected!");
                        var file = _this.input_file_import.get(0)['files'][0];
                        _this.trigger("import-file-request", file);
                    });
                }
            };
            Snapshot_buttons.prototype.build_html_dom = function () {
                var div, data = '';
                var snapshot_label_text = VLA._("DOWNLOAD");
                this.html_element = $('<li class="vla-snapshot-form">');
//                this.html_element.append($("<div class='title'>" + snapshot_label_text + ":</div>"));
//                this.html_element.append($("<button class='btn btn-primary custom-button>" + snapshot_label_text +"</button>"));
                this.select_snapshot_type = $("<div class='element-body' style='text-transform:UPPERCASE;'><select class='downloadGraph'>" +
                        "<option value='png'>DOWNLOAD</option>" +
                        "<option value='png'>PNG</option>" +
                        "<option value='jpg'>JPG</option>" +
                        "<option value='json'>JSON</option>" +
//                        "<option value='gexf'>GEXF</option>" +
                        "</select></div>");

                this.button_snapshot_all = $("<button class='btn btn-primary custom-button'>").html(VLA._("DOWNLOAD"));
                this.button_snapshot_selected = $("<button class='btn btn-primary custom-button'>").html(VLA._("Selected")).addClass("on-any-selected");
                this.html_element.append(this.select_snapshot_type);

//                this.html_element.append(this.button_snapshot_all);
//                this.html_element.append(this.button_snapshot_selected);
                if(window.global.page != "customerPage"){
                this.button_import = $("<button class='btn btn-primary custom-button'>").html(VLA._("Import JSON"));
                this.html_element.append(this.button_import);
                this.input_file_import = $("<input type='file' />").hide();
                this.html_element.append(this.input_file_import);
                }
                this.button_import_case = $("<button class='btn btn-primary custom-button'>").html(VLA._("Load Case data"));
//                this.html_element.append(this.button_import_case);
            };
            return Snapshot_buttons;
        }(UI.HTML_UI));

        var FocusPanel = (function (_super) {
            __extends(FocusPanel, _super);
            function FocusPanel() {
                _super.apply(this, arguments);
            }
            FocusPanel.prototype.bind_events = function () {
                var _this = this;
                this.control.on("change", function () {
                    _this.trigger("focus-depth-change", _this.value());
                });
                this.button_exit_focus.on("click", function () {
                    _this.trigger("graph-exit-focus");
                });
            };
            FocusPanel.prototype.build_html_dom = function () {
                var maxDepth = 10;
                this.html_element = $('<li class="focus-panel clearfix">');
                var html = '<label for="focus_depth_select">Degree of separation:</label>' +
                        '<select id="focus_depth_select">';
                for (var depth = 1; depth <= maxDepth; depth++) {
                    html += '<option>' + depth + '</option>';
                }
                html += '</select>';
                this.html_element.html(html);
                this.button_exit_focus = $("<button class='btn btn-primary'>").html("Exit focus");
                this.button_exit_focus.appendTo(this.html_element);
                this.control = this.html_element.find("select");
            };
            return FocusPanel;
        }(UI.HTML_INPUT));

        var SelectedInfoPanel = (function (_super) {
            __extends(SelectedInfoPanel, _super);
            function SelectedInfoPanel() {
                _super.apply(this, arguments);
            }
            SelectedInfoPanel.prototype.bind_events = function () {
                var _this = this;
                var self = this;
                this.object_info_header_toggler.on('click', function () {
                    _this.object_info_div.toggle();
                    _this.object_info_buttons.toggle();
                    _this.object_info_header_toggler.toggleClass('vla-opened');
                });
                var buttons = this.object_info_buttons.find('button');
                buttons.on("click", function (e) {
                    var action = $(e.target).data('action');
                    var params = {action: action, target: _this.node};
                    _this.trigger("graph-action", params);
                });
                buttons = this.selection_info_buttons.find('button');
                buttons.on("click", function (e) {
                    var action = $(e.target).data('action');
                    _this.trigger("graph-action", {action: action});
                });
                this.html_element.on("keydown", ".vla-notes-block textarea", function (e) {
                    if ((e.keyCode == 10 || e.keyCode == 13) && e.ctrlKey) {
                        _this.html_element.find(".vla-notes-block form").trigger("submit");
                    }
                });
                this.html_element.on("submit", ".vla-notes-block form", function (e) {
                    e.preventDefault();
                    var time = new Date().getTime();
                    var text = $(this).find(".vla-add-text").val();
                    self.trigger("add-note", {element: self.node, time: time, text: text});
                });
                this.html_element.on("click", ".vla-notes-block .vla-delete", function (e) {
                    e.preventDefault();
                    self.trigger("delete-note", {element: self.node, index: $(this).closest(".vla-note").data("index")});
                });
            };
            SelectedInfoPanel.prototype.build_html_dom = function () {
                this.html_element = $('<div>')
                        .addClass("vla-selection-panel");
                this.object_info_header = $('<div>').addClass("vla-object-info-header").appendTo(this.html_element);
                this.object_info_header_label = $('<span>').appendTo(this.object_info_header);
                this.object_info_header_toggler = $('<span class="fa fa-unsorted vla-toggler">').appendTo(this.object_info_header);
                this.object_info_div = $('<div class="vla-object-info"></div>').appendTo(this.html_element);
                this.object_info_buttons = $('<div class="vla-object-info-buttons"><button class="btn btn-primary" style="border: 1px solid #315C7F;    background-color:  #315C7F;    padding: 5px 12px; border-radius: 0px" data-action="center">center</button><button class="btn btn-primary" style="border: 1px solid #315C7F;    background-color:  #315C7F;    padding: 5px 12px; border-radius: 0px"  data-action="fit">fit</button></div>').appendTo(this.html_element);
//              this.object_info_div.hide();
//              this.object_info_buttons.hide();
                this.selection_info_div = $('<div class="vla-selection-info"></div>').appendTo(this.html_element);
                this.selection_info_buttons = $('<div class="vla-selection-info-buttons"><button class="btn btn-primary" style="border: 1px solid #315C7F;    background-color:  #315C7F;    padding: 5px 12px; border-radius: 0px"  data-action="center-selected">center</button><button class="btn btn-primary" style="border: 1px solid #315C7F;    background-color:  #315C7F;    padding: 5px 12px; border-radius: 0px"  data-action="fit-selected">fit</button></div>').appendTo(this.html_element);
            };
            SelectedInfoPanel.prototype.update_content = function (selected_elements) {

                if ($(".vla-selection-panel").css("display") == "none") {
                    $(".panelbasicinfodiv").css("display", "none");
                } else {
                    $(".panelbasicinfodiv").css("display", "block");
                }
                this.update_selected_object_info(selected_elements);
                this.update_selection_info(selected_elements);
            };
            SelectedInfoPanel.prototype.update_selected_object_info = function (selected_elements) {
                var node = selected_elements.eq(0);
                this.node = node;
                var html = '';
                if (node.length) {
                    // TODO: add option to show full or compact info
                    var show_full_info_on_select = false;
                    if (show_full_info_on_select) {
                        this.object_info_div.show();
                        this.object_info_buttons.show();
                    }
                    if (node.isNode()) {
                        this.object_info_header_label.html(VLA._("Node") + ": <span class='fa'>" + node.data()._icon + "</span> " + GraphLink(node.data('id'), node.data('id') + " " + node.data()._label));
//                        html += "<div><span class='vla-caption'>&lt;x,y&gt;</span><span class='vla-colon'>:</span><span class='position-axis'>" + node.position("x") + ", " + node.position("y") + "</span></div>";
                        html += this.node_info(node);
                    } else if (node.isEdge()) {
                        this.object_info_header_label.html(VLA._("Edge") + ": " + GraphLink(node.data('id')));
                        html += this.edge_info(node);
                    } else
//                        console.warn("update_content: Unknown node type:", node);
                    this.html_element.show();
                } else {
                    this.node = null;
                    this.object_info_div.html("");
                    this.html_element.hide();
                }
                this.object_info_div.html(html);
            };
            SelectedInfoPanel.prototype.update_selection_info = function (selected_elements) {
                var selected_num = selected_elements.length;
                if (selected_num > 1) {
                    this.selection_info_div.html(VLA._("Total selected") + "<span class='vla-colon'>:</span>" + selected_num);
                    this.selection_info_div.show();
                    this.selection_info_buttons.show();
                } else {
                    this.selection_info_div.html("");
                    this.selection_info_div.hide();
                    this.selection_info_buttons.hide();
                }
            };

            SelectedInfoPanel.prototype.node_info = function (node) {
                return this.data_info(node);
            };
            SelectedInfoPanel.prototype.edge_info = function (edge) {
                var edge_direction_type = edge.data('_dir_type');
                var html = '';
                //html += "Edge: " + edge.id() + "<br />";
//                html += GraphLink(edge.source().id());
                if (edge_direction_type == 'normal')
                    html += " -> ";
                else if (edge_direction_type == 'mutual')
                    html += " <-> ";
                else
//                    html += " - ";
//                html += GraphLink(edge.target().id());
                    html += this.data_info(edge, "edge");
                return html;
            };
            SelectedInfoPanel.prototype.data_info = function (element, isedge) {
                var html = '<div class="row">', name_html = '', address_html = '';
                var data = element.data();
                for (var key in data) {
                    if (!data.hasOwnProperty(key))
                        continue;
                    if (key == 'risks')
                        continue;
                    if (data[key] != '' && data[key] != void 0) {
                        if (isedge == "edge") {
                            var lable = key == "labelE" ? "Type" : key;
                            if (key != "spells" && key.indexOf("_") != 0 && key != 'to' && key != 'from' && key != 'id' && key != 'source' && key != 'target') {
                              if(typeof data[key] === "object"){
                            	  var tI = data[key];
                            	  var chanel = tI.channel != undefined ? tI.channel.toString().split("_").join(" ") : 'N/A';
                            	  var base = tI.base_amount != undefined ? tI.base_amount : 'N/A';  
                            	  var direction =  tI.direction != undefined ? tI.direction : '';
                            	  html += "<div class='col-sm-12'><span class='vla-caption'>"+"channel" +": </span><span class='vla-caption-body'>" + chanel +"</span></div>";
                            	  html += "<div class='col-sm-12'><span class='vla-caption'>"+" Amount" +": </span><span class='vla-caption-body'>" +base  + "(" + direction + ")" +"</span></div>";
                              }else{
                            	  html += "<div class='col-sm-12'><span class='vla-caption'>" + lable + " :</span><span class='vla-caption-body'> " + data[key].toString().split("_").join(" ") + "</span></div>";
                              }
                            }
                        } else {
                            var lable = key == "labelV" ? "Type" : key;
                            if (key != "spells" && key.indexOf("_") != 0 && key != 'start' && key != 'createdBy' && key != 'id' && key != 'lat' && key != 'lon' && key != 'caseId') {
                                if (key != "labelV") {
                                    lable = key.split("_").join(" ");
                                }
                                if (key == 'name' || (key == 'scenario_code' && data['labelV'].toLowerCase() =="alert")) {
                                    if (typeof this.options.types == 'undefined')
                                        return;
                                    for (var i = 0; i < this.options.types.length; i++) {
                                        var type = this.options.types[i];
                                        if (type.name == data['labelV'].toLowerCase() || type.name == data['labelV']) {
                                            if (type.name == 'location') {
                                                if (type.name != '') {
                                                    name_html = "<div class='row'><div class='col-sm-12'><div class='vla-caption-body custom-heading' title='" + data[key] + "'><img src='"+window.imgPath+"KeylineICONS/map-marker.svg' alt='icon'>" + data[key] + "</div></div></div>";
                                                }
                                            } else {
                                                if (window.global.page && window.global.page == "tI") {
                                                    name_html = "<div class='row'><div class='col-sm-12'><div class='vla-caption-body custom-heading' title='" + (data['search-name'] ? data['search-name'] : data[key]) + "'><img src='"+window.imgPath+"KeylineICONS/" + data['_icon'] + ".svg' alt='icon'>" + (data['search-name'] ? data['search-name'] : data[key]) + "</div></div></div>";

                                                } else {
                                                    name_html = "<div class='row'><div class='col-sm-12'><div class='vla-caption-body custom-heading' title='" + data[key].toString().split("_").join(" ") + "'><img src='"+window.imgPath+"KeylineICONS/" + data['_icon'] + ".svg' alt='icon'>" + data[key].replace(/_/g,' ') + "</div></div></div>";
                                                }
                                            }
                                        }
                                    }
                                    if( window.global.page == "customerPage"){
                                    	if (key == 'name' && data['labelV'] == 'MerchantType' ) {
                                    		name_html = "<div class='row'><div class='col-sm-12'><div class='vla-caption-body custom-heading' title='" + data[key].toString().split("_").join(" ") + "'>" + data[key].replace(/_/g,' ') + "</div></div></div>";
                                        }
                                    }
                                } else if( window.global.page == "customerPage"){
                                	if (key == 'labelV'  && data['labelV'] == 'MerchantType') {
                                        html += "<div class='col-sm-8'><div class='custoom-tooltip-wrapper'><span class='vla-caption' title='" + (lable.charAt(0).toUpperCase() + lable.slice(1)) + "'><i class='fa fa-home' aria-hidden='true'></i> " + (lable.charAt(0).toUpperCase() + lable.slice(1)) + " :</span><span class='vla-caption-body' title='" + data[key] + "'> " + data[key] + "</span></div></div>";
                                    }
                                	if (key == 'labelV' && data['labelV'] != 'MerchantType') {
                                        html += "<div class='col-sm-6'><div class='custoom-tooltip-wrapper'><span class='vla-caption' title='" + (lable.charAt(0).toUpperCase() + lable.slice(1)) + "'><i class='fa fa-home' aria-hidden='true'></i> " + (lable.charAt(0).toUpperCase() + lable.slice(1)) + " :</span><span class='vla-caption-body' title='" + data[key] + "'> " + data[key] + "</span></div></div>";
                                    }
                                	if (key == 'id' && data['labelV'] == 'Card') {
                                        html += "<div class='col-sm-6'><div class='custoom-tooltip-wrapper'><span class='vla-caption' title='" + (lable.charAt(0).toUpperCase() + lable.slice(1)) + "'><i class='fa fa-home' aria-hidden='true'></i> " + (lable.charAt(0).toUpperCase() + lable.slice(1)) + " :</span><span class='vla-caption-body' title='" + data[key] + "'> " + data[key] + "</span></div></div>";
                                    }
                                	if (key == 'avgExp' ) {
                                		 var value = data[key]==0?"$0":'$ '+format(data[key])
                                        html += "<div class='col-sm-6'><div class='custoom-tooltip-wrapper'><span class='vla-caption' title='" + (lable.charAt(0).toUpperCase() + lable.slice(1)) + "'><i class='fa fa-dollar' aria-hidden='true'></i> " + (lable.charAt(0).toUpperCase() + lable.slice(1)) + " :</span><span class='vla-caption-body' title='" + data[key] + "'> " + value + "</span></div></div>";
                                    }
                                	if (key == 'shopName' && data['labelV'] == 'Merchant' ) {
                                		name_html = "<div class='row'><div class='col-sm-12'><div class='vla-caption-body custom-heading' title='" + data[key].toString().split("_").join(" ") + "'>" + data[key].replace(/_/g,' ') + "</div></div></div>";
                                    }
                                	if (key == 'merchType' && data['labelV'] == 'Merchant' ) {
                                		 html += "<div class='col-sm-12'><div class='custoom-tooltip-wrapper'><span class='vla-caption' title='" + (lable.charAt(0).toUpperCase() + lable.slice(1)) + "'><i class='fa fa-home' aria-hidden='true'></i> " + (lable.charAt(0).toUpperCase() + lable.slice(1)) + " :</span><span class='vla-caption-body' title='" + data[key] + "'> " + data[key] + "</span></div></div>";
                                    }
                                	if (key == 'cardType' && data['labelV'] == 'Card' ) {
                                        html += "<div class='col-sm-12'><div class='custoom-tooltip-wrapper'><span class='vla-caption' title='" + (lable.charAt(0).toUpperCase() + lable.slice(1)) + "'><i class='fa fa-credit-card' aria-hidden='true'></i> " + (lable.charAt(0).toUpperCase() + lable.slice(1)) + " :</span><span class='vla-caption-body' title='" + data[key] + "'> " + data[key] + "</span></div></div>";
                                    }
                                } 
                                else {
//                                	if(key == 'scenario_code'){
//                                		 html += "<div class='col-sm-6'><div class='custoom-tooltip-wrapper'><span class='vla-caption' title='" + ('Scenario') + "'><i class='fa fa-file-text' aria-hidden='true'></i> " + ('Scenario') + " :</span><span class='vla-caption-body' title='" + data[key] + "'> " + data[key] + "</span></div></div>";
//                                         
//                                	}
                                    if (key == 'labelV') {
                                        html += "<div class='col-sm-6'><div class='custoom-tooltip-wrapper'><span class='vla-caption' title='" + (lable.charAt(0).toUpperCase() + lable.slice(1)) + "'><i class='fa fa-home' aria-hidden='true'></i> " + (lable.charAt(0).toUpperCase() + lable.slice(1)) + " :</span><span class='vla-caption-body' title='" + data[key] + "'> " + data[key] + "</span></div></div>";
                                    }
                                    if (key == 'weight') {
                                        html += "<div class='col-sm-6'><div class='custoom-tooltip-wrapper'><span class='vla-caption' title='" + (lable.charAt(0).toUpperCase() + lable.slice(1)) + "'><i class='fa fa-balance-scale' aria-hidden='true'></i> " + (lable.charAt(0).toUpperCase() + lable.slice(1)) + " :</span><span class='vla-caption-body' title='" + data[key] + "'> " + data[key] + "</span></div></div>";
                                    }
                                    if (key == 'role') {
                                        html += "<div class='col-sm-6'><div class='custoom-tooltip-wrapper'><span class='vla-caption' title='" + (lable.charAt(0).toUpperCase() + lable.slice(1)) + "'><i class='fa fa-star-o' aria-hidden='true'></i> " + (lable.charAt(0).toUpperCase() + lable.slice(1)) + " :</span><span class='vla-caption-body' title='" + data[key] + "'> " + data[key] + "</span></div></div>";
                                    }
                                    if (key == 'Date_of_incorporation') {
                                        html += "<div class='col-sm-6'><div class='custoom-tooltip-wrapper'><span class='vla-caption' title='" + (lable.charAt(0).toUpperCase() + lable.slice(1)) + "'><i class='fa fa-calendar' aria-hidden='true'></i> " + (lable.charAt(0).toUpperCase() + lable.slice(1)) + " :</span><span class='vla-caption-body' title='" + data[key] + "'> " + data[key] + "</span></div></div>";
                                    }
                                    if (key == 'amount' &&  data[key]) {
                                    	html += "<div class='col-sm-6'><div class='custoom-tooltip-wrapper'><span class='vla-caption' title='" + (lable.charAt(0).toUpperCase() + lable.slice(1)) + "'><i class='fa fa-usd' aria-hidden='true'></i> " + (lable.charAt(0).toUpperCase() + lable.slice(1)) + " :</span><span class='vla-caption-body' title='" + data[key] + "'> " + data[key] + "</span></div></div>";
                                    }
                                    if (key == 'date') {
                                    	html += "<div class='col-sm-6'><div class='custoom-tooltip-wrapper'><span class='vla-caption' title='" + (lable.charAt(0).toUpperCase() + lable.slice(1)) + "'><i class='fa fa-calendar' aria-hidden='true'></i> " + (lable.charAt(0).toUpperCase() + lable.slice(1)) + " :</span><span class='vla-caption-body' title='" + new Date(data[key]) + "'> " + new Date(data[key]).toLocaleDateString() + "</span></div></div>";
                                    }
                                    if (key == 'beneficiaryName' && data[key]) {
                                    	address_html += "<div class='col-sm-12'><div class='custoom-tooltip-wrapper'><span class='vla-caption' title='" + ('Beneficiary') + "'><i class='fa fa-user' aria-hidden='true'></i> " + ('Beneficiary') + " :</span><span class='vla-caption-body' title='" + data[key] + "'> " + data[key] + "</span></div></div>";
                                    }
                                    if (key == 'originatorName' && data[key]) {
                                    	address_html += "<div class='col-sm-12'><div class='custoom-tooltip-wrapper'><span class='vla-caption' title='" + ('Originator') + "'><i class='fa fa-user' aria-hidden='true'></i> " + ('Originator') + " :</span><span class='vla-caption-body' title='" + data[key] + "'> " + data[key] + "</span></div></div>";
                                    }
                                    if (key == 'merchant' && data[key]) {
                                    	address_html += "<div class='col-sm-12'><div class='custoom-tooltip-wrapper'><span class='vla-caption' title='" + ('Merchant') + "'><i class='fa fa-user' aria-hidden='true'></i> " + ('Merchant') + " :</span><span class='vla-caption-body' title='" + data[key] + "'> " + data[key] + "</span></div></div>";
                                    }
                                    if (key == 'merchantWebsite' && data[key]) {
                                    	address_html += "<div class='col-sm-12'><div class='custoom-tooltip-wrapper'><span class='vla-caption' title='" + ('Merchant Website') + "'><i class='fa fa-globe' aria-hidden='true'></i> " + ('Merchant Website') + " :</span><span class='vla-caption-body' title='" + data[key] + "'> " + data[key] + "</span></div></div>";
                                    }
                                    if (key == 'industry' && data[key]) {
                                    	address_html += "<div class='col-sm-12'><div class='custoom-tooltip-wrapper'><span class='vla-caption' title='" + (lable.charAt(0).toUpperCase() + lable.slice(1)) + "'><i class='fa fa-industry' aria-hidden='true'></i> " + (lable.charAt(0).toUpperCase() + lable.slice(1)) + " :</span><span class='vla-caption-body' title='" + new Date(data[key]) + "'> " + data[key] + "</span></div></div>";
                                    }
                                    if (key == 'jurisdiction' &&  data[key]) {
                                    	html += "<div class='col-sm-6'><div class='custoom-tooltip-wrapper'><span class='vla-caption' title='" + (lable.charAt(0).toUpperCase() + lable.slice(1)) + "'><i class='fa fa-balance-scale' aria-hidden='true'></i> " + (lable.charAt(0).toUpperCase() + lable.slice(1)) + " :</span><span class='vla-caption-body' title='" + new Date(data[key]) + "'> " + data[key]+ "</span></div></div>";
                                    }
                                    if (key == 'address') {
                                        address_html += "<div class='col-sm-12'><div class='custoom-tooltip-wrapper'><span class='vla-caption' title='" + (lable.charAt(0).toUpperCase() + lable.slice(1)) + "'><i class='fa fa-envelope' aria-hidden='true'></i> " + (lable.charAt(0).toUpperCase() + lable.slice(1)) + " :</span><span class='vla-caption-body' title='" + data[key] + "'> " + data[key] + "</span></div></div>";
                                    }
                                   
                                }

                            }else if( window.global.page == "customerPage"){
                            	if (key == 'id' && data['labelV'] == 'Card') {
                            		name_html = "<div class='row'><div class='col-sm-12'><div class='vla-caption-body custom-heading' title='" + data["name"] + "'>" + data["name"] + "</div></div></div>";
                                }
                            }
                        }
                    }else{
	                	 if( window.global.page == "customerPage"){
	                    	if (key == 'avgExp' ) {
	                   		 var valuess = data[key]==0?"$ 0":'$ '+format(data[key])
	                           html += "<div class='col-sm-6'><div class='custoom-tooltip-wrapper'><span class='vla-caption' title='" + (key.charAt(0).toUpperCase() + key.slice(1)) + "'><i class='fa fa-dollar' aria-hidden='true'></i> " + ( key.charAt(0).toUpperCase() +  key.slice(1)) + " :</span><span class='vla-caption-body' title='" + data[key] + "'> " + valuess + "</span></div></div>";
	                       }
	                    }
                    	if (isedge == "edge") 
                    		html += "<div class='col-sm-12'><span class='vla-caption'>Type :</span><span class='vla-caption-body'> " + data['_type'] + "</span></div>";
                    }
                }
                html = name_html + html;
                var riskReverScale =  d3.scaleLinear().domain([1,10]).range([0,100]);
                if (data.riskScore &&  window.global.page != "customerPage")
                    html += "<div class='col-sm-6' ><div class='custoom-tooltip-wrapper'><span class='vla-caption' style='color:#e04033;font-size:12px;' title='Risks'><i style='color:#e04033;' class='fa fa-exclamation-triangle' aria-hidden='true'></i> Risks :</span><span class='vla-caption-body' style='color:#e04033;font-size:12px;' title='" + (riskReverScale(data.riskScore)).toFixed(2).toString() + '%' + "'> " + (riskReverScale(data.riskScore)).toFixed(2).toString() + '%' + "</span></div></div>";

                if (data.risks) {
//                html += VLA._("<span class='vla-caption'>Risks:</span>") + ("</b><br>\n<span class='vla-caption-body'>" + data.risks["description"] + "</span>");
                    for (var key in data.risks) {
                        if (!data.risks.hasOwnProperty(key))
                            continue;
                        if (key == 'description')
                            continue;
                        if (key == 'risks')
                            html += "<div class='col-sm-6' ><div class='custoom-tooltip-wrapper'><span class='vla-caption' style='color:#e04033;font-size:12px;' title='" + key + "'><i style='color:#e04033;' class='fa fa-exclamation-triangle' aria-hidden='true'></i> " + key + " :</span><span class='vla-caption-body' style='color:#e04033;font-size:12px;' title='" + (data.risks[key] * 100).toFixed(2).toString() + '%' + "'> " + (data.risks[key] * 100).toFixed(2).toString() + '%' + "</span></div></div>";
                    }
                }
                html = html + address_html;
                if (element.isNode()) {
                    if (!element.grabbable())
                        html += "<div><b>Ungrabbable</b></div>";
//                    if (element.locked())
//                        html += "<div><b>Locked</b></div>";
                }
                if (element.hasClass("_custom_styled")) {
                    // debug info
//                    html += "<div class='col-sm-6'><span class='vla-caption-body'>Custom styled</span></div>";
//                    if (data._style) {
//                        html += "<div class='col-sm-6'><span class='vla-caption-body'>_Style:</span></div>";
//                        for (var key in data._style) {
//                        	if (!data._style.hasOwnProperty(key))
//                                continue;
//                            html += "<div class='col-sm-6'><span class='vla-caption' title=''>" + key + "</span><span class='vla-caption-body'>: " + data._style[key] + "</span></div>";
//
//                        }
//                    }
                }
                html += this.notes_html(element);
                html += '</div>';
                return html;
            };
            SelectedInfoPanel.prototype.notes_html = function (element) {
                var html = "";
                var notes = element.data("notes");
                html += '<div class="col-sm-6">';
                html += "<div class='vla-notes-block'>";
                if (notes) {
                    html += "<div>" + VLA._("Annotations") + ":</div>";
                    html += "<div class='vla-notes'>";
                    for (var i = (notes.length - 1); i >= 0; i--) {
                        var n = notes[i];
                        html += "<div class='vla-note' data-index='" + i + "'>";
                        var time_str = "";
                        if (n.time) {
                            var m = moment(n.time, "x");
                            time_str = m.format(this.options.date_format_short + ". HH:mm");
                        }
                        html += "<span class='vla-note-time'>" + time_str + "</span> <span title='" + VLA._("Delete note") + "' class='vla-delete'>&#x2716;</span><br />";
                        html += "<span class='vla-note-text'>" + n.text + "</span>";
                        html += "</div>";
                    }
                    html += "</div>";
                }
                html += "<div><form class='clearfix'><textarea class=\"vla-add-text form-control\"></textarea><button class='btn btn-primary pull-right' style='border: 1px solid #315C7F;    background-color:  #315C7F;    padding: 5px 12px; border-radius: 0px' >" + VLA._("Add note") + "</button></form></div>";
                html += "</div>";
                return html;
            };
            return SelectedInfoPanel;
        }(UI.HTML_UI));

        var SearchPanel = (function (_super) {
            __extends(SearchPanel, _super);
            function SearchPanel() {
                _super.apply(this, arguments);
            }
            SearchPanel.prototype.bind_events = function () {
                var _this = this;
                this.form.on('submit', function (e) {
                    e.preventDefault();
                    console.lohighligg("search form submit");
                    //alert('blogger11');
                    _this.trigger('search-submit', _this.input.val());
                });
                // tt-cursor
            };
            SearchPanel.prototype.build_html_dom = function () {
                this.html_element = $("<li style='display:inline-block;position: absolute;font-size: 12px;vertical-align: top;right:220px;'><i class='fa fa-search'></i>").addClass("vla-search");
                this.form = $("<form action='' method='get'>");
                this.input = $("<input type='text' class='search-box' required /><button id='close-id' class='close-icon' type='reset' style='display:none;'></button>");
                $("<input type='submit'>").hide().appendTo(this.form);
                if (VLA.is_rtl())
                    this.input.attr("dir", "rtl");
                this.input.appendTo(this.form);
                this.html_element.append(this.form);
            };
            return SearchPanel;
        }(UI.HTML_UI));

        var colorpicker_defaults = {
            allowEmpty: true,
            showInitial: true,
            showInput: true,
            preferredFormat: "hex",
            showPallet: true,
            // showPaletteOnly: true,
            // togglePaletteOnly: true,
            // togglePaletteMoreText: 'more',
            // togglePaletteLessText: 'less',
            palette: [
                ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
                ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
                ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
                ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
                ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
                ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
                ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
                ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
            ]
        };

        var NodeStylePanel = (function (_super) {
            __extends(NodeStylePanel, _super);
            function NodeStylePanel() {
                _super.apply(this, arguments);
            }
            NodeStylePanel.prototype.bind_events = function () {
                var _this = this;
                var _updateUi = this.options;
                this.icon_control['selectric']();
                this.font_size_control['selectric']();
                this.font_control['selectric']();
                this.color_control.spectrum(colorpicker_defaults);
                this.border_color_control.spectrum(colorpicker_defaults);
                this.icon_control.on('change', function () {
                    _updateUi.trigger("select-icon-change", _this.icon_control.val());
                });
                this.color_control.on('change.spectrum', function (e, color) {
                    _updateUi.trigger("select-color-change", color ? color.toHexString() : "");
                    // this.trigger("select-color-change", this.color_control.val());
                });
                this.border_color_control.on('change.spectrum', function (e, color) {
                    _updateUi.trigger("select-border-color-change", color ? color.toHexString() : "");
                });
                this.font_control.on('change', function () {
                    _updateUi.trigger("select-font-change", _this.font_control.val());
                });
                this.font_size_control.on('change', function () {
                    _updateUi.trigger("select-font-size-change", _this.font_size_control.val());
                });
            };
            NodeStylePanel.prototype.build_html_dom = function () {
                this.html_element = $("<li></li>").addClass("vla-node-style-panel on-any-node-selected");
                this.build_icons_control();
                this.build_fonts_control();
                this.build_fonts_sizes_control();
                this.build_color_control();
                this.build_border_color_control();
                this.build_buttons();
            };
            NodeStylePanel.prototype.build_icons_control = function () {
                var block = $("<div>").addClass("vla-icon-select");
                var label = $("<label>").html(VLA._("SELECT ICON ")).appendTo(block);
                this.icon_control = $("<select>");
                var icons = VLA.UI.Graph.icons();
                for (var name_2 in icons) {
                    if (!icons.hasOwnProperty(name_2))
                        continue;
                    var option = $("<option>").attr("value", name_2).html(("<span class='fa fa-" + name_2 + "'></span> ") + name_2);
                    this.icon_control.append(option);
                }
                label.append(this.icon_control);
//                this.html_element.append(block);
            };
            NodeStylePanel.prototype.build_color_control = function () {
                var block = $("<div>");
                var color_label = $("<label>").html(VLA._("Color ")).appendTo(block);
                this.color_control = $("<input type='text' id='colorSpectrum'/>");
                color_label.append(this.color_control);
//                this.html_element.append(block);
            };
            NodeStylePanel.prototype.build_border_color_control = function () {
                var block = $("<div>");
                var border_color_label = $("<label>").html(VLA._("Border ")).appendTo(block);
                this.border_color_control = $("<input type='text' id='borderSpectrum'/>");
                border_color_label.append(this.border_color_control);
//                this.html_element.append(block);
            };
            NodeStylePanel.prototype.build_fonts_control = function () {
                var block = $("<div>");
                var label = $("<label>").html(VLA._("Font ")).appendTo(block);
                var font_families = ["Droid Sans", "Droid Serif", "Rock Salt", "Tangerine"];
                this.font_control = $("<select>");
                for (var _i = 0, font_families_1 = font_families; _i < font_families_1.length; _i++) {
                    var family = font_families_1[_i];
                    var option = $("<option>").attr("value", family).html(family + " <span style='font-family: " + family + "'>ABCabc</span>");
                    this.font_control.append(option);
                }
                label.append(this.font_control);
                this.html_element.append(block);
            };
            NodeStylePanel.prototype.build_fonts_sizes_control = function () {
                var font_label = $("<label class='font-size'>").html(VLA._("Font-size "));
                var font_sizes = [9, 10, 11, 12, 14, 18, 24, 30, 36, 48];
                this.font_size_control = $("<select>");
                for (var _i = 0, font_sizes_1 = font_sizes; _i < font_sizes_1.length; _i++) {
                    var size = font_sizes_1[_i];
                    var option = $("<option>").attr("value", size).html(size + (" <span style='font-size: " + size + "px'>ABCabc</span>"));
                    this.font_size_control.append(option);
                }
                font_label.append(this.font_size_control);
                this.html_element.append(font_label);
            };
            NodeStylePanel.prototype.build_buttons = function () {
                var block = $("<div>");
                this.html_element.append(block);
            };
            return NodeStylePanel;
        }(UI.HTML_UI));

        var EdgeStylePanel = (function (_super) {
            __extends(EdgeStylePanel, _super);
            function EdgeStylePanel() {
                _super.apply(this, arguments);
            }
            EdgeStylePanel.prototype.bind_events = function () {
                var _this = this;
                var _updateUi = this.options;
                this.type_control['selectric']();
                this.color_control.spectrum(colorpicker_defaults);
                this.font_size_control['selectric']();
                this.font_control['selectric']();
                this.type_control.on('change', function () {
                    _updateUi.trigger("edge-type-change", _this.type_control.val());
                });
                this.color_control.on('change.spectrum', function (e, color) {
                    _updateUi.trigger("select-edge-color-change", color ? color.toHexString() : "");
                });
                this.size_control.on('change', function () {
                    _updateUi.trigger("edge-size-change", _this.size_control.val());
                });
                this.font_control.on('change', function () {
                    _updateUi.trigger("select-font-change", _this.font_control.val());
                });
                this.font_size_control.on('change', function () {
                    _updateUi.trigger("select-font-size-change", _this.font_size_control.val());
                });
            };
            EdgeStylePanel.prototype.build_html_dom = function () {
                this.html_element = $("<li>").addClass("vla-edge-style-panel on-any-edge-selected");
                this.build_color_control();
                this.build_type_control();
                this.build_width_control();
                this.build_fonts_control();
                this.build_fonts_sizes_control();
            };
            EdgeStylePanel.prototype.build_color_control = function () {
                var block = $("<div>");
                var color_label = $("<label>").html(VLA._("Color") + ":").appendTo(block);
                this.color_control = $("<input type='text' />");
                color_label.append(this.color_control);
//                this.html_element.append(block);
            };
            EdgeStylePanel.prototype.build_width_control = function () {
                var block = $("<div>");
                var label = $("<label>").html(VLA._("Width") + ":").appendTo(block);
                this.size_control = $("<select>");
                for (var i = 1; i <= 10; i++) {
                    var option = $("<option>").attr("value", i).html(i.toString());
                    this.size_control.append(option);
                }
                label.append(this.size_control);
//                this.html_element.append(block);
            };
            EdgeStylePanel.prototype.build_type_control = function () {
                var block = $("<div>");
                var label = $("<label>").html(VLA._("Type") + ":").appendTo(block);
                var types = ["none"];
                this.type_control = $("<select>");
                for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
                    var type = types_1[_i];
                    var option = $("<option>").attr("value", type).html(type);
                    this.type_control.append(option);
                }
                label.append(this.type_control);
//                this.html_element.append(block);
            };
            EdgeStylePanel.prototype.set_types = function (types) {
                if (types.length == 0)
                    types = ["none"];
                this.type_control.html("");
                for (var _i = 0, types_2 = types; _i < types_2.length; _i++) {
                    var type = types_2[_i];
                    var option = $("<option>").attr("value", type).html(type);
                    this.type_control.append(option);
                }
                this.type_control['selectric']("refresh");
            };
            EdgeStylePanel.prototype.build_fonts_control = function () {
                var block = $("<div>");
                var label = $("<label>").html(VLA._("Font") + ":").appendTo(block);
                var font_families = ["Droid Sans", "Droid Serif", "Rock Salt", "Tangerine"];
                this.font_control = $("<select>");
                for (var _i = 0, font_families_2 = font_families; _i < font_families_2.length; _i++) {
                    var family = font_families_2[_i];
                    var option = $("<option>").attr("value", family).html(family + " <span style='font-family: " + family + "'>ABCabc</span>");
                    this.font_control.append(option);
                }
                label.append(this.font_control);
                this.html_element.append(block);
            };
            EdgeStylePanel.prototype.build_fonts_sizes_control = function () {
                var font_label = $("<label>").html(VLA._("Font-size") + ":");
                var font_sizes = [9, 10, 11, 12, 14, 18, 24, 30, 36, 48];
                this.font_size_control = $("<select>");
                for (var _i = 0, font_sizes_2 = font_sizes; _i < font_sizes_2.length; _i++) {
                    var size = font_sizes_2[_i];
                    var option = $("<option>").attr("value", size).html(size + (" <span style='font-size: " + size + "px'>ABCabc</span>"));
                    this.font_size_control.append(option);
                }
                font_label.append(this.font_size_control);
                this.html_element.append(font_label);
            };
            return EdgeStylePanel;
        }(UI.HTML_UI));

        var GraphTimePanel = (function (_super) {
            __extends(GraphTimePanel, _super);
            function GraphTimePanel() {
                _super.apply(this, arguments);
            }
            GraphTimePanel.prototype.bind_events = function () {
//                var _this = this;
//                var min = +moment().subtract(12, "hours").format("x");
//                var max = +moment().format("x");
//                var from = +moment().subtract(10, "hours").format("x");
//                var to = +moment().subtract(2, "hours").format("x");
//                this.input['ionRangeSlider']({
//                    type: "double",
//                    min: min,
//                    max: max,
////                    from: from,
////                    to: to,
//                    grid: true,
//                    force_edges: true,
//                    prettify: function (num) {
//                        var m = moment(num, "x");
//                        return m.format(_this.options.date_format_short);
//                    },
//                    onChange: function (data) {
//                        _this.trigger("time-range-change", data);
//                    },
//                    onUpdate: function (data) {
////                        _this._value = data.from;
//                    }
//                });
//                this.slider = this.input.data('ionRangeSlider');
            };
            GraphTimePanel.prototype.update_range_span = function (min, max, dynamicnodes) {
//                setTimeout(function () {                    
//                    timelineBrush(".timeline_new_bs", [min, max]);
//                });
                var data = [];
                for (var _i = 0, _a = dynamicnodes; _i < _a.length; _i++) {
                    var el = _a[_i];
                    var spells = el.data("spells");
                    if (spells) {
                        for (var _b = 0, spells_1 = spells; _b < spells_1.length; _b++) {
                            var spell = spells_1[_b];
                            data.push(spell.start);
                        }
                    }
                }
                var container_id  ="#timline"+CurentVLAID.split("#")[1];
                var xdomain = [min, max];
                var height = 50;
                var Svgwidth = $(window).width() - 350;//400-> width of side menu and spaces
                if (window.global.page && window.global.page == "tI") {
                	Svgwidth = $(CurentVLAID).width() - 20;
                }
                $(container_id).empty();

                var margin = {top: 20, bottom: 20, left: 20, right: 20}
                var width = Svgwidth - margin.left - margin.right;
//                 var data = d3.range(width).map(Math.random);
                var x = d3.scaleLinear().range([0, width]),
                        y = d3.randomNormal(height / 2, height / 8);
                var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
                var colorScale = d3.scaleOrdinal().range(["#46a2de", "#5888C8", "#31d99c", "#de5942"]);
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
                var y = d3.randomNormal(height / 2, height / 8);
                var _this = this;
                var brush = d3.brushX()
                        .extent([[0, 0], [width, height]])
                        .on("start brush end", function () {
                            var s = d3.event.selection;
                            if (s != null) {
                                var sx = s.map(x.invert);
                                var x0 = parseInt(sx[0].getTime());
                                var x1 = parseInt(sx[1].getTime());
                                _this.trigger("time-range-change", [{from: x0, to: x1}]);
                            }
                        });

                g.append("g")
                        .attr("class", "axis axis--x-brush")
                        .attr("transform", "translate(0," + height + ")")
                        .call(d3.axisBottom(x)).style("stroke", "#838F99");

                var gBrush = g.append("g")
                        .attr("class", "brush").style("fill", "#334552")
                        .call(brush).call(brush.move, x.range());
//                gBrush.call(brush.move, [0, 1].map(x));
                var circle = g.append("g").attr("clip-path", "url(#brushClip)")
                        .attr("class", "circle")
                        .selectAll("circle")
                        .data(data)
                        .enter().append("circle")
                        .style("fill", function (d) {
                            return colorScale(d);
                        })
                        .attr("transform", function (d, i) {
                            return "translate(" + x(d) + "," + y() + ")";
                        })
                        .attr("r", 5);
//                this.slider.update({
//                    min: +min,
//                    max: +max
//                });
            };
            GraphTimePanel.prototype.set_value = function (value) {
//                this.slider.update({
//                    from: value
//                });
            };
            GraphTimePanel.prototype.get_value = function () {

//                return [this.slider.result.from, this.slider.result.to];
            };
            GraphTimePanel.prototype.build_html_dom = function () {
                this.html_element = $("<div>").addClass("vla-time-panel").hide();
//                this.input = $('<input type="text" value="" />');
                this.new_div = $('<div class="timeline_new_bs" id="timline'+CurentVLAID.split("#")[1]+'"></div>');

//                this.html_element.append(this.input);
                this.html_element.append(this.new_div);

                if (window.global.page && window.global.page == "tI") {
                    this.html_element.css("left", "10px");
                }
            };
            return GraphTimePanel;
        }(UI.HTML_UI));
        function GraphLink(node_id, value) {
            var label = (typeof value != 'undefined') ? value : node_id;
            var link = $("<span>").addClass('vla-graph-link').html(label).attr('data-id', node_id);
            return link[0].outerHTML;
        }
        UI.GraphLink = GraphLink;
    })(UI = VLA.UI || (VLA.UI = {}));
})(VLA || (VLA = {}));
///<reference path="vla_ui_html_ui.ts"/>
///<reference path="vla_ui_panel.ts"/>
///<reference path="libs/randomcolor.d.ts"/>
var VLA;
(function (VLA) {
    var UI;
    (function (UI) {
        var AttrFilter = (function (_super) {
            __extends(AttrFilter, _super);
            function AttrFilter() {
                _super.apply(this, arguments);
                this.attrs_colors = {};
            }
            AttrFilter.prototype.bind_events = function () {
                var _this = this;
                this.html_element.find("form").on('submit', function (e) {
                    e.preventDefault();
                    _this.trigger('attrfilter-submit', _this.filter_control.val());
                });
                this.filters_block.delegate(".vla-filter-remove", "click", function (e) {
                    var block = $(e.target).closest(".vla-filter-block");
                    _this.trigger('attrfilter-remove', block.data("findex"));
                });
            };
            AttrFilter.prototype.build_html_dom = function () {
                this.html_element = $('<li style="display:inline-block";margin-left: 10px;>').addClass("vla-attr-filter");
                var label_txt = VLA._("<span style='font-size: 10px;'>Filter</span>");
                var html = "<div class='title'><span>" + label_txt + "</span></div><form>\n<div class='degree'>\n\t<select name=\"attribute\"></select>\t\n\t</div>\n<div>\n\t<input name=\"search\" value=\"\"  />\t\n</div>\n<div class=\"vla-selected-filters\"></div>\n\n<input style=\"display: none;\" type=\"submit\" />\n</form>";
//                this.html_element.html(html);
                this.attr_select = this.html_element.find("select");
                this.filter_control = this.html_element.find("input[name=search]");
                this.filters_block = this.html_element.find(".vla-selected-filters");
            };
            AttrFilter.prototype.set_attributes_list = function (list) {
                this.attr_select.html("");
                // let colors = randomColor({ count: list.length, luminosity: 'light'});
                var i = 0;
                for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                    var attr = list_1[_i];
                    var lable = attr == "labelV" ? "Class" : attr;
                    if (attr.indexOf("_") < 0) {
                        // Returns an array of ten green colors
                        //let color = colors[i++];
                        // this.attrs_colors[attr] = color;
                        var option = $("<option>").attr("value", attr).html(lable); //.css("background-color", color);
                        this.attr_select.append(option);
                    }
                }
            };
            AttrFilter.prototype.redraw_selected_attrFilters = function (selected_filters) {
                var filters_block = this.filters_block;
                filters_block.html("");
                for (var i in selected_filters) {
                    if (!selected_filters.hasOwnProperty(i))
                        continue;
                    var pair = selected_filters[i];
                    var label_short = pair.q;
                    var label_wide = pair.a + ": " + pair.q;
                    var block = $('<span class="vla-filter-block">').data("findex", i);
                    var content_block = $('<span class="vla-filter-content"></span>').attr("title", label_wide).html(label_short);
                    block.append(content_block);
                    block.append('<span class="vla-filter-remove fa fa-close"></span>');
                    var color = this.attrs_colors[pair.a];
                    block.css("background-color", color);
                    block.appendTo(filters_block);
                }
            };
            return AttrFilter;
        }(UI.HTML_UI));
        UI.AttrFilter = AttrFilter;
    })(UI = VLA.UI || (VLA.UI = {}));
})(VLA || (VLA = {}));
var VLA;
(function (VLA) {
    var UI;
    (function (UI) {
        var RemoteGraph = (function (_super) {
            __extends(RemoteGraph, _super);
            function RemoteGraph() {
                _super.apply(this, arguments);
            }
            RemoteGraph.prototype.init_events = function () {
                _super.prototype.init_events.call(this);
                function pan_handler() {
                    // TODO: get/update nodes from server by pan
                    var ex = this.cytoscape().extent();
                }
                this.cytoscape().on("pan", pan_handler);
                // TODO: handle "add node"
                // TODO: handle move(drag) of nodes
            };
            /**
             * check if there any nodes, edges, properties affected by "time"
             */
            RemoteGraph.prototype.setup_dynamic_content = function () {
                // TODO: get this from server
                return _super.prototype.setup_dynamic_content.call(this);
            };
            RemoteGraph.prototype.apply_time_span = function (value) {
                // TODO: reload data from server with timestamp
                return _super.prototype.apply_time_span.call(this, value);
            };
            RemoteGraph.prototype.setup_geo_content = function () {
                // TODO: get this from server
                _super.prototype.setup_geo_content.call(this);
            };
            RemoteGraph.prototype.focus = function (node, depth) {
                if (depth === void 0) {
                    depth = 1;
                }
                // TODO: focus should be remote too
                return _super.prototype.focus.call(this, node, depth);
            };
            RemoteGraph.prototype.snapshot_json_all = function () {
                // TODO: make it remote!
                return _super.prototype.snapshot_json_all.call(this);
            };
            RemoteGraph.prototype.snapshot_gexf_all = function () {
                // TODO: make it remote!
                return _super.prototype.snapshot_gexf_all.call(this);
            };
            RemoteGraph.prototype._connect_nodes = function (source, target) {
                // TODO: make it remote!
                return _super.prototype._connect_nodes.call(this, source, target);
            };
            RemoteGraph.prototype.group_nodes = function (nodes) {
                // TODO: make it remote!
                return _super.prototype.group_nodes.call(this, nodes);
            };
            RemoteGraph.prototype.change_nodes_parent = function (nodes, parent) {
                // TODO: make it remote!
                return _super.prototype.change_nodes_parent.call(this, nodes, parent);
            };
            RemoteGraph.prototype.ungroup_nodes = function (nodes) {
                // TODO: make it remote!
                return _super.prototype.ungroup_nodes.call(this, nodes);
            };
            RemoteGraph.prototype._hide_elements = function (collectionElements) {
                // TODO: make it remote!
                return _super.prototype._hide_elements.call(this, collectionElements);
            };
            RemoteGraph.prototype.remove = function (collectionElements) {
                // TODO: make it remote!
                return _super.prototype.remove.call(this, collectionElements);
            };
            RemoteGraph.prototype.find_shortest_path = function (source, target) {
                // TODO: make it remote!
                return _super.prototype.find_shortest_path.call(this, source, target);
            };
            return RemoteGraph;
        }(UI.Graph));
        UI.RemoteGraph = RemoteGraph;
    })(UI = VLA.UI || (VLA.UI = {}));
})(VLA || (VLA = {}));
var VLA;
(function (VLA) {
    var UI;
    (function (UI) {
        function error(message) {
        }
        UI.error = error;
        function info(message) {
        }
        UI.info = info;
        function confirm(message) {
            return window.confirm(message);
        }
        UI.confirm = confirm;
        function prompt(message, _default) {
            if (typeof _default === "string")
                return window.prompt(message, _default);
            else
                return window.prompt(message);
        }
        UI.prompt = prompt;
    })(UI = VLA.UI || (VLA.UI = {}));
})(VLA || (VLA = {}));
var VLA;
(function (VLA) {
    var Utils;
    (function (Utils) {
        function escapeRegExp(str) {
            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        }
        function matches(str, q) {
            str = (str || '').toLowerCase();
            q = (q || '').toLowerCase();
            q = escapeRegExp(q);
            return str.match(q);
        }
        Utils.matches = matches;
        function zero_padded(num, size) {
            if (size === void 0) {
                size = 2;
            }
            var s = String(num);
            if (s.length < size) {
                var add_zeroes = size - s.length;
                var zeroes = "";
                for (var i = 0; i < add_zeroes; i++)
                    zeroes += "0";
                s = zeroes + s;
            }
            return s;
        }
        Utils.zero_padded = zero_padded;
        function time_string(date, date_separator, time_separator, joint) {
            if (date === void 0) {
                date = new Date();
            }
            if (date_separator === void 0) {
                date_separator = "-";
            }
            if (time_separator === void 0) {
                time_separator = ':';
            }
            if (joint === void 0) {
                joint = ' ';
            }
            var date_part = [date.getFullYear(), (date.getMonth() + 1), date.getDay()].map(function (value) {
                return zero_padded(value, 2);
            }).join(date_separator);
            var time_part = [date.getHours(), date.getMinutes(), date.getSeconds()].map(function (value) {
                return zero_padded(value, 2);
            }).join(time_separator);
            return date_part + joint + time_part;
        }
        Utils.time_string = time_string;
    })(Utils = VLA.Utils || (VLA.Utils = {}));
})(VLA || (VLA = {}));
/// <reference path="libs/jquery.d.ts" />
/// <reference path="libs/selectric.d.ts" />
/// <reference path="libs/typeahead.d.ts" />
/// <reference path="libs/openlayers-3.14.2.d.ts" />
/// <reference path="vla_data.ts" />
/// <reference path="vla_ui_graph.ts" />
/// <reference path="vla_ui_panel.ts" />
/// <reference path="vla_ui.ts" />
/// <reference path="vla_utils.ts" />
'use strict';
var VLA;
(function (VLA) {
    var Main = (function () {

        function Main(params) {
            // console.time("app constructor");
            this.double_click_started = false;
            this.double_click_timeout = 500;
            this.selected_filters = []; // [attr, query]
            // dependencies_loaded = load_dependencies();
            var defaults = {
                target_html_element: "",
                userId: 21220,
                layout: "cola",
                tip_event: "none",
                types: [
                    {
                        name: "default",
                        rule: "",
                        // icon: "",
                        fillColor: "gray",
                        borderColor: "black"
                    },
                ],
                connection_types: [
                    {
                        name: "_default",
                        dir: "normal",
                        color: "#838383",
                        targetArrow: "triangle",
                        sourceArrow: "none",
                    },
                ],
                filter_fields: ["_label", "_type"],
                date_format: "Do MMMM, YYYY",
                date_format_short: "Do MMM, YY"
            };
            this.options = $.extend({}, defaults, params);
            if (!this.options.default_type && this.options.types)
                this.options.default_type = this.options.types[0].name;
            if (!this.options.default_connection_type && this.options.connection_types)
                this.options.default_connection_type = this.options.connection_types[0].name;
            // if (params.connection_types)
            // 	this.options.connection_types = defaults.connection_types.concat(params.connection_types);
//            console.info("options", this.options);
            this._init();
//            this._callGraph();
        }
        Main.prototype._callGraph = function () {
            var _this = this;
            setTimeout(function () {
                _this.ui_graph.update();
            }, 6000)
        };
        Main.prototype._init = function () {
            var _this = this;
//            console.info("init");
//            console.time("app _init");
            this.viewport = $("#" + this.options.target_html_element);
            this.viewport.addClass("vla-viewport");
            // this.userId = userId;
            // this.caseSeedId = caseSeedId;
            if (this.options.locale) {
//                console.info("locale", this.options.locale);
                VLA.setLocale(this.options.locale);
                if (VLA.is_rtl()) {
                    this.viewport.addClass("vla-rtl");
                }
            }
            this.ui_graph = new VLA.UI.Graph(this.viewport, this.options);
            this.ui_panel = new VLA.UI.Panel(this.viewport, this.options);
            this.data_server = new VLA.DataServer(this.options.userId);
            this.ui_panel.layout_form.value(this.options.layout);
//            this.ui_graph.set_layout("preset");
//            console.time("ui_graph.init");
            var graph_ui_init_progress = this.ui_graph.init();
            graph_ui_init_progress.then(function () {
//                console.timeEnd("ui_graph.init");
            });
            var data_autoload_progress;
            if (this.options.autoload) {
//                console.time("autoload");
                data_autoload_progress = this.data_server.load_and_import(this.options.autoload);
                data_autoload_progress.then(function () {
//                    console.timeEnd("autoload");
                });
            } else {
                data_autoload_progress = $.Deferred();
                data_autoload_progress.resolve();
            }
            $.when(graph_ui_init_progress).then(function () {
//                console.info('ui init done');
                _this.data_server.set_graph_object(_this.ui_graph.cytoscape());
//                console.time("update ui");
                _this.ui_graph.set_layout(_this.options.layout);
                _this.ui_graph.update();
//                console.timeEnd("update ui");
                _this.bindUI();
                _this.init_types();
                _this.init_connection_types();
                _this.ui_graph.reassign_all_styles();
//                console.timeEnd("app _init");
            });
            $.when(graph_ui_init_progress, data_autoload_progress)
                    .then(function () {
                        // this.ui_graph.set_layout(this.ui_panel.layout_form.value());
                        _this.ui_graph.busy(false);
                        _this.ui_graph.setup_dynamic_content();
                        if (_this.ui_graph.is_dynamic()) {
                            var dynamic_values = _this.ui_graph.get_dynamic_values();
                            _this.ui_panel.time_panel.update_range_span(dynamic_values.start.subtract(1, 'day'), dynamic_values.end.add(1, 'day'), _this.ui_graph.dynamic_nodes);
//                            var time_point = _this.ui_panel.time_panel.get_value();
                            var time_point = [dynamic_values.start.subtract(1, 'day'), dynamic_values.end.add(1, 'day')];
                            _this.ui_graph.apply_time_span(time_point);
                            //this.ui_panel.time_panel.show();
                            _this.ui_panel.vertex_filter_label_form.set_control_enabled('time', true);
                            _this.ui_panel.vertex_filter_label_form.set_control_enabled('labels', true);
                            _this.ui_panel.layout_form.set_control_enabled(true);
                        } else {
                            //this.ui_panel.time_panel.hide();
                            _this.ui_panel.vertex_filter_label_form.set_control_enabled('time', false, 'Time data not available');
//                            _this.ui_panel.vertex_filter_label_form.set_control_enabled('labels', false, 'Labels not available');
//                            _this.ui_panel.layout_form.set_control_enabled(false);
                        }
                        _this.ui_graph.setup_geo_content();
                        if (_this.ui_graph.is_geodata_available()) {
                            //this.ui_panel.map_panel.show();
                            //this.ui_panel.layout_form.enable_layout('map', true);
                            _this.ui_panel.vertex_filter_label_form.set_control_enabled('map', true);
                        } else {
                            _this.ui_panel.vertex_filter_label_form.set_control_enabled('map', false, 'Geodata not available');
                        }
                        _this.rebind_qtip(); // this should be called on any new elements
                        _this.apply_types();
                        _this.apply_connection_types();
                        _this.ui_graph.update();
                        // should init after types are applied
                        _this.init_attrFilter();
                    }, function (status, message) {
                        _this.ui_graph.busy(false);
//                        console.timeEnd("app _init");
//                        console.error("Initialisations failed:", status, message);
                        if (message)
                            VLA.UI.error("Initialisations failed: [" + status + "] " + message);
                        else
                            VLA.UI.error("Initialisations failed: " + status);
                    }, function (status) {
                    });
        };
        Main.prototype.init_types = function () {
            if (typeof this.options.types == 'undefined')
                return;

            for (var i = 0; i < this.options.types.length; i++) {

                var type = this.options.types[i];
                var css = {};
                if (type.icon)
//                    css.backgroundImage = 'url(KeylineICONS/' + type.icon + '.svg)'
                    if (type.fillColor) {
//                    css["background-color"] = type.fillColor;
                    }

                if (type.borderColor)
                    css["border-color"] = type.borderColor;
                if (type.size) {
                    css.width = type.size;
                    css.height = type.size;
                }
                this.ui_graph.add_type_style(type.name, css);
            }
        };
        Main.prototype.apply_types = function () {
            if (typeof this.options.types == 'undefined')
                return;
            if (this.options.default_type)
                this.ui_graph.set_node_type(this.ui_graph.cytoscape().nodes(), this.options.default_type);
            for (var i = 0; i < this.options.types.length; i++) {
                var type = this.options.types[i];
                if (type.rule == "")
                    continue;
                var type_rule_selector = "[" + type.rule + "]";
                var nodes = this.ui_graph.cytoscape().nodes(type_rule_selector);
                var nodes = this.ui_graph.cytoscape().nodes(function(d){
                	return "[labelV='"+this.data().labelV.toLowerCase()+"']" == type_rule_selector;
                	});
                if (type.icon)
                    this.ui_graph.set_node_icon(nodes, type.icon);
                this.ui_graph.set_node_type(nodes, type.name);
            }
        };

        Main.prototype.init_connection_types = function () {
            if (typeof this.options.connection_types == 'undefined')
                return;
            var type_names = [];
            for (var _i = 0, _a = this.options.connection_types; _i < _a.length; _i++) {
                var type = _a[_i];
                type_names.push(type.name);
                var css = {};
                if (type.size)
                    css.width = type.size;
                if (type.color) {
                    css["line-color"] = type.color;
                    css["source-arrow-color"] = type.color;
                    css["target-arrow-color"] = type.color;
                }
                if (type.dir == 'normal') {
                    var target_arrow = type["targetArrow"] ? type["targetArrow"] : "triangle";
                    var source_arrow = type["sourceArrow"] ? type["sourceArrow"] : "none";
                    css["curve-style"] = "unbundled-bezier";
                    css["target-arrow-shape"] = target_arrow;
                    css["source-arrow-shape"] = source_arrow;
                } else if (type.dir == "mutual") {
                    var target_arrow = type["targetArrow"] ? type["targetArrow"] : "triangle";
                    css["curve-style"] = "unbundled-bezier";
                    css["target-arrow-shape"] = target_arrow;
                    css["source-arrow-shape"] = target_arrow;
                } else {
                    css["curve-style"] = "highstack";
                    css["target-arrow-shape"] = "none";
                    css["source-arrow-shape"] = "none";
                }
                this.ui_graph.add_connection_type_style(type.name, css);
            }
            this.ui_panel.edge_style_panel.set_types(type_names);
        };
        Main.prototype.apply_connection_types = function () {
            if (typeof this.options.connection_types == 'undefined')
                return;
            if (this.options.default_connection_type)
                this.ui_graph.set_edge_type(this.ui_graph.cytoscape().edges(), this.options.default_connection_type);
            for (var _i = 0, _a = this.options.connection_types; _i < _a.length; _i++) {
                var type = _a[_i];
                var type_rule_selector = this.ui_graph.type_selector(type.name);
                var edges = this.ui_graph.cytoscape().edges(type_rule_selector);
                this.ui_graph.set_edge_type(edges, type.name);
            }
        };
        Main.prototype.on_selection_changed = function () {
            var selected_nodes = this.ui_graph.selected_nodes();
            var selected_edges = this.ui_graph.selected_edges();
            if (selected_edges.length == 0 && (selected_nodes.length > 0 && selected_nodes.length < 3)) {
            } else if (selected_nodes.length == 0 && selected_edges.length == 1) {
            } else {
            }
            //start code for getting transactions of selected nodes in transaction anlysis
            if (window.global.page && window.global.page == "tI") {
                var entityIds = [];
                $.each(selected_nodes, function (i, d) {
                    if (d.data().customer_number) {
                        entityIds.push(d.data().customer_number);
                    }
                });
                if (entityIds.length > 0) {
                    getTxInputOutput(entityIds.join(","),CurentVLAID);
                }
            }
            //end code for getting transactions of selected nodes in transaction anlysis
            this.ui_panel.on_selected_nodes_change(selected_nodes.length, selected_edges.length);
            this.update_selection_info();
        };
        Main.prototype.bindUI = function () {
            var _this = this;
            this.ui_panel.on('show-labels-change', function (evt, value) {
                _this.ui_graph.set_labels_visible(value);
            });
            this.ui_panel.on('show-map-change', function (evt, value) {
                _this.ui_graph.map_mode(value);
            });
            this.ui_panel.on('show-time-change', function (evt, value) {
                if (value)
                    _this.ui_panel.time_panel.show();
                else
                    _this.ui_panel.time_panel.hide();
            });
            this.ui_panel.on('change-theme', function (evt, value) {
                _this.ui_graph.vla_body(value);
            });
            this.ui_panel.on('type-filter-change', function (evt, data) {
                if (data.state)
                    _this.ui_graph.show_nodes_by_type(data.type);
                else
                    _this.ui_graph.hide_nodes_by_type(data.type);
            });
            this.ui_panel.on('show-hidden-click', function () {
                _this.ui_graph.cytoscape().elements().show();
            });
            this.ui_panel.on('graph-action', function (e, params) {
                var target = params.target;
                if (params.action == 'center-selected' || params.action == 'fit-selected') {
                    target = _this.ui_graph.cytoscape().$(":selected");
                }
                if (target && target.length) {
                    if (params.action == 'center' || params.action == 'center-selected')
                        _this.ui_graph.cytoscape().center(target);
                    else if (params.action == 'fit' || params.action == 'fit-selected')
                        _this.ui_graph.cytoscape().fit(target);
                    return;
                }
            });
            this.ui_panel.on('time-range-change', function (evt, value) {
                var is_any_affected = _this.ui_graph.apply_time_span([value.from, value.to]);
                if (is_any_affected) {
                    // TODO: is there any way to optimize this?
                    _this.apply_types();
                    _this.apply_connection_types();
                    _this.ui_graph.reassign_all_styles();
                }
            });
            this.ui_panel.on('graph-show-map', function () {
                _this.ui_graph.map_mode(true);
            });
            this.ui_panel.on('graph-exit-map', function () {
                _this.ui_graph.map_mode(false);
            });
            this.bind_focusUI();
            this.bind_importExportUI();
            this.bind_searchUI();
            this.bind_layoutsUI();
            this.bind_stylesUI();
            this.bind_contextMenu();
            this.rebind_qtip();
            this.NewLayoutsUI();
            this.ui_graph.cytoscape().on('click', 'node', function (event) {
//                if (_this.double_click_started) {
//                    // do on double click
//                    _this.ui_graph.focus(event.cyTarget);
//                }
//                _this.double_click_started = true;
//                window.setTimeout(function () {
//                    _this.double_click_started = false;
//                }, _this.double_click_timeout);
            });
            this.ui_graph.cytoscape().on('select', function () {
                _this.on_selection_changed();
            });
            this.ui_graph.cytoscape().on('unselect', function () {
                _this.on_selection_changed();
            });
            this.viewport.on("vla.graph-link-clicked", function (e, node_id) {
                var node = _this.ui_graph.cytoscape().filter("[id='" + node_id + "']");
                if (node.length) {
                    _this.ui_graph.cytoscape().zoom(1);
                    _this.ui_graph.cytoscape().stop().center(node);
                }
            });
            this.ui_panel.on('add-note', function (evt, data) {
                if (typeof data.element.data().notes == "undefined") {
                    data.element.data("notes", []);
                }
                data.element.data().notes.push({time: data.time, text: data.text});
                // redraw selection info to update annotations
                _this.update_selection_info();
            });
            this.ui_panel.on('delete-note', function (evt, data) {
                if (typeof data.element.data().notes == "undefined") {
                    return;
                }
                data.element.data().notes.splice(data.index, 1);
                // redraw selection info to update annotations
                _this.update_selection_info();
            });
        };
        Main.prototype.bind_focusUI = function () {
            var _this = this;
            this.ui_panel.on('graph-exit-focus', function () {
                _this.viewport.removeClass("vla-focused");
                _this.ui_graph.clear_focus();
            });
            this.ui_panel.on('focus-depth-change', function (evt, depth) {
                if (_this.viewport.hasClass("vla-focused"))
                    _this.ui_graph.focus_depth(depth);
            });
        };
        Main.prototype.bind_importExportUI = function () {
            var _this = this;
            this.ui_panel.on("import-case-request", function (e, caseId) {
                var options = {
                    type: "json",
                    caseId: caseId,
                    limit: "1000"
                };
                _this.ui_graph.cytoscape().elements().remove();
                _this.ui_graph.set_layout("preset");
                _this.data_server.load_and_import_elementexploration_json(options)
                        .then(function () {
                            _this.apply_types();
                            _this.apply_connection_types();
                            _this.apply_selected_attrFilters();
                            _this.ui_graph.set_layout(_this.ui_panel.layout_form.value());
                            _this.ui_graph.update();
                        });
            });
            this.ui_panel.on("import-file-request", function (e, file) {
                var reader = new FileReader();
                var import_progress = $.Deferred();
                reader.onload = function (e) {
                    var contents = e.target['result'];
                    var json_data = JSON.parse(contents);
                    _this.ui_graph.cytoscape().elements().remove();
                    _this.ui_graph.set_layout("preset");
                    _this.data_server.import_elementexploration_json(json_data, import_progress);
                };
                reader.readAsText(file);
                import_progress.then(function () {
                    _this.apply_types();
                    _this.apply_connection_types();
                    _this.apply_selected_attrFilters();
                    _this.ui_graph.set_layout(_this.ui_panel.layout_form.value());
                    _this.ui_graph.update();
                });
            });
            this.ui_panel.on('snapshot-all-click', function (e, snapshot_type) {
                // TODO: refactor export/import
                var filename = 'graph_' + VLA.Utils.time_string(new Date(), "", "", "_") + "." + snapshot_type;
                switch (snapshot_type) {
                    case 'json':
                        var json_data = _this.ui_graph.snapshot_json_all();
                        _this.data_server.upload_document_data(filename, JSON.stringify(json_data));
                        break;
                    case 'gexf':
                        var gexf_data = _this.ui_graph.snapshot_gexf_all();
                        _this.data_server.upload_document_data(filename, gexf_data);
                        break;
                    case 'jpg':
                    case 'png':
                        var img64 = _this.ui_graph.snapshot_image(snapshot_type);
                        _this.data_server.upload_document_data(filename, img64);
                        break;
                    default:
//                        console.error("Unsupported export format:", snapshot_type);
                }
            });
            this.ui_panel.on('snapshot-selected-click', function (e, snapshot_type) {
                var filename = 'graph_part_' + VLA.Utils.time_string(new Date(), "", "", "_") + "." + snapshot_type;
                switch (snapshot_type) {
                    case 'json':
                        var json_data = _this.ui_graph.snapshot_json_selected();
                        _this.data_server.upload_document_data(filename, JSON.stringify(json_data));
                        break;
                    case 'gexf':
                        var gexf_data = _this.ui_graph.snapshot_gexf_selected();
                        _this.data_server.upload_document_data(filename, gexf_data);
                        break;
                    case 'jpg':
                    case 'png':
                        var img64 = _this.ui_graph.snapshot_image(snapshot_type, true);
                        _this.data_server.upload_document_data(filename, img64);
                        break;
                    default:
//                        console.error("Unsupported export format:", snapshot_type);
                }
            });
        };
        Main.prototype.bind_layoutsUI = function () {
            var _this = this;
            this.ui_panel.on('layout-change', function (evt, layout_name) {
            	window.layout = layout_name;
                _this.ui_graph.set_layout(layout_name);
            });
            this.ui_panel.on('configurations-change', function (evt, configuration_name) {
                _this.ui_graph.set_configurations(configuration_name);
            });
            this.viewport.on("layout-ready", function () {
                _this.ui_panel.layout_form.button_start.hide();
                _this.ui_panel.layout_form.button_stop.show();
            });
            this.viewport.on("layout-stop", function () {
                _this.ui_panel.layout_form.button_start.show();
                _this.ui_panel.layout_form.button_stop.hide();
//                 cy_.maxZoom(2.5);
//                cy_.fit();
//                cy_.maxZoom(100);
            });
            this.ui_panel.layout_form.button_start.on("click", function () {
                _this.ui_graph.update();
            });
            this.ui_panel.layout_form.button_stop.on("click", function () {
                _this.ui_graph.stop_layout();
            });
        };
        Main.prototype.bind_stylesUI = function () {
            var _this = this;
            this.ui_graph.cytoscape().on("select", function (e) {
                _this.update_style_controls(e.cyTarget);
            });
            this.ui_panel.on("select-icon-change", function (e, value) {
                _this.ui_graph.set_node_icon(_this.ui_graph.selected_nodes(), value);
            });
            this.ui_panel.on("select-color-change", function (e, value) {
                _this.ui_graph.set_element_style(_this.ui_graph.selected_nodes(), {
                    // nodes
                    "background-color": value,
                });
            });
            this.ui_panel.on("select-edge-color-change", function (e, value) {
                _this.ui_graph.set_element_style(_this.ui_graph.selected_edges(), {
                    // edges
                    "line-color": value,
                    "target-arrow-color": value,
                    "source-arrow-color": value
                });
            });
            this.ui_panel.on("edge-type-change", function (e, value) {
                _this.ui_graph.set_edge_type(_this.ui_graph.selected_elements(), value);
            });
            this.ui_panel.on("select-font-change", function (e, value) {
                _this.ui_graph.set_element_style(_this.ui_graph.selected_elements(), {
                    "font-family": value,
                });
            });
            this.ui_panel.on("select-font-size-change", function (e, value) {
                _this.ui_graph.set_element_style(_this.ui_graph.selected_elements(), {
                    "font-size": value,
                });
            });
            this.ui_panel.on("select-border-color-change", function (e, value) {
                _this.ui_graph.set_element_style(_this.ui_graph.selected_nodes(), {
                    "border-color": value,
                });
            });
            this.ui_panel.on("edge-size-change", function (e, value) {
                _this.ui_graph.set_element_style(_this.ui_graph.selected_edges(), {
                    "width": value + 'px',
                });
            });
        };
        Main.prototype.update_style_controls = function (selected_element) {
            var custom_style = this.ui_graph.get_custom_style(selected_element);
            var is_custom_styled = this.ui_graph.is_custom_styled(selected_element);
            if (selected_element.isNode()) {
                var icon_name = VLA.UI.Graph.icon_name(selected_element.data("_icon"));
                var bg_color = '';
                var border_color = '';
                var font_family = '';
                var font_size = '';
                if ((is_custom_styled || selected_element.isParent()) && custom_style) {
                    bg_color = custom_style["background-color"];
                    border_color = custom_style["border-color"];
                    font_family = custom_style["font-family"];
                    font_size = custom_style["font-size"];
                }
                this.ui_panel.style_panel.font_control.val(font_family).selectric('refresh');
                this.ui_panel.style_panel.font_size_control.val(font_size).selectric('refresh');
                this.ui_panel.style_panel.icon_control.val(icon_name).selectric('refresh');
                this.ui_panel.style_panel.color_control.spectrum("set", bg_color);
                this.ui_panel.style_panel.border_color_control.spectrum("set", border_color);
            }
            if (selected_element.isEdge()) {
                var line_color = '';
                var line_width = 1;
                var font_family = '';
                var font_size = '';
                if (is_custom_styled && custom_style) {
                    line_color = custom_style["line-color"];
                    line_width = custom_style["width"];
                    font_family = custom_style["font-family"];
                    font_size = custom_style["font-size"];
                }
                var edge_type = this.ui_graph.get_edge_type(selected_element);
                this.ui_panel.edge_style_panel.color_control.spectrum("set", line_color);
                this.ui_panel.edge_style_panel.type_control.val(edge_type).selectric("refresh");
                this.ui_panel.edge_style_panel.size_control.val(line_width);
                this.ui_panel.edge_style_panel.font_control.val(font_family).selectric('refresh');
                this.ui_panel.edge_style_panel.font_size_control.val(font_size).selectric('refresh');
            }
        };

        Main.prototype.bind_contextMenu = function () {
            var _this = this;
            var cy = this.ui_graph.cytoscape();
            cy['cxtmenu']({
                selector: 'node',
                commands: function (target) {
                	
                    $('#vla_tooltip').css('display', 'none');
                    return _this.context_commands_node(target);
                }
            });
            cy['cxtmenu']({
                selector: 'edge',
                commands: function (target) {
                    $('#vla_tooltip').css('display', 'none');
                    return _this.context_commands_edge(target);
                }
            });
            cy['cxtmenu']({
                selector: 'core',
                commands: function () {
                    return _this.context_commands_core();
                }
            });
            
        };

        Main.prototype.rebind_qtip = function () {
            if (this.options.tip_event == 'none')
                return;
            var self = this;
            window.vlaBuildingObjects = this;
            var qtip_options = {
                content: function () {
                    var node = this;
                    if (node.isEdge())
                        return self.ui_panel.selection_info_panel.edge_info(node);
                    else
                        return self.ui_panel.selection_info_panel.node_info(node);
                },
                position: {
                    my: 'bottom center',
                    at: 'top center',
                    adjust: {method: "none"}
                },
                style: {
                    classes: 'qtip-bootstrap',
                    tip: {
                        width: 16,
                        height: 8
                    }
                },
                show: {
                    event: 'mouseover'
                },
                hide: {
                    event: 'mouseout'
                },
                onHide: function() { $(this).qtip('destroy'); }
            };
            if (this.options.tip_event == 'hover') {
                qtip_options.show = {event: "mouseover"};
                qtip_options.hide = {event: "mouseout"};
            } else if (this.options.tip_event == 'rclick') {
                qtip_options.show = {event: "cxttap"};
            } else {
                qtip_options.show = {event: "click"};
            }
            var tool_tip = $('body').append('<div id="vla_tooltip" style="visibility:visible;position:absolute;display:none;z-index: 99999;text-transform:uppercase"><span class="tooltip-text"><span class="tool-tip-x-val"></span><table><tbody><tr><td></td><td><strong>216.4 mm</strong></td></tr><tr><td>New York:</td><td><strong>91.2 mm</strong></td></tr><tr><td>London:</td><td><strong>52.4 mm</strong></td></tr><tr><td>Berlin: </td><td><strong>47.6 mm</strong></td></tr></tbody></table></span></div>');
//            //var tool_tip = $('body').append('<div class="Bubble_Chart_tooltip" style="position: absolute;z-index: 99999;opacity: 1; pointer-events: none; display:none;text-transform:uppercase;background-color:#0cae96;  padding: 10px;border-radius: 5px; border: 1px solid gray;font-size: 10px;color:black;"><span style=" font-size: 12px; position: absolute; white-space: nowrap;  margin-left: 0px; margin-top: 0px; left: 8px; top: 8px;"><span style="font-size:10px" class="tool_tip_x_val"></span><table><tbody><tr><td style="padding:0"> </td><td style="padding:0"><b>216.4 mm</b></td></tr><tr><td style="color:#434348;padding:0">New York: </td><td style="padding:0"><b>91.2 mm</b></td></tr><tr><td style="color:#90ed7d;padding:0">London: </td><td style="padding:0"><b>52.4 mm</b></td></tr><tr><td style="color:#f7a35c;padding:0">Berlin: </td><td style="padding:0"><b>47.6 mm</b></td></tr></tbody></table></span></div>');
             
            this.ui_graph.cytoscape().elements()['qtip'](qtip_options);
        };

        Main.prototype.NewLayoutsUI = function(){
            var _this = this;
            if(!this.ui_panel.layout_form1){
                return;
            }
            var filterinput  = this.ui_panel.layout_form1.select;
            this.ui_panel.on('FilterInput-change', function (evt, layout_name) {
                if(window.optionSelected)
                 window.leadGeneration_UC2_filterBy(evt.currentTarget.getAttribute("id"),layout_name);
            	// window.layout = layout_name;
                // _this.ui_graph.set_layout(layout_name);
//                 var data_new = window.global.filterdatatype.vertices;
//                 var data_filtered = [];
//                 $.each(data_new, function(i,d){
//                     if(d.labelV == layout_name){
//                         data_filtered.push(d)
//                     }
//                 });
//                 // _cy_.elements().show();
//                 var attr_id_node = _this.ui_graph.cytoscape().elements(":selected").attr("id");
//                 if(attr_id_node){
//                     var n = _this.ui_graph.cytoscape().getElementById(attr_id_node);
//                     n.select();
//                     // n.flashClass("flashed",2000);
//                     _this.ui_graph.cytoscape().center(n);
//                     // _this.update_selection_info();
//                     var aa =  _cy_.filter('edge[from = "'+ attr_id_node +'"], edge[to  = "'+ attr_id_node +'"]');
//                     $.each(aa,function(i,d){
//                         _cy_.elements("node[id = '"+ d._private.data.from +"']").show()
//                         _cy_.elements("node[id = '"+ d._private.data.to +"']").show()
//                     });
//                 }else{
//                     _cy_.elements().show();
//                 }

//                 // $.each(_this.ui_graph.cytoscape().elements(), function(i,d){
//                     $.each(_cy_.elements(":visible"), function(i,d){

// //                        d._private.style.display.value == "element";
//                     // if(d["_private"].data.labelV == "Customer"){
//                     //     var n = _this.ui_graph.cytoscape().getElementById(d["_private"].data.id);
//                     //     n.show();
//                     //     _this.ui_graph.cytoscape().center(n);
                        
//                     // }else if(d["_private"].data.labelV == "Card"){
//                     //     var n = _this.ui_graph.cytoscape().getElementById(d["_private"].data.id);
//                     //     n.show();
//                     //     // n.addClass("hidden");
//                     //     //  n.select();
//                     // }else
//                     if(d._private.style.display && d._private.style.display.value == "none") 
//                     {
//                         return;
//                     }
//                     var n = _this.ui_graph.cytoscape().getElementById(d["_private"].data.id);
                       
//                     if(layout_name.toLowerCase() == "all"){
//                          n.show();
//                     }else
//                     if(d["_private"].data.labelV == layout_name || d["_private"].data.labelV == "Customer" ||  d["_private"].data.labelV == "Card"){
//                         // var n = _this.ui_graph.cytoscape().getElementById(d["_private"].data.id);
//                         //     n.select();
//                         // d["_private"].selected = true;
//                         n.show();
//                     }else if(d["_private"].data.labelV == "Merchant" ||  d["_private"].data.labelV == "MerchantType"){
//                         // d["_private"].selected = false;
//                         n.hide();
//                     }else{
//                         n.show();
//                     }
//                     _this.update_selection_info();
//                 })
                // _this.ui_graph.cytoscape().elements(":selected").unselect();
                // _this.ui_graph.cytoscape().elements(":hidden").show()
            });
        }
        Main.prototype.bind_searchUI = function () {
            var _this = this;
            if (!this.ui_panel.search_panel)
                return;
            var search_input = this.ui_panel.search_panel.input;
            var options = {
                highlight: true,
                minLength: 1,
            };
            var dataset;
            var templates;
            templates = {
                suggestion: function (query_item) {
                    var span = $("<div>").html(query_item._label);
                    // let span = $("<div>").html(query_item.label + " <span class='vla-id'>" + query_item.id + "</span>");
                    // span.append("<div>type:" + query_item.type + "</div>");
                    if (query_item.name)
                        span.append("<div>name:" + query_item.name + "</div>");
                    if (query_item.title)
                        span.append("<div>title:" + query_item.title + "</div>");
                    return span[0].outerHTML;
                }
            };

            dataset = {
                name: 'search',
                display: "_label",
                source: function (query, callback) {
                    _this.search_elements(query, function (result) {
                        var res = result.map(function (n) {
                            return n.data();
                        });
                        callback(res);
                    });
                },
                templates: templates
            };

            var typeahead = search_input.typeahead(options, dataset);
            typeahead.on('typeahead:selected', function (e, entry) {
                // console.info("typeahead:selected");
                _this.ui_graph.cytoscape().elements(":selected").unselect();
                var n = _this.ui_graph.cytoscape().getElementById(entry.id);
                n.select();
                // n.flashClass("flashed",2000);
                _this.ui_graph.cytoscape().center(n);
                _this.update_selection_info();
                return false;
            });
            this.ui_panel.on('search-submit', function (e, search_string) {
//                console.info('app.search-submit', search_string);
                search_input.typeahead("close");
                // search_string
                _this.ui_graph.cytoscape().elements(":selected").unselect();
                if (search_string) {
                    _this.search_elements(search_string, function (result) {
                        result.select();
                        if (result.length)
                            _this.ui_graph.cytoscape().center(result);
                    });
                }
            });
        };
        Main.prototype.search_elements = function (query, callback) {
            function matches(str, q) {
                str = (str || '').toLowerCase();
                q = (q || '').toLowerCase();
                return str.match(q);
            }
            var fields = ['id', '_label', 'name', 'type', 'title'];
            function anyFieldMatches(n) {
                for (var i = 0; i < fields.length; i++) {
                    var f = fields[i];
                    if (matches(n.data(f), query)) {
                        return true;
                    }
                }
                return false;
            }
            function sortByLabel(n1, n2) {
                if (n1.data('_label') < n2.data('_label')) {
                    return -1;
                } else if (n1.data('_label') > n2.data('_label')) {
                    return 1;
                }
                return 0;
            }
            var result = this.ui_graph.cytoscape().nodes().stdFilter(anyFieldMatches).sort(sortByLabel);
            if (typeof callback == 'function')
                callback(result);
        };
        Main.prototype.context_commands_node = function (context_target) {
            var _this = this;
            var commands = this.context_commands_common_targeted(context_target);
//            commands.push({
//                content: '<span title="Focus" class="fa fa-sitemap fa-2x"></span>',
//                select: function (ele) {
//                    _this.ui_graph.focus(ele, _this.ui_panel.focus_depth_select.value());
//                }
//            })
            if (context_target.data('labelV') == 'Article' && context_target.data('article_body')) {
                commands.push({
                    content: '<img src="'+window.imgPath+'img/menu_icons/Entity_extract.png" width="35px" height="35px" alt="entityVisualizer">',
                    select: function (ele) {
                        _this.ui_graph.articleSearch(ele);
                    }
                });
            }
            //show expand icon for transaction analysis in context menu code starts here
            if (window.global.page && window.global.page == "tI" && (CurentVLAID =="#vla" ||CurentVLAID =="#vlaTIFull") && context_target.data('labelV') == 'customer' && !context_target.data('generated')) {
//            	if(context_target.data('labelV') == 'customer' && context_target.data('article_body')){
                commands.push({
                    content: '<span title="Expand" class="fa fa-spinner fa-2x"></span>',
                    select: function (ele) {
                    	if(!window.global.expandedNodes[CurentVLAID]){
                    		window.global.expandedNodes[CurentVLAID] =[];
                    	}
                        window.global.expandedNodes[CurentVLAID].push(ele.data().oid)
                        getGraphIDWithAlert(ele.data().oid,CurentVLAID);
                    }
                });

//                commands.push({
//                    content: '<span title="Restore hidden" class="fa fa-eye fa-2x"></span>',
//                    select: function (ele) {
//                        _this.ui_graph.cytoscape().elements(":hidden").show();
//                        if (window.global.page && window.global.page == "tI" && (CurentVLAID =="#vla" ||CurentVLAID =="#vlaTIFull"))
//                            showHideTransactionAnalysisNode(ele.data(), "unhide");
//                    }
//                });
                if (context_target.data('labelV') == 'customer') {

                    commands.push({
                        content: '<span title="Focus" class="fa fa-commenting-o  fa-2x"></span>',
                        select: function (ele) {
                            loadAdverseNewsForSelected(ele.data())
                        }
                    });
                }
//                }
            }
            //show expand icon for transaction analysis in context menu code end here
            if (context_target.data('labelV') == 'person' || context_target.data('labelV') == 'Person' || context_target.data('labelV') == 'company' || context_target.data('labelV') == 'Company' || context_target.data('labelV') == 'customer' || context_target.data('labelV') == 'Customer') {
                commands.push({
                    content: '<img src="'+window.imgPath+'img/menu_icons/search.png" alt="search">',
                    select: function (ele) {
                        _this.ui_graph.entityPage(ele);
                    }
                });
            }
            if (context_target.data('labelV') == 'person' || context_target.data('labelV') == 'Person' || context_target.data('labelV') == 'company' || context_target.data('labelV') == 'Company' || context_target.data('labelV') == 'customer' || context_target.data('labelV') == 'Customer') {
                commands.push({
                    content: '<img src="'+window.imgPath+'img/menu_icons/icon_navigate.png" alt="navigate">',
                    select: function (ele) {
                        _this.ui_graph.new_search(ele);
                    }
                });
            }
            if (context_target.data('properties') && (context_target.data('properties').url || context_target.data('properties')['bst:registryURI']) ) {
                commands.push({
                    content: '<span title="Connect" class="fa fa-link fa-2x"></span>',
                    select: function (ele) {
                    	window.open((ele.data('properties').url || context_target.data('properties')['bst:registryURI']) , "_blank")
                    }
                });
            }
            if (this.ui_graph.is_group(context_target) || this.ui_graph.is_inside_group(context_target)) {
                commands.push({
                    content: '<span title="Ungroup" class="fa fa-object-ungroup fa-2x"></span>',
                    select: function (node) {
                        _this.ui_graph.ungroup_nodes(node);
                    }
                });
            }
            //commands = commands.concat(this.context_commands_selected());
            return commands;
        };
        Main.prototype.context_commands_edge = function (context_target) {
            var _this = this;
            var commands = this.context_commands_common_targeted(context_target);
            commands.push({
                content: 'Reverse',
                select: function (edge) {
                    var source = edge.target();
                    var target = edge.source();
                    _this.ui_graph.cytoscape().remove(edge);
                    _this.ui_graph.connect_nodes(source, target);
                }
            });
            //commands = commands.concat(this.context_commands_selected());
            return commands;
        };
        Main.prototype.context_commands_common_targeted = function (context_target) {
            var _this = this;
            var commands = [];
            commands.push({
                content: '<img src="'+window.imgPath+'img/menu_icons/edit.png" height="34px" width="34px" alt="delete">',
                select: function (ele) {
                    var label = window.prompt("Label", ele.data("_label"));
                    if (label) {
                        _this.ui_graph.actions.do("rename", {target: ele, label: label});
                    }
                }
            });
            commands.push({
                content: '<img src="'+window.imgPath+'img/menu_icons/hide.png" height="34px" width="34px" alt="hide">',
                select: function (ele) {
                    _this.ui_graph.hide_elements(ele);
                    if (window.global.page && window.global.page == "tI")
                        showHideTransactionAnalysisNode(ele.data(), "hide");
                }
            });

            commands.push({
                content: '<img src="'+window.imgPath+'img/menu_icons/delete.png" height="34px" width="34px" alt="delete">',
                select: function (ele) {
                    var confirm_message = 'Delete element?';
                    if (ele.isNode())
                        confirm_message = "Delete node '" + ele.data('_label') + "'?";
                    else if (ele.isEdge()) {
                        if (ele.data('_label'))
                            confirm_message = "Delete connection '" + ele.data('_label') + "'?";
                        else
                            confirm_message = 'Delete connection?';
                    }
                    if (!VLA.UI.confirm(confirm_message))
                        return;
                    _this.ui_graph.remove(ele);
                }
            });
            if (this.ui_graph.cytoscape().nodes(":selected").not(context_target).length) {
                if (context_target.isNode()) {
                    commands.push({
                        content: '<span title="Group" class="fa fa-object-group fa-2x"></span>',
                        select: function (node) {
                            var nodes = _this.ui_graph.selected_nodes().add(node);
                            _this.ui_graph.group_nodes(nodes);
                        }
                    });
                    commands.push({
                        content: '<span title="Connect" class="fa fa-link fa-2x"></span>',
                        select: function (node) {
                            var source = _this.ui_graph.selected_nodes().not(node);
                            var target = node;
                            _this.ui_graph.connect_nodes(source, target);
                            // this.ui_graph.update();
                        }
                    });
                    commands.push({
                        content: 'Find route',
                        select: function (node) {
                            var source = _this.ui_graph.selected_nodes().not(node);
                            var target = node;
                            var path = _this.ui_graph.find_shortest_path(source, target);
                            // this.ui_graph.update();
                        }
                    });
                }
            }
            return commands;
        };
        Main.prototype.context_commands_selected = function () {
            var _this = this;
            var commands = [];
            var selected_nodes_count = this.ui_graph.cytoscape().nodes(":selected").length;
            if (selected_nodes_count) {
                commands.push({
                    content: '<span class="fa fa-list-ul fa-2x"></span><span title="Hide" class="fa fa-eye-slash fa-2x"></span>',
                    select: function () {
                        _this.ui_graph.hide_elements(_this.ui_graph.cytoscape().filter(":selected"));
                    }
                });
                commands.push({
                    content: '<span class="fa fa-list-ul fa-2x"></span><span title="Delete selected" class="fa fa-trash fa-2x"></span>',
                    fillColor: 'rgba(200, 0, 0, 0.75)',
                    activeFillColor: 'rgba(200, 0, 0, 0.75)',
                    select: function () {
                        if (!VLA.UI.confirm("Delete all selected elements?"))
                            return;
                        _this.ui_graph.remove(_this.ui_graph.cytoscape().filter(":selected"));
                    }
                });
                if (selected_nodes_count > 1) {
                    commands.push({
                        content: '<span title="Group" class="fa fa-object-group fa-2x"></span>',
                        select: function () {
                            _this.ui_graph.group_nodes(_this.ui_graph.cytoscape().nodes(":selected"));
                        }
                    });
                }
            }
            if (this.ui_graph.in_focus()) {
                commands.push({
                    content: '<span title="Exit focus" class="fa fa-sign-out fa-2x"></span>',
                    select: function () {
                        _this.ui_graph.clear_focus();
                    }
                });
            }
            if (this.ui_graph.cytoscape().filter(":hidden").length) {
                commands.push({
                    content: '<span title="Restore hidden" class="fa fa-eye fa-2x"></span>',
                    select: function () {
                        _this.ui_graph.cytoscape().elements(":hidden").show();
                    }
                });
            }
            return commands;
        };
        Main.prototype.context_commands_core = function () {
            var _this = this;
            var commands = [];
            commands.push({
                content: '<img  src="'+window.imgPath+'img/menu_icons/add.png" height="34px" width="34px" alt="add">',
                select: function (evt, e) {
                    // TODO: generate id? show edit/create dialog?
                    var name = VLA.UI.prompt("name");
                    var node = {data: {}};
                    node.data['name'] = name;
                    node.data['_label'] = name;
                    node['position'] = {x: e.cyPosition.x, y: e.cyPosition.y};
                    _this.ui_graph.cytoscape().add(node);
                    // this.ui_graph.update();
                }
            });
            if (!this.ui_graph.actions.isUndoStackEmpty()) {
                var stack = this.ui_graph.actions.getUndoStack();
                commands.push({
                    content: 'Undo ' + stack[0].name,
                    select: function (evt, e) {
                        _this.ui_graph.actions.undo();
                    }
                });
            }
            if (!this.ui_graph.actions.isRedoStackEmpty()) {
                var stack = this.ui_graph.actions.getRedoStack();
                commands.push({
                    content: 'Redo ' + stack[0].name,
                    select: function (evt, e) {
                        _this.ui_graph.actions.redo();
                    }
                });
            }
            var selected_nodes_count = this.ui_graph.selected_nodes().length;
            if (selected_nodes_count) {
                if (selected_nodes_count == 2) {
                    commands.push({
                        content: '<span title="Connect" class="fa fa-link fa-2x"></span>',
                        select: function () {
                            var els = _this.ui_graph.selected_nodes();
                            var source = els.eq(0);
                            var target = els.eq(1);
                            _this.ui_graph.connect_nodes(source, target);
                            // this.ui_graph.update();
                        }
                    });
                }
            }
            commands = commands.concat(this.context_commands_selected());
//            commands.push({
//                content: 'Entity-Page',
//                select: function () {
//                    _this.ui_graph.entityPage();
//                }
//            });
            commands.push({
                content: 'Cen-B',
                select: function () {
                    _this.ui_graph.mark_betweennessCentrality(_this.ui_graph.cytoscape().elements());
                }
            });
            commands.push({
                content: 'Cen-Deg',
                select: function () {
                    _this.ui_graph.mark_degreeCentrality(_this.ui_graph.cytoscape().elements());
                }
            });
            commands.push({
                content: 'Cen-Cl',
                select: function () {
                    _this.ui_graph.mark_closenessCentrality(_this.ui_graph.cytoscape().elements());
                }
            });
            commands.push({
                content: 'Cen-CLEAR',
                select: function () {
                    _this.ui_graph.unmark_centrality();
                }
            });
            commands.push({
                content: 'Cluster',
                select: function () {
                    _this.ui_graph.clustering();
                }
            });

            if (commands.length == 1) {
                commands.push({
                    content: ' ',
                    disabled: true,
                    select: function () {
                    }
                });
            }
            return commands;
        };
        Main.prototype.update_selection_info = function () {
            var selected_elements = this.ui_graph.cytoscape().filter(":selected");
            this.ui_panel.selection_info_panel.update_content(selected_elements);
        };
        Main.prototype.init_attrFilter = function () {
            var _this = this;
            if (!this.options.filter_fields || !this.options.filter_fields.length) {
                this.ui_panel.attr_filter_form.hide();
                return;
            }
            this.ui_panel.attr_filter_form.set_attributes_list(this.options.filter_fields);
            if (typeof this.cached_attributes_values === 'undefined') {
                this.cached_attributes_values = {};
                this.cache_attrFiltered_fields();
            }
            var search_input = this.ui_panel.attr_filter_form.filter_control;
            var options = {
                highlight: true,
                minLength: 1,
            };
            var dataset;
            dataset = {
                name: 'search',
                // display: "_label",
                source: function (query, callback) {
                    // this.search_elements(query, (result) => {
                    // 	var res = result.map((n) => { return n.data(); });
                    // 	callback(res);
                    // });
                    var attr = _this.ui_panel.attr_filter_form.attr_select.val();
                    if (!attr)
                        callback([]);
                    // filter by all other filters here
                    // var filtered_nodes = this.ui_graph.cytoscape().nodes().stdFilter( this._attrFilter );
                    // var res = filtered_nodes.map((n) => { return n.data(attr); });
                    var res = [];
                    for (var value in _this.cached_attributes_values[attr]) {
                        if (!_this.cached_attributes_values[attr].hasOwnProperty(value))
                            continue;
                        if (VLA.Utils.matches(value, query) && _this.get_attrFilter_index(attr, value) == -1)
                            res.push(value);
                    }
                    callback(res);
                }
            };
            var typeahead = search_input.typeahead(options, dataset);
            typeahead.on('typeahead:selected', function (e, search_string) {
                // console.info("typeahead:selected");
                var attr = _this.ui_panel.attr_filter_form.attr_select.val();
                typeahead.typeahead('val', '');
                _this.add_attrFilter(attr, search_string);
            });
            this.ui_panel.on('attrfilter-submit', function (e, search_string) {
                var attr = _this.ui_panel.attr_filter_form.attr_select.val();
                typeahead.typeahead("close");
                typeahead.typeahead('val', '');
                if (search_string)
                    _this.add_attrFilter(attr, search_string);
            });
            this.ui_panel.on('attrfilter-remove', function (e, filter_index) {
                _this.remove_attrFilter_by_index(filter_index);
            });
        };
        Main.prototype.add_attrFilter = function (attr, search_string) {
            this.selected_filters.push({a: attr, q: search_string});
            this.redraw_selected_attrFilters();
            this.apply_selected_attrFilters();
        };
        Main.prototype.get_attrFilter_index = function (attr, search_string) {
            if (typeof this.selected_filters === 'undefined' || !this.selected_filters.length)
                return -1;
            for (var i = 0; i < this.selected_filters.length; i++) {
                var pair = this.selected_filters[i];
                if (!pair)
                    continue;
                if (pair.a == attr && pair.q == search_string)
                    return i;
            }
            return -1;
        };
        // public remove_attrFilter(attr:string, search_string:string) {
        // 	let index = this.get_attrFilter_index(attr, search_string);
        // 	this.remove_attrFilter_by_index(index);
        // }
        Main.prototype.remove_attrFilter_by_index = function (index) {
            this.selected_filters.splice(index, 1);
            this.redraw_selected_attrFilters();
            this.apply_selected_attrFilters();
        };
        // TODO: optimise this!!!
        Main.prototype.cache_attrFiltered_fields = function () {
            var _this = this;
            for (var _i = 0, _a = this.options.filter_fields; _i < _a.length; _i++) {
                var attr = _a[_i];
                this.cached_attributes_values[attr] = {};
            }
            // console.time("init: cache attr values");
            var nodes;
            // if (this.selected_filters.length)
            // 	nodes = this.ui_graph.cytoscape().nodes(".af-highlight"); // filtered
            // else
            nodes = this.ui_graph.cytoscape().nodes(); // all
            nodes.forEach(function (node) {
                for (var _i = 0, _a = _this.options.filter_fields; _i < _a.length; _i++) {
                    var attr = _a[_i];
                    if (attr == 'degree')
                        continue;
                    var value = node.data(attr);
                    if (value)
                        _this.cached_attributes_values[attr][value] = 1;
                }
            });
//            console.timeEnd("init: cache attr values");
        };
        Main.prototype.redraw_selected_attrFilters = function () {
            this.ui_panel.attr_filter_form.redraw_selected_attrFilters(this.selected_filters);
        };
        Main.prototype.apply_selected_attrFilters = function () {
            var _this = this;
            this.ui_graph.cytoscape().nodes().removeClass("af-highlight");
            if (typeof this.selected_filters === 'undefined' || this.selected_filters.length == 0) {
                return;
            }
            var filtered_nodes = this.ui_graph.cytoscape().nodes().stdFilter(function (n) {
                return _this._attrFilter(n);
            });
            filtered_nodes.addClass("af-highlight");
            // this.cache_attrFiltered_fields();
        };
        Main.prototype._attrFilter = function (node) {
            if (typeof this.selected_filters === 'undefined' || !this.selected_filters.length)
                return false;
            var match_all = true;
            for (var _i = 0, _a = this.selected_filters; _i < _a.length; _i++) {
                var pair = _a[_i];
                if (!pair)
                    continue;
                if (pair.a == 'degree') {
                    var _b = (pair.q).match("^\s*(<=|>=|=|>|<)?\s*(-?[0-9]+(\.[0-9]+)?)?\s*$"), operation = _b[1], value = _b[2];
                    var rule = pair.q;
                    if (!operation)
                        rule = "=" + rule;
                    match_all = match_all && node.is("[[degree" + rule + "]]");
                } else {
                    var attr_value = node.data(pair.a);
                    match_all = match_all && !!VLA.Utils.matches(attr_value, pair.q);
                }
            }
            return match_all;
        };
        return Main;
    }());
    VLA.Main = Main;
})(VLA || (VLA = {}));
(function(){
	var locale = "ua";
	var data = {
		"Node" : "Вузел",
		"Edge" : "Зв'язок",
		"Search" : "Пошук",
		"Restore all hidden" : "Відновити усі скриті",
		"Filter":"Фільтр",
		"Show all labels" : "Імена",
		"Show time panel" : "Стрічка часу",
		"Show map" : "Мапа",
		"Icon" : "Знак",
		"Font" : "Шрифт",
		"Font-size" : "Розмір шрифту",
		"Color" : "Колір",
		"Border" : "Кайма",
		"Type" : "Тип",
		"Width" : "Ширина",
		"Re-Arrange" : "Перебудувати",
		"Snapshot as": "Знімок",
		"All" : "Все",
		"Selected" : "Вибране",
		"Import JSON" : "Імпорт JSON",
		"Load Case data" : "Завантажити з АПИ",
		"Custom styled" : "Custom styled",
		"Delete note" : "Видалити",
		"Send" : "Відправити"
	};
	VLA._registerLocale(locale, data);
})();
(function(){
	var locale = "ar";
	var rtl = true;
	var data = {
		"Node" : "Вузел",
		"Edge" : "Зв'язок",
		"Search" : "بحث",
		"Restore all hidden" : "استعادة جميع مخفي",
		"Filter":"فلتر",
		"Show all labels" : "Імена",
		"Show time panel" : "Стрічка часу",
		"Show map" : "Мапа",
		"Icon" : "Знак",
		"Font" : "Шрифт",
		"Font-size" : "Розмір шрифту",
		"Color" : "Колір",
		"Border" : "Кайма",
		"Type" : "Тип",
		"Width" : "Ширина",
		"Re-Arrange" : "Перебудувати",
		"Snapshot as": "Знімок",
		"All" : "Все",
		"Selected" : "Вибране",
		"Import JSON" : "Імпорт JSON",
		"Load Case data" : "Завантажити з АПИ",
		"Custom styled" : "Custom styled",
		"Delete note" : "Видалити",
		"Add note" : "Зберегти коментар"
	};
	VLA._registerLocale(locale, data, rtl);
})();

//# sourceMappingURL=app.js.map
new VLA.Main(vla_options);
window.leadgenerationvlaspinner1 =false;window.leadgenerationvlaspinner2 =false;
}
