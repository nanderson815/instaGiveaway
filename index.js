const puppeteer = require('puppeteer');
const $ = require('cheerio');
var express = require('express')
var app = express()

const url = 'https://www.instagram.com/p/BrsUeQxFHqa/';

var exists = true;
var comments = [];


async function rungProg() {
    console.log('running');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    while (exists === true) {
        console.log(exists);
        await getComments(page);
    }

    // await printComments(page, comments);
    await console.log(comments);
    await console.log(comments.length);
    await browser.close();
};

rungProg();

// If the "load more" button exists, it will be pressed until all comments have loaded. 
async function getComments(page) {
    if (await page.$('button.Z4IfV') !== null) {
        await page.click('button.Z4IfV');
        await console.log("clicked");
        await page.waitFor(250);
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