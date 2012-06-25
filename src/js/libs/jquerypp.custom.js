(function( $ ) {

	var getComputedStyle = document.defaultView && document.defaultView.getComputedStyle,
		// The following variables are used to convert camelcased attribute names
		// into dashed names, e.g. borderWidth to border-width
		rupper = /([A-Z])/g,
		rdashAlpha = /-([a-z])/ig,
		fcamelCase = function( all, letter ) {
			return letter.toUpperCase();
		},
		// Returns the computed style for an elementn
		getStyle = function( elem ) {
			if ( getComputedStyle ) {
				return getComputedStyle(elem, null);
			}
			else if ( elem.currentStyle ) {
				return elem.currentStyle;
			}
		},
		// Checks for float px and numeric values
		rfloat = /float/i,
		rnumpx = /^-?\d+(?:px)?$/i,
		rnum = /^-?\d/;

	// Returns a list of styles for a given element
	$.styles = function( el, styles ) {
		if (!el ) {
			return null;
		}
		var  currentS = getStyle(el),
			oldName, val, style = el.style,
			results = {},
			i = 0,
			left, rsLeft, camelCase, name;

		// Go through each style
		for (; i < styles.length; i++ ) {
			name = styles[i];
			oldName = name.replace(rdashAlpha, fcamelCase);

			if ( rfloat.test(name) ) {
				name = jQuery.support.cssFloat ? "float" : "styleFloat";
				oldName = "cssFloat";
			}

			// If we have getComputedStyle available
			if ( getComputedStyle ) {
				// convert camelcased property names to dashed name
				name = name.replace(rupper, "-$1").toLowerCase();
				// use getPropertyValue of the current style object
				val = currentS.getPropertyValue(name);
				// default opacity is 1
				if ( name === "opacity" && val === "" ) {
					val = "1";
				}
				results[oldName] = val;
			} else {
				// Without getComputedStyles
				camelCase = name.replace(rdashAlpha, fcamelCase);
				results[oldName] = currentS[name] || currentS[camelCase];

				// convert to px
				if (!rnumpx.test(results[oldName]) && rnum.test(results[oldName]) ) {
					// Remember the original values
					left = style.left;
					rsLeft = el.runtimeStyle.left;

					// Put in the new values to get a computed value out
					el.runtimeStyle.left = el.currentStyle.left;
					style.left = camelCase === "fontSize" ? "1em" : (results[oldName] || 0);
					results[oldName] = style.pixelLeft + "px";

					// Revert the changed values
					style.left = left;
					el.runtimeStyle.left = rsLeft;
				}

			}
		}

		return results;
	};

	/**
	 * @function jQuery.fn.styles
	 * @parent jQuery.styles
	 * @plugin jQuery.styles
	 *
	 * Returns a set of computed styles. Pass the names of the styles you want to
	 * retrieve as arguments:
	 *
	 *      $("div").styles('float','display')
	 *      // -> { cssFloat: "left", display: "block" }
	 *
	 * @param {String} style pass the names of the styles to retrieve as the argument list
	 * @return {Object} an object of `style` : `value` pairs
	 */
	$.fn.styles = function() {
		// Pass the arguments as an array to $.styles
		return $.styles(this[0], $.makeArray(arguments));
	};
})(jQuery);
(function ($) {

	// Overwrites `jQuery.fn.animate` to use CSS 3 animations if possible

	var
		// The global animation counter
		animationNum = 0,
		// The stylesheet for our animations
		styleSheet = null,
		// The animation cache
		cache = [],
		// Stores the browser properties like transition end event name and prefix
		browser = null,
		// Store the original $.fn.animate
		oldanimate = $.fn.animate,

		// Return the stylesheet, create it if it doesn't exists
		getStyleSheet = function () {
			if(!styleSheet) {
				var style = document.createElement('style');
				style.setAttribute("type", "text/css");
				style.setAttribute("media", "screen");

				document.getElementsByTagName('head')[0].appendChild(style);
				if (!window.createPopup) { /* For Safari */
					style.appendChild(document.createTextNode(''));
				}

				styleSheet = style.sheet;
			}

			return styleSheet;
		},

		//removes an animation rule from a sheet
		removeAnimation = function (sheet, name) {
			for (var j = sheet.cssRules.length - 1; j >= 0; j--) {
				var rule = sheet.cssRules[j];
				// 7 means the keyframe rule
				if (rule.type === 7 && rule.name == name) {
					sheet.deleteRule(j)
					return;
				}
			}
		},

		// Returns whether the animation should be passed to the original $.fn.animate.
		passThrough = function (props, ops) {
			var nonElement = !(this[0] && this[0].nodeType),
				isInline = !nonElement && $(this).css("display") === "inline" && $(this).css("float") === "none";

			for (var name in props) {
				// jQuery does something with these values
				if (props[name] == 'show' || props[name] == 'hide' || props[name] == 'toggle'
					// Arrays for individual easing
					|| $.isArray(props[name])
					// Negative values not handled the same
					|| props[name] < 0
					// unit-less value
					|| name == 'zIndex' || name == 'z-index'
					) {
					return true;
				}
			}

			return props.jquery === true || getBrowser() === null ||
				// Animating empty properties
				$.isEmptyObject(props) ||
				// We can't do custom easing
				ops.length == 4 || typeof ops[2] == 'string' ||
				// Second parameter is an object - we can only handle primitives
				$.isPlainObject(ops) ||
				// Inline and non elements
				isInline || nonElement;
		},

		// Gets a CSS number (with px added as the default unit if the value is a number)
		cssValue = function(origName, value) {
			if (typeof value === "number" && !$.cssNumber[ origName ]) {
				return value += "px";
			}
			return value;
		},

		// Feature detection borrowed by http://modernizr.com/
		getBrowser = function(){
			if(!browser) {
				var t,
					el = document.createElement('fakeelement'),
					transitions = {
						'transition': {
							transitionEnd : 'transitionEnd',
							prefix : ''
						},
//						'OTransition': {
//							transitionEnd : 'oTransitionEnd',
//							prefix : '-o-'
//						},
//						'MSTransition': {
//							transitionEnd : 'msTransitionEnd',
//							prefix : '-ms-'
//						},
						'MozTransition': {
							transitionEnd : 'animationend',
							prefix : '-moz-'
						},
						'WebkitTransition': {
							transitionEnd : 'webkitAnimationEnd',
							prefix : '-webkit-'
						}
					}

				for(t in transitions){
					if( el.style[t] !== undefined ){
						browser = transitions[t];
					}
				}
			}
			return browser;
		},

		// Properties that Firefox can't animate if set to 'auto':
		// https://bugzilla.mozilla.org/show_bug.cgi?id=571344
		// Provides a converter that returns the actual value
		ffProps = {
			top : function(el) {
				return el.position().top;
			},
			left : function(el) {
				return el.position().left;
			},
			width : function(el) {
				return el.width();
			},
			height : function(el) {
				return el.height();
			},
			fontSize : function(el) {
				return '1em';
			}
		},

		// Add browser specific prefix
		addPrefix = function(properties) {
			var result = {};
			$.each(properties, function(name, value) {
				result[getBrowser().prefix + name] = value;
			});
			return result;
		},

		// Returns the animation name for a given style. It either uses a cached
		// version or adds it to the stylesheet, removing the oldest style if the
		// cache has reached a certain size.
		getAnimation = function(style) {
			var sheet, name, last;

			// Look up the cached style, set it to that name and reset age if found
			// increment the age for any other animation
			$.each(cache, function(i, animation) {
				if(style === animation.style) {
					name = animation.name;
					animation.age = 0;
				} else {
					animation.age += 1;
				}
			});

			if(!name) { // Add a new style
				sheet = getStyleSheet();
				name = "jquerypp_animation_" + (animationNum++);
				// get the last sheet and insert this rule into it
				sheet.insertRule("@" + getBrowser().prefix + "keyframes " + name + ' ' + style,
					(sheet.cssRules && sheet.cssRules.length) || 0);
				cache.push({
					name : name,
					style : style,
					age : 0
				});

				// Sort the cache by age
				cache.sort(function(first, second) {
					return first.age - second.age;
				});

				// Remove the last (oldest) item from the cache if it has more than 20 items
				if(cache.length > 20) {
					last = cache.pop();
					removeAnimation(sheet, last.name);
				}
			}

			return name;
		};

	/**
	 * @function $.fn.animate
	 * @parent $.animate
	 *
	 * Animate CSS properties using native CSS animations, if possible.
	 * Uses the original [$.fn.animate()](http://api.$.com/animate/) otherwise.
	 *
	 * @param {Object} props The CSS properties to animate
	 * @param {Integer|String|Object} [speed=400] The animation duration in ms.
	 * Will use $.fn.animate if a string or object is passed
	 * @param {Function} [callback] A callback to execute once the animation is complete
	 * @return {jQuery} The jQuery element
	 */
	$.fn.animate = function (props, speed, easing, callback) {
		//default to normal animations if browser doesn't support them
		if (passThrough.apply(this, arguments)) {
			return oldanimate.apply(this, arguments);
		}

		var optall = jQuery.speed(speed, easing, callback);

		// Add everything to the animation queue
		this.queue(optall.queue, function(done) {
			var
				//current CSS values
				current,
				// The list of properties passed
				properties = [],
				to = "",
				prop,
				self = $(this),
				duration = optall.duration,
				//the animation keyframe name
				animationName,
				// The key used to store the animation hook
				dataKey,
				//the text for the keyframe
				style = "{ from {",
				// The animation end event handler.
				// Will be called both on animation end and after calling .stop()
				animationEnd = function (currentCSS, exec) {
					self.css(currentCSS);
					
					self.css(addPrefix({
						"animation-duration" : "",
						"animation-name" : "",
						"animation-fill-mode" : "",
						"animation-play-state" : ""
					}));

					// Call the original callback
					if (optall.old && exec) {
						// Call success, pass the DOM element as the this reference
						optall.old.call(self[0], true)
					}

					$.removeData(self, dataKey, true);
				}

			for(prop in props) {
				properties.push(prop);
			}

			if(getBrowser().prefix === '-moz-') {
				// Normalize 'auto' properties in FF
				$.each(properties, function(i, prop) {
					var converter = ffProps[$.camelCase(prop)];
					if(converter && self.css(prop) == 'auto') {
						self.css(prop, converter(self));
					}
				});
			}

			// Use $.styles
			current = self.styles.apply(self, properties);
			$.each(properties, function(i, cur) {
				// Convert a camelcased property name
				var name = cur.replace(/([A-Z]|^ms)/g, "-$1" ).toLowerCase();
				style += name + " : " + cssValue(cur, current[cur]) + "; ";
				to += name + " : " + cssValue(cur, props[cur]) + "; ";
			});

			style += "} to {" + to + " }}";

			animationName = getAnimation(style);
			dataKey = animationName + '.run';

			// Add a hook which will be called when the animation stops
			$._data(this, dataKey, {
				stop : function(gotoEnd) {
					// Pause the animation
					self.css(addPrefix({
						'animation-play-state' : 'paused'
					}));
					// Unbind the animation end handler
					self.off(getBrowser().transitionEnd, animationEnd);
					if(!gotoEnd) {
						// We were told not to finish the animation
						// Call animationEnd but set the CSS to the current computed style
						animationEnd(self.styles.apply(self, properties), false);
					} else {
						// Finish animaion
						animationEnd(props, true);
					}
				}
			});

			// set this element to point to that animation
			self.css(addPrefix({
				"animation-duration" : duration + "ms",
				"animation-name" : animationName,
				"animation-fill-mode": "forwards"
			}));

			// Attach the transition end event handler to run only once
			self.one(getBrowser().transitionEnd, function() {
				// Call animationEnd using the passed properties
				animationEnd(props, true);
				done();
			});

		});

		return this;
	};
})(jQuery);
(function($){

/**
 * @function jQuery.fn.compare
 * @parent jQuery.compare
 *
 * Compare two elements and return a bitmask as a number representing the following conditions:
 *
 * - `000000` -> __0__: Elements are identical
 * - `000001` -> __1__: The nodes are in different documents (or one is outside of a document)
 * - `000010` -> __2__: #bar precedes #foo
 * - `000100` -> __4__: #foo precedes #bar
 * - `001000` -> __8__: #bar contains #foo
 * - `010000` -> __16__: #foo contains #bar
 *
 * You can check for any of these conditions using a bitwise AND:
 *
 *     if( $('#foo').compare($('#bar')) & 2 ) {
 *       console.log("#bar precedes #foo")
 *     }
 *
 * @param {HTMLElement|jQuery} element an element or jQuery collection to compare against.
 * @return {Number} A number representing a bitmask deatiling how the elements are positioned from each other.
 */

// See http://ejohn.org/blog/comparing-document-position/
jQuery.fn.compare = function(element){ //usually 
	try{
		// Firefox 3 throws an error with XUL - we can't use compare then
		element = element.jquery ? element[0] : element;
	}catch(e){
		return null;
	}

	// make sure we aren't coming from XUL element
	if (window.HTMLElement) {
		var s = HTMLElement.prototype.toString.call(element)
		if (s == '[xpconnect wrapped native prototype]' || s == '[object XULElement]' || s === '[object Window]') {
			return null;
		}
	}

	if(this[0].compareDocumentPosition){
		// For browsers that support it, use compareDocumentPosition
		// https://developer.mozilla.org/en/DOM/Node.compareDocumentPosition
		return this[0].compareDocumentPosition(element);
	}

	// this[0] contains element
	if(this[0] == document && element != document) return 8;

	var number =
			// this[0] contains element
			(this[0] !== element && this[0].contains(element) && 16) +
			// element contains this[0]
			(this[0] != element && element.contains(this[0]) && 8),
		docEl = document.documentElement;

	// Use the sourceIndex
	if(this[0].sourceIndex){
		// this[0] precedes element
		number += (this[0].sourceIndex < element.sourceIndex && 4)
		// element precedes foo[0]
		number += (this[0].sourceIndex > element.sourceIndex && 2)
		// The nodes are in different documents
		number += (this[0].ownerDocument !== element.ownerDocument ||
			(this[0] != docEl && this[0].sourceIndex <= 0 ) ||
			(element != docEl && element.sourceIndex <= 0 )) && 1
	}

	return number;
}

})(jQuery);
(function($){
    /**
     * @page jQuery.toJSON jQuery.toJSON
     * @parent jquerymx.lang
     * 
     *     jQuery.toJSON( json-serializble )
     * 
     * Converts the given argument into a JSON respresentation.
     * 
     * If an object has a "toJSON" function, that will 
     * be used to get the representation.
     * Non-integer/string keys are skipped in the 
     * object, as are keys that point to a function.
     * 
     * json-serializble:
     * The *thing* to be converted.
     */
    $.toJSON = function(o, replacer, space, recurse)
    {
        if (typeof(JSON) == 'object' && JSON.stringify)
            return JSON.stringify(o, replacer, space);

        if (!recurse && $.isFunction(replacer))
            o = replacer("", o);

        if (typeof space == "number")
            space = "          ".substring(0, space);
        space = (typeof space == "string") ? space.substring(0, 10) : "";
        
        var type = typeof(o);
    
        if (o === null)
            return "null";
    
        if (type == "undefined" || type == "function")
            return undefined;
        
        if (type == "number" || type == "boolean")
            return o + "";
    
        if (type == "string")
            return $.quoteString(o);
    
        if (type == 'object')
        {
            if (typeof o.toJSON == "function") 
                return $.toJSON( o.toJSON(), replacer, space, true );
            
            if (o.constructor === Date)
            {
                var month = o.getUTCMonth() + 1;
                if (month < 10) month = '0' + month;

                var day = o.getUTCDate();
                if (day < 10) day = '0' + day;

                var year = o.getUTCFullYear();
                
                var hours = o.getUTCHours();
                if (hours < 10) hours = '0' + hours;
                
                var minutes = o.getUTCMinutes();
                if (minutes < 10) minutes = '0' + minutes;
                
                var seconds = o.getUTCSeconds();
                if (seconds < 10) seconds = '0' + seconds;
                
                var milli = o.getUTCMilliseconds();
                if (milli < 100) milli = '0' + milli;
                if (milli < 10) milli = '0' + milli;

                return '"' + year + '-' + month + '-' + day + 'T' +
                             hours + ':' + minutes + ':' + seconds + 
                             '.' + milli + 'Z"'; 
            }

            var process = ($.isFunction(replacer)) ?
                function (k, v) { return replacer(k, v); } :
                function (k, v) { return v; },
                nl = (space) ? "\n" : "",
                sp = (space) ? " " : "";

            if (o.constructor === Array) 
            {
                var ret = [];
                for (var i = 0; i < o.length; i++)
                    ret.push(( $.toJSON( process(i, o[i]), replacer, space, true ) || "null" ).replace(/^/gm, space));

                return "[" + nl + ret.join("," + nl) + nl + "]";
            }
        
            var pairs = [], proplist;
            if ($.isArray(replacer)) {
                proplist = $.map(replacer, function (v) {
                    return (typeof v == "string" || typeof v == "number") ?
                        v + "" :
                        null;
                });
            }
            for (var k in o) {
                var name, val, type = typeof k;

                if (proplist && $.inArray(k + "", proplist) == -1)
                    continue;

                if (type == "number")
                    name = '"' + k + '"';
                else if (type == "string")
                    name = $.quoteString(k);
                else
                    continue;  //skip non-string or number keys
            
                val = $.toJSON( process(k, o[k]), replacer, space, true );
            
                if (typeof val == "undefined")
                    continue;  //skip pairs where the value is a function.
            
                pairs.push((name + ":" + sp + val).replace(/^/gm, space));
            }

            return "{" + nl + pairs.join("," + nl) + nl + "}";
        }
    };

    /** 
     * @function jQuery.evalJSON
     * Evaluates a given piece of json source.
     **/
    $.evalJSON = function(src)
    {
        if (typeof(JSON) == 'object' && JSON.parse)
            return JSON.parse(src);
        return eval("(" + src + ")");
    };
    
    /** 
     * @function jQuery.secureEvalJSON
     * Evals JSON in a way that is *more* secure.
     **/
    $.secureEvalJSON = function(src)
    {
        if (typeof(JSON) == 'object' && JSON.parse)
            return JSON.parse(src);
        
        var filtered = src;
        filtered = filtered.replace(/\\["\\\/bfnrtu]/g, '@');
        filtered = filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
        filtered = filtered.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
        
        if (/^[\],:{}\s]*$/.test(filtered))
            return eval("(" + src + ")");
        else
            throw new SyntaxError("Error parsing JSON, source is not valid.");
    };

    /** 
     * @function jQuery.quoteString
     * 
     * Returns a string-repr of a string, escaping quotes intelligently.  
     * Mostly a support function for toJSON.
     * 
     * Examples:
     * 
     *      jQuery.quoteString("apple") //-> "apple"
     * 
     *      jQuery.quoteString('"Where are we going?", she asked.')
     *        // -> "\"Where are we going?\", she asked."
     **/
    $.quoteString = function(string)
    {
        if (string.match(_escapeable))
        {
            return '"' + string.replace(_escapeable, function (a) 
            {
                var c = _meta[a];
                if (typeof c === 'string') return c;
                c = a.charCodeAt();
                return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
            }) + '"';
        }
        return '"' + string + '"';
    };
    
    var _escapeable = /["\\\x00-\x1f\x7f-\x9f]/g;
    
    var _meta = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
    };
})(jQuery);
(function() {
    /**
     * @function jQuery.cookie
     * @parent jquerypp
     * @plugin jquery/dom/cookie
     * @author Klaus Hartl/klaus.hartl@stilbuero.de
     *
     * `jQuery.cookie(name, [value], [options])` lets you create, read and remove cookies. It is the
     * [jQuery cookie plugin](https://github.com/carhartl/jquery-cookie) written by [Klaus Hartl](stilbuero.de)
     * and dual licensed under the [MIT](http://www.opensource.org/licenses/mit-license.php)
     * and [GPL](http://www.gnu.org/licenses/gpl.html) licenses.
     *
	 * ## Examples
	 * 
	 * Set the value of a cookie.
	 *  
	 *      $.cookie('the_cookie', 'the_value');
	 * 
	 * Create a cookie with all available options.
	 *
     *      $.cookie('the_cookie', 'the_value', {
     *          expires: 7,
     *          path: '/',
     *          domain: 'jquery.com',
     *          secure: true
     *      });
	 *
	 * Create a session cookie.
	 *
     *      $.cookie('the_cookie', 'the_value');
	 *
	 * Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
	 * used when the cookie was set.
	 *
     *      $.cookie('the_cookie', null);
	 *
	 * Get the value of a cookie.
     *
	 *      $.cookie('the_cookie');
     *
     * @param {String} [name] The name of the cookie.
     * @param {String} [value] The value of the cookie.
     * @param {Object} [options] An object literal containing key/value pairs to provide optional cookie attributes. Values can be:
     *
     * - `expires` - Either an integer specifying the expiration date from now on in days or a Date object. If a negative value is specified (e.g. a date in the past), the cookie will be deleted. If set to null or omitted, the cookie will be a session cookie and will not be retained when the the browser exits.
     * - `domain` - The domain name
     * - `path` - The value of the path atribute of the cookie (default: path of page that created the cookie).
     * - `secure` - If true, the secure attribute of the cookie will be set and the cookie transmission will require a secure protocol (like HTTPS).
     *
     * @return {String} the value of the cookie or {undefined} when setting the cookie.
     */
    jQuery.cookie = function(name, value, options) {
        if (typeof value != 'undefined') {
            // name and value given, set cookie
            options = options ||
            {};
            if (value === null) {
                value = '';
                options.expires = -1;
            }
	        // convert value to JSON string
            if (typeof value == 'object' && jQuery.toJSON) {
                value = jQuery.toJSON(value);
            }
            var expires = '';
	        // Set expiry
            if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                var date;
                if (typeof options.expires == 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                }
                else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
            }
            // CAUTION: Needed to parenthesize options.path and options.domain
            // in the following expressions, otherwise they evaluate to undefined
            // in the packed version for some reason...
            var path = options.path ? '; path=' + (options.path) : '';
            var domain = options.domain ? '; domain=' + (options.domain) : '';
            var secure = options.secure ? '; secure' : '';
	        // Set the cookie name=value;expires=;path=;domain=;secure-
            document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
        }
        else { // only name given, get cookie
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
	                    // Get the cookie value
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
	        // Parse JSON from the cookie into an object
            if (jQuery.evalJSON && cookieValue && cookieValue.match(/^\s*\{/)) {
                try {
                    cookieValue = jQuery.evalJSON(cookieValue);
                }
                catch (e) {
                }
            }
            return cookieValue;
        }
    };

})(jQuery);
(function($) {

var
	//margin is inside border
	weird = /button|select/i,
	getBoxes = {},
    checks = {
        width: ["Left", "Right"],
        height: ['Top', 'Bottom'],
        oldOuterHeight: $.fn.outerHeight,
        oldOuterWidth: $.fn.outerWidth,
        oldInnerWidth: $.fn.innerWidth,
        oldInnerHeight: $.fn.innerHeight
    };

$.each({ 

/**
 * @function jQuery.fn.outerWidth
 * @parent jQuery.dimensions
 *
 * `jQuery.fn.outerWidth([value], [includeMargins])` lets you set
 * the outer width of an object where:
 *
 *      outerWidth = width + padding + border + (margin)
 *
 * And can be used like:
 *
 *      $("#foo").outerWidth(100); //sets outer width
 *      $("#foo").outerWidth(100, true); // uses margins
 *      $("#foo").outerWidth(); //returns outer width
 *      $("#foo").outerWidth(true); //returns outer width + margins
 *
 * When setting the outerWidth, it adjusts the width of the element.
 * If *includeMargin* is set to `true` margins will also be included.
 * It is also possible to animate the outer width:
 * 
 *      $('#foo').animate({ outerWidth: 200 });
 *
 * @param {Number} [width] The width to set
 * @param {Boolean} [includeMargin=false] Makes setting the outerWidth adjust
 * for margins.
 * @return {jQuery|Number} Returns the outer width or the jQuery wrapped elements
 * if you are setting the outer width.
 */
width: 
/**
 * @function jQuery.fn.innerWidth
 * @parent jQuery.dimensions
 *
 * `jQuery.fn.innerWidth([value])` lets you set the inner width of an element where
 * 
 *      innerWidth = width + padding
 *      
 * Use it like:
 *
 *      $("#foo").innerWidth(100); //sets inner width
 *      $("#foo").outerWidth(); // returns inner width
 *      
 * Or in an animation like:
 * 
 *      $('#foo').animate({ innerWidth : 200 });
 *
 * Setting inner width adjusts the width of the element.
 *
 * @param {Number} [width] The inner width to set
 * @return {jQuery|Number} Returns the inner width or the jQuery wrapped elements
 * if you are setting the inner width.
 */
"Width", 
/**
 * @function jQuery.fn.outerHeight
 * @parent jQuery.dimensions
 *
 * `jQuery.fn.outerHeight([value], [includeMargins])` lets
 * you set the outer height of an object where:
 *
 *      outerHeight = height + padding + border + (margin)
 *
 * And can be used like:
 *
 *      $("#foo").outerHeight(100); //sets outer height
 *      $("#foo").outerHeight(100, true); // uses margins
 *      $("#foo").outerHeight(); //returns outer height
 *      $("#foo").outerHeight(true); //returns outer height + margins
 *
 * When setting the outerHeight, it adjusts the height of the element.
 * If *includeMargin* is set to `true` margins will also be included.
 * It is also possible to animate the outer heihgt:
 *
 *      $('#foo').animate({ outerHeight : 200 });
 *
 * @param {Number} [height] The height to set
 * @param {Boolean} [includeMargin=false] Makes setting the outerHeight adjust
 * for margins.
 * @return {jQuery|Number} Returns the outer height or the jQuery wrapped elements
 * if you are setting the outer height.
 */
height: 
/**
 * @function jQuery.fn.innerHeight
 * @parent jQuery.dimensions
 *
 * `jQuery.fn.innerHeight([value])` lets you set the inner height of an element where
 *
 *      innerHeight = height + padding
 *
 * Use it like:
 *
 *      $("#foo").innerHeight(100); //sets inner height
 *      $("#foo").outerHeight(); // returns inner height
 *
 * Or in an animation like:
 *
 *      $('#foo').animate({ innerHeight : 200 });
 *
 * Setting inner height adjusts the height of the element.
 *
 * @param {Number} [height] The inner height to set
 * @return {jQuery|Number} Returns the inner height or the jQuery wrapped elements
 * if you are setting the inner height.
 */
// for each 'height' and 'width'
"Height" }, function(lower, Upper) {

    //used to get the padding and border for an element in a given direction
    getBoxes[lower] = function(el, boxes) {
        var val = 0;
        if (!weird.test(el.nodeName)) {
            //make what to check for ....
            var myChecks = [];
            $.each(checks[lower], function() {
                var direction = this;
                $.each(boxes, function(name, val) {
                    if (val)
                        myChecks.push(name + direction+ (name == 'border' ? "Width" : "") );
                })
            })
            $.each($.styles(el, myChecks), function(name, value) {
                val += (parseFloat(value) || 0);
            })
        }
        return val;
    }

    //getter / setter
    $.fn["outer" + Upper] = function(v, margin) {
        var first = this[0];
		if (typeof v == 'number') {
			// Setting the value
            first && this[lower](v - getBoxes[lower](first, {padding: true, border: true, margin: margin}))
            return this;
        } else {
			// Return the old value
            return first ? checks["oldOuter" + Upper].call(this, v) : null;
        }
    }
    $.fn["inner" + Upper] = function(v) {
        var first = this[0];
		if (typeof v == 'number') {
			// Setting the value
            first&& this[lower](v - getBoxes[lower](first, { padding: true }))
            return this;
        } else {
			// Return the old value
            return first ? checks["oldInner" + Upper].call(this, v) : null;
        }
    }
    //provides animations
	var animate = function(boxes){
		// Return the animation function
		return function(fx){
			if (fx.state == 0) {
	            fx.start = $(fx.elem)[lower]();
	            fx.end = fx.end - getBoxes[lower](fx.elem,boxes);
	        }
	        fx.elem.style[lower] = (fx.pos * (fx.end - fx.start) + fx.start) + "px"
		}
	}
    $.fx.step["outer" + Upper] = animate({padding: true, border: true})
	$.fx.step["outer" + Upper+"Margin"] =  animate({padding: true, border: true, margin: true})
	$.fx.step["inner" + Upper] = animate({padding: true})

})

})(jQuery);
(function($){
	// Checks if x and y coordinates are within a box with left, top, width and height
   var withinBox = function(x, y, left, top, width, height ){
        return (y >= top &&
                y <  top + height &&
                x >= left &&
                x <  left + width);
    } 
/**
 * @function jQuery.fn.within
 * @parent jQuery.within
 * @plugin jquery/dom/within
 * 
 * Returns all elements matching the selector that touch a given point:
 * 
 *     // get all elements that touch 200x200.
 *     $('*').within(200, 200);
 * 
 * @param {Number} left the position from the left of the page 
 * @param {Number} top the position from the top of the page
 * @param {Boolean} [useOffsetCache=false] cache the dimensions and offset of the elements.
 * @return {jQuery} a jQuery collection of elements whos area
 * overlaps the element position.
 */
$.fn.within= function(left, top, useOffsetCache) {
    var ret = []
    this.each(function(){
        var q = jQuery(this);

        if (this == document.documentElement) {
			return ret.push(this);
		}

	    // uses either the cached offset or .offset()
        var offset = useOffsetCache ? 
						jQuery.data(this,"offsetCache") || jQuery.data(this,"offsetCache", q.offset()) : 
						q.offset();

        // Check if the given coordinates are within the area of the current element
	    var res =  withinBox(left, top,  offset.left, offset.top,
                                    this.offsetWidth, this.offsetHeight );

        if (res) {
	        // Add it to the results
			ret.push(this);
		}
    });
    
    return this.pushStack( jQuery.unique( ret ), "within", left+","+top );
}


/**
 * @function jQuery.fn.withinBox
 * @parent jQuery.within
 *
 * Returns all elements matching the selector that have a given area in common:
 *
 *      $('*').withinBox(200, 200, 100, 100)
 *
 * @param {Number} left the position from the left of the page
 * @param {Number} top the position from the top of the page
 * @param {Number} width the width of the area
 * @param {Number} height the height of the area
 * @param {Boolean} [useOffsetCache=false] cache the dimensions and offset of the elements.
 * @return {jQuery} a jQuery collection of elements whos area
 * overlaps the element position.
 */
$.fn.withinBox = function(left, top, width, height, useOffsetCache){
	var ret = []
    this.each(function(){
        var q = jQuery(this);

        if(this == document.documentElement) return  ret.push(this);

	    // use cached offset or .offset()
        var offset = cache ? 
			jQuery.data(this,"offset") || 
			jQuery.data(this,"offset", q.offset()) : 
			q.offset();


        var ew = q.width(), eh = q.height(),
	        // Checks if the element offset is within the given box
	        res =  !( (offset.top > top+height) || (offset.top +eh < top) || (offset.left > left+width ) || (offset.left+ew < left));

        if(res)
            ret.push(this);
    });
    return this.pushStack( jQuery.unique( ret ), "withinBox", jQuery.makeArray(arguments).join(",") );
}
    
})(jQuery);
(function( $ ) {
	/**
	 * @attribute destroyed
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/dom/destroyed/destroyed.js
	 * @test jquery/event/destroyed/qunit.html
	 */

	// Store the old jQuery.cleanData
	var oldClean = jQuery.cleanData;

	// Overwrites cleanData which is called by jQuery on manipulation methods
	$.cleanData = function( elems ) {
		for ( var i = 0, elem;
		(elem = elems[i]) !== undefined; i++ ) {
			// Trigger the destroyed event
			$(elem).triggerHandler("destroyed");
		}
		// Call the old jQuery.cleanData
		oldClean(elems);
	};

})(jQuery);
(function($){
	var getSetZero = function(v){ return v !== undefined ? (this.array[0] = v) : this.array[0] },
		getSetOne = function(v){ return v !== undefined ? (this.array[1] = v) : this.array[1]};

/**
 * @class jQuery.Vector
 * @parent jquerypp
 *
 * `jQuery.Vector` represents a multi dimensional vector with shorthand methods for
 * working with two dimensions.
 *
 * It is mainly used in [jQuery.event.drag drag] & [jQuery.event.drop drop] events.
 *
 * @constructor creates a new vector instance from the arguments.  Example:
 *
 *      new jQuery.Vector(1,2)
 */
	$.Vector = function(arr) {
		var array = $.isArray(arr) ? arr : $.makeArray(arguments);
		this.update(array);
	};
	$.Vector.prototype =
	/* @Prototype*/
	{
		/**
		 * Applys the function to every item in the vector and returns a new vector.
		 *
		 * @param {Function} f The function to apply
		 * @return {jQuery.Vector} A new $.Vector instance
		 */
		app: function( f ) {
			var i, newArr = [];

			for ( i = 0; i < this.array.length; i++ ) {
				newArr.push(f(this.array[i], i));
			}
			return new $.Vector(newArr);
		},
		/**
		 * Adds two vectors together and returns a new instance. Example:
		 *
		 *      new $.Vector(1,2).plus(2,3) //-> (3, 5)
		 *      new $.Vector(3,5).plus(new Vector(4,5)) //-> (7, 10)
		 *
		 * @return {$.Vector}
		 */
		plus: function() {
			var i, args = arguments[0] instanceof $.Vector ? arguments[0].array : $.makeArray(arguments),
				arr = this.array.slice(0),
				vec = new $.Vector();
			for ( i = 0; i < args.length; i++ ) {
				arr[i] = (arr[i] ? arr[i] : 0) + args[i];
			}
			return vec.update(arr);
		},
		/**
		 * Subtract one vector from another and returns a new instance. Example:
		 *
		 *      new $.Vector(4, 5).minus(2, 1) //-> (2, 4)
		 *
		 * @return {jQuery.Vector}
		 */
		minus: function() {
			var i, args = arguments[0] instanceof $.Vector ? arguments[0].array : $.makeArray(arguments),
				arr = this.array.slice(0),
				vec = new $.Vector();
			for ( i = 0; i < args.length; i++ ) {
				arr[i] = (arr[i] ? arr[i] : 0) - args[i];
			}
			return vec.update(arr);
		},
		/**
		 * Returns the current vector if it is equal to the vector passed in.
		 *
		 * `null` if otherwise.
		 *
		 * @return {jQuery.Vector}
		 */
		equals: function() {
			var i, args = arguments[0] instanceof $.Vector ? arguments[0].array : $.makeArray(arguments),
				arr = this.array.slice(0),
				vec = new $.Vector();
			for ( i = 0; i < args.length; i++ ) {
				if ( arr[i] != args[i] ) {
					return null;
				}
			}
			return vec.update(arr);
		},
		/**
		 * Returns the first value of the vector.
		 * You can also access the same value through the following aliases the
		 * [jQuery.Vector.prototype.left vector.left()] and [jQuery.Vector.prototype.left vector.width()]
		 * aliases.
		 *
		 * For example:
		 *
		 *      var v = new $.Vector(2, 5);
		 *      v.x() //-> 2
		 *      v.left() //-> 2
		 *      v.width() //-> 2
		 *
		 * @return {Number} The first value of the vector
		 */
		x: getSetZero,
		/**
		 * @hide
		 * Alias for [jQuery.Vector.prototype.x].
		 *
		 * @return {Number}
		 */
		left: getSetZero,
		/**
		 * @hide
		 * Alias for [jQuery.Vector.prototype.x].
		 *
		 * @return {Number}
		 */
		width: getSetZero,
		/**
		 * Returns the second value of the vector.
		 * You can also access the same value through the [jQuery.Vector.prototype.top vector.top()]
		 * and [jQuery.Vector.prototype.height vector.height()] aliases.
		 *
		 * For example:
		 *
		 *      var v = new $.Vector(2, 5);
		 *      v.y() //-> 5
		 *      v.top() //-> 5
		 *      v.height() //-> 5
		 *
		 * @return {Number} The first value of the vector
		 */
		y: getSetOne,
		/**
		 * @hide
		 * Alias for [jQuery.Vector.prototype.y].
		 *
		 * @return {Number}
		 */
		top: getSetOne,
		/**
		 * @hide
		 * Alias for [jQuery.Vector.prototype.y].
		 *
		 * @return {Number}
		 */
		height: getSetOne,
		/**
		 * Returns a string representation of the vector in the form of (x,y,...)
		 *
		 *      var v = new $.Vector(4, 6, 1, 3);
		 *      v.toString() //-> (4, 6, 1, 3)
		 *
		 * @return {String}
		 */
		toString: function() {
			return "(" + this.array.join(', ') + ")";
		},
		/**
		 * Replaces the vectors contents
		 *
		 *      var v = new $.Vector(2, 3);
		 *
		 * @param {Object} array
		 */
		update: function( array ) {
			var i;
			if ( this.array ) {
				for ( i = 0; i < this.array.length; i++ ) {
					delete this.array[i];
				}
			}
			this.array = array;
			for ( i = 0; i < array.length; i++ ) {
				this[i] = this.array[i];
			}
			return this;
		}
	};

	$.Event.prototype.vector = function() {
		var
			// Get the first touch element for touch events
			touches = "ontouchend" in document && this.originalEvent.touches.length ? this.originalEvent.touches[0] : this;
		if ( this.originalEvent.synthetic ) {
			var doc = document.documentElement,
				body = document.body;
			return new $.Vector(touches.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0),
				touches.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0));
		} else {
			return new $.Vector(touches.pageX, touches.pageY);
		}
	};

	$.fn.offsetv = function() {
		if ( this[0] == window ) {
			return new $.Vector(window.pageXOffset ? window.pageXOffset : document.documentElement.scrollLeft, window.pageYOffset ? window.pageYOffset : document.documentElement.scrollTop);
		} else {
			var offset = this.offset();
			return new $.Vector(offset.left, offset.top);
		}
	};

	$.fn.dimensionsv = function( which ) {
		if ( this[0] == window || !which ) {
			return new $.Vector(this.width(), this.height());
		}
		else {
			return new $.Vector(this[which + "Width"](), this[which + "Height"]());
		}
	};
})(jQuery);
(function() {

	var event = jQuery.event,

		//helper that finds handlers by type and calls back a function, this is basically handle
		// events - the events object
		// types - an array of event types to look for
		// callback(type, handlerFunc, selector) - a callback
		// selector - an optional selector to filter with, if there, matches by selector
		//     if null, matches anything, otherwise, matches with no selector
		findHelper = function( events, types, callback, selector ) {
			var t, type, typeHandlers, all, h, handle, 
				namespaces, namespace,
				match;
			for ( t = 0; t < types.length; t++ ) {
				type = types[t];
				all = type.indexOf(".") < 0;
				if (!all ) {
					namespaces = type.split(".");
					type = namespaces.shift();
					namespace = new RegExp("(^|\\.)" + namespaces.slice(0).sort().join("\\.(?:.*\\.)?") + "(\\.|$)");
				}
				typeHandlers = (events[type] || []).slice(0);

				for ( h = 0; h < typeHandlers.length; h++ ) {
					handle = typeHandlers[h];
					
					match = (all || namespace.test(handle.namespace));
					
					if(match){
						if(selector){
							if (handle.selector === selector  ) {
								callback(type, handle.origHandler || handle.handler);
							}
						} else if (selector === null){
							callback(type, handle.origHandler || handle.handler, handle.selector);
						}
						else if (!handle.selector ) {
							callback(type, handle.origHandler || handle.handler);
							
						} 
					}
					
					
				}
			}
		};

	/**
	 * Finds event handlers of a given type on an element.
	 * @param {HTMLElement} el
	 * @param {Array} types an array of event names
	 * @param {String} [selector] optional selector
	 * @return {Array} an array of event handlers
	 */
	event.find = function( el, types, selector ) {
		var events = ( $._data(el) || {} ).events,
			handlers = [],
			t, liver, live;

		if (!events ) {
			return handlers;
		}
		findHelper(events, types, function( type, handler ) {
			handlers.push(handler);
		}, selector);
		return handlers;
	};
	/**
	 * Finds all events.  Group by selector.
	 * @param {HTMLElement} el the element
	 * @param {Array} types event types
	 */
	event.findBySelector = function( el, types ) {
		var events = $._data(el).events,
			selectors = {},
			//adds a handler for a given selector and event
			add = function( selector, event, handler ) {
				var select = selectors[selector] || (selectors[selector] = {}),
					events = select[event] || (select[event] = []);
				events.push(handler);
			};

		if (!events ) {
			return selectors;
		}
		//first check live:
		/*$.each(events.live || [], function( i, live ) {
			if ( $.inArray(live.origType, types) !== -1 ) {
				add(live.selector, live.origType, live.origHandler || live.handler);
			}
		});*/
		//then check straight binds
		findHelper(events, types, function( type, handler, selector ) {
			add(selector || "", type, handler);
		}, null);

		return selectors;
	};
	event.supportTouch = "ontouchend" in document;
	
	$.fn.respondsTo = function( events ) {
		if (!this.length ) {
			return false;
		} else {
			//add default ?
			return event.find(this[0], $.isArray(events) ? events : [events]).length > 0;
		}
	};
	$.fn.triggerHandled = function( event, data ) {
		event = (typeof event == "string" ? $.Event(event) : event);
		this.trigger(event, data);
		return event.handled;
	};
	/**
	 * Only attaches one event handler for all types ...
	 * @param {Array} types llist of types that will delegate here
	 * @param {Object} startingEvent the first event to start listening to
	 * @param {Object} onFirst a function to call 
	 */
	event.setupHelper = function( types, startingEvent, onFirst ) {
		if (!onFirst ) {
			onFirst = startingEvent;
			startingEvent = null;
		}
		var add = function( handleObj ) {

			var bySelector, selector = handleObj.selector || "";
			if ( selector ) {
				bySelector = event.find(this, types, selector);
				if (!bySelector.length ) {
					$(this).delegate(selector, startingEvent, onFirst);
				}
			}
			else {
				//var bySelector = event.find(this, types, selector);
				if (!event.find(this, types, selector).length ) {
					event.add(this, startingEvent, onFirst, {
						selector: selector,
						delegate: this
					});
				}

			}

		},
			remove = function( handleObj ) {
				var bySelector, selector = handleObj.selector || "";
				if ( selector ) {
					bySelector = event.find(this, types, selector);
					if (!bySelector.length ) {
						$(this).undelegate(selector, startingEvent, onFirst);
					}
				}
				else {
					if (!event.find(this, types, selector).length ) {
						event.remove(this, startingEvent, onFirst, {
							selector: selector,
							delegate: this
						});
					}
				}
			};
		$.each(types, function() {
			event.special[this] = {
				add: add,
				remove: remove,
				setup: function() {},
				teardown: function() {}
			};
		});
	};
})(jQuery);
(function( $ ) {
	//modify live
	//steal the live handler ....
	var bind = function( object, method ) {
			var args = Array.prototype.slice.call(arguments, 2);
			return function() {
				var args2 = [this].concat(args, $.makeArray(arguments));
				return method.apply(object, args2);
			};
		},
		event = $.event,
		// function to clear the window selection if there is one
		clearSelection = window.getSelection ? function(){
			window.getSelection().removeAllRanges()
		} : function(){},

		supportTouch = "ontouchend" in document,
		// Use touch events or map it to mouse events
		startEvent = supportTouch ? "touchstart" : "mousedown",
		stopEvent = supportTouch ? "touchend" : "mouseup",
		moveEvent = supportTouch ? "touchmove" : "mousemove",
		// On touchmove events the default (scrolling) event has to be prevented
		preventTouchScroll = function(ev) {
			ev.preventDefault();
		};

	/**
	 * @class jQuery.Drag
	 * @parent jQuery.event.drag
	 * @plugin jquery/event/drag
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/event/drag/drag.js
	 * @test jquery/event/drag/qunit.html
	 *
	 * The `$.Drag` constructor is never called directly but an instance of `$.Drag` is passed as the second argument
	 * to the `dragdown`, `draginit`, `dragmove`, `dragend`, `dragover` and `dragout` event handlers:
	 *
	 *      $('#dragger').on('draginit', function(el, drag) {
	 *          // drag -> $.Drag
	 *      });
	 */
	$.Drag = function() {};

	/**
	 * @Static
	 */
	$.extend($.Drag, {
		lowerName: "drag",
		current: null,
		distance: 0,
		/**
		 * Called when someone mouses down on a draggable object.
		 * Gathers all callback functions and creates a new Draggable.
		 * @hide
		 */
		mousedown: function( ev, element ) {
			var isLeftButton = ev.button === 0 || ev.button == 1,
				doEvent = isLeftButton || supportTouch;

			if (!doEvent || this.current ) {
				return;
			}

			//create Drag
			var drag = new $.Drag(),
				delegate = ev.delegateTarget || element,
				selector = ev.handleObj.selector,
				self = this;
			this.current = drag;

			drag.setup({
				element: element,
				delegate: ev.delegateTarget || element,
				selector: ev.handleObj.selector,
				moved: false,
				_distance: this.distance,
				callbacks: {
					dragdown: event.find(delegate, ["dragdown"], selector),
					draginit: event.find(delegate, ["draginit"], selector),
					dragover: event.find(delegate, ["dragover"], selector),
					dragmove: event.find(delegate, ["dragmove"], selector),
					dragout: event.find(delegate, ["dragout"], selector),
					dragend: event.find(delegate, ["dragend"], selector)
				},
				destroyed: function() {
					self.current = null;
				}
			}, ev);
		}
	});

	/**
	 * @Prototype
	 */
	$.extend($.Drag.prototype, {
		setup: function( options, ev ) {
			$.extend(this, options);

			this.element = $(this.element);
			this.event = ev;
			this.moved = false;
			this.allowOtherDrags = false;
			var mousemove = bind(this, this.mousemove),
				mouseup = bind(this, this.mouseup);
			this._mousemove = mousemove;
			this._mouseup = mouseup;
			this._distance = options.distance ? options.distance : 0;

			//where the mouse is located
			this.mouseStartPosition = ev.vector();

			$(document).bind(moveEvent, mousemove);
			$(document).bind(stopEvent, mouseup);
			if(supportTouch) {
				// On touch devices we want to disable scrolling
				$(document).bind(moveEvent, preventTouchScroll);
			}

			if (!this.callEvents('down', this.element, ev) ) {
			    this.noSelection(this.delegate);
				//this is for firefox
				clearSelection();
			}
		},
		/**
		 * @attribute element
		 * A reference to the element that is being dragged. For example:
		 *
		 *      $('.draggable').on('draginit', function(ev, drag) {
		 *          drag.element.html('I am the drag element');
		 *      });
		 */

		/**
		 * Unbinds listeners and allows other drags ...
		 * @hide
		 */
		destroy: function() {
			// Unbind the mouse handlers attached for dragging
			$(document).unbind(moveEvent, this._mousemove);
			$(document).unbind(stopEvent, this._mouseup);
			if(supportTouch) {
				// Enable scrolling again for touch devices when the drag is done
				$(document).unbind(moveEvent, preventTouchScroll);
			}

			if (!this.moved ) {
				this.event = this.element = null;
			}

			if(!supportTouch) {
                this.selection(this.delegate);
			}
			this.destroyed();
		},
		mousemove: function( docEl, ev ) {
			if (!this.moved ) {
				var dist = Math.sqrt( Math.pow( ev.pageX - this.event.pageX, 2 ) + Math.pow( ev.pageY - this.event.pageY, 2 ));
				// Don't initialize the drag if it hasn't been moved the minimum distance
				if(dist < this._distance){
					return false;
				}
				// Otherwise call init and indicate that the drag has moved
				this.init(this.element, ev);
				this.moved = true;
			}

			var pointer = ev.vector();
			if ( this._start_position && this._start_position.equals(pointer) ) {
				return;
			}
			this.draw(pointer, ev);
		},
		
		mouseup: function( docEl, event ) {
			//if there is a current, we should call its dragstop
			if ( this.moved ) {
				this.end(event);
			}
			this.destroy();
		},

        /**
         * The `drag.noSelection(element)` method turns off text selection during a drag event.
         * This method is called by default unless a event is listening to the 'dragdown' event.
         *
         * ## Example
         *
         *      $('div.drag').bind('dragdown', function(elm,event,drag){
         *          drag.noSelection();
         *      });
         *      
         * @param [elm] an element to prevent selection on.  Defaults to the dragable element.
         */
		noSelection: function(elm) {
            elm = elm || this.delegate
			document.documentElement.onselectstart = function() {
                // Disables selection
				return false;
			};
			document.documentElement.unselectable = "on";
			this.selectionDisabled = (this.selectionDisabled ? this.selectionDisabled.add(elm) : $(elm));
			this.selectionDisabled.css('-moz-user-select', '-moz-none');
		},

        /**
         * @hide
         * `drag.selection()` method turns on text selection that was previously turned off during the drag event.
         * This method is always called.
         * 
         * ## Example
         *
         *     $('div.drag').bind('dragdown', function(elm,event,drag){
         *       drag.selection();
         *     });
         */
		selection: function() {
            if(this.selectionDisabled) {
                document.documentElement.onselectstart = function() {};
                document.documentElement.unselectable = "off";
                this.selectionDisabled.css('-moz-user-select', '');
            }
		},

		init: function( element, event ) {
			element = $(element);
			//the element that has been clicked on
			var startElement = (this.movingElement = (this.element = $(element)));
			//if a mousemove has come after the click
			//if the drag has been cancelled
			this._cancelled = false;
			this.event = event;
			
			/**
			 * @attribute mouseElementPosition
			 * The position of start of the cursor on the element
			 */
			this.mouseElementPosition = this.mouseStartPosition.minus(this.element.offsetv()); //where the mouse is on the Element
			this.callEvents('init', element, event);

			// Check what they have set and respond accordingly if they canceled
			if ( this._cancelled === true ) {
				return;
			}
			// if they set something else as the element
			this.startPosition = startElement != this.movingElement ? this.movingElement.offsetv() : this.currentDelta();

			this.makePositioned(this.movingElement);
			// Adjust the drag elements z-index to a high value
			this.oldZIndex = this.movingElement.css('zIndex');
			this.movingElement.css('zIndex', 1000);
			if (!this._only && this.constructor.responder ) {
				// calls $.Drop.prototype.compile if there is a drop element
				this.constructor.responder.compile(event, this);
			}
		},
		makePositioned: function( that ) {
			var style, pos = that.css('position');

			// Position properly, set top and left to 0px for Opera
			if (!pos || pos == 'static' ) {
				style = {
					position: 'relative'
				};

				if ( window.opera ) {
					style.top = '0px';
					style.left = '0px';
				}
				that.css(style);
			}
		},
		callEvents: function( type, element, event, drop ) {
			var i, cbs = this.callbacks[this.constructor.lowerName + type];
			for ( i = 0; i < cbs.length; i++ ) {
				cbs[i].call(element, event, this, drop);
			}
			return cbs.length;
		},
		/**
		 * Returns the position of the movingElement by taking its top and left.
		 * @hide
		 * @return {$.Vector}
		 */
		currentDelta: function() {
			return new $.Vector(parseInt(this.movingElement.css('left'), 10) || 0, parseInt(this.movingElement.css('top'), 10) || 0);
		},
		//draws the position of the dragmove object
		draw: function( pointer, event ) {
			// only drag if we haven't been cancelled;
			if ( this._cancelled ) {
				return;
			}
			clearSelection();
			/**
			 * @attribute location
			 * `drag.location` is a [jQuery.Vector] specifying where the element should be in the page.  This
			 * takes into account the start position of the cursor on the element.
			 * 
			 * If the drag is going to be moved to an unacceptable location, you can call preventDefault in
			 * dragmove to prevent it from being moved there.
			 * 
			 *     $('.mover').bind("dragmove", function(ev, drag){
			 *       if(drag.location.top() < 100){
			 *         ev.preventDefault()
			 *       }
			 *     });
			 *     
			 * You can also set the location to where it should be on the page.
			 * 
			 */
				// the offset between the mouse pointer and the representative that the user asked for
			this.location = pointer.minus(this.mouseElementPosition);

			// call move events
			this.move(event);
			if ( this._cancelled ) {
				return;
			}
			if (!event.isDefaultPrevented() ) {
				this.position(this.location);
			}

			// fill in
			if (!this._only && this.constructor.responder ) {
				this.constructor.responder.show(pointer, this, event);
			}
		},
		/**
		 * `drag.position( newOffsetVector )` sets the position of the movingElement.  This is overwritten by
		 * the [$.Drag::scrolls], [$.Drag::limit] and [$.Drag::step] plugins 
		 * to make sure the moving element scrolls some element
		 * or stays within some boundary.  This function is exposed and documented so you could do the same.
		 * 
		 * The following approximates how step does it:
		 * 
		 *     var oldPosition = $.Drag.prototype.position;
		 *     $.Drag.prototype.position = function( offsetPositionv ) {
		 *       if(this._step){
		 *         // change offsetPositionv to be on the step value
		 *       }
		 *       
		 *       oldPosition.call(this, offsetPosition)
		 *     }
		 * 
		 * @param {jQuery.Vector} newOffsetv the new [$.Drag::location] of the element.
		 */
		position: function( newOffsetv ) { //should draw it on the page
			var style, dragged_element_css_offset = this.currentDelta(),
				//  the drag element's current left + top css attributes
				// the vector between the movingElement's page and css positions
				// this can be thought of as the original offset
				dragged_element_position_vector =   this.movingElement.offsetv().minus(dragged_element_css_offset);
			this.required_css_position = newOffsetv.minus(dragged_element_position_vector);

			this.offsetv = newOffsetv;
			style = this.movingElement[0].style;
			if (!this._cancelled && !this._horizontal ) {
				style.top = this.required_css_position.top() + "px";
			}
			if (!this._cancelled && !this._vertical ) {
				style.left = this.required_css_position.left() + "px";
			}
		},
		move: function( event ) {
			this.callEvents('move', this.element, event);
		},
		over: function( event, drop ) {
			this.callEvents('over', this.element, event, drop);
		},
		out: function( event, drop ) {
			this.callEvents('out', this.element, event, drop);
		},
		/**
		 * Called on drag up
		 * @hide
		 * @param {Event} event a mouseup event signalling drag/drop has completed
		 */
		end: function( event ) {
			// If canceled do nothing
			if ( this._cancelled ) {
				return;
			}
			// notify the responder - usually a $.Drop instance
			if (!this._only && this.constructor.responder ) {
				this.constructor.responder.end(event, this);
			}

			this.callEvents('end', this.element, event);

			if ( this._revert ) {
				var self = this;
				// animate moving back to original position
				this.movingElement.animate({
					top: this.startPosition.top() + "px",
					left: this.startPosition.left() + "px"
				}, function() {
					self.cleanup.apply(self, arguments);
				});
			}
			else {
				this.cleanup();
			}
			this.event = null;
		},
		/**
		 * Cleans up drag element after drag drop.
		 * @hide
		 */
		cleanup: function() {
			this.movingElement.css({
				zIndex: this.oldZIndex
			});
			if ( this.movingElement[0] !== this.element[0] && 
				!this.movingElement.has(this.element[0]).length && 
				!this.element.has(this.movingElement[0]).length ) {
				this.movingElement.css({
					display: 'none'
				});
			}
			if ( this._removeMovingElement ) {
				// Remove the element when using drag.ghost()
				this.movingElement.remove();
			}

			this.movingElement = this.element = this.event = null;
		},
		/**
		 * `drag.cancel()` stops a drag motion from from running.  This also stops any other events from firing, meaning
		 * that "dragend" will not be called.
		 * 
		 *     $("#todos").on(".handle", "draginit", function( ev, drag ) {
		 *       if(drag.movingElement.hasClass("evil")){
		 *         drag.cancel();	
		 *       }
		 *     })
		 * 
		 */
		cancel: function() {
			this._cancelled = true;
			if (!this._only && this.constructor.responder ) {
				// clear the drops
				this.constructor.responder.clear(this.event.vector(), this, this.event);
			}
			this.destroy();

		},
		/**
		 * `drag.ghost( [parent] )` clones the element and uses it as the 
		 * moving element, leaving the original dragged element in place.  The `parent` option can
		 * be used to specify where the ghost element should be temporarily added into the 
		 * DOM.  This method should be called in "draginit".
		 * 
		 *     $("#todos").on(".handle", "draginit", function( ev, drag ) {
		 *       drag.ghost();
		 *     })
		 * 
		 * @param {HTMLElement} [parent] the parent element of the newly created ghost element. If not provided the 
		 * ghost element is added after the moving element.
		 * @return {jQuery.fn} the ghost element to do whatever you want with it.
		 */
		ghost: function( parent ) {
			// create a ghost by cloning the source element and attach the clone to the dom after the source element
			var ghost = this.movingElement.clone().css('position', 'absolute');
			if( parent ) {
				$(parent).append(ghost);
			} else {
				$(this.movingElement).after(ghost)
			}
			ghost.width(this.movingElement.width()).height(this.movingElement.height());
			// put the ghost in the right location ...
			ghost.offset(this.movingElement.offset())
			
			// store the original element and make the ghost the dragged element
			this.movingElement = ghost;
			this.noSelection(ghost)
			this._removeMovingElement = true;
			return ghost;
		},
		/**
		 * `drag.representative( element, [offsetX], [offsetY])` tells the drag motion to use
		 * a different element than the one that began the drag motion. 
		 * 
		 * For example, instead of
		 * dragging an drag-icon of a todo element, you want to move some other representation of
		 * the todo element (or elements).  To do this you might:
		 * 
		 *     $("#todos").on(".handle", "draginit", function( ev, drag ) {
		 *       // create what we'll drag
		 *       var rep = $('<div/>').text("todos")
		 *         .appendTo(document.body)
		 *       // indicate we want our mouse on the top-right of it
		 *       drag.representative(rep, rep.width(), 0);
		 *     })
		 * 
		 * @param {HTMLElement} element the element you want to actually drag.  This should be 
		 * already in the DOM.
		 * @param {Number} offsetX the x position where you want your mouse on the representative element (defaults to 0)
		 * @param {Number} offsetY the y position where you want your mouse on the representative element (defaults to 0)
		 * @return {drag} returns the drag object for chaining.
		 */
		representative: function( element, offsetX, offsetY ) {
			this._offsetX = offsetX || 0;
			this._offsetY = offsetY || 0;

			var p = this.mouseStartPosition;
			// Just set the representative as the drag element
			this.movingElement = $(element);
			this.movingElement.css({
				top: (p.y() - this._offsetY) + "px",
				left: (p.x() - this._offsetX) + "px",
				display: 'block',
				position: 'absolute'
			}).show();
			this.noSelection(this.movingElement)
			this.mouseElementPosition = new $.Vector(this._offsetX, this._offsetY);
			return this;
		},
		/**
		 * `drag.revert([val])` makes the [$.Drag::representative representative] element revert back to it
		 * original position after the drag motion has completed.  The revert is done with an animation.
		 * 
		 *     $("#todos").on(".handle","dragend",function( ev, drag ) {
		 *       drag.revert();
		 *     })
		 * 
		 * @param {Boolean} [val] optional, set to false if you don't want to revert.
		 * @return {drag} the drag object for chaining
		 */
		revert: function( val ) {
			this._revert = val === undefined ? true : val;
			return this;
		},
		/**
		 * `drag.vertical()` isolates the drag to vertical movement.  For example:
		 * 
		 *     $("#images").on(".thumbnail","draginit", function(ev, drag){
		 *       drag.vertical();
		 *     });
		 * 
		 * Call `vertical()` in "draginit" or "dragdown".
		 * 
		 * @return {drag} the drag object for chaining.
		 */
		vertical: function() {
			this._vertical = true;
			return this;
		},
		/**
		 * `drag.horizontal()` isolates the drag to horizontal movement.  For example:
		 * 
		 *     $("#images").on(".thumbnail","draginit", function(ev, drag){
		 *       drag.horizontal();
		 *     });
		 * 
		 * Call `horizontal()` in "draginit" or "dragdown".
		 * 
		 * @return {drag} the drag object for chaining.
		 */
		horizontal: function() {
			this._horizontal = true;
			return this;
		},
		/**
		 * `drag.only([only])` indicates if you __only__ want a drag motion and the drag should
		 * not notify drops.  The default value is `false`.  Call it with no arguments or pass it true
		 * to prevent drop events.
		 * 
		 *     $("#images").on(".thumbnail","dragdown", function(ev, drag){
		 * 	     drag.only();
		 *     });
		 * 
		 * @param {Boolean} [only] true if you want to prevent drops, false if otherwise.
		 * @return {Boolean} the current value of only.
		 */
		only: function( only ) {
			return (this._only = (only === undefined ? true : only));
		},
		
		/**
		 * `distance([val])` sets or reads the distance the mouse must move before a drag motion is started.  This should be set in
		 * "dragdown" and delays "draginit" being called until the distance is covered.  The distance
		 * is measured in pixels.  The default distance is 0 pixels meaning the drag motion starts on the first
		 * mousemove after a mousedown.
		 * 
		 * Set this to make drag motion a little "stickier" to start.
		 * 
		 *     $("#images").on(".thumbnail","dragdown", function(ev, drag){
		 *       drag.distance(10);
		 *     });
		 * 
		 * @param {Number} [val] The number of pixels the mouse must move before "draginit" is called.
		 * @return {drag|Number} returns the drag instance for chaining if the drag value is being set or the
		 * distance value if the distance is being read.
		 */
		distance: function(val){
			if(val !== undefined){
				this._distance = val;
				return this;
			}else{
				return this._distance
			}
		}
	});
	/**
	 * @add jQuery.event.special
	 */
	event.setupHelper([
	/**
	 * @attribute dragdown
	 * @parent jQuery.event.drag
	 * 
	 * `dragdown` is called when a drag movement has started on a mousedown.
	 * The event handler gets an instance of [jQuery.Drag] passed as the second
	 * parameter.  Listening to `dragdown` allows you to customize 
	 * the behavior of a drag motion, especially when `draginit` should be called.
	 * 
	 *     $(".handles").delegate("dragdown", function(ev, drag){
	 *       // call draginit only when the mouse has moved 20 px
	 *       drag.distance(20);
	 *     })
	 * 
	 * Typically, when a drag motion is started, `event.preventDefault` is automatically
	 * called, preventing text selection.  However, if you listen to 
	 * `dragdown`, this default behavior is not called. You are responsible for calling it
	 * if you want it (you probably do).
	 *
	 * ### Why might you not want to call `preventDefault`?
	 *
	 * You might want it if you want to allow text selection on element
	 * within the drag element.  Typically these are input elements.
	 *
	 *     $(".handles").delegate("dragdown", function(ev, drag){
	 *       if(ev.target.nodeName === "input"){
	 *         drag.cancel();
	 *       } else {
	 *         ev.preventDefault();
	 *       }
	 *     })
	 */
	'dragdown',
	/**
	 * @attribute draginit
	 * @parent jQuery.event.drag
	 *
	 * `draginit` is triggered when the drag motion starts. Use it to customize the drag behavior
	 * using the [jQuery.Drag] instance passed as the second parameter:
	 *
	 *     $(".draggable").on('draginit', function(ev, drag) {
	 *       // Only allow vertical drags
	 *       drag.vertical();
	 *       // Create a draggable copy of the element
	 *       drag.ghost();
	 *     });
	 */
	'draginit',
	/**
	 * @attribute dragover
	 * @parent jQuery.event.drag
	 *
	 * `dragover` is triggered when a drag is over a [jQuery.event.drop drop element].
	 * The event handler gets an instance of [jQuery.Drag] passed as the second
	 * parameter and an instance of [jQuery.Drop] passed as the third argument:
	 *
	 *      $('.draggable').on('dragover', function(ev, drag, drop) {
	 *          // Add the drop-here class indicating that the drag
	 *          // can be dropped here
	 *          drag.element.addClass('drop-here');
	 *      });
	 */
	'dragover',
	/**
	 * @attribute dragmove
	 * @parent jQuery.event.drag
	 *
	 * `dragmove` is triggered when the drag element moves (similar to a mousemove).
	 * The event handler gets an instance of [jQuery.Drag] passed as the second
	 * parameter.
	 * Use [jQuery.Drag::location] to determine the current position
	 * as a [jQuery.Vector vector].
	 *
	 * For example, `dragmove` can be used to create a draggable element to resize
	 * a container:
	 *
	 *      $('.resizer').on('dragmove', function(ev, drag) {
	 *          $('#container').width(drag.location.x())
	 *              .height(drag.location.y());
	 *      });
	 */
	'dragmove',
	/**
	 * @attribute dragout
	 * @parent jQuery.event.drag
	 *
	 * `dragout` is called when the drag leaves a drop point.
	 * The event handler gets an instance of [jQuery.Drag] passed as the second
	 * parameter.
	 *
	 *      $('.draggable').on('dragout', function(ev, drag) {
	 *      	 // Remove the drop-here class
	 *      	 // (e.g. crossing the drag element out indicating that it
	 *      	 // can't be dropped here
	 *          drag.element.removeClass('drop-here');
	 *      });
	 */
	'dragout',
	/**
	 * @attribute dragend
	 * @parent jQuery.event.drag
	 *
	 * `dragend` is called when the drag motion is done.
	 * The event handler gets an instance of [jQuery.Drag] passed as the second
	 * parameter.
	 *
	 *     $('.draggable').on('dragend', function(ev, drag)
	 *       // Clean up when the drag motion is done
	 *     });
	 */
	'dragend'], startEvent, function( e ) {
		$.Drag.mousedown.call($.Drag, e, this);
	});
})(jQuery);
(function($){
	var event = $.event;
	/**
	 * @add jQuery.event.special
	 */
	var eventNames = [
	/**
	 * @attribute dropover
	 * @parent jQuery.event.drop
	 * 
	 * `dropover` is triggered when a [jQuery.event.drag drag] is first moved onto this
	 * drop element.
	 * The event handler gets an instance of [jQuery.Drag] passed as the second and a
	 * [jQuery.Drop] as the third parameter.
	 * This event can be used to highlight the element when a drag is moved over it:
	 *
	 *      $('.droparea').on('dropover', function(ev, drop, drag) {
	 *          $(this).addClass('highlight');
	 *      });
	 */
	"dropover",
	/**
	 * @attribute dropon
	 * @parent jQuery.event.drop
	 * 
	 * `dropon` is triggered when a drag is dropped on a drop element.
	 * The event handler gets an instance of [jQuery.Drag] passed as the second and a
	 * [jQuery.Drop] as the third parameter.
	 *
	 *      $('.droparea').on('dropon', function(ev, drop, drag) {
	 *          $(this).html('Dropped: ' + drag.element.text());
	 *      });
	 */
	"dropon",
	/**
	 * @attribute dropout
	 * @parent jQuery.event.drop
	 * 
	 * `dropout` is called when a drag is moved out of this drop element.
	 * The event handler gets an instance of [jQuery.Drag] passed as the second and a
	 * [jQuery.Drop] as the third parameter.
	 *
	 *      $('.droparea').on('dropover', function(ev, drop, drag) {
	 *          // Remove the drop element highlight
	 *          $(this).removeClass('highlight');
	 *      });
	 */
	"dropout",
	/**
	 * @attribute dropinit
	 * @parent jQuery.event.drop
	 * 
	 * `dropinit` is called when a drag motion starts and the drop elements are initialized.
	 * The event handler gets an instance of [jQuery.Drag] passed as the second and a
	 * [jQuery.Drop] as the third parameter.
	 * Calling [jQuery.Drop.prototype.cancel drop.cancel()] prevents the element from
	 * being dropped on:
	 *
	 *      $('.droparea').on('dropover', function(ev, drop, drag) {
	 *          if(drag.element.hasClass('not-me')) {
	 *            drop.cancel();
	 *          }
	 *      });
	 */
	"dropinit",
	/**
	 * @attribute dropmove
	 * @parent jQuery.event.drop
	 * 
	 * `dropmove` is triggered repeatedly when a drag is moved over a drop
	 * (similar to a mousemove).
	 * The event handler gets an instance of [jQuery.Drag] passed as the second and a
	 * [jQuery.Drop] as the third parameter.
	 *
	 *      $('.droparea').on('dropmove', function(ev, drop, drag) {
	 *          $(this).html(drag.location.x() + '/' + drag.location.y());
	 *      });
	 */
	"dropmove",
	/**
	 * @attribute dropend
	 * @parent jQuery.event.drop
	 * 
	 * `dropend` is called when the drag motion is done for this drop element.
	 * The event handler gets an instance of [jQuery.Drag] passed as the second and a
	 * [jQuery.Drop] as the third parameter.
	 *
	 *
	 *      $('.droparea').on('dropend', function(ev, drop, drag) {
	 *          // Remove the drop element highlight
	 *          $(this).removeClass('highlight');
	 *      });
	 */
	"dropend"];
	
	/**
	 * @class jQuery.Drop
	 * @parent jQuery.event.drop
	 * @plugin jquery/event/drop
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/event/drop/drop.js
	 * @test jquery/event/drag/qunit.html
	 *
	 * The `jQuery.Drop` constructor is never called directly but an instance is passed to the
	 * to the `dropinit`, `dropover`, `dropmove`, `dropon`, and `dropend` event handlers as the
	 * third argument (the second will be the [jQuery.Drag]):
	 *
	 *      $('#dropper').on('dropover', function(el, drop, drag) {
	 *          // drop -> $.Drop
	 *          // drag -> $.Drag
	 *      });
	 */
	$.Drop = function(callbacks, element){
		jQuery.extend(this,callbacks);
		this.element = $(element);
	}
	// add the elements ...
	$.each(eventNames, function(){
			event.special[this] = {
				add: function( handleObj ) {
					//add this element to the compiles list
					var el = $(this), current = (el.data("dropEventCount") || 0);
					el.data("dropEventCount",  current+1   )
					if(current==0){
						$.Drop.addElement(this);
					}
				},
				remove: function() {
					var el = $(this), current = (el.data("dropEventCount") || 0);
					el.data("dropEventCount",  current-1   )
					if(current<=1){
						$.Drop.removeElement(this);
					}
				}
			}
	});
	
	$.extend($.Drop,{
		/**
		 * @static
		 */
		lowerName: "drop",
		_rootElements: [], //elements that are listening for drops
		_elements: $(),    //elements that can be dropped on
		last_active: [],
		endName: "dropon",
		// adds an element as a 'root' element
		// this element might have events that we need to respond to
		addElement: function( el ) {
			// check other elements
			for(var i =0; i < this._rootElements.length ; i++  ){
				if(el ==this._rootElements[i]) return;
			}
			this._rootElements.push(el);
		},
		removeElement: function( el ) {
			 for(var i =0; i < this._rootElements.length ; i++  ){
				if(el == this._rootElements[i]){
					this._rootElements.splice(i,1)
					return;
				}
			}
		},
		/**
		* @hide
		* For a list of affected drops, sorts them by which is deepest in the DOM first.
		*/ 
		sortByDeepestChild: function( a, b ) {
			// Use jQuery.compare to compare two elements
			var compare = a.element.compare(b.element);
			if(compare & 16 || compare & 4) return 1;
			if(compare & 8 || compare & 2) return -1;
			return 0;
		},
		/**
		 * @hide
		 * Tests if a drop is within the point.
		 */
		isAffected: function( point, moveable, responder ) {
			return ((responder.element != moveable.element) && (responder.element.within(point[0], point[1], responder._cache).length == 1));
		},
		/**
		 * @hide
		 * Calls dropout and sets last active to null
		 * @param {Object} drop
		 * @param {Object} drag
		 * @param {Object} event
		 */
		deactivate: function( responder, mover, event ) {
			mover.out(event, responder)
			responder.callHandlers(this.lowerName+'out',responder.element[0], event, mover)
		}, 
		/**
		 * @hide
		 * Calls dropover
		 * @param {Object} drop
		 * @param {Object} drag
		 * @param {Object} event
		 */
		activate: function( responder, mover, event ) { //this is where we should call over
			mover.over(event, responder)
			responder.callHandlers(this.lowerName+'over',responder.element[0], event, mover);
		},
		move: function( responder, mover, event ) {
			responder.callHandlers(this.lowerName+'move',responder.element[0], event, mover)
		},
		/**
		 * `$.Drop.compile()` gets all elements that are droppable and adds them to a list.
		 * 
		 * This should be called if and when new drops are added to the page
		 * during the motion of a single drag.
		 * 
		 * This is called by default when a drag motion starts.
		 * 
		 * ## Use
		 * 
		 * After adding an element or drop, call compile.
		 * 
		 *      $("#midpoint").bind("dropover",function(){
		 * 		    // when a drop hovers over midpoint,
		 *          // make drop a drop.
		 * 		    $("#drop").bind("dropover", function(){
		 * 			
		 * 		    });
		 * 		    $.Drop.compile();
		 * 	    });
		 */
		compile: function( event, drag ) {
			// if we called compile w/o a current drag
			if(!this.dragging && !drag){
				return;
			}else if(!this.dragging){
				this.dragging = drag;
				this.last_active = [];
			}
			var el, 
				drops, 
				selector, 
				dropResponders, 
				newEls = [],
				dragging = this.dragging;
			
			// go to each root element and look for drop elements
			for(var i=0; i < this._rootElements.length; i++){ //for each element
				el = this._rootElements[i]
				
				// gets something like {"": ["dropinit"], ".foo" : ["dropover","dropmove"] }
				var drops = $.event.findBySelector(el, eventNames)

				// get drop elements by selector
				for(selector in drops){ 
					dropResponders = selector ? jQuery(selector, el) : [el];
					
					// for each drop element
					for(var e= 0; e < dropResponders.length; e++){ 
						
						// add the callbacks to the element's Data
						// there already might be data, so we merge it
						if( this.addCallbacks(dropResponders[e], drops[selector], dragging) ){
							newEls.push(dropResponders[e])
						};
					}
				}
			}
			// once all callbacks are added, call init on everything ...
			this.add(newEls, event, dragging)
		},

		// adds the drag callbacks object to the element or merges other callbacks ...
		// returns true or false if the element is new ...
		// onlyNew lets only new elements add themselves
		addCallbacks : function(el, callbacks, onlyNew){
			var origData = $.data(el,"_dropData");
			if(!origData){
				$.data(el,"_dropData", new $.Drop(callbacks, el));
				return true;
			}else if(!onlyNew){
				var origCbs = origData;
				// merge data
				for(var eventName in callbacks){
					origCbs[eventName] = origCbs[eventName] ?
							origCbs[eventName].concat(callbacks[eventName]) :
							callbacks[eventName];
				}
				return false;
			}
		},
		// calls init on each element's drags. 
		// if its cancelled it's removed
		// adds to the current elements ...
		add: function( newEls, event, drag , dragging) {
			var i = 0,
				drop;
			
			while(i < newEls.length){
				drop = $.data(newEls[i],"_dropData");
				drop.callHandlers(this.lowerName+'init', newEls[i], event, drag)
				if(drop._canceled){
					newEls.splice(i,1)
				}else{
					i++;
				}
			}
			this._elements.push.apply(this._elements, newEls)
		},
		show: function( point, moveable, event ) {
			var element = moveable.element;
			if(!this._elements.length) return;
			
			var respondable, 
				affected = [], 
				propagate = true, 
				i = 0, 
				j, 
				la, 
				toBeActivated, 
				aff, 
				oldLastActive = this.last_active,
				responders = [],
				self = this,
				drag;
				
			// what's still affected ... we can also move element out here
			while( i < this._elements.length){
				drag = $.data(this._elements[i],"_dropData");
				
				if (!drag) {
					this._elements.splice(i, 1)
				}
				else {
					i++;
					if (self.isAffected(point, moveable, drag)) {
						affected.push(drag);
					}
				}
			}

			// we should only trigger on lowest children
			affected.sort(this.sortByDeepestChild);
			event.stopRespondPropagate = function(){
				propagate = false;
			}
			
			toBeActivated = affected.slice();

			// all these will be active
			this.last_active = affected;
			
			// deactivate everything in last_active that isn't active
			for (j = 0; j < oldLastActive.length; j++) {
				la = oldLastActive[j];
				i = 0;
				while((aff = toBeActivated[i])){
					if(la == aff){
						toBeActivated.splice(i,1);break;
					}else{
						i++;
					}
				}
				if(!aff){
					this.deactivate(la, moveable, event);
				}
				if(!propagate) return;
			}
			for(var i =0; i < toBeActivated.length; i++){
				this.activate(toBeActivated[i], moveable, event);
				if(!propagate) return;
			}

			// activate everything in affected that isn't in last_active
			for (i = 0; i < affected.length; i++) {
				this.move(affected[i], moveable, event);
				
				if(!propagate) return;
			}
		},
		end: function( event, moveable ) {
			var responder, la, 
				endName = this.lowerName+'end',
				dropData;
			
			// call dropon
			// go through the actives ... if you are over one, call dropped on it
			for(var i = 0; i < this.last_active.length; i++){
				la = this.last_active[i]
				if( this.isAffected(event.vector(), moveable, la)  && la[this.endName]){
					la.callHandlers(this.endName, null, event, moveable);
				}
			}
			// call dropend
			for(var r =0; r<this._elements.length; r++){
				dropData = $.data(this._elements[r],"_dropData");
				dropData && dropData.callHandlers(endName, null, event, moveable);
			}

			this.clear();
		},
		/**
		 * Called after dragging has stopped.
		 * @hide
		 */
		clear: function() {
		  this._elements.each(function(){
			 // remove temporary drop data
		  	$.removeData(this,"_dropData")
		  })
		  this._elements = $();
		  delete this.dragging;
		}
	})
	$.Drag.responder = $.Drop;
	
	$.extend($.Drop.prototype,{
		/**
		 * @prototype
		 */
		callHandlers: function( method, el, ev, drag ) {
			var length = this[method] ? this[method].length : 0
			for(var i =0; i < length; i++){
				this[method][i].call(el || this.element[0], ev, this, drag)
			}
		},
		/**
		 * `drop.cache(value)` sets the drop to cache positions of draggable elements.
		 * This should be called on `dropinit`. For example:
		 *
		 *      $('#dropable').on('dropinit', function( el, ev, drop ) {
		 *          drop.cache();
		 *      });
		 *
		 * @param {Boolean} [value=true] Whether to cache drop elements or not.
		 */
		cache: function( value ) {
			this._cache = value != null ? value : true;
		},
		/**
		 * `drop.cancel()` prevents this drop from being dropped on.
		 *
		 *      $('.droparea').on('dropover', function(ev, drop, drag) {
		 *          if(drag.element.hasClass('not-me')) {
		 *            drop.cancel();
		 *          }
		 *      });
		 */
		cancel: function() {
			this._canceled = true;
		}
	} )
})(jQuery)