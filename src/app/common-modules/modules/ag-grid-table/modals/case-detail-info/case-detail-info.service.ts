import {Injectable} from "@angular/core";
import {BehaviorSubject, ReplaySubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CaseDetailInfoService {
  associatedEntities$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  associatedEntities = this.associatedEntities$.asObservable();
  associatedRecords$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  associatedRecords = this.associatedRecords$.asObservable();
  relatedCases$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  relatedCases = this.relatedCases$.asObservable();
  eventsLookup$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  eventsLookup = this.eventsLookup$.asObservable();
  toggleCaseDetailInfoLoader: ReplaySubject<boolean> = new ReplaySubject();
  constructor() {
  }
}
