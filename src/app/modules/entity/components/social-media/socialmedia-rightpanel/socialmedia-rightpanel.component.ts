import { Component, OnInit } from '@angular/core';
import { PieChartModule } from '../../../../../shared/charts/reusablePie';
import { SharedServicesService } from '../../../../../shared-services/shared-services.service';
import { EntityConstants } from '../../../constants/entity-company-constant';
import * as d3 from '../../../../../shared/charts/d3.v4.min';
import * as cloud from 'd3-cloud'
import { textTagmodule } from '../../../../../shared/charts/tagcloud.js';
import { EntityFunctionService } from '@app/modules/entity/services/entity-functions.service';
import {EntityGraphService} from '../../../services/entity-graph.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import  { snackRiskScoreModule } from '../../../../../shared/charts/sankRiskScore';

// declare var sankey_chart_risk_score:any;
@Component({
  selector: 'app-socialmedia-rightpanel',
  templateUrl: './socialmedia-rightpanel.component.html',
  styleUrls: ['./socialmedia-rightpanel.component.scss']
})
export class SocialmediaRightpanelComponent implements OnInit {
  public queryParams: any;
  public cumulativeRisk: any;
  public overviewRisks: any;
  public riskScoreData: any;
  public scaledNumArr: any = [];
  public riskScoreNoData = false;
  public aggregationType:any;
  constructor(public SharedServicesService: SharedServicesService,
    private modalService: NgbModal, private entityFunctionService: EntityFunctionService, public entityGraphService:EntityGraphService) {
    this.SharedServicesService.socialpanelObservable.subscribe((value) => {
      if (value) {
        this.plotRightsidePanel(value);
      }
    })
  }
  public entitySearchResult: any = {
    list: EntityConstants.basicSharedObject.list,
    is_data_not_found: EntityConstants.basicSharedObject.is_data_not_found,
    name:EntityConstants.complianceObject['vcard:organization-name'] && EntityConstants.complianceObject['vcard:organization-name'].value ? EntityConstants.complianceObject['vcard:organization-name'].value : '',
  }

