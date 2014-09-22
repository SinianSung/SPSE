
//		Code by new impact ag, Bern
//		for berufsberatung.ch
//		Made with Dreamweaver
//		01. Juli 2003 - thomas.rueegsegger@newimpact.com		

<!--

// ---------------------------------------------------------------------------------------------
// 		Netscape-Fehlerbehandlung (NS4) Reload des Browserfensters
// ---------------------------------------------------------------------------------------------

function MM_reloadPage(init) {
  if (init==true) with (navigator) {if ((appName=="Netscape")&&(parseInt(appVersion)==4)) {
    document.MM_pgW=innerWidth; document.MM_pgH=innerHeight; onresize=MM_reloadPage; }}
  else if (innerWidth!=document.MM_pgW || innerHeight!=document.MM_pgH) location.reload();
}
MM_reloadPage(true);


// ---------------------------------------------------------------------------------------------
// 		Funktion um die Layer Ein- bzw. Auszublenden
// ---------------------------------------------------------------------------------------------

function Bilderwechsler(n,u) {
	document.images[n].src = u 
}


ns4 = (document.layers) ? true:false 
ie4 = (document.all) ? true:false 
ng5 = (document.getElementById) ? true:false 

function showMenu(n,b) { 
if (ng5) document.getElementById(n).style.visibility = "visible"; 
else if (ns4) document.layers[n].visibility = "show"; 
else if (ie4) document.all[n].style.visibility = "visible"; 
}
function hideMenu(n,b) { 
if (ng5) document.getElementById(n).style.visibility = "hidden"; 
else if (ns4) document.layers[n].visibility = "hide"; 
else if (ie4) document.all[n].style.visibility = "hidden"; 
}


function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_showHideLayers() { //v6.0
  var i,p,v,obj,args=MM_showHideLayers.arguments;
  for (i=0; i<(args.length-2); i+=3) if ((obj=MM_findObj(args[i]))!=null) { v=args[i+2];
    if (obj.style) { obj=obj.style; v=(v=='show')?'visible':(v=='hide')?'hidden':v; }
    obj.visibility=v; }
}

try {
  FloatLayer = AJS.Class ({
      init: function (slideTime) {
        AJS.bindMethods (this);
        this.slideTime = slideTime;
        this.layer = document.getElementById('floatLayer');
        if(this.layer!=null){
          var pos = AJS.absolutePosition(this.layer);
          this.offsetY = pos.y;
          
          //In the bbnet canvas it is positioned absolute to the bbnet div
          var bbnet = document.getElementById('bbnet');
          this.bbnetOffsetY = 0;
          if(bbnet!=null){
            var pos = AJS.absolutePosition(bbnet);
            this.bbnetOffsetY = pos.y;
          }
          var dim = AJS.getWindowSize();
          this.height = dim.h;
          window.setInterval(this.run, 10);
        }
      },
      
      run: function () {
        var pos = AJS.absolutePosition(this.layer);
        this.currentY = pos.y - this.bbnetOffsetY;
        
        var newY = AJS.getScrollTop() + this.offsetY - this.bbnetOffsetY;
        if ( this.currentY != newY ) {
          if ( this.targetY != newY ) {
            this.targetY = newY;
            this.start();
          }
          this.animator();
        }
      },
      
      start: function() {
        var now = new Date();
        this.A = this.targetY - this.currentY;
        this.B = Math.PI / ( 2 * this.slideTime );
        this.C = now.getTime();
        
        if (Math.abs(this.A) > this.height) {
          this.D = this.A > 0 ? this.targetY - this.height : this.targetY + this.height;
          this.A = this.A > 0 ? this.height : - this.height;
        }
        else {
          this.D = this.currentY;
        }
      },
      
      animator: function() {
        var now = new Date();
        var newY = Math.round(this.A * Math.sin( this.B * ( now.getTime() - this.C ) ) + this.D);
        if (( this.A > 0 && newY > this.currentY ) || ( this.A < 0 && newY < this.currentY )) {
          AJS.setTop(this.layer,newY);
        }
      }
  });
}
catch(e){}


function start() {
  try {
    new FloatLayer(1000);
    if(window.bbOnLoad!=null){
      window.bbOnLoad();
    }
  }
  catch(e){}
  
  loaded();
  showLink();
}

function addOnload(onloadFunc) {
  // based on http://answers.google.com/answers/threadview?id=510976
  if(this.addEventListener) {
    this.addEventListener("load", onloadFunc, false);
  } else if(this.attachEvent) {
    this.attachEvent("onload", onloadFunc);
  } else {
    var onloadOld = this.onload;
    this.onload = function() { onloadOld(); onloadFunc(); }
  }
}
addOnload(function() { highlightOnLoad(); });

