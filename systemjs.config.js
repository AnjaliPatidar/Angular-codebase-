(function (global) {
    System.config({
        'paths': {
            'npm:':'node_modules/',
        },
        'map': {
            'nouislider': 'node_modules/nouislider',
            'ng2-nouislider': 'node_modules/ng2-nouislider',
            "ngx-rating": "node_modules/ngx-rating",
            

        },
        'packages':  {
            'nouislider': { main: 'distribute/nouislider.js', defaultExtension: 'js' },
            'ng2-nouislider': { main: 'src/nouislider.js', defaultExtension: 'js' },
            "ngx-rating": { main: 'index.js', defaultExtension: 'js' }
           
        }
    })
});