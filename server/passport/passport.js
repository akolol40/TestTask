const bcrypt = require("bcryptjs");
const User = require("../model/User");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy;

passport.serializeUser((user, done) => {
    done(null, user.email);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new JWTStrategy({
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'kristik'
}, (jwtPayload, done) => {

    return User.findById(jwtPayload.sub).then(user => 
        {  
            return done(null, user)}).catch(
            err => {
                return done(err)
            }
        )
}))


passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'pwd'},
    async function(email, pwd, done) {
        await User.findOne({email: email}, function (err, user){
            if (err) {
                return done(err)
            }
            if (!user){
                return done(null, false, {message: 'That email is not registered'})
            }


            bcrypt.compare(pwd, user.pwd, (err, isMatch) => {
                if (isMatch) {  
                    
                    return done(null, user)
                } else {
                    return done(null, false, {message: 'Password incorrect'})
                }
            })
        })
    }
))

module.exports = passport;