function highlightOnLoad() {
  var regex = new RegExp('[\\?&]highlighted=([^&#]*)');
  var results = regex.exec( window.location.href );
  var searchString = '';
  if(results!=null){
    searchString = results[1];
  }
  
  if (searchString.length>0) {
    var textContainerNode = document.body;
    var searchTerms = decodeURIComponent(searchString).split('|');
    for (var i in searchTerms) {
	  //var regex = new RegExp('>([^<]*)?('+searchTerms[i]+')([^>]*)?<','ig');
      var regex = new RegExp('('+searchTerms[i]+')','ig');
	  highlightTextNodes(textContainerNode, regex, i);
    }
  }
}
function highlightTextNodes(element, regex, termid) {
  var nodes = element.getElementsByTagName('*'),i=0,l=nodes.length;
  var result = document.createElement('div');

  for(;i<l;i++){
      var node = nodes[i];
      while(node){
          if(node.nodeType===3) {
              if(node.nodeValue.match(regex)) {
                result.innerHTML = node.nodeValue.replace(regex,'<span class="highlighted">$1</span>');
                var p = node.parentNode;
                while(result.firstChild)p.insertBefore(result.firstChild,node);
                var n = node;
                node = node.nextSibling;
                p.removeChild(n);
                continue;
            }
            //node.nodeValue = result.innerHTML + node.nodeValue.replace(regex,'<span class="highlighted">$1</span>');
          }
          node = node.nextSibling;
      }
  }

//  var temp = document.getElementById("load_menu");
//  var replace = document.createElement('div');
//  replace.setAttribute('id', 'load_menu_marker');
//  temp.parentNode.replaceChild(replace,temp);
//
//  var tempInnerHTML = element.innerHTML;
//  element.innerHTML = tempInnerHTML.replace(regex,'>$1<span class="highlighted">$2</span>$3<');
//
//  replace = document.getElementById("load_menu_marker");
//  replace.parentNode.replaceChild(temp, replace);
}

/*
function highlightOnLoad2() {
  var regex = new RegExp('[\\?&]highlighted=([^&#]*)');
  var results = regex.exec( window.location.href );
  var searchString = '';
  if(results!=null){
    searchString = results[1];
  }
  if (searchString.length>0) {
    var searchTerms = unescape(searchString).split('|');
    var pattern = '';
    for (var i in searchTerms) 	{
      if(pattern.length>0){
        pattern += '|';
      }
      pattern += '\\b'+searchTerms[i];
    }
    var regex = new RegExp('('+pattern+')','ig');
    highlightTextNodes2(document.body, regex);
  }
}
function highlightTextNodes2(element, regex) {
  var cn = element.childNodes;
  for(var i=0;i<cn.length;i++){
    highlightTextNodes2(cn[i], regex);
    if(cn[i].nodeType==3){
      var v = cn[i].data;
      var nv = v.replace(regex,'<span class="highlighted">$1</span>');
      if(nv != v){
        var node = document.createElement('span');
        cn[i].parentNode.replaceChild(node,cn[i]);
        node.innerHTML = nv;
      }
    }
  }
}
*/

function toggleWebSearchGroups(cmp,selectAll,selectNone){
  if(cmp.selected==null)
    cmp.selected = false;
  var inputs = document.getElementsByTagName('input');
  if(inputs!=null){
	  var inputsLength = inputs.length;
	  for (var i = 0; i < inputsLength; i++) {
		if(inputs[i].id!=null && inputs[i].id.indexOf('cb_grouping')==0){
			inputs[i].checked = cmp.selected;
		}
	  }
  }
  /*if(inputs!=null){
    for(var i in inputs){
	alert(i);
	//alert(inputs[i] + ': ' + inputs[i].type + ' - ' + inputs[i].id + ' - ' + inputs[i].checked + ' - ' + inputs[i].name + ' - ' + inputs[i].value);
      if(inputs[i].id!=null && inputs[i].id.indexOf('cb_grouping')==0){
        inputs[i].checked = cmp.selected;
      }
    }
  }*/
  cmp.innerHTML = cmp.selected?selectNone:selectAll;
  cmp.selected = !cmp.selected;
}

function checkboxComponentToggle(container,select){
	if(container==null)
		return;
	var inputs = container.getElementsByTagName('input');
	if(inputs!=null){
		var inputsLength = inputs.length;
		for (var i = 0; i < inputsLength; i++) {
			if(inputs[i].checked!=null){
				inputs[i].checked = select;
			}
		}
	}
}


/*
    Author      : jf
    Date        : 10.04.2008
    Description : display the text or not, depending on the scrollbars displayed on page. If no scrollbars, no text
    Function    : showLink()
*/
function showLink()
{
    if (document.body.clientHeight < document.body.scrollHeight)
        {
        var x = document.getElementById("mailToLink");
		if (x) {
			x.setAttribute("style","visibility:visible");
			}
        }
}

function loaded(){}
/* Extended by fugu ---*/

// ---------------------------------------------------------------------------------------------
// 		Funktion zum Bilderwechsel
// ---------------------------------------------------------------------------------------------

function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}
function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}
function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}

// ---------------------------------------------------------------------------------------------
// 		Funktion zum �ffnen eines neuen Browserfensters
// ---------------------------------------------------------------------------------------------

function MM_openBrWindow(theURL,winName,features) { //v2.0
	// Modified by JCR to set focus to already opened windows with same name
	// and set opener name for pop up window
	// window.open(theURL,winName,features);
	oWin = window.open(theURL,winName,features);
	if (oWin) {
		if(oWin.opener == null){
			oWin.opener = self;
		}
		if (oWin.focus) oWin.focus();
		return false;
	}
	oWin = null;
	return false;
}

// ---------------------------------------------------------------------------------------------
// 		Function to print current window
// ---------------------------------------------------------------------------------------------
// v1.0 J-C. Reiss 8.12.03

function doPrint(parmClose) {
  if (window.print) {
    window.print();
    if (parmClose == "Yes") window.close();
  }
}

//-->