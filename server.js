var Hapi = require('hapi'),
    Confidence = require('confidence'),
    ALCE = require('ALCE'),
    fs = require('fs'),
    logger = require('winston'),
    watchr = require('watchr');

var CONFIG_FILE = __dirname + '/config.json';
var store = new Confidence.Store();

watchr.watch({
    path: CONFIG_FILE,
    listener: {
        change: loadConfiguration
    },
    next: init
});

function init() {
    loadConfiguration();
    startServer();    
}

function loadConfiguration() {
    var src = fs.readFileSync(CONFIG_FILE);
    var config = ALCE.parse(src);
    store.load(config);
    logger.info('configuration file loaded', CONFIG_FILE);
};

function startServer() {
    var server = Hapi.createServer('localhost', 8000, {cors: true});

    var hanldeConfigurationRequest = function(req) {
        logger.info('property %s, filters', req.path, req.query);
        this.reply(store.get(req.path, req.query));
    }

    server.route({
        method: 'GET',
        path: '/{p*}',
        handler: hanldeConfigurationRequest
    });

    server.start(function () {
        logger.info('server started', server.info.uri);
    });
}
