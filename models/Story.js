const mongoose = require( 'mongoose' );
const mongooseAlgolia = require( 'mongoose-algolia' )

const StorySchema = new mongoose.Schema({
 
  image: String,
  imageId: String,

  title: {

    type: String,
    required: true,
    trim: true,
    algoliaIndex: true
   
  },

  tags: {

    type: [String],
    required: true,
    trim: true,
    algoliaIndex: true
   
  },


  body: {
    type: String,
   
  },


  status: {
    type: String,
    default: 'public',
    enum: ['public', 'private'],
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
     ref: 'User', 
    
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
} );



StorySchema.plugin(mongooseAlgolia, {
  appId: process.env.ALGOLIA_APP_ID,
  apiKey: process.env.ALGOLIA_API_KEY,
  indexName: 'juni-storybook', //The name of the index in Algolia, you can also pass in a function
  selector: '-objectId', //You can decide which field that are getting synced to Algolia (same as selector in mongoose)
  populate: {
    path: 'stories',
    select: 'objectId',
  },
  defaults: {
    imageId: 'unknown',
  },
  mappings: {
    title: function(value) {
      return value
    },
  },
 
  filter: function(doc) {
    return doc.status === "public";
  },


  debug: true, // Default: false -> If true operations are logged out in your console
} )




let StoryModel = mongoose.model( 'Story', StorySchema );


StoryModel.SyncToAlgolia() //Clears the Algolia index for this schema and synchronizes all documents to Algolia (based on the settings defined in your plugin settings)
StoryModel.SetAlgoliaSettings({
 searchableAttributes: ['title', 'tags','id'], //Sets the settings for this schema, see [Algolia's Index settings parameters](https://www.algolia.com/doc/api-client/javascript/settings#set-settings) for more info.
})

//module.exports = mongoose.model('Story', StorySchema);
module.exports = StoryModel;
