/* Test that the routes return expected data */
var server, appSource, jsSource, cssSource;
var async = require('async');
var Hapi = require('hapi');
var Moonboots = require('moonboots');
var moonboots_hapi_options = {
    appPath: '/app',
    main: __dirname + '/../sample/app/app.js',
    developmentMode: true,
    stylesheets: [
        __dirname + '/../sample/stylesheets/style.css'
    ]
};
var moonboots_options = {
    appPath: '/app',
    jsFileName: 'app',
    cssFileName: 'app',
    main: __dirname + '/../sample/app/app.js',
    developmentMode: true,
    stylesheets: [
        __dirname + '/../sample/stylesheets/style.css'
    ]
};

var moonboots = new Moonboots(moonboots_options);

module.exports = {
    setUp: function (next) {
        server = new Hapi.Server('localhost', 3001);
        async.parallel({
            plugin: function (next) {
                server.pack.require({ '..': moonboots_hapi_options }, next);
            },
            getSource: function (next) {
                moonboots.getResult('html', function _getSource(err, html) {
                    appSource = html;
                    next(err);
                });
            },
            getJs: function (next) {
                moonboots.jsSource(function _getJsSource(err, js) {
                    jsSource = js;
                    next(err);
                });
            },
            getCss: function (next) {
                moonboots.cssSource(function _getCssSource(err, css) {
                    cssSource = css;
                    next(err);
                });
            }
        }, function (err) {
            if (err) {
                process.stderr.write('Unable to setUp tests', err, '\n');
                process.exit(1);
            }
            next();
        });
    },
    tearDown: function (next) {
        next();
    },
    app: function (test) {
        test.expect(2);
        server.inject({
            method: 'GET',
            url: '/app'
        }, function _getApp(res) {
            test.equal(res.statusCode, 200);
            test.equal(res.payload, appSource);
            test.done();
        });
    },
    js: function (test) {
        test.expect(2);
        server.inject({
            method: 'GET',
            url: '/app.js'
        }, function _getJs(res) {
            test.equal(res.statusCode, 200);
            test.equal(res.payload, jsSource);
            test.done();
        });
    },
    css: function (test) {
        test.expect(2);
        server.inject({
            method: 'GET',
            url: '/app.css'
        }, function _getJs(res) {
            test.equal(res.statusCode, 200);
            test.equal(res.payload, cssSource);
            test.done();
        });
    }
};
