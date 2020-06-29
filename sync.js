const utils = require("./utils.js");
const config = require("./config.json");
const puppeteer = require('puppeteer');
const path = require('path');


const launchOptions = {
    userDataDir: path.resolve('./myUserDataDir'),
    headless: true,
    timeout: 5000
};

(async () => {

    console.log("Preparing... ");
    const browser = await puppeteer.launch(launchOptions);
    const indexArr = config.Filter_Index;
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


     // update each filter specified by index in config
     for (let index, i = 0; i < indexArr.length; i++) {
         // Load and re-save the filter at the configured index
        index = indexArr[i];
        await utils.clickButton("SelectionButton5", filterPage);
        await utils.clickButton("LoadProfileSaveState" + index, filterPage);
        await utils.clickButton("SaveProfileSaveState" + index, filterPage);

        // Sync with Poe
        await utils.clickButton("SelectionButton6", filterPage, 1000);
        await utils.clickButton("uploadFilterToPoeButton", filterPage, 2000);

        // Overwrite and confirm the filter at the configured index
        await utils.clickButton("OverwritePoeFilter" + index, filterPage, 1000);
        await utils.clickButton("configPoeFilter_Apply", filterPage);
    }

    await browser.close();

    console.log("Completed!")

})();