  ngOnInit() {
    this.queryParams = this.entityFunctionService.getParams();
    this.getCaseByRiskDetails();
    // this.entitySearchResult.list.entityTwitterList =[
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-05-14T14:13:42.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "Join the #HOMETEAMHERO Challenge &amp; we’ll donate $1 for every one hour collectively logged to the #COVID19Fund for… https://t.co/KpKVPvz4i5",
    //     "retweetCount": "69",
    //     "tags": [],
    //     "type": "twitter",
    //     "$$hashKey": "object:1756"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-05-13T15:17:39.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "This week on The Huddle, @KAKA and @joaofelix70 discuss all things ⚽, their careers and life goals.​\n​\nWatch the fu… https://t.co/hPBgMwd8E4",
    //     "retweetCount": "7",
    //     "tags": [
    //       {
    //         "name": "Kaka",
    //         "screen_name": "KAKA",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "João Félix",
    //         "screen_name": "joaofelix70",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1757"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-05-12T15:57:45.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "@karliekloss @adidasWomen 4D flex from home 🔥",
    //     "retweetCount": "2",
    //     "tags": [
    //       {
    //         "name": "Karlie Kloss",
    //         "screen_name": "karliekloss",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "adidas Women (at 🏡)",
    //         "screen_name": "adidasWomen",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1758"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-05-12T05:57:53.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "@MR_CALL_DUTY @adidasalerts @adidasUS Welcome to the dark side 😉",
    //     "retweetCount": "0",
    //     "tags": [
    //       {
    //         "name": "EL LEON BORICUA ...PITO...🇵🇷🇺🇸",
    //         "screen_name": "MR_CALL_DUTY",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "adidas alerts",
    //         "screen_name": "adidasalerts",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "adidas (at 🏡)",
    //         "screen_name": "adidasUS",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1759"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-05-08T16:36:33.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "Collaborations inspire creativity at adidas. \n\nHear about them firsthand in our latest Creator U Class from Raffael… https://t.co/SIhdH4JZK3",
    //     "retweetCount": "9",
    //     "tags": [],
    //     "type": "twitter",
    //     "$$hashKey": "object:1760"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-05-06T20:31:30.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "👇👇👇 New episode alert.\n\n@paulpogba ⚽️ and @StellaMcCartney 🧥 bond through stories of their shared passions for fash… https://t.co/mBp4riwE4l",
    //     "retweetCount": "12",
    //     "tags": [
    //       {
    //         "name": "Paul Pogba",
    //         "screen_name": "paulpogba",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "Stella McCartney",
    //         "screen_name": "StellaMcCartney",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1761"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-05-06T10:56:10.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "RT @adidasrunning: \"Stay positive and focus less on what is going on and more on the things that make you genuinely happy.\"\n\n@YohanBlake op…",
    //     "retweetCount": "37",
    //     "tags": [
    //       {
    //         "name": "adidas Running (at 🏡)",
    //         "screen_name": "adidasrunning",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "Yohan Blake",
    //         "screen_name": "YohanBlake",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1762"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-05-06T05:22:19.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "@AliElzieny @lpbadano @rahatheart1 @Hragy @fitmslax @BethFratesMD Keep going, Ali! 💪 #hometeam",
    //     "retweetCount": "0",
    //     "tags": [
    //       {
    //         "name": "Ali Elzieny",
    //         "screen_name": "AliElzieny",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "Luigi",
    //         "screen_name": "lpbadano",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "Rahat Warraich PhD",
    //         "screen_name": "rahatheart1",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "Hany Ragy",
    //         "screen_name": "Hragy",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "Tony Manci M.S.",
    //         "screen_name": "fitmslax",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "Beth Frates, MD",
    //         "screen_name": "BethFratesMD",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1763"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-05-06T04:56:53.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "@SoleCollector84 @LA_TurtleBoost @Shawky_mcf You can find these on https://t.co/MxI62qossA 😉",
    //     "retweetCount": "0",
    //     "tags": [
    //       {
    //         "name": "StashBox SoleCollector",
    //         "screen_name": "SoleCollector84",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "T",
    //         "screen_name": "LA_TurtleBoost",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "لوس بلانكوس",
    //         "screen_name": "Shawky_mcf",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1764"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-05-05T22:43:00.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "Read more of their story here: https://t.co/PhyUyGa4ZQ https://t.co/0ARGZoQahw",
    //     "retweetCount": "14",
    //     "tags": [],
    //     "type": "twitter",
    //     "$$hashKey": "object:1765"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-05-05T22:27:40.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "As many of us were sidelined by COVID-19, we saw the real heroes jump to action – our essential healthcare workers… https://t.co/4hh2roHEfa",
    //     "retweetCount": "89",
    //     "tags": [],
    //     "type": "twitter",
    //     "$$hashKey": "object:1766"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-05-05T18:06:19.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "@JackieDG2 Hi Jackie, so sorry to hear this! Please send us a DM so we can look into this for you.",
    //     "retweetCount": "0",
    //     "tags": [
    //       {
    //         "name": "Jackie D.",
    //         "screen_name": "JackieDG2",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1767"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-05-04T15:12:47.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "Music influences sport and sport influences music. \n ​\n@Anitta 🎶 and @PauDybala_JR ⚽️ come together from across the… https://t.co/73ED4tt45h",
    //     "retweetCount": "31",
    //     "tags": [
    //       {
    //         "name": "Anitta",
    //         "screen_name": "Anitta",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "Paulo Dybala",
    //         "screen_name": "PauDybala_JR",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1768"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-30T01:33:58.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "@Ken_AYE_ @adidasrunning Glad to have you on the #hometeam, Keni.  💪",
    //     "retweetCount": "0",
    //     "tags": [
    //       {
    //         "name": "Keni Harrison",
    //         "screen_name": "Ken_AYE_",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "adidas Running (at 🏡)",
    //         "screen_name": "adidasrunning",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1769"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-28T23:16:20.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "@virtual_joanne Hey Joanne, we apologize for the inconvenience. We’ll get this sorted for you. Please check your DMs, thanks.",
    //     "retweetCount": "0",
    //     "tags": [
    //       {
    //         "name": "Joanne W",
    //         "screen_name": "virtual_joanne",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1770"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-28T19:01:06.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "@MayankShharma Ready for the screamers again. 🚀",
    //     "retweetCount": "2",
    //     "tags": [
    //       {
    //         "name": "Mayank Sharma",
    //         "screen_name": "MayankShharma",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1771"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-28T14:00:59.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "While the world waits… let’s remember, now is the time to keep moving, to pull together, to share skills, positivit… https://t.co/jvaTb0L7vR",
    //     "retweetCount": "265",
    //     "tags": [],
    //     "type": "twitter",
    //     "$$hashKey": "object:1772"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-28T00:00:02.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "It’s that time, Minneapolis. 👏👏👏⁣\n⁣\nTo the healthcare heroes saving lives at Hennepin County Medical Center and bey… https://t.co/hpj1wtDXjo",
    //     "retweetCount": "19",
    //     "tags": [],
    //     "type": "twitter",
    //     "$$hashKey": "object:1773"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-26T23:00:04.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "It's that time, New York City.\n👏👏👏⁣\n⁣\nHere’s to the healthcare heroes that are helping us get through this. Below a… https://t.co/FW0Bm1Wx8m",
    //     "retweetCount": "45",
    //     "tags": [],
    //     "type": "twitter",
    //     "$$hashKey": "object:1774"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-24T21:57:05.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "@nikkisembrano @adidasUS @Carbon Can you send us a DM Nikki?",
    //     "retweetCount": "0",
    //     "tags": [
    //       {
    //         "name": "nikki sembrano",
    //         "screen_name": "nikkisembrano",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "adidas (at 🏡)",
    //         "screen_name": "adidasUS",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "Carbon",
    //         "screen_name": "Carbon",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1775"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-24T14:08:48.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "It's Friday, which means there's a new Creator U Class.\n​\nThis week's class is led by adidas Running Creative Direc… https://t.co/A0lhjkI919",
    //     "retweetCount": "9",
    //     "tags": [],
    //     "type": "twitter",
    //     "$$hashKey": "object:1776"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-24T09:23:41.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "@nikkisembrano @adidasUS @Carbon Thank you and your team for fighting to keep us safe. 🙏💙",
    //     "retweetCount": "1",
    //     "tags": [
    //       {
    //         "name": "nikki sembrano",
    //         "screen_name": "nikkisembrano",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "adidas (at 🏡)",
    //         "screen_name": "adidasUS",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "Carbon",
    //         "screen_name": "Carbon",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1777"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-24T03:00:02.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "It's that time, Los Angeles. 👏👏👏⁣\n⁣\nWe're honored to be able to partner with @Carbon to help our healthcare heroes… https://t.co/kgS3xkuXeh",
    //     "retweetCount": "51",
    //     "tags": [
    //       {
    //         "name": "Carbon",
    //         "screen_name": "Carbon",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1778"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-23T06:26:18.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "@joannapanties @Carbon Thank you for your hard work and courage during this time. 🙌 🙌",
    //     "retweetCount": "1",
    //     "tags": [
    //       {
    //         "name": "jøanna.",
    //         "screen_name": "joannapanties",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "Carbon",
    //         "screen_name": "Carbon",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1779"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-20T20:47:54.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "@JulieKerno Nice choice, Julie. One step at a time.",
    //     "retweetCount": "0",
    //     "tags": [
    //       {
    //         "name": "Julie Kerno",
    //         "screen_name": "JulieKerno",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1780"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-20T18:50:07.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "@hertzchell @Carbon Thank you for your work to help us through this time.\n\nYou can submit a request at… https://t.co/wLDWIxQaZe",
    //     "retweetCount": "0",
    //     "tags": [
    //       {
    //         "name": "Hertzchell Nanasca",
    //         "screen_name": "hertzchell",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "Carbon",
    //         "screen_name": "Carbon",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1781"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-20T18:49:52.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "@RGkix @Carbon Hi there, you can submit a request at https://t.co/5v2OqwwZbz or by email to covid19@carbon3d.com.… https://t.co/B07ix1GzNd",
    //     "retweetCount": "0",
    //     "tags": [
    //       {
    //         "name": "RG",
    //         "screen_name": "RGkix",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "Carbon",
    //         "screen_name": "Carbon",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1782"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-20T18:49:35.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "@nxbrooklyn @Carbon Thank you for your work during this time.\n\nYou can submit a request at https://t.co/5v2OqwwZbz… https://t.co/R5QA8Zc8Wk",
    //     "retweetCount": "0",
    //     "tags": [
    //       {
    //         "name": "nicole",
    //         "screen_name": "nxbrooklyn",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "Carbon",
    //         "screen_name": "Carbon",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1783"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-20T18:46:02.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "@SteelCityAmn7 @Carbon Thank you for all of the work you're doing to get us through this.\n\nWe'll send you a DM with more information.",
    //     "retweetCount": "0",
    //     "tags": [
    //       {
    //         "name": "𝕭",
    //         "screen_name": "SteelCityAmn7",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "Carbon",
    //         "screen_name": "Carbon",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1784"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-20T15:05:31.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "Next up, we have an exclusive episode of The Huddle where @TeamJuJu officially welcomes @Tuaamann to #teamadidas.… https://t.co/9NSBdBjvDp",
    //     "retweetCount": "10",
    //     "tags": [
    //       {
    //         "name": "JuJu Smith-Schuster",
    //         "screen_name": "TeamJuJu",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "Tua. T 🇦🇸",
    //         "screen_name": "Tuaamann",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1785"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-20T14:48:31.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "RT @adidasrunning: The #BostonMarathon course may be empty today, but our spirit has never been stronger. Here’s to 9.14.20. #HOMETEAM http…",
    //     "retweetCount": "135",
    //     "tags": [
    //       {
    //         "name": "adidas Running (at 🏡)",
    //         "screen_name": "adidasrunning",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1786"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-19T23:25:13.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "@jessica_gju @Carbon Thank you Jessica and to all of the heroes at Akron City Hospital.",
    //     "retweetCount": "2",
    //     "tags": [
    //       {
    //         "name": "Jessica",
    //         "screen_name": "jessica_gju",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "Carbon",
    //         "screen_name": "Carbon",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1787"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-19T23:12:37.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "@MakeItVeganNic @Carbon @OHSUNews @choo_ek Way to look out for others, Nic.\n\n@choo_ek, we aren’t able to message yo… https://t.co/hlKPhbYib8",
    //     "retweetCount": "0",
    //     "tags": [
    //       {
    //         "name": "Nic",
    //         "screen_name": "MakeItVeganNic",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "Carbon",
    //         "screen_name": "Carbon",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "OHSU News",
    //         "screen_name": "OHSUNews",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "Dr. Esther AT LEAST WEAR A MASK Choo",
    //         "screen_name": "choo_ek",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "Dr. Esther AT LEAST WEAR A MASK Choo",
    //         "screen_name": "choo_ek",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1788"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-19T23:06:55.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "@ImmortalStoN3 @Carbon Thanks for reaching out. We’ll send you a DM.\n\nAnd thank you for all of your work during this time. 👏👏👏",
    //     "retweetCount": "0",
    //     "tags": [
    //       {
    //         "name": "Immortal Stone",
    //         "screen_name": "ImmortalStoN3",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "Carbon",
    //         "screen_name": "Carbon",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1789"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-19T23:06:31.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "@MakeItVeganNic @Carbon @OHSUNews We’ll send you a DM, Nic.\n\nThank you for all of your work during this time. 👏👏👏",
    //     "retweetCount": "0",
    //     "tags": [
    //       {
    //         "name": "Nic",
    //         "screen_name": "MakeItVeganNic",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "Carbon",
    //         "screen_name": "Carbon",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "OHSU News",
    //         "screen_name": "OHSUNews",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1790"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-19T23:00:39.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "Check out the face shields we made in partnership with @Carbon and sent out below. \n\nWe’re honored to help our heal… https://t.co/uhuzdOpFAB",
    //     "retweetCount": "173",
    //     "tags": [
    //       {
    //         "name": "Carbon",
    //         "screen_name": "Carbon",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1791"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-17T14:04:29.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "First up, we have GM of YEEZY, Jon Wexler (@wex1200) sharing his take on collaborations, inspiration and his career… https://t.co/Y2OhJgeppz",
    //     "retweetCount": "50",
    //     "tags": [
    //       {
    //         "name": "jon wexler",
    //         "screen_name": "wex1200",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1792"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-17T14:04:29.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "Looking for inside access to the creative minds from across the adidas collective? ​\n​\nWelcome to Creator U, a new… https://t.co/Qu3v6L9HRk",
    //     "retweetCount": "23",
    //     "tags": [],
    //     "type": "twitter",
    //     "$$hashKey": "object:1793"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-16T14:01:54.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "Today. Tomorrow. Together. ​⁣⁣⁣\n\nHere's to the #hometeam⁣ \n💪⚽🧗‍♀🤳🏋🏻🧘‍♀️🏡 https://t.co/IdUeBghZGi",
    //     "retweetCount": "79",
    //     "tags": [],
    //     "type": "twitter",
    //     "$$hashKey": "object:1794"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-16T01:25:41.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "This week we have Tracy McGrady and Jaylen Brown (@FCHWPO), who discuss their passion for basketball, keeping each… https://t.co/Fa2yQUy8jM",
    //     "retweetCount": "9",
    //     "tags": [
    //       {
    //         "name": "Jaylen Brown",
    //         "screen_name": "FCHWPO",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1795"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-16T01:25:40.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "Unscripted and unfiltered. ​\n\nThis is The Huddle, a series that brings faces in sport and culture together through conversation every week.",
    //     "retweetCount": "20",
    //     "tags": [],
    //     "type": "twitter",
    //     "$$hashKey": "object:1796"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-14T16:59:12.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "@Kieracgrogan We got you. Head to https://t.co/wzg20tZCvE and contact us to see if there's anything we can do to adjust your order in time.",
    //     "retweetCount": "0",
    //     "tags": [
    //       {
    //         "name": "Kiera Grogan",
    //         "screen_name": "Kieracgrogan",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1797"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-14T15:24:26.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "@joannapanties send us a DM please",
    //     "retweetCount": "0",
    //     "tags": [
    //       {
    //         "name": "jøanna.",
    //         "screen_name": "joannapanties",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1798"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-13T14:48:39.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "@darkgreenhat Way to go. 💪",
    //     "retweetCount": "0",
    //     "tags": [
    //       {
    //         "name": "Subash Thyagarajan",
    //         "screen_name": "darkgreenhat",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1799"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-11T15:47:40.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "RT @adidasoriginals: Sunsets with the @Do_Over. Tune in to our Instagram Live later today from 9pm BST / 4pm EST / 1pm PST. #Hometeam https…",
    //     "retweetCount": "34",
    //     "tags": [
    //       {
    //         "name": "adidas Originals (at 🏡)",
    //         "screen_name": "adidasoriginals",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "The Do-Over",
    //         "screen_name": "Do_Over",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1800"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-09T21:42:32.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "@SimplyTwiggy Way to go. How are you feeling?",
    //     "retweetCount": "0",
    //     "tags": [
    //       {
    //         "name": "Twiggy Pucci Garçon",
    //         "screen_name": "SimplyTwiggy",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1801"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-08T21:25:35.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "RT @adidasHoops: Unscripted and unfiltered.\n\nJoin @dame_lillard and @thejudge44 in ‘The Huddle’, tonight at 7pm ET, 4pm PT on @adidas Insta…",
    //     "retweetCount": "36",
    //     "tags": [
    //       {
    //         "name": "adidas Basketball (at 🏡)",
    //         "screen_name": "adidasHoops",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "Damian Lillard",
    //         "screen_name": "Dame_Lillard",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "Aaron Judge",
    //         "screen_name": "TheJudge44",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "adidas (at 🏡)",
    //         "screen_name": "adidas",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1802"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-08T18:36:06.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "@jessica_gju @Carbon Thank you for your work and help during this time, Jessica!\n\nSubmit a request at… https://t.co/MzQ3fU130q",
    //     "retweetCount": "1",
    //     "tags": [
    //       {
    //         "name": "Jessica",
    //         "screen_name": "jessica_gju",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "Carbon",
    //         "screen_name": "Carbon",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1803"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-08T18:33:47.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "@x_auth_req @Carbon Thank you for your work and help through this time. 🙌\n\nSubmit a request at… https://t.co/jXSZooel2j",
    //     "retweetCount": "1",
    //     "tags": [
    //       {
    //         "name": "isAuthenticated",
    //         "screen_name": "x_auth_req",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "Carbon",
    //         "screen_name": "Carbon",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1804"
    //   },
    //   {
    //     "title": "adidas (at 🏡)",
    //     "createdOn": "2020-04-08T18:32:35.000Z",
    //     "image": "http://pbs.twimg.com/profile_images/1198790230213574656/bY9wyrTr.jpg",
    //     "text": "@drtarzain @enginerdmd @Carbon Submit a request at https://t.co/zwHgtiWsax or by email to covid19@carbon3d.com. \n\nC… https://t.co/lF9OhrtADY",
    //     "retweetCount": "0",
    //     "tags": [
    //       {
    //         "name": "Dr Hasan DO",
    //         "screen_name": "drtarzain",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "Kemo Sahbee MD",
    //         "screen_name": "enginerdmd",
    //         "risk_score": "0"
    //       },
    //       {
    //         "name": "Carbon",
    //         "screen_name": "Carbon",
    //         "risk_score": "0"
    //       }
    //     ],
    //     "type": "twitter",
    //     "$$hashKey": "object:1805"
    //   }
    // ]

  }

