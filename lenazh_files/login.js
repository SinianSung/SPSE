
var id_account = 0;


function fEditProfil(typeOfProfil){

    $.ajax({
        url:createURL('internet/account', 'edituserprofil', null, 'type='+typeOfProfil+'&edit=true'),
        type:'GET',
        async:false,
        cache:false,
        dataType:'html',
        success:function(data){
            $('#edit_form').html(data);
            if(navigator.userAgent.indexOf('MSIE') != -1){
                $('#img_close').css('right', '24px');
            }
            $.blockUI({
                message:$('#edit_form')
            })
        },
        error:function(request, status, error){
            $('#edit_form').html(request.responseText);
            window.location.reload();
        }
    });
    
    $('#link_userinfo, #link_edit_userinfo').live('click', function(){
        $('#link_userinfo').css('font-weight', 'bold');

        $.ajax({
            url:createURL('internet/account', 'loadforms', null, 'type=userinfo&edit=true'),
            type:'GET',
            async:false,
            cache:false,
            datatType:'html',
            success:function(data){
               $('#content').html(data);
               
            },
            error:function(request, status, error){
                $('#load_msg').html(request.statusText);
                $('#load_msg').show();
            }
        });           
    });
    
    //$('#link_deactivate_userinfo').live('click', function(){
    $('#link_deactivate_userinfo').click(function(){
        $.ajax({
            url:createURL('internet/account', 'getmsg', null, 'type=deactivate_userinfo'),
            type:'GET',
            dataType:'text',
            cache:false,
            success:function(data){
                $('#msgbox').html(data);
                $.blockUI({
                    message: $('#msgbox')
                });
                $('#yes').click(function(){
                    $.ajax({
                        url:createURL('internet/account', 'togglestatus', null, 'type=userinfo'),
                        type:'GET',
                        async:false,
                        cache:false,
                        datatType:'html',
                        success:function(data){
                            document.location.href = data;
                            $.unblockUI();
                        },
                        error:function(request, status, error) {
                            alert(request.statusText);
                        }
                    });
                });
                $('#no').click(function(){
                    $.blockUI({
                        message:$('#edit_form')
                    });
                    
                });
            },
            error:function(request, status, error){
                alert(request.statusText);
            }
        });     
    });
    
    
// ******************************* MYBERUFSWAHL *******************************
    // edit myberufswahl'preferences
    $('#link_edit_myberufswahl, #link_my_preferences').live('click', function(){
//        $('.navmenu_link').each(function(i){
//            $(this).css('font-weight', 'normal');
//        });
        $('#link_edit_myberufswahl').css('font-weight', 'bold');
        // -------------------------------------------------
        $.ajax({
            url:createURL('internet/account', 'loadforms', null, 'type=myberufswahl&edit=true'),
            type:'GET',
            async:false,
            cache:false,
            datatType:'html',
            success:function(data){
                $('#content').html(data);
            },
            error:function(request, status, error){
                //fResetPwd();
                $('#load_msg').html(request.statusText);
                $('#load_msg').show();
            }
        });           
    });
    
    // create a myberufswahl account via the user profil
    $('#link_myberufswahl').live('click', function(){
        $('.navmenu_link').each(function(i){
            $(this).css('font-weight', 'normal');
        });
        $('#link_myberufswahl').css('font-weight', 'bold');
        // -------------------------------------------------
        $.ajax({
            url:createURL('internet/account', 'loadforms', null, 'type=myberufswahl&activation=true'),
            type:'GET',
            async:false,
            cache:false,
            datatType:'html',
            success:function(data){
                $('#content').html(data);
            },
            error:function(request, status, error){
                //fResetPwd();
                $('#load_msg').html(request.statusText);
                $('#load_msg').show();
            }
        });           
    });
    
    

    
/******************** EDOC ****************************/        
    $('#link_edit_edoc, #link_edoc_preferences').live('click', function(){
//        $('.navmenu_link').each(function(i){
//            $(this).css('font-weight', 'normal');
//        });
        $('#link_edit_edoc').css('font-weight', 'bold');
        
        $.ajax({
            url:createURL('internet/account', 'loadforms', null, 'type=edoc&edit=true'),
            type:'GET',
            async:false,
            cache:false,
            datatType:'text',
            success:function(data){
                $('#content').html(data);
            },
            error:function(request, status, error){
                //ResetPwd();
                $('#content').html(request.responseText);
                $('#load_form').html(request.statusText);
                $('#load_form').show();
                
            }
        });           
    });
    
    $('#link_edoc').live('click', function(){
//        $('.navmenu_link').each(function(i){
//            $(this).css('font-weight', 'normal');
//        });
        $('#link_edoc').css('font-weight', 'bold');
        
        $.ajax({
            url:createURL('internet/account', 'loadforms', null, 'type=edoc&activation=true'),
            type:'GET',
            async:false,
            cache:false,
            datatType:'text',
            success:function(data){
                $('#content').html(data);
            },
            error:function(request, status, error){
                //ResetPwd();
                $('#content').html(request.responseText);
                $('#load_form').html(request.statusText);
                $('#load_form').show();
            }
        });           
    });
        
    $('img.close').click(function(){
        $.unblockUI();
        //window.location.reload();
    });
//});
}


    // EDIT ALERT PREFERENCES
    
    $('#link_alert_preferences').live('click', function() {
        $.ajax({
            url:createURL('internet/account', 'loadforms', null, 'type=alert&edit=true'),
            type:'GET',
            async:false,
            cache:false,
            datatType:'text',
            success:function(data){
                $('#content').html(data);
            },
            error:function(request, status, error){
                //ResetPwd();
                $('#content').html(request.responseText);
                $('#load_form').html(request.statusText);
                $('#load_form').show();
                
            }
        });      
    });
    
    // add alert email link on internet. 
    $('.link_alert_preferences').live('click', function() {
        $.ajax({
            url:createURL('internet/account', 'edituserprofil', null, 'type=alert&edit=true'),
            type:'GET',
            async:false,
            cache:false,
            dataType:'html',
            success:function(data){
                $('#edit_form').html(data);
                $.blockUI({
                    message:$('#edit_form')
                })
            },
            error:function(request, status, error){
                $('#edit_form').html(request.responseText);
                window.location.reload();
            }
        });
    });
    

