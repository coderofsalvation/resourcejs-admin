var Resource = require('resourcejs')

module.exports = function(app, mongoose){

  // Create the schema.
  var user = new mongoose.Schema({
    id: { type: Number, index:{unique:true} }, 
    username:  { type: String }, 
    email: { type: String }, 
    displayName: { type: String }, 
    data: { type: Object }
  });  

  var model = mongoose.model('user',  user )                         // create db model
  app.resource.user = Resource(app,  '',  'user',  user).rest()      // expose as api endpoint 
  app.resource.user.model = model                                    // attach to app for later use 

}
