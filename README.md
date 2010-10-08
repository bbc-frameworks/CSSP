# CSSP

## Summary

CSS with Padding. This project implements a plugin for the [RequireJS](http://requirejs.org/) project that allows modules to list CSS files as dependencies. This allows RequireJS to wait until specific style rules are known to be in effect before it releases the JavaScript module to be evaluated. This would be useful if, for example, your JavaScript module required certain CSS rules defined in a separate file to be applied before it could be initialized.

## What CSSP Is

The technique of polling for a known style rule to become applied, as a way of determining when an external stylesheet is loaded has been successfully used in production-quality libraries like (BBC Glow)[http://github.com/glow/glow1/blob/master/src/widgets/widgets.js#L33] for years. This idea has recently been proposed as a wider standard by (Pete Otaqui)[http://otaqui.com/blog/890/cssp-loading-css-with-javascript-and-getting-an-onload-callback/]. The basic idea is that the tool repeatedly checks a know DOM node for a known CSS property and value. When that node is found to have that particular style applied, we can then assume that the file that defines that rule has been successfully loaded by the browser.

## Usage

To start, our implementation assumes that the CSS rule to watch for will be like this:

	#someID { z-index: 12345; }

That string is the P (padding) in CSSP, because you would need to add this "Signal" to the end of your external CSS file in order for the CSSP plugin to detect that the stylesheet was in effect. Having that, and the CSSP plugin, would allow you to write a RequireJS dependency like so:

	require.def(
		'someModule',
		['someOtherModule', 'cssp!someStyles.css#someID'],
		
		function(someOtherModule) {
			// we can be certain the someStyles.css
			// CSS rules are now in effect
			
			// module code
		}
	);

## Todo

- Allow for more flexibility in the name and value of the signal CSS rule.
- Consider possibly of automatically deriving signal ID from the URL?