  openRiskScoreModal(content){
    setTimeout(() => {
      this.modalService.open(content, { size: 'lg', centered: true,  windowClass: 'bst_modal' });
    },1000)
    this.plotChart();
  }

  plotChart(){
    this.aggregationType = this.riskScoreData['operator-used'];

    var caseNameValue = this.entitySearchResult.name;
    // var caseNameValue = 'Adidas Ag';
    if(Math.abs(this.riskScoreData['overall-score'])>1){
      this.riskScoreData['overall-score'] = Math.abs(this.riskScoreData['overall-score'])/100;
    }
    //  $scope.cumulativeRisk =this.riskScoreData['overall-score']*100;
    // $scope.isloading = true;
    if(!this.riskScoreData && !this.riskScoreData.attributeRiskScores && this.riskScoreData.attributeRiskScores.length>0){/*jshint ignore:line*/
      this.riskScoreNoData = true;
      // $scope.isloading = false;
      return;
      }
    // $scope.isloading = false;
    var finalData ={"nodes":[],"links":[]};
    var nodesId=0;
    finalData.nodes.push({
      "name":caseNameValue?caseNameValue.split("_").join(" "):"",
      "id":nodesId
    });
    nodesId++;
    finalData.nodes.push({
      "name":"",
      "id":nodesId
    });
    nodesId++;

    if(this.riskScoreData && this.riskScoreData.attributeRiskScores && this.riskScoreData.attributeRiskScores.length>0){
      this.riskScoreData.attributeRiskScores.forEach((v) => {
        if(v.riskFactor.score){
          finalData.nodes.push({
            "name":v.attributeName?v.attributeName.split("_").join(" "):"",
            "id":nodesId
          });
          if(Math.abs(v.riskFactor.score)>1){
            v.riskFactor.score = Math.abs(v.riskFactor.score)/100;
          }
          finalData.links.push({
            "source":0,
            "target":nodesId,
            "value":v.riskFactor.score,
            "label": "",
            "txt":"<div style='word-wrap:break-word;color':'#FFFFFF'>"+v.attributeName+" : "+(v.riskFactor.score*100).toFixed(2)+"%</div>"

          });
          finalData.links.push({
            "source":nodesId,
            "target":1,
            "value":v.riskFactor.score,
            "label": "",
            "txt":"<div style='word-wrap:break-word;color':'#FFFFFF'>"+v.attributeName+" : "+(v.riskFactor.score*100).toFixed(2)+"%</div>"

          });
          nodesId++;
        }
      });

      if(finalData.links.length == 0){
        this.riskScoreNoData = true;
      }
  }

    if(!this.riskScoreNoData){
     setTimeout(() => {
       var options:any = {
              entityName:caseNameValue,
                container: "#chartContentDiv",
                height: 300,
                width:700,
                rectWidth:5,
                rectColor:"#4294D9",
                isfromOtherModules:true,
                isReport:true,
                // path_labels :['FFB','CPO','CPO','PK','CPKO']
            } ;
        var nodesList ={};
        finalData.nodes.map(function(d,i){
                d.nodeId = d.id;
                d.id = i;
                nodesList[d.nodeId]=i;

            });
            finalData.links.map(function(d){
                d.value  = d.value;
                d.source= nodesList[d.source];
                d.target = nodesList[d.target];
            });
            // options.data = data;
            options.data =  (finalData);
            // options.text_x_pos = '-40';
            options.edge_labels = $.map(finalData.links,function(i){return i.label;});
            if(typeof this.entitySearchResult == 'object'){
              options.companyLogo =  this.entitySearchResult.comapnyLogo;
            }

           snackRiskScoreModule.sankey_chart_risk_score(options);/*jshint ignore:line*/
          setTimeout(() => {
            this.loadRiskpieChart("",options);/*jshint ignore:line*/
          },100);

     },1000);
    }
  }

