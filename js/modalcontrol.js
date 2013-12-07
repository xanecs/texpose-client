/*global $, jQuery, console, API_URL, document, alert, location, ace, project, btoa, encode64 */

var uploadHandler;

var initiateUpload = function (callback) {
    "use strict";
    uploadHandler = callback;
    $('#modalUpload').modal('show');
};

$(document).ready(function () {
    "use strict";
    $('#formUpload').submit(function (event) {
        event.preventDefault();
        if (uploadHandler) {
            var file = $('#inputUploadFile')[0].files[0];
            uploadHandler(file);
        }
    });
});