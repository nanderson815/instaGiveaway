const puppeteer = require('puppeteer');
const $ = require('cheerio');
const url = 'https://www.instagram.com/p/BtY0Bsrg1mS/';


(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await Promise.all([
        page.click('button.Z4IfV'),
        console.log("clicked"),
        page.waitFor(500),
        page.click('button.Z4IfV'),
    ]);
    const html = await page.content()
    await $('h3 > a', html).each(function(){
        console.log($(this).text());
    });

    await browser.close();
})();