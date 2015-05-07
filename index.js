#!/usr/bin/env node

var http = require("http"),
	static = require("node-static"),
	livereload = require('livereload'),
	nconf = require("nconf");

nconf.argv().defaults({
	"path": process.cwd(),
	"static": {
		"port": 80
	},
	"live": {
		"port": 35729
	}
});

var path = nconf.get("path");
var staticPort = nconf.get("static:port");
var livePort = nconf.get("live:port");

var file = new static.Server(path);
var live = livereload.createServer({
	port: livePort
});

live.watch(path);
console.log("LiveReload server initialized, using port", livePort);

var server = http.createServer(function(req, res) {
	file.serve(req, res);
}).listen(staticPort);
console.log("Static server initialized on port", staticPort);
