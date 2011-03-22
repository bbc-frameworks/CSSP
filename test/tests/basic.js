(function() {
    
    require(
        {
            baseUrl: 'mock'
        }
    );
        
    function setup() {
        saveTestElement();
    }
     
    function teardown() {
        restoreTestElement();
    }
     
    asyncTest('CSSP can be used when no test element exists on the page.', function() {
        expect(3);
        setup();
        
        var csspTestEl = document.getElementById('addedByCssp');
        equals(csspTestEl, null, 'There should be no test element on the page initially.');
        
        require(
            ['cssp!test1.css?test1'],
            function() {
                ok(true, 'The css dependency should be fulfilled.');
                
                csspTestEl = document.getElementById('addedByCssp');
                equals(csspTestEl, null, 'There should still be no test element on the page after the css is detected.');
            
                teardown();
                start(); 
            }
        );
    });
    
    asyncTest('CSSP plugin works across multiple require calls.', function () {
        expect(2);
        
        require(
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
            teardown();
            start();
        }, 2000);
        
        
    });
    
     
     asyncTest('CSSP can be used when a test element already exists on the page.', function() {
        expect(3);
        setup();
        
        var csspTestEl = document.getElementById('test2');
        ok(csspTestEl !== null, 'There should be a test element on the page initially.');
        
        require(['cssp!test2.css?test2'],
            function() {
                ok(true, 'The css dependency should be fulfilled.');
                
                csspTestEl = document.getElementById('test2');
                ok(csspTestEl !== null, 'There should still be a test element on the page after the css is detected.');
            
                teardown();
                start();
            }
        );
    });
     
    asyncTest('CSSP callback receives a ref to the injected link DOM node.', function() {
        expect(3);
        setup();
    
        require(
            {
                baseUrl: 'mock'
            },
            ['cssp!test3.css?test3'],
            function(linkNode) {
                equals(typeof linkNode, 'object', 'The given linkNode is defined.');
                
                equals(linkNode.nodeName.toUpperCase(), 'LINK', 'The given node object has a name of LINK.');
                ok(~ linkNode.href.indexOf('test3.css'), 'The given linkNode has the correct href property.');
            
                teardown();
                start();
            }
        );
    });

})();