  loadRiskpieChart(setTitle,options) {
    var data = [
        { name: "Risk Score", value: this.cumulativeRisk  },
        { name: " ", value: 100-this.cumulativeRisk  },

    ];
    var text = Math.round(this.cumulativeRisk);

    // var container= "#finalDiv";
    var width:any = $('.lastRect').attr('height');
    var height:any = $('.lastRect').attr('height');
    var ht:any;

    var thickness = 20;
    // var duration = 750;
    var labeltxtY=115;
    if(options.edge_labels.length > 4){
      labeltxtY=95;
        width = width * 1.5;
        height = height * 1.5;
        ht = $('.lastRect').attr('height') ? $('.lastRect').attr('height') : 15;
        if(ht != 15){
          ht = ht / 2;
        }
    }
    var radius = Math.min(width, height) / 2;
    // var color = d3.scaleOrdinal(d3.schemeCategory10);
    var colorObj = {" ":"#566a71","Risk Score":"rgb(66, 148, 217)"};

    var svg = d3.select('#finalDiv').attr('height',120).attr('width',120)
        .append('svg')
       .attr("class","sankPie")
        .attr('width', width)
        .attr('height', parseFloat(height)+50);

    // var temp_width = $('.lastRect').attr('height') ? $('.lastRect').attr('height')/2 : 20;
//	    $('#finalDiv').attr('transform', 'translate(' + (width / 2) + ',' + (-parseInt(temp_width)) + ')');
    $('#finalDiv').attr('transform', 'translate(' + (20) + ',' + 0 + ')');
var g = svg.append('g')
    .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');



    var arc = d3.arc()
        .innerRadius(radius - thickness)
        .outerRadius(radius);

    var pie = d3.pie()
        .value(function (d) { return d.value; })
        .sort(null);

    g.selectAll('path')
        .data(pie(data))
        .enter()
        .append("g")

        .append('path')
        .attr('d', arc)
        .attr('fill', function(d) {
          return colorObj[d.data.name];})
        .each(function (d, i) { this._current = i; });

    g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em')
        .attr('font-size', '14px')
        .attr("fill","#ccc")
        .text(text);

//	    if(setTitle){
       svg.append("text")
          .attr('x',52)
          .attr('y', labeltxtY)
          .attr('width', 50)
          .attr('height', 80)
          .attr("text-anchor", "middle")
          .attr("stroke",'none')
          .attr("font-weight",'normal')
           .attr("fill",'#9B9FA2')
          .style("font-size",'12px')
          .text('RISK SCORE');
//	    }
  };

