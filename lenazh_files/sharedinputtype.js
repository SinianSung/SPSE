
// CheckBox
// used to update the hidden with the value from the checkbox
function toggleCheckBox (cb) {
	if (cb.nextSibling) {
		if (cb.checked) {
			cb.nextSibling.value = '1';
		}
		else {
			cb.nextSibling.value = '0';
		}
	}
}
// used to explicitely set a value
function setCheckBox (cb, checked) {
	if (cb.nextSibling) {
		cb.checked = checked;
		cb.nextSibling.value = (checked ? '1' : '0');
	}
}


function updateSchoolEntrySelector(cb){
  if(window.bb_allowmultipleschoolentries==null)
    return;
  
  var obj = document.getElementById('form_id_accounttype');
  if(obj==null)
    return;
  
  var multiple = false;
  for(var i=0;i<bb_allowmultipleschoolentries.length;i++){
    if(bb_allowmultipleschoolentries[i]==obj.value){
      multiple = true;
      break;
    }
  }
  
  //Multiple not allowed
  if(!multiple){
    var foundChecked = false;
    var cbs = document.getElementsByTagName('input');
    if(cbs!=null){
      for(var i=0;i<cbs.length;i++){
        if(cbs[i].id!=null && cbs[i].id.indexOf('form_cb_schoolentries')==0){
          var n = 'form_'+cbs[i].id.substring(8);
          if(cb!=null){
            if(cbs[i]!=cb){
              cbs[i].checked = false;
              var obj =  findObject(n);
              if(obj!=null){
                obj.value = '0';
              }
            }
          }
          else {
            if(!foundChecked && cbs[i].checked){
              foundChecked = true;
            }
            else {
              cbs[i].checked = false; 
              var obj =  findObject(n);
              if(obj!=null){
                obj.value = '0';
              }
            }
          }
        }
      }
    }
  }
}
