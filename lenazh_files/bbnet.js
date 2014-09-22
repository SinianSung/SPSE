function openWin(url,name,width,height) {
  if(name==null)
    name = "_blank";
  var win = window.open(url,name,'width='+width+',height='+height+',resizable=yes,scrollbars=yes,status=yes,toolbar=no,menubar=no,location=no');
  if (win) {
    if(win.opener == null){
      win.opener = self;
    }
    if (win.focus) win.focus();
  }
  else {
    ajaxCall (createURL ('administration/resource', 'alertResource', 0, 'resourcekey=popup_blocked'));
  }
}

function submitForm(obj) {
  if(obj==null)
    return;

  var form = null;
  var p = obj;
  while(p!=null){
    if(p.nodeName.toLowerCase()=='form'){
      form = p;
      break;
    }
    p = p.parentNode;
  }

  if(form!=null){
    form.submit();
  }
}

function toggleTree (obj,opened) {
	if (obj != null) {
		// the surrouding div class="treecomponent"
		var tree = obj;
		while(tree != null){
			if(tree.className=='treecomponent'){
				break;
			}
			tree = tree.parentNode;
		}

		if (tree != null) {
			try {
				// the children
				var ul = tree.lastChild;
				// the bullet
				var img = tree.firstChild.firstChild;
				if (ul != null && img != null) {
					if (opened || (opened==null && ul.style.display != null && ul.style.display.toLowerCase () == 'none')) {
						// show the children
						ul.style.display = 'block';
						img.src = img.src.replace ('_off', '_on');
					}
					else {
						ul.style.display = 'none';
						img.src = img.src.replace ('_on', '_off');
					}
				}
			} catch (ex) {}
		}
	}
}

function initTreeComponent (id,opened) {
	//if ((location.hash + ':').indexOf (':tc_' + id + ':') >= 0) {
		// find the node and open it
		try {
			toggleTree (document.getElementById ('tc_' + id).firstChild.firstChild,opened);
		} catch (ex) {}
	//}
}

function updateBVEventSelection (id, reload, disableToggle) {
	disableToggle = disableToggle || false;
	ajaxCall (createURL ('internet/bvevent', 'updateselection', null, 'id=' + id + '&reload=' + (reload ? 'true' : 'false') + '&disabletoggle=' + disableToggle));
}

function wabToggleAdditionalRestrictions (show) {
	if (show) {
		AJS.getElement ('wabClosedAdditionalRestrictions').style.display = 'none';
		AJS.getElement ('wabOpenAdditionalRestrictions').style.display = 'block';
		AJS.getElement ('addrestrictions').value = 1;
	}
	else {
		AJS.getElement ('wabClosedAdditionalRestrictions').style.display = 'block';
		AJS.getElement ('wabOpenAdditionalRestrictions').style.display = 'none';
		AJS.getElement ('addrestrictions').value = 0;
	}
}

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

function printWABSelection (url) {
	// find checkboxes on page
	var cbs = AJS.getElementsByTagAndClassName ('input', 'wabcb');
	var idList = '';
	for (var i = 0; i < cbs.length; i++) {
		idList += (cbs[i].checked ? cbs[i].id.substr ('offer_'.length) + ';' : '');
	}
	//alert (url + '&print=yes&selectedids=' + idList);
	openWin (url + '&print=yes&selectedids=' + idList, 'printwindow', 650, 500);
}
function compareWABSelection(elem, url){
	// find checkboxes on page
	var cbs = AJS.getElementsByTagAndClassName ('input', 'wabcb');
	var idList = '';
	for (var i = 0; i < cbs.length; i++) {
		idList += (cbs[i].checked ? cbs[i].id.substr ('offer_'.length) + ';' : '');
	}
	//openWin (url + '&compare=yes&selectedids=' + idList, 'comparewindow', 500, 500);
	elem.href =  (AJS.isIe()?encodeUriComponents(url):url) + '&compare=yes&selectedids=' + idList;
}
function encodeUriComponents(url) {
	//5.09.2011 lm. use new var datas to split url into data and url
	var data;
	var datas = url.split("?");
	
	if(datas.length>1){
		data = datas[1];url = datas[0];
	}else {
		data = datas[0];url = '';
	}
	
	if(!url)url = '';
	data = data.split('&');
	var paar = [];
	for(var i=0; i < data.length; i++) {
		paar = data[i].split('=');
		url += (i===0?'?':'&') + paar[0] + '=' + encodeURIComponent(paar[1]);
	}
	return url;
}
function resetWABSelection () {
	// find checkboxes on page
	var cbs = AJS.getElementsByTagAndClassName ('input', 'wabcb');
	for (var i = 0; i < cbs.length; i++) {
		cbs[i].checked = false;
	}
}

function printLinkSelection (url) {
	// find checkboxes on page
	var cbs = AJS.getElementsByTagAndClassName ('input', 'linkcb');
	var idList = '';
	for (var i = 0; i < cbs.length; i++) {
		idList += (cbs[i].checked ? cbs[i].id.substr ('link_'.length) + ';' : '');
	}
	// alert (url + '&print=yes&selectedids=' + idList);
	openWin (url + '&print=yes&selectedids=' + idList, 'printwindow', 650, 500);
}

function resetLinkSelection () {
	// find checkboxes on page
	var cbs = AJS.getElementsByTagAndClassName ('input', 'linkcb');
	for (var i = 0; i < cbs.length; i++) {
		cbs[i].checked = false;
	}
}

function toggleCH (selectAll,init) {
	// if the function toggleCounty exists we are in a chmap context
	try {
		if (window.toggleCounty) {
			for (var i = 0; i < 30; i++) {
				var cb = AJS.getElement ('cb_countycode_' + i);
				toggleCounty (cb.value, selectAll, init);
			}
		}
		else {
			for (var i = 0; i < 30; i++) {
				var cb = AJS.getElement ('cb_countycode_' + i);
				if (cb) {
					cb.checked = selectAll;
				}
			}
		}
	} catch (ex) {
		for (var i = 0; i < 30; i++) {
			var cb = AJS.getElement ('cb_countycode_' + i);
			if (cb) {
				cb.checked = selectAll;
			}
		}
	}
}

