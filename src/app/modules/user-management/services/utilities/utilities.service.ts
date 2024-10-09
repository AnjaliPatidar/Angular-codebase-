import { Inject, Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { GroupsService } from '../groups.service';
import { ObserverService } from '../observer.service';
import { WINDOW } from '../../../../core/tokens/window';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor(  
    private _snackBar: MatSnackBar,
    private groupsService:GroupsService,
    private observerService :ObserverService,
    @Inject(WINDOW) private readonly window: Window
  ) { }
  openSnackBar(status,message){
    let panelClass;
    if(status == 'success'){
        panelClass = "success-stackbar"
    }
    else if(status == "error"){
      panelClass = "error-stackbar"
    }
    this._snackBar.open(message, "", {
      duration: 3000,
      verticalPosition: 'top',
      panelClass:panelClass
    });
    
  }
  dataURItoBlob(dataURI) {
    const byteString = this.window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }
  blobToFile(imageBlob, imageName) {
    return new File([imageBlob], imageName, { type: 'image/jpeg' });
  }

  getAssignedUserCount(params){
    this.groupsService.getUserStatusOfGroup(params).then((res: any) => {
      let numbers: Array<any> = Object.values(res)
         let sum = 0;
         for (var i = 0; i < numbers.length; i++) {
           sum += numbers[i]
         }
         this.observerService.setAssignedUserCount(sum);
         
        //  this.assignUsersCount=sum;
       }).catch((error) => {
         throw error
       })
  }
  convertBase64ToJpeg(base64) {
    const date = new Date().valueOf();
    let text = '';
    const possibleText = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      text += possibleText.charAt(Math.floor(Math.random() * possibleText.length));
    }

    const imageName = date + '.' + text + '.jpeg';
    const imageBlob = this.dataURItoBlob(base64);
    return this.blobToFile(imageBlob, imageName);
  }
  // openConfirmDialog(message){
  //   return this.confirmDialog.open(UserDeleteComponent, {
  //     panelClass: ['user-popover', 'custom-scroll-wrapper', 'delete-modal'],
  //     data: { message: message }
  //   });
  // }
}
