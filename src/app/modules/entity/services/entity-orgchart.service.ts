import { Injectable} from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError ,BehaviorSubject} from 'rxjs';
import { AppConstants } from '../../../app.constant';
import { catchError, retry } from 'rxjs/operators';
import { find, findIndex } from 'lodash-es';

import { EntityCommonTabService } from '../services/entity-common-tab.service';
import { EntityConstants } from '../constants/entity-company-constant';
import {Screeningconstructor} from '../common-classes/ScreeningConstructor';


@Injectable({
  providedIn: 'root'
})
export class EntityOrgchartService {

  public  modified_screeningSubject = new BehaviorSubject<any>("");
  modified_screeningObservable = this.modified_screeningSubject.asObservable();

  constructor(private http: HttpClient,
    private entityCommonTabService:EntityCommonTabService) { }
  getllSourceDocuments(params) {
    params.isAllRequired = true;
    let url = AppConstants.Ehub_Rest_API + 'documentStorage/myDocuments';
    return this.http.get(url, {params:params}).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }

  getEvidenceListDocs(paramFromApiFunc) {
    var params = paramFromApiFunc;
    params.docFlag = 6;
    let url = AppConstants.Ehub_Rest_API + 'documentStorage/myDocuments?pageNumber=' + params.pageNumber + '&recordsPerPage=' + params.recordsPerPage + '&docFlag=' + params.docFlag + '&entityId=' + params.entityId + '&orderBy=' + params.orderBy + '&orderIn=' + params.orderIn + '&isAllRequired=' + true;
    return this.http.get(url, params).pipe(
      retry(2),
      catchError(this.handleError)
    )


  }

