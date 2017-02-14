var Resource = require('resourcejs')

module.exports = function(app, mongoose){

  // Create the schema.
  var game = new mongoose.Schema({
    games: {
      type: Array
    },
    repository: {
      type: String
    }, 
    issues:{
      type: Array, 
    },  
    owner:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }, 
    users:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }]
  });  

  var model = mongoose.model('game',  game )                         // create db model
  app.resource.game = Resource(app,  '',  'game',  game).rest()      // expose as api endpoint 
  app.resource.game.model = model                                    // attach to app for later use 

}
