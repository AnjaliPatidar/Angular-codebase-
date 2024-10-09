import { EntityConstants } from '../constants/entity-company-constant'
import { EntityCommonTabService } from '../services/entity-common-tab.service'

import { find } from 'lodash-es';
export class Screeningconstructor {
  public countryNames: any;
  public "mdaas:RegisteredAddress" :any;
  public "sanction_bst:description": any;
  public "@source-id": any;
  public "vcard:bday": any;
  public "@identifier": any;
  public 'no-screening': any;
  public name: any;
  public Ubo_ibo: any;
  public listId: any;
  public high_risk_jurisdiction: any;
  public pep_url: any;
  public finance_Crime_url: any;
  public adverseNews_url: any;
  public FalseNews: any;
  public non_negativenews: any;
  public MainCompany: any;
  public hasURL: any;
  public sourceUrl: any;
  public from: any;
  public source_evidence: any;
  public identifier: any;
  public jurisdiction: any;
  public juridiction: any;
  public officer_role: any;
  public officer_roles: any;
  public entity_type: any;
  public date_of_birth: any
  public country: any
  public showdeleteIcon: any
  public showspinner: any
  public isChecked: any
  public level: any
  public childLevel: any
  public childIdentifier: any
  public bvdId: any
  public entity_id: any
  public classification: any
  public report_jurisdiction_risk: any
  public officerIdentifier: any
  public isCustom: any
  public id: any
  public highCredibilitySource: any
  public isUbo: any
  public indirectPercentage: any
  public sources: any
  public information_provider: any
  public entityRefernce: any
  public screeningresultsloader: any
  public entityCommonTabService = new EntityCommonTabService(null, null);
  constructor(object: any) {
    var country_risk = object.country ? this.calculateCountryRisk(object.country_of_residence || object.country) : object.jurisdiction ? this.calculateCountryRisk(this.getCountryName(object.jurisdiction)) : '';
    this["mdaas:RegisteredAddress"] = object.address ? object.address : '';
    this["sanction_bst:description"] = (object.sanctions && object.sanctions.length > 0) ? object.sanctions : [];
    this["@source-id"] = '';
    this["vcard:bday"] = '';
    this["@identifier"] = object.identifier ? object.identifier : '';
    this['no-screening'] = object['no-screening'];
    this.name = object.name;
    this.Ubo_ibo = object.Ubo_ibo ? object.Ubo_ibo : '';
    this.listId = '';
    this.high_risk_jurisdiction = object.high_risk_jurisdiction ? object.high_risk_jurisdiction.toLowerCase() : '';
    this.pep_url = (object.pep && object.pep.length > 0) ? object.pep : [];
    this.finance_Crime_url = object.finance_Crime_url && object.finance_Crime_url.length > 0 ? object.finance_Crime_url : [];
    this.adverseNews_url = object.adverseNews_url && object.adverseNews_url.length > 0 ? object.adverseNews_url : [];
    this.FalseNews = [];
    this.non_negativenews = [];
    this.MainCompany = '';
    this.hasURL = object.hasURL ? object.hasURL : '';
    this.sourceUrl = object.sourceUrl ? object.sourceUrl : '';
    this.from = object.from ? object.from : '';
    this.source_evidence = object.source_evidence ? object.source_evidence : '';
    this.identifier = object.identifier;
    this.jurisdiction = object.jurisdiction ? object.jurisdiction : '';
    this.juridiction = object.juridiction ? object.juridiction : '';
    this.officer_role = object.officer_role ? object.officer_role : '';
    this.officer_roles = object.officer_roles ? object.officer_roles : [];
    this.entity_type = object.entity_type ? object.entity_type : '';
    this.date_of_birth = object.date_of_birth ? object.date_of_birth : '';
    this.country = (object.country && object.country.toLowerCase() !== 'select country') ? object.country : '';
    this.showdeleteIcon = (object.showdeleteIcon === false) ? object.showdeleteIcon : (!object.showdeleteIcon ? true : true);
    this.showspinner = object.showspinner ? object.showspinner : false;
    this.isChecked = object.isChecked;
    this.level = object.level ? object.level : 0;
    this.childLevel = object.childLevel;
    this.childIdentifier = object.childIdentifier;
    this.bvdId = object.bvdId ? object.bvdId : '';
    this.entity_id = object.entity_id ? object.entity_id : '';
    this.classification = object.classification ? object.classification : [];
    this.report_jurisdiction_risk = object.report_jurisdiction_risk ? object.report_jurisdiction_risk : country_risk;
    this.officerIdentifier = object.officerIdentifier ? object.officerIdentifier : '';
    this.isCustom = object.isCustom ? object.isCustom : false;
    this.id = object.id ? object.id : '';
    this.highCredibilitySource = object.highCredibilitySource ? object.highCredibilitySource : '';
    this.isUbo = object.isUbo ? object.isUbo : '';
    this.indirectPercentage = object.indirectPercentage ? object.indirectPercentage : '';
    this.sources = object.sources ? object.sources : [];
    this.information_provider = object.information_provider ? object.information_provider : '';
    this.entityRefernce = object.entityRefernce && object.entityRefernce.length > 0 ? object.entityRefernce : [];
    this.screeningresultsloader = object.screeningresultsloader;
  }
  calculateCountryRisk(country) {
    var captialCaseCountry = this.entityCommonTabService.toTitleCase(country);
    var risk;
    if (captialCaseCountry) {
      //	d3.json("./constants/countryrisk.json", function (error, root) {
      risk = find(EntityConstants.chartsConst.countryRisk, ['COUNTRY', captialCaseCountry.toUpperCase()]);
      if (risk) {
        return risk["FEC/ESR Risk Level"];
      } else {
        return '';
      }
    }
  }
  getCountryName = function (countryCode, fromNode = false) {
    if (countryCode.toLowerCase() === 'us') {
      countryname = 'United States Of America';
      if (fromNode) {
        countryname = 'United State';
      }
      return countryname;
    }
    var curObj =  EntityConstants.countriesData.find(obj => {
      return obj.jurisdictionName.toLowerCase() === countryCode.toLowerCase();
    });
    if (curObj) {
      var countryname = curObj.jurisdictionOriginalName ? curObj.jurisdictionOriginalName : '';
      return countryname;
    }
  }


}
