module.exports = {

    sleep: function (time) {
        return new Promise(function (resolve) {
            setTimeout(resolve, time)
        });
    },

    clickButton: async function(id, page, timeout = 3000) {
        console.log("Clicking ", id);
        try {
            await page.evaluate((id) => {
                document.getElementById(id).click();
            }, id);
            await this.sleep(timeout);
        } catch (e) {
            console.log(e.message);
            throw new Error("Error clicking button with ID " + id)
        }
    }
};