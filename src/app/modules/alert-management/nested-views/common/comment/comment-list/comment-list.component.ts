import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
// import { CommentData } from '../../../types/comment-type';
// import { CommentService } from '../../../services/comment.service';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {

  @Input() isOpen: boolean = false;
  @Output() isOpenChangedComment: EventEmitter<boolean> = new EventEmitter();
  @Output() commentsCount: EventEmitter<number> = new EventEmitter();
  commentData: any = [];
  date: Date = new Date();
  latest_date: any = "";
  searchField: string = "";
  searchTextboxControl = new FormControl();
  fileAttachments: Array<File> = [];
  editedFile: Array<File> = [];

  constructor(public datepipe: DatePipe) { }

  ngOnInit() {
    this.getComments();
    this.commentCountChanged();
    this.latest_date = this.datepipe.transform(this.date, 'yyyy-MM-dd')
  }

  getComments() {
    this.commentData = [
      {
        id: 1,
        user_id: 100,
        user_image: "assets/images/alex.png",
        user_name: "User 01",
        comment: "Ccccc nnnnnnnnn bbbbbbbbbb mmmmmmmmmmm",
        created_time: "",
        last_updated_time: this.date,
        mentioned_users: [],
        isOnEdit: false,
        isOnDelete: false,
        isAttachmentAdded: false,
        fileAttachments: []
      },
      {
        id: 2,
        user_id: 101,
        user_image: "assets/images/user-img.png",
        user_name: "User 02",
        comment: "Aaa nnnn BBBb",
        created_time: "",
        last_updated_time: this.date,
        mentioned_users: [],
        isOnEdit: false,
        isOnDelete: false,
        isAttachmentAdded: false,
        fileAttachments: []
      }
    ];
  }

  close() {
    if (this.isOpen) {
      this.isOpen = false;
      this.isOpenChangedComment.emit(this.isOpen);
    }
  }

  commentCountChanged() {
    this.commentsCount.emit(this.commentData.length);
  }

  clearSearch(event) {
    event.stopPropagation();
    this.searchTextboxControl.patchValue('');
    this.getComments();
  }

  onKey(value: any) {
    this.commentData = this.searchSingle(value);
  }


  searchSingle(value: string) {
    let filter = value.toLowerCase();
    return this.commentData.filter(option =>
      option.comment.toLowerCase().includes(filter) || option.user_name.toLowerCase().includes(filter)
    );
  }


  deleteCommentHandler(deletedComment: any) {
    this.commentData = this.commentData.filter(function (obj) {
      return obj.id !== deletedComment.id;
    });
    this.commentCountChanged();
  }


  newlyAddedCommentHandler(obj: any) {
    let new_id = this.commentData.length + 1;
    const latestComment = {
      id: new_id,
      user_id: 101,
      user_image: "",
      user_name: "User",
      comment: obj.comment,
      created_time: "",
      last_updated_time: new Date(),
      fileAttachments: obj.fileAttachments,
    }
    this.commentData.push(latestComment);
    this.commentCountChanged();
  }

}
