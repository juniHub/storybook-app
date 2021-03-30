const express = require('express');
const router = express.Router();
const stories = require('../controllers/stories');
const { ensureAuth } = require( '../middleware/auth' );
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const { storage } = require( '../cloudinary' );
const upload = multer( { storage } );


router.get('/add', ensureAuth, stories.renderNewForm)

router.route('/')
    .get(ensureAuth, catchAsync(stories.index))
    .post(ensureAuth, upload.single('image'), catchAsync(stories.createStory))


router.route('/:id')
    .get(ensureAuth, catchAsync(stories.showStory))
    .put(ensureAuth, upload.single('image'), catchAsync(stories.updateStory))
    .delete(ensureAuth, catchAsync(stories.deleteStory));


router.get('/edit/:id', ensureAuth, catchAsync(stories.renderEditForm))


router.get( '/user/:userId', ensureAuth, catchAsync( stories.userStories ))


module.exports = router;
