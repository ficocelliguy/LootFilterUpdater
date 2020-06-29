const utils = require("./utils.js");
const puppeteer = require('puppeteer');


const launchOptions = {
    headless: false,
    defaultViewport: null,
    userDataDir: "./myUserDataDir"
};

puppeteer.launch(launchOptions).then(async browser => {

    const [steamPage] = await browser.pages();
    steamPage.goto('https://steamcommunity.com/login');


    const poePage = await browser.newPage();
    poePage.goto('https://www.pathofexile.com/login');


    const filterPage = await browser.newPage();
    filterPage.goto('https://filterblade.xyz/');

    await steamPage.bringToFront()

});