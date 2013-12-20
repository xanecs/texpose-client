/*global $, jQuery, console, API_URL, document, alert, location */



var messages = {
    'empty' : '<div class="alert alert-danger alert-small alert-reg">Dieses Feld darf nicht leer sein!</div>',
    'nomatch' : '<div class="alert alert-danger alert-small alert-reg">Die Passwörter stimmen nicht überein!</div>',
    'taken' : '<div class="alert alert-danger alert-small alert-reg">Der Benutzername ist schon vergeben!</div>',
    'nottaken' : '<div class="alert alert-success alert-small alert-reg">Der Benutzername ist noch frei!</div>',
    'registersuccess' : '<div class="alert alert-success">Eine Bestätigungsmail wurde an die angegebene Adresse gesendet.</div>'
};

var checkUsername = function () {
    "use strict";
    $('.alert-reg').remove();
    var username = $('#inputRegUsername').val();
    if (username) {
        $.get(API_URL + '/user/checkusername/' + username, function (result) {
            if (result.status !== 'success') {
                return null;
            }
            
            return !result.value;
        });
    }
};

var setUpWorkspace = function (options) {
    "use strict";
    $('#labelName').html($('#labelName').html().replace('Vorname', options.firstname).replace('Nachname', options.lastname));
    $('#dropdownName').removeClass('hidden');
    $('#mainMenu').removeClass('hidden');
    $('#dropdownSignIn').addClass('hidden');
};

$(document).ready(function () {
    "use strict";
    
    if (!$.cookie("sessID")) {
        $('#modalLogin').modal('show');
    } else {
        $.post(API_URL + '/auth/getuserinfo', {token: $.cookie("sessID")}, function (result) {
            if (result.status === 'SUCCESS') {
                setUpWorkspace(result);
            } else {
                $('#modalLogin').modal('show');
            }
        }).fail(function () {
            $('#modalLogin').modal('show');
        });
    }
    
    $('#logout').click(function () {
        $.cookie("sessID", null);
        location.reload();
    });
    
    $('#btnSwitchToRegister').click(function () {
        $('#modalLogin').modal('hide');
        $('#modalRegister').modal('show');
    });
    
    $('#btnSwitchToLogin').click(function () {
        $('#modalRegister').modal('hide');
        $('#modalLogin').modal('show');
    });
    
    $('#btnCheckUsername').click(function () {
        if (checkUsername()) {
            $('#inputRegUsername').after(messages.taken);
        } else {
            $('#inputRegUsername').after(messages.nottaken);
        }
    });
    
    $('#formLogin').submit(function (event) {
        event.preventDefault();
        var data = {
            'username': $('#inputLogUsername').val(),
            'password': $('#inputLogPassword').val()
        };
        
        $('.alert-reg').remove();
        
        var doReturn = 0;
        if (!data.username) {
            $('#inputLogUsername').after(messages.empty);
            doReturn += 1;
        }
        
        if (!data.password) {
            $('#inputRegPassword').after(messages.empty);
            doReturn += 1;
        }
        
        if (doReturn > 0) {
            return;
        }
        
        $.post(API_URL + '/auth/login', data, function (result) {
            if (result.status === 'SUCCESS') {
                $.cookie("sessID", result.authToken, {expires: 2});
                $('#modalLogin').modal('hide');
                $.post(API_URL + '/auth/getuserinfo', {token: result.authToken}, function (result) {
                    setUpWorkspace(result);
                });
            }
        });
    });
    
    $('#formRegister').submit(function (event) {
        event.preventDefault();
        var data = {
            'username': $('#inputRegUsername').val(),
            'email': $('#inputRegEmail').val(),
            'firstname': $('#inputRegFirstname').val(),
            'lastname': $('#inputRegLastname').val(),
            'password': $('#inputRegPassword').val()
        };
        
        $('.alert-reg').remove();
        
        var doReturn = 0;
        if (!data.username) {
            $('#inputRegUsername').after(messages.empty);
            doReturn += 1;
        }
        if (!data.email) {
            $('#inputRegEmail').after(messages.empty);
            doReturn += 1;
        }
        if (!data.firstname) {
            $('#inputRegFirstname').after(messages.empty);
            doReturn += 1;
        }
        if (!data.lastname) {
            $('#inputRegLastname').after(messages.empty);
            doReturn += 1;
        }
        
        if (!data.password) {
            $('#inputRegPassword').after(messages.empty);
            doReturn += 1;
        }
        
        if (!$('#inputRegPasswordRepeat').val()) {
            $('#inputRegPasswordRepeat').after(messages.empty);
            doReturn += 1;
        }
        
        if (data.password !== $('#inputRegPasswordRepeat').val()) {
            $('#containerRegPassword').after(messages.nomatch);
            doReturn += 1;
        }
        
        if (!checkUsername) {
            $('#inputRegUsername').after(messages.taken);
            doReturn += 1;
        }
        
        if (doReturn > 0) {
            return;
        }
        
        $.post(API_URL + '/user/register', data, function (result) {
            console.log(result);
            if (result.status === "success") {
                $('#moalDoneBody').append(messages.registersuccess);
                $('#modalRegister').modal('hide');
                $('#modalDone').modal('show');
            }
        });
    });
});