function schooltypeToggle(nbSchooltype, selectAll){
    for(var i=0;i<nbSchooltype;i++){
        var schooltype = AJS.getElement('cb_schooltype_' + i);
        if(schooltype)
            schooltype.checked = selectAll;
    }
}

function countySchoolToggle(nbSchooltype, selectAll){
    for(var i=0;i<nbSchooltype;i++){
        var county = AJS.getElement('cb_county_' + i);
        if(county)
            county.checked = selectAll;
    }
}

//**************************************************************
// LM 01.09.2011: UniInfo: Uncheck all input type checkbox with class uniCompareChk
// TODO 1276: Uni Info, compare selected 
//**************************************************************
function schooluniResetCompareChk () {
	$(":checkbox.uniCompareChk").attr("checked", "");
};   

//**************************************************************
// SchoolUni: add selected nodes into the url and Open Window 
//**************************************************************
function schooluniCompareSelection(url){

	// find checkboxes on page
	var idList = "";
	var href = "";
	var selector = ":checkbox:checked.uniCompareChk";
	
	//Get selected checkbox or all.
	if ($(selector).length == 0) selector = ":checkbox.uniCompareChk";
	
	if ($(selector).length > 5){
		// Display warning if mode than 10 selected
		$("#bbnet div.toMuchSelected").removeClass("hidden");
	}
	else{
		$("#bbnet div.toMuchSelected").addClass("hidden");
		$(selector).each(function(i){
			idList += $(this).attr('id').substr ('uniCompare_'.length) + ";";
		 });
		href =  (($.browser.msie)?encodeUriComponents(url):url) + '&compare=yes&selectedids=' + idList;
		window.open(href);
	}
};             

		
function test(msg){
    alert(msg);
    return false;
}

function checkSelection(msg){
    for(var i=0;i<document.getElementsByName('schooltype').length;i++){
        if(document.getElementsByName('schooltype')[i].checked){
            for(var j=0;j<document.getElementsByName('county').length;j++){
                if(document.getElementsByName('county')[j].checked)
                    return true;
            }
        }
    }
    alert(msg);
    return false;
}

// jf 26.11.2008
// check if at least one checkbox is checked
function checkSchoolType(msg){
    for(var i=0;i<document.getElementsByName('schoolnodetype').length;i++){
        if (document.getElementsByName('schoolnodetype')[i].checked)
            return true
    }
    alert(msg);
    return false;
}

function apprenticeshipSetFieldAndSubmit(fieldName, value){
  var bbnet = document.getElementById('bbnet');
  if(bbnet==null)
    return;
  var forms = bbnet.getElementsByTagName ('form');
  if(forms==null)
    return;
  var form = forms[0];
  if(form==null)
    return;
  var h = findObject(fieldName,form);
  if(h==null)
    return;
  h.value = value;
  apprenticeshipReset(fieldName);
  form.submit();
}
function apprenticeshipReset(fieldName){
  var bbnet = document.getElementById('bbnet');
  if(bbnet==null)
    return;
  var forms = bbnet.getElementsByTagName ('form');
  if(forms==null)
    return;
  var form = forms[0];
  if(form==null)
    return;
  if(fieldName==null || fieldName!='searchabc'){
    var s = findObject('searchabc',form);
    if(s!=null){
      s.value = '';
    }
  }
  if(fieldName==null || fieldName!='search'){
    var s = findObject('search',form);
    if(s!=null){
      s.value = '';
    }
  }
  if(fieldName==null || fieldName!='id_section'){
    var s = findObject('id_section',form);
    if(s!=null){
      s.value = '';
    }
  }
  if(fieldName==null || fieldName!='swissdoc'){
    var fields = AJS.getElementsByTagAndClassName ('input', null, form);
		for (i = 0; i < fields.length; i++) {
			if(fields[i].id!=null && fields[i].id.indexOf('swissdoc_')==0){
        fields[i].checked = false;
      }
    }
  }
}

window.selectedApprenticeshipSearchOption = 4;
function apprenticeshipOnClickSearchOption(which){
  if(apprenticeshipHasSelectedCounties()){
     apprenticeshipToggleSearchOption(which);
  }
}

function apprenticeshipToggleSearchOption(which,open){
  var i=1;
  var obj=document.getElementById('searchoption_'+i);
  while(obj!=null){
    if(i==which){
      obj.style.display = (obj.style.display!='block'||open)?'block':'none';
    }
    else {
      obj.style.display = 'none';
    }
    i++;
    obj = document.getElementById('searchoption_'+i);
  }

  if(which!=null){
    window.selectedApprenticeshipSearchOption = which;
  }
}
function apprenticeshipMapListener(code,checked,init){
  if(!checked && !init && window.emptyLectureGroups !=null && emptyLectureGroups[code.toLowerCase()]!=null){
    alert(emptyLectureGroups[code.toLowerCase()]);
  }
  if(apprenticeshipHasSelectedCounties()){
     apprenticeshipToggleSearchOption(window.selectedApprenticeshipSearchOption,true);
     window.clearTimeout(window.aiid);
     window.aiid = window.setTimeout('apprenticeshipUpdateStat()',1000);
  }
  else {
    apprenticeshipToggleSearchOption(null);
  }
}
function apprenticeshipHasSelectedCounties(){
  var arr = apprenticeshipGetSelectedCounties();
  return arr!=null && arr.length>0;
}

function apprenticeshipGetSelectedCounties(){
  var i=0;
  var obj=document.getElementById('cb_countycode_'+i);
  var arr = new Array();
  while(obj!=null){
    if(obj.checked){
      arr.push(obj.value);
    }
    i++;
    obj=document.getElementById('cb_countycode_'+i);
  }
  return arr;
}

