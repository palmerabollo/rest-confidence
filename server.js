var Hapi = require('hapi');
var Confidence = require('confidence');
var ALCE = require('ALCE');
var fs = require('fs');
var logger = require('winston');

var store = new Confidence.Store();

(function loadConfiguration() {
    var src = fs.readFileSync(__dirname + '/config.json');
    var config = ALCE.parse(src);
    store.load(config);
    logger.info('configuration file successfully loaded');
})();

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
    logger.info('server started at: %s', server.info.uri)
});