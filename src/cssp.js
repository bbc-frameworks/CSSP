/**
 * @fileoverview Add the ability to depend on CSS files to RequireJS.
 * @copyright 2010 British Broadcasting Corporation
 * @author Michael Mathews <michael.mathews@bbc.co.uk>
 * @see http://otaqui.com/blog/890/cssp-loading-css-with-javascript-and-getting-an-onload-callback/
 */

(function () {
    var magicNumber = 12345, // a zindex must be set to this to signal CSS has been applied
        csspQueue = [], // waiting for these: like [ [elemId, callback], [elemId, callback], ... ]
        intervalId,
        cacheTrack = {}; // what css files have already been added to this page?
    /*
     * Fix bugginess in IE that can cause the wrong element to be returned when
     * a DOM node has the same `name` as another DOM node's `id`.
     * @see http://www.sixteensmallstones.org/ie-javascript-bugs-overriding-internet-explorers-documentgetelementbyid-to-be-w3c-compliant-exposes-an-additional-bug-in-getattributes
     * @see http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-36113835
     */
    if ( navigator.userAgent.toLowerCase().indexOf('msie') > -1 ) { // IE-only bugs in here
        var nativeGetElementById = document.getElementById;
        
        document.getElementById = function(elemId) {
            var elem = nativeGetElementById(elemId);
            
            if (elem) {
                if( elem.attributes['id'].value === elemId ) { //make sure that it is a valid match on id
                    return elem;
                }
                else { //otherwise find the correct element
                    for (var i = 1, leni = document.all[elemId].length; i < leni; i++) { // returns the first match
                        if( document.all[elemId][i].attributes['id'].value === elemId ) {
                            return document.all[elemId][i]; 
                        }
                    }
                }
            }
            return null; // as per the W3 spec
        };
    }
    
    /**
     * Given an element's id, returns the current z-index of the element
     * @private
     * @param {string} elem The DOM element to check.
     * @returns {number}
     */
    function getZindex(elem) {
        var zIndex;
        
        if (elem) {
            // the w3c way, uses hyphenated property names
            if (window.getComputedStyle) {
                zIndex = document.defaultView.getComputedStyle(elem, null).getPropertyValue('z-index');
            }
            // the IE way
            else if (elem.currentStyle) {
                zIndex = elem.currentStyle['zIndex'];
            }
            zIndex = +zIndex;
            
            return zIndex;
        }
    }
    
    /**
     * Loop through the queue, looking for any node id's that match the magic number.
     * @private
     */
    function look() {
        var cssp,
            elem;
        
        if (!document.body) {
            return;
        }
            
        for (var i = 0; i < csspQueue.length; i++) { // length may change during loop
            cssp = csspQueue[i],
            elem = document.getElementById(cssp[0]);
            
            // is there a test element to look for?
            if (!elem) {
                elem = addTestElement(cssp[0]);
            }
            
            if ( getZindex(elem) === magicNumber ) {
                cssp[1](); // fire callback
                csspQueue.splice(i--, 1); // remove this item from the queue, decrement i
                
                if (csspQueue.length === 0) { // can stop looking now
                    clearInterval(intervalId);
                }
            }
        }
    }
    
    /**
     * If there is no test element with the given ID, we add one ourselves.
     * @private
     */
    function addTestElement(elemId) {
        var elem = document.createElement('div');
        elem.id = elemId;
        elem.className = 'addedByCssp';
        elem.setAttribute('style', 'position: absolute; width: 1px; height: 1px; top: -1px; left: -1px;');
        
        document.body.insertBefore(elem, document.body.firstChild);
        
        return elem;
    }
    
    require.plugin({
        prefix: 'cssp',

        /*
         * This callback is prefix-specific, only gets called for this prefix.
         */
        require: function (name, deps, callback, context) {
            // no-op
        },

        /*
         * Called when a new context is defined. Use this to store
         * context-specific info on it.
         */
        newContext: function (context) {
            require.mixin(context, {
                linkNode: {},
                csspWaiting: []
            });
        },

        /**
         * Called when a dependency needs to be loaded.
         * @param {string} name Like some/url/foo.css?elementId
         */
        load: function (name, contextName) {
            var splitAt = name.lastIndexOf('?'),
                url = (splitAt > 0? name.substring(0, splitAt) : name),
                id = (splitAt > 0? name.substring(splitAt + 1, name.length) : 'cssp-' + name.replace(/[^a-z0-9_]/gi, '-') ),
                context = require.s.contexts[contextName],
                data = {
                    name: name
                },
                head = require.s.head,
                node = head.ownerDocument.createElement('link'),
                cssUrl;
            
            // is there a path defined for this css?
            var cssUrl = context.config.paths['cssp!'+url];
            
            if (cssUrl && ! /^(\/|^https?:)/i.test(cssUrl)) { // not an absolute path or URL
                cssUrl = (context.config.baseUrl || '') + cssUrl;
                
            }
            else {
                cssUrl = (context.config.baseUrl || '') + url;
            }

            if (cacheTrack[cssUrl]) { // already included a link to this page
                return true;
            }
            cacheTrack[cssUrl] = url;
            
            // add this item to the queue
            csspQueue.push([id, function() { // create callback function
                // remove test element if it is one we added
                var elem = document.getElementById(id);
                if (elem.className === 'addedByCssp') {
                    document.body.removeChild(elem);
                }
                
                context.loaded[name] = true;
                require.checkLoaded(contextName);
            }]);
            
            if (csspQueue.length === 1) {
                intervalId = setInterval(look, 250); // start looking now
            }

            // hold on to the data for later dependency resolution in orderDeps
            context.csspWaiting.push(data);
            context.loaded[name] = false;
            node.type = 'text/css';
            node.rel  = 'stylesheet';
            
            node.href = cssUrl;
            head.appendChild(node);
            
            context.linkNode = node;
        },

        /**
         * Called when the dependencies of a module are checked.
         */
        checkDeps: function (name, deps, context) {
            // no-op
        },

        /**
         * Called to determine if a module is waiting to load.
         */
        isWaiting: function (context) {
            return !!context.csspWaiting.length;
        },

        /**
         * Called when all modules have been loaded.
         */
        orderDeps: function (context) {
            // clear up state since further processing could
            // add more things to fetch.
            var i,
                dep,
                waitAry = context.csspWaiting,
                ret = context.linkNode; // <- the thing passed into the requirejs callback
            
            context.csspWaiting = [];
            for (i = 0; (dep = waitAry[i]); i++) {
                context.defined[dep.name] = ret;
            }
        }
    });
}());