  plotRightsidePanel(value) {
    this.entitySearchResult = value;
    if (this.entitySearchResult.list['follower_following_count'].length > 0) {
      var instanceData = [{
        "alertStatus": "FOLLOWING",
        "count": parseInt(this.entitySearchResult.list['follower_following_count'][0].twitter_following_number),
        "key": "FOLLOWING",
        "value": parseInt(this.entitySearchResult.list['follower_following_count'][0].twitter_following_number),

      }, {
        "alertStatus": "FOLLOWER",
        "count": parseInt(this.entitySearchResult.list['follower_following_count'][0].twitter_followers_number),
        "key": "FOLLOWER",
        "value": parseInt(this.entitySearchResult.list['follower_following_count'][0].twitter_followers_number),

      }];
      var options = {
        container: "#interaction-ratio",
        data: instanceData,
        height: 160,
        colors: ["#5d96c8", "#b753cd"],
        colorsObj: {
          "FOLLOWER": "#5d96c8",
          "FOLLOWING": "#b753cd"
        },
        islegends: true,
        islegendleft: true,
        legendwidth: 30,
        format: true,
        legendmargintop: 30
      };
      setTimeout(function () {
        new PieChartModule.reusableplotPie(options);
      });
    }
    else {
      this.entitySearchResult.is_data_not_found.is_interactionration = false;
    }
    setTimeout(() => {
      this.SharedServicesService.getAssetsFile('json/world-country-detail-list.json').subscribe(data => {
        const worldchartsocialmediarightside = {
          container: "#twitter-locations-chart",
          uri1: "../../../../../../assets/js/worldCountries.json",// Url of data
          uri2: "../../../../../../assets/js/worldMapData.json",// Url of data
          height: 300,
          width: 500,
          markers:  this.entitySearchResult.list.socialmediaLocations,
          data : [data, []]
        }
        this.entityGraphService.plotWorldLocationChart(worldchartsocialmediarightside);
      })
    }, 2000);
    var twitter_tag_words = [];
    twitter_tag_words = this.entitySearchResult.list.entityTwitterList.map((val) =>{
      if(val.tags && val.tags.length > 0){
        return val.tags[0].name
      }
    }).map((element) => {
      return {
        text: element,
        size: 5,
        type: 'person'
      }
    });
    var tagCloudTwitterTagsOptions = {
      header: "MY ENTITIES",
      container: "#tagcloudCompanyTwitterTags",
      height: 200,
      width: ($("#tagcloudCompanyTwitterTags").width() ? $("#tagcloudCompanyTwitterTags").width() : 300),
      data: twitter_tag_words,
      margin: {
        bottom: 10,
        top: 10,
        right: 10,
        left: 10
      }
    };
    setTimeout(() => {
      this.plotTagCloudChartForLiveFeed(tagCloudTwitterTagsOptions);

    }, 2000);
  }
  /*
  * @purpose: plotTagCloudChartForLiveFeed function
  * @created: 05 sep 2017
  * @returns: promise object of entitySearchResult
  * @pramas: barOptions(object)
  * @author: sandeep
 */
  plotTagCloudChartForLiveFeed(barOptions) {
    textTagmodule.textcloudChart(barOptions, d3,cloud)
  };

