import { Component, OnInit } from '@angular/core';
import { TopPanelConstants } from '../../constants/top-panel-constants'
import { AppConstants } from '@app/app.constant';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TopPanelApiService } from '../../services/top-panel-api.service';
import { EntityFunctionService } from '../../services/entity-functions.service';
import { SharedServicesService } from '@app/shared-services/shared-services.service';
import { EntityConstants } from '../../constants/entity-company-constant';

@Component({
  selector: 'app-add-media-modal',
  templateUrl: './add-media-modal.component.html',
  styleUrls: ['./add-media-modal.component.sass']
})
export class AddMediaModalComponent implements OnInit {
  public uploadDocumentUploadedFile = null;
  public uploadDocumentFileTitle = '';
  public uploadDocumentRemarks = '';
  public sourceWithBSTRegistry:any[] = [];
  queryParams: any;
  public addMediaPreloader: boolean;

  constructor(public entityFunctionService: EntityFunctionService,
    public topPanelApiService: TopPanelApiService,
    public NgbActiveModal :NgbActiveModal,
    private _sharedServicesService: SharedServicesService, ) { }

  ngOnInit() {
    this.queryParams = EntityConstants.queryParams;
    this.populateListwithComplianceSources();
  }
  populateListwithComplianceSources() {
    if (EntityConstants && EntityConstants.overview.results && EntityConstants.overview.results.length > 0 && EntityConstants.overview.results[0].overview) {
      for (const key in EntityConstants.overview.results[0].overview) {
        if (EntityConstants.overview.results[0].overview.hasOwnProperty(key) && key !== 'comapnyInfo') {
          const value = EntityConstants.overview.results[0].overview[key];
          var splittedsource_screenshot = value.source_screenshot ? value.source_screenshot.split("_") : "";
          this.sourceWithBSTRegistry.push({
            sourceName: key,
            SourceValue: value,
            checked: false,
            splitSourceScreenshot: splittedsource_screenshot ? splittedsource_screenshot[1] + "_" + splittedsource_screenshot[3] + "_" + splittedsource_screenshot[4] : "",
            showHideScreenIcon: value.source_file_url ? true : false,
            disable: (value && value['bst:registryURI']) ? false : true,
            row_spinner: false,
            addtopageloader: false,
            showHideAddtoPage: value.isAddToPage ? true : false,
            downloadLink: value.source_file_url ? value.source_file_url : '',
            uploadedFileName: value.source_file_name ? value.source_file_name : '',
            showUploadIcon: value.source_file_name ? false : true,
            docid: value.docId ? value.docId : ""
          });
        }
      }
    }
  }
  /*
         * @purpose: submit uploadDocument 
         * @created: 20 sep 2017
         * @params: file(object)
         * @returns: no
         * @author: swathi
         */
  uploadDocumentOnSubmit = function (file, event) {
    if (event.type && event.type == 'change') {
      if (file) {
        var ext = file.name.split('.').pop().toLowerCase();
        if ($.inArray(ext, TopPanelConstants.uploadDocTypeList ? TopPanelConstants.uploadDocTypeList : ['doc', 'png', 'jpg', 'rtf', 'jpeg', 'docx', 'ppt', 'gif', 'pdf', 'txt', 'csv', 'json', 'xls', 'xlsx']) == -1) {
        this._sharedServicesService.showFlashMessage('The uploaded file must be of ' + (TopPanelConstants.uploadDocTypeList ? TopPanelConstants.uploadDocTypeList : "'doc','png','jpg','rtf','jpeg','docx','ppt','gif','pdf','txt','csv','json','xls','xlsx'"), 'warning');
           //HostPathService.FlashErrorMessage('ERROR', 'The uploaded file must be of ' + ($rootScope.uploadDocTypeList ? $rootScope.uploadDocTypeList : "'doc','png','jpg','rtf','jpeg','docx','ppt','gif','pdf','txt','csv','json','xls','xlsx'"));
          return;
        } else if (file.size > (TopPanelConstants.maxFileSize ? TopPanelConstants.maxFileSize : 20480000)) {//checking file size
          this._sharedServicesService.showFlashMessage('The file size exceeds the limit allowed ' + (TopPanelConstants.maxFileSize ? TopPanelConstants.maxFile_size : '(20MB)'), 'warning');
         //HostPathService.FlashErrorMessage('The file size exceeds the limit allowed ' + ($rootScope.maxFileSize ? $rootScope.maxFile_size : '(20MB)', file.name));/*jshint ignore:line*/
          return;
        }
        else {
          if ($(".custom-modal.upload-media-modal").hasClass("fromScreenShot")) {
            this.addMediaPreloader = true;
            let params = {
              "token": AppConstants.Ehubui_token,
              "fileTitle": this.uploadDocumentFileTitle ? this.uploadDocumentFileTitle : file.name.split('.')[0],
              "entityId": TopPanelConstants.uploadFromScreenShotPopupUploadIcon.value ? TopPanelConstants.uploadFromScreenShotPopupUploadIcon.value.SourceValue.identifier : "",
              "sourceName": TopPanelConstants.uploadFromScreenShotPopupUploadIcon.value ? TopPanelConstants.uploadFromScreenShotPopupUploadIcon.value.sourceName : "",
              "docFlag": 4,
              "isAddToPage": false
            };
            var data = file;
            this.topPanelApiService.uploadDocumentFromUploadIconInScreenshot(params, data).subscribe(((response) => {
              response.fileName = file.name;
              this.NgbActiveModal.close('close');
              this.addMediaPreloader = false;
              this.sourceWithBSTRegistry[TopPanelConstants.uploadFromScreenShotPopupUploadIcon.rowIndex].downloadLink = response.downloadLink;
              this.sourceWithBSTRegistry[TopPanelConstants.uploadFromScreenShotPopupUploadIcon.rowIndex].uploadedFileName = response.fileName;
              this.sourceWithBSTRegistry[TopPanelConstants.uploadFromScreenShotPopupUploadIcon.rowIndex].docid = response.docId;
              this.sourceWithBSTRegistry[TopPanelConstants.uploadFromScreenShotPopupUploadIcon.rowIndex].showHideScreenIcon = true;
              this.sourceWithBSTRegistry[TopPanelConstants.uploadFromScreenShotPopupUploadIcon.rowIndex].showUploadIcon = false;
              this.sourceWithBSTRegistry[TopPanelConstants.uploadFromScreenShotPopupUploadIcon.rowIndex].disable = false;
              this.saveAddtoPage(params);
            }),((err)=>{
              this.NgbActiveModal.close('close');
              this.addMediaPreloader = false;
              this._sharedServicesService.showFlashMessage('file format not supported', 'warning');
              //HostPathService.FlashErrorMessage('ERROR', 'file format not supported');
            }));

          } else {
            //this.addMediaPreloader = true;
            var params = {
              "token": AppConstants.Ehubui_token,
              "fileTitle": this.uploadDocumentFileTitle,
              "remarks": this.uploadDocumentRemarks,
              "entityId": EntityConstants.queryParams.query,
              "entityName": EntityConstants.complianceObject["vcard:organization-name"].value
            };
            if (TopPanelConstants.entityselection) {
              params['docSection'] = TopPanelConstants.entityselection;
            }
            var data = file
            if (ext == "png") {
              if (params['docSection']) {
                params['docFlag'] = 6;
              }
              else {
                params['docFlag'] = 6;
                params['docSection'] = "";
              }
            }
            this.topPanelApiService.uploadDocument(params, data).subscribe(()=> {
              this.addMediaPreloader = false;
              this.NgbActiveModal.close('close');  
            }, function (e) {
              this.addMediaPreloader = false;
              this.NgbActiveModal.close('close');
              this._sharedServicesService.showFlashMessage('file format not supported', 'warning');
              //HostPathService.FlashErrorMessage('ERROR', 'file format not supported');
            });
          }
        }
      } else {
        this._sharedServicesService.showFlashMessage('file format not supported', 'warning');
        //HostPathService.FlashErrorMessage('ERROR', 'file format not supported');
      }
    }
  };
  /*
			 * @purpose: close uploadDocument
			 * @created: 20 sep 2017
			 * @params: null
			 * @returns: no
			 * @author: swathi
			 */
      closeUploadDocument() {
        this.NgbActiveModal.close('close');
    };
   saveAddtoPage(params){
    var addtopagedata = [{
      "entityId": this.queryParams['query'],
      "isAddToPage": false,
      "sourceName": params.sourceName
    }];
    this.topPanelApiService.saveSourcesAddToPage(addtopagedata).subscribe(()=>{

      this.sourceWithBSTRegistry[TopPanelConstants.uploadFromScreenShotPopupUploadIcon.rowIndex].showHideAddtoPage = false;
      // $scope.sourceWithBSTRegistry[TopPanelApiService.uploadFromScreenShotPopupUploadIcon.rowIndex].showHideScreenIcon = false;
      this._sharedServicesService.sourceEvidence.next(this.sourceWithBSTRegistry);
    })
  }
}
