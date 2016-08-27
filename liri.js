
var fs = require('fs');
var request = require('request');
var spotify = require('spotify');
var Twitter = require('twitter');

var action = process.argv[2];

var value = process.argv[3];


var pick = function(caseData, functionData){
    switch(caseData) {
        case 'my-tweets':
            getMyTweets();
            break;
        case 'spotify-this-song':
            getMeSpotify(functionData);
            break;
        case 'movie-this':
            getMeMovie(functionData);
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
        default:
            console.log('LIRI doesn\'t know that');
    }
}

//TWITTER FUNCTION

function getMyTweets(){

    var twitterKeys = require('./keys.js').twitterKeys;
    // console.log(twitterKeys)

    var client = new Twitter(twitterKeys);

    var params = {screen_name: 'mholsapple80', count: 5};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (!error) {
        for(var i = 0; i < 5; i++){
            tweetText = tweets[i].text;
            tweetTime = tweets[i].created_at;

            console.log(tweetText + " Posted at " + tweetTime);

        }
      }
    })
};

//SPOTIFY
function getMeSpotify(songParam){

    if (songParam == undefined) {
        songParam = "Livin on a Prayer";
    }

    //console.log(songParam);

    spotify.search({ type: 'track', query: songParam }, function(err, data) {
        if ( err ) {
            console.log('Error occurred: ' + err);
            return;
        }
        else {
            console.log("Artist: " + data.tracks.items[0].artists[0].name);
            console.log("Song Name: " + data.tracks.items[0].name);
            console.log("Preview URL: " + data.tracks.items[0].preview_url);
            console.log("Album: " + data.tracks.items[0].album.name);
        }

    })

};

//OMDP FUNCTION

function getMeMovie(movieParam){

     if (movieParam == undefined) {
         movieParam = "How to Lose a guy in 10 days";
    }

    var queryUrl = 'http://www.omdbapi.com/?t=' + movieParam + '&y=&plot=short&tomatoes=true&r=json';
    // Then run a request to the OMDB API with the movie specified

    request(queryUrl, function (error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode == 200) {

            var jsonObject = JSON.parse(body);
            // console.log(jsonObject);

            console.log("Movie Title: " + jsonObject.Title)
            console.log("Year Released: " + jsonObject.Released)
            console.log("IMDB Rating: " + jsonObject.imdbRating)
            console.log("Country: " + jsonObject.Country)
            console.log("Language: " + jsonObject.Language)
            console.log("Plot: " + jsonObject.Plot)
            console.log("Actors: " + jsonObject.Actors)
            console.log("Tomato Rating: " + jsonObject.tomatoRating)
            console.log("Tomato URL: " + jsonObject.tomatoURL)

        }
    });
};

//DO THIS FUNCTION

function doWhatItSays(){

    fs.readFile('random.txt', 'utf8', function(error, data) {
        if (!error) {

            var dataArr = data.split(',');
            // console.log(dataArr)
            action = dataArr[0];

            if (action == "my-tweets") {
                pick(action, value);
            }
            else {
                value = dataArr[1];
                pick(action, value);
            }





        }    
    })
}

pick(action, value);