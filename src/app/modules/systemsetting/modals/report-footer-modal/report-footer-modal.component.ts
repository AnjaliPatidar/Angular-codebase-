import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-report-footer-modal',
  templateUrl: './report-footer-modal.component.html',
  styleUrls: ['./report-footer-modal.component.scss']
})
export class ReportFooterModalComponent implements OnInit {

  textLength = 0;
  MAX_LENGTH = 8000;
  remainingLength;
  fullText = '';
  quilConfig;

  editorOptions = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],

      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],

      [{ 'size': ['small', false, 'large', 'huge'] }],

      [{ 'font': [] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],

      ['clean'],

      ['link', 'image']
    ]
  };

  editorStyle = { 'height': '210px' };
  @Input() public settingId;
  @Input() public nameSection;
  @Input() public selectedValue;
  constructor(public modal: NgbActiveModal) { }

  ngOnInit() {
    this.fullText = this.selectedValue
  }

  closeFooterModal() {
    this.modal.dismiss();
  }

  textChanged($event) {
    if ($event.editor.getLength() > this.MAX_LENGTH) {
      $event.editor.deleteText(this.MAX_LENGTH, $event.editor.getLength());
    }
    this.textLength = $event.editor.getLength() - 1;
    this.remainingLength = this.MAX_LENGTH - this.textLength;
    let editorContent = null;
    if ($event && $event.html) {
      editorContent = $event.html;
      // var regexAnchorTag = /(<a\s.*?href=["']([^"']*?[^"']*?)[^>]*)(.?style="[a-zA-Z0-9:;\.\s\(\)\-\,]*")>(.*?)(<\/a>)/g;
      // var regexSpanTag = /(<span) (style="color: black;">)(.*)(<\/span>)/g;
      // editorContent = editorContent.replace(regexAnchorTag, '$1>$4</a>');
      // editorContent = editorContent.replace(regexSpanTag, '$3');
    } else {
      this.fullText = null
    }
    this.fullText = editorContent
    // this.selectedValue = this.fullText;
  }

  onEditorCreated(quill) {
    this.quilConfig = quill;
    quill.clipboard.addMatcher (Node.ELEMENT_NODE, function (node, delta) {
      var plaintext = $ (node).text ();
      const Quill = require('quill');
      var Delta = Quill.import('delta');
      return new Delta().insert (plaintext);
    });
    // this.quilConfig.clipboard.addMatcher(Node.ELEMENT_NODE, function (node, delta) {
    //   delta.forEach(e => {
    //     if (e.attributes) {
    //       e.attributes.color = 'black';
    //     }
    //   });
    //   return delta;
    // });
  }
  saveReportFooter() {
    var uploadData = {
      settingId: this.settingId ? this.settingId : 0,
      systemSettingType: "GENERAL_SETTING",
      name: this.nameSection,
      section: "Branding",
      selectedValue: this.fullText,
      defaultValue: ""
    };

    this.modal.close(uploadData);

  }

}
