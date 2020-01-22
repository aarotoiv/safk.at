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
        everything: ['h3, div']
    })
    .data(content => {
        const cleaned = util.cleanUp(content);
        if(util.showWebsite(req.device.type)) {
            contentArray = cleaned.split("\n");
            res.render('index', {content: contentArray});
        } else {
            res.send(cleaned);
        }
    });
    
});

module.exports = router;