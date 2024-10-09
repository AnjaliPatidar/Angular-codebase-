import { Component, Inject, OnInit } from '@angular/core';
import { EntityConstants } from '../../../../modules/entity/constants/entity-company-constant';
import {SharedServicesService } from '../../../../shared-services/shared-services.service';
import {TopPanelConstants } from '../../../../modules/entity/constants/top-panel-constants';
import {TopPanelApiService} from '../../../../modules/entity/services/top-panel-api.service';
import {AddMediaModalComponent} from '../../../../modules/entity/modals/add-media-modal/add-media-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WINDOW } from '../../../../core/tokens/window';

@Component({
  selector: 'app-entitysourceevidence',
  templateUrl: './entitysourceevidence.component.html',
  styleUrls: ['./entitysourceevidence.component.scss']
})
export class EntitysourceevidenceComponent implements OnInit {
  public sourceWithBSTRegistry: any = [];
  public overViewDataLinksUrls: any = {};
  public getMultiScreenShotSelected: any = [];
  public isFromAddToPage = false;
  public mediaLoader :boolean = false;
  public evidenceReportAddTopage = [];

  constructor(
    public sharedServicesService:SharedServicesService,
    public topPanelApiService:TopPanelApiService,
    public modalService: NgbModal,
    @Inject(WINDOW) private readonly window: Window
  ) {
      this.sharedServicesService.sourceEvidenceObservable.subscribe((response:any)=>{
        if(response){
          this.sourceWithBSTRegistry= response;
        }
      });
     }

