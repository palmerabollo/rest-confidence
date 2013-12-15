var Hapi = require('hapi'),
    Confidence = require('confidence'),
    ALCE = require('ALCE'),
    fs = require('fs'),
    crypto = require('crypto'),
    logger = require('winston');

var CONFIG_FILE = __dirname + '/config.json';
var store = new Confidence.Store();
var fileStats = {};

(function init() {
    initializeConfiguration();
    startServer();    
})();

fs.watch(CONFIG_FILE, initializeConfiguration);

function initializeConfiguration() {
    var src = fs.readFileSync(CONFIG_FILE);
    var config = ALCE.parse(src);
    store.load(config);
    logger.info('Configuration file loaded', CONFIG_FILE);

    loadFileStatistics();
};

function loadFileStatistics() {
    fileStats = fs.statSync(CONFIG_FILE);
    fileStats.etag = crypto.createHash('md5').update(fileStats.mtime.toString()).digest('hex');
    logger.info('Configuration file stats', fileStats);
}

function startServer() {
    var port = process.env.PORT ? parseInt(process.env.PORT) : 8000;
    var server = Hapi.createServer('localhost', port, {cors: true});

    var handleConfigurationRequest = function(req) {
        logger.info('Property %s, filters', req.path, req.query);

        var modified = handleETag(req);
        if (modified) {
            logger.info('Return 304 - etag or modified-since found');
            this.reply('Not modified').code(304);
        } else {
            this.reply(store.get(req.path, req.query))
                .header('Last-Modified', fileStats.mtime)
                .header('ETag', fileStats.etag);
        }
    };

    var handleETag = function(req) {
        var ifNoneMatch = req.headers['if-none-match'];
        var ifModifiedSince = req.headers['if-modified-since'];

        if (fileStats.etag === ifNoneMatch) {
            return true;
        }

        if (ifModifiedSince) {
            ifModifiedSince = Date.parse(ifModifiedSince);
            if (ifModifiedSince > fileStats.mtime) {
                return true;
            }
        }
        
        return false;
    };

    server.route({
        method: 'GET',
        path: '/{p*}',
        handler: handleConfigurationRequest
    });

    server.start(function () {
        logger.info('server started', server.info.uri);
    });
}
