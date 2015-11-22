// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
    response.success("Hello world!");
});

var img = "";

// Defines a method getPhotoData to use the IBM alchemy API.
// This returns a description of the photo in a json format.

Parse.Cloud.define("getPhotoData", function(request, response) {
    Parse.Cloud.httpRequest({
        url: "http://gateway-a.watsonplatform.net/calls/image/ImageGetRankedImageKeywords",
        params: {
            image: img + "",
            imagePostMode: "not-raw",
            apikey: "c31bfed3d391144d692d4290a39d677bb73f10b8",
            outputMode: "json"
        }
    }).then(function(httpResponse) {
        response.success(httpResponse.text);
        var photo = Parse.Object.extend("PhotoObject");
        var query = new Parse.Query(photo);

        query.equalTo("ImageKey", "ImageFile");
        query.find({
            success: function(result) {
                result.destroy(results[0]);
            },
            error: function(error) {
                console.log("Error in delete Query")
            }
        });
    }, function(httpResponse) {
        console.error('Request failed');
    });
});

// Defines a method getPhoto to get a photo that is saved in to the
// parse database.

Parse.Cloud.define("getPhoto", function(request, response) {
    var photo = Parse.Object.extend("PhotoObject");
    var query = new Parse.Query(photo);

    query.equalTo("ImageKey", "ImageFile");
    query.find({
        success: function(results) {
            //response.success("Successfully retrieved " + results.length);
            var object = results[0];
            img = object.get("image").url();
            response.success("Successfully retrieved " + results.length + ".\n" + img);
        },
        error: function(error) {
            console.error("Query Unsuccessful");
        }
    });
});
