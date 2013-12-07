/*global $, jQuery, console, API_URL, document, alert, location, ace, project, btoa, encode64, messages */

var uploadHandler;
var newFileHandler;
var uploadFileHandler;

var initiateUpload = function (options, callback) {
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

$(document).ready(function () {
    "use strict";
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
});