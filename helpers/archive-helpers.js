var fs = require('fs');
var http = require('http');
var path = require('path');
var wget = require('node-wget');
var scraper = require('website-scraper');
var _ = require('underscore');

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
      callback(true)
    } else {
      exports.addUrlToList(url, () => {})
      callback(false)
    }
  })
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, '\n' + url, 'utf-8', function(err) {
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
      if (file === url) {
        return true;
      }
    }
    return false;
  });
};

exports.downloadUrls = function(urls) {
//wget -E -H -k -K -nd -N -p -P test \  https://www.npmjs.com/package/node-cron
  urls.forEach(url => { 
    if (!exports.isUrlArchived(url)) {
      wget({
        url: url,
        dest: path.join(exports.paths.archivedSites, './' , url),      // destination path or path with filenname, default is ./ 
        timeout: 2000       // duration to wait for request fulfillment in milliseconds, default is 2 seconds 
      },
      function (error, response, body) {
        if (error) {
          console.log('--- error:');
          console.log(error);            // error encountered 
        } else {
          // console.log('--- headers:');
          // console.log(response.headers); // response headers 
          // console.log('--- body:');
          // console.log(body);             // content of package 
        }
      }
      );
    }
  });

  // console.log(scraper);

  // var options = {
  //   urls: ['www.google.com'],
  //   directory: exports.paths.archivedSites
  // };
  
  // scraper.scrape(options).then(function (result) {
  //   console.log(result);
  // });

};














