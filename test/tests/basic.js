test('CSSP can be used when no test element exists on the page.', function() {
	expect(3);
	stop(3000);
	
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
        start();  
    }, 2000);
});

test('CSSP can be used when a test element already exists on the page.', function() {
	expect(3);
	stop(3000);
	
	var csspTestEl = document.getElementById('unicorns');
	ok(csspTestEl !== null, 'There should be a test element on the page initially.');
	
	require({
			baseUrl: 'mock'
		},
		['cssp!test2.css?unicorns'],
		function() {
			ok(true, 'The css dependency should be fulfilled.');
			
			csspTestEl = document.getElementById('unicorns');
			ok(csspTestEl !== null, 'There should still be a test element on the page after the css is detected.');
		}
	);
	
	setTimeout(function() {  
        start();  
    }, 2000);
});