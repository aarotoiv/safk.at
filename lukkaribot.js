const puppeteer = require('puppeteer');
const util = require('./util');

class LukkariBot {
    constructor() {
        this.unavailable = true;
        this.browser = null;
        this.page = null;
    }
    async initialize() {
        this.browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });
        this.page = await this.browser.newPage();
        await this.page.goto("https://lukkarit.tamk.fi/#/schedule");
        await util.delay(1000);
        console.log("Browser initialized");
    }
    async addClass() {
        await this.page.click(".fc-month-button");
        await util.delay(200);
        await this.page.click(".search-options div div label #option2");
        await this.page.type(".mat-toolbar .input-group input", "19tietob");
        await this.page.click(".mat-toolbar .input-group .input-group-append button");
        await util.delay(1000);
        await this.page.click(".search-result-row .buttons .row-buttons-container button");
        await util.delay(2000);
        await util.delay(10000);
        const content = await this.page.evaluate(() => {
            const weeks = document.querySelectorAll(".fc-row.fc-week");
            let ret = [];
            weeks.forEach(item => {
                const bgs = item.querySelectorAll(".fc-bg table tbody tr td");
                let dates = [];
                bgs.forEach(bg => {
                    const date = bg.getAttribute("data-date");
                    if (date) 
                        ret.push(date);
                });
            });
            return ret;
        });
        return content;
    }
};

module.exports = LukkariBot;