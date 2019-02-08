const puppeteer = require('puppeteer');
const $ = require('cheerio');
const url = 'https://www.instagram.com/p/BtY0Bsrg1mS/';

// puppeteer
//     .launch()
//     .then(function (browser) {
//         return browser.newPage();
//     })
//     .then(function (page) {
//         return page.goto(url).then(function () {
//             return page.content();
//         });
//     })
//     .then(function (html) {
//         $('h3 > a', html).each(function () {
//             console.log($(this).text());
//         });
//     })
//     .catch(function (err) {
//         //handle error
//     });



(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await Promise.all([
        page.click('button.Z4IfV'),
        console.log("clicked")
    ]);
    const html = await page.content()
    await $('h3 > a', html).each(function(){
        console.log($(this).text());
    });



    await browser.close();
})();