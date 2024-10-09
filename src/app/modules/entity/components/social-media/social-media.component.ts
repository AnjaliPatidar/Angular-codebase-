import { Component, OnInit } from '@angular/core';
import { EntityFunctionService } from '../../services/entity-functions.service';
import { EntityConstants } from '../../constants/entity-company-constant';
import * as d3 from "d3";
import * as loadtimeLineColumnChart from '../../../../shared/charts/timelineSimpleColumn';
import { SharedServicesService } from '../../../../shared-services/shared-services.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TimelinepopmodalComponent } from '../../modals/timelinepopmodal/timelinepopmodal.component';
import { EntityCommonTabService } from '../../services/entity-common-tab.service';
import { isObject } from 'lodash-es';
declare var $: any;

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.css']
})
export class SocialMediaComponent implements OnInit {

  constructor(
    private entityFunctionService: EntityFunctionService,
    public SharedServicesService: SharedServicesService,
    public modalservice: NgbModal,
    private entityCommonTabService: EntityCommonTabService,
  ) {

  }


  queryParams: any;
  public entitySearchResult: any = {
    list: EntityConstants.basicSharedObject.list,
    company: EntityConstants.basicSharedObject.companyName,
    is_data_not_found: EntityConstants.basicSharedObject.is_data_not_found,
    socketData: EntityConstants.socketData,
    tagCloudNameList: EntityConstants.entityChartSharedObject.tagCloudNameList,
    WebSocketTwitterUrl: EntityConstants.EntityCompanyConst.WebSocketTwitterUrl,
    tabsWorldMap: EntityConstants.tabsWorldMap,
    mentionCounts: Number,
    reTweetCounts: Number

  }

