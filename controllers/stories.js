const Story = require( '../models/Story' );
const { cloudinary } = require("../cloudinary");

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// @desc    Show all stories on homepage

// @route   GET /stories
module.exports.index = async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: -1 })
      .lean();

    res.render('stories/index', {
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
}


// @desc    Show add page
// @route   GET /stories/add
module.exports.renderNewForm = (req, res) => {
  res.render('stories/add');
};

// @desc    Process add form
// @route   POST /stories
module.exports.createStory = async (req, res, next) => {
  
  req.body.user = req.user.id;
  const seed = getRandomInt( 100 );

  try
  {
    const story = new Story( req.body );
    
    if ( req.body.body === "" || req.body.body === "undefined")
    {
        req.flash( 'error', 'title and body content is required!' );
        return res.redirect( 'stories/add' );
       
     }

      if ( req.file)
      {
          story.image = req.file.path;
          story.imageId = req.file.filename;
      }

      else
      {
        
           story.image = `https://picsum.photos/300?random=${seed}`;
           story.imageId = "null";
      }
    


      await story.save();
      console.log(story)

                      
          req.flash( 'success', 'You have a new post!' );
          res.redirect( '/dashboard' );

    
                
  }  catch ( error)
  {
   
      console.log(error)
      res.render( "error/500" )
    
     }
  };
 


// @desc    Show single story
// @route   GET /stories/:id
module.exports.showStory = async (req, res) => {
  try {
    const story = await Story.findById( req.params.id ).populate( 'user' ).lean();
    
    
    if ( !story )
    {
        req.flash('error', 'Cannot find that story!');
        return res.render('error/404');
    }

    if (story.user._id != req.user.id && story.status == 'private') {
        req.flash('error', 'You are not authorized to access this story');
        return res.render('/');
    }
    
    else
    {
      res.render('stories/show', {
        story,
      });

    }
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
};

// @desc    Show edit page
// @route   GET /stories/edit/:id
module.exports.renderEditForm = async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.id,
    }).lean();

      if ( !story )
      {
        req.flash('error', 'Cannot find that story!');
        return res.render('error/404');
    }

    if (story.user != req.user.id) {
      res.redirect('/stories');
    }
    else
    {
      res.render('stories/edit', {
        story,
      });
    }
  } catch (err) {
    console.error(err);
    return res.render('error/500');
  }
};

// @desc    Update story
// @route   PUT /stories/:id
module.exports.updateStory = async ( req, res ) =>
{
 
  try
  {
    const { id } = req.params;
    let story = await Story.findById( id ).lean();

    if ( !story )
    {
      return res.render( 'error/404' );
    }

    if ( story.user != req.user.id )
    {
      res.redirect( '/stories' );
    }
   

   
    else
    {
            
      story = await Story.findByIdAndUpdate( id, req.body );
   
      console.log( story );
       await story.save();

      req.flash( 'success', 'You have just updated your post!' );
      res.redirect( '/dashboard' );
      
    }

  } catch ( err )
  {
     console.error( err );
    return res.render('error/500');
  }

}


// @desc    Delete story
// @route   DELETE /stories/:id
module.exports.deleteStory = async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.render('error/404');
    }

    if (story.user != req.user.id) {
      res.redirect('/stories');
    }
    
    else
    {
      
        await cloudinary.uploader.destroy( story.imageId );
        await Story.findByIdAndDelete( { _id: req.params.id } );
    
      req.flash('success', 'Successfully deleted story')
      res.redirect('/dashboard');
    }
  } catch (err) {
    console.error(err);
    return res.render('error/500');
  }
};

// @desc    User stories
// @route   GET /stories/user/:userId
module.exports.userStories = async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate( 'user' )
      .sort({ createdAt: -1 })
      .lean();

    res.render('stories/index', {
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
}


