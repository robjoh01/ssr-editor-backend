"use strict"

import Strategy from "passport-google-oauth20"

const GoogleStrategy = new Strategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
    },
    function verify(accessToken, refreshToken, profile, done) {
        // TODO: Find or create user via email
        console.log(profile)
        done(null, profile)
    }
)

export { GoogleStrategy }
