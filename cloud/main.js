// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
    response.success("Hello world!");
});

var image = "";

// Defines a method getPhotoData to use the IBM alchemy API.
// This returns a description of the photo in a json format.

Parse.Cloud.define("getPhotoData", function(request, response) {
    Parse.Cloud.run("getPhoto", {
      success: function(results) {
        console.log("Success!");
      },
      error: function(error) {
        console.log("Fail");
      }
    });
    Parse.Cloud.httpRequest({
        url: "http://gateway-a.watsonplatform.net/calls/url/URLGetRankedImageKeywords",
        params: {
            url: image,
            apikey: "c31bfed3d391144d692d4290a39d677bb73f10b8",
            outputMode: "json",
            imagePostMode: "not-raw"
        }
    }).then(function(httpResponse) {
        response.success(httpResponse.text);
        var photo = Parse.Object.extend("PhotoObject");
        var query = new Parse.Query(photo);

        query.equalTo("image", "Image.jpg");
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

Parse.Cloud.define("getPhoto", function(request, request) {
  var photo = Parse.Object.extend("PhotoObject");
  var query = new Parse.Query(photo);

  query.equalTo("image", "Image.jpg");
  query.find({
    success: function(results) {
      console.log("Successfully retrieved " + results.length);
      var object = results[0];
      image = object.get("image");
    },
    error: function(error) {
      console.error("Query Unsuccessful");
    }
  });
});
