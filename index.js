const puppeteer = require('puppeteer');
const $ = require('cheerio');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express()

app.listen(3000, function(){
    console.log('Server Started on Port 3000...')
})

// Middleware to parse the data from the front end form.
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Set Static Path
app.use(express.static(path.join(__dirname, 'public')));

// Function to grab URL from front end, run the scraping program.
app.post('/submit-url', function (req, res) {
    var URL = req.body.url;
    console.log(URL);
    rungProg(URL);
});

// Push the HTML to root on load
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + 'public/index.html'))
});

// Global vars :(
var exists = true;
var comments = [];

// Funciton to scrape comments
async function rungProg(url) {
    console.log('running');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    while (exists === true) {
        console.log(exists);
        await getComments(page);
    }
    await console.log(comments);
    await console.log(comments.length);
    sendComments();
    await browser.close();
};


function sendComments(){
    app.get('/return-comments', function(req,res){
        res.send(comments);
    })
}

// rungProg();

// If the "load more" button exists, it will be pressed until all comments have loaded. 
async function getComments(page) {
    if (await page.$('button.Z4IfV') !== null) {
        await page.click('button.Z4IfV');
        await console.log("clicked");
        var wait = Math.floor(Math.random() * 1000) + 250;
        await page.waitFor(wait);
        comments = [];
        await printComments(page, comments);
    } else {
        exists = false;
        await console.log('not found');
    }
};

// Stores the comments to the comments array by grabbing internal text.
async function printComments(page, comments) {
    const html = await page.content()
    await $('h3 > a', html).each(function () {
        comments.push($(this).text());
    });
    await console.log(comments.length);
}