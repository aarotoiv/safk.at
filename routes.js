const express = require('express');
const axios = require('axios');
const util = require('./util');

const router = new express.Router();

router.get('/', (req, res) => {
    axios.get('https://www.campusravita.fi/fi/ravintolat-ja-kahvila')
    .then(function(response) {
        const content = util.cleanUp(response.data);
        if(util.showWebsite(req.device.type)) {
            contentArray = content.split("\n");
            res.render('index', {content: contentArray});
        } else {
            res.send(content);
        }
        
    })
    .catch(function(err) {
        console.log(err);
    });
    
});

module.exports = router;