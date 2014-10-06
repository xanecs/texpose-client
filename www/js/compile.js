var jobid;

var ccCounter = 0;

var getDocument = function () {
    "use strict";
    $('#pdf-viewer').attr('src', 'pdfjs/web/viewer.html?file=' + API_URL + '/job/result/' + jobid + '/' + $.cookie('sessID'));
    $('#pdf-viewer').removeClass('hidden');
    $('#btnCompile').addClass('disabled');
};

var getLog = function () {
    "use strict";
    $.get(API_URL + '/job/log/' + jobid + '/' + $.cookie('sessID'), function(result) {
        $('#preLog').text(result);
    });
};

var checkCompile = function () {
    "use strict";
    ccCounter += 1;
    $.post(API_URL + '/job/status', {jobid: jobid, token: $.cookie('sessID')}, function (result) {
        if (result.state == 'done') {
            $('#alertCompiling').fadeOut();
            getDocument();
            getLog();
        } else {
            setTimeout(checkCompile, 2000);
        }
    });
};

$(document).ready(function () {
    "use strict";
    $('#btnCompile').click(function () {
        saveDocument(function () {
            $('#alertCompiling').fadeIn();
            $.post(API_URL + '/project/compile', {project: project._id, token: $.cookie('sessID')}, function (result) {
                jobid = result.jobid;
                $('#btnCompile').addClass('disabled');
                ccCounter = 0;
                checkCompile();
            });
        });
        
    });
});