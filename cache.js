const NodeCache = require('node-cache');

let self;

class Cache {
    constructor() {
        this.cache = new NodeCache({stdTTL: 43200});
        self = this;
    }
    seekExistingPlan(req, res, next) {
        if(self && self.cache) {
            const existingData = self.cache.get( req.params.class );
            req.existingData = existingData;
        } 
        next();
    }
    savePlan(classId, data) {
        if(self && self.cache) {
            self.cache.set(classId, data);
        }
    }
    seekExistingMenu(req, res, next) {
        if(self && self.cache) {
            const existingMenu = self.cache.get( 'menu' );
            req.existingMenu = existingMenu;
        }
        next();
    }
    saveMenu(menu) {
        if(self && self.cache) {
            self.cache.set('menu', menu, 7200);
        }
    }
}

module.exports = Cache;