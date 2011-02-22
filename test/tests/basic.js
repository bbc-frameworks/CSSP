test('CSSP can be used when no test element exists on the page.', function() {
	expect(3);
	stop(3000);
	saveTestElement();
	
	var csspTestEl = document.getElementById('addedByCssp');
	equals(csspTestEl, null, 'There should be no test element on the page initially.');
	
	
	require({
			baseUrl: 'mock'
		},
		['cssp!test1.css?test1'],
		function() {
			ok(true, 'The css dependency should be fulfilled.');
			
			csspTestEl = document.getElementById('addedByCssp');
			equals(csspTestEl, null, 'There should still be no test element on the page after the css is detected.');
		}
	);
	
	setTimeout(function() {
	    restoreTestElement();
        start();  
    }, 2000);
});

test('CSSP plugin works between require calls.', function () {
    
    expect(2);
    stop(3000);
    
    require(
        {
            baseUrl: 'mock'
        },
        ['cssp!test1.css?test1'],
        function() {
            ok(true, 'The css dependency should be fulfilled.');
        }
    );
    
    require(
        ['cssp!test1.css?test1'],
        function() {
            ok(true, 'The css dependency should be fulfilled in a second separate call to require().');
        }
    );
    
    setTimeout(function() {
        restoreTestElement();
        start();
    }, 2000);
    
    
});

 
 test('CSSP can be used when a test element already exists on the page.', function() {
 	expect(3);
 	stop(3000);
 	saveTestElement();
 	
 	var csspTestEl = document.getElementById('test2');
 	ok(csspTestEl !== null, 'There should be a test element on the page initially.');
 	
 	require({
        baseUrl: 'mock'
    });
 	
 	require(['cssp!test2.css?test2'],
 		function() {
 			ok(true, 'The css dependency should be fulfilled.');
 			
 			csspTestEl = document.getElementById('test2');
 			ok(csspTestEl !== null, 'There should still be a test element on the page after the css is detected.');
 		}
 	);
 	
 	setTimeout(function() { 
 	    restoreTestElement();
        start();  
     }, 2000);
  });
 
test('CSSP callback receives a ref to the injected link DOM node.', function() {
	expect(3);
	stop(3000);
	saveTestElement();

	require({
        baseUrl: 'mock'
    },
		['cssp!test3.css?test3'],
		function(linkNode) {
			equals(typeof linkNode, 'object', 'The given linkNode is defined.');
			
			equals(linkNode.nodeName.toUpperCase(), 'LINK', 'The given node object has a name of LINK.');
			ok(~ linkNode.href.indexOf('test3.css'), 'The given linkNode has the correct href property.');
		}
	);
	
	setTimeout(function() {
	    restoreTestElement();
        start();  
    }, 2000);
});
