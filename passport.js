const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const API_URL = process.env.REACT_APP_API_URL;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${API_URL}/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
    console.log("Google Profile:", profile);
    const user =  {
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
    };
    done(null, user);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((obj, done) => {
    done(null, obj);
});