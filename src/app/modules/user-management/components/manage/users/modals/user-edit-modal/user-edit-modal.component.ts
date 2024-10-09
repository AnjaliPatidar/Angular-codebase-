import { Component, Inject, ChangeDetectionStrategy, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LyTheme2, Platform } from '@alyle/ui';
import { ImgCropperConfig, ImgCropperEvent, LyResizingCroppingImages } from '@alyle/ui/resizing-cropping-images';
import { styles } from './user-edit.styles'
import { UserService } from '@app/modules/user-management/services/user.service';
import { UtilitiesService } from '@app/modules/user-management/services/utilities/utilities.service';
// const styles = ({
//   actions: {
//     display: 'flex'
//   },
//   cropping: {
//     width: "800px",
//     height: "400px"
//   },
//   flex: {
//     flex: 1
//   },
//   range: {sh
//     textAlign: 'center',
//     maxWidth: '400px',
//     margin: '14px'
//   }
// });
@Component({
  selector: 'app-user-edit-modal',
  templateUrl: './user-edit-modal.component.html',
  styleUrls: ['./user-edit-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class UserEditModalComponent implements AfterViewInit {
  public fileObject: any;
  classes = this.theme.addStyleSheet(styles);
  croppedImage?: string;
  result: string;
  scale: number;
  @ViewChild(LyResizingCroppingImages, { static: false }) cropper: LyResizingCroppingImages;
  myConfig: ImgCropperConfig = {
    autoCrop: true, // Default `false`
    width: 250, // Default `250`
    height: 250, // Default `200`
    fill: '#ff2997', // Default transparent if type = png else #000
    type: 'image/png' // Or you can also use `image/jpeg`
  };

  constructor(public dialogRef: MatDialogRef<UserEditModalComponent>,
    private theme: LyTheme2,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public utilitiesService: UtilitiesService,
    public userService: UserService) { }
  ngAfterViewInit() {
    if ( Platform && Platform.isBrowser) {
      const config = {
        scale: 0.745864772531767,
        position: {
          x: 176.380608078103,
          y: 176.26357452128866
        }
      };
      if(this.cropper && this.data){
        this.cropper.setImageUrl(
          this.data,
          () => {
            if(config && config.scale){
              this.cropper.setScale(config.scale, true);
            }
            if(config && config.scale){
              this.cropper.updatePosition(config.position.x, config.position.y);
            }
          }
        );
      }
    }

  }

  formatLabel(value) {
    if (value >= 0.1) {
      return Math.round(value * 100) + '%';
    }
    return value;
  }
  onCropped(e: ImgCropperEvent) {
    this.fileObject = e;
    this.fileObject.position = '';
    if(e.dataURL){
      this.croppedImage = e.dataURL;
    }
  }

  uploadFile() {
    if(this.fileObject && this.fileObject.dataURL ){
      let BlobObj = this.utilitiesService.dataURItoBlob(this.fileObject.dataURL.split(",")[1]);
      if(BlobObj){
        let fileObj = this.utilitiesService.blobToFile(BlobObj, 'profile')
        this.dialogRef.close(fileObj);
      }
    }
  }
}
