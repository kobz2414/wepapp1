const express = require('express');
const mongoose = require('mongoose');
const fetch = require('node-fetch');

const berlin = 'http://worldtimeapi.org/api/timezone/Europe/Berlin';
const london = 'http://worldtimeapi.org/api/timezone/Europe/London';
const tokyo = 'http://worldtimeapi.org/api/timezone/Asia/Tokyo';
const newyork = 'http://worldtimeapi.org/api/timezone/America/New_York';
const manila = 'http://worldtimeapi.org/api/timezone/Asia/Manila';

async function getGlobalTime(url) {
    let obj;
    try {
        obj = await fetch.default(url).then(e => e.json());

        const months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'June',
            'July',
            'Aug',
            'Sept',
            'Oct',
            'Nov',
            'Dec    '
          ]
    
        var year = obj["datetime"][0] + obj["datetime"][1] + obj["datetime"][2] + obj["datetime"][3];
        var month = months[parseInt(obj["datetime"][5] + obj["datetime"][6])-1];
        var day = obj["datetime"][8] + obj["datetime"][9];
        var hour = obj["datetime"][11] + obj["datetime"][12];
        var minute = obj["datetime"][14] + obj["datetime"][15];
        var second = obj["datetime"][17] + obj["datetime"][18];
        
        if(parseInt(hour) > 12){
            hour = (parseInt(hour) - 12).toString();
            temp = "PM";
          }else if(parseInt(hour) == 0){
            temp = "AM";
            hour = "12";
          }else if(parseInt(hour) < 12){
            hour = hour.toString();
            temp = "AM";
          }else if(parseInt(hour) == 12){
            hour = hour.toString();
            temp = "PM";
          }
    
    
        var curTimeAndDate = ["", ""];
        curTimeAndDate[0] = month + " " + day + ", " + year;
        curTimeAndDate[1] = hour + ":" + minute + ":" + second + " " + temp;
    
        return curTimeAndDate;
    }
    catch (e) {
        if (e.code === 'ENOTFOUND') {
            console.log("Currently unavailable");
            app.get('/index_busy', function (req, res) {
                res.render('index_busy')
              })
        }
        else if (e.type === 'invalid-json') {
            console.log("Too many requests. Try a bit later");
            app.get('/index_busy', function (req, res) {
                res.render('index_busy')
              })
        }
    }
}

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use('/img', express.static(__dirname + '/img'));

const databaseName = "SummativeAssessment";

var monggoURI = "mongodb+srv://lkvmanagbanag:AdDU241429825270@cluster0.jzzym.mongodb.net/" + databaseName +"?retryWrites=true&w=majority"
mongoose.connect(monggoURI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err))


const Schema = mongoose.Schema;

const recordsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    birthday: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: true
    }
});

const records = mongoose.model('records', recordsSchema);

app.get('/', function (req, res) {
    res.render('index')
  })

app.get('/person', async (req, res) => {
    var berlinTime = await getGlobalTime(berlin);
    var nytime = await getGlobalTime(newyork);
    var londontime = await getGlobalTime(london);
    var tokyotime = await getGlobalTime(tokyo);
    var manilatime = await getGlobalTime(manila);
    var database;

    records.find()
        .then((result) => {
            res.render('personlist', {
                berlinTime: berlinTime,
                nytime: nytime,
                londontime: londontime,
                tokyotime: tokyotime,
                manilatime: manilatime,
                data: result
            })
        })
        .catch((err) => {
            console.log(err);
        })
})

app.get('/add', function (req, res) {
    res.render('addperson')
  })

app.get('/view', function (req, res) {
    res.render('viewperson')
})

app.post('/person', (req, res) =>{
    const temp = records(req.body);
    temp.save()
        .then((result) => {
            res.redirect('/person');
        })
        .catch((err) => {
            console.log(err);
        })
})

app.get('/person/:id', (req, res) => {
    const id = req.params.id;
    records.findById(id)
        .then((result) => {
            res.render('viewperson',{
                data: result
            })
        })
        .catch((err) => {
            console.log(err);
        });
})
