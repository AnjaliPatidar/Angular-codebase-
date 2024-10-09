import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AlertManagementService } from '../../alert-management.service';
import { AlertGeneralInfoUtility } from './alert-general-info.utility';
import { Subject, zip } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// import { chunk, find, compact, flatMap, isEmpty, groupBy, uniq } from 'lodash-es';
@Component({
  selector: 'app-alert-general-info',
  templateUrl: './alert-general-info.component.html',
  styleUrls: ['./alert-general-info.component.scss']
})
export class AlertGeneralInfoComponent implements OnInit, OnDestroy {
  public getExtraDetails: any = {}
  public watchlistAttributesBasicInfo: any = {}
  public generalDetail: Array<any> = [];
  public matchInfoArrayKeys: Array<any> = [];
  public recordInfoArray: Array<any> = [];
  public generalAttributekeys: Array<any> = [];
  public generalAttribute: Array<any> = [];
  public watchlistData: any = [];
  public watchlistMatcherAttr: any = [];
  @Input() showMatchTypeColumn: boolean = false;
  public validKeysFromBasicInfo = {
    Person: ['legal_type', 'given_name', 'citizenship', 'locations', 'entry_id', 'age', 'home_location', 'watchlist_record_id', 'identifiers', 'identifier', 'descriptions', 'date', 'active_status', 'first_name', 'city_of_birth', 'images', 'aka', 'alternative_names', 'address', 'gender', 'family_name', 'nationality', 'additional_names', 'images', 'honor_prefix', 'wl id', 'wl ver', 'place_of_birth', 'date_of_birth'],
    Organization: ['legal_type', 'entry_id', 'primary_name', 'locations', 'given_name', 'home_location', 'watchlist_record_id', 'identifiers', 'identifier', 'descriptions', 'date', 'active_status', 'name', 'address', 'date_of_registration', 'alternative_names', 'place_of_registration', 'organization_name', 'alias_name', 'website', 'registered_address', 'company_identifier', 'honor_prefix', 'wl id', 'wl ver']
  }

  public invalidAttributes = ["phone", "spelling", "additional_name", "low_quality_aka", "formerly_name_as", "expand_language_variation", "last_name", "image", "jurisdiction", "probability", "job_title", "email", "description", "source_url", "source_description", "profile_notes", "name_type", "watchlist_id", "relatives", "entity_type", "id", "screening_type", "screening", "spouse", "children", "sibling", "knows", "alumni_of", "works_for", "mention_id", "country", "url", "wl_hit_index"];

  public attributesDisplayNameMapping = {
    Organization: {
      name: 'Organization Name',
      aka: "Alias Name",
      alternative_names: "Alias Name",
      address: "Registered Address",
      date_of_registration: 'Incorporated In',
      place_of_registration: 'Domiciled In',
      descriptions: "Watchlist Hit Type",
      active_status: "Watchlist Status",
      date: 'Watchlist Last Update Date',
    },
    person: {
      aka: "Additional Names",
      alternative_names: "Additional Names",
      address: 'Addresses',
      first_name: "Given Name",
      images: "Person Image",
      city_of_birth: "Birth Place",
      descriptions: "Watchlist Hit Type",
      active_status: "Watchlist Status",
      date: 'Watchlist Last Update Date',
    }
  }

  private _unsubscribe$ = new Subject<boolean>();
  constructor(private _alertService: AlertManagementService) { }

  ngOnInit() {
    this.getAlertExtraDetails()
    this.getAttributeData()
  }

  getAlertExtraDetails() {
    this._alertService.getAlertExtraData().pipe(takeUntil(this._unsubscribe$)).subscribe((data) => {
      if (data) {
        this.getExtraDetails = data
      }
    });
  }

