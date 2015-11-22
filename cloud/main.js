// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
    response.success("Hello world!");
});

var watson = require("watson-developer-cloud");
var language_translation = watson.language_translation({
    username: '{87b03976-e50a-448f-b505-d681beea1a78}',
    password: '{jlvuC1ye73L3}',
    version: 'v2'
});

// Defines a method getPhoto to use the IBM alchemy API.
// This returns a description of the photo in a json format.
// As well as get a photo that is saved in to the
// parse database.

Parse.Cloud.define("getPhoto", function(request, response) {
    var photo = Parse.Object.extend("PhotoObject");
    var query = new Parse.Query(photo);

    query.equalTo("ImageKey", "ImageFile");
    query.find({
        success: function(results) {
            var object = results[0];
            var img = object.get("image").url();
            Parse.Cloud.httpRequest({
                url: "http://gateway-a.watsonplatform.net/calls/url/URLGetRankedImageKeywords",
                params: {
                    url: img,
                    apikey: "c31bfed3d391144d692d4290a39d677bb73f10b8",
                    outputMode: "json"
                }
            }).then(function(httpResponse) {
                    var constText = '"text":'
                    var text = httpResponse.text.replace(/\s+/g, '');
                    var n = text.indexOf(constText);
                    var rText = "";
                    if (n != -1) {
                        for (var i = n + constText.length + 1; i < text.length; i++) {
                            if (text[i] === '"')
                                break;
                            rText += text[i];
                        }
                    }
                    if (rText.length === 0) {
                        rText = "N/A";
                    }

                    if (rText === "N/A") {
                        rText = rText + "," + rText + "," + rText + "," + rText + "," + rText;
                    } else {
                        language_translation.translate({
                                text: rText,
                                source: 'en',
                                target: 'ar'
                            },
                            function(err, translation) {

                                if (err)
                                    console.log(err)
                                else {
                                    var txt = translation.text.replace(/\s+/g, '');
                                    var constTxt = '"translation"';
                                    var k = text.indexOf(constTxt);
                                    var cText = "";
                                    for (var i = k + constTxt.length + 1; i < txt.length; i++) {
                                        if (txt[i] === '"')
                                            break;
                                        cText += txt[i];
                                    }
                                    rText = rText + "," + cText;
                                }
                            });
                        language_translation.translate({
                                text: rText,
                                source: 'en',
                                target: 'es'
                            },
                            function(err, translation) {

                                if (err)
                                    console.log(err)
                                else {
                                    var txt = translation.text.replace(/\s+/g, '');
                                    var constTxt = '"translation"';
                                    var k = text.indexOf(constTxt);
                                    var cText = "";
                                    for (var i = k + constTxt.length + 1; i < txt.length; i++) {
                                        if (txt[i] === '"')
                                            break;
                                        cText += txt[i];
                                    }
                                    rText = rText + "," + cText;
                                }
                            });
                        language_translation.translate({
                                text: rText,
                                source: 'en',
                                target: 'fr'
                            },
                            function(err, translation) {

                                if (err)
                                    console.log(err)
                                else {
                                    var txt = translation.text.replace(/\s+/g, '');
                                    var constTxt = '"translation"';
                                    var k = text.indexOf(constTxt);
                                    var cText = "";
                                    for (var i = k + constTxt.length + 1; i < txt.length; i++) {
                                        if (txt[i] === '"')
                                            break;
                                        cText += txt[i];
                                    }
                                    rText = rText + "," + cText;
                                }
                            });
                        language_translation.translate({
                                text: rText,
                                source: 'en',
                                target: 'pt'
                            },
                            function(err, translation) {

                                if (err)
                                    console.log(err)
                                else {
                                    var txt = translation.text.replace(/\s+/g, '');
                                    var constTxt = '"translation"';
                                    var k = text.indexOf(constTxt);
                                    var cText = "";
                                    for (var i = k + constTxt.length + 1; i < txt.length; i++) {
                                        if (txt[i] === '"')
                                            break;
                                        cText += txt[i];
                                    }
                                    rText = rText + "," + cText;
                                }
                            });
                    }
                    response.success(rText);
                    for (var i = 0; i < results.length; i++) {
                        results[i].destroy({});
                    }
                },
                function(httpResponse) {
                    console.error('Request failed');
                });
        },
        error: function(error) {
            console.error("Query Unsuccessful");
        }
    });

});