function apprenticeshipUpdateStat(){
  var arr = apprenticeshipGetSelectedCounties();
  if(arr==null || arr.length==0)
    return;

  var url = createURL('internet/apprenticeships', 'updatestat', null, 'countycode='+arr.toString());
  var req = AJS.getRequest (url, null, 'GET');
    req.addCallback (apprenticeshipUpdateStatCallback);
	req.addErrback (function (data, req) { 
		try {
			element = document.getElementById("searchoption_ajaxloader");
			element.parentNode.removeChild(element);
		} catch (e) {}
	});
	try {
		$($(document.getElementById('searchoption_'+window.selectedApprenticeshipSearchOption)).children()[1]).prepend('<div id=\"searchoption_ajaxloader\"><img src=\"/images/ajax-loader.gif\"></div>'); 
	} catch(e) {}
	req.sendReq ();
}

function apprenticeshipUpdateStatCallback(data, req){
  if (data != null && data.length > 0) {
	try {
		element = document.getElementById("searchoption_ajaxloader");
		element.parentNode.removeChild(element);
    } catch (e) {}
	eval (data);
    
    var elm = document.getElementById('swissdoc_stat');
    if(elm){
      elm.innerHTML = swissdocStat;
    }
    
    var elm = document.getElementById('section_stat');
    if(elm){
      elm.innerHTML = sectionStat;
    }
	}
}


// LogBook
window.LogBook = new Object();
window.LogBook.getInputFields = function(elm){
  var types = new Array('input','textarea','select','label');
  var arr = new Array();
  if(elm==null)
    return arr;
  for(var i=0;i<types.length;i++){
    var elms = elm.getElementsByTagName(types[i]);
    if(elms!=null && elms.length>0){
      for(var j=0;j<elms.length;j++){
        arr.push(elms[j]);
      }
    }
  }
  return arr;
}
window.LogBook.addRow = function(obj){
  if(obj==null)
    return;
  var table = AJS.getParentBytc(obj, 'table');
  if(table==null)
    return;
  var trs = AJS.getElementsByTagAndClassName('tr', 'cloneable', table);
  if(trs==null || trs.length==0)
    return;
  var tr = trs[0];

  //Buggy browser
  var elms = LogBook.getInputFields(tr);
  if(elms!=null){
    for(var i=0;i<elms.length;i++){
      if(elms[i].checked!=null){
        elms[i]._checked = elms[i].checked;
      }
    }
  }

  var newTR = tr.cloneNode (true);
  newTR.style.display = '';
  newTR.className = tr.className;
  AJS.insertAfter(newTR,trs[trs.length-1]);

  //Buggy browser
  if(elms!=null){
    for(var i=0;i<elms.length;i++){
      if(elms[i]._checked!=null){
        elms[i].checked = elms[i]._checked;
      }
    }
  }

  var re = new RegExp('_[0-9]+$');

  var elms = LogBook.getInputFields(newTR);
  if(elms!=null){
    for(var i=0;i<elms.length;i++){
      var type = "";
      if(elms[i].type!=null){
        type = elms[i].type.toLowerCase();
      }
      if(type != 'checkbox' && type != 'radio' && type != 'button'){
        elms[i].value = '';
      }
      if(elms[i].checked!=null){
        elms[i].checked = false;
      }
      if(elms[i].nodeName=='LABEL'){
          var f = elms[i].getAttribute('for');
          if(f!=null){
              var matches = /_[0-9]+$/.exec(f);
              if(matches){
                  var nf = f.replace(/_[0-9]+_[0-9]+$/,'_'+trs.length)+matches[0];
                  elms[i].setAttribute('for',nf);
              }
          }
      }
      if(elms[i].id!=null){
        if(type != 'checkbox' && /_[0-9]+_[0-9]+$/.test(elms[i].id)){
          var matches = /_[0-9]+$/.exec(elms[i].id);
          if(matches){
            elms[i].id = elms[i].id.replace(/_[0-9]+_[0-9]+$/,'_'+trs.length)+matches[0];
          }
        }
        else {
          elms[i].id = elms[i].id.replace(re,'_'+trs.length);
        }
      }

      if(elms[i].name!=null){
        elms[i].name = elms[i].name.replace(re,'_'+trs.length);
      }

      elms[i].style.backgroundColor = '';
    }
  }

  return newTR;
}
window.LogBook.deleteRow = function(obj){
  if(obj==null)
    return;
  var tr = AJS.getParentBytc(obj, 'tr');
  if(tr==null)
    return;
  var elms = LogBook.getInputFields(tr);
  if(elms!=null){
    for(var i=0;i<elms.length;i++){
      var type = "";
      if(elms[i].type!=null){
        type = elms[i].type.toLowerCase();
      }
      if(elms[i].type==null || (type != 'checkbox' && type != 'button')){
        elms[i].value = '';
      }
    }
  }
  tr.style.display = 'none';
}
window.LogBook.addRowFromSelect = function(selectId, inputName, multipleAllowed){
  var select = document.getElementById(selectId);
  if(select==null || select.value=='')
    return;
  var table = AJS.getParentBytc(select, 'table');
  if(table==null)
    return;
  //Already added ?
  if(!multipleAllowed){
    var elms = table.getElementsByTagName('input');
    if(elms!=null && elms.length>0){
      for(var j=0;j<elms.length;j++){
        if(elms[j].name.indexOf(inputName+'_')==0){
          if(elms[j].value == select.value){
            return;
          }
        }
      }
    }
  }

  //Is 0 already used
  var tr = null;
  var zero = findObject (inputName+'_0');
  if(zero!=null && zero.value==''){
     tr = AJS.getParentBytc(zero, 'tr');
  }
  else {
    tr = LogBook.addRow(select);
  }

  tr.style.display = AJS.isIe()?'block':'table-row';

  var txt = AJS.getElementsByTagAndClassName('h3', 'text', tr, true);
  if(txt!=null){
    txt.innerHTML = select.options[select.selectedIndex].text;
  }

  var elms = tr.getElementsByTagName('input');
  //Set value
  if(elms!=null && elms.length>0){
    for(var j=0;j<elms.length;j++){
      if(elms[j].name.indexOf(inputName+'_')==0){
         elms[j].value = select.value;
         break;
      }
    }
  }

  return tr;
}