  getAttributeData() {
    let watchlistData$ = this._alertService.getWatchlistData()
    let generalAttrData$ = this._alertService.getGeneralAttributesData()

    zip(watchlistData$, generalAttrData$).pipe(takeUntil(this._unsubscribe$)).subscribe((data: any) => {
      if (data[0] && Object.keys(data[0]).length != 0 || data[1].length > 0) {
        this.generalDetail = []

        // watchlist attribute data
        this.watchlistData = data[0]
        if (this.watchlistData && this.watchlistData.hit_attributes) {
          this.watchlistMatcherAttr = this.watchlistData.hit_attributes.matcher_attributes
          this.matchInfoArrayKeys = this.watchlistMatcherAttr.map(item => item.wl_attribute_name)
          this.watchlistAttributesBasicInfo = this.watchlistData.hit_attributes.basic_info

          // set name attribute value for matchInfo 
          this.watchlistAttributesBasicInfo.name = this.watchlistAttributesBasicInfo.primary_name ? this.watchlistAttributesBasicInfo.primary_name : '';

          // add family_name value, replace last_name to family_name
          if (!this.watchlistAttributesBasicInfo.hasOwnProperty('family_name')) {
            if (this.watchlistAttributesBasicInfo.hasOwnProperty('last_name')) {
              this.watchlistAttributesBasicInfo['family_name'] = this.watchlistAttributesBasicInfo['last_name'];
            }
          }
        }

        // general attribute data
        this.generalAttribute = data[1]
        if (this.generalAttribute) {
          this.recordInfoArray = this.generalAttribute.sort((a, b) => b.confidence_level - a.confidence_level).filter((obj, index, self) =>
            index === self.findIndex((el) => (
              el['wl_attribute_name'] === obj['wl_attribute_name']
            ))
          )
          // add family_name keys
          this.recordInfoArray.map((e) => {
            if (e.wl_attribute_name !== 'family_name') {
              if (e.wl_attribute_name === 'last_name') {
                e.wl_attribute_name = 'family_name'
              }
            }
          })
          this.generalAttributekeys = this.recordInfoArray.map(e => e.wl_attribute_name)
        }

        if (this.matchInfoArrayKeys.length > 0) {
          this.generalAttributekeys = Array.from(new Set(this.generalAttributekeys.concat(this.matchInfoArrayKeys)))
        }

        this.setGenaralAttributeData()
      } else {
        this.generalDetail = []
      }
    })
  }

  setGenaralAttributeData() {
    // add more keys
    Object.keys(this.watchlistAttributesBasicInfo).forEach((attribute) => {
      if (this.validKeysFromBasicInfo.Person.indexOf(attribute) != -1 || this.validKeysFromBasicInfo.Organization.indexOf(attribute) != -1) {
        if (this.generalAttributekeys.indexOf(attribute) == -1 && (this.watchlistAttributesBasicInfo[attribute])) {
          this.generalAttributekeys.push(attribute);
        }
      }
    })

    if (this.generalAttributekeys.length > 0) {
      this.generalAttributekeys.map((attribute: any) => {
        let generalAttrObj: any = {};
        if (this.invalidAttributes.indexOf(attribute) == -1) {
          generalAttrObj.attributeName = attribute

          let recordInfoIndex = this.recordInfoArray.findIndex(e => e.wl_attribute_name == attribute)
          generalAttrObj.recordInfo = recordInfoIndex !== -1 ? this.recordInfoArray[recordInfoIndex].value_in_entity : 'N/A'

          let matchInfoIndex = this.matchInfoArrayKeys.findIndex(e => e == attribute)
          if (this.watchlistMatcherAttr[matchInfoIndex]) {
            generalAttrObj.matchInfo = this.watchlistMatcherAttr[matchInfoIndex].value_in_entity
            generalAttrObj.matchType = this.watchlistMatcherAttr[matchInfoIndex].match_type

            // when matcher_attributes exist and record info is not available , we set it from basic info
            if (generalAttrObj.recordInfo == 'N/A') {
              generalAttrObj.recordInfo = this.watchlistAttributesBasicInfo[attribute]
            }
          } else {
            if (this.watchlistAttributesBasicInfo.hasOwnProperty(attribute)) {
              if (this.validKeysFromBasicInfo.Person.indexOf(attribute) != -1 || this.validKeysFromBasicInfo.Organization.indexOf(attribute) != -1) {
                generalAttrObj.matchInfo = this.watchlistAttributesBasicInfo[attribute]
              }
            } else {
              generalAttrObj.matchInfo = ''
            }
            generalAttrObj.matchType = ''
          }

          // add matchInfo Badge
          generalAttrObj.confidencePercentage = -1
          this.watchlistMatcherAttr.map((e: any) => {
            if (e.wl_attribute_name === attribute) {
              generalAttrObj.confidencePercentage = AlertGeneralInfoUtility.getConfidencePercentage(e.confidence_level)
            }
          })

          this.generalAttributeFormatter(attribute, generalAttrObj)
          this.generalDetail.push(generalAttrObj)
        }
      })
    }

    this.generalDetail = this.generalDetail.filter(item => item.attributeName !== 'wl ver' && item.attributeName !== 'wl id')
  }

  generalAttributeFormatter(attribute, generalAttrObj) {
    generalAttrObj.attributeName = AlertGeneralInfoUtility.AttributeNameMapper(generalAttrObj.attributeName, this.getExtraDetails.entity_type, this.attributesDisplayNameMapping)

    generalAttrObj.recordInfo = AlertGeneralInfoUtility.recordInfoFormatter(attribute, generalAttrObj.recordInfo)

    generalAttrObj.matchInfo = AlertGeneralInfoUtility.matchInfoFormatter(attribute, generalAttrObj.matchInfo)
  }

  ngOnDestroy() {
    this._unsubscribe$.next(true);
    this._unsubscribe$.complete();
  }
}