  public timelineOptions = {
    "container": "#activityFeedTimeline",
    "height": 50,
    "colors": ["#35942E", "#A15EBB", "#46a2de"],
    "colorsObj": {
      "twitter": "#a75dc2",
      "linkedin": "#5D97C9",
      "facebook": "#399034"
    },
    data: []
  };
  public activityFinalData: any = []
  ngOnInit() {

    this.queryParams = this.entityFunctionService.getParams();

    // this.twitterfetcherData();
    for (var i = 0; i < EntityConstants.lazyLoadingentity.socialMediaFetchers.length; i++) {
      var initialData = {
        keyword: EntityConstants.complianceObject['vcard:organization-name'] && EntityConstants.complianceObject['vcard:organization-name'].value ? EntityConstants.complianceObject['vcard:organization-name'].value : '',
        fetchers: [EntityConstants.lazyLoadingentity.socialMediaFetchers[i]],
        limit: 1,
        searchType: "Company"
      }
      this.getDataonPageLoad(initialData);
      // this.check(EntityConstants.lazyLoadingentity.socialMediaFetchers[i]);
    }

    this.entityCommonTabService.sourceTargetDetails.subscribe((data: any) => {
      if (data != null) {
        let company = data.results[0].overview.comapnyInfo['vcard:organization-name'];
        if (company) {
          this.entitySearchResult.company = company.value;
        }
      }
    })

    setTimeout(() => {
      this.loadtwitterchart();
    }, 1000);
  }
  /* purpose: get Data API on PageLOad
  /*created:27 nov 2019*/
  /*author: Ram*/
  getDataonPageLoad(initialData) {

    // disable ehubrest/api/search/getData api call - kamila (AP-1844)
    // this.entityApiService.getEntityDataByTextId(initialData).subscribe((response: any) => {

    //   if (response && response.results && response.results.length > 0) {

    //     this.populateFetcherwidget(response.results[0].fetcher, response.results[0].entities);
    //   }
    // }, (err) => {

    // });
  }
  populateFetcherwidget(fetcher, entities) {
    switch (fetcher) {
      case 'twitter.com':
        this.twitterfetcherData(entities);
        this.InteractionPieChart();
        break;
      case 'instagram.com':
        this.handleInstagram(entities);
        break;
      case 'plus.google.com':
        this.handlegooglePlus(entities);
        break;
      case 'pages.facebook.com':
        this.handleFacebookdata(entities);
        this.InteractionPieChart();
        break;
      case 'company.linkedin.com':
        break;
      case 'profiles.linkedin.com':
        this.handleLinkedin(entities);
        this.InteractionPieChart();
        break;
    }
  }
  twitterfetcherData(entities) {
    // if (subfetcherData.fetcher === 'twitter.com') {
    //  twitter.results[0].entities.forEach( (subentity, subentityKey)=>{
    entities.forEach((subentity, subentityKey) => {
      if (subentityKey === 0) {
        this.entitySearchResult.list.socialmediaLocations = subentity.edges.map((val) => {
          if (val.entity.properties && val.entity.properties.location)
            return { 'name': val.entity.properties.location }
        }).filter((val) => val)
        subentity.edges.forEach((edgeValue, edgeKey) => {
          if (edgeValue.relationshipName === 'tweets') {
            var objectData = {
              title: subentity.properties.title,
              createdOn: new Date(edgeValue.entity.properties.created_at),
              image: subentity.properties.image,
              text: edgeValue.entity.properties.text,
              retweetCount: edgeValue.entity.properties.retweet_count,
              tags: [],
              type: 'twitter'
            };
            edgeValue.entity.edges.forEach((subedv, subedk) => {
              if (subedv.relationshipName === 'user_mentions') {
                objectData.tags.push({
                  name: subedv.entity.properties.name,
                  screen_name: subedv.entity.properties.screen_name,
                  risk_score: subedv.entity.properties.risk_score
                });
              }
            });
            this.entitySearchResult.list.entityTwitterList.push(objectData);
            this.entitySearchResult['twitter_retweets_count'] = !this.entitySearchResult['twitter_retweets_count'] || this.entitySearchResult['twitter_retweets_count'] === "NAN" ? 0 : parseInt(this.entitySearchResult['twitter_retweets_count']);
            this.entitySearchResult['twitter_retweets_count'] += parseInt(edgeValue.entity.properties.retweet_count);
            this.entitySearchResult['twitter_retweets_count'] = this.nFormatter(parseInt(this.entitySearchResult['twitter_retweets_count']), 1)
          }
          if (edgeValue.relationshipName === 'followers') {
            if (edgeValue.entity.name !== '') {
              this.entitySearchResult.list[edgeValue.relationshipName].push({
                name: edgeValue.entity.name,
                createdOn: new Date(edgeValue.entity.properties.profile_created_at),
                image: edgeValue.entity.properties.profile_image_url,
                screen_name: edgeValue.entity.properties.screen_name,
                risk_score: edgeValue.entity.properties.risk_score,
                source: subentity.source
              });
            }
          }
          if (edgeValue.relationshipName === 'following') {
            if (edgeValue.entity.name !== '') {
              this.entitySearchResult.list[edgeValue.relationshipName].push({
                name: edgeValue.entity.name,
                createdOn: new Date(edgeValue.entity.properties.profile_created_at),
                image: edgeValue.entity.properties.profile_image_url,
                screen_name: edgeValue.entity.properties.screen_name,
                risk_score: edgeValue.entity.properties.risk_score,
                source: subentity.source
              });
            }
          }
          if (edgeValue.relationshipName === 'follower_following_count') {
            this.entitySearchResult.list['follower_following_count'].push({
              twitter_followers_number: edgeValue.entity.properties.followers,
              twitter_following_number: edgeValue.entity.properties.following
            });
          }
        });

      }
    });
    this.entitySearchResult['twitter_retweets_count'] = this.nFormatter(parseInt(this.entitySearchResult['twitter_retweets_count']), 1);
    if (this.entitySearchResult.list['follower_following_count'].length > 0) {
      this.entitySearchResult.list['followers_numberic'] = this.nFormatter(parseInt(this.entitySearchResult.list['follower_following_count'][0].twitter_followers_number), 1);
      this.entitySearchResult.list['twitter_following_numberic'] = this.nFormatter(parseInt(this.entitySearchResult.list['follower_following_count'][0].twitter_following_number), 1);
    }
    if (this.entitySearchResult.list['follower_following_count'].length === 0) {
      this.entitySearchResult.is_data_not_found.is_twitter_list = false;
    }
    this.entitySearchResult.is_data_not_found.is_recentTweets = this.entitySearchResult.list.entityTwitterList.length > 0 ? false : true;

  }
  handleInstagram(entities) {
    entities.forEach((subentity, subentityKey) => {
      subentity.edges.forEach((edgeValue, edgeKey) => {
        if (edgeValue.relationshipName === 'media') {
          this.entitySearchResult.list.entityInstagramList.push({
            caption: edgeValue.entity.properties.caption,
            thumbnail: edgeValue.entity.properties.thumbnail,
            image: subentity.properties.image,
            name: subentity.properties.name,
            followingCount: subentity.properties.following_count,
            followersCount: subentity.properties.followers_count,
            followersCountNumberic: 0,
            connectionNumberic: 0,
            type: 'instagram'
          });
        }
      });
    });
    if (this.entitySearchResult.list.entityInstagramList.length !== 0) {
      this.entitySearchResult.list.entityInstagramList[0]['followersCountNumberic'] = this.nFormatter(parseInt(this.entitySearchResult.list.entityInstagramList[0]['followersCount']), 1);
      this.entitySearchResult.list.entityInstagramList[0]['connectionNumberic'] = this.nFormatter(parseInt(this.entitySearchResult.list.entityInstagramList.length), 1);
    }
    if (this.entitySearchResult.list.entityInstagramList.length === 0) {
      this.entitySearchResult.is_data_not_found.is_instagramlist = false;
    }

  }
  handlegooglePlus(entities) {
    entities.forEach((subentity, subentityKey) => {
      if (subentityKey === 0) {
        subentity.edges.forEach((edgeValue, edgeKey) => {
          if (edgeValue.relationshipName === 'recent_public_activity') {
            this.entitySearchResult.list.entityGooglePlusList.push({
              name: subentity.properties.name,
              url: subentity.properties.url,
              title: edgeValue.entity.properties.title,
              coverPhoto: subentity.properties.cover_photo,
              lastUpdatedDate: new Date(edgeValue.entity.properties.last_updated_date),
              publishedDate: new Date(edgeValue.entity.properties.published_date),
              type: 'google'
            });
          }
        });
      }
    });
    if (this.entitySearchResult.list.entityGooglePlusList.length === 0) {
      this.entitySearchResult.is_data_not_found.is_googlepost = false;
    }
  }
  handleFacebookdata(entities) {
    var matchedName = '';
    entities.forEach((subentity, subentityKey) => {
      if ((matchedName === '' || (matchedName !== '' && matchedName === subentity.name))
        && subentity.name !== '' && subentity.name) {
        this.entitySearchResult.list['fan_counts'] = parseInt(subentity.properties.fan_count);
        this.entitySearchResult.list['fan_counts_numbric'] = this.nFormatter(parseInt(subentity.properties.fan_count), 1);
        matchedName === '' ? matchedName = subentity.name : '';
        subentity.edges.forEach((subedv, subedk) => {
          if (subedv.relationshipName === 'recent_posts') {
            subedv.entity.edges.forEach((subsubedv, subsubedk) => {
              if (subsubedv.relationshipName === 'data') {
                this.entitySearchResult.list.entityFacebookList.push({
                  text: subsubedv.entity.properties.message || subsubedv.entity.properties.story,
                  created_time: new Date(subsubedv.entity.properties.created_time),
                  website: subsubedv.entity.properties.website,
                  risk_score: subsubedv.entity.properties.risk_score
                });
              }
            });
          }
          if (subedv.relationshipName === 'milstones') {
            subedv.entity.edges.forEach((subsubedv, subsubedk) => {
              if (subsubedv.relationshipName === 'data' && subsubedv.entity.properties.is_hidden === 'false') {
                this.entitySearchResult.list.latestReleases.push({
                  title: subsubedv.entity.properties.title,
                  start_time: new Date(subsubedv.entity.properties.start_time),
                  created_time: new Date(subsubedv.entity.properties.created_time),
                  risk_score: subsubedv.entity.properties.risk_score,
                  source: subentity.source
                });
              }
            });
          }
        });
      }
    });
    if (this.entitySearchResult.list.entityFacebookList.length === 0) {
      this.entitySearchResult.is_data_not_found.is_facebook_list = false;
    }
  }
  handleLinkedin(entities) {
    entities.forEach((subentity, subentityKey) => {
      if (subentityKey === 0) {
        subentity.edges.forEach((edgeValue, edgeKey) => {
          if (edgeValue.relationshipName === 'social_feed') {
            this.entitySearchResult.list.entityLinkedinList.push({
              commentsCount: edgeValue.entity.properties.comments_count !== '' && edgeValue.entity.properties.comments_count ? edgeValue.entity.properties.comments_count : 0,
              likesCount: edgeValue.entity.properties.likes_count !== '' && edgeValue.entity.properties.likes_count ? edgeValue.entity.properties.likes_count : 0,
              postedOn: edgeValue.entity.properties.posted_at,
              text: edgeValue.entity.properties.text,
              image: subentity.properties.image,
              source: subentity.source
            });
          }
        });
      }
    });
    if (this.entitySearchResult.list.entityLinkedinList.length === 0) {
      this.entitySearchResult.is_data_not_found.is_linkedin_post = false;
    }
  }
  nFormatter(num, digits) {
    const si = [
      { value: 1, symbol: "" },
      { value: 1E3, symbol: "k" },
      { value: 1E6, symbol: "M" },
      { value: 1E9, symbol: "G" },
      { value: 1E12, symbol: "T" },
      { value: 1E15, symbol: "P" },
      { value: 1E18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let i;
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
        break;
      }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
  }
  ngAfterViewInit() {
    globalThis.popUpdata = (d) => {

      const timeline = this.modalservice.open(TimelinepopmodalComponent,
        {
          windowClass: 'custom-modal c-arrow  bst_modal add-ownership-modal add-new-officer add-popup'
        });
      timeline.componentInstance.data = d;
    }
  }
  InteractionPieChart() {

    this.SharedServicesService.updateRightPanelSocialMedia(this.entitySearchResult);
    // time line starts here
    var activityFinalData = [];
    if (this.entitySearchResult.list.entityTwitterList.length > 0) {
      this.entitySearchResult.list.entityTwitterList.forEach((d, i) => {
        activityFinalData.push({
          "time": d.createdOn,
          "amount": Math.floor(Math.random() * 20),
          "type": "twitter",
          'txt': '<table class="table data-custom-table"><tr><th>Title</td><td>' + d.title + '</td></tr><tr><th>createdOn</td><td>' + d.createdOn + '</td></tr><tr><th>RetweetCount</td><td>' + d.retweetCount + '</td></tr><tr><th>Type</td><td>' + d.type + '</td></tr></tr><tr><th>Text</td><td>' + d.text + '</td></tr></table>'
        })
      });
    }
    // if (this.entitySearchResult.list.length > 0) {
    // 	this.entitySearchResult.list..forEach( (d, i)=> {
    // 		if (getActualdate(d.postedOn)) {
    // 			activityFinalData.push({
    // 				"time": getActualdate(d.postedOn),
    // 				"amount": Math.floor(Math.random() * 20),
    // 				"type": "linkedin",
    // 				"txt": '<table class="table data-custom-table"><tr><th>PostedOn</td><td> ' + getActualdate(d.postedOn) + '</td></tr><tr><th>CommentsCount</td><td>' + d.commentsCount + '</td></tr><tr><th>LikesCount</td><td>' + d.likesCount + '</td></tr><tr><th>Type</td><td>' + "Linkedin" + '</td></tr></tr><tr><th>Text</td><td>' + d.text + '</td></tr></table>'
    // 			})
    // 		}
    // 	});
    // }
    if (this.entitySearchResult.list.entityFacebookList.length > 0) {
      // no count
      this.entitySearchResult.list.entityFacebookList.forEach((d, i) => {
        activityFinalData.push({
          "time": d.created_time,
          "amount": Math.floor(Math.random() * 20),
          "type": "facebook",
          "txt": '<table class="table data-custom-table"><tr><th>Created time</td><td>' + d.created_time + '</td></tr><tr><th>Risk score</td><td>' + d.risk_score + '</td></tr><tr><th>Type</td><td>Facebook</td></tr><tr><th>Text</td><td>' + d.text + '</td></tr></table>'
        })
      });
    }
    var timelineOptions = {
      container: "#activityFeedTimeline",
      height: 50,
      colors: ["#35942E", "#A15EBB", "#46a2de"],
      colorsObj: {
        "twitter": "#a75dc2",
        "linkedin": "#5D97C9",
        "facebook": "#399034"
      },
      data: activityFinalData
    };
    setTimeout(() => {
      loadtimeLineColumnChart(timelineOptions, d3);

    }, 10)
    // time line ends here
    // tag cloud starts here
  }
  // for live twitter feed
  // ---------------------------------------Networkchart-----------------------------------//
  liveFeed;
  // node: any;
  link: any;
  linksnew = [];
  nodesnew = [];
  simulation: any;
  WebSocketTwitterUrl;

  // links = [];
  tweetList = [];
  retweetList = [];
  mentionList = [];
  // locationList = [];
  finalLocationList: any;
  locationNames: any;
  randomGeneratedId = Math.floor((Math.random() * 10) + 19999);
  maxTwitterTagDomainRangeValue = 5;
  linkDataOrigin: any;
  tweetObjectOne: any;
  linkData: any;
  tweetObject: any;
  width: any;
  height: any;
  colornew: any;
  radius: any;
  socket;
  websocket;

  loadtwitterchart() {
    let links = [];
    let nodes = [];
    let node: any;
    this.entitySearchResult.tabsWorldMap.worldChartTwitterLocationsOptions.locationList = [];
    // const socket;
    this.WebSocketTwitterUrl = this.entitySearchResult.WebSocketTwitterUrl;

    this.liveFeed = {
      nodeList: []
    };

    let getSourceTargetData = (tweetData) => {
      this.linkDataOrigin = {
        source: null,
        target: null
      };
      if (this.tweetList.indexOf(tweetData.user.screen_name) === -1) {
        this.tweetObjectOne = {
          id: tweetData.id,
          name: tweetData.user.name,
          screen_name: tweetData.user.screen_name,
          text: tweetData.text,
          profile_image: tweetData.user.profile_image_url,
          createdOn: new Date(tweetData.user.created_at),
          likeCounts: tweetData.user.favourites_count || 0,
          retweetCounts: tweetData.user.retweet_count || 0,
          replyCounts: tweetData.user.reply_count || 0,
          type: 'tweet'
        };
        this.entitySearchResult.tagCloudNameList.splice(0, 0, {
          text: tweetData.user.name,
          size: tweetData.user.favourites_count || 5
        });
        if (this.entitySearchResult.tagCloudNameList.length === 21) {
          this.socket.close();
          this.entitySearchResult.tagCloudNameList.pop();
        }
        if (tweetData.user.location !== '' && tweetData.user.location) {
          this.entitySearchResult.tabsWorldMap.worldChartTwitterLocationsOptions.locationList.push({
            name: tweetData.user.location,
            long: '',
            lat: '',
            mark: 'assets/images/redpin.png'
          });
        }
        nodes.push(this.tweetObjectOne);
        setTimeout(() => {
          this.entitySearchResult.tweetCounts++;
          this.liveFeed.nodeList.push(this.tweetObjectOne);
        }, 0);
        this.tweetList.push(tweetData.user.screen_name);
        this.linkDataOrigin.source = this.randomGeneratedId;
        this.linkDataOrigin.target = tweetData.id;
        links.push(this.linkDataOrigin);
      }
      if (tweetData.entities['user_mentions'].length > 0) {
        tweetData.entities['user_mentions'].forEach((tweetdata) => {
          if (this.mentionList.indexOf(tweetdata.screen_name) === -1) {
            let mentionObject = {
              id: 'mention-' + tweetdata.id,
              name: tweetdata.name,
              screen_name: tweetdata.screen_name,
              type: 'mention'
            };
            setTimeout(() => {
              this.entitySearchResult.mentionCounts++;
            }, 0);
            nodes.push(mentionObject);
            this.mentionList.push(tweetdata.screen_name);
          }
          links.push({
            source: tweetData.id,
            target: 'mention-' + tweetdata.id
          });
        });
      }
      this.linkData = {
        source: null,
        target: null
      };
      this.linkData.source = tweetData.id;
      if (isObject(tweetData.retweeted_status)) {
        if (this.retweetList.indexOf(tweetData.retweeted_status.user.screen_name) === -1) {
          this.tweetObject = {
            id: tweetData.retweeted_status.id,
            name: tweetData.retweeted_status.user.name,
            screen_name: tweetData.retweeted_status.user.screen_name,
            text: tweetData.retweeted_status.text,
            profile_image: tweetData.retweeted_status.user.profile_image_url,
            createdOn: new Date(tweetData.retweeted_status.user.created_at),
            likeCounts: tweetData.retweeted_status.user.favourites_count || 0,
            retweetCounts: tweetData.retweeted_status.user.retweet_count || 0,
            replyCounts: tweetData.retweeted_status.user.reply_count || 0,
            type: 'retweet'
          };
          this.entitySearchResult.tagCloudNameList.splice(0, 0, {
            text: tweetData.retweeted_status.user.name,
            size: tweetData.retweeted_status.user.favourites_count || 5
          });
          if (this.entitySearchResult.tagCloudNameList.length === 21) {
            this.entitySearchResult.tagCloudNameList.pop();
          }
          if (tweetData.retweeted_status.user.location !== '' && tweetData.retweeted_status.user.location) {
            this.entitySearchResult.tabsWorldMap.worldChartTwitterLocationsOptions.locationList.push({
              name: tweetData.retweeted_status.user.location,
              long: '',
              lat: '',
              mark: 'assets/images/redpin.png'
            });
          }
          nodes.push(this.tweetObject);
          setTimeout(() => {
            this.entitySearchResult.reTweetCounts++;
            this.liveFeed.nodeList.push(this.tweetObject);
          }, 0);
          this.retweetList.push(tweetData.retweeted_status.user.screen_name);
        }
        this.linkData.target = tweetData.retweeted_status.id;
      }
      if (this.linkData.source && this.linkData.target)
        links.push(this.linkData);
      let twitterFinalData = { 'links': links, 'nodes': nodes };
      let twitterFinalDataNew = jQuery.extend(true, [], twitterFinalData);
      this.entitySearchResult.list['twitter_socket_network_chart'] = false;
      twitterPlotNetworkChart(twitterFinalDataNew);
    }


    let getWebSocketTwitterData = (name) => {
      let tweetObjectOneOrigin = {
        id: this.randomGeneratedId,
        name: name,
        screen_name: name,
        text: name,
        profile_image: '',
        createdOn: new Date(),
        type: 'main'
      };
      nodes.push(tweetObjectOneOrigin);
      this.socket = new WebSocket(this.WebSocketTwitterUrl);
      this.socket.onopen = (e) => {
        let data = { keyword: this.entitySearchResult.company }
        this.socket.send(JSON.stringify(data));
      };
      this.socket.onmessage = (event) => {
        // this.disableSearchButton = false;
        $('.custom-spinner').css('display', 'none');
        var isString = false;
        if (event.data.indexOf('{') === -1) {
          isString = true;
        } else {
          let response = JSON.parse(event.data);
          getSourceTargetData(response);
        }
        // this.socket.send("{\"keyword\":\"trump\"}");
      };

      this.socket.onclose = (event) => {
        if (event.wasClean) {
        } else {
          // e.g. server process killed or network down
          // event.code is usually 1006 in this case
        }
      };

      this.socket.onerror = (error) => {
      };
      // this.socket = io.connect(this.WebSocketTwitterUrl, { 'forceNew': true });
      // this.socket.on('message', function (response) {
      //   this.disableSearchButton = false;
      //   $('.custom-spinner').css('display', 'none');
      //   var isString = false;
      //   if (response.indexOf('{') === -1) {
      //     isString = true;
      //   } else {
      //     response = JSON.parse(response);
      //     getSourceTargetData(response);
      //   }
      // });
      // this.socket.on('connect', function () {
      //   this.socket.send(name);
      // });
      // this.socket.on('disconnect', function () {
      // });
      // getSourceTargetData(this.entitySearchResult.socketData);
    }

    /* Initiate twitter live feed socket ui call */
    getWebSocketTwitterData(this.entitySearchResult.company);
    // getWebSocketTwitterData(EntityConstants.EntityCommonTabService.basicsharedObject.companyName);



    let restart = () => {
      /* legend(this.nodesnew); */
      /* Apply the general update pattern to the nodes. */
      node = node.data(this.nodesnew, (d: any) => {
        return d.id;
      });
      node.exit().remove();
      node = node.enter().append("circle").attr("fill", (d: any) => {
        if (d.type == "main") {
          this.colornew = "#000080"/* blue */
        }
        else if (d.type == "tweet") {
          this.colornew = "#FFD700"/* yellow */
        }
        else if (d.type == "mention") {
          this.colornew = "#800000"
        }
        else if (d.type == "retweet") {
          this.colornew = "#008000"/* green */
        }
        return this.colornew;
      }).attr("r", (d: any) => {
        if (d.type == "main") {
          this.radius = "10"/* blue */
        }
        else {
          this.radius = "6"/* green */
        }
        return this.radius;
      }).on("mouseover", function (d: any) {
        let appendHTMLTooltip = '';
        if (d.type === 'tweet' || d.type === 'retweet')
          appendHTMLTooltip = '<div class="timeline-tooltip"><h3><img src="assets/images/briefcase.svg" class="img-responsive icon" />' + d.screen_name + '</h3><p><i class="fa fa-user-o icon"></i>' + d.name + '</p><p><i class="fa fa-retweet icon"></i>' + d.text + '</p><p class="progress-text"><i class="fa fa-wechat icon"></i><span>' + d.replyCounts + '</span><img  class="img-responsive icon" src="assets/images/icon/arrow-right-square.png" alt="icon" /><span>' + d.retweetCounts + '</span><i class="fa fa-heart icon"></i><span>' + d.likeCounts + '</span></p></div>';
        else
          appendHTMLTooltip = '<div class="timeline-tooltip"><h3><img src="assets/images/briefcase.svg" class="img-responsive icon" />' + d.screen_name + '</h3><p><i class="fa fa-user-o icon"></i>' + d.name + '</p></div>';
        $(".CaseTimeLine_Chart_tooltip").html(appendHTMLTooltip);
        return $(".CaseTimeLine_Chart_tooltip").css("display", "block");
      }).on("mousemove", function (event) {
        let value = $(this).offset();
        let top = value.top
        let left = value.left + 20
        $(".CaseTimeLine_Chart_tooltip").css("top", top + "px")
        return $(".CaseTimeLine_Chart_tooltip").css("left", left + "px");
      }).on("mouseout", function () {
        /* $(this).css("opacity", 0.4); */
        /* hide tool-tip */
        return $(".CaseTimeLine_Chart_tooltip").css("display", "none");
      }).merge(node);
      /* Apply the general update pattern to the links. */
      this.link = this.link.data(this.linksnew, (d: any) => {
        return d.source.id + "-" + d.target.id;
      });
      this.link.exit().remove();
      this.link = this.link.enter().append("line").merge(this.link);
      /* Update and restart the this.simulation. */
      this.simulation.nodes(this.nodesnew);
      this.simulation.force("link").links(this.linksnew);
      this.simulation.alpha(1).restart();
    }

    let ticked = () => {
      this.InteractionPieChart
      node.attr("cx", (d: any) => {
        return d.x;
      })
        .attr("cy", (d: any) => {
          return d.y;
        })
      this.link.attr("x1", (d: any) => {
        return d.source.x;
      })
        .attr("y1", (d: any) => {
          return d.source.y;
        })
        .attr("x2", (d: any) => {
          return d.target.x;
        })
        .attr("y2", (d: any) => {
          return d.target.y;
        }).attr("marker-end", "url(#end)");
    }


    // ----------------------------Twitter Network
    // Chart----------------------------------------
    var tool_tip = $('body').append('<div class="CaseTimeLine_Chart_tooltip" style="z-index:2000;position: absolute; opacity: 1; pointer-events: none; visibility: visible;display:none;"><span style=" font-size: 12px; position: absolute; white-space: nowrap;  margin-left: 0px; margin-top: 0px; left: 8px; top: 8px;"><span style="font-size:10px" class="tool_tip_x_val"></span><table><tbody><tr><td style="padding:0"> </td><td style="padding:0"><b>216.4 mm</b></td></tr><tr><td style="color:#434348;padding:0">New York: </td><td style="padding:0"><b>91.2 mm</b></td></tr><tr><td style="color:#90ed7d;padding:0">London: </td><td style="padding:0"><b>52.4 mm</b></td></tr><tr><td style="color:#f7a35c;padding:0">Berlin: </td><td style="padding:0"><b>47.6 mm</b></td></tr></tbody></table></span></div>');
    this.width = $("#twitter-socket-network-chart").width(),
      this.height = 300;
    var svg = d3.select("#twitter-socket-network-chart").append("svg")
      .attr("width", this.width)
      .attr("height", this.height),
      color = d3.scaleOrdinal(d3.schemeCategory10);
    /* build the arrow. */
    svg.append("svg:defs").selectAll("marker")
      .data(["end"])      /*
									 * Different link/path types can be defined
									 * here
									 */
      .enter().append("svg:marker")    /*
												 * This section adds in the
												 * arrows
												 */
      .attr("id", String)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", -1.5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5")
      .style("fill", "#666");
    var a = { id: "Sarah" },
      b = { id: "Alice" },
      c = { id: "Eveie" },
      d = { id: "Peter" };
    // nodesnew = [];
    // linksnew = [];
    this.simulation = d3.forceSimulation(this.nodesnew)
      .force("charge", d3.forceManyBody().strength(-300))
      .force("link", d3.forceLink(this.linksnew).distance(60))
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .alphaTarget(1)
      .on("tick", ticked);

    var g = svg.append("g").attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")")
    this.link = g.append("g").attr("stroke", "#000").attr("stroke-width", 1.5).selectAll(".link")
    node = g.append("g").attr("stroke", "#fff").attr("stroke-width", 1.5).selectAll(".node");
    let twitterPlotNetworkChart = (data) => {
      this.nodesnew = data.nodes;
      this.linksnew = [];
      data.links.forEach((d) => {
        this.linksnew.push({
          "source": this.nodesnew[this.nodesnew.findIndex((el) => { return el.id == d.source; })],
          "target": this.nodesnew[this.nodesnew.findIndex((el) => { return el.id == d.target })]
        });
      });
      restart();
    }
    // restart();
    // var colornew;
    // var radius;