//******************** FUNCTIONS *******************************

function fSaveUserInfo(captcha) {
    fEncryptePwd();
	
    $.ajax({
        url:createURL('internet/account', 'adduserinfo', null, 'captcha='+captcha+'&edit=true'),
        //url:createURL('internet/account', 'adduserinfo', null, 'captcha='+captcha),
        type:'GET',
        async:false,
        cache:false,
        dataType:'html',
        data:$('#frm_userinfo').serialize(),
        success:function(data){

            var msg = data ;
            $.ajax({
                url:createURL('internet/account', 'loadforms', null, 'type=userinfo&edit=true'),
                type:'GET',
                async:false,
                cache:false,
                data:$('#frm_services').serialize(),
                dataType:'text',
                success:function(data){
                    $('#content').html(data);
                    $('#load_msg').html(msg);
                    $('#load_msg').show();
                    fGetMenu();
                }
           });
        },
        error:function(request, status, error){
            $('#content').html(request.responseText);
            $('#load_msg').html(request.statusText);
            $('#load_msg').show();
        }
    });
    $('img.close').click(function(){
        $.unblockUI();  
    });
}

// SAVE myBerufswahl account
function fSaveMyBerufswahl() {
    $.ajax({
        //url:createURL('internet/account', 'editmyberufswahl', null, 'edit=1'),
        url:createURL('internet/account', 'editmyberufswahl', null, 'activation=true'),
        type:'GET',
        async:false,
        cache:false,
        dataType:'text',
        data:$('#frm_services').serialize(),
        success:function(data){
            if(data.indexOf('.aspx') != -1) {
                $.unblockUI();
                document.location.href = data;
            }
            else {
//                $('#load_msg').html(data);
//                $('#load_msg').show();
//                fGetMenu();
//                fReloadMenuNavigation('myberufswahl');
                var msg = data ;
                $.ajax({
                    url:createURL('internet/account', 'loadforms', null, 'type=myberufswahl&edit=true'),
                    type:'GET',
                    async:false,
                    cache:false,
                    data:$('#frm_services').serialize(),
                    dataType:'text',
                    success:function(data){
						
                        $('#content').html(data);
                        $('#load_msg').html(msg);
                        $('#load_msg').show();
                        fGetMenu();
                    }
           });
            }
        },
        error:function(request, status, error){
            //$('#load_msg').css("display","block");
            $('#content').html(request.responseText);
            $('#load_msg').html(request.statusText);
            $('#load_msg').show();
            
        }
    });
    $('img.close').click(function(){
        $.unblockUI();
    });
}

