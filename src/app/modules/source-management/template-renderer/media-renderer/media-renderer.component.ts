import { Component, OnInit } from '@angular/core';
import { SourceManagementService } from '../../source-management.service';


@Component({
  selector: 'app-media-renderer',
  templateUrl: './media-renderer.component.html',
  styleUrls: ['./media-renderer.component.scss']
})
export class MediaRendererComponent implements OnInit {
  public popoverHeaderData:any = {};
  public popoverMediaData:any = [];
  public rowDataResponse:any = [];
  public mediaListForHeader:any = [];
  public mediaListForHeader1:any = [];
  public checklist:any = [];
  public editData: any;
  public allSelected:boolean;
  public allMedias:any;
  public selectedMedia:any;
  public finalSelectedMediaList:any = [];
  public classificationList:any = [];
  public mapMediaHash = {
        Doc: 'file-word-o text-dodger-blue2',
        Excel: 'file-excel-o text-dark-pastal-green',
        PPT: 'file-powerpoint-o text-coral-red',
        PDF: 'file-pdf-o text-coral-red',
        Movies: 'file-video-o text-deep-lilac',
        Audio: 'file-audio-o text-tealish-blue',
        Screenshot :'crop',
        All:"files-o"
    };
  agInit(params:any,event): void {
    this.popoverHeaderData = {};
    this.popoverMediaData = [];
    this.popoverMediaData.push(params);
    let selectedMedias = params.value[0].sourceMedia;
    // this.selectedMedia = $.extend(true, [], params.value[0].sourceMedia);
    this.selectedMedia = JSON.parse(JSON.stringify(params.value[0].sourceMedia));
    this.allMedias = params.value[1];


    let toSelectAllMedia = selectedMedias.some(media => media.mediaName === 'All');
    if(params.value){
      this.rowDataResponse = this.popoverMediaData[0].value[0];
      this.classificationList = this.popoverMediaData[0].value[0].classifications;

      this.popoverHeaderData = {
        company_name : this.popoverMediaData[0].data.source,
        field_name : this.popoverMediaData[0].colDef.headerName
      }

      // this.mediaListForHeader = $.extend(true, [], this.popoverMediaData[0].value[1].sort((a,b) => (a.mediaName > b.mediaName) ? 1 : ((b.mediaName > a.mediaName) ? -1 : 0)));
      this.mediaListForHeader =JSON.parse(JSON.stringify(this.popoverMediaData[0].value[1].sort((a,b) => (a.mediaName > b.mediaName) ? 1 : ((b.mediaName > a.mediaName) ? -1 : 0))));
      this.mediaListForHeader = this.mediaListForHeader
      .filter(obj =>{
        return obj.mediaName !== 'All';
      })
      .map((obj) => {
                if(toSelectAllMedia){
                  obj['isSelected'] = true;
                  this.allSelected = true;
                }else{
                  let isInSelectedMedias = selectedMedias.some(mObj => {
                    return JSON.stringify(mObj) === JSON.stringify(obj);
                  })

                  if(isInSelectedMedias){
                    obj['isSelected'] = true;
                  }else{
                    obj['isSelected'] = false;
                  }
                }
               return obj;
      }).map((val,i,arr)=>{
          if(arr.every(val => val.isSelected)){
            this.allSelected = true;
          };
          return val;
      });


    }

    // this.mediaListForHeader1 = $.extend(true, [], this.mediaListForHeader)
    this.mediaListForHeader1 = JSON.parse(JSON.stringify(this.mediaListForHeader));

  };

  setInitialValues(){
    this.finalSelectedMediaList = [];
  }
  constructor(private _sourceManagementService: SourceManagementService ) { }

  ngOnInit() {

  }

  checkUncheckAll() {
    for (var i = 0; i < this.mediaListForHeader.length; i++) {
      this.mediaListForHeader[i].isSelected = this.allSelected;
    }
  }


  isAllSelected() {
    this.allSelected = this.mediaListForHeader.every(function(item:any) {
        return item.isSelected == true;
      })
  }

  saveMediaSource(e){


      // let editedMediaList = $.extend(true, [], this.mediaListForHeader);
      let editedMediaList =JSON.parse(JSON.stringify(this.mediaListForHeader));
      let selectAll = editedMediaList.every(obj => obj.isSelected);

      if(selectAll){
        editedMediaList = [this.allMedias.find(obj => obj.mediaName === 'All')];
      }else{
        editedMediaList = editedMediaList.map(obj => {
          if(obj.isSelected)
          return {mediaId: obj.mediaId, mediaName: obj.mediaName}
        }).filter(Boolean);
      }


      this.editData = this.rowDataResponse;

      this.editData.classifications[0].subClassifications =  this.editData.classifications[0].subClassifications.map(subClas=>{
        subClas.dataAttributes = [];
        return subClas;
      });
    let editData = {
      "sourceName": this.editData.sourceName,
      "sourceUrl": this.editData.sourceUrl,
      "sourceDisplayName": this.editData.sourceName,
      "entityId": this.editData.entityId,
      "sourceId": this.editData.sourceId,
      "sourceCreatedDate": this.editData.sourceCreatedDate,
      "deleteMedia": this.editData.deleteMedia,
      "sourceType": '',
      "sourceDomain": [],
      "sourceIndustry":[],
      "sourceJurisdiction":  [],
      "classifications": [this.editData.classifications[0]],
      "sourceMedia": editedMediaList,
    };

      this._sourceManagementService.updateScource(editData).subscribe((response)=>{

        // this.mediaListForHeader1 = $.extend(true, [], this.mediaListForHeader);
        this.mediaListForHeader1 = JSON.parse(JSON.stringify(this.mediaListForHeader));
      },
      (err) => {

      });
    };

    resetMediaSource(e){
    //
    //

      this.mediaListForHeader = this.mediaListForHeader.map(obj => {
              if(this.selectedMedia.some(iObj => {
                return iObj.mediaId === obj.mediaId;
              })){
                obj.isSelected = true;
              }else{
                obj.isSelected = false;
              };

              return obj;
      });

      if(this.mediaListForHeader.every(obj => {
          return obj.isSelected === true;
      })){
        this.allSelected = true;
      }else{
        this.allSelected = false;
      }

      //

    }

    public trackByMediaName(_, item): string {
      return item.mediaName;
    }

}
