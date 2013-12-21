/*global $, jQuery, console, API_URL, document, alert, location, ace, project, btoa, encode64, messages, window */

var uploadHandler;
var newFileHandler;
var uploadFileHandler;
var renameFileHandler;
var editProjectHandler;

var initiateUpload = function (callback) {
    "use strict";
    uploadHandler = callback;
    $('#modalReplace').modal('show');
};

var initiateNewFile = function (callback) {
    "use strict";
    newFileHandler = callback;
    $('#modalNewFile').modal('show');
};

var initiateUploadNewFile = function (callback) {
    "use strict";
    uploadFileHandler = callback;
    $('#modalUploadFile').modal('show');
};

var initiateRenameFile = function (data, callback) {
    "use strict";
    renameFileHandler = callback;
    $('#inputRenameOldPath').val(data);
    $('#modalRenameFile').modal('show');
};

var initiateEditProject = function(callback) {
    "use strict";
    if(project) {
        editProjectHandler = callback;
        $('#inputEditPrjTitle').val(project.name);
        $('#inputEditPrjDesc').val(project.description);
        $('#inputEditPrjMainfile').val(project.mainfile);
        $('#modalEditProject').modal('show');
    }
};

var resize = function () {
    "use strict";
    $('#content').height($(window).height() - 102);
    $('#tabPdf').height($(window).height() - 102 - 42);
    editor.refresh();
};

$(document).ready(function () {
    "use strict";
    resize();
    
    $(window).resize(resize);
    
    $('#formReplace').submit(function (event) {
        event.preventDefault();
        if (uploadHandler) {
            var file = $('#inputReplaceFile')[0].files[0];
            uploadHandler(file);
        }
    });
    
    $('#formNewFile').submit(function (event) {
        event.preventDefault();
        if (newFileHandler) {
            $('.alert-reg').remove();
            var data = {
                path: $('#inputNewPath').val()
            };
            
            if (!data.path) {
                $('#inputNewPath').after(messages.empty);
                return;
            }
            newFileHandler(data);
        }
    });
    
    $('#formUploadFile').submit(function (event) {
        event.preventDefault();
        if (uploadFileHandler) {
            $('.alert-reg').remove();
            var data = {
                path: $('#inputUploadPath').val()
            };
            
            if (!data.path) {
                $('#inputUploadPath').after(messages.empty);
                return;
            }
            
            var file = $('#inputUploadFile')[0].files[0];
            uploadFileHandler(data, file);
        }
    });
    
    $('#formRenameFile').submit(function (event) {
        event.preventDefault();
        if (renameFileHandler) {
            $('.alert-reg').remove();
            var data = {
                oldpath: $('#inputRenameOldPath').val(),
                newpath: $('#inputRenameNewPath').val()
            };
            
            var doReturn = 0;
            
            if (!data.oldpath) {
                $('#inputRenameOldPath').after(messages.empty);
                doReturn++;
            }
            
            if (!data.newpath) {
                $('#inputRenameNewPath').after(messages.empty);
                doReturn++;
            }
            
            if(doReturn > 0) {
                return;
            }
            
            renameFileHandler(data);
        }
    });
    
    $('#formEditProject').submit(function (event) {
        event.preventDefault();
        if (editProjectHandler) {
            $('.alert-reg').remove();
            var data = {
                name: $('#inputEditPrjTitle').val(),
                description: $('#inputEditPrjDesc').val(),
                mainfile: $('#inputEditPrjMainfile').val(),
                token: $.cookie('sessID'),
                project: project._id
            };
            
            var doReturn = 0;
            
            if (!data.name) {
                $('#inputEditPrjTitle').after(messages.empty);
                doReturn++;
            }
            
            if (!data.mainfile) {
               $('#inputEditPrjMainfile').after(messages.empty);
                doReturn++;
            }
            
            if(doReturn > 0) {
                return;
            }
            
            editProjectHandler(data);
        }
    });
});