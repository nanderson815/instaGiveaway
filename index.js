const puppeteer = require('puppeteer');
const $ = require('cheerio');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();

app.listen(3000, function () {
    console.log('Server Started on Port 3000...')
})

// Middleware to parse the data from the front end form.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//-------------------------------------------------------------------------------------------------


// Set Static Path
app.use(express.static(path.join(__dirname, '/public/')));

// Function to grab URL from front end, run the scraping program.
app.post('/submit-url', function (req, res) {
    exists = true;
    comments = [];
    image = [];
    var URL = req.body.url;
    console.log(URL);
    rungProg(URL);
});

// Push the HTML to root on load
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + 'public/index.html'))
});

// Send comments to front end
app.get('/comments', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/comments.html'));
    // res.send(comments);
});

app.get('/send-comments', function (req, res) {
    // res.send(comments);
    res.send({ loading: exists, comments: comments });
});

app.get('/send-image', function(req, res){
    res.send(image);
})



// Global vars :(
var exists = true;
var comments = [];
var image = [];



// Funciton to scrape comments
async function rungProg(url) {
    console.log('running');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    grabImage(page);
    while (exists === true) {
        console.log(exists);
        await getComments(page);
    }
    console.log(comments);
    console.log(comments.length);
    console.log(image);
    await browser.close();
};



// If the "load more" button exists, it will be pressed until all comments have loaded. 
async function getComments(page) {
    if (await page.$('button.Z4IfV') !== null) {
        await page.click('button.Z4IfV');
        console.log("clicked");
        var wait = Math.floor(Math.random() * 1000) + 250;
        await page.waitFor(wait);
        comments = [];
        await printComments(page, comments);
    } else {
        exists = false;
        console.log('not found');
    }
};



// Stores the comments to the comments array by grabbing internal text/comment link.
async function printComments(page, comments) {
    const html = await page.content()
    await $('h3 > a', html).each(function () {
        comment = {
            username: $(this).text(),
            link: $(this).attr("href")
        }
        comments.push(comment);
    });
    console.log(comments.length);
};

// Stores image href for post
async function grabImage(page){
    const html = await page.content();
    await $('.FFVAD', html).each( function(){
        var link = $(this).attr('src');
        image.push({link: link})
    })
};

// Empties the comment string
app.post("/emptyVars", function emptyVars(){
    exists = true;
    comments = [];
    // image = [];
    console.log(exists, comments);
});
