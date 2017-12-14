var fs = require('fs');
var http = require('http');
var path = require('path');
var wget = require('node-wget');
var request = require('request');
var _ = require('underscore');
// const cmd = spawn('wget', ['http://google.com', '-N', '-P', path.join(exports.paths.archivedSites, './' , exports.processUrl(url))]);

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

exports.processUrl = function(url) {
  if (url.includes('https://')) {
    return url.slice(8).split('.').join('').split('www').join('').split('com').join('');
  } else if (url.includes('http://')) {
    return url.slice(7).split('.').join('').split('www').join('').split('com').join('');
  } else {
    return url.split('.').join('').split('www').join('').split('com').join('');
  }
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf-8', function(err, data) {
    if (err) {
      throw err;
    } else {
      callback(data.split('\n'));
    }    
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls((list) => {
    if (list.indexOf(url) !== -1) {
      callback(true);
    } else {
      exports.addUrlToList(url, () => {
        callback(false);
      });
    }
  });
};

exports.addUrlToList = function(url, callback = () => {}) {
  
  fs.appendFile(exports.paths.list, url + '\n', 'utf-8', function(err) {
    if (err) {
      throw err;
    } else {
      callback();
    }
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.readdir(exports.paths.archivedSites, (err, files) => {
    for (var file of files) {
      if (file === exports.processUrl(url) + '.html') {
        return callback(true);
      }
    }
    return callback(false);
  });
};

exports.downloadUrls = function(urls) {
//wget -E -H -k -K -nd -N -p -P test \  https://www.npmjs.com/package/node-cron
 
  urls.forEach(url => { 
    var url = url;
    exports.isUrlArchived(url, (isArchived) => {
      if (!isArchived && url.length > 0) {
        
        url = 'https://' + url;
        wget({
          url: url,
          dest: path.join(exports.paths.archivedSites, './', exports.processUrl(url) + '.html'),
          timeout: 2000
        },
        function (error, response, body) {
          if (error) {
            console.error(error);
          }
        });
      }
    });
  });
};














