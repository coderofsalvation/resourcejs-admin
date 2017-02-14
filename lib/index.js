var Resource = require('resourcejs')
var mongoose = require('mongoose')
var generate = require('generate-schema')
var auth = require('basic-auth')
var port = process.env.PORT || 3000                                                                                                                                                                                              
var host = process.env.HOST || 'http://localhost:'+port
var bodyParser = require('body-parser')

module.exports = function(express,app,config, onSchema ){ 

  // Use the json body parser.
  app.use(bodyParser.urlencoded({extended: true}))                                                                                                                                                                                 
  app.use(bodyParser.json())

  // attach simple http auth so certain endpoints can use it (/doc, /flush etc)
  app.needHttpAuth = function (req, res, next) {
    var user = auth(req)
    if (!user || !config.users[user.name] || config.users[user.name].password !== user.pass) {
      res.set('WWW-Authenticate', 'Basic realm="example"')
      return res.status(401).send()
    }
    return next()
  }

  // Use the json body parser.
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(bodyParser.json())

  function toNative(value) {
    if( value == "String"       ) return String
    if( value == "Number"       ) return Number
    if( value == "Date"         ) return Date
    if( value == "Buffer"       ) return Buffer
    if( value == "Boolean"      ) return Boolean
    if( value == "Array "       ) return Array
    if( typeof value == "object") return Object
    //if( value == "Mixed"    ) return Mixed
    //if( value == "ObjectId" ) return
    return value
  }

  // load models and expose as REST resources 
  app.resource = {}
  for ( var name in config.database  ) {
    var entity = config.database[name].data
    var schema = generate.mongoose(entity )
    for ( var k in schema ) schema[k].type = toNative(schema[k].type || schema[k])
    if( onSchema ) onSchema(schema, name, config.database[name])
    var model  = mongoose.model(name, schema)
    app.resource[name] = Resource(app, '', name, model )
    app.resource[name].model = model
    config.database[name].rest.map(function(m){ app.resource[name][m]() })
  }  

  // setup custom endpoints
  require('./resource/swagger.js' )(app,mongoose,host)
  require('./resource/flush.js')(app,mongoose,host)         

  // Use application-level middleware for common functionality, including
  // logging, parsing, and session handling.
  app.use(require('cookie-parser')())
  app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }))


  // redirect /doc
  app.use( function(req, res, next) {
    if( req.url == "/doc" ) return res.redirect("/doc/?url=/swagger#/user")
    req.version = 1
    next() 
  })

  // swagger files
  app.use( "/doc", express.static(__dirname+'/../public/doc') )   

  // setup admin
  app.use('/admin', require('mongooseadmin')({
    title:"<img src=\""+config.logo+"\" style=\"height:48px;\"/><br><br>",   
    js: '/doc/admin.js', 
    authentication: function(username,  password,  callback) {
      callback(username == 'admin' && password == config.users.admin.password )
    }    
  }))

}
