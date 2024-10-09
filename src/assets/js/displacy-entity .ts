export class displaCyENT{
    public api: any = {};
    public container: any = '';
    public defaultText: any = '';
    public defaultModel: any = 'en';
    public defaultEnts: any = ['person', 'org', 'gpe', 'loc', 'product'];
    public onStart: any = false;
    public onSuccess: any = false;
    public onError: any = false;
    public onRender: any = false;

    constructor(api, options) {
        this.api = api;
        this.container = document.querySelector(options.container || '#displacy');
        this.defaultText = options.defaultText || 'When Sebastian Thrun started working on self-driving cars at Google in 2007, few people outside of the company took him seriously.';
        this.defaultModel = options.defaultModel || 'en';
        this.defaultEnts = options.defaultEnts || ['person', 'org', 'gpe', 'loc', 'product'];
        this.onStart = options.onStart || false;
        this.onSuccess = options.onSuccess || false;
        this.onError = options.onError || false;
        this.onRender = options.onRender || false;
    }

    parse(text = this.defaultText, model = this.defaultModel, ents = this.defaultEnts) {
        if (typeof this.onStart === 'function') this.onStart();

        let xhr = new XMLHttpRequest();
        xhr.open('POST', this.api, true);
        xhr.setRequestHeader('Content-type', 'text/plain');
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (typeof this.onSuccess === 'function') this.onSuccess();
                this.render(text, JSON.parse(xhr.responseText), ents);
            }
            else if (xhr.status !== 200) {
                if (typeof this.onError === 'function') this.onError(xhr.statusText);
            }
        }
        xhr.onerror = () => {
            xhr.abort();
            if (typeof this.onError === 'function') this.onError();
        }
        xhr.send(JSON.stringify({ text, model }));
    }
    // render(text, spans, ents) {
    //     this.container.innerHTML = '';
    //     let offset = 0;
    //     spans.forEach(({ type, start, end }) => {
    //         const entity = text.slice(start, end);
    //         const fragments = text.slice(offset, start).split('\n');
    //         fragments.forEach((fragment, i) => {
    //             this.container.appendChild(document.createTextNode(fragment));
    //             if (fragments.length > 1 && i != fragments.length - 1) this.container.appendChild(document.createElement('br'));
    //         });
    //         if (ents.includes(type.toLowerCase())) {
    //             const mark = document.createElement('mark');
    //             mark.setAttribute('data-entity', type.toLowerCase());
    //             mark.appendChild(document.createTextNode(entity));
    //             this.container.appendChild(mark);
    //         }
    //         else {
    //             this.container.appendChild(document.createTextNode(entity));
    //         }

    //         offset = end;
    //     });
    //     this.container.appendChild(document.createTextNode(text.slice(offset, text.length)));
    //     if (typeof this.onRender === 'function') this.onRender();
    // }
    
        render(b, c, d) {
            var f = this;
            this.container.innerHTML = '';
            var e = 0;
            c.forEach(function(_ref) {
                var g = _ref.type,
                    h = _ref.start,
                    j = _ref.end,
                    k = b.slice(h, j),
                    l = b.slice(e, h).split('\n');
                if (l.forEach(function(n, o) {
                        f.container.appendChild(document.createTextNode(n)), 1 < l.length && o != l.length - 1 && f.container.appendChild(document.createElement('br'))
                    }), d.includes(g.toLowerCase())) {
                    var m = document.createElement('mark');
                    m.setAttribute('data-entity', g.toLowerCase()), m.appendChild(document.createTextNode(k)), f.container.appendChild(m)
                } else f.container.appendChild(document.createTextNode(k));
                e = j
            }), this.container.appendChild(document.createTextNode(b.slice(e, b.length))), 'function' == typeof this.onRender && this.onRender()
        }
}
