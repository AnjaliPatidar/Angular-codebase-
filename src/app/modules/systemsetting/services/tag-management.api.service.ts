import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '@app/app.constant';
import { Tag } from '../models/tag-management/tag.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TagManagementApiService {
  updatedTag:string;
  currentRowHeight:number = 66;
  constructor(private httpClient: HttpClient) { }

  createTags(tags: Array<Tag>): Promise<Array<Tag>> {
    const apiUrl = AppConstants.Tag_API + 'create';
    return this.httpClient.post<Array<Tag>>(apiUrl, tags).toPromise();
  }

  updateTags(tags: Tag): Promise<Tag> {
    const apiUrl = AppConstants.Tag_API + 'update';
    return this.httpClient.post<Tag>(apiUrl, tags).toPromise();
  }

  deleteTags(tags): Promise<any> {
    const apiUrl = AppConstants.Tag_API + 'delete';
    return this.httpClient.post<Array<string>>(apiUrl, tags).toPromise();
  }

  tagsSearch(tagEntity:any): Promise<Array<Tag>> {
    const apiUrl = AppConstants.Tag_API + 'search';
    return this.httpClient.post<Array<Tag>>(apiUrl, tagEntity).toPromise();
  }
  getTagMappingList(params): Observable<any>  {
    let apiUrl = AppConstants.Tag_API + 'tags_by_doc_ids';
    return this.httpClient.post<ArrayBuffer>(apiUrl , params);
  }
}
