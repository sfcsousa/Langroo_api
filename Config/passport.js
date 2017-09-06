let FacebookStrategy  = require("passport-facebook").Strategy;
let configAuth       = require('config');
var url 				= configAuth.mongo.url;
var dbS 				= configAuth.mongo.db;
let mongoose 		= require('mongoose');
let conn 			= mongoose.createConnection(url+dbS);

module.exports = function(passport) {

	
  let StudentFB        = require("../Models/modelsIndex")(mongoose,conn).studentFB;		
  passport.serializeUser((user, done)=>{
    done(null, user.id);
  });

  passport.deserializeUser((id, done)=>{
    StudentFB.findById(id, function(err, user) {
            done(err, user);
        });
  });
   // =========================================================================
   // FACEBOOK ================================================================
   // =========================================================================
   passport.use(new FacebookStrategy({

       // pull in our app id and secret from our auth.js file
       clientID        : configAuth.facebookAuth.clientID,
       clientSecret    : configAuth.facebookAuth.clientSecret,
       callbackURL     : configAuth.facebookAuth.callbackURL,
       profileFields: ['id', 'displayName', 'photos', 'email', 'name','link']

   },

   // facebook will send back the token and profile
   function(token, refreshToken, profile, done) {

       // asynchronous
       process.nextTick(function() {

           // find the user in the database based on their facebook id
           StudentFB.findOne({ 'profile_id' : profile.id }, function(err, user) {

               // if there is an error, stop everything and return that
               // ie an error connecting to the database
               if (err)
                   return done(err);

               // if the user is found, then log them in
               if (user) {
                   return done(null, user); // user found, return that user
               } else {
                   // if there is no user found with that facebook id, create them
                   var newUser          = new StudentFB();

                   // set all of the facebook information in our user model
                   newUser.profile_id    = profile.id; // set the users facebook id
                   newUser.token 		   = token; // we will save the token that facebook provides to the user
                   newUser._link        = profile.link;
                   newUser.email 		   = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                   // save our user to the database
                   newUser.save(function(err) {
                       if (err)
                           throw err;

                       // if successful, return the new user
                       return done(null, newUser);
                   });
               }

           });
       });

   }));
}