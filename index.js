#!/usr/bin/env node

var http = require("http"),
    path = require("path"),
    final = require("finalhandler"),
    serveStatic = require("serve-static"),
    livereload = require("livereload"),
    nconf = require("nconf"),
    serveIndex = require("serve-index");

nconf.argv().defaults({
    "path": process.cwd(),
    "static": {
        "port": 80
    },
    "live": {
        "port": 35729
    },
    "index": false
});

var staticPath = nconf.get("path");
var staticPort = nconf.get("static:port");
var livePort = nconf.get("live:port");

var static = new serveStatic(staticPath);
var index = serveIndex(staticPath, {
    "icons": true,
    filter: function(filename, i, files, dir) {
        return path.extname(filename) == ".html";
    }
});
var live = livereload.createServer({
    port: livePort
});

live.watch(staticPath);
console.log("LiveReload server initialized, using port", livePort);

var server = http.createServer(function(req, res) {
    var done = final(req, res);
    static(req, res, function(err) {
        if(!nconf.get("index"))
            return done();
        if(err)
            return done(err);

        index(req, res, done);
    });
}).listen(staticPort);
console.log("Static server initialized on port", staticPort);
