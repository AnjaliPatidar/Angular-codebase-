import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { AppConstants } from '../../../app.constant';
@Injectable({
  providedIn: 'root'
})
export class TopPanelApiService {

  constructor(private http: HttpClient) { }
  getAllDocuments(params){
    params.isAllRequired =true;
    let url = AppConstants.Ehub_Rest_API + 'documentStorage/myDocuments';
    return this.http.get(url,{params:params}).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }
  getAllEvidenceDocuments(params){
  let url = AppConstants.Ehub_Rest_API + 'documentStorage/myDocuments?pageNumber='+params.pageNumber+'&recordsPerPage='+params.recordsPerPage+'&docFlag='+params.docFlag+'&entityId='+params.entityId+'&orderBy='+params.orderBy+'&orderIn='+params.orderIn+'&isAllRequired='+true;
  return this.http.get(url).pipe(
    retry(2),
    catchError(this.handleError)
  );
  }
  /*
		     * @purpose: upload document
		     * @created: 20 sep 2017
		     * @params: params(object), File(object)
		     * @return: success, error functions
		     * @author: swathi
		    */


       uploadDocument(params, file){
        var data= file;
        let fm = new FormData();

        // Add your values in here
        fm.append('uploadFile', data);
        let url = AppConstants.Ehub_Rest_API +'documentStorage/uploadDocument'+"?docFlag="+params.docFlag  +"&entityId="+params.entityId+"&entityName="+params.entityName+"&entitySource="+params.entitySource+"&fileTitle="+params.fileTitle+"&remarks="+params.remarks;
        return this.http.post(url,fm).pipe(
          retry(2),
          catchError(this.handleError)
        );
       }
       /*
		     * @purpose: update document
		     * @created: 20 sep 2017
		     * @params: params(object), File(object)
		     * @return: success, error functions
		     * @author: swathi
		    */
			updateDocumentContent(params, file){
        var data= file;
        let fm = new FormData();

        // Add your values in here
        fm.append('uploadFile', data);
        let url = AppConstants.Ehub_Rest_API + 'documentStorage/updateDocumentContent'+"?docId="+params.docId;
        return this.http.post(url,fm).pipe(
          retry(2),
          catchError(this.handleError)
        );
      }
        fullTextSearchDocument(params){
          let url = AppConstants.Ehub_Rest_API +'documentStorage/fullTextSearchMyDocuments';
          return this.http.get(url,params).pipe(
            retry(2),
            catchError(this.handleError)
          );
        }
        /*
		     * @purpose: Full text search shared
		     * @created: 03 April 2018
		     * @params: params(object)
		     * @return: success, error functions
		     * @author: varsha
		    */
			 fullTextSearchSharedDocument(params){
        let url = AppConstants.Ehub_Rest_API + 'documentStorage/fullTextSearchDocument';
        return this.http.get(url,params).pipe(
          retry(2),
          catchError(this.handleError)
        );
       }
       deleteEntityDocument(docId){

        let url = AppConstants.Ehub_Rest_API + 'documentStorage/softDeleteDocument?docId='+docId;
        return this.http.delete(url).pipe(
          retry(2),
          catchError(this.handleError)
        );
       }
      deleteSourceAddtoPage(sourceName,entityId){

        let url = AppConstants.Ehub_Rest_API + 'sourceAddToPage/deleteSourceAddToPage?entityId='+ entityId + "&sourceName="+ sourceName;
        return this.http.delete(url).pipe(
          retry(2),
          catchError(this.handleError)
        );
       }
       /*
		     * @purpose: download document
		     * @created: 20 sep 2017
		     * @params: params(object)
		     * @return: success, error functions
		     * @author: swathi
		    */
			 downloadDocument(params){
        let url =   AppConstants.Ehub_Rest_API + 'documentStorage/downloadDocument?docId='+params.docId;
        return this.http.get(url,{responseType: "arraybuffer"}).pipe(
          retry(2),
          catchError(this.handleError)
        );
       }
       /*
		     * @purpose: update document title
		     * @created: 03 sep 2017
		     * @params: params(object)
		     * @return: success, error functions
		     * @author: varsha
		    */
			 updateDocumentTitle(params:any){
        var	headers = {
          "Content-Type": "application/json"
            }
         let data = {
           docId : params.docId,
           title : params.title,
           remark : ' '
         }
        let url = AppConstants.Ehub_Rest_API+'documentStorage/updateDocument'+"?docId="+params.docId;

              return this.http.post(url,data).pipe(
                retry(2),
                catchError(this.handleError)
              );
       }
       /*
		     * @purpose:  Post Notification list
		     * @created: 18th may 2018
		     * @params: params(object)
		     * @return: success, error functions
		     * @author: varsha
		    */
			postNotification(data){
        let headers= {
          "Content-Type": "application/json"
            };
        let url = AppConstants.Ehub_Rest_API+'notification/createNotificationAlert';
        return this.http.post(url,data).pipe(
          retry(2),
          catchError(this.handleError)
        );
      }
  /*
		     * @purpose: upload Document From UploadIcon In Screenshot
		     * @created: 09 July 2019
		     * @params: params(object), URL
		     * @return: success, error functions
		     * @author: Amritesh
		    */
   uploadDocumentFromUploadIconInScreenshot(params, file){
    var data= file;
        let fm = new FormData();
        // Add your values in here
        fm.append('uploadFile', data);
    let url = AppConstants.Ehub_Rest_API +'sourceAddToPage/uploadAddToPageDocument?docFlag='+params.docFlag+'&entityId='+params.entityId+'&fileTitle='+params.fileTitle+'&isAddToPage='+params.isAddToPage+'&sourceName='+params.sourceName;
    return this.http.post(url,fm).pipe(
      retry(2),
      catchError(this.handleError)
    );
   }

   /*
		     * @purpose: update document by screen shot URL
		     * @created: 01 July 2019
		     * @params: params(object), URL
		     * @return: success, error functions
		     * @author: Karunakar
		    */

		   uploadDocumentByScreenShotURLData(data){
        if(data.docID){
          var apiUrl = AppConstants.Ehub_Rest_API + 'documentStorage/uploadDocumentByScreenShotURL?fileTitle='+(data.fileTitle ? data.fileTitle : '')+"&remarks="+(data.remarks ? data.remarks : '')+"&docFlag="+data.docFlag+'&docID='+(data.docID ? data.docID : '') + '&entityId='+(data.entityId ? data.entityId : '')+'&entitySource='+(data.entitySource ? data.entitySource : '');
        } else{
          var apiUrl = AppConstants.Ehub_Rest_API + 'documentStorage/uploadDocumentByScreenShotURL?url='+(data.url ? data.url : '')+"&fileTitle="+(data.fileTitle ? data.fileTitle : '')+"&remarks="+(data.remarks ? data.remarks : '')+"&docFlag="+data.docFlag+'&entityId='+(data.entityId ? data.entityId : '')+'&entityName='+(data.entityName ? data.entityName : '')+'&entitySource='+(data.entitySource ? data.entitySource : '');
        }
        return this.http.get(apiUrl,{headers: {"Content-Type":"multipart/form-data"}}).pipe(
          retry(2),
          catchError(this.handleError)
        );
      }

   saveSourcesAddToPage(data){
    let url = AppConstants.Ehub_Rest_API +'sourceAddToPage/saveSourcesAddToPage';
    return this.http.post(url,data).pipe(
      retry(2),
      catchError(this.handleError)
    );
   }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.

    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
}
