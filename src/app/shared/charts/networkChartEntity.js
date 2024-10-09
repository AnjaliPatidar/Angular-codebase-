/**
 * Function to load network chart
 */
// var {cytoscape } = require('./cytoscape-cola')
import * as $ from 'jquery';
import * as d3 from 'd3';
import cytoscape from 'cytoscape';
import cise from 'cytoscape-cise';
cytoscape.use(cise)

function LoadEntityNetworkChart() {}
LoadEntityNetworkChart.prototype.loadEntityNetworkChart = function(data, options, currentSearch, layout, vlaDataType, jurisdictionListValue) {
    var availableIcons = ['person', 'website', 'company', 'company_number', 'officer_id', 'location', 'skill', 'article', 'root-company', 'root', 'sentence', 'transaction', 'organization', 'industry', 'alert', 'user', 'account', 'follows', 'investment', 'returns', 'stock', 'stock_change', 'text', 'product', 'vulnerability', 'date', 'user', 'tweet', 'usermention', 'follower_following_count', 'product', 'trade', 'founder', 'follower', 'open_port', 'gps', 'service', 'metadata', 'cyber_info', 'share-changes', 'photo', 'assets_chart', 'video', 'profile_chart', 'cover', 'revanue_chart', 'comment', 'post', 'stock', 'filling', 'compensation', 'board_member', 'membership', 'profit_chart']
    var vladata = data;
    $(".qtip").remove();
    var colorScale = d3.scaleOrdinal().range(["#669802", "#D894B6", "#335C81", "#CF9700", "#E58B19"]);
    var defaultColor = "#62747E";
    var layoutOption;
    if (layout) {
        layoutOption = layout; //layout
    } else {
        layoutOption = 'cola';
    }
    var cy = window.cy = cytoscape({
        container: document.getElementById(options.id),
        boxSelectionEnabled: false,
        autounselectify: true,

        style: cytoscape.stylesheet()
            .selector('node')
            .css({
                "width": function(e) {
                    //                    var max_scale = 1, min_scale = 0, scale_span = max_scale - min_scale;
                    //                    if (e.data().risks == void 0) {
                    //                        if (e.data('riskScore')) {
                    //                            var w = e.data('weight') * 1;
                    //                            var r = e.data('riskScore') == 0 ? 1 : e.data('riskScore');
                    //                            var risk = r * 1;
                    //                            if (!w || isNaN(w))
                    //                                w = 1;
                    //                            var risk_weight = risk * w;
                    //                            var wf = (risk_weight < 3) ? 3 : (risk_weight > 6 ? 6 : risk_weight);
                    //                            return wf * 20;
                    //                        } else {
                    return "80";
                    //                        }
                    //                    }
                },
                "height": function(e) {
                    //                    var max_scale = 1, min_scale = 0, scale_span = max_scale - min_scale;
                    //                    if (e.data().risks == void 0) {
                    //                        if (e.data('riskScore')) {
                    //                            var w = e.data('weight') * 1;
                    //                            var r = e.data('riskScore') == 0 ? 1 : e.data('riskScore');
                    //                            var risk = r * 1;
                    //                            if (!w || isNaN(w))
                    //                                w = 1;
                    //                            var risk_weight = risk * w;
                    //                            var wf = (risk_weight < 3) ? 3 : (risk_weight > 6 ? 6 : risk_weight);
                    //                            return wf * 20;
                    //                        } else {
                    return "80";
                    //                        }
                    //                    }
                },
                // 'opacity': function(e) {
                //  return 0.5;
                // },

                //     'border-radius':  function (e) {
                //         if (e.data().labelV == "Company" || e.data().labelV == "branches" || e.data().labelV == "Link") {
                //             return "2px";
                //         }
                //         if (e.data().labelV == "Person" || e.data().labelV == "officership" || e.data().labelV == "Organization") {
                //         	return "2px";
                //         }
                //         // if (e.data().labelV == "Organization" ) {
                //         // 	return "#4c7cff";
                //         // }
                //         // if(e.data()['parent']){
                //         //     return "#4c7cff";
                //         // }
                //    },
                'border-width': function(e) {
                    return "2px";
                },
                'border-type': function(e) {
                    return "solid";
                },
                'border-color': function(e) {
                    if (e.data().labelV == "company" || e.data().labelV == "branches" || e.data().labelV == "Link") {
                        return "#008042";
                    }
                    if (e.data().labelV == "Person" || e.data().labelV == "officership") {
                        return "#2e7d32";
                    }
                    if (e.data().labelV == "product") {
                        return "#008042";
                    }
                    if (e.data().labelV == "similarCompany") {
                        return "#1976d3";
                    }
                    if (e.data().labelV == "Organization") {
                        return "#2db7c7";
                    }
                    //key=="spouse" || key=="children" || key=="sibling" || key=="knows" || key=="home_location" || key=="alumni_of" ||  key=="address" ||  key=="works_for"
                    if (e.data().labelV == "spouse" || e.data().labelV == "shareholder") {
                        return "#9c27b0";
                    }
                    if (e.data().labelV == "children") {
                        return "#8661c6";
                    }
                    if (e.data().labelV == "sibling") {
                        return "#3f51b5";
                    }
                    if (e.data().labelV == "knows") {
                        return "#e6ae20";
                    }
                    if (e.data().labelV == "home_location") {
                        return "#f28618";
                    }
                    if (e.data().labelV == "alumni_of") {
                        return "#00796b";
                    }
                    if (e.data().labelV == "address") {
                        return "#db1818";
                    }
                    if (e.data().labelV == "works_for") {
                        return "#2e7d32";
                    }

                    if (e.data().labelV.toLowerCase() == "shareholder" && e.data().type.toLowerCase() == "organization") {
                        return '#db1818';
                    }
                    if (e.data().labelV.toLowerCase() == "shareholder" && (e.data().type && e.data().type.toLowerCase() == "person")) {
                        return '#00796b';
                    }
                    if (e.data().labelV.toLowerCase() == "document") {
                        return '#f28618';
                    }
                    if (e.data().labelV.toLowerCase() == "branch") {
                        return '#2db7c7';
                    }

                    if (e.data()['rootval'] == "rootva") {
                        return "#ffa000";
                    }

                    if (e.data().riskScore > 60) {
                        return "#db1818";
                    }
                    // return "#00796b";
                },

                'background-color': function(e) {
                    if (e.data().evt_color) {
                        return e.data().evt_color;
                    }
                    if (e.data().labelV.toLowerCase() == "document" && e.data().fromCoreKb) {
                        return '#f28618';
                    }
                    if (e.data().labelV.toLowerCase() == "branch" && e.data().fromCoreKb) {
                        return '#2db7c7';
                    }
                    if (e.data().labelV == "company" || e.data().labelV == "branches" || e.data().labelV == "Link") {
                        return "#008042";
                    }
                    if (e.data().labelV == "product") {
                        return "#008042";
                    }
                    if (e.data().labelV == "similarCompany") {
                        return "#1976d3";
                    }
                    if ((e.data().labelV.toLowerCase() == "person" && e.data().fromCoreKb) || (e.data().labelV == "officership" && e.data().fromCoreKb)) {
                        return '#2e7d32';
                    }
                    if (e.data().labelV == "Person" || e.data().labelV == "officership") {
                        return "#CEDED0";
                    }
                    if (e.data().labelV == "Organization") {
                        return "#D0ECF0";
                    }
                    if (e.data().labelV.toLowerCase() == "shareholder" && e.data().fromCoreKb) {
                        return '#9c27b0';
                    }
                    //key=="spouse" || key=="children" || key=="sibling" || key=="knows" || key=="home_location" || key=="alumni_of" ||  key=="address" ||  key=="works_for"
                    if (e.data().labelV == "spouse" || e.data().labelV == "shareholder") {
                        return "#E4CDE9";
                    }

                    if (e.data().labelV == "children") {
                        return "#E0D8ED";
                    }
                    if (e.data().labelV == "sibling") {
                        return "#D4D7EC";
                    }
                    if (e.data().labelV == "knows") {
                        return "#F5EACE";
                    }
                    if (e.data().labelV == "home_location") {
                        return "#F8E2CD";
                    }
                    if (e.data().labelV == "alumni_of") {
                        return "#C7DFDD";
                    }
                    if (e.data().labelV == "address") {
                        return "#F1CACA";
                    }
                    if (e.data().labelV == "works_for") {
                        return "#CEDED0";
                    }
                    if (e.data()['rootval'] == "rootva") {
                        return "#ffa000";
                    }

                    if (e.data().riskScore > 60) {
                        return "#db1818";
                    }
                    if (e.data().labelV.toLowerCase() == "shareholder" && e.data().type.toLowerCase() == "organization") {
                        return '#F1CACA';
                    }
                    if (e.data().labelV.toLowerCase() == "shareholder" && (e.data().type && e.data().type.toLowerCase() == "person")) {
                        return '#C7DFDD';
                    }

                    if (e.data().labelV.toLowerCase() == "document") {
                        return '#F8E2CD';
                    }
                    if (e.data().labelV.toLowerCase() == "branch") {
                        return '#D0ECF0';
                    }

                    return defaultColor;
                    // return "#00796b";
                },
                'background-opacity': 0.2,
                'background-image': function(n) {
                    if (window.location.hash.indexOf("#!/") < 0) {
                        if (n.data().labelV == "company") {
                            return 'url(./assets/VLA/KeylineICONS/domain.svg)';
                        }
                        if (n.data().labelV == "similarCompany") {
                            return 'url(./assets/VLA/KeylineICONS/domain1.svg)';
                        }
                        if (n.data()['rootval'] == "rootva") {
                            return 'url(./assets/VLA/KeylineICONS/domain3.svg)';
                        }
                        if (n.data().labelV == "product") {
                            return 'url(./assets/VLA/KeylineICONS/product_light.svg)';
                        }
                        if (n.data().labelV.toLowerCase() == "branch") {
                            return 'url(./assets/VLA/KeylineICONS/branches.svg)';
                        }
                        if (n.data().labelV == "Organization_RE") {
                            return 'url(./assets/VLA/KeylineICONS/domain.svg)';
                        }
                        if (n.data().labelV == "address" || n.data().labelV == "home_location") {
                            return 'url(./assets/VLA/KeylineICONS/location-on.svg)';
                        }
                        if (n.data().labelV == "works_for" || n.data().labelV == "alumni_of") {
                            return 'url(./assets/VLA/KeylineICONS/domain.svg)';
                        }
                        if (n.data().labelV == "officership" || (n.data().labelV && n.data().labelV.toLowerCase() == "person")) {
                            return 'url(./assets/VLA/KeylineICONS/work.svg)';
                        }
                        if (n.data().labelV == "shareholder" && n.data().type == "Organization") {
                            return 'url(./assets/VLA/KeylineICONS/domain.svg)';
                        }
                        if (n.data().labelV == "shareholder" && (n.data().type && n.data().type.toLowerCase() == "person")) {
                            return 'url(./assets/VLA/KeylineICONS/user.svg)';
                        }
                        if (n.data().labelV == "Board of Managment") {
                            return 'url(./assets/VLA/KeylineICONS/user.svg)';
                        }
                        if (n.data().labelV.toLowerCase() == "document") {
                            return 'url(./assets/VLA/KeylineICONS/document.svg)';
                        }
                        if (n.data().labelV == "location") {
                            return 'url(./assets/VLA/KeylineICONS/location-on.svg)';
                        }
                        if (n.data().labelV == "audit_committee" || n.data().labelV == "board of Management" || n.data().labelV == "Cooperations_memberships_and_committee_work" || n.data().labelV == "board_of_directors" || n.data().labelV == "top_investers") {
                            return 'url(scripts/VLA/KeylineICONS/gang.svg)';
                        }
                        if (n.data().labelV == "Contact") {
                            return 'url(scripts/VLA/KeylineICONS/phone.png)';
                        }
                        if (n.data().labelV == "Article") {
                            return 'url(scripts/VLA/KeylineICONS/article.svg)';
                        }
                        if (n.data().labelV && n.data().labelV.toLowerCase() == "technology") {
                            return 'url(scripts/VLA/KeylineICONS/technology' + count + '.svg)';
                        }
                        if (n.data().labelV && n.data().labelV.toLowerCase() == "event") {
                            return 'url(scripts/VLA/KeylineICONS/comment' + count + '.svg)';
                        }
                        if (n.data().labelV && n.data().labelV.toLowerCase() == "club") {
                            return 'url(scripts/VLA/KeylineICONS/organization' + count + '.svg)';
                        }
                        return 'url(./assets/VLA/KeylineICONS/user.svg)'

                    } else {
                        if (n.data().risks == void 0) {
                            var w = n.data('weight') * 1;
                            var count = '';
                            if (n.data('riskScore')) {
                                var r = n.data('riskScore');
                                var risk = r * 1;
                                if (!w || isNaN(w))
                                    w = 1;
                                var risk_weight = risk * w;
                                var wf = (risk_weight < 3) ? 3 : (risk_weight > 6 ? 6 : Math.floor(risk_weight));
                                wf = parseInt(wf * 20);
                                count = "_" + wf;
                            } else {
                                count = "_80";
                            }
                            if (n.data()['labelV'] == "officership") {
                                return 'url(./assets/VLA/KeylineICONS/user' + count + '.svg))'
                            }
                            if (n.data()['labelV'] == "branches") {
                                return 'url(./assets/VLA/KeylineICONS/domain' + count + '.svg)';
                            }
                            if (n.data()['labelV'] == 'Location') {
                                return 'url(../scripts/VLA/KeylineICONS/map-marker' + count + '.svg)';
                            }
                            if (n.data().labelV == "Organization") {
                                return 'url(./assets/VLA/KeylineICONS/organization' + count + '.svg)';
                            }
                            if (n.data().labelV == "Company") {
                                return 'url(./assets/VLA/KeylineICONS/company' + count + '.svg)';
                            }
                            if (n.data().labelV == "shareholder" || n.data().labelV == "Board of Managment") {
                                return 'url(../scripts/VLA/KeylineICONS/user' + count + '.svg)';
                            }
                            if (n.data().labelV == "location") {
                                return 'url(../scripts/VLA/KeylineICONS/map_marker' + count + '.svg)';
                            }
                            if (n.data().labelV == "audit_committee" || n.data().labelV == "board of Management" || n.data().labelV == "Cooperations_memberships_and_committee_work" || n.data().labelV == "board_of_directors" || n.data().labelV == "top_investers") {
                                return 'url(../scripts/VLA/KeylineICONS/gang' + count + '.svg)';
                            }
                            if (n.data().labelV == "Contact") {
                                return 'url(../scripts/VLA/KeylineICONS/phone' + count + '.png)';
                            }
                            if (n.data().labelV == "Article") {
                                return 'url(../scripts/VLA/KeylineICONS/article' + count + '.svg)';
                            }
                            if (n.data().labelV == "Date") {
                                return 'url(../scripts/VLA/KeylineICONS/date' + count + '.svg)';
                            }
                            if (n.data().labelV == "Person") {
                                return 'url(../scripts/VLA/KeylineICONS/user' + count + '.svg)';
                            }
                            if (n.data().labelV == "Tweet") {
                                return 'url(../scripts/VLA/KeylineICONS/tweet' + count + '.svg)';
                            }
                            if (n.data().labelV == "Follower_Following_Count") {
                                return 'url(../scripts/VLA/KeylineICONS/follower_following_count' + count + '.svg)';
                            }
                            if (n.data().labelV == "Product") {
                                return 'url(../scripts/VLA/KeylineICONS/product' + count + '.svg)';
                            }
                            if (n.data().labelV == "Industry") {
                                return 'url(../scripts/VLA/KeylineICONS/industry' + count + '.svg)';
                            }
                            if (n.data().labelV == "FOUNDER") {
                                return 'url(../scripts/VLA/KeylineICONS/founder' + count + '.svg)';
                            }
                            if (n.data().labelV == "Follows") {
                                return 'url(../scripts/VLA/KeylineICONS/follows' + count + '.svg)';
                            }
                            if (n.data().labelV == "Follower") {
                                return 'url(../scripts/VLA/KeylineICONS/follower' + count + '.svg)';
                            }
                            if (n.data().labelV == "Skill") {
                                return 'url(../scripts/VLA/KeylineICONS/skill' + count + '.svg)';
                            }
                            if (n.data().labelV == "Sentence") {
                                return 'url(../scripts/VLA/KeylineICONS/sentence' + count + '.svg)';
                            }
                            if (n.data().labelV == "UserMention") {
                                return 'url(../scripts/VLA/KeylineICONS/usermention' + count + '.svg)';
                            }
                            if (n.data().labelV == "TRADE_NAME") {
                                return 'url(../scripts/VLA/KeylineICONS/trade' + count + '.svg)';
                            }
                            if (n.data().labelV.toLowerCase() == "shareholder") {
                                return 'url(../scripts/VLA/KeylineICONS/share-changes' + count + '.svg)';
                            }
                            if (n.data().labelV == "Cyber_info") {
                                return 'url(../scripts/VLA/KeylineICONS/cyber_info' + count + '.svg)';
                            }
                            if (n.data().labelV == "Metadata") {
                                return 'url(../scripts/VLA/KeylineICONS/metadata' + count + '.svg)';
                            }
                            if (n.data().labelV == "Service") {
                                return 'url(../scripts/VLA/KeylineICONS/service' + count + '.svg)';
                            }
                            if (n.data().labelV == "GPS") {
                                return 'url(../scripts/VLA/KeylineICONS/gps' + count + '.svg)';
                            }
                            if (n.data().labelV == "Open_Port") {
                                return 'url(../scripts/VLA/KeylineICONS/open_port' + count + '.svg)';
                            }
                            if (n.data().labelV == "website") {
                                return 'url(../scripts/VLA/KeylineICONS/internet-explorer' + count + '.svg)';
                            }
                            if (n.data().labelV == "company_number") {
                                return 'url(../scripts/VLA/KeylineICONS/user' + count + '.svg)';
                            }
                            if (n.data().labelV == "officer_id") {
                                return 'url(../scripts/VLA/KeylineICONS/tag' + count + '.svg)';
                            }
                            if (n.data().labelV == "Root_Company") {
                                return 'url(../scripts/VLA/KeylineICONS/root-company' + count + '.svg)';
                            }
                            if (n.data().labelV == "Root") {
                                return 'url(../scripts/VLA/KeylineICONS/root' + count + '.svg)';
                            }
                            if (n.data().labelV == "Transaction") {
                                return 'url(../scripts/VLA/KeylineICONS/transaction' + count + '.svg)';
                            }
                            if (n.data().labelV == "alert") {
                                return 'url(../scripts/VLA/KeylineICONS/alert' + count + '.svg)';
                            }
                            if (n.data().labelV == "customer") {
                                return 'url(../scripts/VLA/KeylineICONS/user' + count + '.svg)';
                            }
                            if (n.data().labelV == "account") {
                                return 'url(../scripts/VLA/KeylineICONS/account' + count + '.svg)';
                            }
                            if (n.data().labelV == "tx") {
                                return 'url(../scripts/VLA/KeylineICONS/transaction' + count + '.svg)';
                            }
                            if (n.data().labelV == "Accounts") {
                                return 'url(../scripts/VLA/KeylineICONS/account' + count + '.svg)';
                            }
                            if (n.data().labelV == "Follows") {
                                return 'url(../scripts/VLA/KeylineICONS/follows' + count + '.svg)';
                            }
                            if (n.data().labelV == "Address") {
                                return 'url(../scripts/VLA/KeylineICONS/address' + count + '.svg)';
                            }
                            if (n.data().labelV == "Investment") {
                                return 'url(../scripts/VLA/KeylineICONS/investment' + count + '.svg)';
                            }
                            if (n.data().labelV == "Returns") {
                                return 'url(../scripts/VLA/KeylineICONS/returns' + count + '.svg)';
                            }
                            if (n.data().labelV == "Stock") {
                                return 'url(../scripts/VLA/KeylineICONS/stock' + count + '.svg)';
                            }
                            if (n.data().labelV == "Stock_Change") {
                                return 'url(../scripts/VLA/KeylineICONS/stock_change' + count + '.svg)';
                            }
                            if (n.data().labelV == "Text") {
                                return 'url(../scripts/VLA/KeylineICONS/text' + count + '.svg)';
                            }
                            if (n.data().labelV == "Vulnerability") {
                                return 'url(../scripts/VLA/KeylineICONS/vulnerability' + count + '.svg)';
                            }
                            if (n.data().labelV == "Stock") {
                                return 'url(../scripts/VLA/KeylineICONS/stock' + count + '.svg)';
                            }
                            if (n.data().labelV == "Photo") {
                                return 'url(../scripts/VLA/KeylineICONS/photo' + count + '.svg)';
                            }
                            if (n.data().labelV == "Assets_chart") {
                                return 'url(../scripts/VLA/KeylineICONS/assets_chart' + count + '.svg)';
                            }
                            if (n.data().labelV == "Video") {
                                return 'url(../scripts/VLA/KeylineICONS/video' + count + '.svg)';
                            }
                            if (n.data().labelV == "Profile_Chart") {
                                return 'url(../scripts/VLA/KeylineICONS/profile_chart' + count + '.svg)';
                            }
                            if (n.data().labelV == "Cover") {
                                return 'url(../scripts/VLA/KeylineICONS/cover' + count + '.svg)';
                            }
                            if (n.data().labelV == "Revanue_Chart") {
                                return 'url(../scripts/VLA/KeylineICONS/revanue_chart' + count + '.svg)';
                            }
                            if (n.data().labelV == "Comment") {
                                return 'url(../scripts/VLA/KeylineICONS/comment' + count + '.svg)';
                            }
                            if (n.data().labelV == "Post") {
                                return 'url(../scripts/VLA/KeylineICONS/post' + count + '.svg)';
                            }
                            if (n.data().labelV == "Stock") {
                                return 'url(../scripts/VLA/KeylineICONS/stock' + count + '.svg)';
                            }
                            if (n.data().labelV == "Filling") {
                                return 'url(../scripts/VLA/KeylineICONS/filling' + count + '.svg)';
                            }
                            if (n.data().labelV == "Compensation") {
                                return 'url(../scripts/VLA/KeylineICONS/compensation' + count + '.svg)';
                            }
                            if (n.data().labelV == "board_member") {
                                return 'url(../scripts/VLA/KeylineICONS/board_member' + count + '.svg)';
                            }
                            if (n.data().labelV == "membership") {
                                return 'url(../scripts/VLA/KeylineICONS/membership' + count + '.svg)';
                            }
                            if (n.data().labelV == "Profit_Chart") {
                                return 'url(../scripts/VLA/KeylineICONS/profit_chart' + count + '.svg)';
                            }
                            if (n.data().labelV && n.data().labelV.toLowerCase() == "technology") {
                                return 'url(../scripts/VLA/KeylineICONS/technology' + count + '.svg)';
                            }
                            if (n.data().labelV && n.data().labelV.toLowerCase() == "event") {
                                return 'url(../scripts/VLA/KeylineICONS/comment' + count + '.svg)';
                            }
                            if (n.data().labelV && n.data().labelV.toLowerCase() == "club") {
                                return 'url(../scripts/VLA/KeylineICONS/organization' + count + '.svg)';
                            }
                            return 'url(./assets/VLA/KeylineICONS/default' + count + '.svg)';
                        }
                    }
                },
                'label': function(e) {
                    if (e.data() && e.data().name) {
                        return e.data().name //+((e.data() && e.data().totalPercentage && e.data().totalPercentage != '') ? "(" +e.data().totalPercentage + ")" :'' )
                    }
                },
                'text-wrap': 'wrap',
                'text-max-width': '200px',
                'color': function(e) {
                    var ele = document.getElementsByClassName("light-dark-theme")
                    if (ele.length > 0) {
                        return "black"
                    } else {
                        return "white"
                    }
                },
                'text-valign': 'bottom',
                'text-halign': 'center',
                'font-size': '10px'
            })
            .selector('edge')
            .css({
                'curve-style': 'unbundled-bezier',
                'width': 2,
                'label': function(e) {
                    if (e.data() && e.data().labelE && e.data().totalPercentage) {
                        return e.data().totalPercentage + " %"
                    } else if (e.data().source == "1") {
                        return e.data().labelE
                    }
                },
                'text-background-opacity': function(e) {
                    if (e.data() && e.data().labelE && e.data().totalPercentage) {
                        return '1'
                    }
                },
                'text-background-shape': 'round-rectangle',
                'text-background-color': function(e) {
                    var ele = document.getElementsByClassName("light-dark-theme")
                    if (ele.length > 0) {
                        return "#eaeaea"
                    } else {
                        return "#333"
                    }
                },
                'text-background-padding': '8px',
                // 'text-border-opacity':'0.5',
                'border-radius': '25px',
                'font-weight': function(e) {
                    if (e.data() && e.data().labelE && e.data().totalPercentage) {
                        return 'bold'
                    }
                },
                'color': function(e) {
                    var ele = document.getElementsByClassName("light-dark-theme")
                    if (ele.length > 0) {
                        return "black"
                    } else {
                        return "white"
                    }
                },
                'target-arrow-shape': 'triangle',
                'target-arrow-color': defaultColor,
                'line-color': function(e) {
                    return defaultColor;
                },
                // 'target-label':function(e){
                //     // if(e.data().labelE == 'shareholder' && e.data().properties &&  e.data().properties.totalPercentage){
                //         return "value";
                // //     // }
                // // },
                // 'target-text-background-padding': '20px',
                // // 'target-text-margin-y':'20px',
                // 'target-text-rotation-offset': 90

            }),

        elements: data,

        layout: layout != "cise" ? {
            name: layoutOption,
            nodeSpacing: 50,
            edgeLengthVal: 45,
            animate: true,
            randomize: false,
            maxSimulationTime: 1500
        } : {
            name: layoutOption,
            // clusters: clusterInfo,
            animate: false,
            refresh: 10,
            nodeSpacing: 50,
            edgeLengthVal: 40,
            randomize: false,
            maxSimulationTime: 1500,
            ready: function() {}, // on layoutready
            stop: function() {},
        }

    }); // cy init

    var tool_tip = $('body').append('<div class="entity_vlatooltip tooltip-left" style="position: absolute;z-index: 99999;opacity: 1; pointer-events: none; visibility: visible;display:none;text-transform:uppercase;background-color:#0cae96;  padding: 10px;border-radius: 5px; border: 1px solid gray;font-size: 10px;color:black;"><span style=" font-size: 12px; position: absolute; white-space: nowrap;  margin-left: 0px; margin-top: 0px; left: 8px; top: 8px;"><span style="font-size:10px" class="tool_tip_x_val"></span><table><tbody><tr><td style="padding:0"> </td><td style="padding:0"><b>216.4 mm</b></td></tr><tr><td style="color:#434348;padding:0">New York: </td><td style="padding:0"><b>91.2 mm</b></td></tr><tr><td style="color:#90ed7d;padding:0">London: </td><td style="padding:0"><b>52.4 mm</b></td></tr><tr><td style="color:#f7a35c;padding:0">Berlin: </td><td style="padding:0"><b>47.6 mm</b></td></tr></tbody></table></span></div>');

    //		 cy.elements().qtip({
    //				content: function () {
    //                    var node = this;
    //                    if (!node.isEdge())
    //                        return qtip_nodeData(this);
    //                    else
    //                    	return qtip_edgeData(this);
    //                },
    //				position: {
    //					my: 'bottom center',
    //                    at: 'top center',
    //				},
    //				style: {
    //					classes: 'qtip-bootstrap',
    //					tip: {
    //						width: 16,
    //						height: 8
    //					}
    //				},
    //                show: {
    //                    event: 'mouseover'
    //                },
    //                hide: {
    //                    event: 'mouseout'
    //                }
    //			});
    //		 cy.on("mouseout", function (d) {
    //			 $(".qtip").hide();
    //          });
    var sliderElement = document.getElementById('vlaZoom');

    function sliderBg() {
        var themeSelection = document.getElementsByClassName('light-dark-theme');
        var valPercent = (sliderElement.valueAsNumber - sliderElement.min) /
            (sliderElement.max - sliderElement.min);
        if (themeSelection.length > 0) {
            if (!isNaN(valPercent)) {
                var style = 'background-image: -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(' + valPercent + ', #ffcc33), color-stop(' + valPercent + ',rgba(255,204,51,0.2) ))';
            } else if (isNaN(valPercent)) {
                var style = 'background-image: -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(0, #ffcc33), color-stop(0,rgba(255,204,51,0.2) ))';
            }
            sliderElement.style = style;
        } else {
            if (!isNaN(valPercent)) {
                var style = 'background-image: -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(' + valPercent + ', #b0bec5), color-stop(' + valPercent + ',rgba(176,190,197,0.2) ))';
            } else if (isNaN(valPercent)) {
                var style = 'background-image: -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(0, #b0bec5), color-stop(0,rgba(176,190,197,0.2) ))';
            }
            sliderElement.style = style;
        }
    };
    sliderBg();

    // sliderElement.oninput = sliderBg();

    var slider = document.getElementById("vlaZoom");

    slider.oninput = function() {
        zoomVlaSlider()
    }
    document.getElementById("zoomOutVlaIcon").onclick = function() {
        zoomVlaSlider()
    }
    document.getElementById("zoomInVlaIcon").onclick = function() {
        zoomVlaSlider()
    }

    function zoomVlaSlider() {
        sliderBg()
            // getSliderColor();
        cy.zoom({
            level: 0.3 + slider.value / 100, // the zoom level
            position: { x: 200, y: 200 },
            //  renderedPosition: { x: 100, y: 100 }
        });
    }

    function fullJursidictionName(code) {
        let data = code

        jurisdictionListValue.forEach((element) => {
            if (element.jurisdictionName == code) {
                data = element.jurisdictionOriginalName
            }
        });
        return data
    }
    cy.on("mouseover", 'edge', function(d) {
            var edge = this;
            var text = data_info(edge, 'edge');
            $(".entity_vlatooltip").html(text);

            return $(".entity_vlatooltip").css("display", "block");
        })
        .on("mousemove", function(evt) {
            $(".entity_vlatooltip").css({ "left": evt.originalEvent.pageX + 20 });
            $(".entity_vlatooltip").css("top", evt.originalEvent.pageY - 20);
        })
        .on("mouseout", function() {
            //hide tool-tip
            return $(".entity_vlatooltip").css("display", "none");
        });

    cy.on("mouseover", 'node', function(d) {
            $(this).css("cursor", "pointer");
            var node = this;
            var text = data_info(node);
            $(".entity_vlatooltip").html(text);

            return $(".entity_vlatooltip").css("display", "block");
        })
        .on("mousemove", function(evt) {
            $(".entity_vlatooltip").css({ "left": evt.originalEvent.pageX + 20 });
            $(".entity_vlatooltip").css("top", evt.originalEvent.pageY - 20);
        })
        .on("mouseout", function() {
            // $(this).css("opacity", 0.4);
            //hide tool-tip
            return $(".entity_vlatooltip").css("display", "none");
        });

    cy.on("click", "node", function(d) {
        var node = this;
        // if(vlaDataType == "companyVla"){
        var sharholderData = node.data()
        var id = document.getElementById('multiSource')
        var data = JSON.stringify(sharholderData)
        var attrs = id.setAttribute("expandCompany", data);
        id.click()
            // }
            // var url = window.location.href.split("/#/")[0] + "/#/linkAnalysis?q=" + this.data('name');
            // window.open(url, "_blank");
    });

    function data_info(element, isedge) {
        var html = '<div class="row px-2">',
            name_html = '',
            address_html = '';
        var data = element.data();
        for (var key in data) {
            if (!data.hasOwnProperty(key))
                continue;
            if (key == 'risks')
                continue;
            if (data[key] != '' && data[key] != void 0) {
                if (isedge) {
                    var lable = key == "labelE" ? "Type" : key;
                    if (key != "spells" && key.indexOf("_") != 0 && key != 'to' && key != 'from' && key != 'id' && key != 'source' && key != 'target') {
                        if (typeof data[key] === "object") {
                            var tI = data[key];
                            var chanel = tI.channel != undefined ? tI.toString().split("_").join(" ") : 'N/A';
                            var base = tI.base_amount != undefined ? tI.base_amount : 'N/A';
                            var direction = tI.direction != undefined ? tI.direction : '';
                            html += "<div class='col-sm-12'><span class='vla-caption'>" + "channel" + ": </span><span class='vla-caption-body lh-18'>" + chanel + "</span></div>";
                            html += "<div class='col-sm-12'><span class='vla-caption'>" + " Amount" + ": </span><span class='vla-caption-body lh-18'>" + base + (direction) + "</span></div>";
                        } else {
                            html += "<div class='col-sm-12'><span class='vla-caption'>" + lable + " :</span><span class='vla-caption-body lh-18'> " + data[key].toString().split("_").join(" ") + "</span></div>";
                        }
                    }
                } else {
                    var lable = key == "labelV" ? "Type" : key;
                    if (key != "spells" && key.indexOf("_") != 0 && key != 'start' && key != 'createdBy' && key != 'id' && key != 'lat' && key != 'lon' && key != 'caseId') {
                        if (key != "labelV") {
                            lable = key.split("_").join(" ");
                        }
                        if (key == 'name') {
                            if (typeof vladata.nodes == 'undefined')
                                return;
                            for (var i = 0; i < vladata.nodes.length; i++) {
                                var type = vladata.nodes[i];
                                if (type.data.name == data['labelV'].toLowerCase() || type.name == data['labelV']) {
                                    if (type.data.labelV == 'Location') {
                                        if (type.data.name != '') {
                                            html += "<div class='col-sm-6'><div class='custoom-tooltip-wrapper'><span class='vla-caption' title='" + (lable.charAt(0).toUpperCase() + lable.slice(1)) + "'><i class='fa fa-home' aria-hidden='true'></i> " + (lable.charAt(0).toUpperCase() + lable.slice(1)) + " :</span><span class='vla-caption-body lh-18' title='" + data[key] + "'> " + data[key] + "</span></div></div>";
                                        }
                                    } else {
                                        var newLabel = '';
                                        if (data['labelV'].toLowerCase() === "customer" || data['labelV'].toLowerCase() === "person" || data['labelV'].toLowerCase() === "shareholder" || data['labelV'].toLowerCase() === "board of managment" || data['labelV'].toLowerCase() === "officership" || data['labelV'].toLowerCase() === "spouse" || data['labelV'].toLowerCase() === "children") {
                                            newLabel = "user";
                                        } else if (data['labelV'].toLowerCase() === "news") {
                                            newLabel = "user";
                                        } else if (data['labelV'].toLowerCase() == 'location') {
                                            newLabel = 'map-marker';
                                        } else if (data.labelV == "audit_committee" || data.labelV == "board of Management" || data.labelV == "Cooperations_memberships_and_committee_work" || data.labelV == "board_of_directors" || data.labelV == "top_investers") {
                                            newLabel = 'gang';
                                        } else if (data.labelV.toLowerCase() == "branches" || data.labelV == "works_for" || data.labelV == "alumni_of") {
                                            newLabel = 'domain';
                                        } else if (data.labelV.toLowerCase() == "contact") {
                                            newLabel = 'phone';
                                        } else if (data.labelV.toLowerCase() == "trade_name") {
                                            newLabel = 'trade';
                                        } else if (data.labelV == "website") {
                                            newLabel = 'internet-explorer';
                                        } else if (data.labelV == "company_number" || data.labelV == "officership") {
                                            newLabel = 'user';
                                        } else if (data.labelV == "officer_id") {
                                            newLabel = 'tag';
                                        } else if (data.labelV == "tx") {
                                            newLabel = 'transaction';
                                        } else if (data.labelV == "Accounts") {
                                            newLabel = 'account';
                                        } else if (data.labelV.toLowerCase() == "share_change") {
                                            return 'share-changes';
                                        } else if (data.labelV && data.labelV.toLowerCase() == "technology") {
                                            newLabel = "technology";
                                        } else if (data.labelV && data.labelV.toLowerCase() == "event") {
                                            newLabel = "comment";
                                        } else if (data.labelV && (data.labelV.toLowerCase() == "club" || data.labelV == 'Organization')) {
                                            newLabel = "organization";
                                        } else if (data.labelV.toLowerCase() == "officership" || (data.type && data.type.toLowerCase() == "person")) {
                                            newLabel = 'work';
                                        } else {
                                            newLabel = availableIcons.indexOf(data['labelV'].toLowerCase()) > -1 ? data['labelV'].toLowerCase() : 'default';
                                        }
                                        name_html = "<div class='row'><div class='col-sm-12'><div class='vla-caption-body lh-18 custom-heading' title='" + data[key].toString().split("_").join(" ") + "'><img src='./assets/VLA/KeylineICONS/" + newLabel + ".svg' alt='icon'>" + data[key].replace(/_/g, ' ') + "</div></div></div>";
                                    }
                                } else {
                                    var newLabel = '';
                                    if (data.labelV.toLowerCase() == "shareholder" && data.type.toLowerCase() == "organization") {
                                        newLabel = 'domain';
                                    } else if (data.labelV.toLowerCase() == "officership" || (data.type && data.type.toLowerCase() == "person")) {
                                        newLabel = 'work';
                                    } else if (data['labelV'].toLowerCase() === "customer" || data['labelV'].toLowerCase() === "person" || data['labelV'].toLowerCase() === "shareholder" || data['labelV'].toLowerCase() === "board of managment" || data['labelV'].toLowerCase() === "officership" || data['labelV'].toLowerCase() === "spouse" || data['labelV'].toLowerCase() === "children") {
                                        newLabel = "user";
                                    } else if (data['labelV'].toLowerCase() === "news") {
                                        newLabel = "user";
                                    } else if (data['labelV'].toLowerCase() == 'location') {
                                        newLabel = 'map-marker';
                                    } else if (data.labelV == "audit_committee" || data.labelV == "board of Management" || data.labelV == "Cooperations_memberships_and_committee_work" || data.labelV == "board_of_directors" || data.labelV == "top_investers") {
                                        newLabel = 'gang';
                                    } else if (data.labelV.toLowerCase() == "branches" || data.labelV == "works_for" || data.labelV == "alumni_of") {
                                        newLabel = 'domain';
                                    } else if (data.labelV.toLowerCase() == "contact") {
                                        newLabel = 'phone';
                                    } else if (data.labelV.toLowerCase() == "trade_name") {
                                        newLabel = 'trade';
                                    } else if (data.labelV == "website") {
                                        newLabel = 'internet-explorer';
                                    } else if (data.labelV == "similarCompany") {
                                        newLabel = 'domain'
                                    } else if (data.labelV == "company_number") {
                                        newLabel = 'user';
                                    } else if (data.labelV == "officer_id") {
                                        newLabel = 'tag';
                                    } else if (data.labelV == "tx") {
                                        newLabel = 'transaction';
                                    } else if (data.labelV == "Accounts") {
                                        newLabel = 'account';
                                    } else if (data.labelV.toLowerCase() == "share_change") {
                                        // return 'share-changes';
                                        newLabel = 'share-changes';
                                    } else if (data.labelV && data.labelV.toLowerCase() == "technology") {
                                        newLabel = "technology";
                                    } else if (data.labelV && data.labelV.toLowerCase() == "event") {
                                        newLabel = "comment";
                                    } else if (data.labelV && data.labelV.toLowerCase() == "club") {
                                        newLabel = "organization";
                                    } else if (data.labelV.toLowerCase() == "shareholder" && data.type.toLowerCase() == "organization") {
                                        newLabel = 'domain';
                                    } else if (data.labelV.toLowerCase() == "document") {
                                        newLabel = 'document';
                                    } else if (data.labelV.toLowerCase() == "branch") {
                                        newLabel = 'branches';
                                    } else {
                                        newLabel = availableIcons.indexOf(data['labelV'].toLowerCase()) > -1 ? data['labelV'].toLowerCase() : 'default';
                                    }

                                    name_html = "<div class='row px-3'><div class='col-sm-12 border-grey-thin-b light-theme-border-bottom mb-3'><div class='vla-caption-body lh-18 custom-heading text-dark-black' title='" + data[key].toString().split("_").join(" ") + "'><img class='mxw-30' src='./assets/VLA/KeylineICONS/" + newLabel + ".svg' alt='icon'>" + data[key].replace(/_/g, ' ') + "</div></div></div>";
                                }
                            }
                        } else {
                            if (key == 'labelV') {
                                if (data[key].toLowerCase() == 'children') {
                                    html += "<div class='col-sm-12 mb-3'><div class='custoom-tooltip-wrapper'><span class='vla-caption text-dark-black f-14' title='" + (lable.charAt(0).toUpperCase() + lable.slice(1)) + "'><i class='fa fa-user' aria-hidden='true'></i> " + (lable.charAt(0).toUpperCase() + lable.slice(1)) + " :</span><span class='vla-caption-body lh-18' title='" + data[key] + "'> " + data[key] + "</span></div></div>";
                                } else if (data[key].toLowerCase() == 'address' || data[key].toLowerCase() == 'person') {
                                    html += "<div class='col-sm-12 mb-3'><div class='custoom-tooltip-wrapper'><span class='vla-caption text-dark-black f-14' title='" + (lable.charAt(0).toUpperCase() + lable.slice(1)) + "'><i class='fa fa-map-marker' aria-hidden='true'></i> " + (lable.charAt(0).toUpperCase() + lable.slice(1)) + " :</span><span class='vla-caption-body lh-18' title='" + data[key] + "'> " + data[key] + "</span></div></div>";
                                } else if (data[key].toLowerCase() == 'works_for' || data[key].toLowerCase() == "alumni_of") {
                                    html += "<div class='col-sm-12 mb-3'><div class='custoom-tooltip-wrapper'><span class='vla-caption text-dark-black f-14' title='" + (lable.charAt(0).toUpperCase() + lable.slice(1)) + "'> <i style='top: 4px;' class='position-relative material-icons'>domain</i>" + (lable.charAt(0).toUpperCase() + lable.slice(1)) + " :</span><span class='vla-caption-body lh-18' title='" + data[key] + "'> " + data[key] + "</span></div></div>";
                                } else {
                                    html += "<div class='col-sm-12 mb-3'><div class='custoom-tooltip-wrapper'><span class='vla-caption text-dark-black f-14' title='" + (lable.charAt(0).toUpperCase() + lable.slice(1)) + "'><i class='fa fa-home' aria-hidden='true'></i> " + (lable.charAt(0).toUpperCase() + lable.slice(1)) + " :</span><span class='vla-caption-body lh-18' title='" + data[key] + "'> " + data[key] + "</span></div></div>";
                                }

                            }

                            if (key == 'role') {
                                html += "<div class='col-sm-12 mb-3'><div class='custoom-tooltip-wrapper'><span class='vla-caption text-dark-black f-14' title='" + (lable.charAt(0).toUpperCase() + lable.slice(1)) + "'><i class='fa fa-star-o' aria-hidden='true'></i> " + (lable.charAt(0).toUpperCase() + lable.slice(1)) + " :</span><span class='vla-caption-body lh-18' title='" + data[key] + "'> " + data[key] + "</span></div></div>";
                            }
                            if (key == 'Date_of_incorporation') {
                                html += "<div class='col-sm-12 mb-3'><div class='custoom-tooltip-wrapper'><span class='vla-caption text-dark-black f-14' title='" + (lable.charAt(0).toUpperCase() + lable.slice(1)) + "'><i class='fa fa-calendar' aria-hidden='true'></i> " + (lable.charAt(0).toUpperCase() + lable.slice(1)) + " :</span><span class='vla-caption-body lh-18' title='" + data[key] + "'> " + data[key] + "</span></div></div>";
                            }
                            if (key == 'address') {
                                address_html += "<div class='col-sm-12 mb-3'><div class='custoom-tooltip-wrapper'><span class='vla-caption text-dark-black f-14' title='" + (lable.charAt(0).toUpperCase() + lable.slice(1)) + "'><i class='fa fa-envelope' aria-hidden='true'></i> " + (lable.charAt(0).toUpperCase() + lable.slice(1)) + " :</span><span class='vla-caption-body lh-18' title='" + data[key] + "'> " + data[key] + "</span></div></div>";
                            }
                            if (key == 'startDate') {
                                html += "<div class='col-sm-12 mb-3'><div class='custoom-tooltip-wrapper'><span class='vla-caption text-dark-black f-14' title='" + (lable.charAt(0).toUpperCase() + lable.slice(1)) + "'><i class='fa fa-calendar' aria-hidden='true'></i> " + (lable.charAt(0).toUpperCase() + lable.slice(1)) + " :</span><span class='vla-caption-body lh-18' title='" + data[key] + "'> " + data[key] + "</span></div></div>";
                            }
                            if (key == 'expirationDate') {
                                html += "<div class='col-sm-12 mb-3'><div class='custoom-tooltip-wrapper'><span class='vla-caption text-dark-black f-14' title='" + (lable.charAt(0).toUpperCase() + lable.slice(1)) + "'><i class='fa fa-calendar' aria-hidden='true'></i> " + (lable.charAt(0).toUpperCase() + lable.slice(1)) + " :</span><span class='vla-caption-body lh-18' title='" + data[key] + "'> " + data[key] + "</span></div></div>";
                            }
                            if (key == 'price') {
                                html += "<div class='col-sm-12 mb-3'><div class='custoom-tooltip-wrapper'><span class='vla-caption text-dark-black f-14' title='" + (lable.charAt(0).toUpperCase() + lable.slice(1)) + "'><i  aria-hidden='true'></i> " + (lable.charAt(0).toUpperCase() + lable.slice(1)) + " :</span><span class='vla-caption-body lh-18' title='" + data[key] + "'> " + data[key] + "</span></div></div>";
                            }
                            if (key == 'source') {
                                html += "<div class='col-sm-12 mb-3'><div class='custoom-tooltip-wrapper'><span class='vla-caption text-dark-black f-14' title='" + (lable.charAt(0).toUpperCase() + lable.slice(1)) + "'><i class='fa fa-unlink' aria-hidden='true'></i> " + (lable.charAt(0).toUpperCase() + lable.slice(1)) + " :</span><span class='vla-caption-body lh-18 ml-2' title='" + data[key] + "'> " + data[key] + "</span></div></div>";
                            }
                            // if(key=='value'){
                            //     if(Array.isArray(data.value)){
                            //        for()
                            //     }else{
                            //     }
                            // }
                            if (key == 'properties') {
                                for (var k in data.properties) {
                                    if (k == 'address' ) {
                                        address_html += "<div class='col-sm-12 mb-3'><div class='custoom-tooltip-wrapper'><span class='vla-caption text-dark-black f-14' title='" + (k.charAt(0).toUpperCase() + k.slice(1)) + "'><i class='fa fa-envelope' aria-hidden='true'></i> " + (k.charAt(0).toUpperCase() + k.slice(1)) + " :</span><span class='vla-caption-body lh-18 ml-2' title='" + data.properties[k] + "'> " + Object.values(data.properties[k]) + "</span></div></div>";
                                    }
                                    if ( k == 'mdaas:RegisteredAddress') {
                                           address_html += "<div class='col-sm-12 mb-3'><div class='custoom-tooltip-wrapper'><span class='vla-caption text-dark-black f-14' title='" + (k.charAt(0).toUpperCase() + k.slice(1)) + "'><i class='fa fa-envelope' aria-hidden='true'></i> " + "RegisteredAddress" + " :</span><span class='vla-caption-body lh-18 ml-2' title='" + data.properties[k] + "'> " +data.properties[k]['fulladdress'] + "</span></div></div>";
                                     }
                                    if (k == 'status') {
                                        html += "<div class='col-sm-12 mb-3'><div class='custoom-tooltip-wrapper'><span class='vla-caption text-dark-black f-14' title='" + (k.charAt(0).toUpperCase() + k.slice(1)) + "'><i class='fa fa-info-circle' aria-hidden='true'></i> " + "Status" + " :</span><span class='vla-caption-body lh-18 ml-2' title='" + data.properties[k] + "'> " + data.properties[k] + "</span></div></div>";
                                    }
                                    if (k == 'appointed_on') {
                                        html += "<div class='col-sm-12 mb-3'><div class='custoom-tooltip-wrapper'><span class='vla-caption text-dark-black f-14' title='" + (k.charAt(0).toUpperCase() + k.slice(1)) + "'><i class='fa fa-calendar' aria-hidden='true'></i> " + "Appointed On" + " :</span><span class='vla-caption-body lh-18 ml-2' title='" + data.properties[k] + "'> " + data.properties[k] + "</span></div></div>";
                                    }
                                    if (k == 'occupation') {
                                        html += "<div class='col-sm-12 mb-3'><div class='custoom-tooltip-wrapper'><span class='vla-caption text-dark-black f-14' title='" + (k.charAt(0).toUpperCase() + k.slice(1)) + "'><i class='fa fa-industry' aria-hidden='true'></i> " + (k.charAt(0).toUpperCase() + k.slice(1)) + " :</span><span class='vla-caption-body lh-18 ml-2' title='" + data.properties[k] + "'> " + data.properties[k] + "</span></div></div>";
                                    }
                                    if (k == 'officer_role') {
                                        html += "<div class='col-sm-12 mb-3'><div class='custoom-tooltip-wrapper'><span class='vla-caption text-dark-black f-14' title='" + (k.charAt(0).toUpperCase() + k.slice(1)) + "'><i class='fa fa-user' aria-hidden='true'></i> " + " Role" + " :</span><span class='vla-caption-body lh-18 ml-2' title='" + data.properties[k] + "'> " + data.properties[k] + "</span></div></div>";
                                    }
                                    if (k == 'source') {
                                        html += "<div class='col-sm-12 mb-3'><div class='custoom-tooltip-wrapper'><span class='vla-caption text-dark-black f-14' title='" + (k.charAt(0).toUpperCase() + k.slice(1)) + "'><i class='fa fa-unlink' aria-hidden='true'></i> " + (k.charAt(0).toUpperCase() + k.slice(1)) + " :</span><span class='vla-caption-body lh-18 ml-2' title='" + data.properties[k] + "'> " + data.properties[k] + "</span></div></div>";
                                    }
                                    // if (k == 'information_source' && data.properties[k] != '') {
                                    //     html += "<div class='col-sm-12 mb-3'><div class='custoom-tooltip-wrapper'><span class='vla-caption text-dark-black f-14' title='" + (k.charAt(0).toUpperCase() + k.slice(1)) + "'><i class='fa fa-link' aria-hidden='true'></i> " + "Information Source" + " :</span><span class='vla-caption-body lh-18 ml-2' title='" + data.properties[k] + "'> " + data.properties[k] + "</span></div></div>";
                                    // }
                                    if (k == 'totalPercentage') {
                                        html += "<div class='col-sm-12 mb-3'><div class='custoom-tooltip-wrapper'><span class='vla-caption text-dark-black f-14' title='" + (k.charAt(0).toUpperCase() + k.slice(1)) + "'><i class='fa fa-percent' aria-hidden='true'></i> " + (k.charAt(0).toUpperCase() + k.slice(1)) + " :</span><span class='vla-caption-body lh-18 ml-2' title='" + data.properties[k] + "'> " + data.properties[k] + "</span></div></div>";
                                    }
                                    // if (k == 'vcard:organization-name') {
                                    //     html += "<div class='col-sm-12 mb-3'><div class='custoom-tooltip-wrapper'><span class='vla-caption text-dark-black f-14' title='" + (k.charAt(0).toUpperCase() + k.slice(1)) + "'><i class='fa fa-sitemap' aria-hidden='true'></i> " + (k.charAt(0).toUpperCase() + k.slice(1)) + " :</span><span class='vla-caption-body lh-18 ml-2' title='" + data.properties[k] + "'> " + data.properties[k] + "</span></div></div>";
                                    // }
                                    // if (k == 'hasURL') {
                                    //     html += "<div class='col-sm-12 mb-3'><div class='custoom-tooltip-wrapper'><span class='vla-caption text-dark-black f-14' title='" + (k.charAt(0).toUpperCase() + k.slice(1)) + "'><i class='fa fa-link' aria-hidden='true'></i> " + (k.charAt(0).toUpperCase() + k.slice(1)) + " :</span><span class='vla-caption-body lh-18 ml-2' title='" + data.properties[k] + "'> <a href='" + data.properties[k] + "' target='blank' >" + data.properties[k] + "</a></span></div></div>";
                                    // }
                                    if (k == 'names') {
                                        html += "<div class='col-sm-12 mb-3'><div class='custoom-tooltip-wrapper'><span class='vla-caption text-dark-black f-14' title='" + (k.charAt(0).toUpperCase() + k.slice(1)) + "'><i class='fa fa-list' aria-hidden='true'></i> " + (k.charAt(0).toUpperCase() + k.slice(1)) + " :</span><span class='vla-caption-body lh-18 ml-2' title='" + data.properties[k] + "'> " + data.properties[k] + "</span></div></div>";
                                    }
                                    if (k == 'isDomiciledIn') {
                                        html += "<div class='col-sm-12 mb-3'><div class='custoom-tooltip-wrapper'><span class='vla-caption text-dark-black f-14' title='" + (k.charAt(0).toUpperCase() + k.slice(1)) + "'><i class='fa fa-flag' aria-hidden='true'></i> " + "Domiciled In" + " :</span><span class='vla-caption-body lh-18 ml-2' title='" + data.properties[k] + "'> " + fullJursidictionName(data.properties[k]) + "</span></div></div>";
                                    }

                                    if (k == "basic") {
                                        if (data.properties[k] && data.properties[k]['mdaas:RegisteredAddress']) {
                                            address_html += "<div class='col-sm-12 mb-3'><div class='custoom-tooltip-wrapper'><span class='vla-caption text-dark-black f-14' title='" + "Address" + "'><i class='fa fa-envelope' aria-hidden='true'></i> " + "RegisteredAddress" + " :</span><span class='vla-caption-body lh-18 ml-2' title='" + data.properties[k] + "'> " + Object.values(_.omit(data.properties[k]['mdaas:RegisteredAddress'], ['fullAddress'])) + "</span></div></div>";
                                        }
                                        // if ( data.properties[k] && data.properties[k]['vcard:organization-name']) {
                                        //     html += "<div class='col-sm-12 mb-3'><div class='custoom-tooltip-wrapper'><span class='vla-caption text-dark-black f-14' title='" + (k.charAt(0).toUpperCase() + k.slice(1)) + "'><i class='fa fa-sitemap' aria-hidden='true'></i> " + "vcard:organization-name" + " :</span><span class='vla-caption-body lh-18 ml-2' title='" + data.properties[k] + "'> " + data.properties[k]['vcard:organization-name'] + "</span></div></div>";
                                        // }
                                        // if ( data.properties[k] && data.properties[k]['hasURL']) {
                                        //     html += "<div class='col-sm-12 mb-3'><div class='custoom-tooltip-wrapper'><span class='vla-caption text-dark-black f-14' title='" + (k.charAt(0).toUpperCase() + k.slice(1)) + "'><i class='fa fa-link' aria-hidden='true'></i> " + "hasURL" + " :</span><span class='vla-caption-body lh-18 ml-2' title='" + data.properties[k]['hasURL'] + "'> <a href='" + data.properties[k]['hasURL'] + "' target='blank' >" + data.properties[k]['hasURL'] + "</a></span></div></div>";
                                        // }
                                        if (data.properties[k] && data.properties[k]['totalPercentage']) {
                                            html += "<div class='col-sm-12 mb-3'><div class='custoom-tooltip-wrapper'><span class='vla-caption text-dark-black f-14' title='" + (k.charAt(0).toUpperCase() + k.slice(1)) + "'><i class='fa fa-percent' aria-hidden='true'></i> " + "totalPercentage" + " :</span><span class='vla-caption-body lh-18 ml-2' title='" +  data.properties[k]['totalPercentage']  + "'> " + data.properties[k]['totalPercentage'] + "</span></div></div>";
                                        }
                                        if (data.properties[k] && data.properties[k]['isDomiciledIn']) {
                                            html += "<div class='col-sm-12 mb-3'><div class='custoom-tooltip-wrapper'><span class='vla-caption text-dark-black f-14' title='" + (k.charAt(0).toUpperCase() + k.slice(1)) + "'><i class='fa fa-flag' aria-hidden='true'></i> " + "Domiciled In" + " :</span><span class='vla-caption-body lh-18 ml-2' title='" + data.properties[k]['isDomiciledIn'] + "'> " + fullJursidictionName(data.properties[k]['isDomiciledIn']) + "</span></div></div>";
                                        }
                                    }
                                    if (k == "relation") {
                                        // if (data.properties[k] && data.properties[k]['totalPercentage']) {
                                        //     html += "<div class='col-sm-12 mb-3'><div class='custoom-tooltip-wrapper'><span class='vla-caption text-dark-black f-14' title='" + (k.charAt(0).toUpperCase() + k.slice(1)) + "'><i class='fa fa-percent' aria-hidden='true'></i> " + "totalPercentage" + " :</span><span class='vla-caption-body lh-18 ml-2' title='" + data.properties[k]['totalPercentage']  + "'> " + data.properties[k]['totalPercentage'] + "</span></div></div>";
                                        // }
                                    }
                                }
                            }
                        }

                    }
                }
            }
        }
        html = name_html + html;
        var riskReverScale = d3.scaleLinear().domain([0, 100]).range([1, 10]);
        if (data.riskScore)
            html += "<div class='col-sm-6' ><div class='custoom-tooltip-wrapper'><span class='vla-caption' style='color:#e04033;font-size:12px;' title='Risks'><i style='color:#e04033;' class='fa fa-exclamation-triangle' aria-hidden='true'></i> Risks :</span><span class='vla-caption-body lh-18' style='color:#e04033;font-size:12px;' title='" + data.riskScore.toFixed(2).toString() + '%' + "'> " + data.riskScore.toFixed(2).toString() + '%' + "</span></div></div>";

        if (data.risks) {
            for (var key in data.risks) {
                if (!data.risks.hasOwnProperty(key))
                    continue;
                if (key == 'description')
                    continue;
                if (key == 'risks')
                    html += "<div class='col-sm-6' ><div class='custoom-tooltip-wrapper'><span class='vla-caption' style='color:#e04033;font-size:12px;' title='" + key + "'><i style='color:#e04033;' class='fa fa-exclamation-triangle' aria-hidden='true'></i> " + key + " :</span><span class='vla-caption-body lh-18' style='color:#e04033;font-size:12px;' title='" + (data.risks[key] * 100).toFixed(2).toString() + '%' + "'> " + (data.risks[key] * 100).toFixed(2).toString() + '%' + "</span></div></div>";
            }
        }
        html = html + address_html;
        html += '</div>';
        return html;
    }

}
var LoadEntityNetworkChartModule = new LoadEntityNetworkChart();
export {
    LoadEntityNetworkChartModule
};
