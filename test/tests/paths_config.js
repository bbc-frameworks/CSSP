test('CSSP can refer to cssp! filepaths in the paths configuration for RequireJS.', function() {
	expect(4);
	stop(3000);
	
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
	
	var csspTestEl = document.getElementById('unicorns');
	ok(csspTestEl !== null, 'There should be a test element on the page initially.');
 	
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
		['cssp!sparkle/unicorns?abracadabra', 'cssp!sparkle/elves?abracadabra'],
		
		function() {
		    var links = getLinksToHref('mock/css/my-magic.css');
            ok( links.length, 'A new css link should have the path from the paths configuration.');
		    equals( links.length, 1, 'A new css link should not be added when one already exists for the same resource.');

		}
	);
	
	require(
		['cssp!rainbow/kittens'], /* same as: cssp!rainbow/kittens?cssp-rainbow-kittens */
		
		function() {
		    ok(true, 'A default signal ID is used when none is provided.');
		}
	);
	
	setTimeout(function() {
	    start();  
    }, 2000);
});
