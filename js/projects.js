/*global $, jQuery, console, API_URL, document, alert, location, path, editor, messages  */
var projects;
var project = {};

var imageFormats = [
    "png",
    "jpg",
    "jpeg",
    "bmp",
    "gif"
];

var populateTree = function () {
    "use strict";
    $.post(API_URL + '/file/list', {token: $.cookie('sessID'), project: project._id}, function (result) {
        console.log(result);
        $('#filesTree').bind('before.jstree', function (event, data) {
            switch (data.plugin) {
            case 'ui':
                if (!data.inst.is_leaf(data.args[0])) {
                    return false;
                }
                break;
            default:
                break;
            }
        });
        
        $('#filesTree').jstree({json_data: result, plugins: ["json_data", "themes", "ui"]});
        $('#filesTree').bind("select_node.jstree", function (evt, data) {
            if (data.rslt.obj.attr("leaf")) {
                saveDocument();
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
                        markChanged(false);
                        $('#image-viewer').addClass('hidden');
                        $('#editor').removeClass('hidden');
                        $('#btnSave').removeClass('disabled');
                    }
                });
            }
        });
    });
};

$(document).ready(function () {
    "use strict";
    
    var refreshProjects = function () {
        $('.project-item').remove();
        $.post(API_URL + '/project/list', {token: $.cookie('sessID')}, function (result) {
            projects = result;
            result.forEach(function (project) {
                $('#listProjects').append('<a href="#" class="list-group-item project-item" data-projectid="' + project._id + '"><h4 class="list-group-item-heading">' + project.name + '</h4><p class="list-group-item-text">' + project.description + '</p></a>');
            });
            $('#modalProjects').modal('show');
        });
    };
    
    $('#btnProjects').click(refreshProjects);
    
    $('#btnProjectSettings').click(function () {
        initiateEditProject(function (data) {
            $.post(API_URL + '/project/edit', data, function(result) {
                $('#modalEditProject').modal('hide');
                refreshProjects();
            });
        });
    });
    
    $('#listProjects').on('click', '.project-item', function () {
        var projectId = $(this).attr('data-projectid');
        projects.forEach(function (cProject) {
            if (cProject._id == projectId) {
                project = cProject;
            }
        });
        $('#modalProjects').modal('hide');
        $('#btnSave').removeClass('disabled');
        $('#btnDelete').removeClass('disabled');
        $('#btnNew').removeClass('disabled');
        $('#btnRename').removeClass('disabled');
        $('#btnProjectSettings').removeClass('hidden');
        populateTree();
    });
    
    $('#formPrjNew').submit(function (event) {
        event.preventDefault();
        var data = {
            'name': $('#inputPrjTitle').val(),
            'description': $('#inputPrjDesc').val(),
            'token': $.cookie('sessID')
        };
        
        $('.alert-reg').remove();
        
        var doReturn = 0;
        if (!data.name) {
            $('#inputPrjTitle').after(messages.empty);
            doReturn += 1;
        }
        
        $.post(API_URL + '/project/new', data, function(result) {
            alert("WTF");
            $('#modalProjects').modal('hide');
            refreshProjects();
        });
    });
    
    $('#btnDeleteProject').click(function () {
        $.post(API_URL + '/project/delete', {token: $.cookie('sessID'), project: project._id }, function () {
            location.reload();
        });
    });
});

