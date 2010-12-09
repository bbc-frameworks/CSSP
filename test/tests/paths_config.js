test('CSSP can refer to cssp! filepaths in the paths configuration for RequireJS.', function() {
	expect(4);
	
	var csspTestEl = document.getElementById('unicorns');
	ok(csspTestEl !== null, 'There should be a test element on the page initially.');
	
	stop(5000);
	
	require({
        baseUrl: 'mock',
	    paths: {
            'sparkle/unicorns':      'js/my-magic.js',
            'cssp!sparkle/unicorns': 'css/my-magic.css',
            'cssp!sparkle/elves':    'css/my-magic.css'
        }
    });
    
    var linkCount1 = document.getElementsByTagName('link').length,
        linkCount2

    require(
		['cssp!sparkle/unicorns?abracadabra'],
		
		function() {
		    start();
		     linkCount2 = document.getElementsByTagName('link').length;
		     var   lastLink = document.getElementsByTagName('link')[linkCount2-1];

		    equals( linkCount1 + 1, linkCount2, 'A new css link should have been added.');
		    
		    ok( lastLink.href.indexOf('mock/css/my-magic.css') > -1, 'A new css link should have the path from the paths configuration. ['+lastLink.href+']');
			
		}
	);
	
	require(
		['cssp!sparkle/elves?abracadabra'],
		
		function() {
		    start();
		    var linkCount3 = document.getElementsByTagName('link').length,
		        lastLink = document.getElementsByTagName('link')[linkCount3-1];

		    equals( linkCount2, linkCount3, 'A new css link should not be added when one already exists for the same resource.');
		}
	);
});