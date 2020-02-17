const NodeCache = require('node-cache');

class Cache {
    constructor() {
        this.cache = new NodeCache({stdTTL: 43200});
    }
    seekExistingPlan = (req, res, next) => {
        if(this && this.cache) {
            const existingData = this.cache.get( req.params.class );
            req.existingData = existingData || null;
        }
        next();
    }
    saveData = (classId, data) => {
        if(this && this.cache) {
            this.cache.set(classId, data);
        }
    }
}

module.exports = Cache;