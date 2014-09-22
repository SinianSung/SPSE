var bbLockRegistry = new Array ();
var bbPageSize = 20;
var bbMenuID = -1;
var bbOnLoadRegistry;
var bbOnSubmitRegistry;
var bbErrorFieldNames = new Array ();

// submits the form, adding the nosave parameter if it is set to true
// component: can be the form itself, or any object within a form
function submitForm (component, noSave) {
	// if component is a form, just submit it
	if (component && component.nodeName.toLowerCase () == 'form') {
		if (noSave) {
			var hidden = AJS.INPUT ({ type: 'hidden', value: 'nosave', name: 'form_nosave' });
			component.appendChild (hidden);
		}
		component.submit ();
	}
	// if component is not a form, find its surrounding form tag and submit that
	else {
		component = AJS.getParentBytc (component, 'form', null);
		submitForm (component, noSave);
	}
}


function reloadByGet(){
  var url = location.href;
  url += url.indexOf('?')!=-1?'&':'?';
  url += "mn="+new Date().getTime();
  var obj = findObject('form_id');
  if(obj!=null){
    url += '&id='+obj.value;
  }
  location.href = url;
}

// Focuses the first visible textfield
function setFocus (form) {
	if (!document.documentclicked) {
		var f = document.forms[form];
		if (f != null) {
			// do we have errors? focus first erroneus field
			if (bbErrorFieldNames && bbErrorFieldNames.length > 0) {
				var errorElements = new Array ();
				for (ii = 0; ii < bbErrorFieldNames.length; ii++) {
					var element = null;
					element = AJS.getElement ('form_' + bbErrorFieldNames[ii]);
					if (element && isFocusable (element)) {
						errorElements[errorElements.length] = element;
					}
					else if (element) {
						// the element exists but it's not focusable
						// try to find next focusable field in same tr.inputerror
						var tr = AJS.getParentBytc (element, 'tr', 'inputerror');
						if (tr) {
							// we have the surrounding tr, get all inputs
							var innerElements = AJS.getElementsByTagAndClassName ('input', null, tr);
							for (var jj = 0; jj < innerElements.length; jj++) {
								if (isFocusable (innerElements[jj])) {
									errorElements[errorElements.length] = innerElements[jj];
								}
							}
						}
					}
					else {
						element = AJS.getElement (bbErrorFieldNames[ii]);
						if (element && isFocusable (element)) {
							errorElements[errorElements.length] = element;
						}
					}
				}
				setFocusOnFirstElement (errorElements, null, true);
			}
			else {
				setFocusOnFirstElement (f.elements);
			}
		}
		// set focus to first available form if one
		else {
			var pos = 0;
			// don't focus search form and searchsave/constraintsave
			while (document.forms[pos] && document.forms[pos].id.substr (0, 6) == 'search' && pos < document.forms.length) {
				pos++;
			}
			if (pos < document.forms.length && document.forms[pos] != null) {
				setFocusOnFirstElement (document.forms[pos].elements);
			}
		}
	}
	//Init show error
	if (window.bbShowRelationsDBRecordName != null) {
		var f = document.forms[form];
		if (f != null) {
			var id = findObject ('form_id', f);
			if (id != null && id.value != null && id.value.trim ().length > 0) {
				var td = AJS.getElementsByTagAndClassName ('td', 'showrelations', f, true);
				if (td != null) {
					var a = AJS.getElementsByTagAndClassName ('a', null, td, true);
					if (a != null) {
						a.href = 'javascript:openPopup(\'' + createURL ('administration/maintenance', 'showrelations', bbMenuID, 'id=' + id.value + '&dbrecordname='+window.bbShowRelationsDBRecordName) + '\', 700, 600)';
						a.style.display = 'block';
					}
				}
			}
		}
	}
}

