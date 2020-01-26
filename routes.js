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
        //content.headers = ["aa", "aaa", "aaaa", "aaaaa", "aaaa aaaa"];
        //content.everything = ["aa", "kysta", "asdfasfdasdf", "aaa", "mitä", "asdfasdfasdfasdf", "hehe", "aaaa", "juju", "jaja", "jooo", "aaaaa", "heheheh", "hehehehehheee", "heheheheee", "aaaa aaaa", "huuu", "haaa"];

        
        if(util.showWebsite(req.device.type)) {
            res.render('index', {content: content});
        } else {
            res.send(content.headers.length > 0 ? util.cleanUp(content) : "No menu available.\n");
        }
    });
    
});

module.exports = router;