window.LogBook.addZihlmann = function(){
  LogBook.addRowFromSelect('id_zihlmann','main_idzihlmann',false);
}
window.LogBook.addWorkingfield = function(){
  LogBook.addRowFromSelect('id_workingfield','main_idworkingfield',false);
}
window.LogBook.addSourceType = function(selectId, inputName){
  var tr = LogBook.addRowFromSelect(selectId, inputName,true);
  /*
  if(tr!=null){
    var ta = AJS.getElementsByTagAndClassName('textarea', null, tr, true);
    if(ta!=null){
      ta.onfocus = function(){
        if(this.dateset){
          return;
        }
        this.name = this.name.replace(/\* /,'');
        var now = new Date();
        this.value = now.getDate()+'.'+(now.getMonth()+1)+'.'+now.getFullYear()+"\n";
        if (this.createTextRange){
          var fr = this.createTextRange();
          fr.moveStart('character', this.value.length);
          fr.collapse();
          fr.select();
        }
        this.dateset=true;
      };
    }
  }
  */
}
window.LogBook.moveProfession = function(id,moveUp){
  var h = document.getElementById(id);
  if(h==null){
    return;
  }
  var div = AJS.getParentBytc(h, 'div');
  if(div==null){
    return;
  }
  var divs = AJS.getElementsByTagAndClassName('div', 'profession', div.parentNode);
  if(divs==null){
    return;
  }
  //Find current pos
  var pos = -1;
  for(var i=0;i<divs.length;i++){
    if(divs[i]==div){
      pos = i;
      break;
    }
  }
  //Not found
  if(pos==-1){
    return;
  }

  var newPos = pos + (moveUp?-1:1);
  if(newPos>=divs.length || newPos<0){
    return;
  }

  if(newPos==0){
    AJS.insertBefore(div,divs[0]);
  }
  else {
    AJS.insertAfter(div,divs[newPos+(moveUp?-1:0)]);
  }
}
window.LogBook.deleteItem = function(id, confirmText){
  if(!confirm(confirmText)){
    return;
  }

  var h = document.getElementById(id);
  if(h==null){
    return;
  }
  h.value = '';
  var div = AJS.getParentBytc(h, 'div');
  if(div!=null){
    div.style.display = 'none';
  }
  var form = AJS.getParentBytc(h, 'form');
  if(form!=null){
    form.submit();
  }
}
window.LogBook.handleObstacles = function(which){
	var list = findObject('profession_' + which + '_requirementcheck');
	if(list){
		var o = null;
		for(var i=0;i<list.length;i++){
			if(list[i].checked){
				o = list[i];
				break;
			}
		}
		if(o){
			var d = document.getElementById('profession_' + which + '_requirementcheck_2_obstacles');
			if(d){
				d.style.display = o.value=='2' ? 'block':'none';
			}
		}
	}
}
window.LogBook.setHighlighted = function(obj, txtIdPart, selected){
  if(obj==null)
    return;
  if(selected==null){
    selected = obj.checked;
  }

  var table = AJS.getParentBytc(obj, 'table');
  if(table==null)
    return;
  var elms = LogBook.getInputFields(table);
  if(elms!=null && elms.length>0){
    for(var j=0;j<elms.length;j++){
      if(elms[j].name.indexOf(txtIdPart)==0){
        elms[j].style.backgroundColor = selected ? '#99CC66': '';
        break;
      }
    }
  }
}

/*
    JF 05.08.2005
    for careers on internet
*/
function careerGetSelectedInterest(){
  var i=0;
  var obj=document.getElementById('interest_'+i);
  var arr = new Array();
  while(obj!=null){
    if(obj.checked){
      arr.push(obj.value);
    }
    i++;
    obj=document.getElementById('interest_'+i);
  }
  return arr;
}

function careerUpdateStat(){
  var arr = careerGetSelectedInterest();
  if(arr==null || arr.length==0){
    var url = createURL('internet/career', 'updatestat', null, '');
    }
  else{
    var url = createURL('internet/career', 'updatestat', null, 'interestcode='+arr.toString());

    }

  var req = AJS.getRequest (url, null, 'GET');
  req.addCallback (careerUpdateStatCallback);
  req.addErrback (function (data, req) { });
  req.sendReq ();
}

function careerUpdateStatCallback(data, req){
  if (data != null && data.length > 0) {
    eval (data);
    var elem = document.getElementById('text_career');
    if(elem != null){
        elem.innerHTML = text_career;
    }
  }
}

// schooluni formular on internet
function getSelectedTheme() {
    var theme = document.getElementById('themes');
    if(theme != null){
        var id = theme.options[theme.selectedIndex].value;
        if (id > 0 ){
            var url = createURL('internet/schooluni', 'getstudythemelist', null, 'theme='+id);
        }
        else{
            var url = createURL('internet/schooluni', 'getstudythemelist', null, '');
        }
    }

    var req = AJS.getRequest (url, null, 'GET');
    req.addCallback (showStudyTheme);
    req.addErrback (function (data, req) { });
    req.sendReq ();
}


function showStudyTheme(data, req){
    if(data != null && data.length > 0){
        eval(data);
        var studytheme = document.getElementById("studythemes");
        if(studytheme != null){
            studytheme.innerHTML = selectHTML;
        }
    }
}


//---------------------------------------
function getSelectedCounty() {
    $('#div_regions').show();
    var county = document.getElementById('counties');
    if(county != null){
        var id = county.options[county.selectedIndex].value;
        if (id > 0 ){
            var url = createURL('internet/account', 'getcountylist', null, 'county='+id);
        }
        else{
            var url = createURL('internet/account', 'getcountylist', null, '');
        }
    }

    var req = AJS.getRequest (url, null, 'GET');
    req.addCallback (showRegion);
    req.addErrback (function (data, req) { });
    req.sendReq ();
}

