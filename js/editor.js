/*global $, jQuery, console, API_URL, document, alert, location, ace, project, btoa, setTimeout, initiateUpload, populateTree */

var imageFormats = [
    "png",
    "jpg",
    "jpeg",
    "bmp",
    "gif"
];
var path;
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/tex");

$(document).ready(function () {
    "use strict";
    $("#filesTree").bind("select_node.jstree", function (evt, data) {
        if (data.rslt.obj.attr("leaf")) {
            path = data.rslt.obj.attr("path");
            $.get(API_URL + '/file/get/' + project._id + '/' + $.cookie("sessID") + '/' +  encodeURIComponent(path), function (result) {
                var extension = path.substr(path.lastIndexOf('.') + 1);
                if ($.inArray(extension, imageFormats) > -1) {
                    $('#image-viewer-image').attr('src', API_URL + '/file/get/' + project._id + '/' + $.cookie("sessID") + '/' + encodeURIComponent(path));
                    $('#editor').addClass('hidden');
                    $('#image-viewer').removeClass('hidden');
                    $('#btnSave').addClass('disabled');
                } else {
                    editor.setValue(result);
                    $('#image-viewer').addClass('hidden');
                    $('#editor').removeClass('hidden');
                    $('#btnSave').removeClass('disabled');
                }
            });
        }
    });
    
    $("#btnSave").click(function () {
        console.log(editor.getValue());
        console.log(editor.getSession().getValue());
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
});