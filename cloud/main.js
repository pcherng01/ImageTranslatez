// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
    response.success("Hello world!");
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
                if (n != -1) {
                    var rText = "";
                    for (var i = n + constText.length; i < text.length; i++) {
                        if (text[i] === ',')
                            break;
                        rText += text[i];
                    }
                    response.success(str(1, rText.length - 2));
                }
                response.success("N/A");
                results[0].destroy({});
            }, function(httpResponse) {
                console.error('Request failed');
            });
        },
        error: function(error) {
            console.error("Query Unsuccessful");
        }
    });

});
