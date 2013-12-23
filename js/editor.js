/*global $, jQuery, console, API_URL, document, alert, location, ace, project, btoa, setTimeout, initiateUpload, initiateNewFile, populateTree */


var path;
var changed = false;

var markChanged = function(value) {
    changed = value;
    if(value) {
        $('#btnSave').removeClass('btn-primary');
        $('#btnSave').addClass('btn-warning');
    } else {
        $('#btnSave').removeClass('btn-warning');
        $('#btnSave').addClass('btn-primary');
    }
};

var saveDocument = function (callback) {
    if (path && $('#image-viewer').hasClass('hidden') && changed) {
        $('#alertSaving').fadeIn();
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
                markChanged(false);              
                if(typeof callback === 'function') {
                    callback(true)
                }
                $('#btnSave').removeClass('btn-primary');
                $('#btnSave').addClass('btn-success');
                setTimeout(function () {
                    $('#btnSave').removeClass('btn-success');
                    $('#btnSave').addClass('btn-primary');
                }, 500);
                $('#alertSaving').fadeOut();
            }
        });
    } else {
        if(typeof callback === 'function') {
            callback(false);
        }
    }
};

var editor = CodeMirror(document.getElementById('editor'), {
    mode: 'stex',
    theme: 'lesser-dark',
    lineNumbers: true, 
    autoCloseBrackets: true,
    lineWrapping: true,
    extraKeys: {
        "Ctrl-S": saveDocument   
    }
});

editor.doc.on('change', function () {
    markChanged(true);
});

$(document).ready(function () {
    "use strict";
    
    
    $('#btnSave').click(saveDocument);
    
    $('#btnRename').click(function () {
        initiateRenameFile(path, function (data) {
            $.post(API_URL + '/file/rename', {path: data.oldpath, newpath: data.newpath, project: project._id, token: $.cookie('sessID')}, function (result) {
                populateTree();
                $('#editor').addClass('hidden');
                $('#modalRenameFile').modal('hide');
            });
        });
    });
    
    $('#btnReplace').click(function () {
        initiateUpload(function (file) {
            $('#alertUpload').fadeIn();
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
                    $('#alertUpload').fadeOut();
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
            $('#alertUpload').fadeIn();
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
                    $('#alertUpload').fadeOut();
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
            console.log(file);
            $('#alertUpload').fadeIn();
            $.ajax({
                url: API_URL + '/file/new',
                type: 'post',
                contentType: false,
                data: file,
                headers: {
                    'Token': $.cookie('sessID'),
                    'Project': project._id,
                    'Path': result.path
                },
                processData: false,
                crossDomain: true,
                success: function (data) {
                    $('#alertUpload').fadeOut();
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