  getSuccessReportDocuments(pagerecords, docOrSticky, identifier) {
    var params: any = {
      "pageNumber": 1,
      "orderIn": 'desc',
      "orderBy": 'uploadedOn',
      "recordsPerPage": pagerecords,
      "entityId": identifier
    };

    if (docOrSticky === "evidence_docs") {
      params.docFlag = 6;
    }
    let url = AppConstants.Ehub_Rest_API + 'documentStorage/myDocuments';
    return new Promise(resolve => {
      this.http.get(url, params).pipe(
        retry(2),
        catchError(this.handleError)
      ).subscribe((res: any) => {
        var source_type = docOrSticky === "evidence_docs" ? 'png' : 'doc';
        if (res && res.result && res.result.length) {
          res.result.forEach(function (val, key) {
            val.source_type = val.type || source_type;
            val.sourceName = val.title || val.docName;
            val.sourceUrl = val.docName;
            val.docId = val.docId;
            val.docFlag = val.docFlag;
          });
          if (docOrSticky === 'docs') {
            resolve({ 'documentListsData': res.result });
          }
          if (docOrSticky === "evidence_docs") {
            resolve({ 'evidenceDocumentsListsData': res.result });
          }
        }
        else if (res && res.result && res.result.length === 0 && docOrSticky === 'docs') {
          resolve({ 'documentListsData': {} });
        } else if (res && res.result && res.result.length === 0 && docOrSticky === 'evidence_docs') {
          resolve({ 'evidenceDocumentsListsData': {} });
        }
      }, (err: any) => {

      })
    })

  }
  getSources() {

    var apiUrl =  AppConstants.Ehub_Rest_API + "sourceCredibility/getSources?isAllSourcesRequired=true";
    var param = [];
		 return this.http.post(apiUrl,param).pipe(
      catchError(this.handleError)
    );

	}
  apiCallGetSources(queryParams:any,entityDetails:any):any{
    let sourceList:any  =[];
    var  promise = new Promise(resolve=>{
        this.getSources().subscribe((response: any) => {
          sourceList = response.result.map((value)=> {
            if (value && value.sourceName && value.sourceName.toLowerCase() === 'website') {
              value.sourceName = entityDetails && entityDetails.hasURL && entityDetails.hasURL.value ? entityDetails.hasURL.value : value.sourceName;
            }
            value.source_type = 'link';
            return value;
          });
          var params: any = {
            "pageNumber": 1,
            "orderIn": 'desc',
            "orderBy": 'uploadedOn',
            "recordsPerPage": 9,
            "entityId": queryParams.query
          };
          this.getllSourceDocuments(params).subscribe(
            (response: any) => {
              if (response && response.length > 0) {
                if (response[0].documentListsData && response[0].documentListsData.length > 0) {
                  response[0].documentListsData.forEach((val) => {
                    var sourceArray = sourceList.filter((searchedval: any) => searchedval.sourceName === val.sourceName);
                    var sourceObject = sourceArray.filter((searchVal: any) => searchVal.type === val.type);
                    if (sourceObject.length == 0) {
                      sourceList.push(val);
                    }
                  });
                }
                if (response[1].evidenceDocumentsListsData && response[1].evidenceDocumentsListsData.length > 0) {
                  response[1].evidenceDocumentsListsData.forEach((val: any) => {
                    var sourceArray = sourceList.filter((searchedval: any) => searchedval.sourceName === val.sourceName);
                    var sourceObject = sourceArray.filter((searchVal: any) => searchVal.type === val.type);
                    if (sourceObject.length == 0) {
                      sourceList.push(val);
                    }
                  });
                }
              }
          resolve(sourceList);

            }
          )
        })
    });
    return promise;
  }
  /*
	/*
	 * purpose: post the shareholder added to the company
	 * created: 9 jan 2019
	 * params:no params
	 * return: success, error functions
	 * author: Ram singh
	 */
	addCustomShareHolder(query, data) {

		var apiUrl =  AppConstants.Ehub_Rest_API + 'advancesearch/addCustomShareHolder?mainIdentifier=' + query.mainIdentifier + '&isSubsidiare=' + query.isSubsidiare;
    var param = data;
		 return this.http.put(apiUrl,param).pipe(
      catchError(this.handleError)
    );
	}
	/*
* @purpose: Add Entity in chart
* @created: 20 MArch 2019
* @author: Ram
*/
addShareholderinGetCorporate(deleteSelectedEntity,
   addOwnershipCompany,
    addoredit, duplicate_entites, Index,
     queryParams,
     subsidaryFilterData,screeningData,actualScreeningData) {
  var data = [];
  var query = {};
  if (addoredit === 'add') {
    data = [{
      "entityName": addOwnershipCompany.name,
      "from": addOwnershipCompany.from ? addOwnershipCompany.from :((new Date().getFullYear()) + '-' + (("0" + (new Date().getMonth() + 1)).slice(-2)) + '-' + (("0" + (new Date().getDate())).slice(-2))),
      // "identifier": deleteSelectedEntity.bvdId ? deleteSelectedEntity.bvdId : (deleteSelectedEntity.identifier ? deleteSelectedEntity.identifier :''),
      "jurisdiction": addOwnershipCompany.jurisdiction ? addOwnershipCompany.jurisdiction : addOwnershipCompany.juridiction ? addOwnershipCompany.juridiction : '',
      "natureOfControl": addOwnershipCompany.entity_type,
      "entityType": addOwnershipCompany.entity_type,
      "source": addOwnershipCompany.source_evidence ? addOwnershipCompany.source_evidence : '',
      "sourceUrl": addOwnershipCompany.sourceUrl ? addOwnershipCompany.sourceUrl : '',
      "totalPercentage": addOwnershipCompany.totalPercentage ? addOwnershipCompany.totalPercentage : 0,
      "childIdentifier": deleteSelectedEntity.bvdId ? deleteSelectedEntity.bvdId : (deleteSelectedEntity.identifier ? deleteSelectedEntity.identifier : ''),
      "childLevel": deleteSelectedEntity.level ? deleteSelectedEntity.level : 0,
      "classification": addOwnershipCompany.classification && addOwnershipCompany.classification.length > 0 ? JSON.stringify(addOwnershipCompany.classification) : '',
      "dateOfBirth": addOwnershipCompany.date_of_birth ? addOwnershipCompany.date_of_birth : '',
      "hasURL": addOwnershipCompany.hasURL ? addOwnershipCompany.hasURL : '',
      "role": addOwnershipCompany.officer_role ? addOwnershipCompany.officer_role : '',
    }]
    query = {
      isSubsidiare: deleteSelectedEntity.isSubsidiare ? deleteSelectedEntity.isSubsidiare : false,
      mainIdentifier: (queryParams && queryParams.query) ? queryParams.query :'',
    }
  } else if (addoredit === 'edit') {
    query = {
      mainIdentifier: (queryParams && queryParams.query) ? queryParams.query :  '',
      isSubsidiare: deleteSelectedEntity.isSubsidiare ? deleteSelectedEntity.isSubsidiare : false
    }
    if (deleteSelectedEntity && deleteSelectedEntity.childIdentifier && typeof deleteSelectedEntity.childIdentifier === "string") {
      data = [{
        "entityName": deleteSelectedEntity.name,
        "from": deleteSelectedEntity.from ? deleteSelectedEntity.from : ((new Date().getFullYear()) + '-' + (("0" + (new Date().getMonth() + 1)).slice(-2)) + '-' + (("0" + (new Date().getDate())).slice(-2))),
        "identifier": (deleteSelectedEntity.identifier ? deleteSelectedEntity.identifier : ''),
        "jurisdiction": deleteSelectedEntity.jurisdiction ? deleteSelectedEntity.jurisdiction : '',
        "natureOfControl": addOwnershipCompany.entity_type ? addOwnershipCompany.entity_type : '',
        "childIdentifier": deleteSelectedEntity.childIdentifier ? deleteSelectedEntity.childIdentifier : '',
        "source": deleteSelectedEntity.source_evidence ? deleteSelectedEntity.source_evidence : '',
        "sourceUrl": deleteSelectedEntity.sourceUrl ? deleteSelectedEntity.sourceUrl : '',
        "totalPercentage": deleteSelectedEntity.totalPercentage ? deleteSelectedEntity.totalPercentage : 0,
        "childLevel": deleteSelectedEntity.childLevel ? deleteSelectedEntity.childLevel : deleteSelectedEntity.level ? deleteSelectedEntity.level - 1 : 0,
        "classification": deleteSelectedEntity.classification && deleteSelectedEntity.classification.length > 0 ? JSON.stringify(deleteSelectedEntity.classification) : '',
        "dateOfBirth": deleteSelectedEntity.date_of_birth ? deleteSelectedEntity.date_of_birth : '',
        "hasURL": deleteSelectedEntity.hasURL ? deleteSelectedEntity.hasURL : '',
        "role": addOwnershipCompany.officer_role ? addOwnershipCompany.officer_role : '',
      }]
    } else if (deleteSelectedEntity && deleteSelectedEntity.childIdentifier && deleteSelectedEntity.childIdentifier.length > 0) {
      data = deleteSelectedEntity.childIdentifier.map(function (multipleChild) {
        var object = {
          "entityName": deleteSelectedEntity.name,
          "from": deleteSelectedEntity.from ? deleteSelectedEntity.from : ((new Date().getFullYear()) + '-' + (("0" + (new Date().getMonth() + 1)).slice(-2)) + '-' + (("0" + (new Date().getDate())).slice(-2))),
          "identifier": (deleteSelectedEntity.identifier ? deleteSelectedEntity.identifier : ''),
          "jurisdiction": deleteSelectedEntity.jurisdiction ? deleteSelectedEntity.jurisdiction : '',
          "natureOfControl": addOwnershipCompany.entity_type ? addOwnershipCompany.entity_type : '',
          "childIdentifier": multipleChild.identifier,
          "source": deleteSelectedEntity.source_evidence ? deleteSelectedEntity.source_evidence : deleteSelectedEntity.source ? deleteSelectedEntity.source : '',
          "sourceUrl": deleteSelectedEntity.sourceUrl ? deleteSelectedEntity.sourceUrl : '',
          "totalPercentage": deleteSelectedEntity.totalPercentage ? (deleteSelectedEntity.totalPercentage / deleteSelectedEntity.childIdentifier.length) : 0,
          "childLevel": multipleChild.childLevel ? multipleChild.childLevel : multipleChild.level ? multipleChild.level - 1 : 0,
          "classification": deleteSelectedEntity.classification && deleteSelectedEntity.classification.length > 0 ? JSON.stringify(deleteSelectedEntity.classification) : '',
          "dateOfBirth": deleteSelectedEntity.date_of_birth ? deleteSelectedEntity.date_of_birth : '',
          "hasURL": deleteSelectedEntity.hasURL ? deleteSelectedEntity.hasURL : '',
          "role": addOwnershipCompany.officer_role &&  addOwnershipCompany.officer_role.length > 0  ?addOwnershipCompany.officer_role : '',
        }
        return object;
      });
    }
  }
  this.addCustomShareHolder(query, data).subscribe( (shareHolderResponse:any) =>{
    if (addoredit === 'add') {//this loop for custom added /newly added company
      addOwnershipCompany['identifier'] = shareHolderResponse.identifier;
      addOwnershipCompany.childIdentifier = (shareHolderResponse.childs && shareHolderResponse.childs.length > 0) ? shareHolderResponse.childs[0].identifier : '';
      addOwnershipCompany.level = shareHolderResponse.level;
      addOwnershipCompany.childLevel = (shareHolderResponse.childs && shareHolderResponse.childs.length > 0) ? shareHolderResponse.childs[0].childLevel : '';
      this.getTheentityScreningDetails(addOwnershipCompany, deleteSelectedEntity,subsidaryFilterData,screeningData,actualScreeningData);
      if (duplicate_entites && duplicate_entites.length > 0) {
        var remove_duplicated_entity = duplicate_entites.splice(Index, 1);
        for (var index = 0; index < duplicate_entites.length; index++) {
          var check_childIdentifier_exist = find(subsidaryFilterData, { 'id': duplicate_entites[index].id });
          if (check_childIdentifier_exist) {
            var get_childIdentifier_identifier = find(subsidaryFilterData, { 'id': check_childIdentifier_exist.child, 'isCustom': true });
            if (get_childIdentifier_identifier) {
              duplicate_entites[index].childIdentifier = get_childIdentifier_identifier.identifier;
            } else {
              get_childIdentifier_identifier = subsidaryFilterData[0];
              duplicate_entites[index].childIdentifier = subsidaryFilterData[0].bvdId;
            }
            this.addShareholderinGetCorporate(get_childIdentifier_identifier,
             duplicate_entites[index],'add', duplicate_entites[index].childIndex,
             duplicate_entites[index].searchedSourceObj,queryParams,
            subsidaryFilterData,screeningData,actualScreeningData);
            break;
          }
        }
      }
    } else if (deleteSelectedEntity) {//need to conclude for got the case
      deleteSelectedEntity['identifier'] = shareHolderResponse.identifier ? shareHolderResponse.identifier.split("_")[0] : deleteSelectedEntity && deleteSelectedEntity['identifier'] ? deleteSelectedEntity['identifier'] : '';
      deleteSelectedEntity.childIdentifier = shareHolderResponse.childs;
      deleteSelectedEntity.level = shareHolderResponse.level;
    }
  });
}
	/*
* @purpose: update  the Entity in screening Table and Chart
* @created: 20 MArch 2019
* @author: Ram
*/

getTheentityScreningDetails(addOwnershipCompany, deleteSelectedEntity, subsidaryFilterData,screeningData,actualScreeningData) {
  var entity_identifier = addOwnershipCompany.identifier ? addOwnershipCompany.identifier : Math.random().toString(36).substring(5);
  addOwnershipCompany.identifier = entity_identifier;
  var country_risk = addOwnershipCompany.country ? this.entityCommonTabService.calculateCountryRisk(addOwnershipCompany.country_of_residence || addOwnershipCompany.country) : addOwnershipCompany.jurisdiction ? this.entityCommonTabService.calculateCountryRisk(this.entityCommonTabService.getCountryName(addOwnershipCompany.jurisdiction)) : '';
  var object = {
    "news": [],
    "@identifier": addOwnershipCompany.identifier,
    "identifier": addOwnershipCompany.identifier ? addOwnershipCompany.identifier :addOwnershipCompany.identifier,
    "level": addOwnershipCompany.level ? addOwnershipCompany.level : (deleteSelectedEntity.level),
    "jurisdiction": addOwnershipCompany.juridiction ? addOwnershipCompany.juridiction.toLowerCase() : addOwnershipCompany.jurisdiction ? addOwnershipCompany.jurisdiction.toLowerCase() : '',
    "juridiction": addOwnershipCompany.juridiction ? addOwnershipCompany.juridiction.toLowerCase() : addOwnershipCompany.jurisdiction ? addOwnershipCompany.jurisdiction.toLowerCase() : '',
    "parentIds": [],
    "entity_id": addOwnershipCompany.entity_id,
    "entity_ref_id": '',
    "child": addOwnershipCompany.child,
    "hasURL": addOwnershipCompany.hasURL,
    "entity_type": addOwnershipCompany.entity_type,
    "finance_Crime_url": [],
    "adverseNews_url": [],
    "screeningFlag": true,
    "name": addOwnershipCompany.name,
    "screeningUrl": addOwnershipCompany.screeningUrl ? addOwnershipCompany.screeningUrl : '',
    "id": addOwnershipCompany.id,
    "totalPercentage": addOwnershipCompany.totalPercentage,
    "indirectPercentage": addOwnershipCompany.indirectPercentage,
    "parents": addOwnershipCompany.parents ? addOwnershipCompany.parents : [],
    "status": "",
    "title": addOwnershipCompany.name,
    "Paridentifier": "",
    "sanction_source": [],
    "pep_url": [],
    "Ubo_ibo": addOwnershipCompany.Ubo_ibo ? addOwnershipCompany.Ubo_ibo : '',
    "country": (addOwnershipCompany.country && addOwnershipCompany.country.toLowerCase() !== 'select country') ? addOwnershipCompany.country : '',
    "numberOfShares": addOwnershipCompany.numberOfShares ? addOwnershipCompany.numberOfShares : '',
    "requestId": '',
    "showspinner": false,
    "no-screening": true,
    "sanction_bst:description": [],
    "childIdentifier": addOwnershipCompany.childIdentifier,
    "childLevel": addOwnershipCompany.childLevel,
    "source_evidence": addOwnershipCompany.source_evidence ? addOwnershipCompany.source_evidence : '',
    "isCustom": true,
    "sourceUrl": addOwnershipCompany.sourceUrl ? addOwnershipCompany.sourceUrl : '',
    "from": addOwnershipCompany.from ? addOwnershipCompany.from : '',
    "isUbo": addOwnershipCompany.isUbo ? addOwnershipCompany.isUbo : '',
    'bvdId': (addOwnershipCompany.identifier ? addOwnershipCompany.identifier : ''),
    'officer_role': addOwnershipCompany.officer_role ? addOwnershipCompany.officer_role : '',
    'officer_roles': addOwnershipCompany.officer_role ? [addOwnershipCompany.officer_role] : [],
    'date_of_birth': addOwnershipCompany.date_of_birth ? addOwnershipCompany.date_of_birth : '',
    'classification': addOwnershipCompany.classification ? addOwnershipCompany.classification : [],
    'report_jurisdiction_risk': country_risk,
    'officerIdentifier': addOwnershipCompany.officerIdentifier ? addOwnershipCompany.officerIdentifier : '',
    'highCredibilitySource': addOwnershipCompany.highCredibilitySource ? addOwnershipCompany.highCredibilitySource : ''
  }
  // const mainscreeningIndex = findIndex(subsidaryFilterData, {
  //   'name': addOwnershipCompany.name
  // });
  const tableScreeningIndex = findIndex(screeningData, {
    'name': addOwnershipCompany.name
  });
  // const actualcreeningIndex = findIndex(actualScreeningData, {
  //   'name': addOwnershipCompany.name
  // });
  addOwnershipCompany.officer_roles = addOwnershipCompany.officer_role ? [addOwnershipCompany.officer_role] : [];
  addOwnershipCompany.isCustom = true;
  addOwnershipCompany['no-screening'] = true;
  addOwnershipCompany['showdeleteIcon'] = true;
  addOwnershipCompany["showspinner"] = false;
  addOwnershipCompany['isChecked'] = false;
  addOwnershipCompany.screeningresultsloader = false;
  subsidaryFilterData.push(object);//////////////////////////////////////////////////////////////////////////
  this.addEntityToChart(object);
  var screeningObject = new Screeningconstructor(addOwnershipCompany);
  if (tableScreeningIndex === -1) {
    screeningData.push(screeningObject);
  }
  // if(actualcreeningIndex === -1 ){
  actualScreeningData.splice(1, 0, screeningObject);
  var newFormatedData = {
    actualScreeningData:actualScreeningData,
    screeningData:screeningData,
    subsidaryFilterData:subsidaryFilterData
  }
  this.modified_screeningSubject.next(newFormatedData);
  // screeningTableOriginal_custom($scope.actualScreeningData);
  // $scope.showSubsidariesInchart($scope.showSubsidaries, screeningObject.level);
  // $scope.pageloader.treeGraphloader = false;
  // $scope.pageloader.screeningLoader = false;
  // $scope.selectedMultipleeEntities = [];
}
downloadDocument(params){
  var apiUrl = AppConstants.Ehub_Rest_API + 'documentStorage/downloadDocument';
  return this.http.get(apiUrl,{params:params}).pipe(
    catchError(this.handleError)
  );
      // var request = $http({
      //     method: "GET",
      //     url: apiUrl,
      //     params: params,
      //     responseType: "arraybuffer"
      // });

}

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.

    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

  /*
	 * @purpose: add custom entity into chart
	 *  Ram Singh
	 */
	addEntityToChart = function (customAddEntity) {
		EntityConstants.customEntites.adddeleteEntity.push(customAddEntity);
  }; //add entityfunctionend

 	/*
	 * @purpose: delete custom entity into chart
	 *  Ram Singh
	 */
	deleteEntityFomChart = function (selectedItem) {
		EntityConstants.customEntites.deleteEntityChart.push(selectedItem);
	}; //delete entity
	// editChartEntity = function(editEntity){
	// 	EntityConstants.customEntites.editedEnties.push(editEntity);
	// };
	addscreeningTotable = function (customAddScreening) {
		EntityConstants.customEntites.screeningaddition.push(customAddScreening);
	}; //add entityfunctionend

}
