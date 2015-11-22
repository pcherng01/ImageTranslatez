// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});


Parse.Cloud.define("getData", function(request, response) {
  Parse.Cloud.httpRequest({
    url: "http://gateway-a.watsonplatform.net/calls/url/URLGetRankedImageKeywords",
    params: {
      url: "http://animalia-life.com/image.php?pic=/data_images/dog/dog1.jpg",
      apikey: "c31bfed3d391144d692d4290a39d677bb73f10b8",
      outputMode: "json"
    }
  }).then(function(httpResponse) {
      response.success(httpResponse.text);
  },function(httpResponse) {
    console.error('Request failed');
  });
});