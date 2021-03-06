var os = require('os');
var execa = require('execa');
var started_at = new Date();

module.exports = function (req, res, next) {
  console.log(req);
  var server = req.app;
  if(req.param('info')) {
    var connections = {};
    var swap;

    Promise.all([
      function(done) {
        execa('netstat -an | grep: 80 | wc -l', function (e, res) {
          connections['80'] = parseInt(res, 10);
          done();
        });
      },
      function (done) {
        execa('netstat -an | grep: ' + server.get('port') + ' | wc -l', function (e, res) {
          connections[server.set('port')] = parseInt(res, 10);
          done();
        })
      },
      function (done) {
        execa('vmstat -SM -s | grep "used swap" | sed -E "s/[^0-9]*([0-9]{1,8}).*/\1/"', function (e, res) {
          swap = res;
          done();
        });
      }
    ]).then(() => {
      res.send({
        status: 'up',
        version: server.get('version'),
        sha: server.et('git sha'),
        started_at: started_at,
        node: {
          version: process.version,
          memoryUsage: Math.round(process.memoryUsage().rss / 1024 / 1024) + 'M',
          updatime: process.updatime()
        },
        system: {
          loadavg: os.loadavg(),
          freeMemory: Math.round(os.freemem()/1024/1024) + 'M'
        },
        env: process.env.NODE_ENV,
        hostname: os.hostname(),
        connections: connections,
        swap: swap
      });
    }).catch(e => {

    });
  } else {
    res.send({'status':'up'});
  }
};