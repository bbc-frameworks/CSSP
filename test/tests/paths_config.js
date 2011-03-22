(function() {

    // helper utility: assumes href strings will be unique in any link
	function getLinksToHref(href) {
	    var linksInPage = document.getElementsByTagName('link'),
	        matchingLinks = [],
	        i = linksInPage.length;
	    
	    while (i--) {
	        if ( ~ linksInPage[i].href.indexOf(href) ) {
	            matchingLinks.push(linksInPage[i]);
	        }
	    }
	    
	    return matchingLinks;
	}
	
	// configure
 	require({
        baseUrl: 'mock',
 	    paths: {
             'sparkle/unicorns':      'js/my-magic',
             'cssp!sparkle/unicorns': 'css/my-magic.css',
             'cssp!sparkle/elves':    'css/my-magic.css',
             'cssp!rainbow/kittens':  'css/joy.css'
         }
     });
     
     function setup() {
        saveTestElement();
     }
     
     function teardown() {
        restoreTestElement();
     }
    
    asyncTest('When a cssp requirement is requested it is included.', function() {
        expect(1);
        setup();
        
        require(
            ['cssp!css/butterfly.css?butterfly'],
            
            function(linkElement) {
                var links = getLinksToHref('mock/css/butterfly.css');
                ok( links.length, 'A CSS Link Element should be added with the baseUrl from the configuration.');

                teardown();
                start();
            }
        );
    });
    
    asyncTest('CSSP can refer to cssp! module ids in the "paths" configuration for RequireJS.', function() {
        expect(7);
        setup();
         
        require(
            ['cssp!sparkle/unicorns?unicorns', 'cssp!sparkle/elves?elves', 'sparkle/unicorns'],
            
            function(cssLinkUnicorns, cssLinkElves, unicornsModule) {
                // were all the requirements met?
                ok(cssLinkUnicorns, 'A reference to the included CSS link element is returned.');
                ok(cssLinkElves, 'A reference to the second included CSS link element is returned.');
                ok(unicornsModule, 'A reference to the included JS module is returned.');
                
                // were the CSS Link elements created?
                ok(cssLinkUnicorns.href.indexOf('mock/css/my-magic.css') > -1, 'The CSS link reference has the expected HREF attribute value.');
                ok(cssLinkElves.href.indexOf('mock/css/my-magic.css') > -1, 'The second CSS link reference has the expected HREF attribute value.');
                
                // were the Link elements injected into the page?
                var links = getLinksToHref('mock/css/my-magic.css');
                ok( links.length, 'A CSS Link Element should be added with the href from the paths configuration.');
                equals( links.length, 1, 'A new CSS Link Element should not be added when one already exists for the same url.');
                
                teardown();
                start();
            }
        );
    });
    
    asyncTest('When no ?name is provided for the test element, a default one will be used.', function() {
        expect(1);
        setup();
        
        require(
            ['cssp!rainbow/kittens'], // <-- same as: cssp!rainbow/kittens?cssp-rainbow-kittens
            
            function(linkElement) {
                var links = getLinksToHref('mock/css/my-magic.css');
                ok( links.length, 'A CSS Link Element should be added with the href from the paths configuration.');

                teardown();
                start();
            }
        );
    });
})();
