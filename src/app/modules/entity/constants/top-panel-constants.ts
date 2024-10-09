let utilityObject :any = {
  rootComponentData: {}
};
let getEvidenceArray :any[] =[];
let maxFileSize :any;
let maxFile_size:any;
let  uploadFromScreenShotPopupUploadIcon :any = { 'value': {}, 'rowIndex': '' };
export const TopPanelConstants = {
  uploadFromScreenShotPopupUploadIcon: uploadFromScreenShotPopupUploadIcon,
   entityselection : '',
   isUploadFromEntitySection : false,
   clipBoardObject : { modal_postion: { 'top': '', 'left': '' }, 'file_wraper': '' },
   uploadDocTypeList : [],
   maxFileSize:maxFileSize,
   maxFile_size:maxFile_size,
   isFromEntitySection : false,
   showMyEntityClipboard :false,
   getEvidenceArray: getEvidenceArray,
   utilityObject:utilityObject,
   ehubObject :JSON.parse(window.localStorage.getItem('ehubObject')),
   sourceListData: []
}
