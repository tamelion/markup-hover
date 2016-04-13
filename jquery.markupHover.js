/* MIT License

   Copyright (c) 2016 James Perry

   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to deal
   in the Software without restriction, including without limitation the rights
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   copies of the Software, and to permit persons to whom the Software is
   furnished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in all
   copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   SOFTWARE.

*/

(function ( $ ) {

	$.fn.markupHover = function( options ) {

		var opts = $.extend( {}, $.fn.markupHover.defaults, options );

		return this.each(function() {

			if (opts.kill === true) {
				$(this).unbind('mouseenter mouseleave');
				return true;
			}

			// always keep track of this
			var cssIdentifier;

			$(this).hover(function() {

				var title = $(this).find(opts.titleClass),
				values = $(this).find(opts.valueClass);

				// start the CSS build
				cssIdentifier = title.text();

				// if we have values, we have attributes
				if (values.length) {
					var attrs = $(this).find(opts.attrClass),
						attr,
						value;
					for (i = 0; i < values.length; i++) {
						attr = $(attrs.get(i)).text();
						// trim the quotes and any trailing space
						value = $(values.get(i)).text().match(/"(.*?)"/)[1].trim();
						cssIdentifier += buildCss(attr, value);
					}
				}

				// we don't have any attributes, so don't highlight for common
				// elements found in our banned list
				if ($.inArray(cssIdentifier, opts.bannedElems) !== -1) {
					return false;
				}

				// prepend the container, if any
				if (opts.container.length) {
					cssIdentifier = opts.container + ' ' + cssIdentifier;
				}

				// do the highlighing
				$(cssIdentifier).css('background-color', opts.highlightCol);
				$(this).css('background-color', opts.highlightCol);

			}, function() {
				// hover off
				$(cssIdentifier).css('background-color', '');
				$(this).css('background-color', '');
			});

		});
	};


	// modify options by overriding the default or by passing an object to
	// the markupHover plugin
	$.fn.markupHover.defaults = {
		// the colour to highlight items
		highlightCol: '#fdff47',
		// a container to limit the highlights to
		container: '.kss-modifier-example',
		// the class which wraps the element name
		titleClass: '.hljs-title',
		// the class which wraps each element attribute
		attrClass: '.hljs-attribute',
		// the class which wraps the attribute value(s)
		valueClass: '.hljs-value',
		// elements which shouldn't be highlighted
		bannedElems: ['div', 'span', 'p', 'ul', 'li', 'i', 'a', 'a[href="#"]'],
		// unbind all hover events
		kill: false
	};

	// helper function to convert markup to CSS notation
	function buildCss(attr, value) {
		switch(attr) {
			case 'id':
				return '#' + value;
			case 'class':
				return '.' + value.split(" ").join('.');
			default:
				return '[' + attr + '="' + value + '"]'
		}
	}

}( jQuery ));