function enableEdocCounty (obj) {	
	var edocCounties = obj.getAttribute('data-edoccounties');	
	var countyEdocOffices = obj.getAttribute('data-countyedocoffices');	
	toggleEdocCounties(edocCounties, countyEdocOffices);
} 

//edocCounties and countyEdocOffices are comma separated lists of county codes
function toggleEdocCounties(edocCounties, toHighlight) {
	toggleCH (false,true);
	resetEdocCHMap();
	var highlight = null;
	if(toHighlight !=null) {
		highlight = toHighlight.split(",");
	}
	if(edocCounties != null) {	
		var counties = edocCounties.split(",");
		for (var i=0;i<counties.length;i++) {
			document.getElementById('ch_county_'+counties[i].toLowerCase ()).style.visibility = 'visible';			
			if(highlight != null && contains(highlight,counties[i])) {
				toggleCounty(counties[i],true);
			}
		}
	}
}

function contains(a, obj) {
    if(a == null || obj == null) return false;
	var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
}

function resetEdocCHMap() {
	//This is IE8 compatible
	var elms = AJS.getElementsByTagAndClassName("*","edocchmapcomponent");
	if(elms && elms.length>0){
		var counties = AJS.getElementsByTagAndClassName("*","county",elms[0]);
		for (var i=0;i<counties.length;i++) {
			var imgs = AJS.getElementsByTagAndClassName("img","*",counties[i]);
			if(imgs && imgs.length>0){
				imgs[0].style.visibility = 'hidden';	
			}	
		}
	}
}

function showRegion(data, req){
    if(data != null && data.length > 0){
        eval(data);
        var region = document.getElementById("regions");
        if(region != null){
            region.innerHTML = selectHTML;
        }
    }
}
//---------------------------------------

