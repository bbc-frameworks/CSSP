# CSSP

## Summary

CSS with Padding. This project implements a plugin for the [RequireJS](http://requirejs.org/) project that allows modules to list CSS files as dependencies. This allows RequireJS to wait until specific style rules are known to be in effect before it releases the JavaScript module to be evaluated. This would be useful if, for example, if your JavaScript module required certain CSS rules, defined in a separate file, to be applied to the DOM before it could be initialized.

## What CSSP Is

The technique of polling for a known style rule to become applied, as a way of determining when an external stylesheet is loaded, has been successfully used in production-quality libraries like [BBC Glow](http://github.com/glow/glow1/blob/master/src/widgets/widgets.js#L33) for years. This idea has recently been proposed as a wider standard by [Pete Otaqui](http://otaqui.com/blog/890/cssp-loading-css-with-javascript-and-getting-an-onload-callback/). The basic idea is that the tool repeatedly checks a known DOM node for a known CSS property and value. When that node is found to have that particular style applied, we can then assume that the file that defines that rule has been successfully loaded by the browser.

## Usage

In the initial release, our implementation assumes that the CSS rule to watch for will be like this:

	#someID { position:relative; z-index:12345; }

That rule is the P (padding) in CSSP, because you would need to add this "signal" to the end of your CSS file in order for the CSSP plugin to detect that the stylesheet was in effect. Having that, and the CSSP plugin, would allow you to write a RequireJS dependency like so:

	define(
		'someModule',
		['someOtherModule', 'cssp!someStyles.css?someID'],
		
		function(someOtherModule, linkNode) {
			// we can be certain the someStyles.css
			// CSS rules are now in effect
			
			// the linkNode argument contains a reference to the DOM Node
			// associated with the injected LINK element for the stylesheet
			
			// module code goes here
		}
	);

Or simply...

	require({
		['cssp!someStyles.css?someID'],
		function() {
			// someStyles.css rules are in effect now
			
			// module code goes here
		}
	);

Notice it is not necessary that there actually be any element on the page with given signal ID. The plugin will automatically create one, watch it, and then remove it when the dependency is eventually fulfilled.

## Configuring Paths for cssp! IDs

The RequireJS `require()` method allows you to configure paths for you JavaScript modules by associating a moduleID with a specific file path. If you use a moduleID that starts with "cssp!" the associated path will be used to include the `.css` file. For example:

    require({
        baseUrl: 'base/dir/',
	    paths: {
            'cssp!sparkle/unicorns': 'css/my-magic.css',
            'cssp!sparkle/elves':    'css/my-magic.css'
        }
    });
    
    // later...
    
    require({
		['cssp!sparkle/elves?someID'],
		function() {
			// base/dir/css/my-magic.css rules are in effect now
			
			// module code goes here
		}
	);

Notice that by using this technique you can associate multiple cssp! moduleIDs with a single `.css` file. Also, as an efficiency, the CSS file inclusion will only ever happen once per filepath, regardless of how many different moduleIDs are associated with that filepath.

### Using the Default Signal ID

In the above examples the user provided a signal ID to the the CSSP plugin by appending it after a `?` character. It is possible to allow the CSSP plugin to derive and use a default signal ID however. The ID will be calculated by taking the given css ID and replacing all non-alphanumeric characters with a dash. So, for example, the following cssp requires are identical:

    require({
		['cssp!sparkle/elves?cssp-sparkle-elves'],
		function() {
		}
	);
	
	// is the same as...
	
	require({
		['cssp!sparkle/elves'],
		function() {
		}
	);