// elements can be an array of inputs or any container (div, etc.) inside the form
// optional: container is the container surrounding the inputs
// optional: showParents if this is true the first element will be focused and all it's parents will be made visible (tabs for example)
function setFocusOnFirstElement (elements, container, showParents) {
	if (elements != null) {
		// it's an array
		if (isArray (elements)) {
			for (var i = 0; i < elements.length; i++) {
				var input = elements[i];
				// if there's no container just take the first visible input
				// if container is specified, check whether the input is within this container
				if (!container || (container && input && AJS.hasParent (input, container, 30)))  {
					if (isFocusable (input)) {
						if (isInputVisible (input)) {
							try {
								if (input.fckEditorObject) {
									input.fckEditorObject.Focus ();
								}
								else {
									input.focus ();
									if (input.select != null) {
										input.select ();
									}
								}
							} catch (ex) { }
							break;
						}
						else if (showParents) {
							var parent = elements[i];
							// get any parent which is a tab and display='none'
							while (parent = parent.parentNode) {
								if (parent.style && parent.className == 'tabwrapper') {
									if (parent.style.display == 'none') {
										activateTab (parent.id.replace ('bbtabcontent_', ''));
										break;
									}
								}
							}
							try {
								if (input.fckEditorObject) {
									input.fckEditorObject.Focus ();
								}
								else {
									input.focus ();
									if (input.select != null) {
										input.select ();
									}
								}
							} catch (ex) { }
							break;
						}
					}
				}
			}
		}
		// we received a container (i.e. a tab) on which we will focus the first input
		else {
			// get the surrounding form
			var container = elements;
			elements = new Array ();
			try {
				var f = AJS.getParentBytc (container, 'form');
				if (f && f.elements) {
					setFocusOnFirstElement (f.elements, container);
				}
			} catch (ex) {}
		}
	}
}

function isFocusable (element) {
	if (element != null) {
		// don't focus the buttons in the formhead (div id="formhead")
		if (!isInFormHead (element) && element.nodeName) {
			var nodeName = element.nodeName.toLowerCase ();
			var type = (element.type != null) ? element.type.toLowerCase () : '';
			var isReadOnly = (element.readOnly != null) ? element.readOnly : false;
			var isVisible = (element.style != null && element.style.visibility != null && element.style.visibility.toLowerCase () == 'hidden') ? false : true;
			var isDisplaied = (element.style != null && element.style.display != null && element.style.display.toLowerCase () == 'none') ? false : true;
			//add checkbox and radio, don't know why not... fugusimon
			var types = 'text,password,button,submit,checkbox,radio';
//			alert (element.name + ':' + type + ':' + (readOnly == true ? 'true' : 'false') + ':' + (visible == true ? 'true' : 'false') + ':' + (display == true ? 'true' : 'false'));
			if (!isReadOnly && isVisible && isDisplaied && ((',' + types + ',').indexOf (',' + type + ',') != -1 || nodeName == 'textarea' || nodeName == 'select')) {
				return true;
			}
			else if (element.nodeName.toLowerCase () == 'textarea' && element.id) {
				// maybe we have an fck editor here?
				try {
					var editor = FCKeditorAPI.GetInstance (element.id);
					if (editor != null) {
						// alert ('we have an editor here: ' + element.id + ': ' + editor);
						var iFrame = AJS.getElement (element.id + '___Frame');
						// check if the editor's iframe is focusable
						isReadOnly = (iFrame.readOnly != null) ? iFrame.readOnly : false;
						isVisible = (iFrame.style != null && iFrame.style.visibility != null && iFrame.style.visibility.toLowerCase () == 'hidden') ? false : true;
						isDisplaied = (iFrame.style != null && iFrame.style.display != null && iFrame.style.display.toLowerCase () == 'none') ? false : true;
						if (!isReadOnly && isVisible && isDisplaied) {
							// store the editor on the textarea
							element.fckEditorObject = editor;
							return true;
						}
					}
				} catch (ex) { /* if fckeditor is not even defined, there can't be one :) */ }
			}
		}
	}
	return false;
}

function isInputVisible (input) {
	if (input) {
		// if there are tabs get the selected one and find out if the input type is on it
		return !hasInvisibleParents (input);
	}
	// default
	return false;
}

function isInFormHead (element) {
	while (element.parentNode) {
		if (element.tagName == 'DIV' && element.id == 'formhead') {
			return true;
		}
		element = element.parentNode;
	}
	return false;
}

function hasInvisibleParents (element) {
	var p = element.parentNode;
	while (p) {
		if (p.style) {
			if (p.style.display && p.style.display == 'none') {
				return true;
			}
		}
		p = p.parentNode;
	}
	return false;
}

/**
 * function to be called by each form before submission
 */
