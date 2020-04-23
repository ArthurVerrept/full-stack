module.exports = {
    ensureAuthenticated: function(req,res,next){
        console.log(req.body)
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg', 'Please Log In');
        res.redirect('/users/login');
    }
}