  getCaseByRiskDetails() {
    let riskScoreData = [];

    // disable ehubrest/api/riskScore/score api call - kamila (AP-1844)
    // this.entityApiService.getRiskScoreData(this.queryParams['query']).subscribe((data: any) => {
    //   console.log('cumulativeRisk',data);
    //   if (Math.abs(data.latest.entityRiskModel['overall-score']) > 1) {
    //     data.latest.entityRiskModel['overall-score'] = Math.abs(data.latest.entityRiskModel['overall-score']) / 100;
    //   }
    //   this.cumulativeRisk = data.latest.entityRiskModel['overall-score'] * 100;
    //   this.overviewRisks = data.latest.entityRiskModel;
    //   this.overviewRisks.cumulativeRisk = data.latest.entityRiskModel['overall-score'];
    //   this.riskScoreData = data.latest.entityRiskModel;
    //   riskScoreData = data.latest.entityRiskModel;
    //   EntityConstants.basicSharedObject.riskScoreData = riskScoreData;
    //   this.scaledNumArr[0] = 0;
    //   this.scaledNumArr[1] = data.latest.entityRiskModel['overall-score'] * 100;
    //   this.scaledNumArr[2] = 0;
    //   console.log(this.scaledNumArr);
    // }, (err) => {
    // });
  }
  ngAfterViewInit() {


  }
}
