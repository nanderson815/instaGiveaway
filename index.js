const puppeteer = require('puppeteer');
const $ = require('cheerio');
const url = 'https://www.instagram.com/p/BtiiYTSggiA/';

puppeteer
    .launch()
    .then(function (browser) {
        return browser.newPage();
    })
    .then(function (page) {
        return page.goto(url).then(function () {
            return page.content();
        });
    })
    .then(function (html) {
        $('h3 > a', html).each(function () {
            console.log($(this).text());
        });
    })
    .catch(function (err) {
        //handle error
    });