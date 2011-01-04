test('CSSP can refer to cssp! module ids in the "paths" configuration for RequireJS.', function() {
	expect(3);
	stop(3000);
	saveTestElement();
	
	// assumes href strings will be unique in any link
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
             'sparkle/unicorns':      'js/my-magic.js',
             'cssp!sparkle/unicorns': 'css/my-magic.css',
             'cssp!sparkle/elves':    'css/my-magic.css',
             'cssp!rainbow/kittens':  'css/joy.css'
         }
     });
     
    require(
		['cssp!sparkle/unicorns?unicorns', 'cssp!sparkle/elves?elves'],
		
		function() {
		    var links = getLinksToHref('mock/css/my-magic.css');
            ok( links.length, 'A CSS Link Element should be added with the href from the paths configuration.');
		    equals( links.length, 1, 'A new CSS Link Element should not be added when one already exists for the same url.');

		}
	);
	
	require(
		['cssp!rainbow/kittens'], /* same as: cssp!rainbow/kittens?cssp-rainbow-kittens */
		
		function() {
		    ok(true, 'A default signal ID is used when none is provided.');
		}
	);
	
	setTimeout(function() {
	    restoreTestElement();
	    start();  
    }, 2000);
});
