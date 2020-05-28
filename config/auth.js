module.exports = {
    // check user is logged in
    ensureAuthenticated: function(req,res,next){
        if(req.isAuthenticated()){
            // if logged in do next instruction
            return next();
        }
        // else redirect to home and send message
        req.flash('error_msg', 'Please Log In');
        res.redirect('/');
    }
}
