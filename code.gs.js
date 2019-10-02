/**
 * Dialogflow-CheckCode
 *
 * Publish deploy as webhook for dialogflow
 * - intent CheckCode
 * - reponse flexmessage
 */

var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1UJ1XCIqIsdcCQeo931nBYAv8vGEfU0i7M282edxIRBM/edit");
var sheet = ss.getSheetByName("checkcode");

function doPost(e) {

    var data = JSON.parse(e.postData.contents)
    var Msg = data.originalDetectIntentRequest.payload.data.message.text;
    var userMsg = Msg.replace("รหัส ", "").toUpperCase();
    // var userMsg = '36012';
    var values = sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();

    var lab = '';
    for (var i = 0; i < values.length; i++) {

        if (values[i][0] == userMsg) {
            i = i + 2;
            // var Data = userMsg + ": " + sheet.getRange(i, 2).getValue();

            if (sheet.getRange(i, 3).getValue()) {

                // var lab = "\r\nหมวด: " + sheet.getRange(i, 3).getValue() +
                //     "\r\nราคา: " + sheet.getRange(i, 4).getValue() +
                //     (sheet.getRange(i, 5).getValue() ? "\r\nข้อบ่งชี้: " + sheet.getRange(i, 5).getValue() : '');

                var descriptor = (sheet.getRange(i, 5).getValue()) ? {
                    "type": "text",
                    "text": "ข้อบ่งชี้: " + sheet.getRange(i, 5).getValue(),
                    "style": "italic",
                    "color": "#b30000",
                    "wrap": true,
                    "margin": "md",
                    "size": "sm"
                } : {
                        "type": "filler"
                    };
                var result = {
                    "fulfillmentMessages": [{
                        "platform": "line",
                        "type": 4,
                        "payload": {
                            "line": {
                                "type": "flex",
                                "altText": "LAB Code Dictionary",
                                "contents": {
                                    "type": "bubble",
                                    "header": {
                                        "type": "box",
                                        "layout": "vertical",
                                        "contents": [{
                                            "type": "text",
                                            "text": "รหัส " + userMsg,
                                            "size": "xxl",
                                            "color": "#ffffff"
                                        }, {
                                            "type": "text",
                                            "text": "หมวด : " + sheet.getRange(i, 3).getValue(),
                                            "color": "#FFFFFF",
                                            "wrap": true,
                                            "size": "sm",
                                            "margin": "sm"
                                        }]
                                    },
                                    "body": {
                                        "type": "box",
                                        "layout": "vertical",
                                        "contents": [{
                                            "type": "text",
                                            "text": sheet.getRange(i, 2).getValue(),
                                            "wrap": true,
                                            "margin": "md"
                                        },
                                            descriptor,
                                        {
                                            "type": "separator",
                                            "margin": "md"
                                        },
                                        {
                                            "type": "text",
                                            "text": "฿ " + sheet.getRange(i, 4).getValue() + " บาท",
                                            "size": "xl",
                                            "color": "#00ab0b",
                                            "margin": "md",
                                            "align": "end"
                                        }
                                        ]
                                    },
                                    "styles": {
                                        "header": {
                                            "backgroundColor": "#780202"
                                        }
                                    }
                                }
                            }

                        }
                    }]
                }
            } else {
                var solved = (sheet.getRange(i, 5).getValue()) ? {
                    "type": "button",
                    "action": {
                        "type": "uri",
                        "label": "⚡ แนวทางป้องกันและแก้ไข",
                        "uri": sheet.getRange(i, 5).getValue()
                    },
                    "style": "primary",
                    "margin": "md"
                } : {
                        "type": "filler"
                    };
                var result = {
                    "fulfillmentMessages": [{
                        "platform": "line",
                        "type": 4,
                        "payload": {
                            "line": {
                                "type": "flex",
                                "altText": "Check Code Dictionary",
                                "contents": {
                                    "type": "bubble",
                                    "header": {
                                        "type": "box",
                                        "layout": "vertical",
                                        "contents": [{
                                            "type": "text",
                                            "text": "รหัส " + userMsg,
                                            "size": "xxl",
                                            "color": "#ffffff"
                                        }]
                                    },
                                    "body": {
                                        "type": "box",
                                        "layout": "vertical",
                                        "contents": [{
                                            "type": "text",
                                            "text": sheet.getRange(i, 2).getValue(),
                                            "wrap": true,
                                            "margin": "md"
                                        },
                                            solved
                                        ]
                                    },
                                    "styles": {
                                        "header": {
                                            "backgroundColor": "#0981bd"
                                        }
                                    }
                                }
                            }

                        }
                    }]
                }
            }
            // Logger.log(result)
            var replyJSON = ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
            return replyJSON;
        }
    }
}