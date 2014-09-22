$(document).ready(function () {
    $.blockUI.defaults.css.textAlign = 'left';
    $.blockUI.defaults.css.padding = 10;
    $.blockUI.defaults.css.top = '10%';
    $.blockUI.defaults.css.width = '320px';
    $.blockUI.defaults.css.height = 'auto';
    $.blockUI.defaults.css.backgroundColor = '#EBF5F5';
    $.blockUI.defaults.css.cursor = 'default';
    $.blockUI.defaults.overlayCSS.backgroundColor = '#000';
    $.blockUI.defaults.overlayCSS.opacity = 0.5;

    // LOGIN
    var loginHTML = $('#login_box').html();
    var isSmallScreen = false;


    //if($(window).height() < 800){
    if (document.documentElement.clientHeight < 700) {
        /*
        $('#load_form').css('height', '600px');
        $('#load_form').css('overflow', 'auto');
        */
        //$('#frm_userinfo').addClass('frm_userinfo');
        isSmallScreen = true;
    }

    /* global event handler */
    $('#img_close, #btn_close').live('click', function () {
        fAbort(id_account);
        id_account = 0;
        $('#login_box').html(loginHTML);
    });

    $('#btn_ok').live('click', function () {
        $.unblockUI();
    });
    /* end global event handler */

    // submit form with enter key press
    $('#edit_form').live('keypress', function (event) {
        if (event.which == 13) {
            event.preventDefault();
            if ($('#btn_login').length) {
                $('#btn_login').click();
            }

            if ($('#btn_password').length) {
                $('#btn_password').click();
            }
        }
    });


    $('#link_login, .link_login').live('click', function () {
        id_account = 0;
        $.ajax({
            url: createURL('internet/account', 'handlelogin', null, 'login=true'),
            dataType: 'html',
            async: false,
            cache: false,
            success: function (data) {
                $('#edit_form').html(data);
                $.blockUI({
                    message: $('#edit_form')
                });
            }
        });
    });

    $('#btn_login').live('click', function (event) {
        event.preventDefault();

        $.ajax({
            url: createURL('internet/account', 'handlelogin', null, 'logged=true'),
            type: "POST",
            async: true,
            dataType: 'html',
            cache: false,
            data: $('#frm_login').serialize(),
            success: function (data) {
                if (data.length == 0)
                    document.location.reload();
                else
                    document.location.href = data;
            },
            error: function (request, status, error) {
                //alert(error);
                $('#load_msg_login').css({ 'font-size': '11px', 'color': '#990033' }).html(request.statusText).show();
            }
        })
    });

    // *********************************************
    // all of the fXxxx function are in login.js   *
    // *********************************************
    // LOST PASSWORD
    $('#link_password').live('click', function () {
        $('#img_close_login').click(function () {
            $.unblockUI();
        });

        $.unblockUI({
            onUnblock: function () {
                $.ajax({
                    url: createURL('internet/account', 'handlelogin', null, 'lostpassword=true'),
                    type: "GET",
                    async: false,
                    dataType: 'html',
                    cache: false,
                    success: function (data) {
                        $("#edit_form").html(data);
                        $.blockUI({
                            message: $("#edit_form")
                        });
                    },
                    error: function (request, status, error) {
                        $('#load_msg_login').html(request.statusText).show();
                    }
                });
            }
        });
    });

    $('#btn_password').live('click', function () {
        $.ajax({
            url: createURL('internet/account', 'handlelogin', null, 'lostpassword=true'),
            type: "POST",
            async: false,
            cache: false,
            dataType: 'html',
            data: $("#frm_login").serialize(),
            success: function (data) {
                $("#edit_form").html(data);
                $.blockUI({
                    message: $('#edit_form')
                });

                $('#btn_close').click(function () {
                    $.unblockUI();
                });


            },
            error: function (request, status, error) {
                $('#load_msg_login').html(request.statusText).show();
            }
        });
    });


    $('#link_registration').live('click', function () {
        $.unblockUI({
            onUnblock: function () {
                $.ajax({
                    url: createURL('internet/account', 'loadforms', null, 'type=userinfo'),
                    type: "GET",
                    async: false,
                    cache: false,
                    dataType: 'html',
                    success: function (data) {
                        $('#load_form').html(data);
                        if (isSmallScreen) {
                            $('#frm_userinfo').addClass('scroll');
                            $('#img_close, #btn_close').css('right', '24px');
                        }
                        /*if(navigator.userAgent.indexOf('MSIE') != -1 && isSmallScreen){
                        $('#img_close').css('right', '24px');
                        }*/

                        $.blockUI({
                            message: $('#load_form')
                        });
                    }
                });
            }
        });
    });


    // SAVE USERINFO
    $('#btn_userinfo').live('click', function () {
        fEncryptePwd();
        $.ajax({
            url: createURL('internet/account', 'adduserinfo', null, 'captcha=loadforms'),
            type: "GET",
            async: false,
            cache: false,
            data: $('#frm_userinfo').serialize(),
            dataType: 'html',
            success: function (data) {
                id_account = data;
                $.unblockUI({
                    onUnblock: function () {
                        $.ajax({
                            url: createURL('internet/account', 'loadforms', null, 'type=registration&form_id_account=' + id_account),
                            type: "GET",
                            async: false,
                            cache: false,
                            dataType: 'text',
                            success: function (data) {
                                $('#load_form').html(data);
                                $.blockUI({
                                    message: $("#load_form")
                                });
                            },
                            error: function (request, status, error) {

                            }
                        });
                    }
                });
            },
            error: function (request, status, error) {
                fResetPwd();
                $('#load_form').html(request.responseText);
                $('#load_msg').html(request.statusText);
                $('#load_msg').show();
                if (isSmallScreen) {
                    $('#frm_userinfo').addClass('scroll');
                    $('#img_close, #btn_close').css('right', '24px');
                }

                $('#img_close, #btn_close').click(function () {
                    fAbort(0);
                });
            }
        });
    });

    // choose services                        
    $('#btn_registration').live('click', function () {
        $.ajax({
            // JF 01.03.2012
            //url:createURL('internet/account', 'loadforms', null, 'type=services&add=true&id_account='+id_account),
            url: createURL('internet/account', 'loadforms', null, 'type=services&add=true'),
            type: 'GET',
            async: false,
            cache: false,
            data: $('#frm_registration').serialize(),
            dataType: 'html',
            success: function (data) {
                $.unblockUI({
                    onUnblock: function () {
                        $('#load_form').html(data);
                        $.blockUI({
                            message: $('#load_form')
                        });
                    }
                });
            },
            error: function (request, status, error) {
                $('#load_msg').html(request.statusText);
                $('#load_msg').show();
            }
        });
    });

    $('#btn_myberufswahl').live('click', function () {
        //alert('myberufswahl');
        $.ajax({
            url: createURL('internet/account', 'addmyberufswahl', null, ''),
            type: 'GET',
            async: false,
            cache: false,
            data: $('#frm_services').serialize(),
            dataType: 'html',
            success: function (data) {
                $.unblockUI({
                    onUnblock: function () {
                        $('#load_form').html(data);
                        $.blockUI({
                            message: $('#load_form')
                        });
                        // cancel via close button on edoc form
                        $('#img_close, #btn_close').unbind('click');
                        $('#img_close, #btn_close').click(function () {
                            fAbort(id_account);
                            $('#login_box').html(loginHTML);
                        });
                    }
                });
            },
            error: function (request, status, error) {
                $('#load_form').html(request.responseText);
                $('#load_msg').html(request.statusText);
                $('#load_msg').show();
            }
        })
    });

    $('#btn_edoc').live('click', function () {
        $.ajax({
            url: createURL('internet/account', 'addedoc', null, 'add=true'),
            type: 'GET',
            async: false,
            cache: false,
            data: $('#frm_services').serialize(),
            dataType: 'text',
            success: function (data) {
                $('#load_form').html(data);
                $.blockUI({
                    message: $('#load_form')
                });

                // cancel via close button on edoc form
                $('#img_close, #btn_close').unbind('click');
                $('#img_close, #btn_close').click(function () {
                    fAbort(id_account);
                    $('#login_box').html(loginHTML);
                });
            },
            error: function (request, status, error) {
                $('#load_form').html(request.responseText);
                $('#load_msg').html(request.statusText);
                $('#load_msg').show();
            }
        });
    });

    $('#btn_alert').live('click', function () {
        $.ajax({
            url: createURL('internet/account', 'addalert', null, 'add=true'),
            type: 'GET',
            async: false,
            cache: false,
            data: $('#frm_services').serialize(),
            dataType: 'html',
            success: function (data) {
                $('#load_form').html(data);
                $.blockUI({
                    message: $('#load_form')
                });
            },
            error: function (request, status, error) {
                $('#load_form').html(request.responseText);
                $('#load_msg').html(request.statusText);
                $('#load_msg').show();
            }
        });
    });

    /*********************************
    * activate or deactivate service *
    **********************************/
    $('#chkDeactivateMyBerufswahl').live('click', function () {
        $.ajax({
            url: createURL('internet/account', 'togglestatus', null, 'type=myberufswahl&edit=true&status=2'),
            type: 'GET',
            async: false,
            cache: false,
            dataType: 'html',
            success: function (data) {
                fGetMenu();
                $('#content').html(data);
                //document.location.reload();
            },
            error: function (request, status, error) {
                $('#load_msg').html(request.statusText);
                $('#load_msg').show();
            }
        });
    });

    $('#chkActivateMyBerufswahl').live('click', function () {
        $.ajax({
            url: createURL('internet/account', 'togglestatus', null, 'type=myberufswahl&edit=true&status=1'),
            type: 'GET',
            async: false,
            cache: false,
            dataType: 'html',
            success: function (data) {
                fGetMenu();
                $('#content').html(data);
            },
            error: function (request, status, error) {
                $('#load_msg').html(request.statusText);
                $('#load_msg').show();
            }
        });
    });


    $('#chkDeactivateEdoc').live('click', function () {
        $.ajax({
            url: createURL('internet/account', 'togglestatus', null, 'type=edoc&edit=true&status=2'),
            type: 'GET',
            async: false,
            cache: false,
            dataType: 'html',
            success: function (data) {
                fGetMenu();
                $('#content').html(data);
            },
            error: function (request, status, error) {
                $('#load_msg').html(request.statusText);
                $('#load_msg').show();
            }
        });
    });

    $('#chkActivateEdoc').live('click', function () {
        $.ajax({
            url: createURL('internet/account', 'togglestatus', null, 'type=edoc&edit=true&status=1'),
            type: 'GET',
            async: false,
            cache: false,
            dataType: 'html',
            success: function (data) {
                fGetMenu();
                $('#content').html(data);
            },
            error: function (request, status, error) {
                $('#load_msg').html(request.statusText);
                $('#load_msg').show();
            }
        });
    });

    $('#chkDeactivateAlert').live('click', function () {
        $.ajax({
            url: createURL('internet/account', 'togglestatus', null, 'type=alert&status=2&edit=true'),
            type: 'GET',
            async: false,
            cache: false,
            dataType: 'html',
            success: function (data) {
                fGetMenu();
                $('#content').html(data);
            },
            error: function (request, status, error) {
                $('#load_msg').html(request.statusText);
                $('#load_msg').show();
            }
        });
    });

    $('#chkActivateAlert').live('click', function () {
        $.ajax({
            url: createURL('internet/account', 'togglestatus', null, 'type=alert&status=1&edit=true'),
            type: 'GET',
            async: false,
            cache: false,
            dataType: 'html',
            success: function (data) {
                fGetMenu();
                $('#content').html(data);
            },
            error: function (request, status, error) {
                $('#load_msg').html(request.statusText);
                $('#load_msg').show();
            }
        });
    });

    $('#btn_save_alert').live('click', function () {
        $.ajax({
            url: createURL('internet/account', 'addalertemailrss', null, ''),
            type: 'GET',
            async: false,
            cache: false,
            dataType: 'html',
            data: $('#frm_alertemailrss').serialize(),
            success: function (data) {
                if (data.length > 0) {
                    $('#load_form').html(data);
                    $.blockUI({
                        message: $("#load_form")
                    });
                }
                else {
                    $.unblockUI();
                    fGetMenu();
                }
            },
            error: function (request, status, error) {
                $('#load_form').html(request.statusText);
                $('#info_msg').show();
            }
        });
    });

    $("#frm_alertemailrss").live('keypress', function (event) {
        if (event.which == 13) {
            event.preventDefault();
            $("#btn_save_alert").click();
        }
    });

    // if enter keypress let's submit the form
    $('#frm_bookmark').live('keypress', function (event) {
        if (event.which == 13) {
            event.preventDefault();
            $('#btn_save_bookmark').click();
        }
    });

    // click to save bookmark
    $('#btn_save_bookmark').live('click', function (event) {
        $.ajax({
            url: createURL('internet/account', 'addbookmark', null, ''),
            type: 'GET',
            async: false,
            cache: false,
            dataType: 'html',
            data: $('#frm_bookmark').serialize(),
            success: function (data) {
                $.unblockUI();
                fGetMenu();
            },
            error: function (request, status, error) {
                $('#load_form').html(request.statusText);
                $('#info_msg').show();
            }
        });
    });

    // ------------------------------------------------
    // ALERT EMAIL
    // click on internet to create alert email when the user's not logged
    // first step : login and then create alert email
    $('#btn_login_alert').live('click', function (event) {
        event.preventDefault();

        $.ajax({
            //url:createURL('internet/account', 'handlelogin', null, 'logged=true'),
            url: createURL('internet/account', 'handlelogin', null, ''),
            type: "POST",
            async: false,
            dataType: 'html',
            cache: false,
            data: $('#frm_login').serialize(),
            success: function (data) {
                fGetMenu();
                $('#btn_add_alert').attr('href', "javascript:fAddAlertEmail('" + data + "', 'true');");

                $.unblockUI({
                    onUnblock: function () {
                        $.ajax({
                            url: createURL('internet/account', 'addalertemailrss', null, 'login=true&type=alert&form_context=' + data),
                            type: 'GET',
                            async: false,
                            cache: false,
                            dataType: 'html',
                            success: function (data) {
                                $('#load_form').empty();
                                $('#load_form').html(data);
                                $.blockUI({
                                    message: $('#load_form'),
                                    css: { width: '400px' }
                                });

                            }
                        });
                    }
                });
            },
            error: function (request, status, error) {
                $('#load_msg_login').html(request.statusText).show();
            }
        })
    });

    $('#btn_userinfo_alert').live('click', function () {
        fEncryptePwd();
        $.ajax({
            url: createURL('internet/account', 'adduserinfo', null, 'captcha=loadforms'),
            type: "GET",
            async: false,
            cache: false,
            data: $('#frm_userinfo').serialize(),
            dataType: 'html',
            success: function (data) {
                id_account = data;
                /*
				$.unblockUI({
                    onUnblock: function () {
                        $.ajax({
                            url: createURL('internet/account', 'loadforms', null, 'type=registration&form_id_account=' + id_account + '&form_context=' + $('input[name="form_context"]').val()),
                            type: "GET",
                            async: false,
                            cache: false,
                            dataType: 'text',
                            success: function (data) {
                                $('#load_form').html(data);
                                $.blockUI({
                                    message: $("#load_form")
                                });
                            },
                            error: function (request, status, error) {

                            }
                        });
                    }
                });
				*/
				$.unblockUI({
                    onUnblock: function () {
                        $.ajax({
                            url: createURL('internet/account', 'addalertEmailRSS', null, 'add=true&form_id_account=' + id_account + '&form_context=' + $('input[name="form_context"]').val()),
                            type: "GET",
                            async: false,
                            cache: false,
                            dataType: 'text',
                            success: function (data) {
                                $('#load_form').html(data);
                                $.blockUI({
                                    message: $("#load_form"),
									css : { width : '400px'}
                                });
                            },
                            error: function (request, status, error) {

                            }
                        });
                    }
                });
            },
            error: function (request, status, error) {
                fResetPwd();
                $('#load_form').html(request.responseText);
                $('#load_msg').html(request.statusText);
                $('#load_msg').show();

                $('#img_close, #btn_close').click(function () {
                    fAbort(0);
                });
            }
        });
    });


    // create account before creating an alert email
    $('#link_registration_alert').live('click', function () {
        $.unblockUI({
            onUnblock: function () {
                $.ajax({
                    url: createURL('internet/account', 'loadforms', null, 'type=userinfo&form_context=' + $('input[name="form_context"]').val()),
                    type: "GET",
                    async: false,
                    cache: false,
                    dataType: 'html',
                    success: function (data) {
                        $('#load_form').html(data);
                        if (navigator.userAgent.indexOf('MSIE') != -1 && isSmallScreen) {
                            $('#img_close').css('right', '24px');
                        }
                        $.blockUI({
                            message: $('#load_form')
							
                        });
                    }
                });
            }
        });
    });

    $('#btn_registration_alert').live('click', function () {
        $.ajax({
            // JF 01.03.2012
            //url:createURL('internet/account', 'loadforms', null, 'type=services&add=true&id_account='+id_account),
            url: createURL('internet/account', 'loadforms', null, 'type=services&add=true'),
            type: 'GET',
            async: false,
            cache: false,
            data: $('#frm_registration').serialize(),
            dataType: 'html',
            success: function (data) {
                $.unblockUI({
                    onUnblock: function () {
                        $('#load_form').empty();
                        $('#load_form').html(data);
                        $.blockUI({
                            message: $('#load_form'),
                            css: { width: '400px' }
                        });
                    }
                });
            },
            error: function (request, status, error) {
                $('#load_msg').html(request.statusText);
                $('#load_msg').show();
            }
        });
    });


    $('#btn_myberufswahl_alert').live('click', function () {
        $.ajax({
            url: createURL('internet/account', 'addmyberufswahl', null, ''),
            type: 'GET',
            async: false,
            cache: false,
            data: $('#frm_services').serialize(),
            dataType: 'html',
            success: function (data) {
                $.unblockUI({
                    onUnblock: function () {

                        $('#load_form').empty();

                        $('#load_form').html(data);
                        $.blockUI({
                            message: $('#load_form'),
                            css: { width: '320px' }
                        });
                    }
                });
            },
            error: function (request, status, error) {
                $('#load_form').html(request.responseText);
                $('#load_msg').html(request.statusText);
                $('#load_msg').show();
            }
        })
    });

    $('#btn_edoc_alert').live('click', function () {
        $.ajax({
            url: createURL('internet/account', 'addedoc', null, ''),
            type: 'GET',
            async: false,
            cache: false,
            data: $('#frm_services').serialize(),
            dataType: 'html',
            success: function (data) {
                $.unblockUI({
                    onUnblock: function () {
                        $('#load_form').empty();

                        $('#load_form').html(data);
                        $.blockUI({
                            message: $('#load_form'),
                            css: { width: '320px' }
                        });
                    }
                });
            },
            error: function (request, status, error) {
                $('#load_form').html(request.responseText);
                $('#load_msg').html(request.statusText);
                $('#load_msg').show();
            }
        })
    });
});   
                   
                   
                  
                   
                   
                   
                   
                   
                   
                   
                   
                   
                   
                   
                   
                   
                   
                   
                   
                   
                   
                   
  