    let legend = (nodesnew) => {
      $(".legend").empty()
      var type = [];
      nodesnew.forEach(function (d) {
        type.push(d.type)
      })
      var outputArray = [];
      for (var i = 0; i < type.length; i++) {
        if ((jQuery.inArray(type[i], outputArray)) == -1) {
          outputArray.push(type[i]);
        }
      }
      var legendcolor;
      outputArray.forEach(function (d) {
        if (d == "main") {
          d = "Search query"
          legendcolor = "#000080"
        } else if (d == "tweet") {
          legendcolor = "#FFD700"
        }
        else if (d == "mention") {
          legendcolor = "#800000"
        }
        else if (d == "retweet") {
          legendcolor = "#008000"
        }
        else {
          legendcolor = "#000"
        }
        $(".legend").append('<div style="display: inline-block;vertical-align: middle;"><span style="display: inline-block;vertical-align: middle;text-transform: capitalize;margin: 0 10px 0 0">' + d + '</span><span style="margin: 0 10px 0 0;vertical-align: middle;border-radius: 50%;display: inline-block;width: 15px;height: 15px;color: #435561;font-size: 12px;line-height: 20px;text-align: center;padding: 1px 4px;border: 2px solid #435561;background-color: ' + legendcolor + '"></span></div>')
      })
      return $(".legend").css("display", "none");
    }

  }

}
