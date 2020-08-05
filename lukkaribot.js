const puppeteer = require('puppeteer');
const util = require('./util');
const axios = require('axios');

class LukkariBot {
    constructor() {
        this.unavailable = true;
        this.browser = null;
        this.page = null;
    }
    // Launch puppeteer and open up a page on lukkarit.tamk.fi
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
    // Add a class to the list of classes
    async addClass(classId) {
        try {
            const val = await this.page.evaluate(async (classId) => {
                const res = await fetch(`https://lukkarit.tamk.fi/rest/basket/0/group/${classId}`, {method: "POST"});
                return res.json();
            }, classId);
            return val;
        } catch(e) {
            return false;
        }
        
    }
    // Delete a class from the list of classes
    async deleteClass(classId) {
        try {
            const val = await this.page.evaluate(async (classId) => {
                const res = await fetch(`https://lukkarit.tamk.fi/rest/basket/0/group/${classId}`, {method: "DELETE"});
                return res.json();
            }, classId); 
            return val;
        } catch(e) {
            return false;
        }
       
    }
    // Get the schedules for all active classes
    async getSched(from, to) {
        try {
            const sched = await this.page.evaluate(async (dates) => {
                const res = await fetch("https://lukkarit.tamk.fi/rest/basket/0/events", {
                    method: "POST",
                    mode: "cors",
                    credentials: "same-origin",
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        dateFrom: dates.from, dateTo: dates.to, eventType: "visible"
                    })
                });
                return res.json();
            }, {from, to});
            return sched;
        } catch(e) {
            return [];
        }
    }
};

module.exports = LukkariBot;