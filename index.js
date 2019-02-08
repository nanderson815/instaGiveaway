const puppeteer = require('puppeteer');
const $ = require('cheerio');
const url = 'https://www.instagram.com/p/Bs1aNd1AMNf/';

var exists = true;

async function rungProg() {
    console.log('running');
    var comments = [];
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    while (exists === true) {
        console.log(exists);
        await getComments(page);
    }
    await printComments(page, browser, comments);
    await console.log(comments.length);
    await browser.close();
};

rungProg();


async function getComments(page) {

    if (await page.$('button.Z4IfV') !== null) {
        page.click('button.Z4IfV');
        await console.log("clicked");
        await page.waitFor(500);
    } else {
        exists = false;
        await console.log('not found');
    }
};


async function printComments(page, browser, comments) {
    const html = await page.content()
    await $('h3 > a', html).each(function () {
        comments.push($(this).text());
    });
}






// async function getComments(page) {
//     try {
//         await Promise.all([
//             await page.waitForSelector('button.Z4IfV'),
//             page.click('button.Z4IfV'),
//             console.log("clicked"),
//             page.waitFor(500),
//         ]);
//     } catch (error) {
//         exists = false;
//         console.log("The element didn't appear.");
//     }
// };