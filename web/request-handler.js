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
    if (q.pathname === '/sites') {
      archive.readListOfUrls((data) => {
        console.log(data)
        var newHeaders = Object.assign({}, httpHelper.headers);
        newHeaders['Content-Type'] = 'application/json';
        res.writeHead(200, newHeaders);
        res.end(JSON.stringify(data));
      });
    } else if (q.pathname === '/') {
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
    } else if (q.pathname === '/loading') {
      httpHelper.serveAssets(res, path.join(archive.paths.siteAssets, '../public/loading.html'), function(data) {
        res.writeHead(200, httpHelper.headers);
        res.end(data);
      });
    } else {
      res.writeHead(404, httpHelper.headers);
      res.end();
    }
  } else if (req.method === 'POST' && q.pathname === '/' || q.pathname === '/loading') {
    var userInput = '';
    req.on('data', function(chunk) {
      userInput += chunk.slice(4);
    });
    req.on('end', () => {
      console.log(userInput);
      archive.isUrlInList(userInput, (isInside) => {
        if (isInside) {
          archive.isUrlArchived(userInput, (isArchived) => {
            if (isArchived) {
              httpHelper.serveAssets(res, path.join(archive.paths.archivedSites, archive.processUrl(userInput) + '.html'), function(data) {
              console.log('getting archived site')
                res.writeHead(200, httpHelper.headers);
                res.end(data);
              });
            } else {
              archive.readListOfUrls(archive.downloadUrls);
            }
          });
        } else {
          res.writeHead(301, {Location: 'loading'});
          res.end();
        }
      });
    });
  }
  // res.end(archive.paths.list);
};
