const NodeCache = require('node-cache');

class Cache {
    constructor() {
        this.cache = new NodeCache({stdTTL: 43200});
    }
    seekExistingPlan = (req, res, next) => {
        if(this && this.cache) {
            const existingData = this.cache.get( req.params.class );
            req.existingData = existingData;
        }
        next();
    }
    savePlan = (classId, data) => {
        if(this && this.cache) {
            this.cache.set(classId, data);
        }
    }
    seekExistingMenu = (req, res, next) => {
        if(this && this.cache) {
            const existingMenu = this.cache.get( 'menu' );
            req.existingMenu = existingMenu;
        }
        next();
    }
    saveMenu = (menu) => {
        if(this && this.cache) {
            this.cache.set('menu', menu, 7200);
        }
    }
}

module.exports = Cache;