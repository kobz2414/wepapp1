const express = require('express');
var weather = require('weather-js');
const app = express();

var location, latitude, longtitude;
var day1, day1date, day1temp, day1month, weather1;
var day2, day2date, day2temp, day2month, weather2;
var day3, day3date, day3temp, day3month, weather3;
var day4, day4date, day4temp, day4month, weather4;
var day5, day5date, day5temp, day5month, weather5;

app.set('view engine', 'ejs');

var url;

const somethingRandom = require('some-random-cat').Random //Import the package
somethingRandom.getCat()
.then(res => {
    url = res;
    return
}) // Get the result
.catch(e => {
    console.error(e)
    return
}) // Catch the error

weather.find({search: 'Davao, PH', degreeType: 'C'}, function(err, result) {
    if(err) console.log(err);
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]

    location = JSON.stringify(result[0].location.name, null, 2).replace(/^"(.*)"$/, '$1');
    latitude = JSON.stringify(result[0].location.lat, null, 2).replace(/^"(.*)"$/, '$1');
    longtitude = JSON.stringify(result[0].location.long, null, 2).replace(/^"(.*)"$/, '$1');

    function getDayName(dayNum){
        var temp = JSON.stringify(result[0].forecast[dayNum].day, null, 2).replace(/^"(.*)"$/, '$1');
        return temp;
    }

    function getMonthName (dayNum){
        var temp = new Date(JSON.stringify(result[0].forecast[dayNum].date, null, 2).replace(/^"(.*)"$/, '$1'));
        temp = temp.getMonth();
        temp = months[temp];
        return temp;
    }

    function getDate(dayNum){
        var temp = new Date(JSON.stringify(result[0].forecast[dayNum].date, null, 2).replace(/^"(.*)"$/, '$1'));
        return temp;
    }

    function getTempAvg(dayNum){
        var temp = JSON.stringify(((parseInt(result[0].forecast[0].high) + parseInt(result[0].forecast[0].low))/2), null, 2).replace(/^"(.*)"$/, '$1');
        return temp;
    }

    function getWeatherIcon(temp){
        var weather = JSON.stringify(result[0].forecast[temp].skytextday, null, 2).replace(/^"(.*)"$/, '$1');
        if(weather == "Light Rain"){
            return "https://image.flaticon.com/icons/png/512/1/1801.png";
        }else if(weather == "Partly Sunny" || weather == "Mostly Sunny" || weather == "Mostly Cloudy" || weather == "Partly Cloudy"){
            return "https://www.pngitem.com/pimgs/m/209-2092034_partly-cloudy-sunny-partly-cloudy-icon-png-transparent.png";
        }else if(weather == "Rain Showers"){
            return "https://img.icons8.com/ios/452/heavy-rain.png";
        }else if(weather == "Cloudy"){
            return "https://cdn1.iconfinder.com/data/icons/weather-189/64/weather-icons-cloudy-3-512.png";
        }else if(weather == "T-storms"){
            return "https://cdn3.iconfinder.com/data/icons/weather-icons-8/512/weather-thunder-rainy-h-512.png";
        }else if(weather == "Heavy T-storms"){
            return "https://www.seekpng.com/png/detail/300-3006413_thunderstorm-clouds-vector-thunderstorm-icon.png";
        }else if(weather == "Mostly Clear"){
            return "data:image/png;base64,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";
        }else if(weather == "Rain"){
            return "https://img.icons8.com/ios/452/heavy-rain.png";
        }else if(weather == "Sunny" || weather == "Clear"){
            return "http://cdn.onlinewebfonts.com/svg/img_177473.png";
        }

    }
    
    day1 = getDayName(0);
    day1month = getMonthName(0);
    day1date = getDate(0);
    day1temp = getTempAvg(0);
    weather1 = getWeatherIcon(0);

    day2 = getDayName(1);
    day2month = getMonthName(1);
    day2date = getDate(1);
    day2temp = getTempAvg(1);
    weather2 = getWeatherIcon(1);

    day3 = getDayName(2);
    day3month = getMonthName(2);
    day3date = getDate(2);
    day3temp = getTempAvg(2);
    weather3 = getWeatherIcon(2);

    day4 = getDayName(3);
    day4month = getMonthName(3);
    day4date = getDate(3);
    day4temp = getTempAvg(3);
    weather4 = getWeatherIcon(3);

    day5 = getDayName(4);
    day5month = getMonthName(4);
    day5date = getDate(4);
    day5temp = getTempAvg(4);
    weather5 = getWeatherIcon(4);


    //console.log(JSON.stringify(result, null, 2));
  });
 
app.get('/', function (req, res) {
  res.render('index', {
      loc: location,
      lat: latitude,
      long: longtitude,
      day1: day1,
      day1date: day1date,
      day1temp: day1temp,
      day1month: day1month,
      weather1: weather1,

      day2: day2,
      day2date: day2date,
      day2temp: day2temp,
      day2month: day2month,
      weather2: weather2,

      day3: day3,
      day3date: day3date,
      day3temp: day3temp,
      day3month: day3month,
      weather3: weather3,

      day4: day4,
      day4date: day4date,
      day4temp: day4temp,
      day4month: day4month,
      weather4: weather4,

      day5: day5,
      day5date: day5date,
      day5temp: day5temp,
      day5month: day5month,
      weather5: weather5,
    });
});

app.get('/other', function (req, res) {
    res.render('other', {
        url: url,
    });
});


app.use((req, res) => {
    res.status(404).sendFile('./404.html', {root: __dirname})
});
 
app.listen(3000);