function bbOnSubmit (form) {
	//setSubmitRequest (true);
	if (form) {
		// check if locks are lost
		if (document.bbLocksLost) {
			//Try to get the getLowerOwner function from registry
			var fgetLockOwner;
			if (bbOnLoadRegistry != null) {
				for (var i in bbOnLoadRegistry) {
					if (bbOnLoadRegistry[i].toLowerCase ().trim ().indexOf ('getlockowner') == 0) {
						fgetLockOwner = bbOnLoadRegistry[i];
						break;
					}
				}
			}
			if (fgetLockOwner != null) {
				var elm = AJS.getElement ('lockindicator0');
				if (elm != null) {
					var els = elm.parentNode.getElementsByTagName ('div');
					if (els.length > 0){
						els[0].style.display = 'block';
						var f = new Function ('a ', ' ' + fgetLockOwner + ' ');
						f ();
					}
				}
			}
			return false;
		}
		// check if this form has a pwd field
		var fields = AJS.getElementsByTagAndClassName ('input', null, form);
		for (i = 0; i < fields.length; i++) {
			if (fields[i].getAttribute ('type') && fields[i].getAttribute ('type').toLowerCase () == 'password') {
				// if there is a hidden field next to the password field, copy md5 value and empty password field
				if (fields[i].value) {
					var next = fields[i].nextSibling;
					if (next != null && next.tagName.toLowerCase () == 'input' && next.getAttribute ('type') && next.getAttribute ('type').toLowerCase () == 'hidden') {
						//Default pwd set, do nothing
						if (fields[i].value != '*****') {
              if(window.hex_md5==null){
                alert('function hex_md5 not found');
                return false;
              }
              next.value = hex_md5 (fields[i].value);
							var next = next.nextSibling;
							if (next != null && next.tagName.toLowerCase () == 'input' && next.getAttribute ('type') && next.getAttribute ('type').toLowerCase () == 'hidden') {
								next.value = fields[i].value.length;
							}
							fields[i].value = '*****';
						}
					}
				}
			}
		}
	}
	// execute the functions in bbOnSubmitRegistry
	if (bbOnSubmitRegistry != null) {
		var returnValue = true;
		for (var i in bbOnSubmitRegistry) {
			returnValue = (returnValue && eval (bbOnSubmitRegistry[i]));
		}
		return returnValue;
	}
	return true;
}

/**
 * Goes to a given url (if url contains 'javascript:', then it will be evaluated)
 */
function goToURL (url) {
	if (url.toLowerCase ().indexOf ('javascript:') != -1) {
		eval (url);
	}
	else {
		location.href = url;
	}
}

var bbOpenActionMenu = null;

/// <description>Hides an element on mouseout.</description>
/// <param name="comp">May be a single component or an array of components.</param>
/// <param name="graceTime">Delay in milliseconds between mouseout and hiding (optional).</param>
/// <param name="hideAll">If comp is an array and hideAll=true all components will be hidden.
/// If hideAll=false only the first component in the array will be hidden (optional).</param>
function hideOnMouseOut (comp, graceTime, hideAll, callBack) {
	if (!graceTime) {
		graceTime = 750;
	}
	///<todo>components loose onmouseout and onmouseover, add</todo>
	if (isArray (comp)) {
		for (var i = 0; i < comp.length; i++) {
			if (i == 0) {
				comp[0].onmouseout = function () { this.hideOnMouseOutTimeout = window.setTimeout (function () { fadeOut (comp[0], callBack); }, graceTime); }
				comp[0].onmouseover = function () { window.clearTimeout (comp[0].hideOnMouseOutTimeout); }
			}
			else {
				if (hideAll) {
					comp[i].onmouseout = function () { comp[0].hideOnMouseOutTimeout = window.setTimeout (function () { for (var j = 0; j < comp.length; j++) { fadeOut (comp[j], callBack); } }, graceTime); }
				}
				else {
					comp[i].onmouseout = function () { comp[0].hideOnMouseOutTimeout = window.setTimeout (function () { fadeOut (comp[0], callBack); }, graceTime); }
				}
				comp[i].onmouseover = function () { window.clearTimeout (comp[0].hideOnMouseOutTimeout); }
			}
		}
	}
	else {
		comp.onmouseout = function () { this.hideOnMouseOutTimeout = window.setTimeout (function () { fadeOut (comp, callBack); }, graceTime); }
		comp.onmouseover = function () { window.clearTimeout (comp.hideOnMouseOutTimeout); }
	}
}

/**
 * display: what display attribute to set (ie. block (default), table, inline, ....)
 * for ie: anything else than 'block' always falls back to block in case of an exception
 */