// save edoc account
//
function fSaveEdoc(edit){
    $.ajax({
        url:createURL('internet/account', 'addedoc', null, 'edit=true'),
        type:'GET',
        async:false,
        cache:false,
        data:$('#frm_services').serialize(),
        dataType:'text',
        success:function(data){
            var msg = data ;
            $.ajax({
                url:createURL('internet/account', 'loadforms', null, 'type=edoc&edit=true'),
                type:'GET',
                async:false,
                cache:false,
                data:$('#frm_services').serialize(),
                dataType:'text',
                success:function(data){
                    $('#content').html(data);
                    $('#load_msg').html(msg);
                    $('#load_msg').show();
                    fGetMenu();
                    //fReloadMenuNavigation('edoc')
                }
           });
        },
        error:function(request, status, error){
            if(edit){
                $('#content').html(request.responseText);
                $('#load_msg').html(request.statusText);
                $('#load_msg').show();
            }
        }
    });
}



// md5 encrypte pwd fields
function fEncryptePwd(){
    $('#pwd_length').val($('#pwd').val().length);
    if(document.getElementById("pwd").value.length > 0) {
        document.getElementById("pwd").value = hex_md5(document.getElementsByName("pwd")[0].value);
        document.getElementById("confirm_pwd").value = hex_md5(document.getElementsByName("confirm_pwd")[0].value);
    }
    
}

// clear pwd fields if errors occurs when submiting forms
function fResetPwd(){
    $('#pwd').val("");
    $('#confirm_pwd').val("");
    //("pwd")[0].value = '';
    //document.getElementsByName("confirm_pwd")[0].value = '';
}

// display cancel,abort confirmation's window and call ajax cancel action if confirmed
function fAbort(id_account){
    if(id_account > 0){
        $.unblockUI({
            onUnblock:function(){
                $.ajax({
                    url:createURL('internet/account', 'getmsg', null, 'type=abort'),
                    type:'GET',
                    dataType:'html',
                    async:false,
                    cache:false,
                    success:function(data){
                        $('#msgbox').html(data);
                        $.blockUI({
                            message: $('#msgbox')
                        });
                        $('#yes').click(function(){
                                $.ajax({
                                    url:createURL('internet/account', 'getmsg', null, 'type=delete'),
                                    type:'GET',
                                    async:false,
                                    cache:false,
                                    dataType:'html',
                                    success:function(data){
                                        $.blockUI({ 
                                            message:data,
                                            timeout:2000
                                        });
                                        $.ajax({
                                            url:createURL('internet/account', 'cancel', null, 'id_account=' + id_account),
                                            type:'GET',
                                            async:false,
                                            cache:false,
                                            dataType:'text',
                                            error:function(request, status, error){
                                                $('#load_msg').html(request.statusText);
                                                $('#load_msg').show();
                                            }
                                        });
                                    }
                                });
                        });
                        $('#no').click(function() {
                            $.blockUI({
                               message:$('#load_form')
                            });
                        });
                    }
                });
            }
        });
    }
    else
        $.unblockUI();
}


// Load User menu
function fGetMenu(){
    $.ajax({
        url:createURL('internet/account', 'getmenu', null, 'type=reload'),
        type:'GET',
        async:false,
        cache:false,
        datatType:'html',
        success:function(data){
			if(data.length > 0)
				$('#load_menu').html(data);
        }
    });
}

// load navigation menu (left menu) in user profil
function fReloadMenuNavigation(typeOfProfil){
    $.ajax({
        url:createURL('internet/account', 'getmenunavigation', null, 'type='+typeOfProfil),
        type:'GET',
        async:false,
        cache: false,
        dataType:'text',
        success:function(data){
            $('#navigation').html(data);  
        }
    });
}

// create alert-email form via AJAX, on internet
//function fAddAlertEmail(context, isConnected){
function fAddAlertEmail(context, isConnected){
	if(eval(isConnected)){
		$.ajax({
			url:createURL('internet/account', 'addalertemailrss', null, 'login=true&form_context=' + context),
			type:'GET',
			async:false,
			cache:false,
			dataType:'html',
			success:function(data){
				$("#edit_form").empty();
				$("#edit_form").html(data);
				$.blockUI({
					message:$("#edit_form"),
					css: { width : '400px'}
				});
			}
		});
	}
	else {
		$.ajax({
            url:createURL('internet/account', 'handlelogin', null, 'login=true&addAlert=true&form_context=' + context),
            dataType:'html',
            async:false,
            cache:false,
            success:function(data){
				$('#edit_form').empty();
                $('#edit_form').html(data);
                $.blockUI({
                    message:$('#edit_form')
                });
            }
        });
	}
}
