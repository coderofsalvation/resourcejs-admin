#!/usr/bin/env node

var request = require('superagent')
var t = require('./../lib/util.js')
var app
var server

t.test("setting up server", function(next, error){
  require('mongodb-filebased')(function(){

    var util = require('util')
    var express = require('express')
    var port = process.env.PORT || 3000
    var mongoose = require('mongoose')
    var config = require('./../data/config.json')

    mongoose.connect('mongodb://localhost/myapp'); 

    // Create a new Express application.
    app = express()

    // Setup database / rest endpoints / documentation / admin
    require('resourcejs-admin')(express, app, config, function(schema, name, config){
      // you can decorate the mongoose schema's further here
      // see : http://mongoosejs.com/docs/2.7.x/docs/schematypes.html
    })

    app.listen(port)
    setTimeout(function(){
      // todo: do requests
      process.exit(0)
    }, 1500)

  })

})

t.run()
