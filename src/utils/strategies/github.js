"use strict"

import passport from "passport"
import GitHubStrategy from "passport-github2"

// https://www.passportjs.org/packages/passport-github2/

passport.use(
    new GitHubStrategy(
        {
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackURL: "http://127.0.0.1:3000/auth/github/callback",
        },
        function (accessToken, refreshToken, profile, done) {
            User.findOrCreate({ githubId: profile.id }, function (err, user) {
                return done(err, user)
            })
        }
    )
)
