import { Injectable, Inject } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class LazyLoadLibraryService {
    loadedLibraries: { [url: string]: ReplaySubject<void> } = {};

    constructor(@Inject(DOCUMENT) private readonly document: Document) { }

    loadScript(url: string): Observable<void> {
        if (this.loadedLibraries[url]) {
            return this.loadedLibraries[url].asObservable();
        }

        this.loadedLibraries[url] = new ReplaySubject();

        const script = this.document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = () => {
            this.loadedLibraries[url].next();
            this.loadedLibraries[url].complete();
        };

        this.document.body.appendChild(script);

        return this.loadedLibraries[url].asObservable();
    }
    loadCss(url:string):Observable<void> {
        if(this.loadedLibraries[url]) {
            return this.loadedLibraries[url].asObservable();
        }
        this.loadedLibraries[url] = new ReplaySubject();
        const link = document.createElement('link');
        link.type="text/css";
        link.rel="stylesheet";
        link.onload=()=> {
            this.loadedLibraries[url].next();
            this.loadedLibraries[url].complete();
        };
        this.document.head.appendChild(link);
        return this.loadedLibraries[url].asObservable();
    }
}
// For lazly loading the script files and css