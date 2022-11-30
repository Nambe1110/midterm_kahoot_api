import passport from 'passport';
import * as passportGgOauth20 from 'passport-google-oauth20';
const GoogleStrategy = passportGgOauth20.Strategy;
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id).then(function (user) {
        done(null, user);
    }).catch(function (err) {
        console.log(err);
    })
});


passport.use(
    new GoogleStrategy({
        clientID: process.env.googleClientID,
        clientSecret: process.env.googleClientSecret,
        callbackURL: '/auth/google/callback'
    }, (profile, done) => {
        
        // Check if google profile exist.
        if (profile.id) {

            User.findOne({googleId: profile.id})
                .then((existingUser) => {
                    if (existingUser) {
                        done(null, existingUser);
                    } else {
                        new User({
                            googleId: profile.id,
                            email: profile.emails[0].value,
                            firstname: profile.name.givenName,
                            lastname: profile.name.familyName,
                            avatar: profile.photos[0].value,
                            isActivated: true
                            
                        })
                            .save()
                            .then(user => done(null, user));
                    }
                })
        }
    })
);