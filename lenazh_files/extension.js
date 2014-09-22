/**
 * extensions to basic javascript functions and objects
 */
// bbOnLoad is called from the body's onload
// executes all the stuff in bbOnLoadRegistry
function bbOnLoad () {
	if (window.bbOnLoadRegistry != null) {
		for (var i = 0; i < window.bbOnLoadRegistry.length; i++) {
			var f = new Function('a ', ' ' + window.bbOnLoadRegistry[i] + ' ');
			f();
		}
	}
	if (isIE6 ()) {
		// init the mouseover effects on tables
		initIEHover ();
	}
	var agent = navigator.userAgent.toLowerCase ();
	//Mozilla and IE fix for anchored navigation
	if (agent.indexOf ('mozilla') != -1 && agent.indexOf ('msie') == -1) {
		if (location.href.indexOf ('#') != -1) {
			location.href = location.href;
		}
	}
  
  //Internet fix
  if(window.initOrderedTableRows!=null){
    window.initOrderedTableRows ();
  }
}
// is internet explorer version smaller than seven
function isIE(){
	return (!window.ActiveXObject) ? false : ((window.XMLHttpRequest) ? ((document.querySelectorAll) ? 6 : 5) : 4);
}
function isIE6 () {
	if (isIE()) {
		if (/MSIE (\d+\.\d+);/.test (navigator.userAgent)) {
			var ieversion = new Number (RegExp.$1);
			if (ieversion < 7) {
				return true;
			}
		}
	}
	return false;
}

function ieHover (tr, over) {
	tr.className = '' + tr.className.replace ('iehover', '');
	if (over) {
		tr.className += ' iehover';
	}
}

function initIEHover () {
	var table = document.getElementById('datatable');
	if (table) {
		for (var i = 0; i < table.tBodies[0].childNodes.length; i++) {
			table.tBodies[0].childNodes[i].onmouseover = function () {ieHover (this, true);};
			table.tBodies[0].childNodes[i].onmouseout = function () {ieHover (this, false);};
		}
	}
}

// register a function for onload-execution
function registerOnLoad (_function) {
	if (window.bbOnLoadRegistry == null) {
		window.bbOnLoadRegistry = new Array ();
	}
	window.bbOnLoadRegistry[bbOnLoadRegistry.length] = _function;
}

// register a function for onsubmit-execution
function registerOnSubmit (_function) {
	if (window.bbOnSubmitRegistry == null) {
		window.bbOnSubmitRegistry = new Array ();
	}
	window.bbOnSubmitRegistry[window.bbOnSubmitRegistry.length] = _function;
}

// returns true if the given object is an array
function isArray (obj) {
	return (obj.length && obj.length > 0);
/*	// nice idea, but does not work in safari....
	if (obj.constructor.toString ().indexOf ("Array") == -1) return false;
	else return true;
*/
}

// returns the keycode either from the given event (ff) or window.event (ie)
function getKeyCode (e) {
	if (!e) {
		e = window.event;
	}
	return (!e ? '' : (e.code ? e.code : (e.keyCode ? e.keyCode : e.which)));
	//return (!e ? '' : (e.keyCode ? e.keyCode : e.which));
}

function isEnterKey (e) {
	return (getKeyCode (e) == 13);
}

function isEscapeKey (e) {
	return (getKeyCode (e) == 27);
}

// returns a positive integer if the given string is entirely composed of chars from 0 to 9
/// <todo>+- should be allowed at first position too</todo>
/// <todo>. should be allowed once</todo>
function isNumeric (input) {
	return (input.match (/[0-9]*/) + '').length > 0;
}
