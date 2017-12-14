// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var CronJob = require('cron').CronJob;
var archive = require('../helpers/archive-helpers');

new CronJob('*/60 * * * * *', function() {
  console.log('Downloading new sites to archives');
  archive.readListOfUrls(archive.downloadUrls); 
}, null, true, 'America/New_York');