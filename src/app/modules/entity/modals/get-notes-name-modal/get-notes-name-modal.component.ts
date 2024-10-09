import { Component, OnInit } from '@angular/core';
import { TopPanelApiService } from '../../services/top-panel-api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-get-notes-name-modal',
  templateUrl: './get-notes-name-modal.component.html',
  styleUrls: ['./get-notes-name-modal.component.sass']
})
export class GetNotesNameModalComponent implements OnInit {
public documentId;
public doc;
public addMediaPreloader = false;
public getTitle= '';
//public doc.title ;
  constructor(public topPanelApiService: TopPanelApiService,
    public NgbActiveModal:NgbActiveModal,
    ) { }

  ngOnInit() {
  }
/*
     * @purpose: open sticky
     * @created: 30 mar 2018
     * @returns: no
     * @author: varsha
     */
   // var getNotesuibModalInstance;
    confirmDocument(status) {
      let stickyData = {
      status : status,
      getTitle : this.getTitle
      }
      this.NgbActiveModal.close(stickyData);
    }
//       if (status != 'close') {

//             var getTitle = $('#getTitle').val();
//             if(sticky){
//                 getTitle =getTitle + ".snt";
//              }
//             if (getTitle == '' || getTitle == undefined) {
//                // HostPathService.FlashErrorMessage('ERROR', 'Please enter title');
//             } else {
//                 this.addNewSticky(getTitle);
//             }
//         }else if(status == 'close'){

//         }
//     };
//      /*
//      * @purpose: Upload sticky notes
//      * @created: 30 mar 2018
//      * @returns: no
//      * @author: varsha
//      */

//     addNewSticky(getTitle) {
//       $('#documentTextEntity').val('').empty();

//       var myBlob = new Blob([' '], {
//           type: "text/plain"
//       });
//       var file = new File([myBlob], getTitle);
//       //this.loadDocument = true;
//       this.uploadStickyNotes(file, getTitle)
//       // .subscribe((res:any)=>{
//       //     var stickyNotes = document.getElementById('stickyNotesEntity');
//       //     $('#stickyNotesEntity').css('display', 'block');
//       //     $('#documentTitleEntitySec').val(getTitle);
//       //     if(getTitle.indexOf('.snt') !== -1){
//       //     $('#documentTitleEntitySec').val(getTitle.split('.snt')[0]);
//       //     }
//       //     var  isFromEntitySection = TopPanelConstants.isFromEntitySection;
//       //     if(!isFromEntitySection){
//       //         stickyNotes.style.left = "-360px";
//       //         stickyNotes.style.top = "25px";
//       //     }else{
//       //         stickyNotes.style.left = "100px";
//       //         stickyNotes.style.top = "110px";
//       //     }
//       // }).catch(function(err){
//       // });
//       this.dragElement(document.getElementById(("stickyNotesEntity")));
//   }
//   /*
//      * @purpose: upload sticky notes
//      * @created: 09 mar 2018
//      * @params: file(object)
//      * @returns: no
//      * @author: swathi
//      */
//     uploadStickyNotes(file, name) {
//       var params = {
//         "token": AppConstants.Ehubui_token,
//         "fileTitle": name,
//         "remarks": "",
//         "docFlag": 5,
//         "docName": name,
//         "entityId": EntityConstants.queryParams.query,
//         "entityName": EntityConstants.complianceObject["vcard:organization-name"].value,
//         "entitySource": ""
//       };
//       var data = file;
//       if (TopPanelConstants.entityselection) {
//         params['docSection'] = TopPanelConstants.entityselection;
//       }

//       //return new Promise(function (resolve, reject) {
//         this.topPanelApiService.uploadDocument(params, data).subscribe( (response :any)=> {
//           this.documentId = response.docId;
//           this.doc = response;
//           this.doc.title = params.fileTitle;
//           if(response){
//             var stickyNotes = document.getElementById('stickyNotesEntity');
//             $('#stickyNotesEntity').css('display', 'block');
//             $('#documentTitleEntitySec').val(name);
//             if(name.indexOf('.snt') !== -1){
//             $('#documentTitleEntitySec').val(name.split('.snt')[0]);
//             }
//             var  isFromEntitySection = TopPanelConstants.isFromEntitySection;
//             if(!isFromEntitySection){
//                 stickyNotes.style.left = "-360px";
//                 stickyNotes.style.top = "25px";
//             }else{
//                 stickyNotes.style.left = "100px";
//                 stickyNotes.style.top = "110px";
//             }
//         }
//           //getListOfDocuments();
//           var data =
//           {
//             "subject": "upload sticky",
//             "body": 'New sticky is created',
//             "recipients": [TopPanelConstants.ehubObject.userId]
//           };
//           this.topPanelApiService.postNotification(data).subscribe(() => {
//           }, function () {
// 		       });
//           this.linkToCaseByDefaut(response.docId);
//          // resolve(true);
//         this.NgbActiveModal.close('close');

//         }, function () {
//           this.addMediaPreloader = false;
//           //reject(false);
//           //HostPathService.FlashErrorMessage('ERROR', 'file format not supported');
//         });
//       //});

//     }
//      linkToCaseByDefaut(docId) {
//       // if ($rootScope.actCaseDetail) {
//       //     $scope.linkToCase($rootScope.actCaseDetail.caseId, docId);
//       // }
//   }
//     /* * @purpose: draggable sticky notes *
//     *   @created: 11 apr 2018
//     *   @returns: no
//     *   @author: varsha */

//     dragElement(elmnt) {
//     var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
//     if (document.getElementById(elmnt.id + "header")) {
//         /* if present, the header is where you move the DIV from:*/
//         document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
//     } else {
//         /* otherwise, move the DIV from anywhere inside the DIV:*/
//         elmnt.onmousedown = dragMouseDown;
//     }

//     function dragMouseDown(e) {
//         e = e || window.event;
//         // get the mouse cursor position at startup:
//         pos3 = e.clientX;
//         pos4 = e.clientY;
//         document.onmouseup = closeDragElement;
//         // call a function whenever the cursor moves:
//         document.onmousemove = elementDrag;
//     }

//     function elementDrag(e) {
//         e = e || window.event;
//         // calculate the new cursor position:
//         pos1 = pos3 - e.clientX;
//         pos2 = pos4 - e.clientY;
//         pos3 = e.clientX;
//         pos4 = e.clientY;
//         // set the element's new position:
//         elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
//         elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
//     }

//     function closeDragElement() {
//         /* stop moving when mouse button is released:*/
//         document.onmouseup = null;
//         document.onmousemove = null;
//     }
//  }
//  /*
//      * @purpose: close sticky notes
//      * @created: 30 mar 2018
//      * @returns: no
//      * @author: varsha
//      */
//     closeSticky () {
//         $('#stickyNotesEntity').css('display', 'none');
//         // getListOfDocuments();
//         // if ($scope.documentId) {
//         //     if(!$scope.stickyNoteContent){
//         //         var texts = $scope.stickySavedText;
//         //         $scope.stickyNoteContent = new File([texts], $scope.doc.title);
//         //     }
//         //     var file = $scope.stickyNoteContent;
//         //     if(file){
//         //         updateStickyNotes(file, $scope.documentId);
//         //     }
//         //     $scope.stickyNoteContent = '';
//         // }
//     };

}