  ngOnInit() {
    this.populateListwithComplianceSources();
  }
  populateListwithComplianceSources() {
    if (EntityConstants && EntityConstants.overview.results && EntityConstants.overview.results.length > 0 && EntityConstants.overview.results[0].overview) {
      for (const key in EntityConstants.overview.results[0].overview) {
        if (EntityConstants.overview.results[0].overview.hasOwnProperty(key) && key !== 'comapnyInfo') {
          const value = EntityConstants.overview.results[0].overview[key];
          var splittedsource_screenshot = value.source_screenshot ? value.source_screenshot.split("_") : "";
          this.overViewDataLinksUrls[key] = value;
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
  /* @purpose: To setMultiCheckScreenshot
	* @created: 7 June 2019
	* @params: data
		* @returns null
	* @author: Amarjith*/
  setMultiCheckScreenshot(data, index) {
    this.sourceWithBSTRegistry[index].checked = !this.sourceWithBSTRegistry[index].checked;
    data.checked = this.sourceWithBSTRegistry[index].checked;
    if (data.checked) {
      this.getMultiScreenShotSelected.push(data);
      this.checkEvidenceButtonShowHide(this.getMultiScreenShotSelected);
    } else {
      var findSrcIndex = this.getMultiScreenShotSelected.findIndex(function (d) {
        return d.sourceName == data.sourceName;
      });
      if (findSrcIndex !== -1) {
        this.getMultiScreenShotSelected.splice(findSrcIndex, 1);
      }
      if (this.getMultiScreenShotSelected.length === 0) {
        this.isFromAddToPage = false;
      }
      this.checkEvidenceButtonShowHide(this.getMultiScreenShotSelected);
    }
  }
  /* @purpose: To check Evidenc eButton Show Hide
* @created: 12 June 2019
* @params: Arrayvalue(array)
* @returns null
* @author: Amritesh*/
  checkEvidenceButtonShowHide(Arrayvalue) {
    if (Arrayvalue.length > 0) {
      if (!Arrayvalue.some(this.checkScreen_urlExistence)) {
        this.isFromAddToPage = true;
      } else {
        this.isFromAddToPage = false;
      }
    }
  }
  /* @purpose: To check whether Screen_url exist or not
		* @created: 12 June 2019
		* @params: data(obj)
	    * @returns null
		* @author: Amritesh*/
	checkScreen_urlExistence(data) {
		return data.SourceValue.source_screenshot === undefined;
  }
  /* @purpose: For multiple add to page
	* @created: 12 June 2019
	* @params: none
		* @returns null
	* @author: Amritesh*/
	 multipleAddToPage(){
		this.getMultiScreenShotSelected.forEach( (values, index)=> {
			this.addToPage(values, index);
		});
		this.getMultiScreenShotSelected = [];
		this.isFromAddToPage = false;
  }
  	/* @purpose:To take Image on Icon click
* @created: 7 June 2019
* @params: type(object)
 * @returns none.
* @author: Amritesh*/
  addToPage(SourceDataObj, fromShareholderModal) {
    return new Promise((resolve, reject) => {
      var file_ext_invalid = false;
      var file_ext_type = '';
      var index_of_point;
      var split_file_type;
      if (!SourceDataObj.uploadedFileName) {
        index_of_point = SourceDataObj.SourceValue.source_screenshot.lastIndexOf('.');
        split_file_type = SourceDataObj.SourceValue.source_screenshot.slice((index_of_point + 1), SourceDataObj.SourceValue.source_screenshot.length);
      } else if (SourceDataObj.uploadedFileName) {
        index_of_point = SourceDataObj.uploadedFileName.lastIndexOf('.');
        split_file_type = SourceDataObj.uploadedFileName.slice((index_of_point + 1), SourceDataObj.uploadedFileName.length);
      }
      if (split_file_type && !TopPanelConstants.uploadDocTypeList.includes(split_file_type)) {
        // HostPathService.FlashErrorMessage('ERROR', (split_file_type.toUpperCase() + ' is not supported, Please check System Settings'));
        return;
      }
      var data;
      this.evidenceReportAddTopage.push(SourceDataObj.SourceValue)
      TopPanelConstants.getEvidenceArray = this.evidenceReportAddTopage;
      var current_srcIndex = this.sourceWithBSTRegistry.findIndex(function (d) {
        return d.sourceName && d.sourceName === SourceDataObj.sourceName
      });
      if (SourceDataObj.downloadLink) {
        data = {
          'docID': SourceDataObj.docid,
          "fileTitle": SourceDataObj.uploadedFileName,
          "remarks": '',
          "docFlag": 6,
          "entityId": TopPanelConstants.utilityObject.rootComponentData.identifier,
          "entitySource": SourceDataObj.sourceName
        }
      } else {
        data = {
          "url": encodeURIComponent(SourceDataObj.SourceValue.source_screenshot),
          "fileTitle": SourceDataObj.sourceName,
          "remarks": '',
          "docFlag": 6,
          "entityId": TopPanelConstants.utilityObject.rootComponentData.identifier,
          "entityName": EntityConstants.overview.results[0].overview.comapnyInfo['vcard:organization-name'].value,
          "entitySource": SourceDataObj.sourceName
        }
      }
      var addtopagedata = [{
        "entityId": TopPanelConstants.utilityObject.rootComponentData.identifier,
        "isAddToPage": true,
        "sourceName": SourceDataObj.sourceName
      }];
      TopPanelConstants.uploadFromScreenShotPopupUploadIcon.value = SourceDataObj;
      TopPanelConstants.uploadFromScreenShotPopupUploadIcon.rowIndex = current_srcIndex;
      if (current_srcIndex !== -1) {
        if (!this.sourceWithBSTRegistry[current_srcIndex].addtopageloader) {
          this.sourceWithBSTRegistry[current_srcIndex].addtopageloader = true;
        }
      }
      setTimeout(() => {
        this.topPanelApiService.saveSourcesAddToPage(addtopagedata).subscribe(((res) => {

          this.topPanelApiService.uploadDocumentByScreenShotURLData(data).subscribe(((response) => {

            if (current_srcIndex !== -1) {
              this.sourceWithBSTRegistry[current_srcIndex].addtopageloader = false;
              if (!fromShareholderModal) {
                this.sourceWithBSTRegistry[current_srcIndex].showHideAddtoPage = true;
              }
            }
            if(EntityConstants.overview.results[0].overview[SourceDataObj.sourceName]){
              EntityConstants.overview.results[0].overview[SourceDataObj.sourceName].isAddToPage = true;
            }
            if (fromShareholderModal) {
              return "true";
            }
            resolve(true);
          }), ((err) => {
            resolve(true);
            // HostPathService.FlashErrorMessage('ERROR', 'Send valid data');
          }));
        }), ((err) => {
          resolve(true);
        }))
      }, 100);
    });
  }
  	/* @purpose:To Call API take screenshot	on click of icon /single
	* @created: 7 June 2019
	* @params: type(object)
		* @returns none.
	* @author: Amritesh*/
	downloadEvidenceSourceScreenshot(value) {
		var name = value['uploadedFileName'] ? value['uploadedFileName'] : value['sourceName'] + ".png";
		var url = value['SourceValue'].source_file_url ? value['SourceValue'].source_file_url : value['SourceValue'].source_screenshot;
		value.docid ? this.downloadDocFromScreenShot(value.docid, value['uploadedFileName'], value['uploadedFileName'].split('.')[1]) : this.forceDownloadImg(url, name);
  }
  /* @purpose:function to downlod the images with url
	* @created: 12 June 2019
	* @params: type(object)
	* @returns none.
	* @author: Amritesh*/
	 forceDownloadImg(url, fileName) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.responseType = "blob";
    const that = this;
		xhr.onload = function () {
			var urlCreator = (that.window as any).URL;
			var imageUrl = urlCreator.createObjectURL(this.response);
			var tag = document.createElement('a');
			tag.href = imageUrl;
			tag.download = fileName;
			document.body.appendChild(tag);
			tag.click();
			document.body.removeChild(tag);
		}
		xhr.send();
  }
  /*
		 * @purpose: download it from source screen shot popup
		 * @created: 10 july 2019
		 * @params: null
		 * @return: no
		 * @author: Amritesh
		 */
 downloadDocFromScreenShot(docId, fileTitle, fileType) {
		this.mediaLoader = true;
		var params = {
			docId: docId
		};
		this.sharedServicesService.downloadDocument(params).subscribe( ((response:any) =>{
      this.mediaLoader = false;
			var blob = new Blob([response.data], {
				type: "application/" + fileType,
      });
      if (this.window.navigator && this.window.navigator.msSaveOrOpenBlob) {
        this.window.navigator.msSaveOrOpenBlob(blob, docId);
      } else {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = docId;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

		}));
	};

  	/*
		* @purpose: open add media modal
		* @created: 5 july 2019
		* @params: null
		* @return: no
		* @author: Amritesh
		*/
	 sourceLinkdUploadFile = function (value, index) {
		TopPanelConstants.uploadFromScreenShotPopupUploadIcon.value = value;
		TopPanelConstants.uploadFromScreenShotPopupUploadIcon.rowIndex = index;
    const AddMediaModalRef = this.modalService.open(AddMediaModalComponent,
			{
        windowClass: 'custom-modal upload-media-modal fromScreenShot',
        backdropClass: 'custom-backdrop',
        backdrop: 'static',
        centered: true
			});
		AddMediaModalRef.result.then((response) => {
		});
	};

  public trackBySourceName(_, item): string {
    return item.sourceName;
  }
}
