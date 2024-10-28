"use strict"

import Strategy from "passport-github2"

// https://www.passportjs.org/packages/passport-github2/

const GitHubStrategy = new Strategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/api/auth/social/callback/github",
    },
    function (accessToken, refreshToken, profile, done) {
        // TODO: Find or create user via email
        console.log(profile)

        done(null, profile)

        // User.findOrCreate({ githubId: profile.id }, function (err, user) {
        //     return done(err, user)
        // })
    }
)

export { GitHubStrategy }
