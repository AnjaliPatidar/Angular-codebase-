import { Component, OnInit, Input } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-logomodal',
  templateUrl: './logomodal.component.html',
  styleUrls: ['./logomodal.component.scss']
})
export class LogomodalComponent implements OnInit {
  public uploader:FileUploader;
  public uploadme;
  @Input() public settingId;
  @Input() public nameSection;

  constructor(public modal :NgbActiveModal) {
    this.uploader = new FileUploader({
      url: 'abcL',
      disableMultipart: true, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
      formatDataFunctionIsAsync: true,
      formatDataFunction: async (item) => {
        return new Promise( (resolve, reject) => {
          resolve({
            name: item._file.name,
            length: item._file.size,
            contentType: item._file.type,
            date: new Date()
          });
        });
      }
    });
  }

  ngOnInit() {
  }
   onFileSelected(event){
     var uploadData = {
      customerLogoImage : event[0],
      settingId:this.settingId ? this.settingId : 0,
      systemSettingType:"GENERAL_SETTING",
      name:this.nameSection,
      section:"Branding",
      selectedValue: event[0],
      defaultValue: event[0]
    };

      var file:File = event[0];
      var myReader:FileReader = new FileReader();
    var image :any = ''
      myReader.onloadend = (e) => {
        image = myReader.result;
        uploadData.customerLogoImage = image.split(',')[1],
        uploadData.selectedValue =  image.split(',')[1],
        uploadData.defaultValue =image.split(',')[1],
        this.modal.close(uploadData);

      }
      myReader.readAsDataURL(file);
    }

}
