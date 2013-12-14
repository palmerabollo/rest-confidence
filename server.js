var Hapi = require('hapi'),
    Confidence = require('confidence'),
    ALCE = require('ALCE'),
    fs = require('fs'),
    logger = require('winston');

var CONFIG_FILE = __dirname + '/config.json';
var store = new Confidence.Store();

fs.watch(CONFIG_FILE, loadConfiguration);

(function init() {
    loadConfiguration();
    startServer();    
})();

function loadConfiguration() {
    var src = fs.readFileSync(CONFIG_FILE);
    var config = ALCE.parse(src);
    store.load(config);
    logger.info('configuration file loaded', CONFIG_FILE);
};

function startServer() {
    var server = Hapi.createServer('localhost', process.env.port || 8000, {cors: true});

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
