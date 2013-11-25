/*global $, jQuery, console, API_URL, document, alert, location */

$(document).ready(function () {
    "use strict";
    $('#btnProjects').click(function () {
        $('.project-item').remove();
        $.post(API_URL + '/project/list', {token: $.cookie('sessID')}, function (result) {
            result.forEach(function (project) {
                $('#listProjects').append('<a href="#" class="list-group-item project-item"><h4 class="list-group-item-heading">' + project.name + '</h4><p class="list-group-item-text">' + project.description + '</p></a>');
            });
            $('#modalProjects').modal('show');
        });
    });
});