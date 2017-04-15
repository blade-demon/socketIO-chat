var moment = require('moment');

var someTimestamp = moment().valueOf();
console.log(someTimestamp);
var createdAt = someTimestamp;
var date = moment(createdAt);
console.log(date.format('MMM Do, YYYY hh:mm:kk a'));