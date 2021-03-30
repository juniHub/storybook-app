module.exports = {
    ensureAuth: function ( req, res, next )
    {
        if ( req.isAuthenticated() )
        {
            return next();
        } else
        {
            req.flash('error', 'You are not authorized to access this story, please sign in to explore!');
            res.redirect( '/' );
        }
    },
    ensureGuest: function ( req, res, next )
    {
        if ( !req.isAuthenticated() )
        {
            return next();
        } else
        {
            res.redirect( '/dashboard' );
        }
    },
}