function fadeIn (comp, display) {
	if (comp.style.opacity == '' || isNaN (comp.style.opacity) || (comp.style.opacity * 1) == 1 || (comp.style.opacity * 1) == 0) {
		// init
		if (comp.fadeOutTimeout) window.clearTimeout (comp.fadeOutTimeout);
		comp.style.opacity = 0.1;
		comp.style.filter = 'alpha(opacity=' + (comp.style.opacity * 100) +')';
		if (display) {
			try {
				comp.style.display = display;
			} catch (ex) {
				comp.style.display = 'block';
			}
		}
		else {
			comp.style.display = 'block';
		}
		comp.fadeInTimeout = window.setTimeout (function () { fadeIn (comp); }, 15);
	}
	else {
		comp.style.opacity = (comp.style.opacity * 1) + 0.1;
		comp.style.filter = 'alpha(opacity=' + (comp.style.opacity * 100) +')';
		if (comp.style.opacity * 1 < 1) {
			comp.fadeInTimeout = window.setTimeout (function () { fadeIn (comp); }, 15);
		}
		else {
			comp.style.opacity = 1;
			comp.style.filter = 'alpha(opacity=100)';
		}
	}
}

function fadeOut (comp, callBack) {
	if (comp.fadeInTimeout) {
		window.clearTimeout (comp.fadeInTimeout);
	}
	comp.style.opacity = (comp.style.opacity * 1) - 0.15;
	comp.style.filter = 'alpha(opacity=' + (comp.style.opacity * 100) +')';
	if (comp.style.opacity * 1 > 0) {
		comp.fadeOutTimeout = window.setTimeout (function () { fadeOut (comp, callBack); }, 15);
	}
	else {
		comp.style.opacity = 0;
		comp.style.filter = 'alpha(opacity=0)';
		comp.style.display = 'none';
		if (callBack) {
			callBack ();
		}
	}
}

function delayFadeOut (id, delay) {
	if (!delay) {
		var comp = AJS.getElement (id);
		if (comp) {
			comp.style.opacity
			fadeOut (comp);
		}
	}
	else {
		window.setTimeout ('delayFadeOut(\'' + id + '\')', delay * 1000);
	}
}

