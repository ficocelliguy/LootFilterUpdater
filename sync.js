const utils = require("./utils.js");
const config = require("./config.json");
const puppeteer = require('puppeteer');
const path = require('path');


const launchOptions = {
    userDataDir: path.resolve('./myUserDataDir'),
    headless: true,
    args: [
        '--proxy-server="direct://"',
        '--proxy-bypass-list=*'
    ],
    ignoreDefaultArgs: ['--disable-extensions'],
    timeout: 5000
};

const clickButton = async function(id, page) {
    console.log("Clicking ", id);
    try {
        await page.evaluate((id) => {
            document.getElementById(id).click();
        }, id);
    } catch (e) {
        throw new Error("Error clicking button with ID " + id)
    }
};

(async () => {


    console.log("Preparing... ");
    const browser = await puppeteer.launch(launchOptions);
    const index = config.Filter_Index;
    const [filterPage] = await browser.pages();
    filterPage.setUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1");

    console.log("Loading Filterblade...");
    await filterPage.goto('https://filterblade.xyz/');
    await utils.sleep(5000);

    //Ensure you have a session
    const username = await filterPage.evaluate(() => document.getElementById("profileLink").innerHTML);
    if (!username) {
        throw new Error("Problem loading FilterBlade, the site may have changed or may be slow");
    } else if (username === "ProfileName") {
        throw new Error("Problem establishing session with FilterBlade, try `npm run setup` ");
    } else {
        console.log("Logged in as " + username);
    }


    // Load and re-save the filter at the configured index
    await clickButton("SelectionButton5", filterPage);
    await utils.sleep(3000);
    await clickButton("LoadProfileSaveState" + index, filterPage);
    await utils.sleep(3000);
    await clickButton("SaveProfileSaveState" + index, filterPage);
    await utils.sleep(3000);

    // Sync with Poe
    await clickButton("SelectionButton6", filterPage);
    await utils.sleep(1000);
    await clickButton("uploadFilterToPoeButton", filterPage);
    await utils.sleep(2000);

    // Overwrite and confirm the filter at the configured index
    await clickButton("OverwritePoeFilter" + index, filterPage);
    await utils.sleep(1000);
    await clickButton("configPoeFilter_Apply", filterPage);
    await utils.sleep(1000);

    await browser.close();

    console.log("Completed!")

})();