const express = require('express');
const util = require('./util');

const router = new express.Router();
const osmosis = require('osmosis');

router.get('/', (req, res) => {
    osmosis
    .get('https://www.campusravita.fi/fi/ravintolat-ja-kahvila')
    .find('.view-ruokalista')
    .set({
        headers: ['h3'],
        everything: ['h3, div.views-row']
    })
    .data(content => {
        //debug data
        content.headers = ["aa", "aaa", "aaaa", "aaaaa", "aaaa aaaa"];
        content.everything = ["aa", "kysta", "perseessäni", "aaa", "mitä", "vittua", "hehe", "aaaa", "juju", "jaja", "jooo", "aaaaa", "heheheh", "hehehehehheee", "heheheheee", "aaaa aaaa", "huuu", "haaa"];



        const cleaned = util.cleanUp(content);
        
        if(util.showWebsite(req.device.type)) {
            contentArray = cleaned.split("\n");
            res.render('index', {content: contentArray});
        } else {
            res.send(content.headers.length > 0 ? cleaned : "(⌣́_⌣̀) No menu available.\n");
        }
    });
    
});

module.exports = router;