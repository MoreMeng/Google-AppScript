function onFormSubmit() {

    var form = FormApp.openById('GOOGLE_FORM_ID');
    var fRes = form.getResponses();


    var formResponse = fRes[fRes.length - 1];
    var itemResponses = formResponse.getItemResponses();
     var msg = 'New Message!';

    for (var i = 0; i < itemResponses.length; i++) {
        msg += ' \n' + itemResponses[i].getItem().getTitle() + ': ' + itemResponses[i].getResponse();
    }

     sendLineNotify(msg);

}

function sendLineNotify(message) {

    var token = ["LINE_ACCESS_TOKEN"];
    var options = {
        "method": "post",
        "payload": "message=" + message,
        "headers": {
            "Authorization": "Bearer " + token
        }
    };

    UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options);
}