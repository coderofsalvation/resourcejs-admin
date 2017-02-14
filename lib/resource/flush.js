var _ = require('lodash')
var exec = require('child_process').exec
var Resource = require('resourcejs')

module.exports = function(app, mongoose, host){

  if ( process.env.NODE_ENV != 'production' ) {
    app.get('/flush', app.needHttpAuth,  function(req, res, next) {
      function puts(error, stdout, stderr) { sys.puts(stdout) }
      exec("echo 'module.exports = {}' > mongodb.js", puts);  
      process.exit(0)
    })
  }

}