function openPopup (url, width, height, returnWindow) {
	// position on the screen
	var left = (screen.width - width) / 2;
	var top = (screen.height - height) / 2.5;
	var win = window.open (url, '', 'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top + ',location=0,status=1,menubar=0,resizable=1,toolbar=0,scrollbars=1');
	// popup-blocker ?
	if (!win) {
	    ajaxCall (createURL ('administration/resource', 'alertResource', 0, 'resourcekey=popup_blocked'));
	}
	// set opener
	else if (!win.opener) {
		win.opener = self;
	}
	if (returnWindow) {
		return win;
	}
}

function createURL (contextName, actionName, menuID, params) {
	if (bbUseISAPI) {
		return createBBURL (bbURLPrefix, true, contextName, actionName, menuID, params);
	}
	else {
		var urlPrefix = bbURLPrefix;
		if (urlPrefix.indexOf ('.aspx') == -1) {
			urlPrefix += 'index.aspx';
		}
		return createBBURL (urlPrefix, false, contextName, actionName, menuID, params);
	}
}

function createBBURL (urlPrefix, useISAPI, contextName, actionName, menuID, params) {
	if (!contextName) {
		contextName = bbContextName;
	}
	if (!actionName) {
		actionName = bbActionName;
	}
	if (!menuID) {
		menuID = bbMenuID;
	}
	var url = '';
	if (useISAPI) {
		var language;
		if (window.bbAppLanguage == null) {
			if ((language = getLanguageByMetaTag()) == null) {
				language = 'de';
			}
		} else {
			language = bbAppLanguage;
		}
		url = urlPrefix + language + '/' + contextName + '/' + actionName + '/' + menuID + '/?'
	}
	else {
		url = urlPrefix + '?context=' + contextName + '&action=' + actionName + '&menuid=' + menuID + '&';
	}
	return url + (params ? params : '');
}

function extendURL (url, params) {
	if (params != null && params.length > 0) {
		if (params.indexOf ('&') == 0 || params.indexOf ('?') == 0) {
			params = params.substring (1, params.length);
		}
		url += (url.indexOf ('?') != -1 ? '&' : '?') + params;
	}
	return url;
}

// callback: to be executed for successful requests
// errorCallback: for errors
// data: json object for example
function ajaxCall (url, callback, errorCallback, data) {
	// add magicnumber for every browser
	url += (url.indexOf ('?') > 0 ? '&' : '?') + 'mn=' + new Date ().getTime ();
	//alert (url);
	var req = AJS.getRequest (url);
	if (callback) {
		req.addCallback (callback);
	}
	else {
		// default callback does javascript eval
		req.addCallback (function (data, req) { try { eval (data); } catch (ex) { (errorCallback ? eval (errorCallback) : alert (url + "\n\n" + ex)); }});
	}
	req.addErrback (function (data, req) { if (errorCallback) { eval (errorCallback) } else { try { eval (data); } catch (ex) { alert ('An error occured.'); } } });
	req.sendReq (data);
	return req;
}

/**
 * search form functions
 */
var bbSearchSaveMenu = null;

// is used from AJS.getElement for ff and safari
function findObject (theObj, theDoc) {
	var p, i, foundObj;
	if (!theDoc) {
		theDoc = document;
	}
	if ((p = theObj.indexOf ("?")) > 0 && parent.frames.length) {
		theDoc = parent.frames[theObj.substring (p + 1)].document;
		theObj = theObj.substring (0, p);
	}
	if (!(foundObj = theDoc[theObj]) && theDoc.all) {
		foundObj = theDoc.all[theObj];
	}
	for (i = 0; !foundObj && i < theDoc.forms.length; i++) {
		foundObj = theDoc.forms[i][theObj];
	}
	for (i = 0; !foundObj && theDoc.layers && i < theDoc.layers.length; i++) {
		foundObj = findObj (theObj, theDoc.layers[i].document);
	}
	if (!foundObj && document.getElementById) {
		foundObj = document.getElementById (theObj);
	}
	return foundObj;
}

if(window.console==null){
	window.console = new Object();
	window.console.log = function (text){
		//todo 1898 - some addthis code also attempts to log out errors, and we won't them rendered onscreen!!
        return;
        
        if(text==null || ((""+typeof(text)).toLowerCase()=='string' && text.length==0))
		
		var div = window.console.div;
		if(div==null){
			var div = AJS.DIV();
			div.style.position = 'absolute';
			div.style.display = 'block';
			div.style.zIndex = 10000;
			div.style.top = '50px';
			div.style.left = '50px';
			div.style.border = '2px solid red';
			div.style.backgroundColor = '#EFEFEF';
			document.body.appendChild(div);
			window.console.div = div;
		}
		
		if((""+typeof(text)).toLowerCase()=='string')
			text = text.replace(/</g,'&lt;').replace(/>/g,'&gt;');
		
		var html = div.innerHTML;
		if(html.length>0)
			html += '<br/>';
		html += text;
		div.innerHTML = html;
	}
}

var ImgButton = {
	mouseOver: function (img) {
		if (img.src.indexOf ('_hover.png') > 0) {
			img.src = img.src.replace ('_hover.png', '_hover.png');
		}
		else if (img.src.indexOf ('_pushed.png') > 0) {
			img.src = img.src.replace ('_pushed.png', '_hover.png');
		}
		else {
			img.src = img.src.replace ('.png', '_hover.png');
		}
	},
	mouseOut: function (img) {
		if (img.src.indexOf ('_pushed.png') > 0) {
			img.src = img.src.replace ('_pushed.png', '.png');
		}
		else {
			img.src = img.src.replace ('_hover.png', '.png');
		}
	},
	mouseDown: function (img) {
		if (img.src.indexOf ('_hover.png') > 0) {
			img.src = img.src.replace ('_hover.png', '_pushed.png');
		}
		else if (img.src.indexOf ('_pushed.png') == 0) {
			img.src = img.src.replace ('.png', '_pushed.png');
		}
	},
	mouseUp: function (img) {
		if (img.src.indexOf ('_pushed.png') > 0) {
			img.src = img.src.replace ('_pushed.png', '_hover.png');
		}
	}
}

function setFontSize (size) {
	var increaseButton = AJS.$('fontsizeincrease');
	var decreaseButton = AJS.$('fontsizedecrease');
	switch (size) {
		case 's':
			setUserPreference ('fontsize', 's');
			decreaseButton.src = decreaseButton.src.replace ('_hover', '').replace ('fontsize_decrease', 'fontsize_decrease_inactive');
			decreaseButton.onclick = function () {};
			increaseButton.onclick = function () { setFontSize ('m') };
			setActiveStyleSheet ('fonts.css');
			break;
		case 'l':
			setUserPreference ('fontsize', 'l');
			increaseButton.src = increaseButton.src.replace ('_hover', '').replace ('fontsize_increase', 'fontsize_increase_inactive');
			decreaseButton.onclick = function () { setFontSize ('m') };
			increaseButton.onclick = function () {};
			setActiveStyleSheet ('fontl.css');
			break;
		default:
			setUserPreference ('fontsize', 'm');
			decreaseButton.src = decreaseButton.src.replace ('fontsize_decrease_inactive', 'fontsize_decrease');
			increaseButton.src = increaseButton.src.replace ('fontsize_increase_inactive', 'fontsize_increase');
			decreaseButton.onclick = function () { setFontSize ('s') };
			increaseButton.onclick = function () { setFontSize ('l') };
			setActiveStyleSheet ('fontm.css');
	}
}

function setActiveStyleSheet (fileName) {
	var i, a, main;
	for (i = 0; (a = document.getElementsByTagName ("link")[i]); i++) {
		if (a.getAttribute ("rel").indexOf ("style") != -1 && a.getAttribute ("title")) {
			a.disabled = true;
			if (a.getAttribute ("href").indexOf (fileName) > -1) {
				a.disabled = false;
			}
		}
	}
}

function setUserPreference (key, value, actionID) {
	ajaxCall (createURL ('administration/userpreference', 'setpreference', bbMenuID, 'key=' + key + '&value=' + value + (actionID ? '&actionid=' + actionID : '')));
}

function hideSelects () {
	var selects = AJS.getElementsByTagAndClassName ('select');
	for (var i = 0; i < selects.length; i++) {
		selects[i].style.visibility = 'hidden';
		selects[i].wasHidden = true;
	}
}

function showSelects () {
	var selects = AJS.getElementsByTagAndClassName ('select');
	for (var i = 0; i < selects.length; i++) {
		if (selects[i].style.visibility == 'hidden' && selects[i].wasHidden) {
			selects[i].style.visibility = 'visible';
			selects[i].wasHidden = false;
		}
	}
}

function shortenTextShow (span, show) {
	var spanToShow = (show ? span.nextSibling : span.previousSibling);
	var spanToHide = span;
	if (spanToShow && spanToHide) {
		spanToShow.style.display = '';
		spanToHide.style.display = 'none';
	}
	else {
		alert ('Error: ' + spanToShow + '/' + spanToHide);
	}
}

function preloadImages () {
    if (document.images) {
        var imgFiles = preloadImages.arguments;
        if (document.preloadArray == null) {
            document.preloadArray = new Array ();
        }
        var i = document.preloadArray.length;
        with (document) {
            for (var j = 0; j < imgFiles.length; j++) {
                if (imgFiles[j].charAt (0) != "#") {
                    document.preloadArray[i] = new Image ();
                    document.preloadArray[i++].src = imgFiles[j];
                }
            }
        }
    }
}

/// Adds the function closeMenus to the document onclick event.
function addDocumentClickListener () {
	AJS.addEventListener (document, 'click', closeMenus, false, false);
}

/// stops event propagation for the given event
/// used to stop event from going up to the document causing the menus to be closed onclick
function stopEventPropagation (evt) {
	if (!evt) {
		var evt = window.event;
	}
	evt.cancelBubble = true;
	if (evt.stopPropagation) {
		evt.stopPropagation ();
	}
}

function unscrambleEmail (id, sUrl, sText, isEmail) {
	var obj = document.getElementById (id);
	if (obj == null) {
		alert ('unscrambleLink: Object not found (' + id + ')');
		return;
	}
	var parent = obj.parentNode;
	if (parent == null) {
		alert ('unscrambleLink: Parent object not found');
		return;
	}
	// to create standards compliant xhtml, use <div><a></a><-- scramble --></div>
	if (parent.nodeName.toLowerCase () == 'div') parent = parent.firstChild;
	if (parent.nodeName.toLowerCase () != 'a') {
		alert ('unscrambleLink: Parent object is not an anchor tag');
		return;
	}
	if (sUrl != null && sUrl.length > 0) {
		eval ('var txt = String.fromCharCode(' + sUrl + ');');
		parent.href = txt;
	}
	if (sText != null && sText.length > 0) {
		var firstChild = parent.firstChild;
		//First node is a text node with input
		if (firstChild && firstChild.nodeType == 3 && firstChild.nodeValue != null && firstChild.nodeValue.replace (' ', '').length > 0) return;
		eval ('var txt = String.fromCharCode (' + sText + ');');
		txt = txt.replace (/&amp;/g, '&');
		parent.innerHTML = txt;
		if (parent.title != null && parent.title.length == 0) {
      //No html tags
      if(txt.indexOf('<')==-1)
        parent.title = txt;
		}
	}
}

function doNothing () { }

function setStartpage (name, slct) {
	if (slct) {
		// this is the empty root node -> use default startpage
		var value = '';
		if (slct.value != '' || slct.selectedIndex > 0) {
			if (isNumeric (slct.value)) {
				// this is a node with an id -> use this as startpage
				value = slct.value;
			}
			else {
				// this is a node with no action associated, get next available action in menutree
				if (slct.selectedIndex > 0 && slct.selectedIndex + 1 < slct.options.length) {
					for (var i = slct.selectedIndex; i < slct.options.length && (value == ''); i++) {
						if (isNumeric (slct.options[i].value)) {
							value = slct.options[i].value;
							slct.selectedIndex = i;
						}
					}
				}
			}
		}
		setUserPreference (name, value);
		if (value = '') {
			slct.selectedIndex = 0;
		}
	}
}

function formatDate(dateObject) {
	if (typeof dateObject !== 'string') { dateObject = dateObject + ''; }	
	if (dateObject.length === 1) {
		return '0' + dateObject;
	}
	return dateObject;
}

function saveAccountSetting (name, module, value, callback) {
	var callbackFunc = callback;
	if (callbackFunc == null) {
		callbackFunc = function () {}
	}
    try {
        value = decodeURIComponent(value);
    } catch(e){}
	ajaxCall (createURL ('administration/account', 'ajaxsaveaccountsetting', -1, 'name=' + name + '&module=' + module), callbackFunc, null, {value:value});
}

function getAccountSetting (name, module, callback) {
	ajaxCall (createURL ('administration/account', 'ajaxgetaccountsetting', -1, 'name=' + name + '&module=' + module), callback);
}

function getWWPageNumber () {
	var re = /.*\/(\d+).*$/;
	var arr = re.exec (location.href);
	return arr[1];
}

function getLanguageByMetaTag () {
	var metas = document.getElementsByTagName ('meta');
	for (var i = 0; i < metas.length; i++) {
		if (metas[i].httpEquiv == 'content-language') {
			return metas[i].content.toLowerCase ();
			break;
		}
	}
	return null;
}

var keepMeAlive = {
	'default': {
		url: "/keep_me_alive.aspx", //url for session refreshing
		//url: "/bb_net/keep_me_alive.aspx", //url for session refreshing
		timeout: 1500000 //25*60*1000 = 25min
	},
	ping: function(url, timeout) {
		var _req, _url, _timeout, _def = keepMeAlive['default'];
		this.setUrl = function(url){
			_url = url?url:_def.url;return this;
		}
		this.setTimeout = function(timeout){
			_timeout = timeout?timeout:_def.timeout;return this;
		}
		var send = function() {
			_req.sendReq();
		}
		var initializeTimeout = function(data){
			window.setTimeout(ini, _timeout);
		}
		var ini = function(){
			_req = null;
			_req = AJS.getRequest (_url, null, 'GET');
			_req.addCallback (initializeTimeout);
			_req.addErrback (function (data, req) {ini()});
			send();
		}
		this.setUrl(url).setTimeout(timeout);ini();
	}
}

function getSelectedOption (select) {
	if (select.options == null) {
		return;
	}
	var opt = select.options;
	for (var i = 0; i < opt.length; i++) {
		if (opt[i].selected) {
			return opt[i];
		}
	}
}

function checkAllInterests(treeId, cbid, thisid) {	
	var tree = document.getElementById(treeId); 
	var checkboxes = tree.getElementsByTagName('input');		
	value = !document.getElementById(cbid).checked;
	document.getElementById(cbid).checked= value;	
	for (i = 0; i < checkboxes.length; i++) {	
		if(checkboxes[i].disabled || checkboxes[i].id.indexOf(thisid) != -1)
			continue;
		else 
			checkboxes[i].checked = value ;	
	} 
}

function toggleTruncate(element) {
	if(element.className == "truncate_on")
	element.className = "truncate_off";
	else element.className = "truncate_on";
	
}