function unscrambleVerification(domId, input) {
	// Fixed 08.04.2010 AS
	// str += String.fromCharCode(input[i]); calls exploit alert in Anti-Virus software
    var str = new Array();
    input = input.split(',');
    for (var i in input) {
       str[i] = String.fromCharCode(input[i]);
    }
    var elm = document.getElementById(domId);
    if (elm) {
       if (elm.parentNode) {
           elm.parentNode.innerHTML = str.join('');
       }
       else {
           elm.innerHTML = str.join('');
       }
   }
   // JF LOGIN
   // modify captcha component. add id=text_verification for tag <b>
   else{
    $('#text_verification').html(str.join(''));
   }
}
var keepMeAlive = {
	'default': {
		url: "/keep_me_alive.aspx", //url for session refreshing
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
			window.setTimeout(send, _timeout);
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

// image gallery class
var imageGallery 			= function(){
	if(!window["galleryImages"]) return;

	var self 				= this;
	this.util 				= new littleMootools();

	this.images				= (galleryImages && galleryImages.length) ? galleryImages : [] ;

	this.id			    	= {
		main:				"currentImageInGallery"
		, title:			"galleryTitleText"
		, description:		"galleryDescriptionText"
		, copy:				"galleryCopyright"
		, navigation:		"imagegallery_navigation"
		, bignavigation:	"imageGalleryBigImageNavigation"
		, lightbox:			"lightBox"
		, lightboximage:	"lightboximage"
		, lightboxpanel: 'lightboxpanel'
		, lightboxnavitem:  "imagegalleryItem"
	}

	// prepare image arry, start preloading
	this.prepare 		= function(){
		this.cron = new Cron(3000,this.moveRight,this);

		// remove first image
		self.util.e(self.id.main).src = null;
		self.util.setStyle(self.id.main, "opacity", 0);

		// add events
		self.util.addEvent(self.id.main, "click", self.showBigImage);

		// preload all images
		for(var i = 0; i < this.images.length; i++){
			this.images[i].data 		= this.images[i];
			this.images[i].image		= new Image();
			this.images[i].image.src	= this.images[i].data.src;
			this.images[i].image.onload = self.imageLoaded;
			this.images[i].image.onerror = self.cleanOn(this.images[i].data.src);
		}

		// create lightbox
		self.createLightBox();

		/*
		self.util.setStyles(self.id.navigation, {

		});
		*/
	}

	// computes natural dimensions for loaded images
	this.imageLoaded	= function(){
		for(var i = 0; i < self.images.length; i++){
			self.images[i].dimensions	= {
				h:						self.images[i].image.height
				, w:					self.images[i].image.width
			}
			if(i == 0 && self.images[i].dimensions.h > 0 && !self.images[i].displayed){
				self.images[i].displayed = true;
				self.displayImage(0);
				self.util.fade(self.id.main, 500, 0, 1);
			}
		}
	}

	this.cleanOn = function(src){
		return function(evt){
			self.util.stopEvent(evt);
			self.images.splice(self.getImageId(src),1);
		};
	}

	// display an image
	this.displayImage 			= function(index){
		if(self.images[index]){

			self.util.fade(self.id.main, 100, 1, 0, function(){
				self.util.e(self.id.main).src 				= self.images[index].image.src;
				self.util.e(self.id.title).innerHTML 		= self.images[index].data.title;
				self.util.e(self.id.description).innerHTML 	= self.images[index].data.description;
				self.util.e(self.id.copy).innerHTML 		= self.images[index].data.copyright;
				self.util.fade(self.id.main, 200, 0, 1)
			});
		}
		if(self.util.e(self.id.lightboximage).style.display == "block"){
			self.util.fade(self.id.lightboximage, 100, 1, 0, function(){
				self.util.e(self.id.lightboximage).src = self.images[index].image.src;
				self.resizeBigImage(index);
				self.util.fade(self.id.lightboximage, 200, 0, 1);
			});
		}
	}


	// returns the image id for an imagesrc
	this.getImageId = function(src){
		for(var i = 0;i < self.images.length; i++){
			if(self.images[i].image.src == src){
				return i;
			}
		}
		return undefined;
	}

	// show the image in fullscreen mode
	this.showBigImage 			= function(evt){
		if(!self.bigDone){
			//self.createNavigation(self.id.bignavigation);
			self.bigDone = true;
		}
		// key monitor (escape)
		self.util.addEvent(document, "keydown", self.keyMonitor);
		jQuery('body').css('overflow','hidden');

		// set attributes
		self.util.setStyles(self.id.lightbox, {
			opacity:	0
			, display:	"block"
			, "zIndex":	1100
			, overflow:	"hidden"
		});
		self.util.setStyles(self.id.lightboximage, {
			opacity:	0
			, display:	"block"
			, "zIndex":	1101
		});
		self.util.setStyles(self.id.lightboxpanel, {
			opacity:	0
			, display:	"block"
			, "zIndex":	1102
		});
		/*
		self.util.setStyles(self.id.bignavigation, {
			opacity:	0
			, display:	"block"
			, "zIndex":	1103
		});
		*/

		// image
		var src 		= (evt.srcElement) ? evt.srcElement.src : evt.target.src;
		var index 		= self.getImageId(src);

		self.util.set(self.id.lightboximage, {src: self.images[index].image.src});

		// resize
		self.resizeBigImage(index);

		// fade
		self.util.fade(self.id.lightbox, 100, 0, 0.8, function(){
			self.util.setStyles(self.id.lightboximage, {
				opacity:	1
			});
			self.util.setStyles(self.id.lightboxpanel, {
				opacity:	1
			});
			/*
			self.util.setStyles(self.id.bignavigation, {
				opacity:	1
			});
			*/
		});
	}

	// hide lightbox
	this.hideBigImage = function(){
		// key monitor (escape)
		self.cron.stop();
		self.slideshowbutton.stop();
		self.util.removeEvent(document, "keydown", self.keyMonitor);

		// fade
		self.util.fade(self.id.lightbox, 100, 0.6, 0);
		//self.util.fade(self.id.bignavigation, 100, 1, 0);
		self.util.fade(self.id.lightboximage, 100, 1, 0, function(){
			self.util.setStyles(self.id.lightbox, {display:	"none"});
			self.util.setStyles(self.id.lightboximage, {display:	"none"});
		});
		self.util.setStyles(self.id.lightboxpanel, {display:	"none"});
		//self.util.setStyles(self.id.bignavigation, {display:	"none"});
		jQuery('body').css('overflow','');
	}


	// resize lightbox
	this.resizeBigImage = function(index){
		var w = jQuery(window);
		var wc = {w:w.width(), h:w.height(), l:w.scrollLeft(), t:w.scrollTop()};
		self.util.setStyles(self.id.lightbox, {
			height:				wc.h + "px"
			, width:			wc.w + "px"
			, top:				wc.t + "px"
			, left:				wc.l + "px"
		});
		if(index != undefined){
			var maxW			= wc.w - 100;
			var maxH			= wc.h - 160;
			var actualW			= self.images[index].dimensions.w;
			var actualH			= self.images[index].dimensions.h;

			if(actualH > maxH){
				var factor 	= maxH / actualH;
				actualW			= actualW * factor;
				actualH			= actualH * factor;
			}

			if(actualW > maxW){
				var factor 	= maxW / actualW;
				actualW			= actualW * factor;
				actualH			= actualH * factor;
			}

			var imagesize = {
				height:		actualH
				, width:	actualW
				, top:		((wc.h-actualH)/2-50+wc.t)-10
				, left:		((wc.w-actualW)/2+wc.l)-10
			}

			self.util.setStyles(self.id.lightboximage, self.util.addFormat(imagesize));
			//self.util.setStyles(self.id.bignavigation, imagesize);
			/*
			self.util.setStyles(self.id.bignavigation, {
				height:				"80px"
				, width:			"100%"
				, top:				(((self.util.dimensions().h-actualH)/2-100+self.util.scrollPosition().t)+actualH+80) + "px"
			});
			*/
			jQuery('#' + self.id.lightboxpanel).css({
				'top': (wc.t + wc.h-80),
				'left': ((wc.w/2)-160)
			});
			self.updateInfo(index);
		}
	}

	// create navigation
	this.createNavigation		= function(target){
		for(var i = 0; i < self.images.length; i++){
			self.util.e(target).appendChild(self.util.element("img", (self.id.lightboxnavitem + i), {
				"width":			"57px"
				, "height":			"57px"
				, "class":			"imageGallery_thumbnail"
				, cursor:			"pointer"
				, marginRight:		"3px"
				, marginBottom:		"3px"
			}));
			self.util.set((self.id.lightboxnavitem + i), {src:self.images[i].image.src, "class":"imageGallery_thumbnail"});
			self.util.addEvent((self.id.lightboxnavitem + i), "click",  self.navClick);
		}
	}

	this.createBigNavigation = function(target){
		var navButton = function(side) {
			var side2 = side.toLowerCase();
			var cls = '.' + side2;
			var imgcls = 'move' + side;
			self.util.e(target).appendChild(self.util.element("div", cls, {
				'width':				'33%'
				, 'height':			'100%'
				, 'position':		'relative'
				, 'background':	'transparent url(/images/spacer.gif) repeat'
				, 'cursor':			'pointer'
				, 'cssFloat':		side2
			}));
			var fade = AJS.fx.Style(self.util.ebc(side2, target).appendChild(self.util.element("img", '.'+imgcls, {
				'width':				'39px'
				, 'height':			'39px'
				, 'position':		'absolute'
				, 'top':				'50%'
				, 'marginTop':	'-19px'
			})), 'opacity', {'duration':100,'wait':false}).set(0);
			AJS.setStyle(self.util.ebc(imgcls, target),side2,'0');
			var over = function(evt) {
				var elm = self.util.ebc(cls, target);
				self.util.removeEvent(elm, 'mouseover', over);
				self.util.addEvent(elm, 'mouseout', out);
				fade.custom(fade.now, 1);
			};
			var out = function(evt) {
				var elm = self.util.ebc(cls, target);
				var tar = AJS.getEventElm(evt);
				var relatet = evt.relatedTarget;
				if(relatet===undefined)return;
				if (!relatet || (AJS.hasParent(relatet,elm) || relatet == elm)) return;
				self.util.removeEvent(elm, 'mouseout', out);
				self.util.addEvent(elm, 'mouseover', over);
				fade.custom(fade.now, 0);
			};
			self.util.ebc(imgcls, target).src = '/images/gallery/move' + side + '.gif';
			self.util.addEvent(self.util.ebc(cls, target), 'click', self['move' + side]);
			self.util.addEvent(self.util.ebc(cls, target), 'mouseover', over);
			return navButton;
		}
		navButton('Left')('Right');
	};

	// create controllers
	this.createControllers		= function(target){
		//slideshow
		var suffix = '.gif';
		var path = '/images/gallery/';

		//move
		var moveButton = function(name){
			return jQuery('<img class="move'+name.toLowerCase()+'" />').css({
					'width':			'28px'
			}).attr({
				alt:      'move ' + name
				, title:  'move ' + name
				, src:    path + 'move' + name + suffix
			}).click(self['move' + name]).appendTo(self.util.e(target));
		}

		var PlayButton = function(cls){
			var stats = ['play','pause'];
			var stat = 0;

			this.toggle = AJS.bind(function(){
				stat = (stat == 0?1:0);
				this.setImage();
			},this);

			this.setImage = function(){
				var el = this.toElement();
				el.src = path + stats[stat] + suffix;
				el.setAttribute('alt',stats[stat]);
				el.setAttribute('title',stats[stat]);
				delete el;return this;
			}
			this.play = function(){stat = 1;return this.setImage();};
			this.stop = function(){stat = 0;return this.setImage();};
			this.toElement = function(){return self.util.ebc(cls,target);}
			return this.setImage();
		}

		moveButton('Left').css('borderRight','1px solid #000');
		jQuery('<img class="slideshow" />').css({
			'margin': '0 10px'
		}).appendTo(self.util.e(target));
		this.slideshowbutton = new PlayButton('slideshow');
		moveButton('Right').css('borderLeft','1px solid #000');

		AJS.addEventListener(this.slideshowbutton.toElement(), 'click', self.cron.toggle);
		AJS.addEventListener(this.slideshowbutton.toElement(), 'click', self.slideshowbutton.toggle);

		//close
		var close = jQuery('<img class="close" />').css({
			'cssFloat':		'right'
		}).attr({
			title:'close'
			, alt:'close'
			, src:path + 'close' + suffix
		}).click(self.hideBigImage).appendTo(self.util.e(target));
		jQuery('<br/>').css({
			'clear': 					'both'
			, 'lineHeight':		0
			, 'border':				'none'
		}).appendTo(self.util.e(target));
	}

	this.updateInfo = function(index){
		self.util.ebc('info',self.id.lightboxpanel).innerHTML = (index + 1) + ' / ' + self.images.length;
	}
	this.navClick = function(evt){
		var src = (evt.srcElement) ? evt.srcElement.src : evt.target.src;
		var index = self.getImageId(src);
		self.displayImage(index);
	}
	this.moveLeft = function(index){
		if(!AJS.isNumber(index))index = self.getImageId(self.util.e(self.id.main).src);
		index = Math.min(index,self.images.length);
		if(index<1)index = self.images.length;
		self.displayImage(--index);
	}
	this.moveRight = function(index){
		if(!AJS.isNumber(index))index = self.getImageId(self.util.e(self.id.main).src);
		index = Math.max(index,0);
		if(++index>=self.images.length)index=0;
		self.displayImage(index);
	}


	// creates lightbox
	this.createLightBox			= function(){
		self.util.e("#body")[0].appendChild(self.util.element("div", self.id.lightbox, {
			display:		"none"
			, opacity:		"0"
			, position:		"absolute"
			, backgroundColor:	"#000"
			, cursor:		"pointer"
		}));
		self.util.e("#body")[0].appendChild(self.util.element("img", self.id.lightboximage, {
			display:		"none"
			, opacity:		"0"
			, position:		"absolute"
			, backgroundColor:	"#000"
			, cursor:		"pointer"
			/*, border: 	"10px solid #FFF"*/
		}));
		self.util.e("#body")[0].appendChild(self.util.element("div", self.id.lightboxpanel, {
			display:		"none"
			, position:		"absolute"
			, cursor:		"pointer"
			, backgroundColor: '#FFF'
		}));
		self.util.e(self.id.lightboxpanel).appendChild(self.util.element("div", '.info', {
			paddingBottom: '10px'
			, borderBottom: '1px dotted #000'

		}));
		self.util.e(self.id.lightboxpanel).appendChild(self.util.element("div", '.controll', {
			paddingTop: 	"10px"
		}));
		/*
		self.util.e("#body")[0].appendChild(self.util.element("div", self.id.bignavigation, {
			display:		"none"
			, opacity:		"0"
			, position:		"absolute"
			, cursor:		"pointer"
		}));
		*/
		self.util.addEvent(self.id.lightbox, "click", self.hideBigImage);
		self.util.addEvent(self.id.lightboximage, "click", self.hideBigImage);
		self.createControllers(self.util.ebc('controll', self.id.lightboxpanel));
		//self.createBigNavigation(self.id.bignavigation);

		//self.createNavigation(self.id.bignavigation);

		// resize
		self.util.addEvent(window, "resize", function(evt){
			var index = self.getImageId(self.util.e(self.id.lightboximage).src);
			self.resizeBigImage(index);
		});
		self.util.addEvent(window, "scroll", function(evt){
			var index = self.getImageId(self.util.e(self.id.lightboximage).src);
			self.resizeBigImage(index);
		});
	};
	this.keyMonitor = function(evt){
		switch(evt.keyCode){
			case 27:self.hideBigImage();break;
			/*case 38:*/case 37: /*left arrow*/self.moveLeft();break;
			/*case 40:*/case 39: /*right arrow*/self.moveRight();break;
			default:return true;
		}
		self.util.stopEvent(evt);
		return false;
	};
	this.prepare();
	this.createNavigation(this.id.navigation);
}
/*little fix, if we have no AJS.fx*/
if(!AJS.fx){
	AJS.fx = {
		Style: function(elm,what,options){
			return {custom: function(from,to){jQuery(elm).fadeTo(options.duration,to);return this;},set:function(to){jQuery(elm).css(what,to);return this;},now:0};
		}
	}
}

var Cron = function(time,func,bind){
	var id = null;
	var f = null;
	var b = this;
	var t = 1;

	this.update = function(time,func,bind){
		f = func || f;
		b = bind || b;
		t = time || t;
		return this;
	}

	this.start = function(){
		if(id == null)this.cycle(true);
		return this;
	}

	this.stop = function(){
		clearTimeout(id);
		id = null;
		return this;
	}

	this.cycle = AJS.bind(function(ini){
		ini || f.apply(b);
		if(id != null || ini)id = setTimeout(this.cycle,t);
	},this);

	this.toggle = AJS.bind(function(){
		(id==null?this.start():this.stop());
	},this);

	this.update(time,func,bind)
}


// utils.. little mootools..
var littleMootools 	= function(){
	var self 			= this;
	this.fps 			= 50;

	// set a style
	this.setStyle 		= function(el, style, value){
		var e 			= self.e(el);
		switch(style.toLowerCase()){
			case "opacity":
				try{
					e.style.opacity = value;
					e.style.filter 	= "alpha(opacity="+(value*100)+");";
				} catch(ex){}
				break;
			default:
				e.style[style] 		= value;
				break;
		}
	}

	// set attribute
	this.set = function(el, attributes){
		var e = self.e(el);
		if(e){
			for(var key in attributes){
				e.setAttribute(key, attributes[key]);
			}
		}
	}


	// set multiple styles
	this.setStyles = function(el, styles){
		for(var key in styles){
			self.setStyle(el, key, styles[key]);
		}
	}

	this.addFormat = function(styles, format){
		format = format || 'px';
		for(var key in styles){
			var l1 = styles[key].length, l2 = format.length;
			if(!styles[key].substr || styles[key].substr(l1-l2,l2) != format){
				styles[key] = styles[key] + format;
			}
		}
		return styles;
	}

	// return scrollTop
	this.scrollPosition = function(el){
		if(el){
			return {
				t:				self.e(el).scrollTop
				, l:			self.e(el).scrollLeft
			}

		}
		else{

			if(document.pageXOffset){
				return {
					t:				document.pageYOffset
					, l:			document.pageXOffset
				}
			}
			else if(document.documentElement.scrollTop){
				return {
					t:			document.documentElement.scrollTop
					, l:		document.documentElement.scrollLeft
				}
			}
			else if(document.body.scrollTop){
				return {
					t:			document.body.scrollTop
					, l:		document.body.scrollLeft
				}
			}
		}
		return {
			t:			0
			, l:		0
		}
	}

	// welement dimensions
	this.dimensions = function(el){
		var ret 			= {h:0,w:0};
		if(el){
			var e 			= self.e(el);
			try{
				ret.h   	= e.clientHeight;
				ret.w		= e.clientWidth;
			}
			catch(ex){}
		}
		else{
			try{
				ret.h		= window.innerHeight;
				ret.w		= window.innerWidth;
				if(ret.h == undefined) throw("could not get dimensions");
			}
			catch(ex){
				ret.h		= document.body.offsetHeight;
				ret.w		= document.body.offsetWidth;
			}
		}

		return ret;
	}

	// get element by id
	this.e = function(el){
		if(typeof(el) != "object"){
			if(el.substr(0,1) == "#")
			{
				return document.getElementsByTagName(el.substr(1));
			}
			else{
				return document.getElementById(el);
			}
		}
		else{
			return el;
		}
	}

	this.ebc = function(cls, parent, tag){
		return AJS.getElementsByTagAndClassName(tag,cls,self.e(parent))[0];
	}

	// fade element
	this.fade =  function(el, time, from, to, callback){
		this.frames				= Math.floor(self.fps*(time/1000))
		this.stepper			= Math.floor(1000/self.fps);
		var ostepper			= ((to - from)/this.frames);
		var currentOpacity		= from;

		for(var i = 0;i < this.frames; i++){
			setTimeout(function(){
				currentOpacity += ostepper;
				self.setStyle(el, "opacity", currentOpacity);
			}, (i * this.stepper));
		}

		if(callback) setTimeout(callback, time);
	}

	// create element
	this.element = function(type, id, styles){
		var el = document.createElement(type);
		if(id && id.substr(0,1) == '.'){
			AJS.addClass(el,id.substr(1));
		}else{
			el.setAttribute("id", id);
		}
		self.setStyles(el, styles);
		return el;
	}

	// add event
	this.addEvent = function(el, type, callback){
		try{
			self.e(el).addEventListener(type, callback, false);
		}
		catch(ex){
			self.e(el).attachEvent(("on" + type), callback);
		}
	}
	this.removeEvent = function(el,type,callback){
		try{
			self.e(el).removeEventListener(type, callback, false);
		}
		catch(ex){
			self.e(el).detachEvent(("on" + type), callback);
		}
	}
	this.stopEvent = function(evt){
		if (!evt) {
			evt = window.event;
		}
		evt.cancelBubble = true;
		if (evt.stopPropagation) {
			evt.stopPropagation ();
		}
		if(evt.preventDefault){
			evt.preventDefault();
		}
		evt.returnValue=false
	}
}


// load gallery
try{
	window.addEventListener("load", function(){
		new imageGallery();
	}, false);
}
catch(ex){
	window.attachEvent("onload", function(){
		new imageGallery();
	});
}










