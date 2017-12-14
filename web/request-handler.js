var path = require('path');
var url = require('url');
var archive = require('../helpers/archive-helpers');
var httpHelper = require('./http-helpers.js');
var headers = Object.assign({}, httpHelper.headers);
var validUrl = require('valid-url');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  // routes and options based on them
  // if req.url is / then serve up index in /public/index.html
  console.log('serving request: ' + req.method + ' for: ' + req.url);
  var q = url.parse(req.url);
  if (req.method === 'GET') {
    if (q.pathname === '/') {
    // console.log(path.join(archive.paths.siteAssets, '../index.html'))
      console.log('hi', archive.paths.archivedSites);
      httpHelper.serveAssets(res, path.join(archive.paths.siteAssets, '../public/index.html'), function(data) {
        res.writeHead(200, httpHelper.headers);
        res.end(data);
      });
    } else if (q.pathname === '/styles.css') {
      httpHelper.serveAssets(res, path.join(archive.paths.siteAssets, '../public/styles.css'), function(data) {
        var newHeaders = Object.assign({}, httpHelper.headers);
        newHeaders['Content-Type'] = 'text/css';
        res.writeHead(200, newHeaders);
        res.end(data);
      });
    } else if (q.pathname === 'doody') {
      
    }
  } else if (req.method === 'POST') {
    var userInput = '';
    req.on('data', function(chunk) {
      userInput += chunk.slice(4);
    });
    req.on('end', function() {
      archive.isUrlInList(userInput, (isInside) => {
        if (isInside) {
          console.log('is inside');
        } else {
          console.log('is added');
        }
      });
      res.writeHead(301, {Location: 'localhost:3000'});
      res.end();
    });
  }
  // res.end(archive.paths.list);
};
