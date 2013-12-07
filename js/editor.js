/*global $, jQuery, console, API_URL, document, alert, location, ace, project, btoa, setTimeout, initiateUpload, initiateNewFile, populateTree */


var path;
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/tex");

$(document).ready(function () {
    "use strict";
    
    
    $("#btnSave").click(function () {
        if (path && $('#image-viewer').hasClass('hidden')) {
            $.ajax({
                url: API_URL + '/file/new',
                type: 'post',
                contentType: 'text/plain',
                data: editor.getValue(),
                headers: {
                    'Token': $.cookie('sessID'),
                    'Project': project._id,
                    'Path': path
                },
                crossDomain: true,
                success: function (data) {
                    $('#btnSave').removeClass('btn-primary');
                    $('#btnSave').addClass('btn-success');
                    setTimeout(function () {
                        $('#btnSave').removeClass('btn-success');
                        $('#btnSave').addClass('btn-primary');
                    }, 500);
                }
            });
        }
    });
    
    $('#btnReplace').click(function () {
        initiateUpload(function (file) {
            $.ajax({
                url: API_URL + '/file/new',
                type: 'post',
                contentType: 'application/octet-stream',
                data: file,
                headers: {
                    'Token': $.cookie('sessID'),
                    'Project': project._id,
                    'Path': path
                },
                crossDomain: true,
                processData: false,
                success: function (data) {
                    $('#btnReplace').removeClass('btn-primary');
                    $('#btnReplace').addClass('btn-success');
                    $('#image-viewer-image').attr('src', API_URL + '/file/get/' + project._id + '/' + $.cookie("sessID") + '/' + encodeURIComponent(path));
                    setTimeout(function () {
                        $('#btnReplace').removeClass('btn-success');
                        $('#btnReplace').addClass('btn-primary');
                    }, 500);
                }
            });
            $('#modalUpload').modal('hide');
        });
    });
    
    $('#btnDelete').click(function () {
        if (path) {
            $.post(API_URL + '/file/delete', {path: path, project: project._id, token: $.cookie('sessID')}, function (result) {
                populateTree();
                $('#editor').addClass('hidden');
            });
        }
    });
    
    $('#btnNewFile').click(function () {
        initiateNewFile(function (result) {
            $.ajax({
                url: API_URL + '/file/new',
                type: 'post',
                contentType: 'text/plain',
                data: "",
                headers: {
                    'Token': $.cookie('sessID'),
                    'Project': project._id,
                    'Path': result.path
                },
                crossDomain: true,
                success: function (data) {
                    $('#btnNew').removeClass('btn-primary');
                    $('#btnNew').addClass('btn-success');
                    populateTree();
                    setTimeout(function () {
                        $('#btnNew').removeClass('btn-success');
                        $('#btnNew').addClass('btn-primary');
                    }, 500);
                }
            });
            $('#modalNewFile').modal('hide');
        });
    });
    
    $('#btnUploadFile').click(function () {
        initiateUploadNewFile(function (result, file) {
            $.ajax({
                url: API_URL + '/file/new',
                type: 'post',
                contentType: 'application/octet-stream',
                data: file,
                headers: {
                    'Token': $.cookie('sessID'),
                    'Project': project._id,
                    'Path': result.path
                },
                processData: false,
                crossDomain: true,
                success: function (data) {
                    $('#btnNew').removeClass('btn-primary');
                    $('#btnNew').addClass('btn-success');
                    populateTree();
                    setTimeout(function () {
                        $('#btnNew').removeClass('btn-success');
                        $('#btnNew').addClass('btn-primary');
                    }, 500);
                }
            });
            $('#modalUploadFile').modal('hide');
        });
    });
});