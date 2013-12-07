/*global $, jQuery, console, API_URL, document, alert, location */
var projects;
var project = {};

var populateTree = function () {
    "use strict";
    $.post(API_URL + '/file/list', {token: $.cookie('sessID'), project: project._id}, function (result) {
        console.log(result);
        $('#filesTree').jstree({json_data: result, plugins: ["json_data", "themes", "ui"]});
    });
};

$(document).ready(function () {
    "use strict";
    $('#btnProjects').click(function () {
        $('.project-item').remove();
        $.post(API_URL + '/project/list', {token: $.cookie('sessID')}, function (result) {
            projects = result;
            result.forEach(function (project) {
                $('#listProjects').append('<a href="#" class="list-group-item project-item" data-projectid="' + project._id + '"><h4 class="list-group-item-heading">' + project.name + '</h4><p class="list-group-item-text">' + project.description + '</p></a>');
            });
            $('#modalProjects').modal('show');
        });
    });
    $('#listProjects').on('click', '.project-item', function () {
        var projectId = $(this).attr('data-projectid');
        projects.forEach(function (cProject) {
            if(cProject._id == projectId) {
                project = cProject;
            }
        });
        $('#modalProjects').modal('hide');
        $('#btnSave').removeClass('disabled');
        $('#btnDelete').removeClass('disabled');
        $('#btnNew').removeClass('disabled');
        
        populateTree();
    });
    
    $('#formPrjNew').submit(function (event) {
        event.preventDefault();
        var data = {
            'title': $('#inputPrjTitle').val(),
            'description': $('#inputPrjDesc').val(),
            'token': $.cookie('sessID')
        };
        
        $('.alert-reg').remove();
        
        var doReturn = 0;
        if (!data.username) {
            $('#inputPrjTitle').after(messages.empty);
            doReturn += 1;
        }
    });
});

