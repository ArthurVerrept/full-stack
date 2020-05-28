const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// load user model
const User = require('../models/Users');


module.exports = function(passport){
    passport.use(
        new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
            // find one user from database
            User.findOne({ email: email})
                // pass user found into .then
                .then(user => {
                    // if no user is found in database for email
                    if(!user){
                        // returning done callback/ null for error, false for user, and message for options
                        return done(null, false, { message: 'that email is not registered' })
                    }

                    // match password being passed in and user.password which is hashed from db
                    // once comparison is done callback function with err and doesMatch boolean starts
                    bcrypt.compare(password, user.password, (err, doesMatch) =>{
                        if(err) throw err;
                        // if user passwords match
                        if(doesMatch){
                            // return done with user
                            return done(null, user);
                        } else {
                            // else return message to be use in front end with handlebars
                            return done(null, false, { message: 'password is incorrect' });
                        }
                    })
                })
                .catch(err => console.log(err))
        })
    )

    // passport serialize user
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
      
    // deserialize user to get body info
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}