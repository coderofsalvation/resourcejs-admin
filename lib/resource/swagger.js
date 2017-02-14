var _ = require('lodash')
var Resource = require('resourcejs')

module.exports = function(app, mongoose, host){

  // Define all our resources.
  var resources = app.resource

  // Get the Swagger paths and definitions for each resource.
  var paths = {}
  var definitions = {}
  _.each(resources, function(resource) {
    var swagger = resource.swagger()
    paths = _.assign(paths, swagger.paths)
    definitions = _.assign(definitions, swagger.definitions)
  })

  paths['/flush'] = {
    "get": {
      "tags": [
        "database"
      ],
      "summary": "Erases the database (only in dev-mode)",
      "description": "This operation allows you to delete ALL items to easify development & testing", 
      "responses": {
        "200": {
          "description": "Database erased succesfully.",
          "schema": {}
        },
        "401": {
          "description": "Unauthorized."
        }
      },
      "parameters": [
      ]
    }
  }

  // Define the specification.
  var specification = {
    swagger: '2.0',
    info: {
      description: '',
      version: '0.0.1',
      title: '',
      contact: {
        name: process.env.EMAIL || 'test@example.com'
      },
      license: {
        name: 'MIT',
        url: 'http://opensource.org/licenses/MIT'
      }
    },
    host: host.replace(/http:\/\//, ''), 
    basePath: '',
    schemes: ['http'],
    definitions: definitions,
    paths: paths
  }

  // Show the specification at the URL.
  app.get('/swagger', app.needHttpAuth, function(req, res, next) {
      res.json(specification)
  })

}
