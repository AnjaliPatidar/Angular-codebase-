import { Component, OnInit, Input } from '@angular/core';
import { EntityApiService } from '../../../entity/services/entity-api.service';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { sortBy } from 'lodash-es';

@Component({
  selector: 'app-entity-share-holder-evidence-modal',
  templateUrl: './entity-share-holder-evidence-modal.component.html',
  styleUrls: ['./entity-share-holder-evidence-modal.component.scss']
})
export class EntityShareHolderEvidenceModalComponent implements OnInit {
  @Input() public shareHolderData;
  @Input() public currentEntityNode;
  public entityShareHolderListsData = [];
  public defaultActiveIndex = 0;
  public multisourceDiscData = [];
  public openEditList = false;
  public filter_shareholders = [];
  public shareHOlderLoader = false;
  public screenShot_source = [];
  public requestForMultiSource = null;
  public requestForSelectentity = null;
  public requestForFetchLink = null;
  constructor(public entityApiService: EntityApiService,
    public mScrollbarService: MalihuScrollbarService,
    public activemodal: NgbActiveModal) { }

  ngOnInit() {
    this.filter_shareholders = this.shareHolderData.filter(function (obj) {
      return (obj.entity_id && obj.entity_id == "orgChartParentEntity" && (obj.classification.includes('Intermediate Parent') || obj.classification.includes('Ultimate Legal Parent')));
    });
    if (this.currentEntityNode) {
      this.defaultActiveIndex = this.filter_shareholders.findIndex((d: any) => {
        return d.identifier == this.currentEntityNode.identifier
      })
    }
    this.entityShareHolderListsData = this.filter_shareholders;
    this.callMultiSourceApi(this.entityShareHolderListsData[this.defaultActiveIndex]); // call initial company share holder 1st item

  }
  /*
* @purpose: fetch entity on click of a company from left pane
* @created: 25th June 2019
* @params:   companyObj
* @author:Amarjith
*/
  callMultiSourceApi(companyObj) {
    var dataParams = {
      keyword: companyObj && companyObj.name ? companyObj.name : '',
      jurisdiction: companyObj && companyObj.jurisdiction ? companyObj.jurisdiction : '',
      website: ''
    }
    this.shareHOlderLoader = true;
    this.entityApiService.getEntityResolvedV2(dataParams).subscribe(((response: any) => {
      if (!response['is-completed']) {
        setTimeout(() => {
          this.callMultiSourceApi(companyObj);
        }, 5000);
      } else {
        this.shareHOlderLoader = false;
        this.multiSourceDiscription(response)
      }
    }));
  }
  /*
   * @purpose:  After Successfully response of multisource , function to display the results in the right page
   * @created: 25th June 2019
   * @params:   response [Array]
   * @author:Amarjith
  */
  multiSourceDiscription(response) {
    this.multisourceDiscData = [];
    if (response && response && response.results && response.results.length != 0) {
      response.results.forEach((val) => {
        var select_entity_link = val.links['select-entity'];
        // var source_category_considering = (val.overview) ? Object.keys(val.overview)[0] : [];
        var source_category_considering = [];
        Object.keys(val.overview).forEach((key) => {
          if (val.overview[key].hasOwnProperty('sourceCategory')) {
            if (val.overview[key]['sourceCategory'] === 'Trade Registry') {
              source_category_considering.unshift({
                key: key,
                value: val.overview[key],
                identifier: val.identifier
              });
            }
          }
        });
        source_category_considering = sortBy(source_category_considering, [function (o) { return o.key; }]);
        for (var key in val.overview) {
          if (source_category_considering[0] && source_category_considering[0].key === key) {
            val.overview[key].identifier = val.identifier ? val.identifier.toLowerCase() : '';
            this.multisourceDiscData.push({
              source_name: key,
              overviewSrc: val.overview[key],
              select_entity: select_entity_link,
              identifier: val.identifier ? val.identifier.toLowerCase() : '',
              isScreenShot: false,
              loading: false,
              screenShot_source: '',
              screenShot_sourceName: '',
              addtopageloader: false,
              addedtopage: false
            });
          }
        }
      });

    }
  }
     /*
 * @purpose: getMultiSource click of a company from left pane
 * @created: 25th June 2019
 * @params:  index, companyObj
 * @author:Amarjith
*/
getMultiSource = function (index, companyObj) {
  this.defaultActiveIndex = index;
  this.callMultiSourceApi(companyObj)
}


}
