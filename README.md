minimalistic Express.js library which turns one json-model into: mongoose models,  REST endpoints,  documentation & admin interface

![Build Status](https://travis-ci.org/coderofsalvation/resourcejs-admin..svg?branch=master)

![](https://raw.githubusercontent.com/coderofsalvation/resourcejs-admin/master/demo.gif)

## Usage

    $ npm install mongoose resourcejs-admin express

then setup your express app like so:

    var express = require('express')
    var port = process.env.PORT || 3000
    var mongoose = require('mongoose')
    var config = require('./config.json')

    mongoose.connect('mongodb://localhost/myapp'); 

    // Create a new Express application.
    app = express()

    // Setup database / rest endpoints / documentation / admin
    require('resourcejs-admin')(express, app, config, function(schema, name, config){
      // you can decorate the mongoose schema's further here
      // see : http://mongoosejs.com/docs/2.7.x/docs/schematypes.html
    })

    app.listen(port)

and `config.json` like so:

    {
      "title":"My app", 
      "logo":"/img/logo.png", 
      "users":{
        "admin": {"password":"password"}
      }, 
      "database":{
        "user":{
          "data":{
            "id": 1234, 
            "username":"johndoe", 
            "email":"john@doe.com", 
            "displayName":"John Doe", 
            "data":{}
          }, 
          "rest":["get", "post", "put", "delete", "index"]
        }, 
        "game":{
          "data":{
            "repository":"http://github.com/foo/bar", 
            "issues":[1234, 143453, 1345]
          }, 
          "rest":["get", "post", "put", "delete", "index"]
        }
      }
    }

## Features

* rest endpoints served basic on mongoose schemas (which are extracted from data in `config.json`)
* easy configurable database schema by putting data-mocks into `config.json` 
* documentation served at `/doc`
* admin panel served at `/admin`
* basic http authentication (in progress)

